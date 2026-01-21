import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './DataAnalysis.module.css';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');

export function DataAnalysis() {
  const [realData, setRealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterRansomware, setFilterRansomware] = useState('all');
  const [filterPayRansom, setFilterPayRansom] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadRealData();
  }, []);

  useEffect(() => {
    if (realData) {
      analyzeData();
    }
  }, [filterLevel, filterRansomware, filterPayRansom, realData]);

  const loadRealData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/runs/real`);
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        console.log('Data count:', data.data?.length);
        setRealData(data.data || []);
      } else {
        setError('Failed to load real data');
      }
    } catch (err) {
      console.error('Error loading real data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeData = () => {
    console.log('analyzeData called with:', { realDataLength: realData?.length, filterLevel, filterRansomware, filterPayRansom });
    if (!realData || realData.length === 0) {
      console.log('No data to analyze');
      return;
    }

    console.log('First data item:', realData[0]);

    let filtered = realData;

    // Apply filters
    if (filterLevel !== 'all') {
      filtered = filtered.filter(r => r.Level === parseInt(filterLevel));
    }
    if (filterRansomware !== 'all') {
      filtered = filtered.filter(r => r.Ransomware === parseInt(filterRansomware));
    }
    if (filterPayRansom !== 'all') {
      filtered = filtered.filter(r => r['Pay Ransom'] === parseInt(filterPayRansom));
    }

    console.log(`Filtered to ${filtered.length} items from ${realData.length}`);

    if (filtered.length === 0) {
      console.log('No data after filtering');
      setStats(null);
      return;
    }

    // Parse profit values (they're strings with commas)
    const profits = filtered.map(r => {
      const p = r['Cum. Profits'];
      if (typeof p === 'string') {
        return parseInt(p.replace(/,/g, '')) || 0;
      }
      return p || 0;
    });

    const risks = filtered.map(r => r['Comp. Systems'] || 0);
    const months = filtered.map(r => r['Months Completed'] || 0);

    // Calculate stats
    const statsData = {
      count: filtered.length,
      profit: {
        avg: profits.reduce((a, b) => a + b, 0) / profits.length,
        min: Math.min(...profits),
        max: Math.max(...profits),
        median: [...profits].sort((a, b) => a - b)[Math.floor(profits.length / 2)]
      },
      risk: {
        avg: risks.reduce((a, b) => a + b, 0) / risks.length,
        min: Math.min(...risks),
        max: Math.max(...risks),
        median: [...risks].sort((a, b) => a - b)[Math.floor(risks.length / 2)]
      },
      months: {
        avg: months.reduce((a, b) => a + b, 0) / months.length,
        min: Math.min(...months),
        max: Math.max(...months)
      },
      data: filtered
    };

    // Analyze by decisions
    const byLevel = {};
    const byRansomware = {};
    const byPayRansom = {};

    filtered.forEach((run, idx) => {
      const prof = profits[idx] || 0;
      const risk = run['Comp. Systems'] || 0;

      // By Level
      if (!byLevel[run.Level]) byLevel[run.Level] = { profits: [], risks: [], count: 0 };
      byLevel[run.Level].profits.push(prof);
      byLevel[run.Level].risks.push(risk);
      byLevel[run.Level].count++;

      // By Ransomware
      if (!byRansomware[run.Ransomware]) byRansomware[run.Ransomware] = { profits: [], risks: [], count: 0 };
      byRansomware[run.Ransomware].profits.push(prof);
      byRansomware[run.Ransomware].risks.push(risk);
      byRansomware[run.Ransomware].count++;

      // By Pay Ransom
      if (!byPayRansom[run['Pay Ransom']]) byPayRansom[run['Pay Ransom']] = { profits: [], risks: [], count: 0 };
      byPayRansom[run['Pay Ransom']].profits.push(prof);
      byPayRansom[run['Pay Ransom']].risks.push(risk);
      byPayRansom[run['Pay Ransom']].count++;
    });

    // Format for charts
    const levelComparison = Object.entries(byLevel).map(([level, data]) => ({
      name: `Level ${level}`,
      avgProfit: data.profits.reduce((a, b) => a + b, 0) / data.profits.length,
      avgRisk: data.risks.reduce((a, b) => a + b, 0) / data.risks.length,
      count: data.count
    }));

    const ransomwareComparison = Object.entries(byRansomware).map(([flag, data]) => ({
      name: flag === '1' ? 'Ransomware Attack' : 'No Attack',
      avgProfit: data.profits.reduce((a, b) => a + b, 0) / data.profits.length,
      avgRisk: data.risks.reduce((a, b) => a + b, 0) / data.risks.length,
      count: data.count
    }));

    const payRansomComparison = Object.entries(byPayRansom).map(([flag, data]) => ({
      name: flag === '1' ? 'Paid Ransom' : 'Did Not Pay',
      avgProfit: data.profits.reduce((a, b) => a + b, 0) / data.profits.length,
      avgRisk: data.risks.reduce((a, b) => a + b, 0) / data.risks.length,
      count: data.count
    }));

    // Distribution data
    const profitDistribution = [
      { range: '$0-1K', count: profits.filter(p => p >= 0 && p < 1000).length },
      { range: '$1K-2K', count: profits.filter(p => p >= 1000 && p < 2000).length },
      { range: '$2K-3K', count: profits.filter(p => p >= 2000 && p < 3000).length },
      { range: '$3K+', count: profits.filter(p => p >= 3000).length }
    ];

    statsData.levelComparison = levelComparison;
    statsData.ransomwareComparison = ransomwareComparison;
    statsData.payRansomComparison = payRansomComparison;
    statsData.profitDistribution = profitDistribution;

    console.log('Setting stats:', statsData);
    setStats(statsData);
  };

  if (loading) return <div className={styles.loading}>Loading real player data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!realData) return <div className={styles.noData}>No data available</div>;

  const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'];

  return (
    <div className={styles.container}>
      <h2>📊 Real Player Data Analysis</h2>
      <p className={styles.subtitle}>How real players made decisions and what happened to their profits/risk</p>

      {/* Filters */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Difficulty Level:</label>
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
            <option value="all">All Levels ({realData.length} runs)</option>
            <option value="1">Level 1 (Easier)</option>
            <option value="2">Level 2 (Harder)</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Ransomware Incident:</label>
          <select value={filterRansomware} onChange={(e) => setFilterRansomware(e.target.value)}>
            <option value="all">All Scenarios</option>
            <option value="0">No Attack</option>
            <option value="1">Ransomware Attack Occurred</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Ransom Decision:</label>
          <select value={filterPayRansom} onChange={(e) => setFilterPayRansom(e.target.value)}>
            <option value="all">All Decisions</option>
            <option value="0">Did Not Pay Ransom</option>
            <option value="1">Paid Ransom</option>
          </select>
        </div>
      </div>

      {stats && (
        <>
          {/* Summary Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h4>Average Profit</h4>
              <div className={styles.metricValue}>${(stats.profit.avg / 1000).toFixed(1)}K</div>
              <div className={styles.statDetail}>Min: ${(stats.profit.min / 1000).toFixed(0)}K | Max: ${(stats.profit.max / 1000).toFixed(0)}K</div>
            </div>

            <div className={styles.statCard}>
              <h4>Average Risk (Compromised Systems)</h4>
              <div className={styles.metricValue}>{stats.risk.avg.toFixed(1)}</div>
              <div className={styles.statDetail}>Min: {stats.risk.min} | Max: {stats.risk.max}</div>
            </div>

            <div className={styles.statCard}>
              <h4>Average Months Played</h4>
              <div className={styles.metricValue}>{stats.months.avg.toFixed(0)}</div>
              <div className={styles.statDetail}>Out of 60 months</div>
            </div>

            <div className={styles.statCard}>
              <h4>Sample Size</h4>
              <div className={styles.metricValue}>{stats.count}</div>
              <div className={styles.statDetail}>player runs matching filters</div>
            </div>
          </div>

          {/* Level Comparison */}
          <div className={styles.chartSection}>
            <h4>📈 Impact of Difficulty Level</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.levelComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" label={{ value: 'Avg Profit ($)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Avg Risk', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="avgProfit" fill="#3498db" name="Avg Profit ($)" />
                <Bar yAxisId="right" dataKey="avgRisk" fill="#e74c3c" name="Avg Compromised Systems" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ransomware Decision Impact */}
          <div className={styles.chartSection}>
            <h4>🔒 Impact of Ransomware Attacks</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.ransomwareComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" label={{ value: 'Avg Profit ($)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Avg Systems Compromised', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="avgProfit" fill="#2ecc71" name="Avg Profit ($)" />
                <Bar yAxisId="right" dataKey="avgRisk" fill="#e74c3c" name="Avg Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ransom Payment Decision */}
          <div className={styles.chartSection}>
            <h4>💰 Impact of Paying Ransom</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.payRansomComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" label={{ value: 'Avg Profit ($)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Avg Risk', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="avgProfit" fill="#f39c12" name="Avg Profit ($)" />
                <Bar yAxisId="right" dataKey="avgRisk" fill="#e74c3c" name="Avg Risk" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Distribution */}
          <div className={styles.chartSection}>
            <h4>📊 Profit Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.profitDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis label={{ value: 'Number of Runs', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3498db">
                  {stats.profitDistribution.map((entry, index) => (
                    <Bar key={index} dataKey="count" fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.infoBox}>
            <h4>🎯 What This Shows</h4>
            <p>
              This tab visualizes how real players performed in different scenarios. Use the filters 
              to see how specific decisions (difficulty, ransomware response) impacted profits and risk. 
              Compare these outcomes with the multi-agent bot decisions in the Simulations tab.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
