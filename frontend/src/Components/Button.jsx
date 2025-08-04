import React from 'react'
import { ButtonLoader } from './LoadingSpinner'
import './Button.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary': return 'btn-secondary'
      case 'success': return 'btn-success'
      case 'warning': return 'btn-warning'
      case 'error': return 'btn-error'
      case 'ghost': return 'btn-ghost'
      case 'outline': return 'btn-outline'
      default: return 'btn-primary'
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'btn-sm'
      case 'large': return 'btn-lg'
      case 'xl': return 'btn-xl'
      default: return 'btn-md'
    }
  }

  const getWidthClass = () => {
    return fullWidth ? 'btn-full-width' : ''
  }

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e)
    }
  }

  const renderIcon = () => {
    if (!icon) return null
    
    return (
      <span className={`btn-icon ${iconPosition === 'right' ? 'btn-icon-right' : 'btn-icon-left'}`}>
        {icon}
      </span>
    )
  }

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${getWidthClass()} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <ButtonLoader variant={variant} />
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          <span className="btn-text">{children}</span>
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </button>
  )
}

// Button Group Component
export const ButtonGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`btn-group ${className}`} {...props}>
      {children}
    </div>
  )
}

// Icon Button Component
export const IconButton = ({
  icon,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      className={`btn-icon-only ${className}`}
      {...props}
    >
      {icon}
    </Button>
  )
}

export default Button 