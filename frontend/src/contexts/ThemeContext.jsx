import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEyeCareMode, setIsEyeCareMode] = useState(false);

  // Load theme preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('heva-theme');
    const savedSidebarState = localStorage.getItem('heva-sidebar-open');
    const savedEyeCare = localStorage.getItem('heva-eye-care');

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    if (savedSidebarState !== null) {
      setIsSidebarOpen(savedSidebarState === 'true');
    }
    if (savedEyeCare) {
      setIsEyeCareMode(savedEyeCare === 'true');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }

    // Save to localStorage
    localStorage.setItem('heva-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Apply eye care mode
  useEffect(() => {
    const root = document.documentElement;
    
    if (isEyeCareMode) {
      root.setAttribute('data-eye-care', 'true');
    } else {
      root.removeAttribute('data-eye-care');
    }

    localStorage.setItem('heva-eye-care', isEyeCareMode.toString());
  }, [isEyeCareMode]);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('heva-sidebar-open', isSidebarOpen.toString());
  }, [isSidebarOpen]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleEyeCare = () => {
    setIsEyeCareMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    isSidebarOpen,
    isEyeCareMode,
    toggleTheme,
    toggleSidebar,
    toggleEyeCare,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 