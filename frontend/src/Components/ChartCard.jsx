import React from 'react'
import './ChartCard.css'

const ChartCard = ({ title, chartType, className = '' }) => {
  const getChartIcon = (type) => {
    switch (type) {
      case 'doughnut': return '📊'
      case 'bar': return '📈'
      case 'line': return '📉'
      case 'pie': return '🥧'
      default: return '📊'
    }
  }

  const getChartColor = (type) => {
    switch (type) {
      case 'doughnut': return 'primary'
      case 'bar': return 'success'
      case 'line': return 'info'
      case 'pie': return 'warning'
      default: return 'primary'
    }
  }

  return (
    <div className={`chart-card ${className} chart-${getChartColor(chartType)}`}>
      <div className="chart-header">
        <div className="chart-icon">
          <span className="icon">{getChartIcon(chartType)}</span>
        </div>
        <div className="chart-title">
          <h3>{title}</h3>
          <p className="chart-subtitle">Interactive data visualization</p>
        </div>
        <div className="chart-actions">
          <button className="chart-action-btn" title="Refresh">
            🔄
          </button>
          <button className="chart-action-btn" title="Export">
            📤
          </button>
          <button className="chart-action-btn" title="Settings">
            ⚙️
          </button>
        </div>
      </div>
      
      <div className="chart-content">
        <div className="chart-placeholder">
          <div className="placeholder-icon">📊</div>
          <p>Chart visualization will be rendered here</p>
          <span className="placeholder-type">{chartType} chart</span>
        </div>
      </div>
      
      <div className="chart-footer">
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">Data Points</span>
            <span className="stat-value">1,247</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Last Updated</span>
            <span className="stat-value">2 min ago</span>
          </div>
        </div>
        <div className="chart-status">
          <span className="status-indicator active"></span>
          <span className="status-text">Live</span>
        </div>
      </div>
    </div>
  )
}

export default ChartCard