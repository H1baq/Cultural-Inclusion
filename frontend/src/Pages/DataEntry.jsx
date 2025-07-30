import { useState } from 'react'
import './DataEntry.css'

const identityOptions = [
  'LGBTQI+',
  'Refugee',
  'Women-led Business',
  'Person with Disability',
  'Creative Professional',
  'Other',
]

const programOptions = [
  'Skills Training',
  'Mental Health Support',
  'Financial Inclusion',
  'Employment Program',
  'Education Access',
  'Community Building',
]

const DataEntry = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    identities: [],
    program: '',
    notes: '',
  })

  const [recentEntries, setRecentEntries] = useState([])

  const toggleIdentity = (group) => {
    setFormData((prev) => ({
      ...prev,
      identities: prev.identities.includes(group)
        ? prev.identities.filter((g) => g !== group)
        : [...prev.identities, group],
    }))
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.age || !formData.location || !formData.program) {
      alert('Please fill required fields.')
      return
    }

    const newEntry = { ...formData, id: Date.now() }
    setRecentEntries([newEntry, ...recentEntries.slice(0, 4)])
    setFormData({ name: '', age: '', location: '', identities: [], program: '', notes: '' })
  }

  return (
    <div className="data-page">
      <h2>Data Entry</h2>
      <p>Add new beneficiary information and program data to build comprehensive insights</p>

      <form className="manual-form" onSubmit={handleSubmit}>
        <h3>➕ Add New Beneficiary</h3>
        <p>Enter individual participant information manually</p>

        <input name="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} required />
        <div className="row">
          <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
          <input name="location" placeholder="City/Region" value={formData.location} onChange={handleChange} />
        </div>

        <div className="identity-group">
          <p>Identity Groups</p>
          <div className="checkboxes">
            {identityOptions.map((opt) => (
              <label key={opt}>
                <input type="checkbox" checked={formData.identities.includes(opt)} onChange={() => toggleIdentity(opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <select name="program" value={formData.program} onChange={handleChange}>
          <option value="">Select program type</option>
          {programOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <textarea
          name="notes"
          placeholder="Any additional information or special circumstances"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">Submit Entry</button>
      </form>

      {/* Progress Cards */}
      <div className="progress-stats">
        <div className="card">
          <h4>This Month's Progress</h4>
          <p><strong>New Entries:</strong> 142</p>
          <p><strong>Data Quality:</strong> 98.5%</p>
        </div>

        <div className="card recent">
          <h4>Recent Entries</h4>
          {recentEntries.length === 0 ? <p>No recent entries yet.</p> : (
            <ul>
              {recentEntries.map((entry) => (
                <li key={entry.id}>{entry.name} – {entry.location} ({entry.program})</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default DataEntry
