import React from 'react'
import './UserPersona.css'

const UserPersona = ({ 
  user, 
  variant = 'default',
  showDetails = true,
  interactive = true 
}) => {
  // Generate avatar based on user demographics
  const generateAvatar = (user) => {
    const { age, gender, location, needs } = user
    
    // Avatar emoji mapping based on demographics
    const avatarMap = {
      youth: '👨‍🎓',
      adult: '👨‍💼',
      senior: '👴',
      female: '👩',
      male: '👨',
      lgbtq: '🏳️‍🌈',
      disability: '♿',
      rural: '🌾',
      urban: '🏢',
      creative: '🎨',
      tech: '💻',
      health: '🏥',
      education: '📚',
      employment: '💼'
    }

    // Determine primary avatar based on age
    let primaryAvatar = avatarMap.adult
    if (age < 25) primaryAvatar = avatarMap.youth
    else if (age > 50) primaryAvatar = avatarMap.senior

    // Add context-specific avatars
    let contextAvatar = ''
    if (needs?.toLowerCase().includes('creative')) contextAvatar = avatarMap.creative
    else if (needs?.toLowerCase().includes('tech')) contextAvatar = avatarMap.tech
    else if (needs?.toLowerCase().includes('health')) contextAvatar = avatarMap.health
    else if (needs?.toLowerCase().includes('education')) contextAvatar = avatarMap.education
    else if (needs?.toLowerCase().includes('employment')) contextAvatar = avatarMap.employment

    return contextAvatar || primaryAvatar
  }

  // Generate identity tags
  const generateTags = (user) => {
    const tags = []
    const { age, location, needs, status, riskScore } = user

    // Age-based tags
    if (age < 25) tags.push('Youth')
    else if (age < 35) tags.push('Young Adult')
    else if (age < 50) tags.push('Adult')
    else tags.push('Senior')

    // Location-based tags
    if (location?.includes('Nairobi')) tags.push('Nairobi')
    else if (location?.includes('Rural')) tags.push('Rural')
    else if (location?.includes('Mombasa')) tags.push('Mombasa')
    else if (location?.includes('Kisumu')) tags.push('Kisumu')

    // Need-based tags
    if (needs?.toLowerCase().includes('lgbtq')) tags.push('LGBTQ+')
    if (needs?.toLowerCase().includes('disability')) tags.push('PWD')
    if (needs?.toLowerCase().includes('refugee')) tags.push('Refugee')
    if (needs?.toLowerCase().includes('single parent')) tags.push('Single Parent')

    // Status-based tags
    if (status === 'High Priority') tags.push('High Priority')
    if (status === 'Active') tags.push('Active')

    // Risk-based tags
    if (riskScore >= 8.5) tags.push('High Risk')
    else if (riskScore >= 7.0) tags.push('Medium Risk')

    return tags.slice(0, 4) // Limit to 4 tags
  }

  // Get risk level description
  const getRiskDescription = (score) => {
    if (score >= 8.5) return 'High Priority Support Needed'
    if (score >= 7.0) return 'Moderate Support Required'
    if (score >= 5.5) return 'Standard Support Level'
    return 'Low Support Needs'
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success'
      case 'pending': return 'warning'
      case 'high priority': return 'error'
      default: return 'default'
    }
  }

  const avatar = generateAvatar(user)
  const tags = generateTags(user)
  const riskDescription = getRiskDescription(user.riskScore)
  const statusColor = getStatusColor(user.status)

  return (
    <div className={`user-persona ${variant} ${interactive ? 'interactive' : ''}`}>
      <div className="persona-header">
        <div className="avatar-container">
          <div className="avatar">{avatar}</div>
          {user.riskScore >= 8.5 && (
            <div className="priority-badge">🔥</div>
          )}
        </div>
        
        <div className="persona-info">
          <h3 className="persona-name">{user.name}</h3>
          <p className="persona-age">{user.age} years old • {user.location}</p>
          
          <div className="identity-tags">
            {tags.map((tag, index) => (
              <span key={index} className="identity-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="persona-status">
          <span className={`status-badge ${statusColor}`}>
            {user.status}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="persona-details">
          <div className="detail-section">
            <h4>🎯 Current Needs</h4>
            <p className="needs-text">{user.needs}</p>
          </div>

          <div className="detail-section">
            <h4>📊 Risk Assessment</h4>
            <div className="risk-info">
              <div className="risk-score">
                <span className="score-value">{user.riskScore}</span>
                <span className="score-label">Risk Score</span>
              </div>
              <p className="risk-description">{riskDescription}</p>
            </div>
          </div>

          {user.lastUpdate && (
            <div className="detail-section">
              <h4>📅 Last Updated</h4>
              <p className="update-date">{user.lastUpdate}</p>
            </div>
          )}

          {user.story && (
            <div className="detail-section">
              <h4>📖 Their Story</h4>
              <p className="story-text">{user.story}</p>
            </div>
          )}
        </div>
      )}

      {interactive && (
        <div className="persona-actions">
          <button className="action-btn primary">View Full Profile</button>
          <button className="action-btn secondary">Update Status</button>
          <button className="action-btn secondary">Add Note</button>
        </div>
      )}
    </div>
  )
}

export default UserPersona 