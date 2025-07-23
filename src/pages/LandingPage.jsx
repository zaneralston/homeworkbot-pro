import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Zap, 
  BookOpen, 
  PenTool, 
  Calendar, 
  Brain, 
  Clock, 
  ChevronRight,
  Star,
  Users,
  Shield
} from 'lucide-react';
import useStore from '../state/useStore';
import useAuthStore from '../state/useAuthStore';
import AuthModal from '../components/AuthModal';

const LandingPage = () => {
  const { toggleTheme, isDarkMode } = useStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assistance',
      description: 'Claude AI generates high-quality essays, discussion posts, and study guides tailored to your assignments.'
    },
    {
      icon: BookOpen,
      title: 'Canvas Integration',
      description: 'Seamlessly connect to your Canvas account and pull assignments automatically.'
    },
    {
      icon: Clock,
      title: 'Time Efficiency',
      description: 'Save hours on schoolwork while maintaining academic quality and integrity.'
    },
    {
      icon: PenTool,
      title: 'Multiple Formats',
      description: 'Generate essays, emails to professors, discussion posts, and comprehensive study guides.'
    },
    {
      icon: Calendar,
      title: 'Smart Planning',
      description: 'Intelligent calendar integration helps you manage deadlines and priorities effectively.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your academic data is encrypted and never shared. Complete privacy guaranteed.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Students Helped' },
    { number: '50,000+', label: 'Assignments Completed' },
    { number: '4.9/5', label: 'Average Rating' },
    { number: '12hrs', label: 'Average Time Saved/Week' }
  ];

  return (
    <div className="hero-bg grid-overlay">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 py-6"
      >
        <div className="container-centered">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Zap className="h-8 w-8 text-neon-pink floating" />
                <div className="absolute inset-0 bg-neon-pink rounded-full blur-lg opacity-30 animate-pulse"></div>
              </div>
              <span className="text-xl font-bold text-gradient">
                HomeworkBot.ai
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-dark-500/50 border border-dark-300 hover:border-primary-500 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </motion.button>
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    window.location.href = '/dashboard';
                  } else {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }
                }}
                className="btn-primary"
              >
                {isAuthenticated ? 'Dashboard' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative section-spacing">
        <div className="content-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="heading-xl mb-6">
              <span className="text-gradient">Automate</span>{' '}
              <span className="text-white">Your</span>
              <br />
              <span className="text-white">Schoolwork</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto text-balance">
              Connect your Canvas account and let AI handle essays, discussion posts, emails to professors, and study guides. 
              <span className="font-semibold text-gradient"> Get school done efficiently.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      window.location.href = '/dashboard';
                    } else {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }
                  }}
                  className="btn-primary text-lg px-8 py-4 cyber-border group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </button>
              </motion.div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Star className="h-4 w-4 text-accent-500 fill-current animate-pulse" />
                <span>$30/month • Cancel anytime</span>
              </div>
            </div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl lg:text-3xl font-bold text-gradient neon-glow">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-neon-pink/20 to-accent-500/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, 40, 0],
              rotate: [0, -15, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-accent-500/20 to-neon-pink/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-r from-primary-500/30 to-accent-500/30 rounded-full blur-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing bg-dark-500/20 backdrop-blur-sm">
        <div className="content-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">
              Everything You Need to <span className="text-gradient">Dominate</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive AI-powered tools designed specifically for the modern hacker-student
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="card group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-lg border border-primary-500/30 group-hover:border-primary-500 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-neon-pink group-hover:text-accent-500 transition-colors" />
                  </div>
                </div>
                <h3 className="heading-md text-white mb-2 group-hover:text-gradient transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="content-container text-center"
        >
          <div className="card-glow max-w-4xl mx-auto">
            <h2 className="heading-lg mb-4">
              Ready to Transform Your Academic Life?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of students who are already saving time and achieving better results
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    window.location.href = '/dashboard';
                  } else {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }
                }}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center group"
              >
                <span className="relative z-10 flex items-center">
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Your Free Trial'}
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
            <p className="text-sm text-gray-400 mt-6">
              No credit card required • 7-day free trial
            </p>
          </div>
        </motion.div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default LandingPage; 