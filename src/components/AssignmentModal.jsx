import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, BookOpen, ExternalLink, Check, Zap } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import useStore from '../state/useStore';

const AssignmentModal = ({ assignment, isOpen, onClose }) => {
  const { markAssignmentCompleted, generateContent, isGenerating, claudeApiKey } = useStore();

  if (!assignment) return null;

  const handleMarkCompleted = () => {
    markAssignmentCompleted(assignment.id);
    onClose();
  };

  const handleGenerateAI = async () => {
    if (!claudeApiKey) {
      alert('Please add your Claude API key in Settings first');
      return;
    }

    const result = await generateContent(assignment);
    if (result) {
      // Navigate to workspace
      window.location.href = '/workspace';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-dark-400 rounded-lg transition-colors z-10"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              {/* Content */}
              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="heading-md text-white mb-2">
                        {assignment.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-gray-300">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {assignment.course}
                        </span>
                        {assignment.dueDate && (
                          <span className="flex items-center text-gray-300">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due {format(parseISO(assignment.dueDate), 'MMM d, yyyy')}
                          </span>
                        )}
                        {assignment.estimatedTime && (
                          <span className="flex items-center text-gray-300">
                            <Clock className="h-4 w-4 mr-1" />
                            {assignment.estimatedTime}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assignment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        assignment.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {assignment.status.replace('-', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assignment.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        assignment.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {assignment.priority} priority
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Assignment Description
                  </h3>
                  <div className="bg-dark-500/50 rounded-lg p-4 border border-dark-400">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {assignment.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                {(assignment.pointsPossible || assignment.canvasUrl) && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assignment.pointsPossible && (
                        <div className="bg-dark-500/50 rounded-lg p-4 border border-dark-400">
                          <div className="text-sm text-gray-400">Points Possible</div>
                          <div className="text-lg font-semibold text-white">
                            {assignment.pointsPossible}
                          </div>
                        </div>
                      )}
                      {assignment.canvasUrl && (
                        <div className="bg-dark-500/50 rounded-lg p-4 border border-dark-400">
                          <div className="text-sm text-gray-400">Canvas Link</div>
                          <a
                            href={assignment.canvasUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-400 hover:text-accent-300 flex items-center text-sm"
                          >
                            View in Canvas
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  {assignment.status !== 'completed' && (
                    <motion.button
                      onClick={handleMarkCompleted}
                      className="btn-secondary flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={handleGenerateAI}
                    disabled={isGenerating || !claudeApiKey}
                    className="btn-primary flex items-center justify-center disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate AI Answer
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AssignmentModal; 