import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './Sidebar.css'

const Sidebar = ({ currentPage, setCurrentPage, user }) => {
  const { isSidebarOpen } = useTheme()

  const getNavigationItems = () => {
    if (!user) return []

    switch (user.role) {
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Admin Panel', icon: '🔐' },
          { id: 'analytics', label: 'Analytics', icon: '📊' },
          { id: 'dashboard', label: 'Dashboard', icon: '📈' },
          { id: 'data-entry', label: 'Data Entry', icon: '📝' },
          { id: 'reports', label: 'Reports', icon: '📋' },
          { id: 'insights', label: 'Insights', icon: '💡' },
          { id: 'cohorts', label: 'Cohorts', icon: '👥' }
        ]
      case 'officer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: '📈' },
          { id: 'data-entry', label: 'Data Entry', icon: '📝' },
          { id: 'reports', label: 'Reports', icon: '📋' },
          { id: 'cohorts', label: 'Cohorts', icon: '👥' }
        ]
      case 'beneficiary':
        return [
          { id: 'profile', label: 'My Profile', icon: '👤' },
          { id: 'data-entry', label: 'Data Entry', icon: '📝' },
          { id: 'status', label: 'Application Status', icon: '📊' },
          { id: 'support', label: 'Support Programs', icon: '🤝' }
        ]
      default:
        return []
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '👑'
      case 'officer': return '👮'
      case 'beneficiary': return '👤'
      default: return '👤'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'admin'
      case 'officer': return 'officer'
      case 'beneficiary': return 'beneficiary'
      default: return 'default'
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            HEVA
          </div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <div className="sidebar-user-avatar">
            {getRoleIcon(user?.role)}
          </div>
          <div className="sidebar-user-details">
            <div className="sidebar-user-name">
              {user?.name || 'User'}
            </div>
            <div className="sidebar-user-role">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
            </div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-section">
          <div className="sidebar-nav-title">Navigation</div>
          {navigationItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
              aria-label={item.label}
            >
              <div className="sidebar-nav-icon">
                {item.icon}
              </div>
              <span className="sidebar-nav-text">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-nav-section">
          <div className="sidebar-nav-title">Role Information</div>
          <div className="role-info">
            <div className="role-icon">{getRoleIcon(user?.role)}</div>
            <div className="role-text">
              <p>You are logged in as a {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
              {user?.role === 'admin' && (
                <div className="role-description">Full system access and management capabilities</div>
              )}
              {user?.role === 'officer' && (
                <div className="role-description">Data entry and beneficiary management</div>
              )}
              {user?.role === 'beneficiary' && (
                <div className="role-description">Profile management and support access</div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar