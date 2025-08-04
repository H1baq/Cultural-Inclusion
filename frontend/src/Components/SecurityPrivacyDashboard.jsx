import React, { useState, useEffect } from 'react'
import './SecurityPrivacyDashboard.css'

const SecurityPrivacyDashboard = ({ variant = 'default' }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [securityStatus, setSecurityStatus] = useState('secure')
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    analytics: true,
    notifications: true,
    locationTracking: false,
    thirdPartyAccess: false
  })
  const [accessLogs, setAccessLogs] = useState([])
  const [securityAlerts, setSecurityAlerts] = useState([])
  const [complianceStatus, setComplianceStatus] = useState({})

  // Mock security metrics
  const securityMetrics = {
    totalUsers: 1247,
    activeSessions: 89,
    failedLogins: 12,
    suspiciousActivities: 3,
    dataBreaches: 0,
    lastScan: '2 hours ago',
    securityScore: 94,
    complianceScore: 87
  }

  // Mock access logs
  const mockAccessLogs = [
    {
      id: 1,
      user: 'admin@inclusitrack.com',
      action: 'Login',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      ipAddress: '192.168.1.100',
      location: 'Nairobi, Kenya',
      device: 'Chrome on Windows',
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 2,
      user: 'fieldworker@inclusitrack.com',
      action: 'View Beneficiary Data',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      ipAddress: '192.168.1.101',
      location: 'Kisumu, Kenya',
      device: 'Safari on iPhone',
      status: 'success',
      riskLevel: 'low'
    },
    {
      id: 3,
      user: 'unknown@example.com',
      action: 'Failed Login Attempt',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      ipAddress: '203.45.67.89',
      location: 'Unknown',
      device: 'Unknown',
      status: 'failed',
      riskLevel: 'high'
    },
    {
      id: 4,
      user: 'manager@inclusitrack.com',
      action: 'Export Data',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      ipAddress: '192.168.1.102',
      location: 'Mombasa, Kenya',
      device: 'Firefox on Mac',
      status: 'success',
      riskLevel: 'medium'
    },
    {
      id: 5,
      user: 'analyst@inclusitrack.com',
      action: 'Generate Report',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      ipAddress: '192.168.1.103',
      location: 'Nakuru, Kenya',
      device: 'Edge on Windows',
      status: 'success',
      riskLevel: 'low'
    }
  ]

  // Mock security alerts
  const mockSecurityAlerts = [
    {
      id: 1,
      type: 'suspicious_login',
      severity: 'medium',
      title: 'Suspicious Login Attempt',
      description: 'Multiple failed login attempts from unknown IP address',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      status: 'investigating',
      affectedUser: 'unknown@example.com',
      ipAddress: '203.45.67.89'
    },
    {
      id: 2,
      type: 'data_access',
      severity: 'low',
      title: 'Unusual Data Access Pattern',
      description: 'Large volume of data accessed outside normal hours',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'resolved',
      affectedUser: 'analyst@inclusitrack.com',
      ipAddress: '192.168.1.103'
    },
    {
      id: 3,
      type: 'permission_change',
      severity: 'high',
      title: 'Admin Permission Modified',
      description: 'User permissions changed for sensitive data access',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'investigating',
      affectedUser: 'admin@inclusitrack.com',
      ipAddress: '192.168.1.100'
    }
  ]

  // Mock compliance status
  const mockComplianceStatus = {
    gdpr: {
      status: 'compliant',
      score: 92,
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15',
      requirements: [
        { name: 'Data Consent', status: 'compliant' },
        { name: 'Right to Access', status: 'compliant' },
        { name: 'Right to Erasure', status: 'compliant' },
        { name: 'Data Portability', status: 'compliant' },
        { name: 'Breach Notification', status: 'compliant' }
      ]
    },
    hipaa: {
      status: 'compliant',
      score: 88,
      lastAudit: '2024-01-10',
      nextAudit: '2024-07-10',
      requirements: [
        { name: 'Privacy Rule', status: 'compliant' },
        { name: 'Security Rule', status: 'compliant' },
        { name: 'Breach Notification', status: 'compliant' },
        { name: 'Administrative Safeguards', status: 'compliant' },
        { name: 'Physical Safeguards', status: 'needs_attention' }
      ]
    },
    kenyaDataProtection: {
      status: 'compliant',
      score: 85,
      lastAudit: '2024-01-20',
      nextAudit: '2024-07-20',
      requirements: [
        { name: 'Data Registration', status: 'compliant' },
        { name: 'Consent Management', status: 'compliant' },
        { name: 'Data Localization', status: 'compliant' },
        { name: 'Breach Reporting', status: 'compliant' },
        { name: 'Cross-border Transfer', status: 'needs_attention' }
      ]
    }
  }

  useEffect(() => {
    // Initialize mock data
    setAccessLogs(mockAccessLogs)
    setSecurityAlerts(mockSecurityAlerts)
    setComplianceStatus(mockComplianceStatus)
  }, [])

  const getSecurityStatusColor = (status) => {
    switch (status) {
      case 'secure': return 'success'
      case 'warning': return 'warning'
      case 'critical': return 'error'
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success'
      case 'failed': return 'error'
      case 'investigating': return 'warning'
      case 'resolved': return 'success'
      default: return 'secondary'
    }
  }

  const getComplianceStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'success'
      case 'needs_attention': return 'warning'
      case 'non_compliant': return 'error'
      default: return 'secondary'
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

  const updatePrivacySetting = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const runSecurityScan = () => {
    // Simulate security scan
    console.log('Running security scan...')
    // In a real app, this would trigger actual security checks
  }

  const exportAuditLog = () => {
    // Simulate audit log export
    console.log('Exporting audit log...')
    // In a real app, this would generate and download a report
  }

  return (
    <div className={`security-privacy-dashboard ${variant}`}>
      {/* Header */}
      <div className="security-header">
        <div className="header-content">
          <h2>🔒 Security & Privacy Dashboard</h2>
          <p>Comprehensive security monitoring and privacy controls</p>
        </div>
        <div className="security-status">
          <div className={`status-indicator ${getSecurityStatusColor(securityStatus)}`}>
            <span className="status-icon">
              {securityStatus === 'secure' ? '🟢' : securityStatus === 'warning' ? '🟡' : '🔴'}
            </span>
            <span className="status-text">
              {securityStatus === 'secure' ? 'Secure' : securityStatus === 'warning' ? 'Warning' : 'Critical'}
            </span>
          </div>
          <div className="security-score">
            <span className="score-number">{securityMetrics.securityScore}</span>
            <span className="score-label">Security Score</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="security-tabs">
        <button 
          className={`security-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Security Overview
        </button>
        <button 
          className={`security-tab ${activeTab === 'access' ? 'active' : ''}`}
          onClick={() => setActiveTab('access')}
        >
          👥 Access Control
        </button>
        <button 
          className={`security-tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          📋 Audit Trails
        </button>
        <button 
          className={`security-tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Security Alerts
        </button>
        <button 
          className={`security-tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          🛡️ Privacy Controls
        </button>
        <button 
          className={`security-tab ${activeTab === 'compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('compliance')}
        >
          📋 Compliance
        </button>
      </div>

      {/* Tab Content */}
      <div className="security-content">
        {/* Security Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="overview-section">
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">👥</div>
                  <div className="metric-info">
                    <span className="metric-number">{securityMetrics.totalUsers}</span>
                    <span className="metric-label">Total Users</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">🟢</div>
                  <div className="metric-info">
                    <span className="metric-number">{securityMetrics.activeSessions}</span>
                    <span className="metric-label">Active Sessions</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">❌</div>
                  <div className="metric-info">
                    <span className="metric-number">{securityMetrics.failedLogins}</span>
                    <span className="metric-label">Failed Logins</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">⚠️</div>
                  <div className="metric-info">
                    <span className="metric-number">{securityMetrics.suspiciousActivities}</span>
                    <span className="metric-label">Suspicious Activities</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">🔒</div>
                  <div className="metric-info">
                    <span className="metric-number">{securityMetrics.dataBreaches}</span>
                    <span className="metric-label">Data Breaches</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">🕒</div>
                  <div className="metric-info">
                    <span className="metric-number">{securityMetrics.lastScan}</span>
                    <span className="metric-label">Last Security Scan</span>
                  </div>
                </div>
              </div>

              <div className="security-actions">
                <button className="action-button primary" onClick={runSecurityScan}>
                  🔍 Run Security Scan
                </button>
                <button className="action-button secondary" onClick={exportAuditLog}>
                  📊 Export Audit Log
                </button>
              </div>

              <div className="security-overview">
                <h3>🔍 Security Overview</h3>
                <div className="overview-grid">
                  <div className="overview-card">
                    <h4>🛡️ System Security</h4>
                    <div className="security-item">
                      <span className="item-label">Firewall Status:</span>
                      <span className="item-value success">Active</span>
                    </div>
                    <div className="security-item">
                      <span className="item-label">SSL Certificate:</span>
                      <span className="item-value success">Valid</span>
                    </div>
                    <div className="security-item">
                      <span className="item-label">Encryption:</span>
                      <span className="item-value success">AES-256</span>
                    </div>
                    <div className="security-item">
                      <span className="item-label">Backup Status:</span>
                      <span className="item-value success">Up to Date</span>
                    </div>
                  </div>

                  <div className="overview-card">
                    <h4>👥 User Security</h4>
                    <div className="security-item">
                      <span className="item-label">2FA Enabled:</span>
                      <span className="item-value success">89%</span>
                    </div>
                    <div className="security-item">
                      <span className="item-label">Strong Passwords:</span>
                      <span className="item-value success">94%</span>
                    </div>
                    <div className="security-item">
                      <span className="item-label">Session Timeout:</span>
                      <span className="item-value success">30 min</span>
                    </div>
                    <div className="security-item">
                      <span className="item-label">Failed Login Lockout:</span>
                      <span className="item-value success">5 attempts</span>
                    </div>
                  </div>

                  <div className="overview-card">
                    <h4>📊 Data Protection</h4>
                    <div className="security-item">
                      <span className="item-label">Data Encryption:</span>
                      <span className="item-value success">At Rest & Transit</span>
                    </div>
                    <div className="security-item">
                      <span className="item-label">Access Logging:</span>
                      <span className="item-value success">100%</span>
                    </div>
                    <div className="security-item">
                      <span className="item-label">Data Retention:</span>
                      <span className="item-value success">7 years</span>
                    </div>
                    <div className="security-item">
                      <span className="item-label">Backup Encryption:</span>
                      <span className="item-value success">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Access Control Tab */}
        {activeTab === 'access' && (
          <div className="tab-content">
            <div className="access-section">
              <div className="access-header">
                <h3>👥 Access Control Management</h3>
                <button className="add-user-button">➕ Add User</button>
              </div>

              <div className="access-controls">
                <div className="control-group">
                  <h4>🔐 Authentication Settings</h4>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input type="checkbox" defaultChecked />
                      <span>Require Two-Factor Authentication</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input type="checkbox" defaultChecked />
                      <span>Enforce Strong Password Policy</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input type="checkbox" defaultChecked />
                      <span>Session Timeout After Inactivity</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input type="checkbox" />
                      <span>Require IP Whitelist</span>
                    </label>
                  </div>
                </div>

                <div className="control-group">
                  <h4>👤 User Permissions</h4>
                  <div className="permission-matrix">
                    <div className="permission-header">
                      <span>Role</span>
                      <span>View Data</span>
                      <span>Edit Data</span>
                      <span>Export Data</span>
                      <span>Admin Access</span>
                    </div>
                    <div className="permission-row">
                      <span className="role-name">Admin</span>
                      <span className="permission-yes">✓</span>
                      <span className="permission-yes">✓</span>
                      <span className="permission-yes">✓</span>
                      <span className="permission-yes">✓</span>
                    </div>
                    <div className="permission-row">
                      <span className="role-name">Manager</span>
                      <span className="permission-yes">✓</span>
                      <span className="permission-yes">✓</span>
                      <span className="permission-yes">✓</span>
                      <span className="permission-no">✗</span>
                    </div>
                    <div className="permission-row">
                      <span className="role-name">Field Worker</span>
                      <span className="permission-yes">✓</span>
                      <span className="permission-limited">Limited</span>
                      <span className="permission-no">✗</span>
                      <span className="permission-no">✗</span>
                    </div>
                    <div className="permission-row">
                      <span className="role-name">Viewer</span>
                      <span className="permission-yes">✓</span>
                      <span className="permission-no">✗</span>
                      <span className="permission-no">✗</span>
                      <span className="permission-no">✗</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Trails Tab */}
        {activeTab === 'audit' && (
          <div className="tab-content">
            <div className="audit-section">
              <div className="audit-header">
                <h3>📋 Audit Trail & Activity Logs</h3>
                <div className="audit-filters">
                  <select className="filter-select">
                    <option>All Actions</option>
                    <option>Login/Logout</option>
                    <option>Data Access</option>
                    <option>Data Modification</option>
                    <option>Export/Import</option>
                  </select>
                  <select className="filter-select">
                    <option>All Users</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Field Worker</option>
                  </select>
                  <button className="export-button" onClick={exportAuditLog}>
                    📊 Export Log
                  </button>
                </div>
              </div>

              <div className="audit-logs">
                {accessLogs.map((log) => (
                  <div key={log.id} className={`audit-log-item ${log.status}`}>
                    <div className="log-header">
                      <div className="log-user">
                        <span className="user-email">{log.user}</span>
                        <span className="log-action">{log.action}</span>
                      </div>
                      <div className="log-meta">
                        <span className={`log-status ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                        <span className="log-time">{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </div>
                    <div className="log-details">
                      <div className="detail-item">
                        <span className="detail-label">IP Address:</span>
                        <span className="detail-value">{log.ipAddress}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{log.location}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Device:</span>
                        <span className="detail-value">{log.device}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Risk Level:</span>
                        <span className={`risk-level ${getSeverityColor(log.riskLevel)}`}>
                          {log.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="tab-content">
            <div className="alerts-section">
              <div className="alerts-header">
                <h3>🚨 Security Alerts & Incidents</h3>
                <div className="alerts-summary">
                  <span className="alert-count">{securityAlerts.length} Active Alerts</span>
                  <span className="alert-critical">
                    {securityAlerts.filter(alert => alert.severity === 'high' || alert.severity === 'critical').length} Critical
                  </span>
                </div>
              </div>

              <div className="alerts-list">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className={`alert-item ${alert.severity}`}>
                    <div className="alert-header">
                      <div className="alert-info">
                        <span className={`alert-severity ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <h4 className="alert-title">{alert.title}</h4>
                      </div>
                      <div className="alert-meta">
                        <span className={`alert-status ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                        <span className="alert-time">{formatTimestamp(alert.timestamp)}</span>
                      </div>
                    </div>
                    <div className="alert-content">
                      <p className="alert-description">{alert.description}</p>
                      <div className="alert-details">
                        <div className="detail-item">
                          <span className="detail-label">Affected User:</span>
                          <span className="detail-value">{alert.affectedUser}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">IP Address:</span>
                          <span className="detail-value">{alert.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                    <div className="alert-actions">
                      <button className="action-button">🔍 Investigate</button>
                      <button className="action-button">✅ Resolve</button>
                      <button className="action-button">📧 Notify</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Privacy Controls Tab */}
        {activeTab === 'privacy' && (
          <div className="tab-content">
            <div className="privacy-section">
              <h3>🛡️ Privacy Controls & Data Protection</h3>
              
              <div className="privacy-settings">
                <div className="setting-group">
                  <h4>📊 Data Sharing & Analytics</h4>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input 
                        type="checkbox" 
                        checked={privacySettings.dataSharing}
                        onChange={(e) => updatePrivacySetting('dataSharing', e.target.checked)}
                      />
                      <span>Allow Data Sharing for Research</span>
                    </label>
                    <p className="setting-description">Share anonymized data for research and improvement purposes</p>
                  </div>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input 
                        type="checkbox" 
                        checked={privacySettings.analytics}
                        onChange={(e) => updatePrivacySetting('analytics', e.target.checked)}
                      />
                      <span>Enable Analytics Tracking</span>
                    </label>
                    <p className="setting-description">Track usage patterns to improve user experience</p>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>🔔 Notifications & Communication</h4>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input 
                        type="checkbox" 
                        checked={privacySettings.notifications}
                        onChange={(e) => updatePrivacySetting('notifications', e.target.checked)}
                      />
                      <span>Receive Email Notifications</span>
                    </label>
                    <p className="setting-description">Get updates about your account and data</p>
                  </div>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input 
                        type="checkbox" 
                        checked={privacySettings.locationTracking}
                        onChange={(e) => updatePrivacySetting('locationTracking', e.target.checked)}
                      />
                      <span>Allow Location Tracking</span>
                    </label>
                    <p className="setting-description">Track location for field work and safety purposes</p>
                  </div>
                </div>

                <div className="setting-group">
                  <h4>🔗 Third-Party Access</h4>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input 
                        type="checkbox" 
                        checked={privacySettings.thirdPartyAccess}
                        onChange={(e) => updatePrivacySetting('thirdPartyAccess', e.target.checked)}
                      />
                      <span>Allow Third-Party Integrations</span>
                    </label>
                    <p className="setting-description">Connect with external services and APIs</p>
                  </div>
                </div>
              </div>

              <div className="data-rights">
                <h4>📋 Your Data Rights</h4>
                <div className="rights-grid">
                  <div className="right-item">
                    <div className="right-icon">👁️</div>
                    <h5>Right to Access</h5>
                    <p>Request a copy of all your personal data</p>
                    <button className="right-button">Request Data</button>
                  </div>
                  <div className="right-item">
                    <div className="right-icon">✏️</div>
                    <h5>Right to Rectification</h5>
                    <p>Correct inaccurate or incomplete data</p>
                    <button className="right-button">Update Data</button>
                  </div>
                  <div className="right-item">
                    <div className="right-icon">🗑️</div>
                    <h5>Right to Erasure</h5>
                    <p>Request deletion of your personal data</p>
                    <button className="right-button">Delete Data</button>
                  </div>
                  <div className="right-item">
                    <div className="right-icon">📤</div>
                    <h5>Right to Portability</h5>
                    <p>Export your data in a machine-readable format</p>
                    <button className="right-button">Export Data</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="tab-content">
            <div className="compliance-section">
              <h3>📋 Compliance & Regulatory Status</h3>
              
              <div className="compliance-overview">
                <div className="compliance-score">
                  <span className="score-number">{securityMetrics.complianceScore}</span>
                  <span className="score-label">Overall Compliance Score</span>
                </div>
              </div>

              <div className="compliance-frameworks">
                {Object.entries(complianceStatus).map(([framework, data]) => (
                  <div key={framework} className="framework-card">
                    <div className="framework-header">
                      <h4>{framework.toUpperCase()}</h4>
                      <div className="framework-status">
                        <span className={`status-badge ${getComplianceStatusColor(data.status)}`}>
                          {data.status.replace('_', ' ')}
                        </span>
                        <span className="compliance-score">{data.score}%</span>
                      </div>
                    </div>
                    
                    <div className="framework-details">
                      <div className="detail-row">
                        <span className="detail-label">Last Audit:</span>
                        <span className="detail-value">{data.lastAudit}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Next Audit:</span>
                        <span className="detail-value">{data.nextAudit}</span>
                      </div>
                    </div>

                    <div className="requirements-list">
                      <h5>Requirements Status</h5>
                      {data.requirements.map((req, index) => (
                        <div key={index} className="requirement-item">
                          <span className="requirement-name">{req.name}</span>
                          <span className={`requirement-status ${getComplianceStatusColor(req.status)}`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="compliance-actions">
                <h4>🔧 Compliance Actions</h4>
                <div className="action-buttons">
                  <button className="action-button">📊 Generate Compliance Report</button>
                  <button className="action-button">🔍 Schedule Audit</button>
                  <button className="action-button">📋 Update Policies</button>
                  <button className="action-button">👥 Staff Training</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SecurityPrivacyDashboard 