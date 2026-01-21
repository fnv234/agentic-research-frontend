import React, { useState, useEffect } from 'react';
import { ComparisonView } from './components/ComparisonView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ThresholdManager } from './components/ThresholdManager';
import { SimulationRunner } from './components/SimulationRunner';
import styles from './App.module.css';

function App() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [backendHealth, setBackendHealth] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(true);

  // Determine API URL based on environment
  const getApiUrl = () => {
    let url;
    if (import.meta.env.VITE_API_URL) {
      url = import.meta.env.VITE_API_URL;
    } else if (window.location.hostname === 'agentic-research-frontend.onrender.com') {
      url = 'https://agentic-research-backend.onrender.com';
    } else {
      url = 'http://localhost:5001';
    }
    // Remove trailing slash to prevent double slashes in URLs
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
            <h1>🤖 Agentic Research Dashboard</h1>
            <p>Bot Comparison & Analytics Platform</p>
          </div>
          
          <div className={styles.healthStatus}>
            {checkingHealth ? (
              <span className={styles.checking}>Checking backend...</span>
            ) : backendHealth ? (
              <span className={styles.healthy}>✓ Backend Connected</span>
            ) : (
              <span className={styles.unhealthy}>✗ Backend Offline</span>
            )}
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navBtn} ${activeTab === 'analytics' ? styles.active : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === 'comparison' ? styles.active : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            ⚖️ Comparisons
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === 'simulations' ? styles.active : ''}`}
            onClick={() => setActiveTab('simulations')}
          >
            🚀 Simulations
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === 'thresholds' ? styles.active : ''}`}
            onClick={() => setActiveTab('thresholds')}
          >
            ⚙️ Thresholds
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        {!backendHealth && !checkingHealth && (
          <div className={styles.warningBanner}>
            <strong>⚠️ Backend Connection Failed</strong> - The API server is not responding. 
            Make sure the backend is running on {import.meta.env.VITE_API_URL || 'http://localhost:5001'}
          </div>
        )}

        <div className={styles.content}>
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'comparison' && <ComparisonView />}
          {activeTab === 'simulations' && <SimulationRunner />}
          {activeTab === 'thresholds' && <ThresholdManager />}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Agentic Research Frontend v0.1.0 | © 2024</p>
      </footer>
    </div>
  );
}

export default App;
