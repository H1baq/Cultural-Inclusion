import React, { useState } from 'react'
import offlineManager from '../utils/offlineManager'
import Card from './Card'
import './OfflineDemo.css'

const OfflineDemo = () => {
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [entryType, setEntryType] = useState('beneficiary')
  const [entryData, setEntryData] = useState('')
  const [message, setMessage] = useState('')

  const sampleData = {
    beneficiary: {
      name: 'John Doe',
      age: 25,
      location: 'Nairobi',
      needs: 'Educational support'
    },
    progress: {
      beneficiaryId: 'BEN001',
      milestone: 'Completed training program',
      notes: 'Showed excellent progress in digital skills'
    },
    emergency: {
      beneficiaryId: 'BEN002',
      issue: 'Medical emergency',
      urgency: 'High',
      description: 'Requires immediate medical attention'
    },
    update: {
      beneficiaryId: 'BEN003',
      field: 'Contact information',
      oldValue: 'Old phone number',
      newValue: 'New phone number'
    },
    report: {
      type: 'Monthly progress report',
      period: 'January 2024',
      summary: 'Overall positive outcomes for 89% of beneficiaries'
    }
  }

  const handleAddEntry = async () => {
    if (!entryData.trim()) {
      setMessage('Please enter some data for the entry.')
      return
    }

    setIsAddingEntry(true)
    setMessage('')

    try {
      const data = {
        ...sampleData[entryType],
        customData: entryData,
        timestamp: new Date().toISOString()
      }

      await offlineManager.addOfflineEntry(entryType, data)
      setMessage(`✅ ${entryType} entry added successfully! Check the offline status indicator.`)
      setEntryData('')
    } catch (error) {
      console.error('Failed to add entry:', error)
      setMessage('❌ Failed to add entry. Please try again.')
    } finally {
      setIsAddingEntry(false)
    }
  }

  const handleQuickAdd = async (type) => {
    setIsAddingEntry(true)
    setMessage('')

    try {
      const data = {
        ...sampleData[type],
        timestamp: new Date().toISOString(),
        quickAdd: true
      }

      await offlineManager.addOfflineEntry(type, data)
      setMessage(`✅ ${type} entry added successfully!`)
    } catch (error) {
      console.error('Failed to add entry:', error)
      setMessage('❌ Failed to add entry. Please try again.')
    } finally {
      setIsAddingEntry(false)
    }
  }

  return (
    <Card variant="default" className="offline-demo">
      <div className="demo-header">
        <h3>🧪 Test Offline Functionality</h3>
        <p>Add sample entries to test the offline storage and sync features</p>
      </div>

      {message && (
        <div className={`demo-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="demo-section">
        <h4>Quick Add Sample Entries</h4>
        <div className="quick-add-buttons">
          <button 
            className="quick-add-btn beneficiary"
            onClick={() => handleQuickAdd('beneficiary')}
            disabled={isAddingEntry}
          >
            👤 Add Beneficiary
          </button>
          <button 
            className="quick-add-btn progress"
            onClick={() => handleQuickAdd('progress')}
            disabled={isAddingEntry}
          >
            📈 Add Progress
          </button>
          <button 
            className="quick-add-btn emergency"
            onClick={() => handleQuickAdd('emergency')}
            disabled={isAddingEntry}
          >
            🚨 Add Emergency
          </button>
          <button 
            className="quick-add-btn update"
            onClick={() => handleQuickAdd('update')}
            disabled={isAddingEntry}
          >
            🔄 Add Update
          </button>
          <button 
            className="quick-add-btn report"
            onClick={() => handleQuickAdd('report')}
            disabled={isAddingEntry}
          >
            📋 Add Report
          </button>
        </div>
      </div>

      <div className="demo-section">
        <h4>Custom Entry</h4>
        <div className="custom-entry-form">
          <div className="form-row">
            <label htmlFor="entryType">Entry Type:</label>
            <select 
              id="entryType"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
            >
              <option value="beneficiary">Beneficiary</option>
              <option value="progress">Progress</option>
              <option value="emergency">Emergency</option>
              <option value="update">Update</option>
              <option value="report">Report</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="entryData">Additional Data:</label>
            <textarea
              id="entryData"
              value={entryData}
              onChange={(e) => setEntryData(e.target.value)}
              placeholder="Enter additional information..."
              rows="3"
            />
          </div>

          <button 
            className="add-entry-btn"
            onClick={handleAddEntry}
            disabled={isAddingEntry}
          >
            {isAddingEntry ? '🔄 Adding...' : '➕ Add Entry'}
          </button>
        </div>
      </div>


    </Card>
  )
}

export default OfflineDemo 