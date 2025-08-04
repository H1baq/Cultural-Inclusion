import React, { useState, useEffect } from 'react'
import offlineManager from '../utils/offlineManager'
import './OfflineIndicator.css'

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineStats, setOfflineStats] = useState({
    pendingSync: 0,
    lastSync: 'Never',
    totalOfflineEntries: 0
  })
  const [isSyncing, setIsSyncing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(navigator.onLine)
      loadOfflineStats()
    }

    // Initial load
    loadOfflineStats()

    // Set up event listeners
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    // Periodic updates
    const interval = setInterval(loadOfflineStats, 5000)

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
      clearInterval(interval)
    }
  }, [])

  const loadOfflineStats = async () => {
    try {
      const stats = await offlineManager.getOfflineStats()
      setOfflineStats(stats)
    } catch (error) {
      console.error('Failed to load offline stats:', error)
    }
  }

  const handleSync = async () => {
    if (!isOnline) {
      alert('Cannot sync while offline. Please check your internet connection.')
      return
    }

    setIsSyncing(true)
    try {
      await offlineManager.syncAllPending()
      await loadOfflineStats()
      alert('Sync completed successfully!')
    } catch (error) {
      console.error('Sync failed:', error)
      alert('Sync failed. Please try again.')
    } finally {
      setIsSyncing(false)
    }
  }

  const getStatusIcon = () => {
    if (isSyncing) return '🔄'
    if (!isOnline) return '📱'
    if (offlineStats.pendingSync > 0) return '⏳'
    return '✅'
  }

  const getStatusText = () => {
    if (isSyncing) return 'Syncing...'
    if (!isOnline) return 'Offline'
    if (offlineStats.pendingSync > 0) return `${offlineStats.pendingSync} pending`
    return 'All synced'
  }

  const getStatusClass = () => {
    if (isSyncing) return 'syncing'
    if (!isOnline) return 'offline'
    if (offlineStats.pendingSync > 0) return 'pending'
    return 'synced'
  }

  return (
    <div className="offline-indicator">
      <button 
        className={`offline-status ${getStatusClass()}`}
        onClick={() => setShowDetails(!showDetails)}
        title="Click for offline details"
      >
        <span className="status-icon">{getStatusIcon()}</span>
        <span className="status-text">{getStatusText()}</span>
      </button>

      {showDetails && (
        <div className="offline-details">
          <div className="details-header">
            <h3>📱 Offline Status</h3>
            <button 
              className="close-button"
              onClick={() => setShowDetails(false)}
            >
              ×
            </button>
          </div>

          <div className="details-content">
            <div className="status-item">
              <span className="label">Connection:</span>
              <span className={`value ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? '🌐 Online' : '📱 Offline'}
              </span>
            </div>

            <div className="status-item">
              <span className="label">Pending Sync:</span>
              <span className="value">{offlineStats.pendingSync} entries</span>
            </div>

            <div className="status-item">
              <span className="label">Total Offline:</span>
              <span className="value">{offlineStats.totalOfflineEntries} entries</span>
            </div>

            <div className="status-item">
              <span className="label">Last Sync:</span>
              <span className="value">{offlineStats.lastSync}</span>
            </div>

            {offlineStats.pendingSync > 0 && isOnline && (
              <button 
                className="sync-button"
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? '🔄 Syncing...' : '🔄 Sync Now'}
              </button>
            )}

            {!isOnline && (
              <div className="offline-message">
                <p>📱 You're currently offline. Data will be stored locally and synced when you're back online.</p>
              </div>
            )}

            {offlineStats.pendingSync === 0 && isOnline && (
              <div className="synced-message">
                <p>✅ All data is synced and up to date!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OfflineIndicator 