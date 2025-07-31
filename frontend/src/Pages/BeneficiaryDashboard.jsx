import React, { useState, useEffect } from 'react'
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
      case 'approved': return 'approved'
      case 'rejected': return 'rejected'
      case 'pending': return 'pending'
      case 'under_review': return 'review'
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
      case 'approved': return 'approved'
      case 'rejected': return 'rejected'
      case 'pending': return 'pending'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="beneficiary-dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="beneficiary-dashboard-container">
      <div className="beneficiary-header">
        <h1>👤 MY PROFILE PAGE</h1>
        <p className="beneficiary-subtitle">
          Manage your profile and track your application status
        </p>
      </div>

      <div className="profile-grid">
        {/* Profile Information */}
        <div className="profile-card">
          <div className="card-header">
            <h2>📋 Personal Information</h2>
          </div>
          <div className="profile-info">
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
                <label htmlFor="photo-upload" className="upload-btn">
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
              <span className="info-label">Beneficiary ID:</span>
              <span className="info-value">{userProfile?._id || user?._id || 'Not assigned'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Account Status:</span>
              <span className={`status-badge ${userProfile?.approvalStatus || user?.approvalStatus || 'pending'}`}>
                {userProfile?.approvalStatus || user?.approvalStatus || 'pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="status-card">
          <div className="card-header">
            <h2>📊 Account Status</h2>
          </div>
          <div className="status-info">
            <div className="status-item">
              <span className="status-label">Registration Status:</span>
              <span className={`status-value ${getStatusColor(userProfile?.approvalStatus || user?.approvalStatus || 'pending')}`}>
                <span className="status-icon">{getStatusIcon(userProfile?.approvalStatus || user?.approvalStatus || 'pending')}</span>
                {userProfile?.approvalStatus || user?.approvalStatus || 'pending'}
              </span>
            </div>
            
            {userProfile?.approvalStatus === 'rejected' && (
              <div className="rejection-info">
                <span className="rejection-label">Reason for Rejection:</span>
                <span className="rejection-reason">{userProfile?.rejectionReason || 'No reason provided'}</span>
                
                {!userProfile?.hasAppealed && (
                  <button 
                    className="appeal-btn"
                    onClick={() => setShowAppealForm(true)}
                  >
                    📝 Submit Appeal
                  </button>
                )}
                
                {userProfile?.hasAppealed && (
                  <div className="appeal-status">
                    <span className="appeal-label">Appeal Status:</span>
                    <span className={`appeal-value ${getAppealStatusColor(userProfile?.appealStatus)}`}>
                      {userProfile?.appealStatus || 'Under Review'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appeal Form Modal */}
      {showAppealForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📝 Submit Appeal</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAppealForm(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Please provide additional information or clarification for your appeal:</p>
              <textarea
                value={appealComment}
                onChange={(e) => setAppealComment(e.target.value)}
                placeholder="Explain why you believe your application should be reconsidered..."
                rows="6"
              />
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowAppealForm(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-btn"
                onClick={handleSubmitAppeal}
                disabled={!appealComment.trim()}
              >
                Submit Appeal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BeneficiaryDashboard 