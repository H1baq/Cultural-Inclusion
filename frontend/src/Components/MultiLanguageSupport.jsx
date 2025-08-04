import React, { useState, useEffect, useRef } from 'react'
import './MultiLanguageSupport.css'

const MultiLanguageSupport = ({ variant = 'default' }) => {
  const [activeTab, setActiveTab] = useState('languages')
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [readingLevel, setReadingLevel] = useState('standard')
  const [fontSize, setFontSize] = useState('medium')
  const [highContrast, setHighContrast] = useState(false)

  const recognitionRef = useRef(null)
  const speechRef = useRef(null)

  // Supported languages with cultural context
  const supportedLanguages = {
    en: {
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      direction: 'ltr',
      readingLevels: ['basic', 'standard', 'advanced'],
      culturalNotes: 'Primary language for international communication'
    },
    sw: {
      name: 'Swahili',
      nativeName: 'Kiswahili',
      flag: '🇹🇿',
      direction: 'ltr',
      readingLevels: ['basic', 'standard', 'advanced'],
      culturalNotes: 'Widely spoken across East Africa'
    },
    ki: {
      name: 'Kikuyu',
      nativeName: 'Gĩkũyũ',
      flag: '🇰🇪',
      direction: 'ltr',
      readingLevels: ['basic', 'standard'],
      culturalNotes: 'Major ethnic language in central Kenya'
    },
    lu: {
      name: 'Luo',
      nativeName: 'Dholuo',
      flag: '🇰🇪',
      direction: 'ltr',
      readingLevels: ['basic', 'standard'],
      culturalNotes: 'Spoken in western Kenya and parts of Tanzania'
    },
    so: {
      name: 'Somali',
      nativeName: 'Soomaali',
      flag: '🇸🇴',
      direction: 'ltr',
      readingLevels: ['basic', 'standard'],
      culturalNotes: 'Spoken in northeastern Kenya and Somalia'
    }
  }

  // Sample content in different languages
  const contentTranslations = {
    en: {
      welcome: 'Welcome to InclusiTrack',
      subtitle: 'Empowering communities through inclusive technology',
      features: {
        title: 'Key Features',
        beneficiary: 'Beneficiary Management',
        analytics: 'Analytics & Insights',
        support: 'Support Programs',
        reports: 'Reports & Documentation'
      },
      accessibility: {
        title: 'Accessibility Features',
        voiceControl: 'Voice Control',
        textToSpeech: 'Text-to-Speech',
        highContrast: 'High Contrast Mode',
        largeText: 'Large Text Options'
      }
    },
    sw: {
      welcome: 'Karibu InclusiTrack',
      subtitle: 'Kuwawezesha jamii kupitia teknolojia ya kujumuisha',
      features: {
        title: 'Vipengele Muhimu',
        beneficiary: 'Usimamizi wa Wanufaika',
        analytics: 'Uchambuzi na Ufahamu',
        support: 'Mipango ya Msaada',
        reports: 'Ripoti na Nyaraka'
      },
      accessibility: {
        title: 'Vipengele vya Ufikiaji',
        voiceControl: 'Udhibiti wa Sauti',
        textToSpeech: 'Maandishi-kwa-Sauti',
        highContrast: 'Hali ya Ulinganisho wa Juu',
        largeText: 'Chaguo za Maandishi Makubwa'
      }
    },
    ki: {
      welcome: 'Ũũkũ InclusiTrack',
      subtitle: 'Gũtũũra andũ na ũũgĩ wa teknolojia ya gũcangĩrĩria',
      features: {
        title: 'Mĩhĩrĩga ya Mũno',
        beneficiary: 'Gũtongoria kwa Andũ Arĩa Marĩ na Mũgũnda',
        analytics: 'Gũcũthĩria na Gũmenya',
        support: 'Mĩhĩrĩga ya Gũtũũra',
        reports: 'Rĩĩtwa na Nyaraka'
      },
      accessibility: {
        title: 'Mĩhĩrĩga ya Gũkũũra',
        voiceControl: 'Gũtongoria kwa Mũgambo',
        textToSpeech: 'Andĩki-kwa-Mũgambo',
        highContrast: 'Hali ya Gũcangĩrĩria',
        largeText: 'Hingo cia Andĩki Marĩa Manene'
      }
    }
  }

  // Voice commands in different languages
  const voiceCommands = {
    en: {
      'open dashboard': 'Navigate to main dashboard',
      'add beneficiary': 'Open new beneficiary form',
      'view reports': 'Show reports section',
      'help': 'Display help information',
      'settings': 'Open settings menu'
    },
    sw: {
      'fungua dashibodi': 'Enda kwenye dashibodi kuu',
      'ongeza mwenyeji': 'Fungua fomu mpya ya mwenyeji',
      'tazama ripoti': 'Onyesha sehemu ya ripoti',
      'msaada': 'Onyesha maelezo ya msaada',
      'mipangilio': 'Fungua menyu ya mipangilio'
    },
    ki: {
      'ũũkũ dashibodi': 'Thii kũrĩ dashibodi nene',
      'ongera mũndũ wa mũgũnda': 'Fungũra fomu njerũ ya mũndũ wa mũgũnda',
      'ũũkũ rĩĩtwa': 'Onyesha sehemu ya rĩĩtwa',
      'ũtũũra': 'Onyesha ũmenyo wa ũtũũra',
      'mĩpangĩrĩrio': 'Fungũra menyu ya mĩpangĩrĩrio'
    }
  }

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = getLanguageCode(currentLanguage)

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setVoiceText(finalTranscript)
          processVoiceCommand(finalTranscript.toLowerCase())
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (speechRef.current) {
        speechRef.current.cancel()
      }
    }
  }, [currentLanguage])

  const getLanguageCode = (lang) => {
    const codes = {
      en: 'en-US',
      sw: 'sw-TZ',
      ki: 'en-KE', // Kikuyu uses English locale
      lu: 'en-KE', // Luo uses English locale
      so: 'so-SO'
    }
    return codes[lang] || 'en-US'
  }

  const processVoiceCommand = (command) => {
    const commands = voiceCommands[currentLanguage] || voiceCommands.en
    const matchedCommand = Object.keys(commands).find(cmd => 
      command.includes(cmd)
    )
    
    if (matchedCommand) {
      // Execute the command
      console.log(`Executing command: ${commands[matchedCommand]}`)
      // In a real app, this would trigger navigation or actions
    }
  }

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
      setIsListening(true)
    } else {
      alert('Speech recognition is not supported in your browser.')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text) => {
    if (speechRef.current) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = getLanguageCode(currentLanguage)
      utterance.rate = 0.9
      utterance.pitch = 1
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      
      speechRef.current.speak(utterance)
    }
  }

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode)
    // In a real app, this would update the entire application's language
  }

  const getCurrentContent = () => {
    return contentTranslations[currentLanguage] || contentTranslations.en
  }

  const getReadingLevelText = (level) => {
    const levels = {
      basic: 'Basic - Simple words and short sentences',
      standard: 'Standard - Normal reading level',
      advanced: 'Advanced - Complex vocabulary and concepts'
    }
    return levels[level] || levels.standard
  }

  const getFontSizeText = (size) => {
    const sizes = {
      small: 'Small - 12px',
      medium: 'Medium - 16px',
      large: 'Large - 20px',
      extraLarge: 'Extra Large - 24px'
    }
    return sizes[size] || sizes.medium
  }

  return (
    <div className={`multi-language-support ${variant}`}>
      {/* Header */}
      <div className="language-header">
        <div className="header-content">
          <h2>🌍 Multi-language Support</h2>
          <p>Inclusive technology that speaks your language and respects your culture</p>
        </div>
        <div className="language-selector">
          <select 
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className="language-dropdown"
          >
            {Object.entries(supportedLanguages).map(([code, lang]) => (
              <option key={code} value={code}>
                {lang.flag} {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="language-tabs">
        <button 
          className={`language-tab ${activeTab === 'languages' ? 'active' : ''}`}
          onClick={() => setActiveTab('languages')}
        >
          🌍 Languages
        </button>
        <button 
          className={`language-tab ${activeTab === 'voice' ? 'active' : ''}`}
          onClick={() => setActiveTab('voice')}
        >
          🎤 Voice Control
        </button>
        <button 
          className={`language-tab ${activeTab === 'accessibility' ? 'active' : ''}`}
          onClick={() => setActiveTab('accessibility')}
        >
          ♿ Accessibility
        </button>
        <button 
          className={`language-tab ${activeTab === 'cultural' ? 'active' : ''}`}
          onClick={() => setActiveTab('cultural')}
        >
          🏛️ Cultural Adaptation
        </button>
      </div>

      {/* Tab Content */}
      <div className="language-content">
        {/* Languages Tab */}
        {activeTab === 'languages' && (
          <div className="tab-content">
            <div className="languages-section">
              <div className="current-language">
                <h3>🗣️ Current Language: {supportedLanguages[currentLanguage].name}</h3>
                <div className="language-info">
                  <div className="language-details">
                    <p><strong>Native Name:</strong> {supportedLanguages[currentLanguage].nativeName}</p>
                    <p><strong>Direction:</strong> {supportedLanguages[currentLanguage].direction.toUpperCase()}</p>
                    <p><strong>Cultural Notes:</strong> {supportedLanguages[currentLanguage].culturalNotes}</p>
                  </div>
                  <div className="language-preview">
                    <h4>Content Preview</h4>
                    <div className="preview-content">
                      <h5>{getCurrentContent().welcome}</h5>
                      <p>{getCurrentContent().subtitle}</p>
                    </div>
                    <button 
                      className="speak-button"
                      onClick={() => speakText(getCurrentContent().welcome + '. ' + getCurrentContent().subtitle)}
                    >
                      🔊 Speak This Text
                    </button>
                  </div>
                </div>
              </div>

              <div className="supported-languages">
                <h3>🌍 Supported Languages</h3>
                <div className="language-grid">
                  {Object.entries(supportedLanguages).map(([code, lang]) => (
                    <div key={code} className={`language-card ${code === currentLanguage ? 'active' : ''}`}>
                      <div className="language-header">
                        <span className="language-flag">{lang.flag}</span>
                        <div className="language-names">
                          <h4>{lang.name}</h4>
                          <p>{lang.nativeName}</p>
                        </div>
                        {code === currentLanguage && (
                          <span className="current-badge">Current</span>
                        )}
                      </div>
                      <div className="language-features">
                        <p><strong>Reading Levels:</strong> {lang.readingLevels.join(', ')}</p>
                        <p><strong>Direction:</strong> {lang.direction.toUpperCase()}</p>
                        <p className="cultural-notes">{lang.culturalNotes}</p>
                      </div>
                      <button 
                        className="select-language-button"
                        onClick={() => changeLanguage(code)}
                        disabled={code === currentLanguage}
                      >
                        {code === currentLanguage ? '✓ Selected' : 'Select Language'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voice Control Tab */}
        {activeTab === 'voice' && (
          <div className="tab-content">
            <div className="voice-section">
              <div className="voice-controls">
                <h3>🎤 Voice Control & Speech Recognition</h3>
                <p>Control the application using your voice in {supportedLanguages[currentLanguage].name}</p>
                
                <div className="voice-interface">
                  <div className="voice-input">
                    <h4>🎙️ Voice Input</h4>
                    <div className="voice-control-buttons">
                      <button 
                        className={`voice-button ${isListening ? 'listening' : ''}`}
                        onClick={isListening ? stopListening : startListening}
                      >
                        {isListening ? '⏹️ Stop Listening' : '🎤 Start Listening'}
                      </button>
                      <button 
                        className="clear-button"
                        onClick={() => setVoiceText('')}
                      >
                        🗑️ Clear
                      </button>
                    </div>
                    
                    <div className="voice-text-display">
                      <textarea
                        value={voiceText}
                        onChange={(e) => setVoiceText(e.target.value)}
                        placeholder={`Speak in ${supportedLanguages[currentLanguage].name} or type here...`}
                        className="voice-textarea"
                        rows="4"
                      />
                    </div>
                  </div>

                  <div className="voice-output">
                    <h4>🔊 Text-to-Speech</h4>
                    <div className="speech-controls">
                      <button 
                        className={`speak-button ${isSpeaking ? 'speaking' : ''}`}
                        onClick={() => speakText(voiceText || 'Hello, welcome to InclusiTrack')}
                        disabled={isSpeaking}
                      >
                        {isSpeaking ? '🔊 Speaking...' : '🔊 Speak Text'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="voice-commands">
                  <h4>🎯 Voice Commands</h4>
                  <p>Try these voice commands in {supportedLanguages[currentLanguage].name}:</p>
                  <div className="commands-grid">
                    {Object.entries(voiceCommands[currentLanguage] || voiceCommands.en).map(([command, description]) => (
                      <div key={command} className="command-item">
                        <div className="command-phrase">"{command}"</div>
                        <div className="command-description">{description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === 'accessibility' && (
          <div className="tab-content">
            <div className="accessibility-section">
              <h3>♿ Accessibility Features</h3>
              <p>Customize the interface to meet your accessibility needs</p>

              <div className="accessibility-options">
                <div className="option-group">
                  <h4>📖 Reading Level</h4>
                  <p>Choose the complexity of text content</p>
                  <div className="radio-group">
                    {['basic', 'standard', 'advanced'].map((level) => (
                      <label key={level} className="radio-item">
                        <input
                          type="radio"
                          name="readingLevel"
                          value={level}
                          checked={readingLevel === level}
                          onChange={(e) => setReadingLevel(e.target.value)}
                        />
                        <span className="radio-label">
                          <strong>{level.charAt(0).toUpperCase() + level.slice(1)}</strong>
                          <small>{getReadingLevelText(level)}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="option-group">
                  <h4>📝 Text Size</h4>
                  <p>Adjust the size of text throughout the application</p>
                  <div className="radio-group">
                    {['small', 'medium', 'large', 'extraLarge'].map((size) => (
                      <label key={size} className="radio-item">
                        <input
                          type="radio"
                          name="fontSize"
                          value={size}
                          checked={fontSize === size}
                          onChange={(e) => setFontSize(e.target.value)}
                        />
                        <span className="radio-label">
                          <strong>{size.charAt(0).toUpperCase() + size.slice(1)}</strong>
                          <small>{getFontSizeText(size)}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="option-group">
                  <h4>🎨 Visual Options</h4>
                  <p>Enhance visibility and reduce eye strain</p>
                  <div className="checkbox-group">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={highContrast}
                        onChange={(e) => setHighContrast(e.target.checked)}
                      />
                      <span>High Contrast Mode</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" defaultChecked />
                      <span>Reduce Motion</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" defaultChecked />
                      <span>Focus Indicators</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" />
                      <span>Screen Reader Support</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="accessibility-preview">
                <h4>👁️ Preview</h4>
                <div className={`preview-content ${fontSize} ${highContrast ? 'high-contrast' : ''}`}>
                  <h5>Sample Content</h5>
                  <p>This is how the text will appear with your selected accessibility settings. The content adapts to your reading level and visual preferences.</p>
                  <button className="preview-button">Sample Button</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cultural Adaptation Tab */}
        {activeTab === 'cultural' && (
          <div className="tab-content">
            <div className="cultural-section">
              <h3>🏛️ Cultural Adaptation</h3>
              <p>Respectful and culturally appropriate content adaptation</p>

              <div className="cultural-features">
                <div className="feature-card">
                  <div className="feature-icon">🌍</div>
                  <h4>Cultural Context</h4>
                  <p>Content adapted to local cultural norms, values, and communication styles</p>
                  <ul>
                    <li>Respectful greetings and forms of address</li>
                    <li>Cultural symbols and imagery</li>
                    <li>Local examples and references</li>
                    <li>Appropriate color schemes and design</li>
                  </ul>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">📅</div>
                  <h4>Local Calendars</h4>
                  <p>Support for local calendar systems and important cultural dates</p>
                  <ul>
                    <li>Gregorian and local calendar systems</li>
                    <li>Cultural holidays and celebrations</li>
                    <li>Local time zones and formats</li>
                    <li>Seasonal references and activities</li>
                  </ul>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">💰</div>
                  <h4>Local Currencies</h4>
                  <p>Support for local currencies and economic contexts</p>
                  <ul>
                    <li>Kenyan Shilling (KES) formatting</li>
                    <li>Local payment methods (M-Pesa)</li>
                    <li>Economic terminology</li>
                    <li>Local market references</li>
                  </ul>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">🏥</div>
                  <h4>Health & Wellness</h4>
                  <p>Culturally appropriate health and wellness content</p>
                  <ul>
                    <li>Traditional medicine references</li>
                    <li>Local health practices</li>
                    <li>Community health approaches</li>
                    <li>Respectful health communication</li>
                  </ul>
                </div>
              </div>

              <div className="cultural-examples">
                <h4>📝 Cultural Adaptation Examples</h4>
                <div className="examples-grid">
                  <div className="example-item">
                    <h5>Greetings</h5>
                    <div className="example-content">
                      <p><strong>English:</strong> "Hello, how are you?"</p>
                      <p><strong>Swahili:</strong> "Jambo, habari yako?"</p>
                      <p><strong>Kikuyu:</strong> "Ũhoro waku?"</p>
                    </div>
                  </div>
                  <div className="example-item">
                    <h5>Family Terms</h5>
                    <div className="example-content">
                      <p><strong>English:</strong> "Family member"</p>
                      <p><strong>Swahili:</strong> "Mwanafamilia"</p>
                      <p><strong>Kikuyu:</strong> "Mũndũ wa nyũmba"</p>
                    </div>
                  </div>
                  <div className="example-item">
                    <h5>Community</h5>
                    <div className="example-content">
                      <p><strong>English:</strong> "Community support"</p>
                      <p><strong>Swahili:</strong> "Msaada wa jamii"</p>
                      <p><strong>Kikuyu:</strong> "Ũtũũra wa rũũru"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiLanguageSupport 