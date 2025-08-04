import React, { useState, useEffect } from 'react'
import Card from '../Components/Card'
import './AdminDashboard.css'

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('approvals')
  const [pendingUsers, setPendingUsers] = useState([])
  const [appeals, setAppeals] = useState([])
  const [verificationRecommendations, setVerificationRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [approvalComment, setApprovalComment] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      if (activeTab === 'approvals') {
        const response = await fetch('http://localhost:5002/api/auth/pending-approvals', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setPendingUsers(data)
        }
      } else if (activeTab === 'appeals') {
        const response = await fetch('http://localhost:5002/api/auth/appeals', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setAppeals(data)
        }
      } else if (activeTab === 'verification') {
        const response = await fetch('http://localhost:5002/api/auth/verification-recommendations', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setVerificationRecommendations(data)
        }
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproval = async (userId, approvalStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/auth/update-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          approvalStatus,
          approvalComment: approvalComment || undefined,
          rejectionReason: rejectionReason || undefined
        })
      })

      if (response.ok) {
        setPendingUsers(prev => prev.filter(user => user._id !== userId))
        setApprovalComment('')
        setRejectionReason('')
        alert(`User ${approvalStatus} successfully`)
      } else {
        setError('Failed to update approval status')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const handleAppealResponse = async (userId, appealStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/auth/update-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          approvalStatus: appealStatus === 'approved' ? 'approved' : 'rejected',
          approvalComment: `Appeal ${appealStatus}`,
          rejectionReason: appealStatus === 'rejected' ? 'Appeal rejected' : undefined
        })
      })

      if (response.ok) {
        setAppeals(prev => prev.filter(user => user._id !== userId))
        alert(`Appeal ${appealStatus} successfully`)
      } else {
        setError('Failed to update appeal status')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '👑'
      case 'officer': return '👮'
      case 'beneficiary': return '👤'
      default: return '👤'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'admin'
      case 'officer': return 'officer'
      case 'beneficiary': return 'beneficiary'
      default: return 'default'
    }
  }

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'success'
      case 'medium': return 'warning'
      case 'high': return 'error'
      default: return 'default'
    }
  }

  const getTrustScoreColor = (score) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title-section">
            <h1 className="admin-title">🔐 Admin Dashboard</h1>
            <p className="admin-subtitle">
              Manage user approvals, appeals, and verification processes
            </p>
          </div>
          <div className="admin-meta">
            <div className="admin-user-info">
              <span className="admin-user-label">Logged in as:</span>
              <span className="admin-user-name">{user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="admin-stats-section">
        <div className="admin-stats-grid">
          <Card variant="primary" className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3 className="stat-value">{pendingUsers.length}</h3>
                <p className="stat-label">Pending Approvals</p>
              </div>
            </div>
          </Card>
          
          <Card variant="warning" className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon">⚖️</div>
              <div className="stat-info">
                <h3 className="stat-value">{appeals.length}</h3>
                <p className="stat-label">Pending Appeals</p>
              </div>
            </div>
          </Card>
          
          <Card variant="error" className="stat-card">
            <div className="stat-card-content">
              <div className="stat-icon">🔍</div>
              <div className="stat-info">
                <h3 className="stat-value">{verificationRecommendations.length}</h3>
                <p className="stat-label">Verification Needed</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card variant="error" className="error-card">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        </Card>
      )}

      {/* Admin Tabs */}
      <div className="admin-tabs-section">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            <span className="tab-icon">📋</span>
            <span className="tab-label">Pending Approvals</span>
            <span className="tab-count">({pendingUsers.length})</span>
          </button>
          <button 
            className={`admin-tab ${activeTab === 'appeals' ? 'active' : ''}`}
            onClick={() => setActiveTab('appeals')}
          >
            <span className="tab-icon">⚖️</span>
            <span className="tab-label">Appeals</span>
            <span className="tab-count">({appeals.length})</span>
          </button>
          <button 
            className={`admin-tab ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            <span className="tab-icon">🔍</span>
            <span className="tab-label">Verification</span>
            <span className="tab-count">({verificationRecommendations.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content-section">
        {/* Pending Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="tab-content">
            <div className="section-header">
              <h2 className="section-title">📋 Pending User Approvals</h2>
              <p className="section-subtitle">Review and approve new user registration requests</p>
            </div>
            
            {pendingUsers.length === 0 ? (
              <Card variant="success" className="empty-state-card">
                <div className="empty-state">
                  <div className="empty-icon">✅</div>
                  <h3 className="empty-title">No Pending Approvals</h3>
                  <p className="empty-description">All user registration requests have been processed.</p>
                </div>
              </Card>
            ) : (
              <div className="pending-users-grid">
                {pendingUsers.map(user => (
                  <Card key={user._id} variant="default" className="user-card">
                    <div className="user-card-header">
                      <div className="user-avatar">
                        <span className="role-icon">{getRoleIcon(user.role)}</span>
                      </div>
                      <div className="user-info">
                        <h3 className="user-name">{user.name}</h3>
                        <span className={`role-badge ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                      <div className="user-metrics">
                        <span className={`trust-badge ${getTrustScoreColor(user.trustScore)}`}>
                          Trust: {user.trustScore}%
                        </span>
                        <span className={`risk-badge ${getRiskLevelColor(user.riskLevel)}`}>
                          {user.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                    </div>

                    <div className="user-card-content">
                      <div className="user-details">
                        <div className="detail-item">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value">{user.email}</span>
                        </div>
                        {user.phoneNumber && (
                          <div className="detail-item">
                            <span className="detail-label">Phone:</span>
                            <span className="detail-value">{user.phoneNumber}</span>
                          </div>
                        )}
                        {user.location && (
                          <div className="detail-item">
                            <span className="detail-label">Location:</span>
                            <span className="detail-value">{user.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="approval-actions">
                        <div className="approval-inputs">
                          <input
                            type="text"
                            placeholder="Approval comment (optional)"
                            value={approvalComment}
                            onChange={(e) => setApprovalComment(e.target.value)}
                            className="approval-input"
                          />
                          <input
                            type="text"
                            placeholder="Rejection reason (optional)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="approval-input"
                          />
                        </div>
                        <div className="approval-buttons">
                          <button
                            className="approve-button"
                            onClick={() => handleApproval(user._id, 'approved')}
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="reject-button"
                            onClick={() => handleApproval(user._id, 'rejected')}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appeals Tab */}
        {activeTab === 'appeals' && (
          <div className="tab-content">
            <div className="section-header">
              <h2 className="section-title">⚖️ User Appeals</h2>
              <p className="section-subtitle">Review and respond to user appeals</p>
            </div>
            
            {appeals.length === 0 ? (
              <Card variant="success" className="empty-state-card">
                <div className="empty-state">
                  <div className="empty-icon">✅</div>
                  <h3 className="empty-title">No Pending Appeals</h3>
                  <p className="empty-description">All appeals have been processed.</p>
                </div>
              </Card>
            ) : (
              <div className="appeals-grid">
                {appeals.map(user => (
                  <Card key={user._id} variant="warning" className="appeal-card">
                    <div className="appeal-card-header">
                      <div className="user-avatar">
                        <span className="role-icon">{getRoleIcon(user.role)}</span>
                      </div>
                      <div className="user-info">
                        <h3 className="user-name">{user.name}</h3>
                        <span className={`role-badge ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="appeal-card-content">
                      <div className="appeal-details">
                        <div className="detail-item">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value">{user.email}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Appeal Date:</span>
                          <span className="detail-value">{new Date(user.appealDate).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Original Status:</span>
                          <span className="detail-value rejected">{user.originalStatus}</span>
                        </div>
                      </div>

                      <div className="appeal-actions">
                        <button
                          className="approve-button"
                          onClick={() => handleAppealResponse(user._id, 'approved')}
                        >
                          ✅ Approve Appeal
                        </button>
                        <button
                          className="reject-button"
                          onClick={() => handleAppealResponse(user._id, 'rejected')}
                        >
                          ❌ Reject Appeal
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Verification Tab */}
        {activeTab === 'verification' && (
          <div className="tab-content">
            <div className="section-header">
              <h2 className="section-title">🔍 Verification Recommendations</h2>
              <p className="section-subtitle">Review users requiring additional verification</p>
            </div>
            
            {verificationRecommendations.length === 0 ? (
              <Card variant="success" className="empty-state-card">
                <div className="empty-state">
                  <div className="empty-icon">✅</div>
                  <h3 className="empty-title">No Verification Needed</h3>
                  <p className="empty-description">All users have been properly verified.</p>
                </div>
              </Card>
            ) : (
              <div className="verification-grid">
                {verificationRecommendations.map(user => (
                  <Card key={user._id} variant="error" className="verification-card">
                    <div className="verification-card-header">
                      <div className="user-avatar">
                        <span className="role-icon">{getRoleIcon(user.role)}</span>
                      </div>
                      <div className="user-info">
                        <h3 className="user-name">{user.name}</h3>
                        <span className={`role-badge ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                      <div className="verification-reason">
                        <span className="verification-badge">Needs Verification</span>
                      </div>
                    </div>

                    <div className="verification-card-content">
                      <div className="verification-details">
                        <div className="detail-item">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value">{user.email}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Verification Reason:</span>
                          <span className="detail-value">{user.verificationReason}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Trust Score:</span>
                          <span className={`detail-value ${getTrustScoreColor(user.trustScore)}`}>
                            {user.trustScore}%
                          </span>
                        </div>
                      </div>

                      <div className="verification-actions">
                        <button className="verify-button">
                          🔍 Review Details
                        </button>
                        <button className="approve-button">
                          ✅ Approve Anyway
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard 