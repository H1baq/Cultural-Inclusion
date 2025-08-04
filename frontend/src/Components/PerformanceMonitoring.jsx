import React, { useState, useEffect } from 'react'
import './PerformanceMonitoring.css'

const PerformanceMonitoring = ({ variant = 'default' }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [performanceMetrics, setPerformanceMetrics] = useState({})
  const [systemHealth, setSystemHealth] = useState('excellent')
  const [optimizationHistory, setOptimizationHistory] = useState([])
  const [bottlenecks, setBottlenecks] = useState([])
  const [isOptimizing, setIsOptimizing] = useState(false)

  // Mock performance metrics
  const mockPerformanceMetrics = {
    responseTime: { average: 245, p95: 890, p99: 1200, trend: 'improving' },
    throughput: { requestsPerSecond: 1250, dataProcessed: '2.4GB', efficiency: 94.2 },
    resourceUsage: { cpu: 68, memory: 72, disk: 45, network: 38 },
    userExperience: { pageLoadTime: 1.8, timeToInteractive: 2.1, firstContentfulPaint: 0.9 },
    database: { queryTime: 156, connectionPool: 85, cacheHitRate: 92.5, slowQueries: 3 },
    errors: { errorRate: 0.12, failedRequests: 8, timeouts: 2, crashes: 0 }
  }

  // Mock optimization history
  const mockOptimizationHistory = [
    {
      id: 1,
      type: 'database_optimization',
      description: 'Optimized database queries and added indexes',
      impact: 'high',
      improvement: '+23%',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    },
    {
      id: 2,
      type: 'cache_implementation',
      description: 'Implemented Redis caching for frequently accessed data',
      impact: 'medium',
      improvement: '+15%',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed'
    }
  ]

  // Mock bottlenecks
  const mockBottlenecks = [
    {
      id: 1,
      type: 'database',
      severity: 'high',
      description: 'Slow query execution on beneficiary search',
      impact: 'User search taking 3-5 seconds',
      recommendation: 'Add composite index on search fields',
      estimatedImprovement: '+40%',
      priority: 'critical'
    },
    {
      id: 2,
      type: 'memory',
      severity: 'medium',
      description: 'Memory leaks in image processing',
      impact: 'Gradual performance degradation',
      recommendation: 'Implement proper memory cleanup',
      estimatedImprovement: '+25%',
      priority: 'high'
    }
  ]

  useEffect(() => {
    setPerformanceMetrics(mockPerformanceMetrics)
    setOptimizationHistory(mockOptimizationHistory)
    setBottlenecks(mockBottlenecks)

    const interval = setInterval(() => {
      setPerformanceMetrics(prev => ({
        ...prev,
        responseTime: {
          ...prev.responseTime,
          average: Math.floor(prev.responseTime.average + (Math.random() - 0.5) * 20),
          p95: Math.floor(prev.responseTime.p95 + (Math.random() - 0.5) * 50)
        },
        resourceUsage: {
          ...prev.resourceUsage,
          cpu: Math.min(100, Math.max(0, prev.resourceUsage.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.min(100, Math.max(0, prev.resourceUsage.memory + (Math.random() - 0.5) * 8))
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getSystemHealthColor = (health) => {
    switch (health) {
      case 'excellent': return 'success'
      case 'good': return 'success'
      case 'fair': return 'warning'
      case 'poor': return 'error'
      default: return 'secondary'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'success'
      case 'medium': return 'warning'
      case 'high': return 'error'
      case 'critical': return 'error'
      default: return 'secondary'
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈'
      case 'stable': return '➡️'
      case 'declining': return '📉'
      default: return '➡️'
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    return date.toLocaleDateString()
  }

  const runOptimization = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)
      const newOptimization = {
        id: Date.now(),
        type: 'automated_optimization',
        description: 'Automated performance optimization completed',
        impact: 'medium',
        improvement: '+8%',
        timestamp: new Date().toISOString(),
        status: 'completed'
      }
      setOptimizationHistory(prev => [newOptimization, ...prev])
    }, 3000)
  }

  const getPerformanceScore = () => {
    const metrics = performanceMetrics
    if (!metrics.responseTime) return 85

    const responseScore = Math.max(0, 100 - (metrics.responseTime.average / 10))
    const resourceScore = 100 - Math.max(metrics.resourceUsage.cpu, metrics.resourceUsage.memory) * 0.3
    const errorScore = 100 - (metrics.errors?.errorRate || 0) * 100
    const userExpScore = Math.max(0, 100 - (metrics.userExperience?.pageLoadTime || 0) * 20)

    return Math.round((responseScore + resourceScore + errorScore + userExpScore) / 4)
  }

  return (
    <div className={`performance-monitoring ${variant}`}>
      {/* Header */}
      <div className="performance-header">
        <div className="header-content">
          <h2>⚡ Performance Monitoring & Optimization</h2>
          <p>Real-time performance tracking and automated optimization</p>
        </div>
        <div className="performance-status">
          <div className={`status-indicator ${getSystemHealthColor(systemHealth)}`}>
            <span className="status-icon">
              {systemHealth === 'excellent' ? '🟢' : systemHealth === 'good' ? '🟢' : systemHealth === 'fair' ? '🟡' : '🔴'}
            </span>
            <span className="status-text">
              {systemHealth.charAt(0).toUpperCase() + systemHealth.slice(1)}
            </span>
          </div>
          <div className="performance-score">
            <span className="score-number">{getPerformanceScore()}</span>
            <span className="score-label">Performance Score</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="performance-tabs">
        <button 
          className={`performance-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Performance Overview
        </button>
        <button 
          className={`performance-tab ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          📈 Real-time Metrics
        </button>
        <button 
          className={`performance-tab ${activeTab === 'bottlenecks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bottlenecks')}
        >
          🚧 Bottlenecks
        </button>
        <button 
          className={`performance-tab ${activeTab === 'optimization' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimization')}
        >
          🔧 Optimization
        </button>
        <button 
          className={`performance-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📋 Performance Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="performance-content">
        {/* Performance Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="overview-section">
              <div className="overview-metrics">
                <div className="metric-card primary">
                  <div className="metric-icon">⚡</div>
                  <div className="metric-info">
                    <span className="metric-number">{performanceMetrics.responseTime?.average || 0}ms</span>
                    <span className="metric-label">Avg Response Time</span>
                    <span className="metric-trend">
                      {getTrendIcon(performanceMetrics.responseTime?.trend)} {performanceMetrics.responseTime?.trend}
                    </span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">🔄</div>
                  <div className="metric-info">
                    <span className="metric-number">{performanceMetrics.throughput?.requestsPerSecond || 0}</span>
                    <span className="metric-label">Requests/sec</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">💾</div>
                  <div className="metric-info">
                    <span className="metric-number">{performanceMetrics.resourceUsage?.cpu || 0}%</span>
                    <span className="metric-label">CPU Usage</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">🧠</div>
                  <div className="metric-info">
                    <span className="metric-number">{performanceMetrics.resourceUsage?.memory || 0}%</span>
                    <span className="metric-label">Memory Usage</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">📊</div>
                  <div className="metric-info">
                    <span className="metric-number">{performanceMetrics.errors?.errorRate || 0}%</span>
                    <span className="metric-label">Error Rate</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">⚡</div>
                  <div className="metric-info">
                    <span className="metric-number">{performanceMetrics.userExperience?.pageLoadTime || 0}s</span>
                    <span className="metric-label">Page Load Time</span>
                  </div>
                </div>
              </div>

              <div className="performance-actions">
                <button 
                  className={`action-button primary ${isOptimizing ? 'optimizing' : ''}`}
                  onClick={runOptimization}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? '🔧 Optimizing...' : '🔧 Run Optimization'}
                </button>
                <button className="action-button secondary">
                  📊 Generate Report
                </button>
              </div>

              <div className="system-health">
                <h3>🏥 System Health Overview</h3>
                <div className="health-grid">
                  <div className="health-card">
                    <h4>⚡ Response Performance</h4>
                    <div className="health-metrics">
                      <div className="health-item">
                        <span className="health-label">Average:</span>
                        <span className="health-value">{performanceMetrics.responseTime?.average || 0}ms</span>
                      </div>
                      <div className="health-item">
                        <span className="health-label">95th Percentile:</span>
                        <span className="health-value">{performanceMetrics.responseTime?.p95 || 0}ms</span>
                      </div>
                      <div className="health-item">
                        <span className="health-label">99th Percentile:</span>
                        <span className="health-value">{performanceMetrics.responseTime?.p99 || 0}ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="health-card">
                    <h4>💾 Resource Utilization</h4>
                    <div className="health-metrics">
                      <div className="health-item">
                        <span className="health-label">CPU:</span>
                        <div className="health-progress">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${performanceMetrics.resourceUsage?.cpu || 0}%` }}
                          ></div>
                          <span className="progress-text">{performanceMetrics.resourceUsage?.cpu || 0}%</span>
                        </div>
                      </div>
                      <div className="health-item">
                        <span className="health-label">Memory:</span>
                        <div className="health-progress">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${performanceMetrics.resourceUsage?.memory || 0}%` }}
                          ></div>
                          <span className="progress-text">{performanceMetrics.resourceUsage?.memory || 0}%</span>
                        </div>
                      </div>
                      <div className="health-item">
                        <span className="health-label">Disk:</span>
                        <div className="health-progress">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${performanceMetrics.resourceUsage?.disk || 0}%` }}
                          ></div>
                          <span className="progress-text">{performanceMetrics.resourceUsage?.disk || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="health-card">
                    <h4>🎯 User Experience</h4>
                    <div className="health-metrics">
                      <div className="health-item">
                        <span className="health-label">Page Load:</span>
                        <span className="health-value">{performanceMetrics.userExperience?.pageLoadTime || 0}s</span>
                      </div>
                      <div className="health-item">
                        <span className="health-label">Time to Interactive:</span>
                        <span className="health-value">{performanceMetrics.userExperience?.timeToInteractive || 0}s</span>
                      </div>
                      <div className="health-item">
                        <span className="health-label">First Paint:</span>
                        <span className="health-value">{performanceMetrics.userExperience?.firstContentfulPaint || 0}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="tab-content">
            <div className="metrics-section">
              <h3>📈 Real-time Performance Metrics</h3>
              
              <div className="metrics-grid">
                <div className="metrics-card">
                  <h4>⚡ Response Times</h4>
                  <div className="metric-chart">
                    <div className="chart-bar">
                      <span className="bar-label">Average</span>
                      <div className="bar-container">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${Math.min(100, (performanceMetrics.responseTime?.average || 0) / 10)}%` }}
                        ></div>
                      </div>
                      <span className="bar-value">{performanceMetrics.responseTime?.average || 0}ms</span>
                    </div>
                    <div className="chart-bar">
                      <span className="bar-label">P95</span>
                      <div className="bar-container">
                        <div 
                          className="bar-fill warning" 
                          style={{ width: `${Math.min(100, (performanceMetrics.responseTime?.p95 || 0) / 20)}%` }}
                        ></div>
                      </div>
                      <span className="bar-value">{performanceMetrics.responseTime?.p95 || 0}ms</span>
                    </div>
                    <div className="chart-bar">
                      <span className="bar-label">P99</span>
                      <div className="bar-container">
                        <div 
                          className="bar-fill error" 
                          style={{ width: `${Math.min(100, (performanceMetrics.responseTime?.p99 || 0) / 30)}%` }}
                        ></div>
                      </div>
                      <span className="bar-value">{performanceMetrics.responseTime?.p99 || 0}ms</span>
                    </div>
                  </div>
                </div>

                <div className="metrics-card">
                  <h4>🔄 Throughput</h4>
                  <div className="throughput-metrics">
                    <div className="throughput-item">
                      <span className="throughput-label">Requests/sec</span>
                      <span className="throughput-value">{performanceMetrics.throughput?.requestsPerSecond || 0}</span>
                    </div>
                    <div className="throughput-item">
                      <span className="throughput-label">Data Processed</span>
                      <span className="throughput-value">{performanceMetrics.throughput?.dataProcessed || '0GB'}</span>
                    </div>
                    <div className="throughput-item">
                      <span className="throughput-label">Efficiency</span>
                      <span className="throughput-value">{performanceMetrics.throughput?.efficiency || 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="metrics-card">
                  <h4>💾 Resource Usage</h4>
                  <div className="resource-metrics">
                    <div className="resource-item">
                      <span className="resource-label">CPU</span>
                      <div className="resource-bar">
                        <div 
                          className="resource-fill" 
                          style={{ width: `${performanceMetrics.resourceUsage?.cpu || 0}%` }}
                        ></div>
                      </div>
                      <span className="resource-value">{performanceMetrics.resourceUsage?.cpu || 0}%</span>
                    </div>
                    <div className="resource-item">
                      <span className="resource-label">Memory</span>
                      <div className="resource-bar">
                        <div 
                          className="resource-fill" 
                          style={{ width: `${performanceMetrics.resourceUsage?.memory || 0}%` }}
                        ></div>
                      </div>
                      <span className="resource-value">{performanceMetrics.resourceUsage?.memory || 0}%</span>
                    </div>
                    <div className="resource-item">
                      <span className="resource-label">Disk</span>
                      <div className="resource-bar">
                        <div 
                          className="resource-fill" 
                          style={{ width: `${performanceMetrics.resourceUsage?.disk || 0}%` }}
                        ></div>
                      </div>
                      <span className="resource-value">{performanceMetrics.resourceUsage?.disk || 0}%</span>
                    </div>
                    <div className="resource-item">
                      <span className="resource-label">Network</span>
                      <div className="resource-bar">
                        <div 
                          className="resource-fill" 
                          style={{ width: `${performanceMetrics.resourceUsage?.network || 0}%` }}
                        ></div>
                      </div>
                      <span className="resource-value">{performanceMetrics.resourceUsage?.network || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottlenecks Tab */}
        {activeTab === 'bottlenecks' && (
          <div className="tab-content">
            <div className="bottlenecks-section">
              <div className="bottlenecks-header">
                <h3>🚧 Performance Bottlenecks</h3>
                <div className="bottlenecks-summary">
                  <span className="bottleneck-count">{bottlenecks.length} Active Issues</span>
                  <span className="bottleneck-critical">
                    {bottlenecks.filter(b => b.severity === 'high' || b.severity === 'critical').length} Critical
                  </span>
                </div>
              </div>

              <div className="bottlenecks-list">
                {bottlenecks.map((bottleneck) => (
                  <div key={bottleneck.id} className={`bottleneck-item ${bottleneck.severity}`}>
                    <div className="bottleneck-header">
                      <div className="bottleneck-info">
                        <span className={`bottleneck-severity ${getSeverityColor(bottleneck.severity)}`}>
                          {bottleneck.severity.toUpperCase()}
                        </span>
                        <h4 className="bottleneck-title">{bottleneck.description}</h4>
                      </div>
                      <div className="bottleneck-meta">
                        <span className={`bottleneck-priority ${getSeverityColor(bottleneck.priority)}`}>
                          {bottleneck.priority}
                        </span>
                        <span className="bottleneck-improvement">{bottleneck.estimatedImprovement}</span>
                      </div>
                    </div>
                    <div className="bottleneck-content">
                      <div className="bottleneck-details">
                        <div className="detail-item">
                          <span className="detail-label">Type:</span>
                          <span className="detail-value">{bottleneck.type}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Impact:</span>
                          <span className="detail-value">{bottleneck.impact}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Recommendation:</span>
                          <span className="detail-value">{bottleneck.recommendation}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bottleneck-actions">
                      <button className="action-button">🔧 Fix Now</button>
                      <button className="action-button">📊 Analyze</button>
                      <button className="action-button">⏰ Schedule</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <div className="tab-content">
            <div className="optimization-section">
              <div className="optimization-header">
                <h3>🔧 Performance Optimization</h3>
                <button 
                  className={`optimize-button ${isOptimizing ? 'optimizing' : ''}`}
                  onClick={runOptimization}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? '🔧 Running Optimization...' : '🔧 Run Auto-Optimization'}
                </button>
              </div>

              <div className="optimization-history">
                <h4>📋 Optimization History</h4>
                <div className="history-list">
                  {optimizationHistory.map((optimization) => (
                    <div key={optimization.id} className="history-item">
                      <div className="history-header">
                        <div className="history-info">
                          <h5 className="history-title">{optimization.description}</h5>
                          <span className="history-type">{optimization.type.replace('_', ' ')}</span>
                        </div>
                        <div className="history-meta">
                          <span className={`history-impact ${optimization.impact}`}>
                            {optimization.impact}
                          </span>
                          <span className="history-improvement">{optimization.improvement}</span>
                        </div>
                      </div>
                      <div className="history-footer">
                        <span className="history-time">{formatTimestamp(optimization.timestamp)}</span>
                        <span className={`history-status ${optimization.status}`}>
                          {optimization.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="optimization-recommendations">
                <h4>💡 Optimization Recommendations</h4>
                <div className="recommendations-grid">
                  <div className="recommendation-card">
                    <div className="recommendation-icon">🗄️</div>
                    <h5>Database Optimization</h5>
                    <p>Add missing indexes and optimize slow queries</p>
                    <div className="recommendation-impact">
                      <span className="impact-label">Estimated Impact:</span>
                      <span className="impact-value">+25%</span>
                    </div>
                    <button className="recommendation-button">Apply</button>
                  </div>
                  <div className="recommendation-card">
                    <div className="recommendation-icon">💾</div>
                    <h5>Cache Implementation</h5>
                    <p>Implement Redis caching for frequently accessed data</p>
                    <div className="recommendation-impact">
                      <span className="impact-label">Estimated Impact:</span>
                      <span className="impact-value">+20%</span>
                    </div>
                    <button className="recommendation-button">Apply</button>
                  </div>
                  <div className="recommendation-card">
                    <div className="recommendation-icon">📦</div>
                    <h5>Asset Optimization</h5>
                    <p>Compress and optimize static assets</p>
                    <div className="recommendation-impact">
                      <span className="impact-label">Estimated Impact:</span>
                      <span className="impact-value">+15%</span>
                    </div>
                    <button className="recommendation-button">Apply</button>
                  </div>
                  <div className="recommendation-card">
                    <div className="recommendation-icon">🌐</div>
                    <h5>CDN Setup</h5>
                    <p>Configure CDN for global content delivery</p>
                    <div className="recommendation-impact">
                      <span className="impact-label">Estimated Impact:</span>
                      <span className="impact-value">+30%</span>
                    </div>
                    <button className="recommendation-button">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="tab-content">
            <div className="analytics-section">
              <h3>📋 Performance Analytics</h3>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h4>📊 Performance Trends</h4>
                  <div className="trend-analysis">
                    <div className="trend-item">
                      <span className="trend-label">Response Time Trend</span>
                      <span className="trend-value improving">📈 Improving</span>
                    </div>
                    <div className="trend-item">
                      <span className="trend-label">Throughput Trend</span>
                      <span className="trend-value stable">➡️ Stable</span>
                    </div>
                    <div className="trend-item">
                      <span className="trend-label">Error Rate Trend</span>
                      <span className="trend-value improving">📈 Improving</span>
                    </div>
                    <div className="trend-item">
                      <span className="trend-label">User Experience Trend</span>
                      <span className="trend-value improving">📈 Improving</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>🎯 Performance Goals</h4>
                  <div className="goals-list">
                    <div className="goal-item">
                      <span className="goal-label">Response Time &lt; 200ms</span>
                      <div className="goal-progress">
                        <div 
                          className="goal-bar" 
                          style={{ width: `${Math.min(100, (200 / (performanceMetrics.responseTime?.average || 1)) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="goal-status">
                        {performanceMetrics.responseTime?.average < 200 ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="goal-item">
                      <span className="goal-label">Error Rate &lt; 0.1%</span>
                      <div className="goal-progress">
                        <div 
                          className="goal-bar" 
                          style={{ width: `${Math.max(0, 100 - ((performanceMetrics.errors?.errorRate || 0) * 1000))}%` }}
                        ></div>
                      </div>
                      <span className="goal-status">
                        {(performanceMetrics.errors?.errorRate || 0) < 0.1 ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="goal-item">
                      <span className="goal-label">Page Load &lt; 2s</span>
                      <div className="goal-progress">
                        <div 
                          className="goal-bar" 
                          style={{ width: `${Math.max(0, 100 - ((performanceMetrics.userExperience?.pageLoadTime || 0) * 50))}%` }}
                        ></div>
                      </div>
                      <span className="goal-status">
                        {(performanceMetrics.userExperience?.pageLoadTime || 0) < 2 ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>📈 Performance Insights</h4>
                  <div className="insights-list">
                    <div className="insight-item positive">
                      <span className="insight-icon">✅</span>
                      <span className="insight-text">Response times improved by 15% this week</span>
                    </div>
                    <div className="insight-item positive">
                      <span className="insight-icon">✅</span>
                      <span className="insight-text">Error rate reduced to 0.12%</span>
                    </div>
                    <div className="insight-item warning">
                      <span className="insight-icon">⚠️</span>
                      <span className="insight-text">Memory usage approaching 75% threshold</span>
                    </div>
                    <div className="insight-item positive">
                      <span className="insight-icon">✅</span>
                      <span className="insight-text">Page load times consistently under 2s</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>🔮 Predictive Analytics</h4>
                  <div className="predictions-list">
                    <div className="prediction-item">
                      <span className="prediction-label">Expected Response Time (Next Week)</span>
                      <span className="prediction-value">220ms</span>
                    </div>
                    <div className="prediction-item">
                      <span className="prediction-label">Resource Usage Forecast</span>
                      <span className="prediction-value">CPU: 75%, Memory: 80%</span>
                    </div>
                    <div className="prediction-item">
                      <span className="prediction-label">Recommended Actions</span>
                      <span className="prediction-value">Scale resources, optimize queries</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PerformanceMonitoring 