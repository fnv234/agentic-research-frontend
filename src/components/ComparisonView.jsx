import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSimulator } from '../hooks/useAPI';
import styles from './ComparisonView.module.css';

export function ComparisonView() {
  const { simulations, runSimulation } = useSimulator();
  const [realData, setRealData] = useState(null);
  const [selectedSim, setSelectedSim] = useState(null);
  const [comparisonMetrics, setComparisonMetrics] = useState(null);

  useEffect(() => {
    // Load real data from CSV
    loadRealData();
  }, []);

  const loadRealData = async () => {
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/api/runs/real`);
      if (response.ok) {
        const data = await response.json();
        setRealData(data.data || []);
      }
    } catch (err) {
      console.error('Error loading real data:', err);
    }
  };

  const handleRunSimulation = async () => {
    const newSim = await runSimulation({
      scenario: 'simple_deterministic',
      agent_collaboration: 'collaborative',
      risk_tolerance: 0.5,
      num_years: 5
    });
    
    if (newSim && selectedSim === null) {
      setSelectedSim(newSim);
      calculateComparison(newSim);
    }
  };

  const calculateComparison = (simulation) => {
    if (!realData || realData.length === 0) return;

    // Get average metrics from real data
    const avgReal = {
      profit: realData.reduce((sum, d) => sum + (d.accumulated_profit || 0), 0) / realData.length,
      risk: realData.reduce((sum, d) => sum + (d.compromised_systems || 0), 0) / realData.length,
      availability: realData.reduce((sum, d) => sum + (d.systems_availability || 0.95), 0) / realData.length
    };

    // Get metrics from simulation
    const simData = simulation.results.summary;
    const simMetrics = simulation.results.time_series;

    const metrics = {
      profit: {
        real: avgReal.profit,
        simulated: simData.final_profit,
        variance: simData.final_profit - avgReal.profit,
        variancePercent: ((simData.final_profit - avgReal.profit) / avgReal.profit * 100)
      },
      risk: {
        real: avgReal.risk,
        simulated: simData.final_risk,
        variance: simData.final_risk - avgReal.risk,
        variancePercent: ((simData.final_risk - avgReal.risk) / avgReal.risk * 100)
      },
      availability: {
        real: avgReal.availability,
        simulated: simData.avg_availability,
        variance: simData.avg_availability - avgReal.availability,
        variancePercent: ((simData.avg_availability - avgReal.availability) / avgReal.availability * 100)
      }
    };

    setComparisonMetrics({
      ...metrics,
      timeSeries: simMetrics,
      realAvg: avgReal
    });
  };

  const handleSelectSimulation = (sim) => {
    setSelectedSim(sim);
    calculateComparison(sim);
  };

  const comparisonChartData = [
    {
      name: 'Profit',
      real: comparisonMetrics?.profit.real / 1000000 || 0,
      simulated: comparisonMetrics?.profit.simulated / 1000000 || 0
    },
    {
      name: 'Risk',
      real: comparisonMetrics?.risk.real || 0,
      simulated: comparisonMetrics?.risk.simulated || 0
    },
    {
      name: 'Availability',
      real: (comparisonMetrics?.availability.real * 100) || 0,
      simulated: (comparisonMetrics?.availability.simulated * 100) || 0
    }
  ];

  return (
    <div className={styles.container}>
      <h2>Simulations vs Real Data Comparison</h2>
      
      <div className={styles.controlPanel}>
        <button onClick={handleRunSimulation} className={styles.runBtn}>
          ▶ Run New Simulation
        </button>
      </div>

      {realData && (
        <div className={styles.dataSourceInfo}>
          <p>📊 Real Data: <strong>{realData.length} runs</strong> from sim_data.csv</p>
          {realData.length > 0 && (
            <p>
              Avg Profit: ${(realData.reduce((sum, d) => sum + (d.accumulated_profit || 0), 0) / realData.length / 1000000).toFixed(2)}M | 
              Avg Risk: {(realData.reduce((sum, d) => sum + (d.compromised_systems || 0), 0) / realData.length).toFixed(1)} systems
            </p>
          )}
        </div>
      )}

      <div className={styles.simulationsSection}>
        <h3>Simulation Runs</h3>
        {simulations.length === 0 ? (
          <p className={styles.noData}>No simulations run yet. Click "Run New Simulation" to start.</p>
        ) : (
          <div className={styles.simList}>
            {simulations.map((sim, idx) => (
              <div 
                key={idx}
                className={`${styles.simItem} ${selectedSim?.simulation_id === sim.simulation_id ? styles.active : ''}`}
                onClick={() => handleSelectSimulation(sim)}
              >
                <strong>{sim.parameters.scenario}</strong>
                <small>{sim.parameters.agent_collaboration}</small>
                <small>Profit: ${(sim.results.summary.final_profit / 1000000).toFixed(2)}M</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {comparisonMetrics && selectedSim && (
        <div className={styles.comparisonSection}>
          <h3>Detailed Comparison: {selectedSim.parameters.scenario}</h3>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <h4>Accumulated Profit</h4>
              <div className={styles.comparison}>
                <div className={styles.metricValue}>
                  <label>Real Avg</label>
                  <p>${(comparisonMetrics.profit.real / 1000000).toFixed(2)}M</p>
                </div>
                <div className={styles.metricValue}>
                  <label>Simulated</label>
                  <p>${(comparisonMetrics.profit.simulated / 1000000).toFixed(2)}M</p>
                </div>
                <div className={`${styles.metricValue} ${comparisonMetrics.profit.variance >= 0 ? styles.positive : styles.negative}`}>
                  <label>Variance</label>
                  <p>{comparisonMetrics.profit.variancePercent > 0 ? '+' : ''}{comparisonMetrics.profit.variancePercent.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <h4>Systems at Risk</h4>
              <div className={styles.comparison}>
                <div className={styles.metricValue}>
                  <label>Real Avg</label>
                  <p>{comparisonMetrics.risk.real.toFixed(1)}</p>
                </div>
                <div className={styles.metricValue}>
                  <label>Simulated</label>
                  <p>{comparisonMetrics.risk.simulated.toFixed(1)}</p>
                </div>
                <div className={`${styles.metricValue} ${comparisonMetrics.risk.variance <= 0 ? styles.positive : styles.negative}`}>
                  <label>Variance</label>
                  <p>{comparisonMetrics.risk.variancePercent > 0 ? '+' : ''}{comparisonMetrics.risk.variancePercent.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <h4>Systems Availability</h4>
              <div className={styles.comparison}>
                <div className={styles.metricValue}>
                  <label>Real Avg</label>
                  <p>{(comparisonMetrics.availability.real * 100).toFixed(1)}%</p>
                </div>
                <div className={styles.metricValue}>
                  <label>Simulated</label>
                  <p>{(comparisonMetrics.availability.simulated * 100).toFixed(1)}%</p>
                </div>
                <div className={`${styles.metricValue} ${comparisonMetrics.availability.variance >= 0 ? styles.positive : styles.negative}`}>
                  <label>Variance</label>
                  <p>{comparisonMetrics.availability.variancePercent > 0 ? '+' : ''}{comparisonMetrics.availability.variancePercent.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.chartSection}>
            <h4>Key Metrics Comparison</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="real" fill="#64ff88" name="Real Data Avg" />
                <Bar yAxisId="left" dataKey="simulated" fill="#4d8cff" name="Simulation" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartSection}>
            <h4>Simulation Trajectory Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comparisonMetrics.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" label={{ value: 'Profit ($M)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Risk', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="accumulated_profit" stroke="#64ff88" name="Profit" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="systems_at_risk" stroke="#ff7300" name="Risk" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.parametersBox}>
            <h4>Simulation Configuration</h4>
            <p><strong>Scenario:</strong> {selectedSim.parameters.scenario}</p>
            <p><strong>Agent Collaboration:</strong> {selectedSim.parameters.agent_collaboration}</p>
            <p><strong>Risk Tolerance:</strong> {(selectedSim.parameters.risk_tolerance * 100).toFixed(0)}%</p>
            <p><strong>Time Period:</strong> {selectedSim.parameters.num_years} years</p>
            {selectedSim.results.summary.data_source && (
              <p><strong>Data Source:</strong> {selectedSim.results.summary.data_source}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
