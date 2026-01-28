import React, { useState, useEffect } from 'react';
import { SimulationRunner } from './components/SimulationRunner';
import { DataAnalysis } from './components/DataAnalysis';
import styles from './App.module.css';

function App() {
  const [activeTab, setActiveTab] = useState('simulations');
  const [backendHealth, setBackendHealth] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(true);

  const getApiUrl = () => {
    let url;
    if (import.meta.env.VITE_API_URL) {
      url = import.meta.env.VITE_API_URL;
    } 
    return url.replace(/\/$/, '');
  };

  const apiUrl = getApiUrl();

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${apiUrl}/health`, { mode: 'cors' });
      setBackendHealth(response.ok);
    } catch (err) {
      console.error('Backend health check failed:', err);
      setBackendHealth(false);
    } finally {
      setCheckingHealth(false);
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.branding}>
            <h1>Agentic Research Dashboard</h1>
            <p>Multi-Agent Cyber Risk Simulation & Analysis</p>
          </div>
          
          <div className={styles.healthStatus}>
            {checkingHealth ? (
              <span className={styles.checking}>Checking backend...</span>
            ) : backendHealth ? (
              <span className={styles.healthy}>Backend Connected</span>
            ) : (
              <span className={styles.unhealthy}>Backend Offline</span>
            )}
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navBtn} ${activeTab === 'simulations' ? styles.active : ''}`}
            onClick={() => setActiveTab('simulations')}
          >
            Simulations
          </button>
          {/* <button
            className={`${styles.navBtn} ${activeTab === 'data' ? styles.active : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Data Analysis
          </button> */}
        </nav>
      </header>

      <main className={styles.main}>
        {!backendHealth && !checkingHealth && (
          <div className={styles.warningBanner}>
            <strong>Backend Connection Failed</strong> - The API server is not responding. 
            Make sure the backend is running on {import.meta.env.VITE_API_URL}
          </div>
        )}
        <div className={styles.content}>
          {activeTab === 'simulations' && <SimulationRunner />}
          {activeTab === 'data' && <DataAnalysis />}
        </div>
      </main>
    </div>
  );
}

export default App;
