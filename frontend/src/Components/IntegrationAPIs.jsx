import React, { useState, useEffect } from 'react'
import './IntegrationAPIs.css'

const IntegrationAPIs = ({ variant = 'default' }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [apiStatus, setApiStatus] = useState({})
  const [webhookLogs, setWebhookLogs] = useState([])
  const [testResults, setTestResults] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Mock API configurations
  const apiConfigs = {
    sms: {
      name: 'SMS Gateway (Twilio)',
      status: 'active',
      endpoint: 'https://api.twilio.com/2010-04-01/Accounts/',
      rateLimit: '1000/hour',
      lastUsed: '2 minutes ago',
      successRate: 98.5,
      config: {
        accountSid: 'AC1234567890abcdef',
        authToken: '••••••••••••••••',
        fromNumber: '+254700000000'
      }
    },
    payments: {
      name: 'Payment Gateway (M-Pesa)',
      status: 'active',
      endpoint: 'https://sandbox.safaricom.co.ke/mpesa/',
      rateLimit: '500/hour',
      lastUsed: '5 minutes ago',
      successRate: 99.2,
      config: {
        consumerKey: '••••••••••••••••',
        consumerSecret: '••••••••••••••••',
        passkey: '••••••••••••••••'
      }
    },
    government: {
      name: 'Government Database (eCitizen)',
      status: 'maintenance',
      endpoint: 'https://api.ecitizen.go.ke/v1/',
      rateLimit: '100/hour',
      lastUsed: '1 hour ago',
      successRate: 95.8,
      config: {
        apiKey: '••••••••••••••••',
        clientId: '••••••••••••••••',
        environment: 'sandbox'
      }
    },
    maps: {
      name: 'Maps & Geocoding (Google)',
      status: 'active',
      endpoint: 'https://maps.googleapis.com/maps/api/',
      rateLimit: '2500/day',
      lastUsed: '30 minutes ago',
      successRate: 99.9,
      config: {
        apiKey: '••••••••••••••••',
        billingAccount: '••••••••••••••••'
      }
    },
    analytics: {
      name: 'Analytics (Google Analytics)',
      status: 'active',
      endpoint: 'https://analytics.googleapis.com/analytics/v3/',
      rateLimit: '10000/day',
      lastUsed: '15 minutes ago',
      successRate: 99.7,
      config: {
        trackingId: 'GA-123456789',
        propertyId: '123456789',
        apiKey: '••••••••••••••••'
      }
    }
  }

  // Mock webhook events
  const mockWebhookEvents = [
    {
      id: 1,
      event: 'beneficiary.registered',
      source: 'mobile_app',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: 'delivered',
      payload: { beneficiaryId: 'BEN001', name: 'Sarah Mwangi', location: 'Nairobi' },
      response: { status: 200, message: 'Success' }
    },
    {
      id: 2,
      event: 'payment.processed',
      source: 'mpesa_gateway',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      status: 'delivered',
      payload: { transactionId: 'TXN123', amount: 5000, beneficiaryId: 'BEN002' },
      response: { status: 200, message: 'Payment confirmed' }
    },
    {
      id: 3,
      event: 'sms.sent',
      source: 'twilio',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      status: 'delivered',
      payload: { messageId: 'MSG456', recipient: '+254700123456', content: 'Welcome to InclusiTrack!' },
      response: { status: 200, message: 'SMS delivered' }
    },
    {
      id: 4,
      event: 'data.synced',
      source: 'mobile_app',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      status: 'failed',
      payload: { syncId: 'SYNC789', records: 15, location: 'Kisumu' },
      response: { status: 500, message: 'Network timeout' }
    }
  ]

  // Mock API test scenarios
  const testScenarios = {
    sms: [
      { name: 'Send Welcome SMS', endpoint: '/sms/send', method: 'POST', expectedStatus: 200 },
      { name: 'Check SMS Status', endpoint: '/sms/status/{id}', method: 'GET', expectedStatus: 200 },
      { name: 'Get SMS History', endpoint: '/sms/history', method: 'GET', expectedStatus: 200 }
    ],
    payments: [
      { name: 'Initiate Payment', endpoint: '/payments/initiate', method: 'POST', expectedStatus: 200 },
      { name: 'Check Payment Status', endpoint: '/payments/status/{id}', method: 'GET', expectedStatus: 200 },
      { name: 'Process Refund', endpoint: '/payments/refund', method: 'POST', expectedStatus: 200 }
    ],
    government: [
      { name: 'Verify ID Number', endpoint: '/government/verify-id', method: 'POST', expectedStatus: 200 },
      { name: 'Get Citizen Info', endpoint: '/government/citizen/{id}', method: 'GET', expectedStatus: 200 },
      { name: 'Update Records', endpoint: '/government/update', method: 'PUT', expectedStatus: 200 }
    ]
  }

  useEffect(() => {
    // Initialize API status
    const statuses = {}
    Object.keys(apiConfigs).forEach(key => {
      statuses[key] = apiConfigs[key].status
    })
    setApiStatus(statuses)

    // Initialize webhook logs
    setWebhookLogs(mockWebhookEvents)

    // Initialize test results
    const results = {}
    Object.keys(testScenarios).forEach(api => {
      results[api] = testScenarios[api].map(test => ({
        ...test,
        status: 'pending',
        response: null,
        duration: null
      }))
    })
    setTestResults(results)
  }, [])

  const runApiTest = async (apiKey, testIndex) => {
    setIsLoading(true)
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const success = Math.random() > 0.1 // 90% success rate
    const duration = Math.floor(100 + Math.random() * 500)
    
    setTestResults(prev => ({
      ...prev,
      [apiKey]: prev[apiKey].map((test, index) => 
        index === testIndex ? {
          ...test,
          status: success ? 'success' : 'failed',
          response: success ? { status: test.expectedStatus, message: 'Test passed' } : { status: 500, message: 'Test failed' },
          duration
        } : test
      )
    }))
    
    setIsLoading(false)
  }

  const runAllTests = async (apiKey) => {
    setIsLoading(true)
    
    for (let i = 0; i < testResults[apiKey].length; i++) {
      await runApiTest(apiKey, i)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsLoading(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'maintenance': return 'warning'
      case 'error': return 'error'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🟢'
      case 'maintenance': return '🟡'
      case 'error': return '🔴'
      default: return '⚪'
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

  return (
    <div className={`integration-apis ${variant}`}>
      {/* Header */}
      <div className="integration-header">
        <div className="header-content">
          <h2>🔗 Integration APIs</h2>
          <p>Manage third-party integrations, webhooks, and API testing</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{Object.keys(apiConfigs).length}</span>
            <span className="stat-label">Active APIs</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{webhookLogs.filter(log => log.status === 'delivered').length}</span>
            <span className="stat-label">Webhooks Delivered</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="integration-tabs">
        <button 
          className={`integration-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 API Overview
        </button>
        <button 
          className={`integration-tab ${activeTab === 'webhooks' ? 'active' : ''}`}
          onClick={() => setActiveTab('webhooks')}
        >
          🔔 Webhooks
        </button>
        <button 
          className={`integration-tab ${activeTab === 'testing' ? 'active' : ''}`}
          onClick={() => setActiveTab('testing')}
        >
          🧪 API Testing
        </button>
        <button 
          className={`integration-tab ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          📚 Documentation
        </button>
      </div>

      {/* Tab Content */}
      <div className="integration-content">
        {/* API Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="api-grid">
              {Object.entries(apiConfigs).map(([key, config]) => (
                <div key={key} className="api-card">
                  <div className="api-header">
                    <div className="api-info">
                      <h3 className="api-name">{config.name}</h3>
                      <div className={`api-status ${getStatusColor(config.status)}`}>
                        {getStatusIcon(config.status)} {config.status}
                      </div>
                    </div>
                    <div className="api-actions">
                      <button className="action-button">⚙️</button>
                      <button className="action-button">📊</button>
                    </div>
                  </div>

                  <div className="api-details">
                    <div className="detail-row">
                      <span className="detail-label">Endpoint:</span>
                      <span className="detail-value">{config.endpoint}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Rate Limit:</span>
                      <span className="detail-value">{config.rateLimit}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Last Used:</span>
                      <span className="detail-value">{config.lastUsed}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Success Rate:</span>
                      <span className="detail-value success-rate">{config.successRate}%</span>
                    </div>
                  </div>

                  <div className="api-config">
                    <h4>Configuration</h4>
                    <div className="config-grid">
                      {Object.entries(config.config).map(([configKey, configValue]) => (
                        <div key={configKey} className="config-item">
                          <span className="config-key">{configKey}:</span>
                          <span className="config-value">{configValue}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="api-actions-bottom">
                    <button className="test-button">🧪 Test Connection</button>
                    <button className="view-button">👁️ View Logs</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div className="tab-content">
            <div className="webhooks-section">
              <div className="webhooks-header">
                <h3>🔔 Webhook Events</h3>
                <div className="webhook-stats">
                  <span className="stat">Total: {webhookLogs.length}</span>
                  <span className="stat success">Delivered: {webhookLogs.filter(log => log.status === 'delivered').length}</span>
                  <span className="stat error">Failed: {webhookLogs.filter(log => log.status === 'failed').length}</span>
                </div>
              </div>

              <div className="webhook-logs">
                {webhookLogs.map((log) => (
                  <div key={log.id} className={`webhook-log ${log.status}`}>
                    <div className="log-header">
                      <div className="log-event">
                        <span className="event-name">{log.event}</span>
                        <span className="event-source">from {log.source}</span>
                      </div>
                      <div className="log-status">
                        <span className={`status-badge ${log.status}`}>
                          {log.status === 'delivered' ? '✅' : '❌'} {log.status}
                        </span>
                        <span className="log-time">{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </div>

                    <div className="log-details">
                      <div className="log-payload">
                        <h4>Payload</h4>
                        <pre className="json-display">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>
                      <div className="log-response">
                        <h4>Response</h4>
                        <pre className="json-display">
                          {JSON.stringify(log.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="webhook-config">
                <h3>🔧 Webhook Configuration</h3>
                <div className="config-form">
                  <div className="form-group">
                    <label>Webhook URL</label>
                    <input 
                      type="url" 
                      placeholder="https://your-domain.com/webhooks/inclusitrack"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Secret Key</label>
                    <input 
                      type="password" 
                      placeholder="Enter webhook secret"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Events to Subscribe</label>
                    <div className="checkbox-group">
                      <label className="checkbox-item">
                        <input type="checkbox" defaultChecked />
                        <span>beneficiary.registered</span>
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" defaultChecked />
                        <span>payment.processed</span>
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" defaultChecked />
                        <span>sms.sent</span>
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" />
                        <span>data.synced</span>
                      </label>
                    </div>
                  </div>
                  <button className="save-button">💾 Save Configuration</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Testing Tab */}
        {activeTab === 'testing' && (
          <div className="tab-content">
            <div className="testing-section">
              <h3>🧪 API Testing Suite</h3>
              <p>Test your API integrations to ensure they're working correctly</p>

              {Object.entries(testResults).map(([apiKey, tests]) => (
                <div key={apiKey} className="test-suite">
                  <div className="suite-header">
                    <h4>{apiConfigs[apiKey]?.name || apiKey.toUpperCase()}</h4>
                    <button 
                      className="run-all-button"
                      onClick={() => runAllTests(apiKey)}
                      disabled={isLoading}
                    >
                      {isLoading ? '⏳ Running...' : '▶️ Run All Tests'}
                    </button>
                  </div>

                  <div className="test-cases">
                    {tests.map((test, index) => (
                      <div key={index} className={`test-case ${test.status}`}>
                        <div className="test-info">
                          <div className="test-name">{test.name}</div>
                          <div className="test-endpoint">
                            <span className="method">{test.method}</span>
                            <span className="endpoint">{test.endpoint}</span>
                          </div>
                        </div>
                        
                        <div className="test-actions">
                          <button 
                            className="run-test-button"
                            onClick={() => runApiTest(apiKey, index)}
                            disabled={isLoading}
                          >
                            {isLoading ? '⏳' : '▶️'}
                          </button>
                          
                          {test.status !== 'pending' && (
                            <div className="test-result">
                              <span className={`result-status ${test.status}`}>
                                {test.status === 'success' ? '✅' : '❌'} {test.status}
                              </span>
                              {test.duration && (
                                <span className="test-duration">{test.duration}ms</span>
                              )}
                            </div>
                          )}
                        </div>

                        {test.response && (
                          <div className="test-response">
                            <pre className="json-display">
                              {JSON.stringify(test.response, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <div className="tab-content">
            <div className="docs-section">
              <h3>📚 API Documentation</h3>
              
              <div className="docs-nav">
                <button className="doc-nav-item active">Authentication</button>
                <button className="doc-nav-item">SMS API</button>
                <button className="doc-nav-item">Payment API</button>
                <button className="doc-nav-item">Government API</button>
                <button className="doc-nav-item">Webhooks</button>
                <button className="doc-nav-item">Rate Limits</button>
              </div>

              <div className="docs-content">
                <div className="doc-section">
                  <h4>🔐 Authentication</h4>
                  <p>All API requests require authentication using API keys or OAuth tokens.</p>
                  
                  <div className="code-block">
                    <div className="code-header">
                      <span>Example Request</span>
                      <button className="copy-button">📋 Copy</button>
                    </div>
                    <pre className="code-content">
{`curl -X POST https://api.inclusitrack.com/v1/beneficiaries \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Sarah Mwangi",
    "age": 24,
    "location": "Nairobi",
    "needs": "Creative arts education"
  }'`}
                    </pre>
                  </div>

                  <div className="response-example">
                    <h5>Response</h5>
                    <pre className="json-display">
{`{
  "success": true,
  "data": {
    "id": "BEN001",
    "name": "Sarah Mwangi",
    "age": 24,
    "location": "Nairobi",
    "needs": "Creative arts education",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Beneficiary created successfully"
}`}
                    </pre>
                  </div>
                </div>

                <div className="doc-section">
                  <h4>📱 SMS API</h4>
                  <p>Send SMS notifications to beneficiaries and field workers.</p>
                  
                  <div className="endpoint-list">
                    <div className="endpoint-item">
                      <div className="endpoint-method post">POST</div>
                      <div className="endpoint-path">/api/v1/sms/send</div>
                      <div className="endpoint-desc">Send SMS message</div>
                    </div>
                    <div className="endpoint-item">
                      <div className="endpoint-method get">GET</div>
                      <div className="endpoint-path">/api/v1/sms/status/{'{id}'}</div>
                      <div className="endpoint-desc">Check SMS delivery status</div>
                    </div>
                    <div className="endpoint-item">
                      <div className="endpoint-method get">GET</div>
                      <div className="endpoint-path">/api/v1/sms/history</div>
                      <div className="endpoint-desc">Get SMS history</div>
                    </div>
                  </div>
                </div>

                <div className="doc-section">
                  <h4>💳 Payment API</h4>
                  <p>Process payments and manage financial transactions.</p>
                  
                  <div className="endpoint-list">
                    <div className="endpoint-item">
                      <div className="endpoint-method post">POST</div>
                      <div className="endpoint-path">/api/v1/payments/initiate</div>
                      <div className="endpoint-desc">Initiate payment</div>
                    </div>
                    <div className="endpoint-item">
                      <div className="endpoint-method get">GET</div>
                      <div className="endpoint-path">/api/v1/payments/status/{'{id}'}</div>
                      <div className="endpoint-desc">Check payment status</div>
                    </div>
                    <div className="endpoint-item">
                      <div className="endpoint-method post">POST</div>
                      <div className="endpoint-path">/api/v1/payments/refund</div>
                      <div className="endpoint-desc">Process refund</div>
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

export default IntegrationAPIs 