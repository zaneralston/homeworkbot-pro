import { motion } from 'framer-motion';
import { Clock, Zap, X } from 'lucide-react';
import { useState } from 'react';
import useStore from '../state/useStore';

const TrialBanner = () => {
  const { isSubscribed, trialStartDate } = useStore();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if subscribed to full plan or dismissed
  if (isSubscribed === false || isDismissed) {
    return null;
  }

  // Calculate days remaining in trial
  const trialStart = trialStartDate ? new Date(trialStartDate) : new Date();
  const trialEnd = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const now = new Date();
  const daysRemaining = Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000));

  const handleUpgrade = () => {
    // In a real app, this would open Stripe checkout
    alert('Upgrade feature coming soon! For now, enjoy your trial.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-lg p-4 mb-6 relative overflow-hidden"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/5 to-accent-500/5 animate-pulse"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <Clock className="h-5 w-5 text-neon-pink" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white">
                🎉 Free Trial Active
              </h3>
              <span className="text-xs bg-accent-500/20 text-accent-400 px-2 py-1 rounded-full">
                {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expires today!'}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              You're on a 7-day free trial. Upgrade to unlock unlimited AI generations and premium features.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={handleUpgrade}
            className="btn-primary text-sm px-4 py-2 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="h-4 w-4 mr-1" />
            Upgrade Now
          </motion.button>
          
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-dark-400 rounded transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TrialBanner; 