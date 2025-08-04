import React, { useState, useEffect } from 'react'
import ChartCard from "../Components/ChartCard"
import './Dashboard.css'

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalBeneficiaries: 1384,
    activePrograms: 25,
    dataPoints: 12847,
    impactScore: 94,
    vulnerableGroups: {
      refugees: 234,
      lgbtq: 156,
      disabled: 189,
      lowIncome: 445,
      creatives: 298,
      rural: 62
    },
    financialInclusion: {
      withBankAccount: 67,
      withMobileMoney: 89,
      withInsurance: 23,
      withSavings: 45
    },
    deviceAccess: {
      smartphone: 78,
      basicPhone: 15,
      computer: 12,
      noDevice: 5
    }
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'beneficiary', message: 'New refugee beneficiary registered', time: '2 hours ago' },
    { id: 2, type: 'fund', message: 'Creative arts fund allocated - $15,000', time: '4 hours ago' },
    { id: 3, type: 'survey', message: 'LGBTQ+ inclusion survey completed', time: '6 hours ago' },
    { id: 4, type: 'beneficiary', message: 'Disability support program enrollment', time: '1 day ago' }
  ])

  const [priorityAreas, setPriorityAreas] = useState([
    { area: 'Digital Literacy', priority: 'High', beneficiaries: 234, completion: 65 },
    { area: 'Financial Inclusion', priority: 'High', beneficiaries: 445, completion: 78 },
    { area: 'Creative Skills', priority: 'Medium', beneficiaries: 298, completion: 45 },
    { area: 'Mental Health Support', priority: 'Medium', beneficiaries: 156, completion: 32 }
  ])

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">Impact Dashboard</h1>
            <p className="dashboard-subtitle">
              Real-time insights into community empowerment and cultural inclusion initiatives
            </p>
          </div>
          <div className="dashboard-meta">
            <div className="last-updated">
              <span className="last-updated-label">Last updated:</span>
              <span className="last-updated-time">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-card-header">
              <div className="metric-icon">
                <span>👥</span>
              </div>
              <div className="metric-trend positive">
                <span>+12%</span>
                <span className="trend-period">this month</span>
              </div>
            </div>
            <div className="metric-card-content">
              <h3 className="metric-value">{stats.totalBeneficiaries.toLocaleString()}</h3>
              <p className="metric-label">Total Beneficiaries</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-card-header">
              <div className="metric-icon">
                <span>📊</span>
              </div>
              <div className="metric-trend positive">
                <span>+3</span>
                <span className="trend-period">new programs</span>
              </div>
            </div>
            <div className="metric-card-content">
              <h3 className="metric-value">{stats.activePrograms}</h3>
              <p className="metric-label">Active Programs</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-card-header">
              <div className="metric-icon">
                <span>📈</span>
              </div>
              <div className="metric-trend positive">
                <span>+1,247</span>
                <span className="trend-period">this week</span>
              </div>
            </div>
            <div className="metric-card-content">
              <h3 className="metric-value">{stats.dataPoints.toLocaleString()}</h3>
              <p className="metric-label">Data Points Collected</p>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-card-header">
              <div className="metric-icon">
                <span>🎯</span>
              </div>
              <div className="metric-trend positive">
                <span>+2%</span>
                <span className="trend-period">improvement</span>
              </div>
            </div>
            <div className="metric-card-content">
              <h3 className="metric-value">{stats.impactScore}%</h3>
              <p className="metric-label">Impact Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-grid">
          <ChartCard 
            title="Vulnerable Groups Distribution" 
            chartType="doughnut" 
            className="chart-card-large"
          />
          <ChartCard 
            title="Financial Inclusion Progress" 
            chartType="bar" 
            className="chart-card-large"
          />
        </div>
      </div>

      {/* Vulnerable Groups Breakdown */}
      <div className="groups-section">
        <div className="section-header">
          <h2 className="section-title">Vulnerable Groups Impact</h2>
          <p className="section-subtitle">Detailed breakdown of support across different communities</p>
        </div>
        <div className="groups-grid">
          <div className="group-card">
            <div className="group-card-header">
              <div className="group-icon">
                <span>🏕️</span>
              </div>
              <div className="group-info">
                <h3 className="group-title">Refugees & Displaced</h3>
                <span className="group-subtitle">Supporting displaced communities</span>
              </div>
            </div>
            <div className="group-card-content">
              <div className="group-stats">
                <div className="group-stat">
                  <span className="group-stat-value">{stats.vulnerableGroups.refugees}</span>
                  <span className="group-stat-label">Beneficiaries</span>
                </div>
                <div className="group-stat">
                  <span className="group-stat-value">89%</span>
                  <span className="group-stat-label">Success Rate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group-card">
            <div className="group-card-header">
              <div className="group-icon">
                <span>🌈</span>
              </div>
              <div className="group-info">
                <h3 className="group-title">LGBTQ+ Community</h3>
                <span className="group-subtitle">Inclusive support programs</span>
              </div>
            </div>
            <div className="group-card-content">
              <div className="group-stats">
                <div className="group-stat">
                  <span className="group-stat-value">{stats.vulnerableGroups.lgbtq}</span>
                  <span className="group-stat-label">Beneficiaries</span>
                </div>
                <div className="group-stat">
                  <span className="group-stat-value">92%</span>
                  <span className="group-stat-label">Success Rate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group-card">
            <div className="group-card-header">
              <div className="group-icon">
                <span>♿</span>
              </div>
              <div className="group-info">
                <h3 className="group-title">Persons with Disabilities</h3>
                <span className="group-subtitle">Accessible support services</span>
              </div>
            </div>
            <div className="group-card-content">
              <div className="group-stats">
                <div className="group-stat">
                  <span className="group-stat-value">{stats.vulnerableGroups.disabled}</span>
                  <span className="group-stat-label">Beneficiaries</span>
                </div>
                <div className="group-stat">
                  <span className="group-stat-value">87%</span>
                  <span className="group-stat-label">Success Rate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group-card">
            <div className="group-card-header">
              <div className="group-icon">
                <span>🎨</span>
              </div>
              <div className="group-info">
                <h3 className="group-title">Creative Artists</h3>
                <span className="group-subtitle">Arts and culture support</span>
              </div>
            </div>
            <div className="group-card-content">
              <div className="group-stats">
                <div className="group-stat">
                  <span className="group-stat-value">{stats.vulnerableGroups.creatives}</span>
                  <span className="group-stat-label">Beneficiaries</span>
                </div>
                <div className="group-stat">
                  <span className="group-stat-value">94%</span>
                  <span className="group-stat-label">Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Areas & Recent Activity */}
      <div className="bottom-section">
        <div className="priority-areas">
          <div className="section-header">
            <h2 className="section-title">Priority Intervention Areas</h2>
            <p className="section-subtitle">Current focus areas and progress tracking</p>
          </div>
          <div className="priority-list">
            {priorityAreas.map((area, index) => (
              <div key={index} className="priority-item">
                <div className="priority-item-header">
                  <div className="priority-info">
                    <h4 className="priority-title">{area.area}</h4>
                    <span className={`priority-badge ${area.priority.toLowerCase()}`}>
                      {area.priority} Priority
                    </span>
                  </div>
                  <div className="priority-completion">
                    <span className="completion-percentage">{area.completion}%</span>
                  </div>
                </div>
                <div className="priority-item-content">
                  <div className="priority-stats">
                    <span className="beneficiaries-count">{area.beneficiaries} beneficiaries</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${area.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-activity">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <p className="section-subtitle">Latest updates and system activities</p>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'beneficiary' && '👤'}
                  {activity.type === 'fund' && '💰'}
                  {activity.type === 'survey' && '📋'}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard