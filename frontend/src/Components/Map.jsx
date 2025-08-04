import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './Map.css'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const Map = ({ 
  beneficiaries = [], 
  showHeatmap = true, 
  center = [-1.2921, 36.8219], // Nairobi coordinates
  zoom = 7,
  height = '500px'
}) => {
  const mapRef = useRef()
  const [map, setMap] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

  // Sample data for demonstration
  const sampleBeneficiaries = [
    {
      id: 1,
      name: 'Sarah Muthoni',
      location: [-1.2921, 36.8219], // Nairobi
      age: 25,
      needs: 'Educational support',
      riskScore: 8.5,
      status: 'Active',
      lastUpdate: '2024-01-15'
    },
    {
      id: 2,
      name: 'John Kamau',
      location: [-0.3031, 36.0800], // Nakuru
      age: 32,
      needs: 'Healthcare access',
      riskScore: 7.2,
      status: 'Active',
      lastUpdate: '2024-01-14'
    },
    {
      id: 3,
      name: 'Mary Wanjiku',
      location: [-1.2833, 36.8172], // Nairobi West
      age: 28,
      needs: 'Housing assistance',
      riskScore: 9.1,
      status: 'Pending',
      lastUpdate: '2024-01-13'
    },
    {
      id: 4,
      name: 'David Ochieng',
      location: [-0.1022, 34.7617], // Kisumu
      age: 19,
      needs: 'Youth employment',
      riskScore: 6.8,
      status: 'Active',
      lastUpdate: '2024-01-12'
    },
    {
      id: 5,
      name: 'Grace Akinyi',
      location: [-1.2921, 36.8219], // Nairobi Central
      age: 35,
      needs: 'Childcare support',
      riskScore: 8.9,
      status: 'Active',
      lastUpdate: '2024-01-11'
    },
    {
      id: 6,
      name: 'Peter Mwangi',
      location: [-0.4167, 36.9500], // Nyeri
      age: 42,
      needs: 'Agricultural training',
      riskScore: 5.5,
      status: 'Active',
      lastUpdate: '2024-01-10'
    },
    {
      id: 7,
      name: 'Jane Njeri',
      location: [-1.2833, 36.8172], // Nairobi East
      age: 29,
      needs: 'Skills training',
      riskScore: 7.8,
      status: 'Active',
      lastUpdate: '2024-01-09'
    },
    {
      id: 8,
      name: 'Michael Odhiambo',
      location: [-0.1022, 34.7617], // Kisumu Rural
      age: 24,
      needs: 'Mental health support',
      riskScore: 9.3,
      status: 'High Priority',
      lastUpdate: '2024-01-08'
    }
  ]

  const data = beneficiaries.length > 0 ? beneficiaries : sampleBeneficiaries

  // Calculate region statistics
  const getRegionStats = (region) => {
    const regionData = data.filter(ben => {
      const [lat, lng] = ben.location
      return Math.abs(lat - region.lat) < 0.1 && Math.abs(lng - region.lng) < 0.1
    })
    
    return {
      count: regionData.length,
      avgRiskScore: regionData.reduce((sum, ben) => sum + ben.riskScore, 0) / regionData.length || 0,
      needs: [...new Set(regionData.map(ben => ben.needs))],
      activeCount: regionData.filter(ben => ben.status === 'Active').length
    }
  }

  // Get color based on risk score
  const getRiskColor = (score) => {
    if (score >= 8.5) return '#dc2626' // Red - High risk
    if (score >= 7.0) return '#f59e0b' // Orange - Medium-high risk
    if (score >= 5.5) return '#eab308' // Yellow - Medium risk
    return '#22c55e' // Green - Low risk
  }

  // Get marker size based on risk score
  const getMarkerSize = (score) => {
    if (score >= 8.5) return 12
    if (score >= 7.0) return 10
    if (score >= 5.5) return 8
    return 6
  }

  useEffect(() => {
    if (map) {
      map.invalidateSize()
    }
  }, [map])

  return (
    <div className="map-container">
      <div className="map-header">
        <h3>🗺️ Beneficiary Distribution Map</h3>
        <div className="map-controls">
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-color high-risk"></div>
              <span>High Risk (8.5+)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color medium-high-risk"></div>
              <span>Medium-High (7.0-8.4)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color medium-risk"></div>
              <span>Medium (5.5-6.9)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color low-risk"></div>
              <span>Low Risk (&lt;5.5)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="map-wrapper" style={{ height }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          whenCreated={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {data.map((beneficiary) => (
            <CircleMarker
              key={beneficiary.id}
              center={beneficiary.location}
              radius={getMarkerSize(beneficiary.riskScore)}
              fillColor={getRiskColor(beneficiary.riskScore)}
              color={getRiskColor(beneficiary.riskScore)}
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
            >
              <Tooltip>
                <div className="map-tooltip">
                  <h4>{beneficiary.name}</h4>
                  <p><strong>Age:</strong> {beneficiary.age}</p>
                  <p><strong>Needs:</strong> {beneficiary.needs}</p>
                  <p><strong>Risk Score:</strong> {beneficiary.riskScore}</p>
                  <p><strong>Status:</strong> {beneficiary.status}</p>
                  <p><strong>Last Update:</strong> {beneficiary.lastUpdate}</p>
                </div>
              </Tooltip>
              <Popup>
                <div className="map-popup">
                  <h4>{beneficiary.name}</h4>
                  <div className="popup-details">
                    <p><strong>Age:</strong> {beneficiary.age}</p>
                    <p><strong>Needs:</strong> {beneficiary.needs}</p>
                    <p><strong>Risk Score:</strong> 
                      <span className={`risk-score risk-${beneficiary.riskScore >= 8.5 ? 'high' : beneficiary.riskScore >= 7.0 ? 'medium-high' : beneficiary.riskScore >= 5.5 ? 'medium' : 'low'}`}>
                        {beneficiary.riskScore}
                      </span>
                    </p>
                    <p><strong>Status:</strong> 
                      <span className={`status status-${beneficiary.status.toLowerCase().replace(' ', '-')}`}>
                        {beneficiary.status}
                      </span>
                    </p>
                    <p><strong>Last Update:</strong> {beneficiary.lastUpdate}</p>
                  </div>
                  <div className="popup-actions">
                    <button className="popup-btn primary">View Details</button>
                    <button className="popup-btn secondary">Update Status</button>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="map-stats">
        <div className="stat-card">
          <div className="stat-number">{data.length}</div>
          <div className="stat-label">Total Beneficiaries</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {data.filter(ben => ben.riskScore >= 8.5).length}
          </div>
          <div className="stat-label">High Risk Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {data.filter(ben => ben.status === 'Active').length}
          </div>
          <div className="stat-label">Active Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {(data.reduce((sum, ben) => sum + ben.riskScore, 0) / data.length).toFixed(1)}
          </div>
          <div className="stat-label">Average Risk Score</div>
        </div>
      </div>
    </div>
  )
}

export default Map 