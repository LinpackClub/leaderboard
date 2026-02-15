import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeaderboardProvider } from './context/LeaderboardContext';
import { useTheme } from './context/ThemeContext';
import ThemeSplash from './components/ui/ThemeSplash';
import MainLayout from './layout/MainLayout';
import Leaderboard from './features/leaderboard/Leaderboard';
import AdminPanel from './features/admin/AdminPanel';
import NotFound from './components/ui/not-found/NotFound';

function AppContent() {
  const { isTransitioning } = useTheme();
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Show loader on initial page load
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 800); // Show loader for 800ms
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <ThemeSplash isVisible={isTransitioning || isInitialLoading} />
      <LeaderboardProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Leaderboard />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LeaderboardProvider>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
