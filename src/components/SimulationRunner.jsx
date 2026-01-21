import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useScenarios, useSimulator } from '../hooks/useAPI';
import styles from './SimulationRunner.module.css';
import { AgentPerspectives } from './Agents';

export function SimulationRunner() {
  const { scenarios, loading: scenariosLoading, fetchScenarios } = useScenarios();
  const { simulations, currentSimulation, loading: simLoading, runSimulation } = useSimulator();
  
  const [selectedScenario, setSelectedScenario] = useState('');
  const [collaboration, setCollaboration] = useState('collaborative');
  const [riskTolerance, setRiskTolerance] = useState(0.5);
  const [numYears, setNumYears] = useState(5);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  useEffect(() => {
    if (scenarios.length > 0 && !selectedScenario) {
      setSelectedScenario(scenarios[0].id);
    }
  }, [scenarios, selectedScenario]);

  const handleRunSimulation = async () => {
    if (!selectedScenario) {
      alert('Please select a scenario');
      return;
    }

    await runSimulation({
      scenario: selectedScenario,
      agent_collaboration: collaboration,
      risk_tolerance: parseFloat(riskTolerance),
      num_years: numYears
    });
  };

  if (scenariosLoading) return <div className={styles.loading}>Loading scenarios...</div>;

  return (
    <div className={styles.container}>
      <h2>Multi-Agent Simulation Runner</h2>
      
      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <label>Scenario</label>
          <select value={selectedScenario} onChange={(e) => setSelectedScenario(e.target.value)}>
            <option value="">-- Select Scenario --</option>
            {scenarios.map(scenario => (
              <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
            ))}
          </select>
          {selectedScenario && (
            <p className={styles.description}>
              {scenarios.find(s => s.id === selectedScenario)?.description}
            </p>
          )}
        </div>

        <div className={styles.controlGroup}>
          <label>Agent Collaboration</label>
          <select value={collaboration} onChange={(e) => setCollaboration(e.target.value)}>
            <option value="collaborative">Collaborative (High Ambition)</option>
            <option value="uncollaborative">Uncollaborative (Low Ambition)</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label>Risk Tolerance: {(riskTolerance * 100).toFixed(0)}%</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(parseFloat(e.target.value))}
          />
          <small>0% = Risk-Averse, 100% = Risk-Seeking</small>
        </div>

        <div className={styles.controlGroup}>
          <label>Time Period</label>
          <select value={numYears} onChange={(e) => setNumYears(parseInt(e.target.value))}>
            <option value={1}>1 Year</option>
            <option value={3}>3 Years</option>
            <option value={5}>5 Years</option>
            <option value={10}>10 Years</option>
          </select>
        </div>

        <button 
          className={styles.runBtn} 
          onClick={handleRunSimulation}
          disabled={simLoading || !selectedScenario}
        >
          {simLoading ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      {currentSimulation && (
        <div className={styles.resultsContainer}>
          
          <h3>Simulation Results</h3>
          
          <div className={styles.summaryCards}>
            <div className={styles.card}>
              <h4>Final Accumulated Profit</h4>
              <p className={styles.value}>
                ${(currentSimulation.results.summary.final_profit / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className={styles.card}>
              <h4>Systems at Risk (Final)</h4>
              <p className={styles.value}>
                {currentSimulation.results.summary.final_risk.toFixed(0)}
              </p>
            </div>
            <div className={styles.card}>
              <h4>Avg Systems Availability</h4>
              <p className={styles.value}>
                {(currentSimulation.results.summary.avg_availability * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h4>Accumulated Profit Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentSimulation.results.time_series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(2)}M`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accumulated_profit" 
                  stroke="#8884d8" 
                  name="Accumulated Profit"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartContainer}>
            <h4>Systems at Risk Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentSimulation.results.time_series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Systems at Risk', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="systems_at_risk" 
                  stroke="#82ca9d" 
                  name="Systems at Risk"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartContainer}>
            <h4>Systems Availability Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentSimulation.results.time_series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Availability (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="systems_availability" 
                  stroke="#ffc658" 
                  name="Availability"
                  isAnimationActive={false}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {currentSimulation.results.agent_perspectives && currentSimulation.results.agent_perspectives.length > 0 ? (
            <AgentPerspectives 
              simulation={currentSimulation.results} 
              scenario={selectedScenario}
            />
          ) : (
            <div className={styles.noData}>No agent data available</div>
          )}

          <div className={styles.parametersBox}>
            <h4>Simulation Parameters</h4>
            <p><strong>Scenario:</strong> {currentSimulation.parameters.scenario}</p>
            <p><strong>Agent Collaboration:</strong> {currentSimulation.parameters.agent_collaboration}</p>
            <p><strong>Risk Tolerance:</strong> {(currentSimulation.parameters.risk_tolerance * 100).toFixed(0)}%</p>
            <p><strong>Time Period:</strong> {currentSimulation.parameters.num_years} years</p>
          </div>
        </div>
      )}

      {simulations.length > 1 && (
        <div className={styles.historyContainer}>
          <h3>Simulation History</h3>
          <div className={styles.simList}>
            {simulations.map((sim, idx) => (
              <div 
                key={idx} 
                className={`${styles.simItem} ${currentSimulation?.simulation_id === sim.simulation_id ? styles.active : ''}`}
              >
                <strong>{sim.parameters.scenario}</strong>
                <small>{sim.parameters.agent_collaboration}</small>
                <small>Final Profit: ${(sim.results.summary.final_profit / 1000000).toFixed(2)}M</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
