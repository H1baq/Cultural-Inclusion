import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import Dashboard from './Pages/Dashboard'
import DataEntry from './Pages/DataEntry'
import Insights from './Pages/Insights'
import Cohorts from './Pages/Cohorts'
import Reports from './Pages/Reports'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/data-entry" element={<DataEntry />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/cohorts" element={<Cohorts />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
