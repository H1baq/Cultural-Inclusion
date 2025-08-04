import React, { useState, useEffect } from 'react'
import './AdvancedAnalytics.css'

const AdvancedAnalytics = ({ variant = 'default' }) => {
  const [activeTab, setActiveTab] = useState('predictive')
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [customMetrics, setCustomMetrics] = useState([])
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  // Mock data for advanced analytics
  const predictiveData = {
    trends: [
      { month: 'Jan', beneficiaries: 120, predicted: 125, confidence: 0.92 },
      { month: 'Feb', beneficiaries: 135, predicted: 140, confidence: 0.89 },
      { month: 'Mar', beneficiaries: 150, predicted: 155, confidence: 0.91 },
      { month: 'Apr', beneficiaries: 165, predicted: 170, confidence: 0.88 },
      { month: 'May', beneficiaries: 180, predicted: 185, confidence: 0.90 },
      { month: 'Jun', beneficiaries: 195, predicted: 200, confidence: 0.87 }
    ],
    predictions: [
      { metric: 'Beneficiary Growth', current: '15%', predicted: '18%', confidence: 'High' },
      { metric: 'Program Completion', current: '78%', predicted: '82%', confidence: 'Medium' },
      { metric: 'Employment Rate', current: '65%', predicted: '70%', confidence: 'High' },
      { metric: 'Community Impact', current: '4.2/5', predicted: '4.5/5', confidence: 'Medium' }
    ]
  }

  const impactData = {
    roi: {
      investment: 150000,
      returns: 320000,
      ratio: 2.13,
      timeframe: '12 months'
    },
    outcomes: [
      { category: 'Education', before: 45, after: 78, improvement: '+73%' },
      { category: 'Employment', before: 32, after: 67, improvement: '+109%' },
      { category: 'Health Access', before: 58, after: 89, improvement: '+53%' },
      { category: 'Social Integration', before: 41, after: 76, improvement: '+85%' }
    ],
    stories: [
      {
        title: 'Sarah\'s Journey',
        description: 'From unemployed to community leader',
        impact: 'Created 5 jobs in her community',
        metrics: { income: '+300%', confidence: '+85%', skills: '+12 new' }
      },
      {
        title: 'Youth Tech Program',
        description: 'Digital skills training initiative',
        impact: '85% employment rate within 6 months',
        metrics: { participants: 120, success: '85%', retention: '92%' }
      }
    ]
  }

  const comparativeData = {
    regions: [
      { name: 'Nairobi', before: 65, after: 89, improvement: '+37%' },
      { name: 'Mombasa', before: 42, after: 71, improvement: '+69%' },
      { name: 'Kisumu', before: 38, after: 62, improvement: '+63%' },
      { name: 'Nakuru', before: 45, after: 68, improvement: '+51%' }
    ],
    programs: [
      { name: 'Skills Training', before: 58, after: 82, improvement: '+41%' },
      { name: 'Mentorship', before: 45, after: 76, improvement: '+69%' },
      { name: 'Job Placement', before: 52, after: 78, improvement: '+50%' },
      { name: 'Community Support', before: 48, after: 71, improvement: '+48%' }
    ]
  }

  const generateCustomReport = () => {
    setIsGeneratingReport(true)
    setTimeout(() => {
      setIsGeneratingReport(false)
      // In a real app, this would generate and download a report
    }, 2000)
  }

  const addCustomMetric = () => {
    const newMetric = {
      id: Date.now(),
      name: `Custom Metric ${customMetrics.length + 1}`,
      value: Math.floor(Math.random() * 100),
      target: Math.floor(Math.random() * 100),
      status: Math.random() > 0.5 ? 'on-track' : 'needs-attention'
    }
    setCustomMetrics([...customMetrics, newMetric])
  }

  const getConfidenceColor = (confidence) => {
    if (confidence === 'High') return 'var(--success-600)'
    if (confidence === 'Medium') return 'var(--warning-600)'
    return 'var(--error-600)'
  }

  const getImprovementColor = (improvement) => {
    const value = parseInt(improvement.replace('+', '').replace('%', ''))
    if (value >= 50) return 'var(--success-600)'
    if (value >= 25) return 'var(--warning-600)'
    return 'var(--error-600)'
  }

  return (
    <div className={`advanced-analytics ${variant}`}>
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h2>📈 Advanced Analytics Dashboard</h2>
          <p>Predictive insights, impact measurement, and comparative analysis for data-driven decisions</p>
        </div>
        <div className="header-actions">
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="timeframe-selector"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="custom">Custom Range</option>
          </select>
          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="region-selector"
          >
            <option value="all">All Regions</option>
            <option value="nairobi">Nairobi</option>
            <option value="mombasa">Mombasa</option>
            <option value="kisumu">Kisumu</option>
            <option value="nakuru">Nakuru</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="analytics-tabs">
        <button 
          className={`analytics-tab ${activeTab === 'predictive' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictive')}
        >
          🔮 Predictive Analytics
        </button>
        <button 
          className={`analytics-tab ${activeTab === 'impact' ? 'active' : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          📊 Impact Measurement
        </button>
        <button 
          className={`analytics-tab ${activeTab === 'comparative' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparative')}
        >
          ⚖️ Comparative Analysis
        </button>
        <button 
          className={`analytics-tab ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          🎯 Custom Reports
        </button>
      </div>

      {/* Tab Content */}
      <div className="analytics-content">
        {/* Predictive Analytics Tab */}
        {activeTab === 'predictive' && (
          <div className="tab-content">
            <div className="predictive-overview">
              <div className="overview-card">
                <h3>📈 Growth Trends</h3>
                <div className="trend-chart">
                  {predictiveData.trends.map((trend, index) => (
                    <div key={index} className="trend-bar">
                      <div className="bar-container">
                        <div 
                          className="actual-bar" 
                          style={{ height: `${(trend.beneficiaries / 200) * 100}%` }}
                        ></div>
                        <div 
                          className="predicted-bar" 
                          style={{ height: `${(trend.predicted / 200) * 100}%` }}
                        ></div>
                      </div>
                      <span className="month-label">{trend.month}</span>
                      <span className="confidence-score">{Math.round(trend.confidence * 100)}%</span>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color actual"></div>
                    <span>Actual</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color predicted"></div>
                    <span>Predicted</span>
                  </div>
                </div>
              </div>

              <div className="predictions-grid">
                <h3>🔮 AI Predictions</h3>
                <div className="predictions-list">
                  {predictiveData.predictions.map((prediction, index) => (
                    <div key={index} className="prediction-card">
                      <div className="prediction-header">
                        <h4>{prediction.metric}</h4>
                        <span 
                          className="confidence-badge"
                          style={{ backgroundColor: getConfidenceColor(prediction.confidence) }}
                        >
                          {prediction.confidence}
                        </span>
                      </div>
                      <div className="prediction-values">
                        <div className="current-value">
                          <span className="label">Current</span>
                          <span className="value">{prediction.current}</span>
                        </div>
                        <div className="arrow">→</div>
                        <div className="predicted-value">
                          <span className="label">Predicted</span>
                          <span className="value">{prediction.predicted}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Impact Measurement Tab */}
        {activeTab === 'impact' && (
          <div className="tab-content">
            <div className="impact-overview">
              <div className="roi-card">
                <h3>💰 Return on Investment</h3>
                <div className="roi-metrics">
                  <div className="roi-metric">
                    <span className="label">Investment</span>
                    <span className="value">${impactData.roi.investment.toLocaleString()}</span>
                  </div>
                  <div className="roi-metric">
                    <span className="label">Returns</span>
                    <span className="value">${impactData.roi.returns.toLocaleString()}</span>
                  </div>
                  <div className="roi-metric highlight">
                    <span className="label">ROI Ratio</span>
                    <span className="value">{impactData.roi.ratio}x</span>
                  </div>
                  <div className="roi-metric">
                    <span className="label">Timeframe</span>
                    <span className="value">{impactData.roi.timeframe}</span>
                  </div>
                </div>
              </div>

              <div className="outcomes-grid">
                <h3>📊 Outcome Improvements</h3>
                <div className="outcomes-list">
                  {impactData.outcomes.map((outcome, index) => (
                    <div key={index} className="outcome-card">
                      <h4>{outcome.category}</h4>
                      <div className="outcome-bars">
                        <div className="bar-container">
                          <div className="before-bar">
                            <span className="bar-label">Before</span>
                            <div 
                              className="bar-fill" 
                              style={{ width: `${outcome.before}%` }}
                            ></div>
                            <span className="bar-value">{outcome.before}%</span>
                          </div>
                          <div className="after-bar">
                            <span className="bar-label">After</span>
                            <div 
                              className="bar-fill" 
                              style={{ width: `${outcome.after}%` }}
                            ></div>
                            <span className="bar-value">{outcome.after}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="improvement">
                        <span 
                          className="improvement-value"
                          style={{ color: getImprovementColor(outcome.improvement) }}
                        >
                          {outcome.improvement}
                        </span>
                        <span className="improvement-label">improvement</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="impact-stories">
                <h3>🌟 Impact Stories</h3>
                <div className="stories-grid">
                  {impactData.stories.map((story, index) => (
                    <div key={index} className="story-card">
                      <div className="story-header">
                        <h4>{story.title}</h4>
                        <span className="story-impact">{story.impact}</span>
                      </div>
                      <p className="story-description">{story.description}</p>
                      <div className="story-metrics">
                        {Object.entries(story.metrics).map(([key, value]) => (
                          <div key={key} className="story-metric">
                            <span className="metric-label">{key}</span>
                            <span className="metric-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparative Analysis Tab */}
        {activeTab === 'comparative' && (
          <div className="tab-content">
            <div className="comparative-overview">
              <div className="regional-comparison">
                <h3>🗺️ Regional Performance</h3>
                <div className="comparison-table">
                  <div className="table-header">
                    <span>Region</span>
                    <span>Before</span>
                    <span>After</span>
                    <span>Improvement</span>
                  </div>
                  {comparativeData.regions.map((region, index) => (
                    <div key={index} className="table-row">
                      <span className="region-name">{region.name}</span>
                      <span className="before-value">{region.before}%</span>
                      <span className="after-value">{region.after}%</span>
                      <span 
                        className="improvement-value"
                        style={{ color: getImprovementColor(region.improvement) }}
                      >
                        {region.improvement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="program-comparison">
                <h3>📚 Program Effectiveness</h3>
                <div className="program-chart">
                  {comparativeData.programs.map((program, index) => (
                    <div key={index} className="program-bar">
                      <div className="program-info">
                        <span className="program-name">{program.name}</span>
                        <span 
                          className="improvement-badge"
                          style={{ color: getImprovementColor(program.improvement) }}
                        >
                          {program.improvement}
                        </span>
                      </div>
                      <div className="bar-container">
                        <div 
                          className="before-fill" 
                          style={{ width: `${program.before}%` }}
                        ></div>
                        <div 
                          className="after-fill" 
                          style={{ width: `${program.after}%` }}
                        ></div>
                      </div>
                      <div className="bar-labels">
                        <span>{program.before}%</span>
                        <span>{program.after}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Reports Tab */}
        {activeTab === 'custom' && (
          <div className="tab-content">
            <div className="custom-reports">
              <div className="reports-header">
                <h3>🎯 Custom Reports</h3>
                <div className="report-actions">
                  <button className="add-metric-btn" onClick={addCustomMetric}>
                    + Add Metric
                  </button>
                  <button 
                    className="generate-report-btn" 
                    onClick={generateCustomReport}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? 'Generating...' : '📄 Generate Report'}
                  </button>
                </div>
              </div>

              <div className="custom-metrics">
                <h4>Custom Metrics</h4>
                {customMetrics.length === 0 ? (
                  <div className="empty-state">
                    <p>No custom metrics defined yet.</p>
                    <p>Click "Add Metric" to start building your custom report.</p>
                  </div>
                ) : (
                  <div className="metrics-grid">
                    {customMetrics.map((metric) => (
                      <div key={metric.id} className="metric-card">
                        <div className="metric-header">
                          <h5>{metric.name}</h5>
                          <span className={`status-badge ${metric.status}`}>
                            {metric.status === 'on-track' ? '✅ On Track' : '⚠️ Needs Attention'}
                          </span>
                        </div>
                        <div className="metric-values">
                          <div className="current">
                            <span className="label">Current</span>
                            <span className="value">{metric.value}</span>
                          </div>
                          <div className="target">
                            <span className="label">Target</span>
                            <span className="value">{metric.target}</span>
                          </div>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="report-templates">
                <h4>📋 Report Templates</h4>
                <div className="templates-grid">
                  <div className="template-card">
                    <h5>📊 Executive Summary</h5>
                    <p>High-level overview for stakeholders</p>
                    <button className="use-template-btn">Use Template</button>
                  </div>
                  <div className="template-card">
                    <h5>📈 Performance Report</h5>
                    <p>Detailed metrics and trends</p>
                    <button className="use-template-btn">Use Template</button>
                  </div>
                  <div className="template-card">
                    <h5>🎯 Impact Assessment</h5>
                    <p>ROI and outcome analysis</p>
                    <button className="use-template-btn">Use Template</button>
                  </div>
                  <div className="template-card">
                    <h5>📋 Custom Format</h5>
                    <p>Build your own report structure</p>
                    <button className="use-template-btn">Use Template</button>
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

export default AdvancedAnalytics 