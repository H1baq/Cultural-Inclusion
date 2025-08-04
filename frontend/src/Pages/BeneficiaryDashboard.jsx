import React, { useState, useEffect } from 'react'
import Card from '../Components/Card'
import './BeneficiaryDashboard.css'

const BeneficiaryDashboard = ({ user }) => {
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [appealComment, setAppealComment] = useState('')
  const [showAppealForm, setShowAppealForm] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('No authentication token found')
        setIsLoading(false)
        return
      }

      const response = await fetch('http://localhost:5002/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      } else {
        // Use user data from props as fallback
        setUserProfile(user)
        setError('')
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      // Use user data from props as fallback
      setUserProfile(user)
      setError('')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePhoto(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitAppeal = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/auth/submit-appeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          appealComment
        })
      })

      if (response.ok) {
        alert('Appeal submitted successfully!')
        setAppealComment('')
        setShowAppealForm(false)
        fetchUserProfile() // Refresh profile data
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to submit appeal')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'pending': return 'warning'
      case 'under_review': return 'warning'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅'
      case 'rejected': return '❌'
      case 'pending': return '⏳'
      case 'under_review': return '🔍'
      default: return '❓'
    }
  }

  const getAppealStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="beneficiary-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="beneficiary-dashboard">
      {/* Beneficiary Header */}
      <div className="beneficiary-header">
        <div className="beneficiary-header-content">
          <div className="beneficiary-title-section">
            <h1 className="beneficiary-title">👤 My Profile</h1>
            <p className="beneficiary-subtitle">
              Manage your profile and track your application status
            </p>
          </div>
          <div className="beneficiary-meta">
            <div className="beneficiary-id">
              <span className="id-label">Beneficiary ID:</span>
              <span className="id-value">{userProfile?._id || user?._id || 'Not assigned'}</span>
            </div>
          </div>
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

      <div className="profile-grid">
        {/* Profile Information */}
        <Card variant="default" className="profile-card">
          <div className="card-header">
            <h2 className="card-title">📋 Personal Information</h2>
            <p className="card-subtitle">Your basic profile details</p>
          </div>
          
          <div className="profile-content">
            {/* Profile Photo Section */}
            <div className="profile-photo-section">
              <div className="profile-photo">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" />
                ) : (
                  <div className="photo-placeholder">
                    <span>📷</span>
                  </div>
                )}
              </div>
              <div className="photo-upload">
                <label htmlFor="photo-upload" className="upload-button">
                  📷 Upload Photo
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{userProfile?.name || user?.name || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{userProfile?.email || user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{userProfile?.phoneNumber || user?.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location:</span>
                <span className="info-value">{userProfile?.location || user?.location || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Status:</span>
                <span className={`status-badge ${getStatusColor(userProfile?.approvalStatus || user?.approvalStatus || 'pending')}`}>
                  {getStatusIcon(userProfile?.approvalStatus || user?.approvalStatus || 'pending')}
                  {userProfile?.approvalStatus || user?.approvalStatus || 'pending'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Status */}
        <Card variant="primary" className="status-card">
          <div className="card-header">
            <h2 className="card-title">📊 Account Status</h2>
            <p className="card-subtitle">Your application and verification status</p>
          </div>
          
          <div className="status-content">
            <div className="status-item">
              <div className="status-icon">
                {getStatusIcon(userProfile?.approvalStatus || user?.approvalStatus || 'pending')}
              </div>
              <div className="status-info">
                <h3 className="status-title">Application Status</h3>
                <span className={`status-value ${getStatusColor(userProfile?.approvalStatus || user?.approvalStatus || 'pending')}`}>
                  {userProfile?.approvalStatus || user?.approvalStatus || 'pending'}
                </span>
              </div>
            </div>

            <div className="status-item">
              <div className="status-icon">🎯</div>
              <div className="status-info">
                <h3 className="status-title">Trust Score</h3>
                <span className="status-value">
                  {userProfile?.trustScore || user?.trustScore || 0}%
                </span>
              </div>
            </div>

            <div className="status-item">
              <div className="status-icon">⚠️</div>
              <div className="status-info">
                <h3 className="status-title">Risk Level</h3>
                <span className={`status-value ${getStatusColor(userProfile?.riskLevel || user?.riskLevel || 'medium')}`}>
                  {userProfile?.riskLevel || user?.riskLevel || 'medium'}
                </span>
              </div>
            </div>

            {userProfile?.approvalStatus === 'rejected' || user?.approvalStatus === 'rejected' ? (
              <div className="rejection-info">
                <h3 className="rejection-title">Rejection Reason</h3>
                <p className="rejection-reason">
                  {userProfile?.rejectionReason || user?.rejectionReason || 'No reason provided'}
                </p>
                {!showAppealForm ? (
                  <button 
                    className="appeal-button"
                    onClick={() => setShowAppealForm(true)}
                  >
                    📝 Submit Appeal
                  </button>
                ) : (
                  <div className="appeal-form">
                    <textarea
                      value={appealComment}
                      onChange={(e) => setAppealComment(e.target.value)}
                      placeholder="Explain why you believe your application should be reconsidered..."
                      className="appeal-textarea"
                      rows="4"
                    />
                    <div className="appeal-actions">
                      <button 
                        className="submit-appeal-button"
                        onClick={handleSubmitAppeal}
                      >
                        📤 Submit Appeal
                      </button>
                      <button 
                        className="cancel-appeal-button"
                        onClick={() => setShowAppealForm(false)}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </Card>

        {/* Support Programs */}
        <Card variant="success" className="support-card">
          <div className="card-header">
            <h2 className="card-title">🤝 Support Programs</h2>
            <p className="card-subtitle">Available programs and resources</p>
          </div>
          
          <div className="support-content">
            <div className="support-item">
              <div className="support-icon">🎨</div>
              <div className="support-info">
                <h3 className="support-title">Creative Arts Support</h3>
                <p className="support-description">Funding and resources for creative projects</p>
                <span className="support-status available">Available</span>
              </div>
            </div>

            <div className="support-item">
              <div className="support-icon">💼</div>
              <div className="support-info">
                <h3 className="support-title">Career Development</h3>
                <p className="support-description">Training and job placement assistance</p>
                <span className="support-status available">Available</span>
              </div>
            </div>

            <div className="support-item">
              <div className="support-icon">🏥</div>
              <div className="support-info">
                <h3 className="support-title">Healthcare Access</h3>
                <p className="support-description">Medical and mental health support</p>
                <span className="support-status available">Available</span>
              </div>
            </div>

            <div className="support-item">
              <div className="support-icon">🏠</div>
              <div className="support-info">
                <h3 className="support-title">Housing Support</h3>
                <p className="support-description">Housing assistance and resources</p>
                <span className="support-status pending">Pending Approval</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card variant="default" className="activity-card">
          <div className="card-header">
            <h2 className="card-title">📈 Recent Activity</h2>
            <p className="card-subtitle">Your latest interactions and updates</p>
          </div>
          
          <div className="activity-content">
            <div className="activity-item">
              <div className="activity-icon">📋</div>
              <div className="activity-info">
                <h3 className="activity-title">Profile Updated</h3>
                <p className="activity-description">Your profile information was updated</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-info">
                <h3 className="activity-title">Application Submitted</h3>
                <p className="activity-description">Your application was successfully submitted</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">📧</div>
              <div className="activity-info">
                <h3 className="activity-title">Email Verification</h3>
                <p className="activity-description">Your email address was verified</p>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default BeneficiaryDashboard 