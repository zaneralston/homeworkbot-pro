import { motion } from 'framer-motion';
import { AlertCircle, Settings, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../state/useAuthStore';

const KeysAlert = ({ className = '' }) => {
  const { hasGptKey, hasCanvasKey, hasAllKeys } = useAuthStore();

  // If user has all keys, don't show alert
  if (hasAllKeys()) return null;

  const missingKeys = [];
  if (!hasGptKey()) missingKeys.push('OpenAI GPT API Key');
  if (!hasCanvasKey()) missingKeys.push('Canvas API Token');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
            API Keys Required
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
            Missing: {missingKeys.join(' and ')}. Add your keys to sync assignments and generate content.
          </p>
          <div className="mt-3">
            <Link
              to="/settings"
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-800/30 hover:bg-yellow-200 dark:hover:bg-yellow-700/40 transition-colors"
            >
              <Settings className="h-4 w-4 mr-1.5" />
              Go to Settings
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KeysAlert; 