import React, { useState, useEffect, useRef } from 'react'
import './InclusiveLanguageChecker.css'

const InclusiveLanguageChecker = ({ 
  initialText = '', 
  showGuidelines = true, 
  showHistory = true,
  variant = 'default' 
}) => {
  const [text, setText] = useState(initialText)
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [biasScore, setBiasScore] = useState(0)
  const [inclusivityScore, setInclusivityScore] = useState(100)
  const [analysisHistory, setAnalysisHistory] = useState([])
  const textareaRef = useRef(null)

  // Enhanced bias detection patterns
  const biasPatterns = {
    // Person-first language violations
    personFirst: {
      patterns: [
        { regex: /\b(disabled|handicapped)\s+(person|people|individuals?)\b/gi, severity: 'high', category: 'person-first' },
        { regex: /\b(mentally\s+ill|mentally\s+disabled)\b/gi, severity: 'high', category: 'person-first' },
        { regex: /\b(poor|homeless|unemployed)\s+(person|people)\b/gi, severity: 'medium', category: 'person-first' }
      ],
      suggestions: [
        'Use "person with disability" instead of "disabled person"',
        'Use "person experiencing homelessness" instead of "homeless person"',
        'Use "person seeking employment" instead of "unemployed person"'
      ]
    },
    
    // Deficit-focused language
    deficitLanguage: {
      patterns: [
        { regex: /\b(disadvantaged|underprivileged|at-risk)\b/gi, severity: 'high', category: 'deficit' },
        { regex: /\b(vulnerable|marginalized|deprived)\b/gi, severity: 'medium', category: 'deficit' },
        { regex: /\b(needy|destitute|impoverished)\b/gi, severity: 'high', category: 'deficit' }
      ],
      suggestions: [
        'Focus on strengths and capabilities rather than limitations',
        'Use "experiencing challenges" instead of "disadvantaged"',
        'Highlight resilience and potential for growth'
      ]
    },
    
    // Paternalistic language
    paternalistic: {
      patterns: [
        { regex: /\b(help|assist|support)\s+(these\s+)?(people|them|individuals)\b/gi, severity: 'medium', category: 'paternalistic' },
        { regex: /\b(give|provide|offer)\s+(to\s+)?(them|these\s+people)\b/gi, severity: 'medium', category: 'paternalistic' },
        { regex: /\b(empower|enable|enable)\s+(them|these\s+people)\b/gi, severity: 'low', category: 'paternalistic' }
      ],
      suggestions: [
        'Use "partner with" instead of "help"',
        'Use "collaborate" instead of "assist"',
        'Use "work together" instead of "provide support"'
      ]
    },
    
    // Gender assumptions
    genderAssumptions: {
      patterns: [
        { regex: /\b(he\s+or\s+she|his\s+or\s+her)\b/gi, severity: 'low', category: 'gender' },
        { regex: /\b(man\s+or\s+woman|men\s+and\s+women)\b/gi, severity: 'low', category: 'gender' },
        { regex: /\b(guys|gals|ladies\s+and\s+gentlemen)\b/gi, severity: 'medium', category: 'gender' }
      ],
      suggestions: [
        'Use "they/them" pronouns for gender-neutral language',
        'Use "people" instead of "men and women"',
        'Use "everyone" instead of "ladies and gentlemen"'
      ]
    },
    
    // Cultural insensitivity
    culturalInsensitivity: {
      patterns: [
        { regex: /\b(primitive|backward|underdeveloped)\b/gi, severity: 'high', category: 'cultural' },
        { regex: /\b(traditional\s+vs\s+modern|old-fashioned)\b/gi, severity: 'medium', category: 'cultural' },
        { regex: /\b(western\s+standards|developed\s+world)\b/gi, severity: 'medium', category: 'cultural' }
      ],
      suggestions: [
        'Respect diverse cultural practices and perspectives',
        'Avoid value judgments about different ways of life',
        'Use "different approaches" instead of "traditional vs modern"'
      ]
    },
    
    // Age-related bias
    ageBias: {
      patterns: [
        { regex: /\b(elderly|senior\s+citizen|old\s+person)\b/gi, severity: 'medium', category: 'age' },
        { regex: /\b(young\s+and\s+inexperienced|youthful\s+energy)\b/gi, severity: 'low', category: 'age' },
        { regex: /\b(millennial|boomer|gen\s+z)\b/gi, severity: 'low', category: 'age' }
      ],
      suggestions: [
        'Use "older adult" instead of "elderly"',
        'Focus on experience and wisdom rather than age',
        'Avoid generational stereotypes'
      ]
    }
  }

  // Context-aware suggestions based on text content
  const getContextSuggestions = (text) => {
    const suggestions = []
    
    if (text.toLowerCase().includes('disability') || text.toLowerCase().includes('disabled')) {
      suggestions.push({
        category: 'Accessibility',
        suggestion: 'Consider adding accessibility information or accommodations mentioned',
        priority: 'medium'
      })
    }
    
    if (text.toLowerCase().includes('refugee') || text.toLowerCase().includes('migrant')) {
      suggestions.push({
        category: 'Cultural Sensitivity',
        suggestion: 'Consider acknowledging the strength and resilience of displaced communities',
        priority: 'high'
      })
    }
    
    if (text.toLowerCase().includes('rural') || text.toLowerCase().includes('village')) {
      suggestions.push({
        category: 'Geographic Sensitivity',
        suggestion: 'Consider highlighting the unique strengths and resources of rural communities',
        priority: 'medium'
      })
    }
    
    if (text.toLowerCase().includes('lgbtq') || text.toLowerCase().includes('queer')) {
      suggestions.push({
        category: 'Inclusive Language',
        suggestion: 'Ensure the text creates a safe and welcoming environment for LGBTQ+ individuals',
        priority: 'high'
      })
    }
    
    return suggestions
  }

  // Analyze text for bias and inclusivity
  const analyzeText = (inputText) => {
    setIsAnalyzing(true)
    
    // Simulate AI processing time
    setTimeout(() => {
      const issues = []
      let totalBiasScore = 0
      let totalIssues = 0
      
      // Check each bias category
      Object.entries(biasPatterns).forEach(([category, config]) => {
        config.patterns.forEach(pattern => {
          const matches = inputText.match(pattern.regex)
          if (matches) {
            const severityScore = pattern.severity === 'high' ? 3 : pattern.severity === 'medium' ? 2 : 1
            totalBiasScore += severityScore * matches.length
            totalIssues += matches.length
            
            issues.push({
              category: category,
              severity: pattern.severity,
              matches: matches,
              pattern: pattern.regex.source,
              suggestions: config.suggestions,
              count: matches.length
            })
          }
        })
      })
      
      // Calculate scores
      const maxPossibleScore = inputText.split(' ').length * 3 // Maximum possible bias score
      const biasPercentage = Math.min(100, (totalBiasScore / maxPossibleScore) * 100)
      const inclusivityPercentage = Math.max(0, 100 - biasPercentage)
      
      // Get context-aware suggestions
      const contextSuggestions = getContextSuggestions(inputText)
      
      const analysisResult = {
        issues: issues,
        biasScore: Math.round(biasPercentage),
        inclusivityScore: Math.round(inclusivityPercentage),
        totalIssues: totalIssues,
        wordCount: inputText.split(' ').length,
        contextSuggestions: contextSuggestions,
        timestamp: new Date().toISOString()
      }
      
      setAnalysis(analysisResult)
      setBiasScore(Math.round(biasPercentage))
      setInclusivityScore(Math.round(inclusivityPercentage))
      setSuggestions([...issues, ...contextSuggestions])
      setIsAnalyzing(false)
      
      // Add to history
      if (inputText.trim()) {
        setAnalysisHistory(prev => [analysisResult, ...prev.slice(0, 9)]) // Keep last 10
      }
    }, 1500)
  }

  // Debounced text analysis
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text.trim()) {
        analyzeText(text)
      } else {
        setAnalysis(null)
        setBiasScore(0)
        setInclusivityScore(100)
        setSuggestions([])
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [text])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [text])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc3545'
      case 'medium': return '#fd7e14'
      case 'low': return '#ffc107'
      default: return '#6c757d'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745'
    if (score >= 60) return '#17a2b8'
    if (score >= 40) return '#ffc107'
    return '#dc3545'
  }

  return (
    <div className={`inclusive-language-checker ${variant}`}>
      {/* Text Input Area */}
      <div className="text-input-section">
        <div className="input-header">
          <h3>📝 Enter Text to Analyze</h3>
          <div className="input-stats">
            <span className="word-count">{text.split(' ').filter(word => word.length > 0).length} words</span>
            <span className="char-count">{text.length} characters</span>
          </div>
        </div>
        
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here to check for inclusive language..."
          className="text-input"
          rows={6}
        />
        
        {isAnalyzing && (
          <div className="analyzing-indicator">
            <div className="analyzing-spinner"></div>
            <span>🤖 AI analyzing text for inclusive language...</span>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && !isAnalyzing && (
        <div className="analysis-results">
          {/* Score Overview */}
          <div className="score-overview">
            <div className="score-card inclusivity">
              <div className="score-header">
                <h4>Inclusivity Score</h4>
                <span className="score-icon">🤝</span>
              </div>
              <div className="score-value" style={{ color: getScoreColor(inclusivityScore) }}>
                {inclusivityScore}%
              </div>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ 
                    width: `${inclusivityScore}%`, 
                    backgroundColor: getScoreColor(inclusivityScore) 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="score-card bias">
              <div className="score-header">
                <h4>Bias Detection</h4>
                <span className="score-icon">⚠️</span>
              </div>
              <div className="score-value" style={{ color: getScoreColor(100 - biasScore) }}>
                {biasScore}%
              </div>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ 
                    width: `${biasScore}%`, 
                    backgroundColor: getScoreColor(100 - biasScore) 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Issues Found */}
          {analysis.issues.length > 0 && (
            <div className="issues-section">
              <h4>🚨 Issues Found ({analysis.totalIssues})</h4>
              <div className="issues-grid">
                {analysis.issues.map((issue, index) => (
                  <div key={index} className={`issue-card ${issue.severity}`}>
                    <div className="issue-header">
                      <span className="severity-icon">{getSeverityIcon(issue.severity)}</span>
                      <span className="issue-category">{issue.category}</span>
                      <span className="issue-count">{issue.count} found</span>
                    </div>
                    <div className="issue-matches">
                      <strong>Found:</strong> "{issue.matches.join(', ')}"
                    </div>
                    <div className="issue-suggestions">
                      <strong>Suggestions:</strong>
                      <ul>
                        {issue.suggestions.slice(0, 2).map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Context Suggestions */}
          {analysis.contextSuggestions.length > 0 && (
            <div className="context-suggestions">
              <h4>💡 Context-Aware Suggestions</h4>
              <div className="suggestions-grid">
                {analysis.contextSuggestions.map((suggestion, index) => (
                  <div key={index} className={`suggestion-card ${suggestion.priority}`}>
                    <div className="suggestion-header">
                      <span className="suggestion-category">{suggestion.category}</span>
                      <span className="suggestion-priority">{suggestion.priority}</span>
                    </div>
                    <p className="suggestion-text">{suggestion.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Clear Message */}
          {analysis.issues.length === 0 && analysis.contextSuggestions.length === 0 && (
            <div className="all-clear">
              <div className="all-clear-icon">✅</div>
              <h4>Great job! Your text appears to be inclusive and respectful.</h4>
              <p>No bias or exclusionary language detected. Keep up the excellent work!</p>
            </div>
          )}
        </div>
      )}

      {/* Guidelines */}
      {showGuidelines && (
        <div className="guidelines-section">
          <h4>📋 Inclusive Language Guidelines</h4>
          <div className="guidelines-grid">
            <div className="guideline-card">
              <h5>👤 Person-First Language</h5>
              <p>Put the person before their condition or circumstance</p>
              <ul>
                <li>"Person with disability" not "disabled person"</li>
                <li>"Person experiencing homelessness" not "homeless person"</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h5>💪 Strength-Based Language</h5>
              <p>Focus on capabilities and resilience rather than limitations</p>
              <ul>
                <li>Highlight skills and potential</li>
                <li>Avoid deficit-focused terms</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h5>🤝 Collaborative Language</h5>
              <p>Use partnership language instead of paternalistic terms</p>
              <ul>
                <li>"Partner with" instead of "help"</li>
                <li>"Work together" instead of "provide support"</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h5>🌈 Inclusive Pronouns</h5>
              <p>Use gender-neutral language when possible</p>
              <ul>
                <li>Use "they/them" for unknown gender</li>
                <li>Avoid gendered assumptions</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Analysis History */}
      {showHistory && analysisHistory.length > 0 && (
        <div className="history-section">
          <h4>📊 Analysis History</h4>
          <div className="history-list">
            {analysisHistory.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-scores">
                  <span className="history-inclusivity" style={{ color: getScoreColor(item.inclusivityScore) }}>
                    {item.inclusivityScore}% inclusive
                  </span>
                  <span className="history-bias" style={{ color: getScoreColor(100 - item.biasScore) }}>
                    {item.biasScore}% bias
                  </span>
                </div>
                <div className="history-text">
                  {item.wordCount} words • {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default InclusiveLanguageChecker 