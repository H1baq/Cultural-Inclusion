import React from 'react'
import './Sidebar.css'

const Sidebar = ({ currentPage, setCurrentPage, user }) => {
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
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            <span className="user-icon">{getRoleIcon(user?.role)}</span>
          </div>
          <div className="user-details">
            <h3>{user?.name || 'User'}</h3>
            <span className={`role-badge ${getRoleColor(user?.role)}`}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
            </span>
          </div>
        </div>
      </div>

      <nav className="nav-section">
        <h4>Navigation</h4>
        <ul className="nav-list">
          {navigationItems.map(item => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="role-info">
          <div className="role-icon">{getRoleIcon(user?.role)}</div>
          <div className="role-text">
            <p>Role Information</p>
            <strong>You are logged in as a {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</strong>
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
    </div>
  )
}

export default Sidebar