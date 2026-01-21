import React from 'react';
import styles from './AgentPerspectives.module.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export function AgentPerspectives({ simulation, scenario }) {
  if (!simulation || !simulation.agent_perspectives || simulation.agent_perspectives.length === 0) {
    return <div className={styles.noData}>No agent data available</div>;
  }

  const agents = simulation.agent_perspectives;

  const radarData = agents.map(agent => ({
    name: agent.agent,
    priority: (agent.priority * 100).toFixed(1),
    fullMark: 100
  }));

  const kpiData = agents.map(agent => ({
    name: agent.agent,
    priority: (agent.priority * 100).toFixed(1)
  }));

  return (
    <div className={styles.container}>
      <h2>🤖 Agent Personalities & Recommendations</h2>
      <p className={styles.subtitle}>How each executive agent views the {scenario} scenario</p>

      <div className={styles.section}>
        <h3>Agent Priority Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Priority" dataKey="priority" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
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
                Priority: {(agent.priority * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className={styles.agentInfo}>
              <div className={styles.infoRow}>
                <label>Role:</label>
                <span>{agent.agent}</span>
              </div>
              <div className={styles.infoRow}>
                <label>KPI Focus:</label>
                <span>{agent.kpi_focus}</span>
              </div>
              <div className={styles.infoRow}>
                <label>Target:</label>
                <span>{agent.target}</span>
              </div>
              <div className={styles.infoRow}>
                <label>Personality:</label>
                <span>{JSON.stringify(agent.personality)}</span>
              </div>
              <div className={styles.infoRow}>
                <label>Recommendation:</label>
                <span className={styles.recommendation}>{agent.recommendation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {simulation.agent_feedback && (
        <div className={styles.section}>
          <h3>Board Feedback</h3>
          <div className={styles.feedback}>
            {typeof simulation.agent_feedback === 'string' 
              ? <p>{simulation.agent_feedback}</p>
              : <pre>{JSON.stringify(simulation.agent_feedback, null, 2)}</pre>
            }
          </div>
        </div>
      )}

      {simulation.agent_recommendations && simulation.agent_recommendations.length > 0 && (
        <div className={styles.section}>
          <h3>Negotiated Strategy Recommendations</h3>
          <ul className={styles.recommendations}>
            {simulation.agent_recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}