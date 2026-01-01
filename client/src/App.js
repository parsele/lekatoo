import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import AdminDashboard from './components/AdminDashboard';
import Statistics from './components/Statistics';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [trees, setTrees] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchTrees();
    fetchStats();
  }, []);

  const fetchTrees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trees`);
      const data = await response.json();
      setTrees(data);
    } catch (error) {
      console.error('Error fetching trees:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleTreeAdded = () => {
    fetchTrees();
    fetchStats();
  };

  const handleTreeUpdated = () => {
    fetchTrees();
    fetchStats();
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🌳 Green Planet Tree Tracker</h1>
          <p className="subtitle">Tracking Trees in Amboseli, Kenya</p>
        </div>
        <button 
          className="admin-toggle-btn"
          onClick={() => setShowAdmin(!showAdmin)}
        >
          {showAdmin ? '📊 View Map' : '⚙️ Admin Dashboard'}
        </button>
      </header>

      {stats && <Statistics stats={stats} />}

      {showAdmin ? (
        <AdminDashboard 
          trees={trees}
          onTreeAdded={handleTreeAdded}
          onTreeUpdated={handleTreeUpdated}
        />
      ) : (
        <MapView trees={trees} />
      )}
    </div>
  );
}

export default App;

