import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, hasActiveSubscription } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Allow access to landing page without authentication
    if (location.pathname === '/') {
      return;
    }

    // If not authenticated and trying to access protected routes, redirect to landing
    if (!isLoading && !isAuthenticated && location.pathname !== '/') {
      window.location.href = '/';
      return;
    }

    // If authenticated but no active subscription, redirect to landing
    if (isAuthenticated && !hasActiveSubscription() && location.pathname !== '/') {
      window.location.href = '/';
      return;
    }
  }, [isAuthenticated, isLoading, location.pathname, hasActiveSubscription]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Show children for landing page or if authenticated with active subscription
  if (location.pathname === '/' || (isAuthenticated && hasActiveSubscription())) {
    return children;
  }

  // This shouldn't happen due to redirect above, but just in case
  return null;
};

export default ProtectedRoute; 