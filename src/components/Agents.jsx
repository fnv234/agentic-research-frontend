import React from 'react';
import styles from './AgentPerspectives.module.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export function AgentPerspectives({ simulation, scenario }) {
  if (!simulation) {
    return <div className={styles.noData}>No simulation data available</div>;
  }

  const agents = simulation.agent_perspectives;

  if (!agents || agents.length === 0) {
    return <div className={styles.noData}>No agent data available</div>;
  }

  const radarData = agents.map(agent => ({
    name: agent.agent,
    priority: Math.round(agent.priority * 100),
    fullMark: 100
  }));

  return (
    <div className={styles.container}>
      <h2>Agent Personalities & Recommendations</h2>
      <p className={styles.subtitle}>How each executive agent views the {scenario} scenario</p>

      <div className={styles.section}>
        <h3>Agent Priority Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Priority" dataKey="priority" stroke="#64ff88" fill="#64ff88" fillOpacity={0.4} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.agentGrid}>
        {agents.map((agent, idx) => (
          <div key={idx} className={styles.agentCard}>
            <div className={styles.agentHeader}>
              <h3>{agent.agent}</h3>
              <span className={styles.priority}>
                {Math.round(agent.priority * 100)}%
              </span>
            </div>
            
            <div className={styles.agentInfo}>
              <div className={styles.infoRow}>
                <label>KPI Focus:</label>
                <span>{agent.kpi_focus}</span>
              </div>
              <div className={styles.infoRow}>
                <label>Target:</label>
                <span>{agent.target}</span>
              </div>
              <div className={styles.infoRow}>
                <label>Recommendation:</label>
                <span className={styles.recommendation}>{agent.recommendation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}