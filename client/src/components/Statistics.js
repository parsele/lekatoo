import React from 'react';
import './Statistics.css';

function Statistics({ stats }) {
  if (!stats) return null;

  return (
    <div className="statistics-container">
      <div className="stat-card">
        <div className="stat-icon">🌳</div>
        <div className="stat-content">
          <div className="stat-value">{stats.total_trees || 0}</div>
          <div className="stat-label">Total Trees</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🌿</div>
        <div className="stat-content">
          <div className="stat-value">{stats.species_count || 0}</div>
          <div className="stat-label">Species</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-value">{stats.healthy_trees || 0}</div>
          <div className="stat-label">Healthy</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">⚠️</div>
        <div className="stat-content">
          <div className="stat-value">{stats.needs_attention || 0}</div>
          <div className="stat-label">Needs Attention</div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;

