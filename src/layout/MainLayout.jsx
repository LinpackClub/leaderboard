import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Moon, Sun, Settings } from 'lucide-react'; // Added Settings for potential admin link if needed, or just keep it clean
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-card-hover transition-colors border border-transparent hover:border-border"
      title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-bg-dark text-text-main transition-colors duration-300 flex flex-col">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-bg-card/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4 md:px-8 transition-colors duration-300">
        
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 transition-transform group-hover:scale-105">
            <img src={logo} alt="Linpack Club Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-bold text-lg md:text-xl tracking-tight text-text-main group-hover:text-primary transition-colors">
            Linpack Club
          </h1>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
           {/* You could add an Admin Link here if needed, or keep it secret/url-based */}
           {/* <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text-main">Login</Link> */}
           
           <div className="h-6 w-px bg-border mx-1" /> {/* Divider */}
           <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 pt-24 md:pt-28 fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
