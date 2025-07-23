import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  PenTool, 
  Calendar, 
  Settings as SettingsIcon, 
  Moon, 
  Sun,
  Zap,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import useStore from '../state/useStore';
import useAuthStore from '../state/useAuthStore';

const Navbar = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useStore();
  const { user, signOut, getSubscriptionStatus } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Assignments', href: '/assignments', icon: BookOpen },
    { name: 'Workspace', href: '/workspace', icon: PenTool },
    { name: 'Planner', href: '/planner', icon: Calendar },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="nav-container"
    >
      <div className="container-centered">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <Zap className="h-8 w-8 text-neon-pink group-hover:text-accent-500 transition-colors duration-300" />
                <div className="absolute inset-0 bg-neon-pink group-hover:bg-accent-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              </motion.div>
            </div>
            <motion.span 
              className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300"
              whileHover={{ letterSpacing: "0.05em" }}
            >
              HomeworkBot.ai
            </motion.span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.href}
                    className={`nav-link ${active ? 'nav-link-active' : ''}`}
                  >
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-lg">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Theme Toggle & User Menu */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              className="relative p-3 rounded-lg bg-dark-500 hover:bg-dark-400 border border-dark-300 transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDarkMode ? 0 : 180 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-accent-500 group-hover:text-neon-pink transition-colors" />
                ) : (
                  <Moon className="h-5 w-5 text-primary-500 group-hover:text-accent-500 transition-colors" />
                )}
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>

            {/* User Menu */}
            {user && (
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-dark-500 hover:bg-dark-400 border border-dark-300 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-300 hidden md:block">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </motion.button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-dark-500 border border-dark-400 rounded-lg shadow-xl z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {user.user_metadata?.full_name || 'User'}
                          </div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                          <div className="text-xs text-accent-400">
                            {getSubscriptionStatus() === 'trial' && 'Free Trial'}
                            {getSubscriptionStatus() === 'active' && 'Pro Member'}
                            {getSubscriptionStatus() === 'inactive' && 'Free Account'}
                          </div>
                        </div>
                      </div>
                      
                      <hr className="border-dark-400 mb-3" />
                      
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 p-2 text-gray-300 hover:text-white hover:bg-dark-400 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-dark-400">
          <div className="grid grid-cols-5 gap-1 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <motion.div 
                  key={item.name} 
                  whileTap={{ scale: 0.95 }}
                  className="flex justify-center"
                >
                  <Link
                    to={item.href}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                      active
                        ? 'text-neon-pink bg-dark-500/50 border border-primary-500/30'
                        : 'text-gray-400 hover:text-neon-pink hover:bg-dark-500/30'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-glow' : ''}`} />
                    <span className="text-xs font-medium mt-1">{item.name}</span>
                    {active && (
                      <div className="absolute inset-0 rounded-lg animate-glow opacity-30"></div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 