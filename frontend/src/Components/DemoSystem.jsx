import React, { useState, useEffect, useRef } from 'react'
import './DemoSystem.css'

const DemoSystem = ({ 
  variant = 'default',
  showGuidedTour = true,
  showDataFlow = true,
  showImpactStories = true
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isTourActive, setIsTourActive] = useState(false)
  const [demoData, setDemoData] = useState(null)
  const [csvData, setCsvData] = useState('')
  const [activeScenario, setActiveScenario] = useState('registration')
  const [progressData, setProgressData] = useState({})
  const tourRef = useRef(null)

  // Comprehensive demo scenarios
  const demoScenarios = {
    registration: {
      title: '📝 New Beneficiary Registration',
      description: 'Follow Sarah\'s journey from initial contact to program enrollment',
      steps: [
        {
          title: 'Initial Contact',
          content: 'Sarah Muthoni, a 24-year-old artist from Nairobi West, reaches out through our community outreach program.',
          data: {
            name: 'Sarah Muthoni',
            age: 24,
            location: 'Nairobi West',
            needs: 'Creative arts education and LGBTQ+ support',
            contactDate: '2024-01-15'
          }
        },
        {
          title: 'Assessment & Interview',
          content: 'Our field officer conducts a comprehensive assessment, identifying Sarah\'s artistic talents and specific support needs.',
          data: {
            riskScore: 8.5,
            impactPotential: 9.2,
            skills: ['Digital Art', 'Traditional Painting', 'Community Organizing'],
            barriers: ['Limited access to inclusive spaces', 'Financial constraints']
          }
        },
        {
          title: 'Program Enrollment',
          content: 'Sarah is enrolled in our Creative Arts Empowerment Program with specialized LGBTQ+ support services.',
          data: {
            program: 'Creative Arts Empowerment',
            startDate: '2024-02-01',
            supportServices: ['Art Supplies', 'Mentorship', 'Safe Space Access', 'Mental Health Support']
          }
        }
      ]
    },
    progress: {
      title: '📈 Progress Tracking Over Time',
      description: 'Monitor Sarah\'s growth and achievements throughout her 6-month journey',
      steps: [
        {
          title: 'Month 1: Foundation Building',
          content: 'Sarah attends her first art workshops and begins building confidence in her creative expression.',
          data: {
            workshopsAttended: 8,
            confidenceScore: 6.5,
            newSkills: ['Digital Design Basics', 'Community Building'],
            challenges: 'Still hesitant to share work publicly'
          }
        },
        {
          title: 'Month 3: Skill Development',
          content: 'Sarah\'s artistic skills flourish, and she begins mentoring other young artists in the program.',
          data: {
            workshopsAttended: 24,
            confidenceScore: 8.2,
            newSkills: ['Advanced Digital Art', 'Mentorship', 'Public Speaking'],
            achievements: 'First public art exhibition participation'
          }
        },
        {
          title: 'Month 6: Transformation Complete',
          content: 'Sarah has become a confident artist and community leader, ready to launch her own creative studio.',
          data: {
            workshopsAttended: 48,
            confidenceScore: 9.8,
            newSkills: ['Business Management', 'Studio Operations', 'Community Leadership'],
            achievements: 'Secured funding for creative studio, mentoring 5 other artists'
          }
        }
      ]
    },
    regional: {
      title: '🗺️ Regional Impact Analysis',
      description: 'See how our programs are transforming communities across different regions',
      steps: [
        {
          title: 'Nairobi West Impact',
          content: 'Our programs have reached 150+ beneficiaries in Nairobi West, with 85% reporting improved life satisfaction.',
          data: {
            beneficiaries: 156,
            satisfactionRate: 85,
            programs: ['Creative Arts', 'Digital Skills', 'Mental Health Support'],
            successStories: 23
          }
        },
        {
          title: 'Rural Outreach Success',
          content: 'Rural communities show remarkable resilience and creativity, with 92% of participants starting income-generating activities.',
          data: {
            beneficiaries: 89,
            incomeGeneration: 92,
            programs: ['Agricultural Innovation', 'Digital Literacy', 'Community Leadership'],
            successStories: 15
          }
        },
        {
          title: 'Cross-Regional Collaboration',
          content: 'Urban and rural participants are now collaborating on joint projects, creating sustainable impact networks.',
          data: {
            collaborations: 12,
            participants: 45,
            projects: ['Digital Art Exchange', 'Cultural Preservation', 'Economic Empowerment'],
            impact: 'Strengthened community bonds across regions'
          }
        }
      ]
    },
    language: {
      title: '🤝 Inclusive Language Improvement',
      description: 'Track how our language practices have evolved to be more inclusive and empowering',
      steps: [
        {
          title: 'Before: Traditional Approach',
          content: 'Initial communications used deficit-focused language that emphasized limitations rather than potential.',
          data: {
            inclusivityScore: 45,
            issuesFound: 12,
            commonProblems: ['Deficit-focused terms', 'Paternalistic language', 'Gender assumptions'],
            examples: ['"help these disadvantaged people"', '"vulnerable communities"']
          }
        },
        {
          title: 'During: Learning & Growth',
          content: 'Staff training and AI-powered language checking led to significant improvements in communication.',
          data: {
            inclusivityScore: 78,
            issuesFound: 4,
            improvements: ['Person-first language', 'Strength-based approach', 'Collaborative terms'],
            examples: ['"partner with community members"', '"people with diverse experiences"']
          }
        },
        {
          title: 'After: Excellence Achieved',
          content: 'Our communications now consistently reflect respect, empowerment, and cultural sensitivity.',
          data: {
            inclusivityScore: 94,
            issuesFound: 1,
            bestPractices: ['Context-aware language', 'Cultural sensitivity', 'Empowering narratives'],
            examples: ['"resilient community leaders"', '"diverse creative talents"']
          }
        }
      ]
    }
  }

  // Realistic mock data for CSV import/export
  const generateMockCSV = () => {
    const headers = 'Name,Age,Location,Needs,Risk Score,Impact Potential,Status,Enrollment Date,Last Update\n'
    const rows = [
      'Sarah Muthoni,24,Nairobi West,Creative arts education and LGBTQ+ support,8.5,9.2,Active,2024-02-01,2024-01-15',
      'James Kiprop,19,Rural Nakuru,Digital skills and entrepreneurship,7.2,8.8,Active,2024-01-20,2024-01-10',
      'Amina Hassan,28,Mombasa,Refugee support and language skills,9.1,8.5,Active,2024-01-15,2024-01-12',
      'David Ochieng,22,Kisumu,Disability advocacy and accessibility,6.8,9.0,Active,2024-02-05,2024-01-18',
      'Grace Wanjiku,31,Eldoret,Women empowerment and leadership,7.9,8.7,Active,2024-01-25,2024-01-14',
      'Mohammed Ali,26,Isiolo,Peace building and conflict resolution,8.3,8.9,Active,2024-01-30,2024-01-16',
      'Faith Njeri,23,Thika,Youth development and mentorship,6.5,8.6,Active,2024-02-10,2024-01-20',
      'Peter Kamau,29,Nyeri,Agricultural innovation and sustainability,7.1,8.4,Active,2024-01-28,2024-01-17'
    ].join('\n')
    
    return headers + rows
  }

  // Impact stories data
  const impactStories = [
    {
      id: 1,
      title: 'From Isolation to Community Leadership',
      beneficiary: 'Sarah Muthoni',
      location: 'Nairobi West',
      duration: '6 months',
      impact: {
        before: 'Felt isolated and unable to express her identity safely',
        after: 'Leading a community of 15+ LGBTQ+ artists and activists',
        metrics: {
          confidence: '+85%',
          income: '+300%',
          communityConnections: '+200%'
        }
      },
      story: 'Sarah\'s journey from a shy artist afraid to share her work to a confident community leader who has helped create safe spaces for other LGBTQ+ individuals in Nairobi West.',
      tags: ['LGBTQ+ Support', 'Creative Arts', 'Community Leadership']
    },
    {
      id: 2,
      title: 'Digital Skills Transform Rural Community',
      beneficiary: 'James Kiprop',
      location: 'Rural Nakuru',
      duration: '4 months',
      impact: {
        before: 'Limited access to technology and digital opportunities',
        after: 'Teaching digital skills to 50+ community members',
        metrics: {
          digitalLiteracy: '+90%',
          employment: '+150%',
          communityImpact: '+400%'
        }
      },
      story: 'James learned digital skills through our program and now runs a successful digital literacy center, helping other rural youth access online opportunities.',
      tags: ['Digital Skills', 'Rural Development', 'Youth Empowerment']
    },
    {
      id: 3,
      title: 'Refugee Integration Success Story',
      beneficiary: 'Amina Hassan',
      location: 'Mombasa',
      duration: '8 months',
      impact: {
        before: 'Facing language barriers and social isolation',
        after: 'Bridging cultural gaps and supporting other refugees',
        metrics: {
          languageSkills: '+75%',
          socialConnections: '+180%',
          economicStability: '+250%'
        }
      },
      story: 'Amina overcame language barriers and cultural challenges to become a vital bridge between refugee communities and local services in Mombasa.',
      tags: ['Refugee Support', 'Cultural Integration', 'Language Skills']
    }
  ]

  // Guided tour steps
  const tourSteps = [
    {
      title: 'Welcome to the Demo',
      content: 'Let\'s explore how our Cultural Inclusion system transforms lives through comprehensive support and data-driven insights.',
      position: 'center'
    },
    {
      title: 'Realistic Scenarios',
      content: 'Follow real-life journeys like Sarah\'s transformation from isolation to community leadership.',
      position: 'top'
    },
    {
      title: 'Progress Tracking',
      content: 'See how we monitor growth over time with detailed metrics and visual progress indicators.',
      position: 'bottom'
    },
    {
      title: 'Regional Impact',
      content: 'Explore how our programs create positive change across different communities and regions.',
      position: 'left'
    },
    {
      title: 'Data Flow',
      content: 'Experience seamless CSV import/export capabilities for real-world data management.',
      position: 'right'
    },
    {
      title: 'Impact Stories',
      content: 'Discover compelling success stories that demonstrate the real-world impact of our programs.',
      position: 'center'
    }
  ]

  useEffect(() => {
    setDemoData(demoScenarios[activeScenario])
    setCsvData(generateMockCSV())
  }, [activeScenario])

  const handleCSVImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCsvData(e.target.result)
      }
      reader.readAsText(file)
    }
  }

  const handleCSVExport = () => {
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cultural-inclusion-data.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const startGuidedTour = () => {
    setIsTourActive(true)
    setCurrentStep(0)
  }

  const nextTourStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsTourActive(false)
      setCurrentStep(0)
    }
  }

  const prevTourStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className={`demo-system ${variant}`} ref={tourRef}>
      {/* Demo Header */}
      <div className="demo-header">
        <div className="demo-title-section">
          <h2>🎯 End-to-End Demo System</h2>
          <p>Experience the full power of our Cultural Inclusion platform through realistic scenarios and compelling impact stories.</p>
        </div>
        
        <div className="demo-actions">
          {showGuidedTour && (
            <button 
              className="tour-button"
              onClick={startGuidedTour}
              disabled={isTourActive}
            >
              🚀 Start Guided Tour
            </button>
          )}
          
          <button className="export-button" onClick={handleCSVExport}>
            📊 Export Demo Data
          </button>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="scenario-selector">
        <h3>📋 Choose a Demo Scenario</h3>
        <div className="scenario-tabs">
          {Object.entries(demoScenarios).map(([key, scenario]) => (
            <button
              key={key}
              className={`scenario-tab ${activeScenario === key ? 'active' : ''}`}
              onClick={() => setActiveScenario(key)}
            >
              {scenario.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Scenario Display */}
      {demoData && (
        <div className="scenario-display">
          <div className="scenario-header">
            <h3>{demoData.title}</h3>
            <p>{demoData.description}</p>
          </div>

          <div className="scenario-steps">
            {demoData.steps.map((step, index) => (
              <div key={index} className="scenario-step">
                <div className="step-header">
                  <div className="step-number">{index + 1}</div>
                  <h4>{step.title}</h4>
                </div>
                
                <div className="step-content">
                  <p>{step.content}</p>
                  
                  <div className="step-data">
                    {Object.entries(step.data).map(([key, value]) => (
                      <div key={key} className="data-item">
                        <span className="data-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                        <span className="data-value">
                          {Array.isArray(value) ? value.join(', ') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSV Import/Export Section */}
      {showDataFlow && (
        <div className="data-flow-section">
          <h3>📊 Data Flow Demonstration</h3>
          <p>Experience seamless CSV import/export capabilities for real-world data management.</p>
          
          <div className="csv-controls">
            <div className="csv-import">
              <label htmlFor="csv-file" className="csv-label">
                📁 Import CSV File
              </label>
              <input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="csv-input"
              />
            </div>
            
            <button className="csv-export" onClick={handleCSVExport}>
              📤 Export Current Data
            </button>
          </div>

          <div className="csv-preview">
            <h4>CSV Data Preview</h4>
            <div className="csv-content">
              <pre>{csvData}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Impact Stories */}
      {showImpactStories && (
        <div className="impact-stories-section">
          <h3>🌟 Impact Stories</h3>
          <p>Real transformations that demonstrate the power of inclusive, data-driven support.</p>
          
          <div className="stories-grid">
            {impactStories.map((story) => (
              <div key={story.id} className="impact-story-card">
                <div className="story-header">
                  <h4>{story.title}</h4>
                  <div className="story-meta">
                    <span className="story-beneficiary">{story.beneficiary}</span>
                    <span className="story-location">{story.location}</span>
                    <span className="story-duration">{story.duration}</span>
                  </div>
                </div>
                
                <div className="story-content">
                  <div className="story-narrative">
                    <p><strong>Before:</strong> {story.impact.before}</p>
                    <p><strong>After:</strong> {story.impact.after}</p>
                  </div>
                  
                  <div className="story-metrics">
                    <h5>Key Metrics</h5>
                    <div className="metrics-grid">
                      {Object.entries(story.impact.metrics).map(([key, value]) => (
                        <div key={key} className="metric-item">
                          <span className="metric-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          <span className="metric-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="story-tags">
                    {story.tags.map((tag, index) => (
                      <span key={index} className="story-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guided Tour Overlay */}
      {isTourActive && (
        <div className="tour-overlay">
          <div className={`tour-modal tour-${tourSteps[currentStep].position}`}>
            <div className="tour-content">
              <h3>{tourSteps[currentStep].title}</h3>
              <p>{tourSteps[currentStep].content}</p>
              
              <div className="tour-navigation">
                <button 
                  className="tour-nav-btn"
                  onClick={prevTourStep}
                  disabled={currentStep === 0}
                >
                  ← Previous
                </button>
                
                <span className="tour-progress">
                  {currentStep + 1} of {tourSteps.length}
                </span>
                
                <button 
                  className="tour-nav-btn"
                  onClick={nextTourStep}
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next →'}
                </button>
              </div>
              
              <button 
                className="tour-close"
                onClick={() => setIsTourActive(false)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemoSystem 