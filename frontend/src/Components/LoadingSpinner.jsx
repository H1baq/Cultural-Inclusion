import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({ 
  size = 'medium', 
  variant = 'primary', 
  text = 'Loading...',
  showText = true,
  className = '' 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'spinner-small'
      case 'large': return 'spinner-large'
      case 'xl': return 'spinner-xl'
      default: return 'spinner-medium'
    }
  }

  const getVariantClass = () => {
    switch (variant) {
      case 'success': return 'spinner-success'
      case 'warning': return 'spinner-warning'
      case 'error': return 'spinner-error'
      case 'info': return 'spinner-info'
      default: return 'spinner-primary'
    }
  }

  return (
    <div className={`loading-spinner ${getSizeClass()} ${getVariantClass()} ${className}`}>
      <div className="spinner-container">
        <div className="spinner-ring">
          <div className="spinner-ring-inner"></div>
        </div>
        {showText && (
          <div className="spinner-text">
            <span className="spinner-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
            <p>{text}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Full Page Loading Component
export const FullPageLoader = ({ text = 'Loading application...' }) => {
  return (
    <div className="full-page-loader">
      <div className="loader-background">
        <div className="loader-content">
          <LoadingSpinner size="xl" text={text} />
        </div>
      </div>
    </div>
  )
}

// Inline Loading Component
export const InlineLoader = ({ size = 'small', variant = 'primary' }) => {
  return (
    <div className="inline-loader">
      <LoadingSpinner size={size} variant={variant} showText={false} />
    </div>
  )
}

// Button Loading Component
export const ButtonLoader = ({ variant = 'primary' }) => {
  return (
    <div className="button-loader">
      <LoadingSpinner size="small" variant={variant} showText={false} />
    </div>
  )
}

export default LoadingSpinner 