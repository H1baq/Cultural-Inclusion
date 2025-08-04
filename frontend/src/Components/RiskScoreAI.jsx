import React, { useState, useEffect } from 'react'
import './RiskScoreAI.css'

const RiskScoreAI = ({ 
  beneficiary = null, 
  showCalculator = false, 
  showRecommendations = true,
  variant = 'default' 
}) => {
  const [riskScore, setRiskScore] = useState(0)
  const [impactScore, setImpactScore] = useState(0)
  const [factors, setFactors] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)

  // AI-Lite Risk Scoring Algorithm
  const calculateRiskScore = (data) => {
    let score = 0
    const factors = []

    // Economic Vulnerability (0-25 points)
    if (data.income === 'low') {
      score += 15
      factors.push({ factor: 'Low Income', weight: 15, impact: 'high' })
    } else if (data.income === 'medium') {
      score += 8
      factors.push({ factor: 'Medium Income', weight: 8, impact: 'medium' })
    }

    if (data.employment === 'unemployed') {
      score += 10
      factors.push({ factor: 'Unemployment', weight: 10, impact: 'high' })
    } else if (data.employment === 'part-time') {
      score += 5
      factors.push({ factor: 'Part-time Employment', weight: 5, impact: 'medium' })
    }

    // Geographic Isolation (0-20 points)
    if (data.location === 'rural') {
      score += 15
      factors.push({ factor: 'Rural Location', weight: 15, impact: 'high' })
    } else if (data.location === 'peri-urban') {
      score += 8
      factors.push({ factor: 'Peri-urban Location', weight: 8, impact: 'medium' })
    }

    if (data.transportation === 'limited') {
      score += 5
      factors.push({ factor: 'Limited Transportation', weight: 5, impact: 'medium' })
    }

    // Access Barriers (0-25 points)
    if (data.disability) {
      score += 15
      factors.push({ factor: 'Disability', weight: 15, impact: 'high' })
    }

    if (data.education === 'primary') {
      score += 8
      factors.push({ factor: 'Primary Education Only', weight: 8, impact: 'medium' })
    } else if (data.education === 'none') {
      score += 12
      factors.push({ factor: 'No Formal Education', weight: 12, impact: 'high' })
    }

    if (data.healthcare === 'limited') {
      score += 5
      factors.push({ factor: 'Limited Healthcare Access', weight: 5, impact: 'medium' })
    }

    // Social Support (0-15 points)
    if (data.familySupport === 'none') {
      score += 10
      factors.push({ factor: 'No Family Support', weight: 10, impact: 'high' })
    } else if (data.familySupport === 'limited') {
      score += 5
      factors.push({ factor: 'Limited Family Support', weight: 5, impact: 'medium' })
    }

    if (data.communitySupport === 'none') {
      score += 5
      factors.push({ factor: 'No Community Support', weight: 5, impact: 'medium' })
    }

    // Additional Vulnerability Factors (0-15 points)
    if (data.age < 18) {
      score += 8
      factors.push({ factor: 'Minor', weight: 8, impact: 'high' })
    } else if (data.age > 65) {
      score += 6
      factors.push({ factor: 'Elderly', weight: 6, impact: 'medium' })
    }

    if (data.singleParent) {
      score += 7
      factors.push({ factor: 'Single Parent', weight: 7, impact: 'high' })
    }

    if (data.refugee) {
      score += 10
      factors.push({ factor: 'Refugee Status', weight: 10, impact: 'high' })
    }

    if (data.lgbtq) {
      score += 8
      factors.push({ factor: 'LGBTQ+', weight: 8, impact: 'high' })
    }

    return { score: Math.min(100, score), factors }
  }

  // Impact Assessment Algorithm
  const calculateImpactScore = (data, riskScore) => {
    let impactScore = 50 // Base impact score

    // Positive factors that increase impact potential
    if (data.education === 'university') impactScore += 15
    if (data.education === 'secondary') impactScore += 10
    if (data.skills && data.skills.length > 0) impactScore += data.skills.length * 3
    if (data.volunteerExperience) impactScore += 8
    if (data.leadershipExperience) impactScore += 12
    if (data.creativeBackground) impactScore += 10
    if (data.entrepreneurialSpirit) impactScore += 15
    if (data.communityInvolvement) impactScore += 8

    // Risk-adjusted impact (higher risk can mean higher potential impact)
    if (riskScore > 70) impactScore += 10
    if (riskScore > 50) impactScore += 5

    return Math.min(100, Math.max(0, impactScore))
  }

  // Generate AI-Lite Recommendations
  const generateRecommendations = (data, riskScore, impactScore) => {
    const recommendations = []

    // High Priority Interventions
    if (riskScore >= 80) {
      recommendations.push({
        type: 'urgent',
        title: 'Immediate Support Required',
        description: 'This beneficiary requires urgent intervention and comprehensive support.',
        actions: ['Emergency financial assistance', 'Housing support', 'Mental health services'],
        priority: 'critical'
      })
    }

    if (data.income === 'low' && data.employment === 'unemployed') {
      recommendations.push({
        type: 'economic',
        title: 'Economic Empowerment',
        description: 'Focus on job training and income generation opportunities.',
        actions: ['Skills training program', 'Microfinance access', 'Job placement support'],
        priority: 'high'
      })
    }

    if (data.disability) {
      recommendations.push({
        type: 'accessibility',
        title: 'Accessibility Support',
        description: 'Ensure all services are accessible and inclusive.',
        actions: ['Accessibility audit', 'Assistive technology', 'Inclusive training'],
        priority: 'high'
      })
    }

    if (data.location === 'rural') {
      recommendations.push({
        type: 'geographic',
        title: 'Rural Outreach',
        description: 'Develop mobile services and community-based programs.',
        actions: ['Mobile service units', 'Community partnerships', 'Digital literacy'],
        priority: 'medium'
      })
    }

    if (impactScore >= 80) {
      recommendations.push({
        type: 'leadership',
        title: 'Leadership Development',
        description: 'High potential for community leadership and impact.',
        actions: ['Leadership training', 'Mentorship program', 'Community project support'],
        priority: 'high'
      })
    }

    if (data.creativeBackground) {
      recommendations.push({
        type: 'creative',
        title: 'Creative Arts Support',
        description: 'Leverage creative skills for economic and social impact.',
        actions: ['Arts training', 'Market access', 'Creative entrepreneurship'],
        priority: 'medium'
      })
    }

    // General recommendations
    recommendations.push({
      type: 'general',
      title: 'Holistic Support',
      description: 'Comprehensive approach to address multiple needs.',
      actions: ['Case management', 'Regular follow-ups', 'Progress monitoring'],
      priority: 'medium'
    })

    return recommendations
  }

  // Calculate scores when beneficiary data changes
  useEffect(() => {
    if (beneficiary) {
      setIsCalculating(true)
      
      // Simulate AI processing time
      setTimeout(() => {
        const riskResult = calculateRiskScore(beneficiary)
        const impactResult = calculateImpactScore(beneficiary, riskResult.score)
        const recommendationsResult = generateRecommendations(beneficiary, riskResult.score, impactResult)

        setRiskScore(riskResult.score)
        setImpactScore(impactResult)
        setFactors(riskResult.factors)
        setRecommendations(recommendationsResult)
        setIsCalculating(false)
      }, 1000)
    }
  }, [beneficiary])

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'Critical', color: '#dc3545', icon: '🚨' }
    if (score >= 60) return { level: 'High', color: '#fd7e14', icon: '⚠️' }
    if (score >= 40) return { level: 'Medium', color: '#ffc107', icon: '⚡' }
    return { level: 'Low', color: '#28a745', icon: '✅' }
  }

  const getImpactLevel = (score) => {
    if (score >= 80) return { level: 'Exceptional', color: '#28a745', icon: '🌟' }
    if (score >= 60) return { level: 'High', color: '#17a2b8', icon: '💫' }
    if (score >= 40) return { level: 'Medium', color: '#6c757d', icon: '⭐' }
    return { level: 'Low', color: '#6c757d', icon: '📈' }
  }

  if (!beneficiary && !showCalculator) {
    return (
      <div className="risk-score-ai empty">
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <h3>AI-Lite Risk Assessment</h3>
          <p>Select a beneficiary to generate risk and impact scores</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`risk-score-ai ${variant}`}>
      {isCalculating ? (
        <div className="calculating-state">
          <div className="ai-processing">
            <div className="ai-icon">🤖</div>
            <div className="processing-text">
              <h3>AI-Lite Processing...</h3>
              <p>Analyzing vulnerability factors and impact potential</p>
              <div className="processing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Score Overview */}
          <div className="score-overview">
            <div className="score-card risk">
              <div className="score-header">
                <h3>Risk Score</h3>
                <span className={`risk-level ${getRiskLevel(riskScore).level.toLowerCase()}`}>
                  {getRiskLevel(riskScore).icon} {getRiskLevel(riskScore).level}
                </span>
              </div>
              <div className="score-value" style={{ color: getRiskLevel(riskScore).color }}>
                {riskScore}
              </div>
              <div className="score-bar">
                <div 
                  className="score-fill risk-fill" 
                  style={{ 
                    width: `${riskScore}%`, 
                    backgroundColor: getRiskLevel(riskScore).color 
                  }}
                ></div>
              </div>
            </div>

            <div className="score-card impact">
              <div className="score-header">
                <h3>Impact Potential</h3>
                <span className={`impact-level ${getImpactLevel(impactScore).level.toLowerCase()}`}>
                  {getImpactLevel(impactScore).icon} {getImpactLevel(impactScore).level}
                </span>
              </div>
              <div className="score-value" style={{ color: getImpactLevel(impactScore).color }}>
                {impactScore}
              </div>
              <div className="score-bar">
                <div 
                  className="score-fill impact-fill" 
                  style={{ 
                    width: `${impactScore}%`, 
                    backgroundColor: getImpactLevel(impactScore).color 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Risk Factors Breakdown */}
          <div className="factors-breakdown">
            <h3>Risk Factors Analysis</h3>
            <div className="factors-grid">
              {factors.map((factor, index) => (
                <div key={index} className={`factor-item ${factor.impact}`}>
                  <div className="factor-header">
                    <span className="factor-name">{factor.factor}</span>
                    <span className="factor-weight">{factor.weight} pts</span>
                  </div>
                  <div className="factor-impact">
                    <span className={`impact-badge ${factor.impact}`}>
                      {factor.impact === 'high' ? '🔴' : factor.impact === 'medium' ? '🟡' : '🟢'} {factor.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          {showRecommendations && (
            <div className="ai-recommendations">
              <h3>🤖 AI-Lite Recommendations</h3>
              <div className="recommendations-grid">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`recommendation-card ${rec.priority}`}>
                    <div className="recommendation-header">
                      <h4>{rec.title}</h4>
                      <span className={`priority-badge ${rec.priority}`}>
                        {rec.priority === 'critical' ? '🚨' : rec.priority === 'high' ? '⚡' : '📋'} {rec.priority}
                      </span>
                    </div>
                    <p className="recommendation-description">{rec.description}</p>
                    <div className="recommendation-actions">
                      <h5>Recommended Actions:</h5>
                      <ul>
                        {rec.actions.map((action, actionIndex) => (
                          <li key={actionIndex}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default RiskScoreAI 