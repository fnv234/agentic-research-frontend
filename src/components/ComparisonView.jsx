import React, { useEffect, useState } from 'react';
import { useSimulations } from '../hooks/useAPI';
import styles from './ComparisonView.module.css';

export function ComparisonView() {
  const { runs, realData, loading, error, fetchRuns, fetchRealData, compareSimulation } = useSimulations();
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    fetchRuns();
    fetchRealData();
  }, [fetchRuns, fetchRealData]);

  const handleCompare = async (runId) => {
    setSelectedRunId(runId);
    setComparing(true);
    const result = await compareSimulation(runId);
    setComparisonData(result);
    setComparing(false);
  };

  const renderVarianceCell = (variance, variancePercent) => {
    if (!variance) return <span>-</span>;
    
    const isNegative = variance < 0;
    const className = isNegative ? styles.negative : styles.positive;
    
    return (
      <span className={className}>
        {isNegative ? '▼' : '▲'} {Math.abs(variancePercent).toFixed(2)}%
      </span>
    );
  };

  if (loading) return <div className={styles.loading}>Loading simulation data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Simulation vs Real Data Comparison</h2>
      
      <div className={styles.section}>
        <h3>Select Simulation to Compare</h3>
        {runs.length === 0 ? (
          <p>No simulation runs available</p>
        ) : (
          <div className={styles.runList}>
            {runs.map(run => (
              <div 
                key={run.id}
                className={`${styles.runCard} ${selectedRunId === run.id ? styles.selected : ''}`}
              >
                <h4>{run.name}</h4>
                <p className={styles.timestamp}>
                  {new Date(run.timestamp).toLocaleDateString()}
                </p>
                <p className={styles.status}>Status: <strong>{run.status}</strong></p>
                <button 
                  onClick={() => handleCompare(run.id)}
                  disabled={comparing}
                >
                  {comparing && selectedRunId === run.id ? 'Comparing...' : 'Compare'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {comparisonData && (
        <div className={styles.section}>
          <h3>Comparison Results - {comparisonData.simulation_id}</h3>
          
          {Object.entries(comparisonData.agents || {}).map(([agentName, kpis]) => (
            <div key={agentName} className={styles.agentComparison}>
              <h4>{agentName}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Simulated</th>
                    <th>Real</th>
                    <th>Variance</th>
                    <th>Variance %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(kpis).map(([kpiName, values]) => (
                    <tr key={kpiName}>
                      <td>{kpiName}</td>
                      <td>{typeof values.simulated === 'number' ? values.simulated.toLocaleString() : values.simulated}</td>
                      <td>{typeof values.real === 'number' ? values.real.toLocaleString() : values.real}</td>
                      <td>{values.variance?.toLocaleString()}</td>
                      <td>{renderVarianceCell(values.variance, values.variance_percent)}</td>
                      <td>
                        <span className={styles[values.status?.toLowerCase()]}>
                          {values.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {realData && (
        <div className={styles.section}>
          <h3>Current Real Data</h3>
          <p className={styles.timestamp}>
            Last updated: {new Date(realData.timestamp).toLocaleString()}
          </p>
          
          {Object.entries(realData.agents || {}).map(([agentName, metrics]) => (
            <div key={agentName} className={styles.realDataCard}>
              <h4>{agentName}</h4>
              <div className={styles.metricsGrid}>
                {Object.entries(metrics).map(([metricName, value]) => (
                  <div key={metricName} className={styles.metric}>
                    <span className={styles.label}>{metricName}</span>
                    <span className={styles.value}>
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
