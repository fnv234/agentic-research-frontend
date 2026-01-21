import React, { useEffect, useState } from 'react';
import { useThresholds, useBots } from '../hooks/useAPI';
import styles from './ThresholdManager.module.css';

export function ThresholdManager() {
  const { thresholds, loading, error, fetchThresholds, createThreshold, updateThreshold, deleteThreshold } = useThresholds();
  const { bots, fetchBots } = useBots();
  const [selectedAgent, setSelectedAgent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    agent_name: '',
    kpi_name: '',
    min_value: '',
    target_value: '',
    max_value: '',
    description: ''
  });
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchBots();
    fetchThresholds(selectedAgent);
  }, [selectedAgent, fetchThresholds, fetchBots]);

  const resetForm = () => {
    setFormData({
      agent_name: '',
      kpi_name: '',
      min_value: '',
      target_value: '',
      max_value: '',
      description: ''
    });
    setEditingId(null);
    setSubmitMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');

    const submitData = {
      ...formData,
      min_value: parseFloat(formData.min_value),
      target_value: parseFloat(formData.target_value),
      max_value: parseFloat(formData.max_value)
    };

    let result;
    if (editingId) {
      result = await updateThreshold(editingId, submitData);
    } else {
      result = await createThreshold(submitData);
    }
    
    if (result.success) {
      setSubmitMessage(editingId ? 'Threshold updated successfully!' : 'Threshold created successfully!');
      resetForm();
      setTimeout(() => setSubmitMessage(''), 3000);
    } else {
      setSubmitMessage(`Error: ${result.error || 'Operation failed'}`);
    }
  };

  const handleEdit = (threshold) => {
    setFormData({
      agent_name: threshold.agent_name,
      kpi_name: threshold.kpi_name,
      min_value: threshold.min_value,
      target_value: threshold.target_value,
      max_value: threshold.max_value,
      description: threshold.description
    });
    setEditingId(threshold._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this threshold?')) {
      const result = await deleteThreshold(id);
      if (result.success) {
        setSubmitMessage('Threshold deleted successfully!');
        setTimeout(() => setSubmitMessage(''), 3000);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Threshold Management</h2>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <h3>{editingId ? 'Edit Threshold' : 'Create New Threshold'}</h3>
          
          {error && <div className={styles.error}>{error}</div>}
          {submitMessage && (
            <div className={submitMessage.includes('Error') ? styles.error : styles.success}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Agent Name *</label>
              <select
                name="agent_name"
                value={formData.agent_name}
                onChange={handleChange}
                required
              >
                <option value="">Select an agent...</option>
                {bots.map(bot => (
                  <option key={bot.id} value={bot.name}>{bot.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>KPI Name *</label>
              <input
                type="text"
                name="kpi_name"
                placeholder="e.g., accumulated_profit, market_share"
                value={formData.kpi_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Minimum Value *</label>
                <input
                  type="number"
                  step="0.01"
                  name="min_value"
                  value={formData.min_value}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Target Value *</label>
                <input
                  type="number"
                  step="0.01"
                  name="target_value"
                  value={formData.target_value}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Maximum Value *</label>
                <input
                  type="number"
                  step="0.01"
                  name="max_value"
                  value={formData.max_value}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Optional description for this threshold"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className={styles.formButtons}>
              <button type="submit" className={styles.submitBtn}>
                {editingId ? 'Update Threshold' : 'Create Threshold'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className={styles.listSection}>
          <div className={styles.listHeader}>
            <h3>Thresholds</h3>
            <div className={styles.filterGroup}>
              <label>Filter by Agent</label>
              <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
                <option value="">All Agents</option>
                {bots.map(bot => (
                  <option key={bot.id} value={bot.name}>{bot.name}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p className={styles.loading}>Loading thresholds...</p>
          ) : thresholds.length === 0 ? (
            <p className={styles.noData}>No thresholds found</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>KPI</th>
                    <th>Min</th>
                    <th>Target</th>
                    <th>Max</th>
                    <th>Description</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {thresholds.map(threshold => (
                    <tr key={threshold._id}>
                      <td>{threshold.agent_name}</td>
                      <td>{threshold.kpi_name}</td>
                      <td>{threshold.min_value.toLocaleString()}</td>
                      <td>
                        <span className={styles.targetValue}>{threshold.target_value.toLocaleString()}</span>
                      </td>
                      <td>{threshold.max_value.toLocaleString()}</td>
                      <td>{threshold.description || '-'}</td>
                      <td className={styles.date}>
                        {new Date(threshold.created_at).toLocaleDateString()}
                      </td>
                      <td className={styles.actions}>
                        <button 
                          onClick={() => handleEdit(threshold)}
                          className={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(threshold._id)}
                          className={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
