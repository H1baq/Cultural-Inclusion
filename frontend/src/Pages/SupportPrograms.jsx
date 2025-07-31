import React, { useState, useEffect } from 'react'
import './SupportPrograms.css'

const SupportPrograms = ({ user }) => {
  console.log('🤝 SupportPrograms component rendered with user:', user)
  
  const [programs, setPrograms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('No authentication token found')
        setIsLoading(false)
        return
      }

      const response = await fetch('http://localhost:5002/api/programs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPrograms(data.programs || [])
      } else {
        // For now, show mock data since backend endpoint might not exist
        setPrograms([
          {
            id: '1',
            name: 'Creative Arts Development Program',
            category: 'creative-arts',
            description: 'Support for artists, musicians, and creative professionals to develop their skills and businesses.',
            eligibility: ['Creative professionals', 'Artists', 'Musicians', 'Designers'],
            benefits: ['Funding up to $10,000', 'Mentorship', 'Workshop access', 'Market exposure'],
            duration: '6 months',
            status: 'active',
            startDate: '2024-09-01',
            endDate: '2025-03-01',
            spotsAvailable: 25,
            totalSpots: 50,
            image: '🎨'
          },
          {
            id: '2',
            name: 'Youth Entrepreneurship Initiative',
            category: 'business',
            description: 'Empowering young entrepreneurs (18-25) to start and grow their businesses.',
            eligibility: ['Youth (18-25)', 'First-time entrepreneurs', 'Innovative ideas'],
            benefits: ['Seed funding $5,000', 'Business training', 'Networking events', 'Legal support'],
            duration: '12 months',
            status: 'active',
            startDate: '2024-08-15',
            endDate: '2025-08-15',
            spotsAvailable: 15,
            totalSpots: 30,
            image: '🚀'
          },
          {
            id: '3',
            name: 'Digital Skills Training Program',
            category: 'technology',
            description: 'Free digital literacy and technology skills training for underserved communities.',
            eligibility: ['All ages', 'Basic computer knowledge', 'Interest in technology'],
            benefits: ['Free training', 'Certification', 'Job placement assistance', 'Equipment provided'],
            duration: '3 months',
            status: 'active',
            startDate: '2024-10-01',
            endDate: '2025-01-01',
            spotsAvailable: 40,
            totalSpots: 60,
            image: '💻'
          },
          {
            id: '4',
            name: 'LGBTQ+ Community Support Fund',
            category: 'community',
            description: 'Financial and social support for LGBTQ+ individuals facing economic challenges.',
            eligibility: ['LGBTQ+ individuals', 'Economic hardship', 'Age 18+'],
            benefits: ['Emergency funds', 'Mental health support', 'Community events', 'Advocacy training'],
            duration: 'Ongoing',
            status: 'active',
            startDate: '2024-01-01',
            endDate: '2025-12-31',
            spotsAvailable: 100,
            totalSpots: 200,
            image: '🏳️‍🌈'
          },
          {
            id: '5',
            name: 'Rural Development Initiative',
            category: 'rural',
            description: 'Supporting rural communities with agricultural and small business development.',
            eligibility: ['Rural residents', 'Farmers', 'Small business owners'],
            benefits: ['Agricultural training', 'Business development', 'Market access', 'Infrastructure support'],
            duration: '18 months',
            status: 'active',
            startDate: '2024-07-01',
            endDate: '2026-01-01',
            spotsAvailable: 30,
            totalSpots: 50,
            image: '🌾'
          },
          {
            id: '6',
            name: 'Disability Inclusion Program',
            category: 'disability',
            description: 'Creating opportunities and removing barriers for persons with disabilities.',
            eligibility: ['Persons with disabilities', 'Age 18+', 'Interest in employment/education'],
            benefits: ['Accessibility training', 'Job placement', 'Assistive technology', 'Advocacy support'],
            duration: 'Ongoing',
            status: 'active',
            startDate: '2024-01-01',
            endDate: '2025-12-31',
            spotsAvailable: 75,
            totalSpots: 150,
            image: '♿'
          }
        ])
      }
    } catch (error) {
      console.error('Programs fetch error:', error)
      // Show mock data for now
      setPrograms([
        {
          id: '1',
          name: 'Creative Arts Development Program',
          category: 'creative-arts',
          description: 'Support for artists, musicians, and creative professionals to develop their skills and businesses.',
          eligibility: ['Creative professionals', 'Artists', 'Musicians', 'Designers'],
          benefits: ['Funding up to $10,000', 'Mentorship', 'Workshop access', 'Market exposure'],
          duration: '6 months',
          status: 'active',
          startDate: '2024-09-01',
          endDate: '2025-03-01',
          spotsAvailable: 25,
          totalSpots: 50,
          image: '🎨'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All Programs', icon: '📋' },
    { id: 'creative-arts', name: 'Creative Arts', icon: '🎨' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'community', name: 'Community', icon: '🤝' },
    { id: 'rural', name: 'Rural Development', icon: '🌾' },
    { id: 'disability', name: 'Disability Support', icon: '♿' }
  ]

  const filteredPrograms = selectedCategory === 'all' 
    ? programs 
    : programs.filter(program => program.category === selectedCategory)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="support-programs-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading available programs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="support-programs-container">
      <div className="programs-header">
        <h1>🤝 SUPPORT PROGRAMS PAGE</h1>
        <p className="programs-subtitle">
          Discover available programs and opportunities tailored to your needs
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      {/* Category Filter */}
      <div className="category-filter">
        <h3>Filter by Category:</h3>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Programs Grid */}
      <div className="programs-section">
        <div className="programs-stats">
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div className="stat-content">
              <h3>Total Programs</h3>
              <p className="stat-number">{programs.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <div className="stat-content">
              <h3>Available Spots</h3>
              <p className="stat-number">{programs.reduce((total, program) => total + program.spotsAvailable, 0)}</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div className="stat-content">
              <h3>Active Programs</h3>
              <p className="stat-number">{programs.filter(p => p.status === 'active').length}</p>
            </div>
          </div>
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="no-programs">
            <div className="no-programs-icon">🔍</div>
            <h3>No Programs Found</h3>
            <p>No programs match your selected category.</p>
            <p>Try selecting a different category or check back later for new programs.</p>
          </div>
        ) : (
          <div className="programs-grid">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="program-card">
                <div className="program-header">
                  <div className="program-icon">{program.image}</div>
                  <div className="program-status">
                    <span className={`status-badge ${program.status}`}>
                      {program.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                </div>

                <div className="program-content">
                  <h3 className="program-name">{program.name}</h3>
                  <p className="program-description">{program.description}</p>
                  
                  <div className="program-details">
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{program.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Start Date:</span>
                      <span className="detail-value">{formatDate(program.startDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Available Spots:</span>
                      <span className="detail-value">{program.spotsAvailable}/{program.totalSpots}</span>
                    </div>
                  </div>

                  <div className="eligibility-section">
                    <h4>🎯 Eligibility:</h4>
                    <div className="eligibility-tags">
                      {program.eligibility.map((item, index) => (
                        <span key={index} className="eligibility-tag">{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="benefits-section">
                    <h4>🎁 Benefits:</h4>
                    <ul className="benefits-list">
                      {program.benefits.map((benefit, index) => (
                        <li key={index} className="benefit-item">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="program-actions">
                  <button className="apply-btn" disabled={program.spotsAvailable === 0}>
                    {program.spotsAvailable === 0 ? 'Full' : 'Apply Now'}
                  </button>
                  <button className="learn-more-btn">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SupportPrograms 