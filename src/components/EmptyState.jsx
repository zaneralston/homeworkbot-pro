import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon: Icon, 
  title = 'No data found', 
  description = 'Get started by adding some content',
  actionButton = null,
  className = ''
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Icon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto" />
        </motion.div>
      )}
      
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-medium text-gray-900 dark:text-white mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto"
      >
        {description}
      </motion.p>
      
      {actionButton && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          {actionButton}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState; 