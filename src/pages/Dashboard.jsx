import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { 
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BookOpen,
  PenTool,
  Calendar,
  Zap
} from 'lucide-react';
import useStore from '../state/useStore';
import useAuthStore from '../state/useAuthStore';
import EmptyState from '../components/EmptyState';
import TrialBanner from '../components/TrialBanner';
import KeysAlert from '../components/KeysAlert';

const Dashboard = () => {
  const { 
    assignments, 
    isCanvasConnected,
    setCurrentAssignment,
    generateContent,
    vibeMode 
  } = useStore();

  const { 
    user, 
    hasAllKeys, 
    hasGptKey, 
    hasCanvasKey 
  } = useAuthStore();

  // Filter and sort assignments
  const upcomingAssignments = assignments
    .filter(a => a.status === 'pending')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const inProgressAssignments = assignments.filter(a => a.status === 'in-progress');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  const formatDueDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Due Today';
    if (isTomorrow(date)) return 'Due Tomorrow';
    return `Due ${format(date, 'MMM d')}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'essay': return PenTool;
      case 'discussion': return BookOpen;
      case 'email': return '📧';
      case 'study-guide': return '📚';
      default: return BookOpen;
    }
  };

  const handleQuickGenerate = async (assignment) => {
    setCurrentAssignment(assignment);
    try {
      await generateContent(assignment, vibeMode);
      // Navigate to workspace would happen here
      window.location.href = '/workspace';
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="content-container">
        {/* API Keys Alert */}
        <KeysAlert className="mb-6" />

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="heading-lg mb-2">
            <span className="text-white">
              {user?.user_metadata?.full_name 
                ? `Welcome back, ${user.user_metadata.full_name.split(' ')[0]}!` 
                : 'Welcome back!'
              }
            </span> 
            <span className="text-gradient animate-glow">
              {hasAllKeys() ? '🔥' : '👋'}
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            {hasAllKeys() 
              ? assignments.length > 0 
                ? "Let's finish your homework 🔥" 
                : "Ready to sync your assignments and get started!"
              : "Paste your GPT and Canvas keys to get started"
            }
          </p>
        </motion.div>

        {/* Setup Guidance Banner */}
        {!hasAllKeys() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 rounded-lg"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Quick Setup - Get Started in 2 Minutes
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${hasGptKey() ? 'bg-green-500' : 'bg-gray-500'} flex items-center justify-center`}>
                      {hasGptKey() && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <span className={hasGptKey() ? 'line-through opacity-75' : ''}>
                      Step 1: Add your OpenAI GPT API key
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${hasCanvasKey() ? 'bg-green-500' : 'bg-gray-500'} flex items-center justify-center`}>
                      {hasCanvasKey() && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <span className={hasCanvasKey() ? 'line-through opacity-75' : ''}>
                      Step 2: Add your Canvas API token
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${hasAllKeys() ? 'bg-green-500' : 'bg-gray-500'} flex items-center justify-center`}>
                      {hasAllKeys() && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <span className={hasAllKeys() ? 'line-through opacity-75' : ''}>
                      Step 3: Sync assignments & generate content
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/settings"
                    className="btn-primary inline-flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {!hasGptKey() && !hasCanvasKey() 
                      ? 'Add API Keys'
                      : !hasGptKey() 
                      ? 'Add GPT Key'
                      : 'Add Canvas Key'
                    }
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Trial Banner */}
        <TrialBanner />

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div 
            className="card group"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-white group-hover:text-gradient transition-all duration-300">
                  {assignments.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30 group-hover:border-yellow-500 transition-all duration-300">
                <Clock className="h-6 w-6 text-yellow-400 group-hover:text-yellow-300" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card group"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-white group-hover:text-gradient transition-all duration-300">
                  {inProgressAssignments.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 group-hover:border-blue-500 transition-all duration-300">
                <TrendingUp className="h-6 w-6 text-blue-400 group-hover:text-blue-300" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card group"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white group-hover:text-gradient transition-all duration-300">
                  {completedAssignments.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30 group-hover:border-green-500 transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-green-400 group-hover:text-green-300" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card group"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Canvas Status</p>
                <p className="text-sm font-medium text-white group-hover:text-gradient transition-all duration-300">
                  {isCanvasConnected ? 'Connected' : 'Not Connected'}
                </p>
              </div>
              <div className={`p-3 rounded-lg border transition-all duration-300 ${
                isCanvasConnected 
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 group-hover:border-green-500' 
                  : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30 group-hover:border-red-500'
              }`}>
                {isCanvasConnected ? (
                  <CheckCircle className="h-6 w-6 text-green-400 group-hover:text-green-300" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-400 group-hover:text-red-300" />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Assignments */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upcoming Assignments
                </h2>
                <Link to="/assignments" className="btn-secondary text-sm">
                  View All
                </Link>
              </div>

              {upcomingAssignments.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="All caught up! 🎉"
                  description="No upcoming assignments found. You're doing great!"
                />
              ) : (
                <div className="space-y-4">
                  {upcomingAssignments.map((assignment, index) => {
                    const TypeIcon = getTypeIcon(assignment.type);
                    return (
                      <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                            {typeof TypeIcon === 'string' ? (
                              <span className="text-lg">{TypeIcon}</span>
                            ) : (
                              <TypeIcon className="h-5 w-5 text-primary-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {assignment.title}
                            </h3>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {assignment.course}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(assignment.priority)}`}>
                                {assignment.priority}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDueDate(assignment.dueDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleQuickGenerate(assignment)}
                          className="btn-primary text-sm flex items-center group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Zap className="h-4 w-4 mr-1 group-hover:animate-pulse" />
                          Generate
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions & Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link 
                  to="/assignments"
                  className="flex items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors group"
                >
                  <BookOpen className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    View All Assignments
                  </span>
                </Link>
                
                <Link 
                  to="/workspace"
                  className="flex items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors group"
                >
                  <PenTool className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    Open Workspace
                  </span>
                </Link>
                
                <Link 
                  to="/planner"
                  className="flex items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors group"
                >
                  <Calendar className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    Plan Study Time
                  </span>
                </Link>
                
                <Link 
                  to="/settings"
                  className="flex items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors group"
                >
                  <Plus className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    Connect Canvas
                  </span>
                </Link>
              </div>
            </div>

            {/* Canvas Connection Status */}
            {!isCanvasConnected && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="card border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10"
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                      Connect Canvas
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Connect your Canvas account to automatically pull assignments and get AI help.
                    </p>
                    <Link 
                      to="/settings"
                      className="inline-flex items-center mt-3 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100"
                    >
                      Set up now →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Productivity Tips */}
            <div className="card">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                💡 Productivity Tip
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use the "Lazy Genius" vibe mode for quick, efficient responses that get the job done without extra fluff.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 