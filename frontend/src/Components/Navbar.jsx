import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'
import OfflineIndicator from './OfflineIndicator'
import './Navbar.css'

const Navbar = ({ user, onLogout }) => {
  const { toggleSidebar, isSidebarOpen } = useTheme()

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin':
        return '👑 Administrator'
      case 'officer':
        return '👮 Officer'
      case 'beneficiary':
        return '👤 Beneficiary'
      default:
        return '👤 User'
    }
  }

  return (
    <nav className={`navbar ${!isSidebarOpen ? 'expanded' : ''}`}>
      <div className="navbar-left">
        <button 
          className="navbar-button sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg 
            className="navbar-button-icon"
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        
        <div className="navbar-title">
          InclusiTrack
        </div>
      </div>
      
      <div className="navbar-right">
        <div className="navbar-actions">
          <OfflineIndicator />
          <ThemeToggle />
        </div>
        
        {user && (
          <div className="navbar-user">
            <div className="navbar-user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="navbar-user-info">
              <div className="navbar-user-name">{user.name}</div>
              <div className="navbar-user-role">{getRoleDisplay(user.role)}</div>
            </div>
            <button className="navbar-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar