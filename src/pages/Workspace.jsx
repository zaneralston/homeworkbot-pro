import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { 
  Copy, 
  Download, 
  Mail, 
  Save, 
  RefreshCw, 
  FileText, 
  Eye,
  Edit3,
  Zap,
  Settings,
  Wand2,
  FileDown,
  History,
  ChevronDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import useStore from '../state/useStore';
import useAuthStore from '../state/useAuthStore';
import LoadingSpinner from '../components/LoadingSpinner';
import KeysAlert from '../components/KeysAlert';

const Workspace = () => {
  const { 
    currentAssignment,
    workspaceContent,
    workspaceTitle,
    workspaceType,
    isGenerating,
    setWorkspaceContent,
    setWorkspaceTitle,
    generateContent,
    generateCustomContent,
    vibeMode,
    setVibeMode,
    claudeApiKey,
    claudeError,
    lastGeneratedContent,
    recentGenerations
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [localContent, setLocalContent] = useState(workspaceContent);
  const [localTitle, setLocalTitle] = useState(workspaceTitle);
  const textareaRef = useRef(null);

  const vibeOptions = {
    'classic-student': {
      name: 'Classic Student',
      description: 'Professional, academic tone with proper citations and formal structure',
      emoji: '🧑‍🎓'
    },
    'lazy-genius': {
      name: 'Lazy Genius',
      description: 'Does everything for you in autopilot mode',
      emoji: '🧠'
    }
  };

  const handleSave = () => {
    setWorkspaceContent(localContent);
    setWorkspaceTitle(localTitle);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localContent);
      alert('Content copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy content');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([localContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${localTitle || 'assignment'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - 2 * margin;
    
    // Add title
    doc.setFontSize(16);
    doc.text(localTitle || 'Generated Content', margin, 30);
    
    // Add content
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(localContent, maxLineWidth);
    doc.text(lines, margin, 50);
    
    // Save the PDF
    doc.save(`${localTitle || 'assignment'}.pdf`);
  };

  const handleEmailExport = () => {
    const subject = encodeURIComponent(`Generated Content: ${localTitle || 'Assignment'}`);
    const body = encodeURIComponent(localContent);
    const mailtoURL = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoURL);
  };

  const handleExportAsMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([localContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${localTitle || 'assignment'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRegenerate = async () => {
    const { hasAllKeys } = useAuthStore.getState();
    
    if (!hasAllKeys()) {
      return; // KeysAlert will guide user
    }

    if (currentAssignment) {
      const result = await generateContent(currentAssignment, vibeMode);
      if (result) {
        setLocalContent(workspaceContent);
      }
    }
  };

  const handleVibeChange = async (newVibe) => {
    setVibeMode(newVibe);
    setShowVibeModal(false);
    
    const { hasAllKeys } = useAuthStore.getState();
    
    if (!hasAllKeys()) {
      return; // KeysAlert will guide user
    }

    if (currentAssignment) {
      const result = await generateContent(currentAssignment, newVibe);
      if (result) {
        setLocalContent(workspaceContent);
      }
    }
  };

  if (!currentAssignment && !workspaceContent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-16"
          >
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Content Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Generate AI content from an assignment to get started
            </p>
            <a 
              href="/assignments" 
              className="btn-primary inline-flex items-center"
            >
              <Zap className="h-4 w-4 mr-2" />
              Go to Assignments
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* API Keys Alert */}
      <div className="p-6 pb-0">
        <div className="max-w-7xl mx-auto">
          <KeysAlert />
        </div>
      </div>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-600/80 backdrop-blur-xl border-b border-dark-400 p-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* Progress Bar for Generation */}
          {isGenerating && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300 flex items-center">
                  <Zap className="h-4 w-4 mr-2 animate-pulse text-neon-pink" />
                  Generating with Claude AI...
                </span>
                <span className="text-sm text-accent-400">Processing</span>
              </div>
              <div className="w-full bg-dark-500 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-neon-pink to-accent-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="text-2xl font-bold bg-transparent border-b-2 border-primary-500 text-white focus:outline-none"
                  placeholder="Assignment title..."
                />
              ) : (
                <div>
                  <h1 className="heading-md text-white mb-1">
                    {localTitle || 'Workspace'}
                  </h1>
                  {currentAssignment && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-300">Generated Response for:</span>
                      <span className="text-gradient font-semibold">
                        {currentAssignment.title}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {currentAssignment && (
                <p className="text-gray-400 mt-1 text-sm">
                  {currentAssignment.course} • {currentAssignment.type}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Vibe Mode */}
              <motion.button
                onClick={() => setShowVibeModal(true)}
                className="btn-secondary text-sm flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {vibeOptions[vibeMode]?.emoji} {vibeOptions[vibeMode]?.name}
              </motion.button>

              {/* Preview Toggle */}
              <motion.button
                onClick={() => setPreviewMode(!previewMode)}
                className={`btn-secondary text-sm flex items-center ${previewMode ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </motion.button>

              {/* Edit Toggle */}
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                className={`btn-secondary text-sm flex items-center ${isEditing ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="card h-full">
              {isGenerating ? (
                <div className="flex items-center justify-center py-16">
                  <LoadingSpinner 
                    size="lg" 
                    text={`Generating content with ${vibeOptions[vibeMode]?.name} style...`}
                  />
                </div>
              ) : (
                <>
                  {isEditing ? (
                    <textarea
                      ref={textareaRef}
                      value={localContent}
                      onChange={(e) => setLocalContent(e.target.value)}
                      className="w-full h-96 p-4 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Start writing or generate AI content..."
                    />
                  ) : (
                    <div className={`prose prose-lg max-w-none ${previewMode ? 'dark:prose-invert' : ''}`}>
                      {previewMode ? (
                        <div 
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ 
                            __html: localContent.replace(/\n/g, '<br/>').replace(/# (.*)/g, '<h1>$1</h1>').replace(/## (.*)/g, '<h2>$1</h2>') 
                          }}
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100">
                          {localContent}
                        </pre>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                {isEditing && (
                  <motion.button
                    onClick={handleSave}
                    className="btn-primary w-full text-sm flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </motion.button>
                )}
                
                <motion.button
                  onClick={handleCopy}
                  className="btn-secondary w-full text-sm flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </motion.button>
                
                <motion.button
                  onClick={handleDownload}
                  className="btn-secondary w-full text-sm flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </motion.button>
                
                <motion.button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="btn-accent w-full text-sm flex items-center justify-center disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </motion.button>
              </div>
            </div>

            {/* Assignment Info */}
            {currentAssignment && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Assignment Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Course</p>
                    <p className="font-medium text-gray-900 dark:text-white">{currentAssignment.course}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{currentAssignment.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(currentAssignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Priority</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${
                      currentAssignment.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                      currentAssignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    }`}>
                      {currentAssignment.priority}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Word Count */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Statistics
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Words</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {localContent.split(' ').filter(word => word.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Characters</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {localContent.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lines</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {localContent.split('\n').length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Vibe Mode Modal */}
      {showVibeModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVibeModal(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-dark-800 rounded-xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Writing Style
            </h3>
            <div className="space-y-3">
              {Object.entries(vibeOptions).map(([key, option]) => (
                <motion.button
                  key={key}
                  onClick={() => handleVibeChange(key)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    vibeMode === key 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-200 dark:border-dark-600 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {option.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Workspace; 