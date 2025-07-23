import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import useStore from './state/useStore';
import useAuthStore from './state/useAuthStore';

// Import components
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Workspace from './pages/Workspace';
import Planner from './pages/Planner';
import Settings from './pages/Settings';

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <LandingPage />
          </PageTransition>
        } />
        <Route path="/dashboard" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </main>
          </div>
        } />
        <Route path="/assignments" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <PageTransition>
                <Assignments />
              </PageTransition>
            </main>
          </div>
        } />
        <Route path="/workspace" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <PageTransition>
                <Workspace />
              </PageTransition>
            </main>
          </div>
        } />
        <Route path="/planner" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <PageTransition>
                <Planner />
              </PageTransition>
            </main>
          </div>
        } />
        <Route path="/settings" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <PageTransition>
                <Settings />
              </PageTransition>
            </main>
          </div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { isDarkMode } = useStore();
  const { initializeAuth } = useAuthStore();

  // Initialize authentication on app start
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Apply dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  // Toggle theme when user changes setting
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="page-wrapper">
        <ProtectedRoute>
          <AnimatedRoutes />
        </ProtectedRoute>
      </div>
    </Router>
  );
}

export default App;
