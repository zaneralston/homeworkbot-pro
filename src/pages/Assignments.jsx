import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO, isAfter } from 'date-fns';
import { 
  Filter,
  Search,
  Calendar,
  Clock,
  BookOpen,
  PenTool,
  Mail,
  GraduationCap,
  Zap,
  ChevronDown,
  Eye,
  ExternalLink,
  AlertCircle,
  Check
} from 'lucide-react';
import useStore from '../state/useStore';
import useAuthStore from '../state/useAuthStore';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import AssignmentModal from '../components/AssignmentModal';
import KeysAlert from '../components/KeysAlert';

const Assignments = () => {
  const { 
    assignments, 
    setCurrentAssignment, 
    generateContent, 
    vibeMode,
    updateAssignmentStatus,
    isCanvasConnected,
    canvasError,
    isFetchingAssignments,
    fetchCanvasAssignments,
    lastCanvasSync,
    isGenerating: storeIsGenerating,
    syncSuccessMessage,
    clearSyncMessage
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [isGenerating, setIsGenerating] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Get unique values for filter options
  const uniqueCourses = [...new Set(assignments.map(a => a.course))];
  const uniqueTypes = [...new Set(assignments.map(a => a.type))];

  // Filter and sort assignments
  const filteredAssignments = assignments
    .filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
      const matchesType = typeFilter === 'all' || assignment.type === typeFilter;
      const matchesCourse = courseFilter === 'all' || assignment.course === courseFilter;
      const matchesPriority = priorityFilter === 'all' || assignment.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesType && matchesCourse && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'course':
          return a.course.localeCompare(b.course);
        default:
          return 0;
      }
    });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'essay': return PenTool;
      case 'discussion': return BookOpen;
      case 'email': return Mail;
      case 'study-guide': return GraduationCap;
      default: return BookOpen;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const isDueSoon = (dueDate) => {
    const due = parseISO(dueDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    return isAfter(tomorrow, due);
  };

  const handleGenerateAI = async (assignment) => {
    const { hasAllKeys } = useAuthStore.getState();
    
    if (!hasAllKeys()) {
      // Don't need alert - KeysAlert component will guide user
      return;
    }

    setIsGenerating(assignment.id);
    setCurrentAssignment(assignment);
    
    try {
      const result = await generateContent(assignment, vibeMode);
      if (result) {
        updateAssignmentStatus(assignment.id, 'in-progress');
        // Navigate to workspace
        window.location.href = '/workspace';
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsGenerating(null);
    }
  };

  const handleStatusChange = (assignmentId, newStatus) => {
    updateAssignmentStatus(assignmentId, newStatus);
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
    setShowAssignmentModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* API Keys Alert */}
        <KeysAlert className="mb-6" />
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="heading-lg mb-2">
                <span className="text-white">Assignments</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Manage and generate AI help for all your assignments
              </p>
            </div>
            
            {/* Canvas Connection Status */}
            <div className="flex items-center space-x-4">
              {isCanvasConnected ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-green-400 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Canvas Connected
                  </span>
                  {lastCanvasSync && (
                    <span className="text-xs text-gray-400">
                      Last sync: {format(parseISO(lastCanvasSync), 'MMM d, h:mm a')}
                    </span>
                  )}
                  <motion.button
                    onClick={fetchCanvasAssignments}
                    disabled={isFetchingAssignments}
                    className="btn-accent text-sm flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isFetchingAssignments ? (
                      <>
                        <div className="w-4 h-4 mr-2">
                          <LoadingSpinner size="sm" text="" color="white" />
                        </div>
                        Syncing...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Sync Canvas
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">
                    Connect Canvas to sync your real assignments
                  </p>
                  <Link
                    to="/settings"
                    className="btn-primary text-sm flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Canvas
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Success Message */}
          {syncSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <p className="text-green-400 text-sm flex items-center">
                <Check className="h-4 w-4 mr-2" />
                {syncSuccessMessage}
              </p>
            </motion.div>
          )}
          
          {/* Error Display */}
          {canvasError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-red-400 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {canvasError}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="all">All Types</option>
                <option value="essay">Essays</option>
                <option value="discussion">Discussions</option>
                <option value="email">Emails</option>
                <option value="study-guide">Study Guides</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Course Filter */}
            <div className="relative">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="course">Course</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Assignment Cards */}
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={BookOpen}
                title="No assignments found"
                description="Try adjusting your filters or search terms to find what you're looking for"
              />
            </div>
          ) : (
            filteredAssignments.map((assignment, index) => {
              const TypeIcon = getTypeIcon(assignment.type);
              const isOverdue = isDueSoon(assignment.dueDate) && assignment.status !== 'completed';
              
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card hover:shadow-lg transition-all duration-300 ${
                    isOverdue ? 'border-red-200 dark:border-red-800' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Type Icon */}
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <TypeIcon className="h-6 w-6 text-primary-600" />
                      </div>

                      {/* Assignment Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {assignment.title}
                          </h3>
                          {isOverdue && (
                            <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 px-2 py-1 rounded-full">
                              Due Soon!
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {assignment.description}
                        </p>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {assignment.course}
                          </span>
                          
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                            {assignment.status.replace('-', ' ')}
                          </span>
                          
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(assignment.priority)}`}>
                            {assignment.priority} priority
                          </span>
                          
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(parseISO(assignment.dueDate), 'MMM d, yyyy')}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {assignment.estimatedTime}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                          <motion.button
                            onClick={() => handleGenerateAI(assignment)}
                            disabled={isGenerating === assignment.id || storeIsGenerating || !claudeApiKey}
                            className={`btn-primary text-sm flex items-center group disabled:opacity-50 disabled:cursor-not-allowed ${
                              !claudeApiKey ? 'opacity-50' : ''
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            title={!claudeApiKey ? 'Add Claude API key in Settings' : ''}
                          >
                            <Zap className={`h-4 w-4 mr-2 ${(isGenerating === assignment.id || storeIsGenerating) ? 'animate-pulse' : 'group-hover:animate-pulse'}`} />
                            {(isGenerating === assignment.id || storeIsGenerating) ? 'Generating...' : 'Generate AI Answer'}
                          </motion.button>

                          <motion.button
                            onClick={() => handleViewDetails(assignment)}
                            className="btn-secondary text-sm flex items-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </motion.button>

                          {/* Status Dropdown */}
                          <div className="relative">
                            <select
                              value={assignment.status}
                              onChange={(e) => handleStatusChange(assignment.id, e.target.value)}
                              className="text-sm border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-1 bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Summary Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {assignments.filter(a => a.status === 'pending').length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Pending</p>
          </div>
          
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {assignments.filter(a => a.status === 'in-progress').length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">In Progress</p>
          </div>
          
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {assignments.filter(a => a.status === 'completed').length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Completed</p>
          </div>
        </motion.div>

        {/* Assignment Details Modal */}
        <AssignmentModal
          assignment={selectedAssignment}
          isOpen={showAssignmentModal}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Assignments; 