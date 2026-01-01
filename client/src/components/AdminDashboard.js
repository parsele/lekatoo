import React, { useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AdminDashboard({ trees, onTreeAdded, onTreeUpdated }) {
  const [formData, setFormData] = useState({
    species: '',
    latitude: '',
    longitude: '',
    planted_date: new Date().toISOString().split('T')[0],
    planter_name: '',
    notes: '',
    status: 'healthy'
  });
  const [editingTree, setEditingTree] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setIsLoadingLocation(false);
        setMessage({ type: 'success', text: 'Location detected successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      },
      (error) => {
        setIsLoadingLocation(false);
        let errorMsg = 'Unable to retrieve your location. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += 'Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMsg += 'Location request timed out.';
            break;
          default:
            errorMsg += 'An unknown error occurred.';
            break;
        }
        setLocationError(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingTree) {
        // Update existing tree
        await axios.put(`${API_BASE_URL}/trees/${editingTree.id}`, {
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        });
        setMessage({ type: 'success', text: 'Tree updated successfully!' });
        onTreeUpdated();
      } else {
        // Create new tree
        await axios.post(`${API_BASE_URL}/trees`, {
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        });
        setMessage({ type: 'success', text: 'Tree added successfully!' });
        onTreeAdded();
      }

      // Reset form
      setFormData({
        species: '',
        latitude: '',
        longitude: '',
        planted_date: new Date().toISOString().split('T')[0],
        planter_name: '',
        notes: '',
        status: 'healthy'
      });
      setEditingTree(null);
      setLocationError(null);

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'An error occurred. Please try again.' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleEdit = (tree) => {
    setEditingTree(tree);
    setFormData({
      species: tree.species,
      latitude: tree.latitude.toString(),
      longitude: tree.longitude.toString(),
      planted_date: tree.planted_date.split('T')[0],
      planter_name: tree.planter_name || '',
      notes: tree.notes || '',
      status: tree.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTree(null);
    setFormData({
      species: '',
      latitude: '',
      longitude: '',
      planted_date: new Date().toISOString().split('T')[0],
      planter_name: '',
      notes: '',
      status: 'healthy'
    });
    setLocationError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tree?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/trees/${id}`);
      setMessage({ type: 'success', text: 'Tree deleted successfully!' });
      onTreeUpdated();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete tree.' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        {/* Add/Edit Tree Form */}
        <div className="form-section">
          <h2>{editingTree ? '✏️ Edit Tree' : '➕ Add New Tree'}</h2>
          
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="tree-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="species">Tree Species *</label>
                <input
                  type="text"
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Acacia, Baobab, Moringa"
                />
              </div>

              <div className="form-group">
                <label htmlFor="planted_date">Planted Date *</label>
                <input
                  type="date"
                  id="planted_date"
                  name="planted_date"
                  value={formData.planted_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="planter_name">Planter Name</label>
                <input
                  type="text"
                  id="planter_name"
                  name="planter_name"
                  value={formData.planter_name}
                  onChange={handleInputChange}
                  placeholder="Name of person who planted"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="healthy">Healthy</option>
                  <option value="needs_attention">Needs Attention</option>
                </select>
              </div>
            </div>

            <div className="coordinates-section">
              <div className="coordinates-header">
                <label>Coordinates *</label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="location-btn"
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? '📍 Detecting...' : '📍 Use My Location'}
                </button>
              </div>

              {locationError && (
                <div className="location-error">{locationError}</div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="latitude">Latitude *</label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    required
                    step="any"
                    placeholder="e.g., -2.6531"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="longitude">Longitude *</label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    required
                    step="any"
                    placeholder="e.g., 37.2500"
                  />
                </div>
              </div>
              <p className="coordinates-hint">
                💡 Tip: Use "Use My Location" for automatic detection or enter coordinates manually
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Additional information about the tree..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingTree ? '💾 Update Tree' : '➕ Add Tree'}
              </button>
              {editingTree && (
                <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Trees List */}
        <div className="trees-list-section">
          <h2>📋 All Trees ({trees.length})</h2>
          
          {trees.length === 0 ? (
            <div className="empty-state">
              <p>No trees added yet. Add your first tree above!</p>
            </div>
          ) : (
            <div className="trees-grid">
              {trees.map((tree) => (
                <div key={tree.id} className="tree-card">
                  <div className="tree-card-header">
                    <h3>{tree.species}</h3>
                    <span className={`status-badge status-${tree.status}`}>
                      {tree.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="tree-card-body">
                    <div className="tree-info">
                      <p><strong>📍 Coordinates:</strong></p>
                      <p className="coordinates-text">
                        {tree.latitude.toFixed(6)}, {tree.longitude.toFixed(6)}
                      </p>
                    </div>
                    
                    <div className="tree-info">
                      <p><strong>📅 Planted:</strong> {new Date(tree.planted_date).toLocaleDateString()}</p>
                    </div>
                    
                    {tree.planter_name && (
                      <div className="tree-info">
                        <p><strong>👤 Planter:</strong> {tree.planter_name}</p>
                      </div>
                    )}
                    
                    {tree.notes && (
                      <div className="tree-info">
                        <p><strong>📝 Notes:</strong> {tree.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="tree-card-actions">
                    <button
                      onClick={() => handleEdit(tree)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tree.id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


