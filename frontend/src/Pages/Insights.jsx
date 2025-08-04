import React, { useState, useEffect } from 'react'
import Card from '../Components/Card'
import offlineManager from '../utils/offlineManager'
import OfflineDemo from '../Components/OfflineDemo'
import Map from '../Components/Map'
import UserPersona from '../Components/UserPersona'
import RiskScoreAI from '../Components/RiskScoreAI'
import InclusiveLanguageChecker from '../Components/InclusiveLanguageChecker'
import DemoSystem from '../Components/DemoSystem'
import AdvancedAnalytics from '../Components/AdvancedAnalytics'
import MobileFieldApp from '../Components/MobileFieldApp'
import IntegrationAPIs from '../Components/IntegrationAPIs'
import MultiLanguageSupport from '../Components/MultiLanguageSupport'
import SecurityPrivacyDashboard from '../Components/SecurityPrivacyDashboard'
import PerformanceMonitoring from '../Components/PerformanceMonitoring'
import './Insights.css'

const Insights = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [insightsData, setInsightsData] = useState(null)

  // Mock data for demonstration
  const mockInsightsData = {
    overview: {
      totalBeneficiaries: 1247,
      newThisMonth: 89,
      pendingApprovals: 23,
      averageAge: 28,
      genderDistribution: {
        female: 65,
        male: 32,
        other: 3
      },
      topRegions: [
        { name: 'Nairobi', count: 234, percentage: 18.8 },
        { name: 'Mombasa', count: 189, percentage: 15.2 },
        { name: 'Kisumu', count: 156, percentage: 12.5 },
        { name: 'Nakuru', count: 134, percentage: 10.8 },
        { name: 'Eldoret', count: 98, percentage: 7.9 }
      ],
      vulnerabilityTypes: [
        { type: 'Youth (18-25)', count: 456, percentage: 36.6 },
        { type: 'LGBTQ+', count: 234, percentage: 18.8 },
        { type: 'Persons with Disabilities', count: 189, percentage: 15.2 },
        { type: 'Rural Communities', count: 167, percentage: 13.4 },
        { type: 'Single Parents', count: 134, percentage: 10.8 },
        { type: 'Refugees', count: 67, percentage: 5.4 }
      ]
    },
    riskScores: [
      {
        id: 1,
        name: 'Sarah Mwangi',
        avatar: '👩‍🎨',
        age: 24,
        location: 'Nairobi',
        riskScore: 78,
        impactScore: 92,
        tags: ['Youth', 'LGBTQ+', 'Creative'],
        factors: ['Low income', 'Rural background', 'Creative potential'],
        recommendation: 'High impact potential - Recommend full support package'
      },
      {
        id: 2,
        name: 'James Ochieng',
        avatar: '👨‍🦽',
        age: 31,
        location: 'Kisumu',
        riskScore: 85,
        impactScore: 88,
        tags: ['PWD', 'Entrepreneur', 'Rural'],
        factors: ['Physical disability', 'Limited access', 'Business skills'],
        recommendation: 'Critical support needed - Priority for accessibility services'
      },
      {
        id: 3,
        name: 'Amina Hassan',
        avatar: '👩‍👧‍👦',
        age: 29,
        location: 'Mombasa',
        riskScore: 72,
        impactScore: 95,
        tags: ['Single Parent', 'Refugee', 'Educator'],
        factors: ['Refugee status', 'Single parent', 'Education background'],
        recommendation: 'Exceptional impact potential - Recommend leadership program'
      }
    ],
    inclusiveLanguage: {
      recentReports: [
        {
          id: 1,
          author: 'Field Officer Kimani',
          content: 'The beneficiary showed great potential despite their disadvantaged background.',
          flagged: true,
          suggestions: [
            'Consider: "The beneficiary demonstrated strong capabilities and resilience."',
            'Avoid: "despite their disadvantaged background"'
          ]
        },
        {
          id: 2,
          author: 'Admin User',
          content: 'We need to help these people get better opportunities.',
          flagged: true,
          suggestions: [
            'Consider: "We are partnering with community members to expand opportunities."',
            'Avoid: "help these people"'
          ]
        }
      ],
      languageGuidelines: [
        'Use "person-first" language (e.g., "person with disability" not "disabled person")',
        'Avoid terms like "vulnerable," "disadvantaged," or "at-risk"',
        'Focus on strengths and capabilities rather than limitations',
        'Use inclusive pronouns and gender-neutral language when possible'
      ]
    },
    offlineStats: {
      pendingSync: 12,
      lastSync: '2 hours ago',
      offlineEntries: [
        { id: 1, type: 'New Beneficiary', timestamp: '2024-01-15 14:30', status: 'Pending' },
        { id: 2, type: 'Progress Update', timestamp: '2024-01-15 15:45', status: 'Pending' },
        { id: 3, type: 'Support Request', timestamp: '2024-01-15 16:20', status: 'Pending' }
      ]
    },
    personas: [
      {
        id: 1,
        name: 'Sarah Muthoni',
        age: 24,
        location: 'Nairobi West',
        needs: 'Creative arts education and LGBTQ+ support',
        riskScore: 8.5,
        status: 'Active',
        lastUpdate: '2024-01-15',
        story: 'Sarah is a talented young artist who dreams of opening her own creative studio. She faces challenges accessing inclusive spaces and needs support to build her confidence and skills.'
      },
      {
        id: 2,
        name: 'James Ochieng',
        age: 31,
        location: 'Kisumu Rural',
        needs: 'Accessibility services and entrepreneurship training',
        riskScore: 9.3,
        status: 'High Priority',
        lastUpdate: '2024-01-14',
        story: 'James is a determined entrepreneur with a physical disability. He runs a small business but needs better accessibility infrastructure and business development support.'
      },
      {
        id: 3,
        name: 'Amina Hassan',
        age: 29,
        location: 'Mombasa',
        needs: 'Refugee support and single parent assistance',
        riskScore: 7.8,
        status: 'Active',
        lastUpdate: '2024-01-13',
        story: 'Amina is a refugee and single mother of two. She has a background in education and wants to help other refugee children access quality learning opportunities.'
      },
      {
        id: 4,
        name: 'David Kimani',
        age: 19,
        location: 'Nairobi East',
        needs: 'Youth employment and digital skills training',
        riskScore: 6.8,
        status: 'Active',
        lastUpdate: '2024-01-12',
        story: 'David is a tech-savvy young man from a low-income family. He has great potential in digital skills but needs support to access training and job opportunities.'
      },
      {
        id: 5,
        name: 'Grace Akinyi',
        age: 35,
        location: 'Nakuru',
        needs: 'Healthcare access and childcare support',
        riskScore: 8.9,
        status: 'Active',
        lastUpdate: '2024-01-11',
        story: 'Grace is a healthcare worker and single mother. She provides essential services to her community while raising her children and needs support to balance both responsibilities.'
      },
      {
        id: 6,
        name: 'Peter Mwangi',
        age: 42,
        location: 'Nyeri Rural',
        needs: 'Agricultural training and rural development',
        riskScore: 5.5,
        status: 'Active',
        lastUpdate: '2024-01-10',
        story: 'Peter is a farmer who wants to modernize his agricultural practices. He needs training and resources to improve his farming methods and increase his income.'
      }
    ],
    // Sample beneficiary data for Risk Score AI
    riskScoreBeneficiaries: [
      {
        id: 1,
        name: 'Sarah Mwangi',
        age: 24,
        income: 'low',
        employment: 'unemployed',
        location: 'rural',
        transportation: 'limited',
        disability: false,
        education: 'secondary',
        healthcare: 'limited',
        familySupport: 'limited',
        communitySupport: 'none',
        singleParent: false,
        refugee: false,
        lgbtq: true,
        skills: ['art', 'design', 'creativity'],
        volunteerExperience: true,
        leadershipExperience: false,
        creativeBackground: true,
        entrepreneurialSpirit: true,
        communityInvolvement: false
      },
      {
        id: 2,
        name: 'James Ochieng',
        age: 31,
        income: 'low',
        employment: 'part-time',
        location: 'rural',
        transportation: 'limited',
        disability: true,
        education: 'primary',
        healthcare: 'limited',
        familySupport: 'none',
        communitySupport: 'limited',
        singleParent: false,
        refugee: false,
        lgbtq: false,
        skills: ['business', 'entrepreneurship'],
        volunteerExperience: false,
        leadershipExperience: true,
        creativeBackground: false,
        entrepreneurialSpirit: true,
        communityInvolvement: true
      },
      {
        id: 3,
        name: 'Amina Hassan',
        age: 29,
        income: 'medium',
        employment: 'full-time',
        location: 'urban',
        transportation: 'available',
        disability: false,
        education: 'university',
        healthcare: 'available',
        familySupport: 'available',
        communitySupport: 'limited',
        singleParent: true,
        refugee: true,
        lgbtq: false,
        skills: ['education', 'teaching', 'languages'],
        volunteerExperience: true,
        leadershipExperience: true,
        creativeBackground: false,
        entrepreneurialSpirit: false,
        communityInvolvement: true
      },
      {
        id: 4,
        name: 'David Kimani',
        age: 19,
        income: 'low',
        employment: 'unemployed',
        location: 'urban',
        transportation: 'available',
        disability: false,
        education: 'secondary',
        healthcare: 'available',
        familySupport: 'limited',
        communitySupport: 'none',
        singleParent: false,
        refugee: false,
        lgbtq: false,
        skills: ['technology', 'digital skills', 'programming'],
        volunteerExperience: false,
        leadershipExperience: false,
        creativeBackground: false,
        entrepreneurialSpirit: true,
        communityInvolvement: false
      }
    ]
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load offline stats
        const offlineStats = await offlineManager.getOfflineStats()
        
        // Combine mock data with real offline stats
        const combinedData = {
          ...mockInsightsData,
          offlineStats: {
            ...mockInsightsData.offlineStats,
            pendingSync: offlineStats.pendingSync,
            lastSync: offlineStats.lastSync,
            totalOfflineEntries: offlineStats.totalOfflineEntries
          }
        }
        
        setInsightsData(combinedData)
      } catch (error) {
        console.error('Failed to load insights data:', error)
        setInsightsData(mockInsightsData)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  const getRiskColor = (score) => {
    if (score >= 80) return 'high-risk'
    if (score >= 60) return 'medium-risk'
    return 'low-risk'
  }

  const getImpactColor = (score) => {
    if (score >= 90) return 'high-impact'
    if (score >= 70) return 'medium-impact'
    return 'low-impact'
  }

  const handleSyncOfflineData = async () => {
    try {
      await offlineManager.syncAllPending()
      // Refresh the insights data
      const stats = await offlineManager.getOfflineStats()
      setInsightsData(prev => ({
        ...prev,
        offlineStats: {
          ...prev.offlineStats,
          pendingSync: stats.pendingSync,
          lastSync: stats.lastSync
        }
      }))
      alert('Sync completed successfully!')
    } catch (error) {
      console.error('Sync failed:', error)
      alert('Sync failed. Please check your internet connection.')
    }
  }

  if (isLoading) {
    return (
      <div className="insights-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading insights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="insights-page">
      {/* Header */}
      <div className="insights-header">
        <div className="insights-title-section">
          <h1 className="insights-title">💡 Human-Centered Insights</h1>
          <p className="insights-subtitle">
            Turning data into stories that matter. Understanding the people behind the numbers.
          </p>
        </div>
        <div className="insights-actions">
          <button className="sync-button" onClick={handleSyncOfflineData}>
            🔄 Sync Offline Data ({insightsData?.offlineStats.pendingSync || 0})
          </button>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="insights-tabs-container">
        <div className="insights-tabs">
          <button 
            className={`insight-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`insight-tab ${activeTab === 'risk-scores' ? 'active' : ''}`}
            onClick={() => setActiveTab('risk-scores')}
          >
            🎯 Risk & Impact Scores
          </button>
          <button 
            className={`insight-tab ${activeTab === 'inclusive-language' ? 'active' : ''}`}
            onClick={() => setActiveTab('inclusive-language')}
          >
            🤝 Inclusive Language
          </button>
          <button 
            className={`insight-tab ${activeTab === 'offline-mode' ? 'active' : ''}`}
            onClick={() => setActiveTab('offline-mode')}
          >
            📱 Offline Mode
          </button>
          <button 
            className={`insight-tab ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            🗺️ Map Visualization
          </button>
          <button 
            className={`insight-tab ${activeTab === 'personas' ? 'active' : ''}`}
            onClick={() => setActiveTab('personas')}
          >
            👥 User Personas
          </button>
          <button
            className={`insight-tab ${activeTab === 'risk-ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('risk-ai')}
          >
            🤖 Risk Score AI
          </button>
          <button
            className={`insight-tab ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            🎯 End-to-End Demo
          </button>
          <button
            className={`insight-tab ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            📈 Advanced Analytics
          </button>
          <button
            className={`insight-tab ${activeTab === 'mobile' ? 'active' : ''}`}
            onClick={() => setActiveTab('mobile')}
          >
            📱 Mobile Field App
          </button>
          <button
            className={`insight-tab ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            🔗 Integration APIs
          </button>
          <button
            className={`insight-tab ${activeTab === 'languages' ? 'active' : ''}`}
            onClick={() => setActiveTab('languages')}
          >
            🌍 Multi-language Support
          </button>
          <button
            className={`insight-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security & Privacy
          </button>
          <button
            className={`insight-tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            ⚡ Performance Monitoring
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="insights-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="insights-grid">
              {/* Key Metrics */}
              <Card variant="primary" className="metric-card">
                <div className="metric-content">
                  <div className="metric-icon">👥</div>
                  <div className="metric-info">
                    <h3 className="metric-value">{insightsData?.overview.totalBeneficiaries}</h3>
                    <p className="metric-label">Total Beneficiaries</p>
                  </div>
                </div>
              </Card>

              <Card variant="success" className="metric-card">
                <div className="metric-content">
                  <div className="metric-icon">🆕</div>
                  <div className="metric-info">
                    <h3 className="metric-value">{insightsData?.overview.newThisMonth}</h3>
                    <p className="metric-label">New This Month</p>
                  </div>
                </div>
              </Card>

              <Card variant="warning" className="metric-card">
                <div className="metric-content">
                  <div className="metric-icon">⏳</div>
                  <div className="metric-info">
                    <h3 className="metric-value">{insightsData?.overview.pendingApprovals}</h3>
                    <p className="metric-label">Pending Approvals</p>
                  </div>
                </div>
              </Card>

              <Card variant="info" className="metric-card">
                <div className="metric-content">
                  <div className="metric-icon">📈</div>
                  <div className="metric-info">
                    <h3 className="metric-value">{insightsData?.overview.averageAge}</h3>
                    <p className="metric-label">Average Age</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Human Stories */}
            <Card variant="default" className="stories-card">
              <div className="stories-header">
                <h2>📖 Human Stories Behind the Data</h2>
                <p>Real insights that help us understand our community better</p>
              </div>
              
              <div className="stories-grid">
                <div className="story-item">
                  <div className="story-icon">👩‍🎨</div>
                  <div className="story-content">
                    <h3>Creative Youth Empowerment</h3>
                    <p>This month: <strong>65% of new creative applicants were women under 30 in rural areas.</strong> This shows a strong demand for creative opportunities among young women in underserved communities.</p>
                  </div>
                </div>

                <div className="story-item">
                  <div className="story-icon">🏳️‍🌈</div>
                  <div className="story-content">
                    <h3>LGBTQ+ Community Support</h3>
                    <p><strong>18.8% of our beneficiaries identify as LGBTQ+</strong>, with 89% reporting improved access to inclusive services and support networks.</p>
                  </div>
                </div>

                <div className="story-item">
                  <div className="story-icon">♿</div>
                  <div className="story-content">
                    <h3>Disability Inclusion</h3>
                    <p><strong>15.2% of beneficiaries are persons with disabilities</strong>, and 94% report increased confidence in accessing public spaces and services.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Regional Distribution */}
            <Card variant="default" className="regions-card">
              <h2>🗺️ Regional Distribution</h2>
              <div className="regions-list">
                {insightsData?.overview.topRegions.map((region, index) => (
                  <div key={index} className="region-item">
                    <div className="region-info">
                      <span className="region-name">{region.name}</span>
                      <span className="region-count">{region.count} people</span>
                    </div>
                    <div className="region-bar">
                      <div 
                        className="region-fill" 
                        style={{ width: `${region.percentage}%` }}
                      ></div>
                    </div>
                    <span className="region-percentage">{region.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Risk & Impact Scores Tab */}
        {activeTab === 'risk-scores' && (
          <div className="tab-content">
            <Card variant="default" className="scores-intro">
              <h2>🎯 AI-Powered Risk & Impact Assessment</h2>
              <p>Our scoring system evaluates both vulnerability factors and potential impact to ensure we support those who need it most while maximizing positive outcomes.</p>
            </Card>

            <div className="scores-grid">
              {insightsData?.riskScores.map((person) => (
                <Card key={person.id} variant="default" className="person-card">
                  <div className="person-header">
                    <div className="person-avatar">{person.avatar}</div>
                    <div className="person-info">
                      <h3 className="person-name">{person.name}</h3>
                      <div className="person-tags">
                        {person.tags.map((tag, index) => (
                          <span key={index} className="person-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="person-details">
                    <div className="detail-row">
                      <span className="detail-label">Age:</span>
                      <span className="detail-value">{person.age} years</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{person.location}</span>
                    </div>
                  </div>

                  <div className="scores-section">
                    <div className="score-item">
                      <div className="score-label">Risk Score</div>
                      <div className={`score-value ${getRiskColor(person.riskScore)}`}>
                        {person.riskScore}/100
                      </div>
                    </div>
                    <div className="score-item">
                      <div className="score-label">Impact Score</div>
                      <div className={`score-value ${getImpactColor(person.impactScore)}`}>
                        {person.impactScore}/100
                      </div>
                    </div>
                  </div>

                  <div className="factors-section">
                    <h4>Key Factors:</h4>
                    <ul className="factors-list">
                      {person.factors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="recommendation-section">
                    <h4>Recommendation:</h4>
                    <p className="recommendation-text">{person.recommendation}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Inclusive Language Tab */}
        {activeTab === 'inclusive-language' && (
          <div className="tab-content">
            <Card variant="default" className="language-intro">
              <h2>🤝 Enhanced Inclusive Language Checker</h2>
              <p>Our advanced AI-powered tool provides real-time analysis of your text for bias detection, inclusive language suggestions, and cultural sensitivity. Write with confidence knowing your communications are respectful and empowering.</p>
            </Card>

            <InclusiveLanguageChecker 
              initialText="The beneficiary showed great potential despite their disadvantaged background. We need to help these people get better opportunities."
              showGuidelines={true}
              showHistory={true}
              variant="default"
            />

            <div className="language-examples">
              <h3>📊 Language Analysis Insights</h3>
              <div className="insights-grid">
                <Card variant="info" className="insight-card">
                  <h4>🎯 Bias Detection</h4>
                  <p>Advanced pattern recognition identifies 6 categories of potentially exclusionary language including person-first violations, deficit-focused terms, and cultural insensitivity.</p>
                </Card>
                
                <Card variant="success" className="insight-card">
                  <h4>💡 Context-Aware Suggestions</h4>
                  <p>AI provides personalized recommendations based on the specific content and context of your text, ensuring relevance and cultural appropriateness.</p>
                </Card>
                
                <Card variant="warning" className="insight-card">
                  <h4>📈 Learning System</h4>
                  <p>Track your progress over time with analysis history and see how your inclusive language skills improve with regular use.</p>
                </Card>
                
                <Card variant="primary" className="insight-card">
                  <h4>🌍 Cultural Sensitivity</h4>
                  <p>Specialized detection for cultural insensitivity, geographic bias, and community-specific language patterns to ensure respectful communication.</p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Offline Mode Tab */}
        {activeTab === 'offline-mode' && (
          <div className="tab-content">
            <OfflineDemo />
            
            <Card variant="default" className="offline-intro">
              <h2>📱 Offline Mode & Low Bandwidth Support</h2>
              <p>InclusiTrack works even when internet connectivity is limited. All data is stored locally and syncs automatically when connection is restored.</p>
            </Card>

            <div className="offline-stats-grid">
              <Card variant="warning" className="offline-stat-card">
                <div className="stat-content">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3 className="stat-value">{insightsData?.offlineStats.pendingSync}</h3>
                    <p className="stat-label">Pending Sync</p>
                  </div>
                </div>
              </Card>

              <Card variant="success" className="offline-stat-card">
                <div className="stat-content">
                  <div className="stat-icon">🕒</div>
                  <div className="stat-info">
                    <h3 className="stat-value">{insightsData?.offlineStats.lastSync}</h3>
                    <p className="stat-label">Last Sync</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card variant="default" className="offline-entries-card">
              <h3>📝 Recent Offline Entries</h3>
              <div className="entries-list">
                {insightsData?.offlineStats.offlineEntries.map((entry) => (
                  <div key={entry.id} className="entry-item">
                    <div className="entry-info">
                      <span className="entry-type">{entry.type}</span>
                      <span className="entry-time">{entry.timestamp}</span>
                    </div>
                    <span className={`entry-status ${entry.status.toLowerCase()}`}>
                      {entry.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="info" className="offline-features-card">
              <h3>🚀 Offline Features</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">💾</div>
                  <div className="feature-content">
                    <h4>Local Storage</h4>
                    <p>All form data is saved locally using IndexedDB</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔄</div>
                  <div className="feature-content">
                    <h4>Auto Sync</h4>
                    <p>Data syncs automatically when connection is restored</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <div className="feature-content">
                    <h4>Compressed Data</h4>
                    <p>Data is compressed for low-bandwidth transfer</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <div className="feature-content">
                    <h4>Secure</h4>
                    <p>All offline data is encrypted and secure</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Map Visualization Tab */}
        {activeTab === 'map' && (
          <div className="tab-content">
            <Card variant="default" className="map-intro">
              <h2>🗺️ Geographic Distribution & Risk Analysis</h2>
              <p>Visualize beneficiary distribution across Kenya and identify service gaps and high-risk areas that need immediate attention.</p>
            </Card>

            <Map 
              height="600px"
              center={[-1.2921, 36.8219]} // Nairobi
              zoom={7}
            />

            <div className="map-insights-grid">
              <Card variant="info" className="map-insight-card">
                <h3>📍 Regional Insights</h3>
                <div className="insight-content">
                  <p><strong>Nairobi:</strong> Highest concentration of beneficiaries (234) with diverse needs including educational support and housing assistance.</p>
                  <p><strong>Kisumu:</strong> Growing youth population with focus on employment and skills training programs.</p>
                  <p><strong>Mombasa:</strong> Strong refugee community requiring specialized support services.</p>
                </div>
              </Card>

              <Card variant="warning" className="map-insight-card">
                <h3>⚠️ High-Risk Areas</h3>
                <div className="insight-content">
                  <p><strong>Rural Nyeri:</strong> Limited access to services, high agricultural training needs.</p>
                  <p><strong>Kisumu Rural:</strong> Mental health support gaps, urgent intervention required.</p>
                  <p><strong>Nairobi East:</strong> Housing crisis affecting multiple beneficiaries.</p>
                </div>
              </Card>

              <Card variant="success" className="map-insight-card">
                <h3>✅ Success Stories</h3>
                <div className="insight-content">
                  <p><strong>Nakuru:</strong> Healthcare access programs showing 85% success rate.</p>
                  <p><strong>Nairobi Central:</strong> Childcare support network effectively serving 150+ families.</p>
                  <p><strong>Youth Programs:</strong> Digital skills training reaching 89% of target beneficiaries.</p>
                </div>
              </Card>

              <Card variant="primary" className="map-insight-card">
                <h3>🎯 Action Items</h3>
                <div className="insight-content">
                  <p><strong>Immediate:</strong> Deploy mental health specialists to Kisumu Rural area.</p>
                  <p><strong>Short-term:</strong> Expand housing assistance programs in Nairobi East.</p>
                  <p><strong>Long-term:</strong> Develop agricultural training centers in rural areas.</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* User Personas Tab */}
        {activeTab === 'personas' && (
          <div className="tab-content">
            <Card variant="default" className="personas-intro">
              <h2>👥 Human Stories & Personas</h2>
              <p>Meet the real people behind our data. Each persona represents a unique story, challenges, and potential for positive impact in our community.</p>
            </Card>

            <div className="personas-grid">
              {insightsData?.personas?.map((persona) => (
                <UserPersona 
                  key={persona.id}
                  user={persona}
                  variant="default"
                  showDetails={true}
                  interactive={true}
                />
              ))}
            </div>

            <div className="personas-insights">
              <Card variant="info" className="personas-stats-card">
                <h3>📊 Persona Insights</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{insightsData?.personas?.length || 0}</div>
                    <div className="stat-label">Total Personas</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {insightsData?.personas?.filter(p => p.riskScore >= 8.5).length || 0}
                    </div>
                    <div className="stat-label">High Priority Cases</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {insightsData?.personas?.filter(p => p.status === 'Active').length || 0}
                    </div>
                    <div className="stat-label">Active Beneficiaries</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {(insightsData?.personas?.reduce((sum, p) => sum + p.riskScore, 0) / (insightsData?.personas?.length || 1)).toFixed(1)}
                    </div>
                    <div className="stat-label">Average Risk Score</div>
                  </div>
                </div>
              </Card>

              <Card variant="success" className="personas-impact-card">
                <h3>🌟 Impact Stories</h3>
                <div className="impact-stories">
                  <div className="impact-story">
                    <div className="story-icon">🎨</div>
                    <div className="story-content">
                      <h4>Creative Empowerment</h4>
                      <p>Sarah's journey from struggling artist to community leader shows how creative support can transform lives and inspire others.</p>
                    </div>
                  </div>
                  <div className="impact-story">
                    <div className="story-icon">♿</div>
                    <div className="story-content">
                      <h4>Accessibility Innovation</h4>
                      <p>James's business success demonstrates how accessibility services can unlock entrepreneurial potential in underserved communities.</p>
                    </div>
                  </div>
                  <div className="impact-story">
                    <div className="story-icon">🏳️‍🌈</div>
                    <div className="story-content">
                      <h4>Inclusive Education</h4>
                      <p>Amina's work with refugee children highlights the power of inclusive education in building resilient communities.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Risk Score AI Tab */}
        {activeTab === 'risk-ai' && (
          <div className="tab-content">
            <Card variant="default" className="risk-ai-intro">
              <h2>🤖 AI-Lite Risk Assessment & Impact Analysis</h2>
              <p>Our intelligent scoring system analyzes multiple vulnerability factors to provide comprehensive risk assessments and actionable recommendations for each beneficiary.</p>
            </Card>

            <div className="risk-ai-grid">
              {insightsData?.riskScoreBeneficiaries?.map((beneficiary) => (
                <Card key={beneficiary.id} variant="default" className="beneficiary-risk-card">
                  <div className="beneficiary-header">
                    <div className="beneficiary-info">
                      <h3>{beneficiary.name}</h3>
                      <p>{beneficiary.age} years old • {beneficiary.location === 'rural' ? 'Rural' : 'Urban'} • {beneficiary.education}</p>
                    </div>
                    <div className="beneficiary-avatar">
                      {beneficiary.disability ? '♿' : beneficiary.lgbtq ? '🏳️‍🌈' : beneficiary.refugee ? '🏠' : '👤'}
                    </div>
                  </div>
                  
                  <RiskScoreAI 
                    beneficiary={beneficiary}
                    showRecommendations={true}
                    variant="default"
                  />
                </Card>
              ))}
            </div>

            <div className="risk-ai-insights">
              <Card variant="info" className="risk-ai-stats-card">
                <h3>📊 AI Assessment Summary</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{insightsData?.riskScoreBeneficiaries?.length || 0}</div>
                    <div className="stat-label">Beneficiaries Analyzed</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {insightsData?.riskScoreBeneficiaries?.filter(b => 
                        b.income === 'low' && b.employment === 'unemployed'
                      ).length || 0}
                    </div>
                    <div className="stat-label">High Economic Risk</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {insightsData?.riskScoreBeneficiaries?.filter(b => b.disability).length || 0}
                    </div>
                    <div className="stat-label">Accessibility Needs</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {insightsData?.riskScoreBeneficiaries?.filter(b => b.location === 'rural').length || 0}
                    </div>
                    <div className="stat-label">Rural Beneficiaries</div>
                  </div>
                </div>
              </Card>

              <Card variant="success" className="risk-ai-impact-card">
                <h3>🎯 AI-Powered Insights</h3>
                <div className="ai-insights">
                  <div className="ai-insight">
                    <div className="insight-icon">🎯</div>
                    <div className="insight-content">
                      <h4>Precision Targeting</h4>
                      <p>AI analyzes 15+ factors to identify the most vulnerable beneficiaries and prioritize interventions.</p>
                    </div>
                  </div>
                  <div className="ai-insight">
                    <div className="insight-icon">📈</div>
                    <div className="insight-content">
                      <h4>Impact Prediction</h4>
                      <p>Predicts potential impact of interventions based on beneficiary skills, background, and community context.</p>
                    </div>
                  </div>
                  <div className="ai-insight">
                    <div className="insight-icon">🤖</div>
                    <div className="insight-content">
                      <h4>Smart Recommendations</h4>
                      <p>Generates personalized action plans and intervention strategies for each beneficiary profile.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

                     {/* End-to-End Demo Tab */}
             {activeTab === 'demo' && (
               <div className="tab-content">
                 <DemoSystem
                   variant="default"
                   showGuidedTour={true}
                   showDataFlow={true}
                   showImpactStories={true}
                 />
               </div>
             )}

             {/* Advanced Analytics Tab */}
             {activeTab === 'advanced' && (
               <div className="tab-content">
                 <AdvancedAnalytics
                   variant="default"
                 />
               </div>
             )}

             {/* Mobile Field App Tab */}
             {activeTab === 'mobile' && (
               <div className="tab-content">
                 <MobileFieldApp
                   variant="default"
                 />
               </div>
             )}

             {/* Integration APIs Tab */}
             {activeTab === 'integrations' && (
               <div className="tab-content">
                 <IntegrationAPIs
                   variant="default"
                 />
               </div>
             )}

             {/* Multi-language Support Tab */}
             {activeTab === 'languages' && (
               <div className="tab-content">
                 <MultiLanguageSupport
                   variant="default"
                 />
               </div>
             )}

             {/* Security & Privacy Dashboard Tab */}
             {activeTab === 'security' && (
               <div className="tab-content">
                 <SecurityPrivacyDashboard
                   variant="default"
                 />
               </div>
             )}

             {/* Performance Monitoring Tab */}
             {activeTab === 'performance' && (
               <div className="tab-content">
                 <PerformanceMonitoring
                   variant="default"
                 />
               </div>
             )}
           </div>
    </div>
  )
}

export default Insights
