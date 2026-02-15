import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, Trophy, Menu, Moon, Sun } from 'lucide-react';
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';
import sidebarLogo from '../assets/sidebar.png';

// Helper to close menu would require context or prop drilling. 
// For now, let's keep it simple. Users often click menu items and expect it to close.
// We can modify MainLayout to pass a close function if needed, but for now let's leave as is
// effectively just standard link behavior.

const SidebarItem = ({ to, icon: Icon, label, onClick, isImage }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-text-muted hover:text-text-main hover:bg-bg-card-hover"
      )
    }
  >
    {isImage ? (
        <img src={Icon} alt={label} className="w-5 h-5 object-contain" />
    ) : (
        <Icon size={20} />
    )}
    <span className="font-medium">{label}</span>
  </NavLink>
);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="px-6 py-4">
      <button
        onClick={toggleTheme}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors text-text-muted hover:text-text-main hover:bg-bg-card-hover border border-border"
      >
        {theme === 'dark' ? (
          <>
            <Sun size={20} />
            <span className="font-medium">Light Mode</span>
          </>
        ) : (
          <>
            <Moon size={20} />
            <span className="font-medium">Dark Mode</span>
          </>
        )}
      </button>
    </div>
  );
};

const Sidebar = ({ onClose }) => {
  return (
    <div className="w-full h-full bg-bg-card border-r border-border flex flex-col overflow-y-auto transition-colors duration-300">
      {/* Top Section: Logo + Navigation */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 flex-shrink-0">
            <img src={logo} alt="Linpack Club Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-text-main">Linpack Club</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarItem to="/" icon={LayoutDashboard} label="Leaderboard" onClick={onClose} />
        </nav>
      </div>
      
      {/* Middle Section: Background Image - fills available space */}
      <div className="flex-1 flex items-center justify-center p-4">
        <img 
          src={sidebarLogo} 
          alt="Sidebar Decoration" 
          className="w-full h-auto max-w-[70%] max-h-full object-contain"
        />
      </div>
      
      {/* Bottom Section: Theme Toggle + User Profile */}
      <div>
        <ThemeToggle />
      </div>
    </div>
  );
};

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-bg-dark text-text-main flex transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 relative">
          <div className="fixed top-0 left-0 h-full w-64 bg-bg-card border-r border-border z-10">
            <Sidebar />
          </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-bg-card transform transition-transform duration-300 ease-in-out md:hidden border-r border-border",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-bg-card border-b border-border flex items-center px-4 z-30 transition-colors duration-300">
           <button 
             onClick={() => setIsMobileMenuOpen(true)}
             className="p-2 -ml-2 rounded-lg hover:bg-bg-card-hover text-text-muted transition-colors"
           >
             <Menu />
           </button>
           <span className="ml-4 font-bold text-text-main text-lg tracking-tight">Linpack Club</span>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 bg-bg-dark overflow-x-hidden w-full transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
             <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
