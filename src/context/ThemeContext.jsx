import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // Show splash screen
    setIsTransitioning(true);
    
    // Small delay to ensure splash renders first
    setTimeout(() => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      
      // Hide splash screen after theme has transitioned
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400); // Match CSS transition duration
    }, 50);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};
