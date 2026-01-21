import { useState, useEffect, useCallback } from 'react';

// Normalize API URL - remove trailing slash if present
const normalizeUrl = (url) => url.replace(/\/$/, '');
const API_BASE = normalizeUrl(import.meta.env.VITE_API_URL || 'http://localhost:5001');

export function useThresholds() {
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchThresholds = useCallback(async (agent = null) => {
    setLoading(true);
    setError(null);
    try {
      const query = agent ? `?agent=${agent}` : '';
      const response = await fetch(`${API_BASE}/api/thresholds${query}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setThresholds(data.thresholds || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getThreshold = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/thresholds/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.threshold;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  const createThreshold = useCallback(async (threshold) => {
    try {
      const response = await fetch(`${API_BASE}/api/thresholds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(threshold)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        await fetchThresholds();
      }
      return data;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [fetchThresholds]);

  const updateThreshold = useCallback(async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/api/thresholds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        await fetchThresholds();
      }
      return data;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [fetchThresholds]);

  const deleteThreshold = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/thresholds/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        await fetchThresholds();
      }
      return data;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [fetchThresholds]);

  return {
    thresholds,
    loading,
    error,
    fetchThresholds,
    getThreshold,
    createThreshold,
    updateThreshold,
    deleteThreshold
  };
}

export function useBots() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/bots`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setBots(data.agents || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bots,
    loading,
    error,
    fetchBots
  };
}

export function useStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatistics = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.thresholdId) queryParams.append('threshold_id', filters.thresholdId);
      if (filters.agent) queryParams.append('agent', filters.agent);
      if (filters.days) queryParams.append('days', filters.days);
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await fetch(`${API_BASE}/api/statistics/thresholds${query}`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setStatistics(data.statistics || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getThresholdHistory = useCallback(async (thresholdId, limit = 100) => {
    try {
      const response = await fetch(`${API_BASE}/api/thresholds/${thresholdId}/history?limit=${limit}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.history || [];
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  return {
    statistics,
    loading,
    error,
    fetchStatistics,
    getThresholdHistory
  };
}

export function useSimulations() {
  const [runs, setRuns] = useState([]);
  const [realData, setRealData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRuns = useCallback(async (limit = 100, offset = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/runs?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setRuns(data.runs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRealData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/runs/real`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setRealData(data.real_data || null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const compareSimulation = useCallback(async (simulationId) => {
    try {
      const response = await fetch(`${API_BASE}/api/runs/compare?simulation_id=${simulationId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.comparison || null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  return {
    runs,
    realData,
    loading,
    error,
    fetchRuns,
    fetchRealData,
    compareSimulation
  };
}
