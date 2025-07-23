import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Star, Clock, Shield } from 'lucide-react';
import useStore from '../state/useStore';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const { startTrial } = useStore();

  const handleStartTrial = () => {
    startTrial();
    onClose();
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  const features = [
    {
      icon: Zap,
      title: 'Unlimited AI Generation',
      description: 'Generate essays, discussions, emails, and study guides'
    },
    {
      icon: Clock,
      title: 'Canvas Integration',
      description: 'Sync all your assignments automatically'
    },
    {
      icon: Star,
      title: 'Multiple Writing Styles',
      description: 'Classic Student and Lazy Genius modes'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data stays private and encrypted'
    }
  ];

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
            <div className="card max-w-2xl w-full relative overflow-hidden">
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
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-4"
                  >
                    <Zap className="h-12 w-12 text-gradient" />
                  </motion.div>
                  <h2 className="heading-lg mb-4">
                    <span className="text-gradient">Start Your Free Trial</span>
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Get instant access to AI-powered homework assistance
                  </p>
                </div>

                {/* Pricing */}
                <div className="bg-dark-500/50 rounded-xl p-6 mb-8 border border-primary-500/30">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      $30<span className="text-lg text-gray-400">/month</span>
                    </div>
                    <div className="text-sm text-accent-500 mb-4">
                      7-day free trial • Cancel anytime
                    </div>
                    <div className="text-xs text-gray-400">
                      No credit card required for trial
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="p-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-lg border border-primary-500/30">
                        <feature.icon className="h-4 w-4 text-neon-pink" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">
                          {feature.title}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={handleStartTrial}
                  className="w-full btn-primary text-lg py-4 relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Check className="h-5 w-5 mr-2" />
                    Start Free Trial Now
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.button>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-4">
                  Join thousands of students already using HomeworkBot.ai
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal; 