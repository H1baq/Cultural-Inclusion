import React, { useState, useEffect } from 'react'
import Dashboard from './Pages/Dashboard'
import AdminDashboard from './Pages/AdminDashboard'
import BeneficiaryDashboard from './Pages/BeneficiaryDashboard'
import AnalyticsDashboard from './Pages/AnalyticsDashboard'
import MobileDashboard from './Pages/MobileDashboard'
import DataEntry from './Pages/DataEntry'
import Reports from './Pages/Reports'
import Insights from './Pages/Insights'
import Cohorts from './Pages/Cohorts'
import Login from './Pages/Login'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import './App.css'
import ApplicationStatus from './Pages/ApplicationStatus'
import SupportPrograms from './Pages/SupportPrograms'

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check for existing authentication and mobile device on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        
        // Validate user role - only accept new role system
        const validRoles = ['admin', 'officer', 'beneficiary']
        if (!validRoles.includes(userData.role)) {
          console.log('🔄 Invalid role detected, clearing cached data...')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          return
        }
        
        setToken(savedToken)
        setUser(userData)
        setIsAuthenticated(true)
        
        // Set appropriate default page based on role
        if (userData.role === 'admin') {
          setCurrentPage('admin-dashboard')
        } else if (userData.role === 'beneficiary') {
          setCurrentPage('profile')
        } else {
          setCurrentPage('dashboard')
        }
      } catch (error) {
        console.error('❌ Error parsing cached user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleLogin = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    setIsAuthenticated(true)
    
    // Set appropriate default page based on role
    if (userData.role === 'admin') {
      setCurrentPage('admin-dashboard')
    } else if (userData.role === 'beneficiary') {
      setCurrentPage('profile')
    } else {
      setCurrentPage('dashboard')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    setCurrentPage('dashboard')
  }

  const renderPage = () => {
    // If mobile device, render mobile dashboard
    if (isMobile && isAuthenticated) {
      return <MobileDashboard user={user} />
    }

    // Role-based page access for desktop
    const userRole = user?.role

    switch (currentPage) {
      case 'admin-dashboard':
        if (userRole === 'admin') {
          return <AdminDashboard user={user} />
        }
        return <div className="access-denied">Access Denied</div>
        
      case 'analytics':
        if (userRole === 'admin') {
          return <AnalyticsDashboard user={user} />
        }
        return <div className="access-denied">Access Denied - Admins only</div>
        
      case 'dashboard':
        if (userRole === 'admin') {
          return <Dashboard user={user} />
        } else if (userRole === 'officer') {
          return <Dashboard user={user} />
        } else if (userRole === 'beneficiary') {
          return <Dashboard user={user} />
        }
        return <div className="access-denied">Access Denied</div>
        
      case 'data-entry':
        if (userRole === 'admin' || userRole === 'officer') {
          return <DataEntry user={user} />
        } else if (userRole === 'beneficiary') {
          return <DataEntry user={user} />
        }
        return <div className="access-denied">Access Denied - Officers and Admins only</div>
        
      case 'reports':
        if (userRole === 'admin' || userRole === 'officer') {
          return <Reports user={user} />
        }
        return <div className="access-denied">Access Denied - Officers and Admins only</div>
        
      case 'insights':
        if (userRole === 'admin') {
          return <Insights user={user} />
        }
        return <div className="access-denied">Access Denied - Admins only</div>
        
      case 'cohorts':
        if (userRole === 'admin' || userRole === 'officer') {
          return <Cohorts user={user} />
        }
        return <div className="access-denied">Access Denied - Officers and Admins only</div>
        
      // Beneficiary-specific pages
      case 'profile':
        if (userRole === 'beneficiary') {
          return <BeneficiaryDashboard user={user} />
        }
        return <div className="access-denied">Access Denied - Beneficiaries only</div>
        
      case 'status':
        console.log('🔄 Routing to ApplicationStatus component')
        if (userRole === 'beneficiary') {
          return <ApplicationStatus user={user} />
        }
        return <div className="access-denied">Access Denied - Beneficiaries only</div>
        
      case 'support':
        console.log('🔄 Routing to SupportPrograms component')
        if (userRole === 'beneficiary') {
          return <SupportPrograms user={user} />
        }
        return <div className="access-denied">Access Denied - Beneficiaries only</div>
        
      default:
        if (userRole === 'admin') {
          return <AdminDashboard user={user} />
        } else if (userRole === 'beneficiary') {
          return <BeneficiaryDashboard user={user} />
        }
        return <Dashboard user={user} />
    }
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  // For mobile devices, render mobile dashboard without sidebar/navbar
  if (isMobile) {
    return <MobileDashboard user={user} />
  }

  // Desktop layout with sidebar and navbar
  return (
    <div className='app-container'>
      <Navbar user={user} onLogout={handleLogout} />
      <div className='layout'>
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          user={user} 
        />
        <main className='main-content'>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
