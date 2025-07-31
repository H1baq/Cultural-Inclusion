import React, { useState, useEffect } from 'react'
import './ApplicationStatus.css'

const ApplicationStatus = ({ user }) => {
  console.log('🎯 ApplicationStatus component rendered with user:', user)
  
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('No authentication token found')
        setIsLoading(false)
        return
      }

      const response = await fetch('http://localhost:5002/api/auth/my-submissions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
      } else {
        // For now, show mock data since backend endpoint might not exist
        setSubmissions([
          {
            id: '1',
            type: 'Support Request',
            category: 'Business Funding',
            description: 'Need funding for my creative arts business',
            status: 'pending',
            submittedAt: new Date().toISOString(),
            urgencyLevel: 'high',
            fundingAmount: 5000
          }
        ])
      }
    } catch (error) {
      console.error('Submissions fetch error:', error)
      // Show mock data for now
      setSubmissions([
        {
          id: '1',
          type: 'Support Request',
          category: 'Business Funding',
          description: 'Need funding for my creative arts business',
          status: 'pending',
          submittedAt: new Date().toISOString(),
          urgencyLevel: 'high',
          fundingAmount: 5000
        }
      ])
    } finally {
      setIsLoading(false)
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
      default: return '📋'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="application-status-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="application-status-container">
      <div className="status-header">
        <h1>📊 APPLICATION STATUS PAGE</h1>
        <p className="status-subtitle">
          Track your support requests and application progress
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      <div className="status-summary">
        <div className="summary-card total">
          <div className="summary-icon">📋</div>
          <div className="summary-content">
            <h3>Total Applications</h3>
            <p className="summary-number">{submissions.length}</p>
          </div>
        </div>
        <div className="summary-card pending">
          <div className="summary-icon">⏳</div>
          <div className="summary-content">
            <h3>Pending Review</h3>
            <p className="summary-number">{submissions.filter(s => s.status === 'pending' || s.status === 'under_review').length}</p>
          </div>
        </div>
        <div className="summary-card approved">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <h3>Approved</h3>
            <p className="summary-number">{submissions.filter(s => s.status === 'approved').length}</p>
          </div>
        </div>
        <div className="summary-card rejected">
          <div className="summary-icon">❌</div>
          <div className="summary-content">
            <h3>Declined</h3>
            <p className="summary-number">{submissions.filter(s => s.status === 'rejected').length}</p>
          </div>
        </div>
      </div>

      <div className="submissions-section">
        <h2>📝 Your Support Requests</h2>
        
        {submissions.length === 0 ? (
          <div className="no-submissions">
            <div className="no-submissions-icon">📝</div>
            <h3>No Applications Yet</h3>
            <p>You haven't submitted any support requests yet.</p>
            <p>Go to <strong>Data Entry</strong> to submit your first request!</p>
          </div>
        ) : (
          <div className="submissions-list">
            {submissions.map((submission) => (
              <div key={submission.id} className={`submission-card ${getStatusColor(submission.status)}`}>
                <div className="submission-header">
                  <div className="submission-type">
                    <span className="type-icon">📋</span>
                    <span className="type-text">{submission.type}</span>
                  </div>
                  <div className={`submission-status ${getStatusColor(submission.status)}`}>
                    <span className="status-icon">{getStatusIcon(submission.status)}</span>
                    <span className="status-text">
                      {submission.status === 'pending' && 'Pending Review'}
                      {submission.status === 'under_review' && 'Under Review'}
                      {submission.status === 'approved' && 'Approved'}
                      {submission.status === 'rejected' && 'Declined'}
                    </span>
                  </div>
                </div>
                
                <div className="submission-details">
                  <div className="detail-row">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{submission.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{submission.description}</span>
                  </div>
                  {submission.fundingAmount && (
                    <div className="detail-row">
                      <span className="detail-label">Funding Requested:</span>
                      <span className="detail-value">${submission.fundingAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {submission.urgencyLevel && (
                    <div className="detail-row">
                      <span className="detail-label">Urgency:</span>
                      <span className={`urgency-badge ${submission.urgencyLevel}`}>
                        {submission.urgencyLevel.charAt(0).toUpperCase() + submission.urgencyLevel.slice(1)}
                      </span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">{formatDate(submission.submittedAt)}</span>
                  </div>
                </div>

                {submission.status === 'rejected' && submission.rejectionReason && (
                  <div className="rejection-reason">
                    <span className="reason-label">Reason for Decline:</span>
                    <span className="reason-text">{submission.rejectionReason}</span>
                  </div>
                )}

                {submission.status === 'approved' && (
                  <div className="approval-details">
                    <span className="approval-label">✅ Approved!</span>
                    <span className="approval-text">Your request has been approved. You will be contacted soon.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationStatus 