import React, { useEffect, useState } from 'react';
import { useStatistics, useBots } from '../hooks/useAPI';
import styles from './AnalyticsDashboard.module.css';

export function AnalyticsDashboard() {
  const { statistics, loading, error, fetchStatistics } = useStatistics();
  const { bots, fetchBots } = useBots();
  const [selectedAgent, setSelectedAgent] = useState('');
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchBots();
    fetchStatistics({
      agent: selectedAgent || undefined,
      days: days
    });
  }, [selectedAgent, days, fetchStatistics, fetchBots]);

  if (loading) return <div className={styles.loading}>Loading analytics...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!statistics) return <div className={styles.noData}>No statistics available</div>;

  const passRatePercent = (statistics.pass_rate * 100).toFixed(1);

  const statCards = [
    { label: 'Total Runs', value: statistics.total_runs, className: 'primary' },
    { label: 'Pass Rate', value: `${passRatePercent}%`, className: 'success' },
    { label: 'On Target', value: statistics.on_target_count, className: 'success' },
    { label: 'Below Min', value: statistics.below_min_count || 0, className: 'warning' },
    { label: 'Above Max', value: statistics.above_max_count || 0, className: 'warning' },
    { label: 'Off Target', value: statistics.off_target_count || 0, className: 'danger' }
  ];

  return (
    <div className={styles.container}>
      <h2>Analytics Dashboard</h2>

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Filter by Agent</label>
          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
            <option value="">All Agents</option>
            {bots.map(bot => (
              <option key={bot.id} value={bot.name}>{bot.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Time Period</label>
          <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((card, idx) => (
          <div key={idx} className={`${styles.statCard} ${styles[card.className]}`}>
            <h3>{card.label}</h3>
            <p className={styles.value}>{card.value}</p>
          </div>
        ))}
      </div>

      {statistics.failures && statistics.failures.length > 0 && (
        <div className={styles.section}>
          <h3>Failed KPIs</h3>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>KPI</th>
                  <th>Failed Runs</th>
                  <th>Failure Rate</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                {statistics.failures.map((failure, idx) => {
                  const failurePercent = (failure.failure_rate * 100).toFixed(1);
                  const impact = failure.failure_rate > 0.2 ? 'High' : failure.failure_rate > 0.1 ? 'Medium' : 'Low';
                  const impactClass = impact === 'High' ? 'high' : impact === 'Medium' ? 'medium' : 'low';
                  
                  return (
                    <tr key={idx}>
                      <td>{failure.agent}</td>
                      <td>{failure.kpi}</td>
                      <td>{failure.failed_runs}</td>
                      <td>{failurePercent}%</td>
                      <td>
                        <span className={`${styles.impactBadge} ${styles[impactClass]}`}>
                          {impact}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3>Performance Summary</h3>
        <div className={styles.performanceDetails}>
          <div className={styles.detail}>
            <span className={styles.label}>Success Rate:</span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progress}
                style={{ width: `${passRatePercent}%` }}
              />
            </div>
            <span className={styles.percentage}>{passRatePercent}%</span>
          </div>
          <div className={styles.detail}>
            <span className={styles.label}>Status Distribution:</span>
            <div className={styles.distribution}>
              <div className={styles.distributionItem}>
                <span>On Target: {statistics.on_target_count}</span>
                <span className={styles.bar} style={{ 
                  backgroundColor: '#51cf66',
                  width: `${(statistics.on_target_count / statistics.total_runs) * 100}%`
                }} />
              </div>
              <div className={styles.distributionItem}>
                <span>Below Min: {statistics.below_min_count || 0}</span>
                <span className={styles.bar} style={{ 
                  backgroundColor: '#ff6b6b',
                  width: `${((statistics.below_min_count || 0) / statistics.total_runs) * 100}%`
                }} />
              </div>
              <div className={styles.distributionItem}>
                <span>Above Max: {statistics.above_max_count || 0}</span>
                <span className={styles.bar} style={{ 
                  backgroundColor: '#ffa94d',
                  width: `${((statistics.above_max_count || 0) / statistics.total_runs) * 100}%`
                }} />
              </div>
              <div className={styles.distributionItem}>
                <span>Off Target: {statistics.off_target_count || 0}</span>
                <span className={styles.bar} style={{ 
                  backgroundColor: '#ff922b',
                  width: `${((statistics.off_target_count || 0) / statistics.total_runs) * 100}%`
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
