import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeaderboardProvider } from './context/LeaderboardContext';
import { AuthProvider } from './context/AuthContext';
import { AdminLeaderboardProvider } from './context/AdminLeaderboardContext';
import { useTheme } from './context/ThemeContext';
import ThemeSplash from './components/ui/ThemeSplash';
import MainLayout from './layout/MainLayout';
import Leaderboard from './features/leaderboard/Leaderboard';
import AdminPanel from './features/admin/AdminPanel';
import Login from './features/auth/Login';
import ProtectedRoute from './components/ui/ProtectedRoute';
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
      <AuthProvider>
        <LeaderboardProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Leaderboard />} />
                <Route path="admin" element={
                  <ProtectedRoute>
                    <AdminLeaderboardProvider>
                      <AdminPanel />
                    </AdminLeaderboardProvider>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LeaderboardProvider>
      </AuthProvider>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
