import React, { useState, useEffect, useRef } from 'react'
import './MobileFieldApp.css'

const MobileFieldApp = ({ variant = 'default' }) => {
  const [activeTab, setActiveTab] = useState('beneficiary')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaFiles, setMediaFiles] = useState([])
  const [pendingSync, setPendingSync] = useState(0)
  const [beneficiaryData, setBeneficiaryData] = useState({
    name: '',
    age: '',
    location: '',
    needs: '',
    contact: '',
    notes: ''
  })
  const [visitData, setVisitData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString(),
    purpose: '',
    observations: '',
    nextSteps: '',
    photos: [],
    videos: [],
    voiceNotes: []
  })

  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // Mock GPS coordinates for demonstration
  const mockLocations = [
    { name: 'Nairobi West', lat: -1.2921, lng: 36.8219 },
    { name: 'Kisumu Rural', lat: -0.1022, lng: 34.7617 },
    { name: 'Mombasa Coast', lat: -4.0435, lng: 39.6682 },
    { name: 'Nakuru Town', lat: -0.3031, lng: 36.0800 }
  ]

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied, using mock location')
          setCurrentLocation(mockLocations[0])
        }
      )
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInputChange = (field, value) => {
    setBeneficiaryData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleVisitInputChange = (field, value) => {
    setVisitData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhotoCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newMediaFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      type: file.type.startsWith('image/') ? 'photo' : 'video',
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      timestamp: new Date().toISOString(),
      location: currentLocation
    }))

    setMediaFiles(prev => [...prev, ...newMediaFiles])
    setPendingSync(prev => prev + newMediaFiles.length)
  }

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        const voiceNote = {
          id: Date.now(),
          name: `Voice Note ${new Date().toLocaleTimeString()}`,
          url: audioUrl,
          duration: Math.round(audioChunksRef.current.length / 1000),
          timestamp: new Date().toISOString(),
          location: currentLocation
        }

        setVisitData(prev => ({
          ...prev,
          voiceNotes: [...prev.voiceNotes, voiceNote]
        }))
        setPendingSync(prev => prev + 1)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting voice recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const saveBeneficiaryData = () => {
    const data = {
      ...beneficiaryData,
      location: currentLocation,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }

    // In a real app, this would save to IndexedDB
    console.log('Saving beneficiary data:', data)
    setPendingSync(prev => prev + 1)
    
    // Reset form
    setBeneficiaryData({
      name: '',
      age: '',
      location: '',
      needs: '',
      contact: '',
      notes: ''
    })

    alert('Beneficiary data saved successfully!')
  }

  const saveVisitData = () => {
    const data = {
      ...visitData,
      location: currentLocation,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }

    // In a real app, this would save to IndexedDB
    console.log('Saving visit data:', data)
    setPendingSync(prev => prev + 1)
    
    // Reset form
    setVisitData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      purpose: '',
      observations: '',
      nextSteps: '',
      photos: [],
      videos: [],
      voiceNotes: []
    })

    alert('Visit data saved successfully!')
  }

  const syncData = () => {
    if (!isOnline) {
      alert('Cannot sync while offline. Please check your internet connection.')
      return
    }

    // Simulate sync process
    const syncInterval = setInterval(() => {
      setPendingSync(prev => {
        if (prev <= 0) {
          clearInterval(syncInterval)
          alert('All data synced successfully!')
          return 0
        }
        return prev - 1
      })
    }, 500)
  }

  const getLocationName = (coords) => {
    if (!coords) return 'Unknown Location'
    const mockLocation = mockLocations.find(loc => 
      Math.abs(loc.lat - coords.lat) < 0.1 && Math.abs(loc.lng - coords.lng) < 0.1
    )
    return mockLocation ? mockLocation.name : `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`mobile-field-app ${variant}`}>
      {/* Header */}
      <div className="mobile-header">
        <div className="header-content">
          <h2>📱 Mobile Field App</h2>
          <p>Offline-first data collection for field workers</p>
        </div>
        <div className="header-status">
          <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </div>
          {pendingSync > 0 && (
            <button className="sync-button" onClick={syncData}>
              🔄 Sync ({pendingSync})
            </button>
          )}
        </div>
      </div>

      {/* Location Display */}
      <div className="location-display">
        <div className="location-info">
          <span className="location-icon">📍</span>
          <span className="location-text">
            {currentLocation ? getLocationName(currentLocation) : 'Getting location...'}
          </span>
        </div>
        <div className="location-coords">
          {currentLocation && (
            <span className="coords-text">
              {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mobile-tabs">
        <button 
          className={`mobile-tab ${activeTab === 'beneficiary' ? 'active' : ''}`}
          onClick={() => setActiveTab('beneficiary')}
        >
          👤 New Beneficiary
        </button>
        <button 
          className={`mobile-tab ${activeTab === 'visit' ? 'active' : ''}`}
          onClick={() => setActiveTab('visit')}
        >
          📋 Field Visit
        </button>
        <button 
          className={`mobile-tab ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          📸 Media Library
        </button>
      </div>

      {/* Tab Content */}
      <div className="mobile-content">
        {/* New Beneficiary Tab */}
        {activeTab === 'beneficiary' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>👤 Beneficiary Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={beneficiaryData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={beneficiaryData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Age"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    value={beneficiaryData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    placeholder="Phone number"
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Primary Needs</label>
                  <textarea
                    value={beneficiaryData.needs}
                    onChange={(e) => handleInputChange('needs', e.target.value)}
                    placeholder="Describe primary needs and challenges"
                    className="form-textarea"
                    rows="3"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Additional Notes</label>
                  <textarea
                    value={beneficiaryData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional observations or notes"
                    className="form-textarea"
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  className="save-button"
                  onClick={saveBeneficiaryData}
                  disabled={!beneficiaryData.name}
                >
                  💾 Save Beneficiary
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Field Visit Tab */}
        {activeTab === 'visit' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>📋 Field Visit Report</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Visit Date</label>
                  <input
                    type="date"
                    value={visitData.date}
                    onChange={(e) => handleVisitInputChange('date', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Visit Time</label>
                  <input
                    type="time"
                    value={visitData.time}
                    onChange={(e) => handleVisitInputChange('time', e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Visit Purpose</label>
                  <input
                    type="text"
                    value={visitData.purpose}
                    onChange={(e) => handleVisitInputChange('purpose', e.target.value)}
                    placeholder="Purpose of this visit"
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Observations</label>
                  <textarea
                    value={visitData.observations}
                    onChange={(e) => handleVisitInputChange('observations', e.target.value)}
                    placeholder="What did you observe during the visit?"
                    className="form-textarea"
                    rows="4"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Next Steps</label>
                  <textarea
                    value={visitData.nextSteps}
                    onChange={(e) => handleVisitInputChange('nextSteps', e.target.value)}
                    placeholder="What are the next steps or recommendations?"
                    className="form-textarea"
                    rows="3"
                  />
                </div>
              </div>

              {/* Media Capture Section */}
              <div className="media-capture-section">
                <h4>📸 Media Capture</h4>
                <div className="media-controls">
                  <button 
                    className="media-button photo-button"
                    onClick={handlePhotoCapture}
                  >
                    📷 Take Photo/Video
                  </button>
                  <button 
                    className={`media-button voice-button ${isRecording ? 'recording' : ''}`}
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  >
                    {isRecording ? '⏹️ Stop Recording' : '🎤 Voice Note'}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                {/* Recent Media Preview */}
                {mediaFiles.length > 0 && (
                  <div className="media-preview">
                    <h5>Recent Media</h5>
                    <div className="media-grid">
                      {mediaFiles.slice(-4).map((file) => (
                        <div key={file.id} className="media-item">
                          {file.type === 'photo' ? (
                            <img src={file.url} alt={file.name} className="media-thumbnail" />
                          ) : (
                            <video src={file.url} className="media-thumbnail" />
                          )}
                          <div className="media-info">
                            <span className="media-name">{file.name}</span>
                            <span className="media-size">{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice Notes */}
                {visitData.voiceNotes.length > 0 && (
                  <div className="voice-notes-section">
                    <h5>🎤 Voice Notes</h5>
                    <div className="voice-notes-list">
                      {visitData.voiceNotes.map((note) => (
                        <div key={note.id} className="voice-note-item">
                          <audio controls src={note.url} className="voice-player" />
                          <div className="voice-info">
                            <span className="voice-name">{note.name}</span>
                            <span className="voice-duration">{note.duration}s</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button 
                  className="save-button"
                  onClick={saveVisitData}
                  disabled={!visitData.purpose}
                >
                  💾 Save Visit Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Library Tab */}
        {activeTab === 'media' && (
          <div className="tab-content">
            <div className="media-library">
              <h3>📸 Media Library</h3>
              
              {mediaFiles.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📸</div>
                  <h4>No Media Files</h4>
                  <p>Capture photos and videos during field visits to document progress and needs.</p>
                  <button 
                    className="capture-button"
                    onClick={handlePhotoCapture}
                  >
                    📷 Start Capturing
                  </button>
                </div>
              ) : (
                <div className="media-filters">
                  <button className="filter-button active">All</button>
                  <button className="filter-button">Photos</button>
                  <button className="filter-button">Videos</button>
                  <button className="filter-button">Voice Notes</button>
                </div>
              )}

              {mediaFiles.length > 0 && (
                <div className="media-gallery">
                  {mediaFiles.map((file) => (
                    <div key={file.id} className="media-card">
                      <div className="media-preview">
                        {file.type === 'photo' ? (
                          <img src={file.url} alt={file.name} className="media-image" />
                        ) : (
                          <video src={file.url} className="media-video" controls />
                        )}
                        <div className="media-overlay">
                          <button className="media-action">📤</button>
                          <button className="media-action">🗑️</button>
                        </div>
                      </div>
                      <div className="media-details">
                        <h4 className="media-title">{file.name}</h4>
                        <p className="media-meta">
                          {formatFileSize(file.size)} • {new Date(file.timestamp).toLocaleDateString()}
                        </p>
                        <p className="media-location">
                          📍 {getLocationName(file.location)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="offline-banner">
          <span className="offline-icon">🔴</span>
          <span className="offline-text">Working Offline - Data will sync when connection is restored</span>
        </div>
      )}
    </div>
  )
}

export default MobileFieldApp 