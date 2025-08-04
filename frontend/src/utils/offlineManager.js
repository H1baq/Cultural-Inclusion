// ===== OFFLINE MANAGER UTILITY =====
// Handles offline data storage, sync, and low-bandwidth optimization

class OfflineManager {
  constructor() {
    this.dbName = 'InclusiTrackOffline'
    this.dbVersion = 1
    this.db = null
    this.isOnline = navigator.onLine
    this.syncQueue = []
    
    // Initialize database and event listeners
    this.init()
  }

  async init() {
    try {
      await this.openDatabase()
      this.setupEventListeners()
      console.log('✅ Offline Manager initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Offline Manager:', error)
    }
  }

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Create object stores for different data types
        if (!db.objectStoreNames.contains('pendingEntries')) {
          const pendingStore = db.createObjectStore('pendingEntries', { 
            keyPath: 'id', 
            autoIncrement: true 
          })
          pendingStore.createIndex('timestamp', 'timestamp', { unique: false })
          pendingStore.createIndex('type', 'type', { unique: false })
          pendingStore.createIndex('status', 'status', { unique: false })
        }

        if (!db.objectStoreNames.contains('userData')) {
          const userStore = db.createObjectStore('userData', { 
            keyPath: 'id' 
          })
          userStore.createIndex('userId', 'userId', { unique: false })
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { 
            keyPath: 'id', 
            autoIncrement: true 
          })
          syncStore.createIndex('timestamp', 'timestamp', { unique: false })
          syncStore.createIndex('priority', 'priority', { unique: false })
        }

        console.log('📊 IndexedDB stores created successfully')
      }
    })
  }

  setupEventListeners() {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true
      this.handleOnline()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.handleOffline()
    })

    // Periodic sync attempts when online
    setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.attemptSync()
      }
    }, 30000) // Try every 30 seconds
  }

  // ===== DATA STORAGE =====

  async storeEntry(data) {
    try {
      const entry = {
        ...data,
        timestamp: new Date().toISOString(),
        status: 'pending',
        compressed: this.compressData(data)
      }

      const transaction = this.db.transaction(['pendingEntries'], 'readwrite')
      const store = transaction.objectStore('pendingEntries')
      await store.add(entry)

      // Add to sync queue
      await this.addToSyncQueue(entry)

      console.log('💾 Entry stored offline:', entry)
      return entry
    } catch (error) {
      console.error('❌ Failed to store entry:', error)
      throw error
    }
  }

  async getPendingEntries() {
    try {
      const transaction = this.db.transaction(['pendingEntries'], 'readonly')
      const store = transaction.objectStore('pendingEntries')
      const request = store.getAll()
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('❌ Failed to get pending entries:', error)
      return []
    }
  }

  async updateEntryStatus(id, status) {
    try {
      const transaction = this.db.transaction(['pendingEntries'], 'readwrite')
      const store = transaction.objectStore('pendingEntries')
      const entry = await store.get(id)
      
      if (entry) {
        entry.status = status
        entry.lastUpdated = new Date().toISOString()
        await store.put(entry)
      }
    } catch (error) {
      console.error('❌ Failed to update entry status:', error)
    }
  }

  // ===== SYNC FUNCTIONALITY =====

  async addToSyncQueue(entry) {
    try {
      const syncItem = {
        entryId: entry.id,
        type: entry.type,
        data: entry.compressed,
        timestamp: new Date().toISOString(),
        priority: this.getPriority(entry.type),
        attempts: 0
      }

      const transaction = this.db.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')
      await store.add(syncItem)

      this.syncQueue.push(syncItem)
    } catch (error) {
      console.error('❌ Failed to add to sync queue:', error)
    }
  }

  getPriority(type) {
    const priorities = {
      'emergency': 1,
      'beneficiary': 2,
      'progress': 3,
      'update': 4,
      'report': 5
    }
    return priorities[type] || 5
  }

  async attemptSync() {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return
    }

    console.log('🔄 Attempting to sync offline data...')

    try {
      // Sort by priority
      this.syncQueue.sort((a, b) => a.priority - b.priority)

      for (const syncItem of this.syncQueue) {
        try {
          await this.syncItem(syncItem)
          await this.removeFromSyncQueue(syncItem.id)
          this.syncQueue = this.syncQueue.filter(item => item.id !== syncItem.id)
        } catch (error) {
          syncItem.attempts++
          console.warn(`⚠️ Sync attempt failed for item ${syncItem.id}:`, error)
          
          // Remove after too many attempts
          if (syncItem.attempts >= 3) {
            await this.removeFromSyncQueue(syncItem.id)
            this.syncQueue = this.syncQueue.filter(item => item.id !== syncItem.id)
          }
        }
      }
    } catch (error) {
      console.error('❌ Sync attempt failed:', error)
    }
  }

  async syncItem(syncItem) {
    // Simulate API call with compressed data
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        data: syncItem.data,
        type: syncItem.type,
        timestamp: syncItem.timestamp
      })
    })

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`)
    }

    // Update entry status to synced
    await this.updateEntryStatus(syncItem.entryId, 'synced')
    
    console.log('✅ Successfully synced item:', syncItem.id)
  }

  async removeFromSyncQueue(id) {
    try {
      const transaction = this.db.transaction(['syncQueue'], 'readwrite')
      const store = transaction.objectStore('syncQueue')
      await store.delete(id)
    } catch (error) {
      console.error('❌ Failed to remove from sync queue:', error)
    }
  }

  // ===== DATA COMPRESSION =====

  compressData(data) {
    try {
      // Remove unnecessary fields and compress
      const compressed = {
        ...data,
        // Remove large fields that can be regenerated
        _compressed: true,
        _timestamp: Date.now()
      }

      // Use JSON.stringify for basic compression
      const jsonString = JSON.stringify(compressed)
      
      // For very large data, we could implement more advanced compression
      // For now, we'll use basic optimization
      return jsonString.length > 1000 ? this.advancedCompress(jsonString) : jsonString
    } catch (error) {
      console.error('❌ Compression failed:', error)
      return JSON.stringify(data)
    }
  }

  advancedCompress(data) {
    // Simple compression: remove whitespace and common patterns
    return data
      .replace(/\s+/g, ' ')
      .replace(/"([^"]+)":/g, (match, key) => {
        // Shorten common keys
        const shortKeys = {
          'timestamp': 't',
          'type': 'tp',
          'data': 'd',
          'status': 's',
          'userId': 'uid'
        }
        return `"${shortKeys[key] || key}":`
      })
  }

  decompressData(compressedData) {
    try {
      const data = JSON.parse(compressedData)
      
      if (data._compressed) {
        // Restore original field names
        const restored = { ...data }
        delete restored._compressed
        delete restored._timestamp
        
        // Restore shortened keys
        const longKeys = {
          't': 'timestamp',
          'tp': 'type',
          'd': 'data',
          's': 'status',
          'uid': 'userId'
        }
        
        Object.keys(restored).forEach(key => {
          if (longKeys[key]) {
            restored[longKeys[key]] = restored[key]
            delete restored[key]
          }
        })
        
        return restored
      }
      
      return data
    } catch (error) {
      console.error('❌ Decompression failed:', error)
      return compressedData
    }
  }

  // ===== UTILITY METHODS =====

  async getOfflineStats() {
    try {
      const pendingEntries = await this.getPendingEntries()
      const pendingCount = pendingEntries.filter(entry => entry.status === 'pending').length
      
      const lastSync = localStorage.getItem('lastSync') || 'Never'
      
      return {
        pendingSync: pendingCount,
        lastSync,
        totalOfflineEntries: pendingEntries.length,
        isOnline: this.isOnline,
        syncQueueLength: this.syncQueue.length
      }
    } catch (error) {
      console.error('❌ Failed to get offline stats:', error)
      return {
        pendingSync: 0,
        lastSync: 'Never',
        totalOfflineEntries: 0,
        isOnline: this.isOnline,
        syncQueueLength: 0
      }
    }
  }

  async clearOfflineData() {
    try {
      const transaction = this.db.transaction(['pendingEntries', 'syncQueue'], 'readwrite')
      await transaction.objectStore('pendingEntries').clear()
      await transaction.objectStore('syncQueue').clear()
      
      this.syncQueue = []
      console.log('🗑️ Offline data cleared successfully')
    } catch (error) {
      console.error('❌ Failed to clear offline data:', error)
    }
  }

  handleOnline() {
    console.log('🌐 Back online - attempting sync...')
    this.attemptSync()
    
    // Update last sync time
    localStorage.setItem('lastSync', new Date().toLocaleString())
  }

  handleOffline() {
    console.log('📱 Going offline - storing data locally...')
  }

  // ===== PUBLIC API =====

  async addOfflineEntry(type, data) {
    return await this.storeEntry({
      type,
      data,
      userId: localStorage.getItem('userId'),
      sessionId: Date.now()
    })
  }

  async syncAllPending() {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline')
    }
    
    await this.attemptSync()
    return await this.getOfflineStats()
  }

  async getOfflineStatus() {
    return {
      isOnline: this.isOnline,
      stats: await this.getOfflineStats()
    }
  }
}

// Create singleton instance
const offlineManager = new OfflineManager()

export default offlineManager 