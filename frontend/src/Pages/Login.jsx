import React, { useState } from 'react'
import './Login.css'

const Login = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'beneficiary',
    phoneNumber: '',
    location: '',
    vulnerabilityFactors: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const vulnerabilityOptions = [
    'Refugee/Displaced',
    'LGBTQ+',
    'Person with Disability',
    'Low Income',
    'Low Literacy',
    'Creative/Artist',
    'Rural Community',
    'Youth (18-25)',
    'Single Parent',
    'Unemployed'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const handleArrayChange = (field, value, action) => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }

      const API_BASE_URL = 'http://localhost:5002'
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      
      let payload
      if (isLogin) {
        payload = { email: formData.email, password: formData.password }
      } else {
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          vulnerabilityFactors: formData.vulnerabilityFactors
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onLogin(data.user, data.token)
      } else {
        setError(data.message || 'An error occurred')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="landing-container">
      {/* Background */}
      <div className="landing-background">
        <div className="background-pattern"></div>
        <div className="floating-elements">
          <div className="floating-icon">🌍</div>
          <div className="floating-icon">🤝</div>
          <div className="floating-icon">💡</div>
          <div className="floating-icon">📊</div>
          <div className="floating-icon">🎨</div>
          <div className="floating-icon">🏘️</div>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
              <div className="logo-icon">🌍</div>
            <span className="logo-text">InclusiTrack</span>
          </div>
          <div className="header-actions">
            <button 
              className="header-btn secondary"
              onClick={() => {
                setIsLogin(true)
                setShowAuthModal(true)
              }}
            >
              Sign In
            </button>
            <button 
              className="header-btn primary"
              onClick={() => {
                setIsLogin(false)
                setShowAuthModal(true)
              }}
            >
              Join HEVA
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transform Lives Through
              <span className="highlight"> Data-Driven Inclusion</span>
            </h1>
            <p className="hero-subtitle">
              Join HEVA's mission to empower vulnerable communities across Kenya. 
              Whether you're a field officer working on the ground or a beneficiary seeking support, 
              together we can create lasting change.
            </p>
            <div className="hero-actions">
              <button 
                className="cta-button primary"
                onClick={() => {
                  setIsLogin(false)
                  setShowAuthModal(true)
                }}
              >
                Start Your Journey
              </button>
              <button 
                className="cta-button secondary"
                onClick={() => {
                  setIsLogin(true)
                  setShowAuthModal(true)
                }}
              >
                Access Your Account
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Vulnerable Groups Supported</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Communities Reached</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Data Privacy Protected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">Why Join HEVA?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Data-Driven Insights</h3>
              <p>Access real-time analytics and insights to make informed decisions about community interventions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Community Connection</h3>
              <p>Connect with other field officers and beneficiaries to share experiences and best practices.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Targeted Support</h3>
              <p>Receive personalized support programs based on your specific needs and circumstances.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with enterprise-grade security and privacy controls.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section className="audience-section">
        <div className="audience-content">
          <h2 className="section-title">Who Should Join?</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-icon">👥</div>
              <h3>Field Officers</h3>
              <p>Register and track beneficiaries, collect data in the field, and generate reports for better community outreach.</p>
              <ul className="audience-benefits">
                <li>• Register beneficiaries efficiently</li>
                <li>• Track community progress</li>
                <li>• Generate detailed reports</li>
                <li>• Access real-time data</li>
              </ul>
            </div>
            <div className="audience-card">
              <div className="audience-icon">💝</div>
              <h3>Beneficiaries</h3>
              <p>Access support programs, track your application status, and connect with resources tailored to your needs.</p>
              <ul className="audience-benefits">
                <li>• Apply for support programs</li>
                <li>• Track application status</li>
                <li>• Access community resources</li>
                <li>• Connect with field officers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of others who are already transforming communities through HEVA's inclusive platform.</p>
          <div className="cta-actions">
            <button 
              className="cta-button primary large"
              onClick={() => {
                setIsLogin(false)
                setShowAuthModal(true)
              }}
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">🌍</div>
              <span>InclusiTrack</span>
            </div>
            <p>Empowering vulnerable communities through data-driven inclusion.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={() => setShowAuthModal(true)}>Sign In</button></li>
              <li><button onClick={() => {
                setIsLogin(false)
                setShowAuthModal(true)
              }}>Create Account</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@heva.org</p>
            <p>Phone: +254 700 000 000</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 HEVA Cultural Inclusion. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isLogin ? 'Welcome Back' : 'Join HEVA'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAuthModal(false)}
              >
                ×
              </button>
          </div>

          <div className="auth-tabs">
            <button 
              className={`tab-button ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
                Sign In
            </button>
            <button 
              className={`tab-button ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
                Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required={!isLogin}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    required={!isLogin}
                    className="form-select"
                  >
                    <option value="beneficiary">Beneficiary</option>
                    <option value="officer">Field Officer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Region"
                    className="form-input"
                  />
                </div>

                {formData.role === 'beneficiary' && (
                  <div className="form-group">
                    <label>Vulnerability Factors</label>
                    <div className="checkbox-grid">
                      {vulnerabilityOptions.map(option => (
                        <label key={option} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.vulnerabilityFactors.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleArrayChange('vulnerabilityFactors', option, 'add')
                              } else {
                                handleArrayChange('vulnerabilityFactors', option, 'remove')
                              }
                            }}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="Enter your email address"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                placeholder="Enter your password"
                minLength="6"
                className="form-input"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required={!isLogin}
                  placeholder="Confirm your password"
                  minLength="6"
                  className="form-input"
                />
              </div>
            )}

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
                <div className="button-content">
                  <span className="button-icon">{isLogin ? '🔐' : '📝'}</span>
                  <span className="button-text">{isLogin ? 'Sign In' : 'Create Account'}</span>
                  {isLoading && (
                    <div className="loading-indicator">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </div>
            </button>
          </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login 