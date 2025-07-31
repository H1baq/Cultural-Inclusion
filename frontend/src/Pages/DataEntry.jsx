import React, { useState } from 'react'
import './DataEntry.css'

const DataEntry = ({ user }) => {
  const [activeTab, setActiveTab] = useState('beneficiary')
  const [comprehensiveFormData, setComprehensiveFormData] = useState({
    // Personal Information
    fullName: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
    dateOfBirth: '',
    gender: '',
    educationLevel: '',
    
    // Vulnerability Assessment
    vulnerabilityFactors: user?.vulnerabilityFactors || [],
    householdSize: '',
    monthlyIncome: '',
    employmentStatus: '',
    
    // Support Needs (instead of business)
    supportCategory: '',
    supportDescription: '',
    specificNeeds: [],
    fundingAmount: '',
    urgencyLevel: '',
    
    // Additional Information
    previousSupport: '',
    communityImpact: '',
    additionalNotes: ''
  })
  const [formData, setFormData] = useState({
    beneficiary: {
      name: '',
      age: '',
      gender: '',
      identityTags: [],
      literacyLevel: '',
      financialLiteracyScore: '',
      location: '',
      deviceAccess: {
        internet: false,
        deviceType: ''
      },
      incomeLevel: '',
      businessType: '',
      vulnerabilityFactors: []
    },
    survey: {
      title: '',
      description: '',
      targetGroup: [],
      questions: []
    },
    fund: {
      name: '',
      amountAllocated: '',
      source: '',
      beneficiaryId: '',
      purpose: '',
      status: 'Active'
    }
  })

  const [csvFile, setCsvFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

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

  const deviceTypes = [
    'Smartphone',
    'Basic Phone',
    'Computer/Laptop',
    'Tablet',
    'No Device',
    'Shared Device'
  ]

  const literacyLevels = [
    'No Formal Education',
    'Primary School',
    'Secondary School',
    'High School',
    'University/College',
    'Postgraduate'
  ]

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleArrayChange = (section, field, value, action) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: action === 'add' 
          ? [...prev[section][field], value]
          : prev[section][field].filter(item => item !== value)
      }
    }))
  }

  const handleComprehensiveFormChange = (field, value) => {
    setComprehensiveFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSpecificNeedsChange = (need) => {
    setComprehensiveFormData(prev => ({
      ...prev,
      specificNeeds: prev.specificNeeds.includes(need)
        ? prev.specificNeeds.filter(n => n !== need)
        : [...prev.specificNeeds, need]
    }))
  }

  const handleVulnerabilityChange = (factor) => {
    setComprehensiveFormData(prev => ({
      ...prev,
      vulnerabilityFactors: prev.vulnerabilityFactors.includes(factor)
        ? prev.vulnerabilityFactors.filter(f => f !== factor)
        : [...prev.vulnerabilityFactors, factor]
    }))
  }

  const handleComprehensiveSubmit = async () => {
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/auth/update-beneficiary-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(comprehensiveFormData)
      })

      if (response.ok) {
        setSubmitMessage('✅ Information submitted successfully! Your application has been sent for review.')
        // Reset form
        setComprehensiveFormData({
          fullName: user?.name || '',
          phoneNumber: user?.phoneNumber || '',
          location: user?.location || '',
          dateOfBirth: '',
          gender: '',
          educationLevel: '',
          vulnerabilityFactors: user?.vulnerabilityFactors || [],
          householdSize: '',
          monthlyIncome: '',
          employmentStatus: '',
          supportCategory: '',
          supportDescription: '',
          specificNeeds: [],
          fundingAmount: '',
          urgencyLevel: '',
          previousSupport: '',
          communityImpact: '',
          additionalNotes: ''
        })
      } else {
        const data = await response.json()
        setSubmitMessage(`❌ Error: ${data.message || 'Failed to submit information'}`)
      }
    } catch (error) {
      setSubmitMessage('❌ Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (section) => {
    try {
      const API_BASE_URL = 'http://localhost:5002'
      const response = await fetch(`${API_BASE_URL}/api/${section}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData[section])
      })
      
      if (response.ok) {
        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} data saved successfully!`)
        // Reset form
        setFormData(prev => ({
          ...prev,
          [section]: {
            beneficiary: {
              name: '',
              age: '',
              gender: '',
              identityTags: [],
              literacyLevel: '',
              financialLiteracyScore: '',
              location: '',
              deviceAccess: {
                internet: false,
                deviceType: ''
              },
              incomeLevel: '',
              businessType: '',
              vulnerabilityFactors: []
            },
            survey: {
              title: '',
              description: '',
              targetGroup: [],
              questions: []
            },
            fund: {
              name: '',
              amountAllocated: '',
              source: '',
              beneficiaryId: '',
              purpose: '',
              status: 'Active'
            }
          }[section]
        }))
      }
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Error saving data. Please try again.')
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const uploadCSV = async () => {
    if (!csvFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('csvFile', csvFile)
      formData.append('type', activeTab)

      const API_BASE_URL = 'http://localhost:5002'
      const response = await fetch(`${API_BASE_URL}/api/upload-csv`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Successfully uploaded ${result.count} records!`)
        setCsvFile(null)
        setUploadProgress(0)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading CSV:', error)
      alert('Error uploading CSV file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const templates = {
      beneficiary: `Name,Age,Gender,Location,LiteracyLevel,FinancialLiteracyScore,IncomeLevel,BusinessType,VulnerabilityFactors,DeviceType,InternetAccess
John Doe,25,Male,Nairobi,High School,7,Low Income,Creative Arts,"Refugee/Displaced;Creative/Artist",Smartphone,true`,
      survey: `Title,Description,TargetGroup,Question1,Question2,Question3
Financial Literacy Survey,Assessing financial knowledge,"LGBTQ+;Low Income",Do you have a bank account?,How do you manage your money?,What financial services do you use?`,
      fund: `Name,AmountAllocated,Source,Purpose,Status,BeneficiaryId
Creative Arts Grant,15000,Government Grant,Support for artists,Active,12345`
    }

    const template = templates[activeTab]
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}-template.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="data-entry-container">
      {user?.role === 'beneficiary' ? (
        // Beneficiary Data Entry Form
        <div className="beneficiary-data-entry">
          <h1>📝 Submit Your Support Request</h1>
          <p className="subtitle">Tell us about your needs so we can provide targeted support</p>

          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('✅') ? 'success' : 'error'}`}>
              {submitMessage}
            </div>
          )}

          <div className="form-sections">
            {/* Personal Information */}
            <div className="form-section">
              <h4>👤 Personal Information</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={comprehensiveFormData.fullName}
                    onChange={(e) => handleComprehensiveFormChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={comprehensiveFormData.phoneNumber}
                    onChange={(e) => handleComprehensiveFormChange('phoneNumber', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={comprehensiveFormData.location}
                    onChange={(e) => handleComprehensiveFormChange('location', e.target.value)}
                    placeholder="City, County, Country"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={comprehensiveFormData.dateOfBirth}
                    onChange={(e) => handleComprehensiveFormChange('dateOfBirth', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={comprehensiveFormData.gender}
                    onChange={(e) => handleComprehensiveFormChange('gender', e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Education Level</label>
                  <select
                    value={comprehensiveFormData.educationLevel}
                    onChange={(e) => handleComprehensiveFormChange('educationLevel', e.target.value)}
                  >
                    <option value="">Select education level</option>
                    <option value="none">No formal education</option>
                    <option value="primary">Primary school</option>
                    <option value="secondary">Secondary school</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelor">Bachelor's degree</option>
                    <option value="masters">Master's degree</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vulnerability Assessment */}
            <div className="form-section">
              <h4>🎯 Vulnerability Assessment</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Vulnerability Factors (Select all that apply)</label>
                  <div className="checkbox-group">
                    {['Poverty', 'Refugee Status', 'Disability', 'LGBTQ+', 'Low Financial Literacy', 'Lack of Collateral', 'Rural Location', 'Youth (18-25)', 'Single Parent', 'Unemployment'].map(factor => (
                      <label key={factor} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={comprehensiveFormData.vulnerabilityFactors.includes(factor)}
                          onChange={() => handleVulnerabilityChange(factor)}
                        />
                        <span>{factor}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Household Size</label>
                  <input
                    type="number"
                    value={comprehensiveFormData.householdSize}
                    onChange={(e) => handleComprehensiveFormChange('householdSize', e.target.value)}
                    placeholder="Number of people in household"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Monthly Income (USD)</label>
                  <input
                    type="number"
                    value={comprehensiveFormData.monthlyIncome}
                    onChange={(e) => handleComprehensiveFormChange('monthlyIncome', e.target.value)}
                    placeholder="Average monthly income"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Employment Status</label>
                  <select
                    value={comprehensiveFormData.employmentStatus}
                    onChange={(e) => handleComprehensiveFormChange('employmentStatus', e.target.value)}
                  >
                    <option value="">Select employment status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="student">Student</option>
                    <option value="retired">Retired</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Support Needs */}
            <div className="form-section">
              <h4>🤝 Support Needs</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>What type of support do you need?</label>
                  <select
                    value={comprehensiveFormData.supportCategory}
                    onChange={(e) => handleComprehensiveFormChange('supportCategory', e.target.value)}
                  >
                    <option value="">Select support category</option>
                    <option value="startup-support">Startup Support</option>
                    <option value="business-funding">Business Funding</option>
                    <option value="lunch-money">Lunch Money/Food Support</option>
                    <option value="education-support">Education Support</option>
                    <option value="healthcare-support">Healthcare Support</option>
                    <option value="housing-support">Housing Support</option>
                    <option value="creative-arts-support">Creative Arts Support</option>
                    <option value="technology-support">Technology Support</option>
                    <option value="mentorship">Mentorship</option>
                    <option value="training">Skills Training</option>
                    <option value="equipment">Equipment/Resources</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Describe your specific needs</label>
                  <textarea
                    value={comprehensiveFormData.supportDescription}
                    onChange={(e) => handleComprehensiveFormChange('supportDescription', e.target.value)}
                    placeholder="Please describe what you need help with in detail..."
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Specific Support Types (Select all that apply)</label>
                  <div className="checkbox-group">
                    {['Financial Support', 'Mentorship', 'Training', 'Equipment', 'Market Access', 'Networking', 'Legal Support', 'Technical Support', 'Marketing Support', 'Business Development', 'Food Support', 'Housing', 'Healthcare', 'Education', 'Transportation'].map(need => (
                      <label key={need} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={comprehensiveFormData.specificNeeds.includes(need)}
                          onChange={() => handleSpecificNeedsChange(need)}
                        />
                        <span>{need}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Funding Amount Needed (USD)</label>
                  <input
                    type="number"
                    value={comprehensiveFormData.fundingAmount}
                    onChange={(e) => handleComprehensiveFormChange('fundingAmount', e.target.value)}
                    placeholder="Amount of funding needed"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Urgency Level</label>
                  <select
                    value={comprehensiveFormData.urgencyLevel}
                    onChange={(e) => handleComprehensiveFormChange('urgencyLevel', e.target.value)}
                  >
                    <option value="">Select urgency level</option>
                    <option value="critical">Critical (Immediate need)</option>
                    <option value="high">High (Within 1 month)</option>
                    <option value="medium">Medium (Within 3 months)</option>
                    <option value="low">Low (Planning for future)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h4>📝 Additional Information</h4>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Previous Support Received</label>
                  <textarea
                    value={comprehensiveFormData.previousSupport}
                    onChange={(e) => handleComprehensiveFormChange('previousSupport', e.target.value)}
                    placeholder="Describe any previous support or assistance you've received..."
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Expected Community Impact</label>
                  <textarea
                    value={comprehensiveFormData.communityImpact}
                    onChange={(e) => handleComprehensiveFormChange('communityImpact', e.target.value)}
                    placeholder="How will receiving this support benefit your community?"
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Additional Notes</label>
                  <textarea
                    value={comprehensiveFormData.additionalNotes}
                    onChange={(e) => handleComprehensiveFormChange('additionalNotes', e.target.value)}
                    placeholder="Any additional information you'd like to share..."
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              className="submit-button"
              onClick={handleComprehensiveSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
            </button>
          </div>
        </div>
      ) : (
        // Admin/Officer Data Entry
        <>
          <h1>Data Entry Portal</h1>
          <p className="subtitle">Collect and manage data for cultural inclusion initiatives</p>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'beneficiary' ? 'active' : ''}`}
              onClick={() => setActiveTab('beneficiary')}
            >
              👥 Beneficiary Registration
            </button>
            <button 
              className={`tab-button ${activeTab === 'survey' ? 'active' : ''}`}
              onClick={() => setActiveTab('survey')}
            >
              📊 Survey Data
            </button>
            <button 
              className={`tab-button ${activeTab === 'fund' ? 'active' : ''}`}
              onClick={() => setActiveTab('fund')}
            >
              💰 Fund Allocation
            </button>
          </div>

          {/* CSV Upload Section */}
          <div className="csv-upload-section">
            <h2>📁 Bulk Data Upload</h2>
            <div className="upload-controls">
              <div className="file-input-group">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="file-input"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="file-input-label">
                  📁 Choose CSV File
                </label>
                {csvFile && <span className="file-name">{csvFile.name}</span>}
              </div>
              
              <div className="upload-actions">
                <button 
                  className="template-btn"
                  onClick={downloadTemplate}
                >
                  📋 Download Template
                </button>
                
                <button 
                  className="upload-btn"
                  onClick={uploadCSV}
                  disabled={!csvFile || isUploading}
                >
                  {isUploading ? '📤 Uploading...' : '📤 Upload CSV'}
                </button>
              </div>
            </div>
            
            {isUploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{uploadProgress}% Complete</span>
              </div>
            )}
          </div>

          {/* Beneficiary Form */}
          {activeTab === 'beneficiary' && (
            <div className="form-container">
              <h2>Beneficiary Registration</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('beneficiary'); }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={formData.beneficiary.name}
                      onChange={(e) => handleInputChange('beneficiary', 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      value={formData.beneficiary.age}
                      onChange={(e) => handleInputChange('beneficiary', 'age', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={formData.beneficiary.gender}
                      onChange={(e) => handleInputChange('beneficiary', 'gender', e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.beneficiary.location}
                      onChange={(e) => handleInputChange('beneficiary', 'location', e.target.value)}
                      placeholder="City, Region"
                    />
                  </div>

                  <div className="form-group">
                    <label>Literacy Level</label>
                    <select
                      value={formData.beneficiary.literacyLevel}
                      onChange={(e) => handleInputChange('beneficiary', 'literacyLevel', e.target.value)}
                    >
                      <option value="">Select Level</option>
                      {literacyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Financial Literacy Score (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.beneficiary.financialLiteracyScore}
                      onChange={(e) => handleInputChange('beneficiary', 'financialLiteracyScore', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Income Level</label>
                    <select
                      value={formData.beneficiary.incomeLevel}
                      onChange={(e) => handleInputChange('beneficiary', 'incomeLevel', e.target.value)}
                    >
                      <option value="">Select Income Level</option>
                      <option value="Below Poverty Line">Below Poverty Line</option>
                      <option value="Low Income">Low Income</option>
                      <option value="Lower Middle">Lower Middle</option>
                      <option value="Middle Income">Middle Income</option>
                      <option value="Upper Middle">Upper Middle</option>
                      <option value="High Income">High Income</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Business Type (if applicable)</label>
                    <input
                      type="text"
                      value={formData.beneficiary.businessType}
                      onChange={(e) => handleInputChange('beneficiary', 'businessType', e.target.value)}
                      placeholder="e.g., Creative Arts, Small Business, Freelance"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Vulnerability Factors</h3>
                  <div className="checkbox-grid">
                    {vulnerabilityOptions.map(option => (
                      <label key={option} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.beneficiary.vulnerabilityFactors.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleArrayChange('beneficiary', 'vulnerabilityFactors', option, 'add')
                            } else {
                              handleArrayChange('beneficiary', 'vulnerabilityFactors', option, 'remove')
                            }
                          }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <h3>Device & Internet Access</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Device Type</label>
                      <select
                        value={formData.beneficiary.deviceAccess.deviceType}
                        onChange={(e) => handleInputChange('beneficiary', 'deviceAccess', {
                          ...formData.beneficiary.deviceAccess,
                          deviceType: e.target.value
                        })}
                      >
                        <option value="">Select Device</option>
                        {deviceTypes.map(device => (
                          <option key={device} value={device}>{device}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.beneficiary.deviceAccess.internet}
                          onChange={(e) => handleInputChange('beneficiary', 'deviceAccess', {
                            ...formData.beneficiary.deviceAccess,
                            internet: e.target.checked
                          })}
                        />
                        Has Internet Access
                      </label>
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  Register Beneficiary
                </button>
              </form>
            </div>
          )}

          {/* Survey Form */}
          {activeTab === 'survey' && (
            <div className="form-container">
              <h2>Survey Data Entry</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('survey'); }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Survey Title *</label>
                    <input
                      type="text"
                      value={formData.survey.title}
                      onChange={(e) => handleInputChange('survey', 'title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.survey.description}
                      onChange={(e) => handleInputChange('survey', 'description', e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Target Groups</h3>
                  <div className="checkbox-grid">
                    {vulnerabilityOptions.map(option => (
                      <label key={option} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.survey.targetGroup.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleArrayChange('survey', 'targetGroup', option, 'add')
                            } else {
                              handleArrayChange('survey', 'targetGroup', option, 'remove')
                            }
                          }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  Save Survey
                </button>
              </form>
            </div>
          )}

          {/* Fund Form */}
          {activeTab === 'fund' && (
            <div className="form-container">
              <h2>Fund Allocation Tracking</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('fund'); }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Fund Name *</label>
                    <input
                      type="text"
                      value={formData.fund.name}
                      onChange={(e) => handleInputChange('fund', 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Amount Allocated *</label>
                    <input
                      type="number"
                      value={formData.fund.amountAllocated}
                      onChange={(e) => handleInputChange('fund', 'amountAllocated', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Source</label>
                    <input
                      type="text"
                      value={formData.fund.source}
                      onChange={(e) => handleInputChange('fund', 'source', e.target.value)}
                      placeholder="e.g., Government Grant, Private Donor"
                    />
                  </div>

                  <div className="form-group">
                    <label>Purpose</label>
                    <textarea
                      value={formData.fund.purpose}
                      onChange={(e) => handleInputChange('fund', 'purpose', e.target.value)}
                      rows="3"
                      placeholder="Describe the purpose of this fund allocation"
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.fund.status}
                      onChange={(e) => handleInputChange('fund', 'status', e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Flagged">Flagged</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  Allocate Fund
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DataEntry
