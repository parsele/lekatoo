import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom tree icon
const treeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
      <path d="M16 8 L12 16 L16 14 L20 16 Z" fill="#ffffff"/>
      <rect x="15" y="14" width="2" height="6" fill="#8b4513"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapView({ trees }) {
  // Amboseli coordinates (center of Amboseli National Park)
  const amboseliCenter = [-2.6531, 37.2500];
  const zoomLevel = 11;

  return (
    <div className="map-container">
      <MapContainer
        center={amboseliCenter}
        zoom={zoomLevel}
        style={{ height: 'calc(100vh - 200px)', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trees.map((tree) => (
          <Marker
            key={tree.id}
            position={[tree.latitude, tree.longitude]}
            icon={treeIcon}
          >
            <Popup>
              <div className="tree-popup">
                <h3>{tree.species}</h3>
                <p><strong>Planted:</strong> {new Date(tree.planted_date).toLocaleDateString()}</p>
                {tree.planter_name && <p><strong>Planter:</strong> {tree.planter_name}</p>}
                <p><strong>Status:</strong> <span className={`status-badge status-${tree.status}`}>{tree.status}</span></p>
                {tree.notes && <p><strong>Notes:</strong> {tree.notes}</p>}
                <p className="coordinates">
                  <strong>Coordinates:</strong> {tree.latitude.toFixed(6)}, {tree.longitude.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;

