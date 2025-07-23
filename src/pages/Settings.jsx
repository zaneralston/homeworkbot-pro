import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Key, 
  Palette, 
  Link as LinkIcon,
  Shield,
  Bell,
  User,
  Globe,
  Smartphone,
  Check,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';
import useStore from '../state/useStore';
import useAuthStore from '../state/useAuthStore';
import { createCheckoutSession, createCustomerPortalSession } from '../lib/stripe';
import LoadingSpinner from '../components/LoadingSpinner';

const Settings = () => {
    const {
    vibeMode,
    setVibeMode,
    isDarkMode,
    toggleTheme,
    isCanvasConnected,
    canvasError,
    gptError,
    isConnectingCanvas,
    isTestingGPT,
    connectCanvas,
    testGPTConnection,
    clearErrors
  } = useStore();

  const {
    user,
    userApiKeys,
    userSubscription,
    isLoadingApiKeys,
    isLoadingSubscription,
    saveUserApiKeys,
    clearUserApiKeys,
    getSubscriptionStatus,
    getTrialDaysRemaining
  } = useAuthStore();

  const [showApiKey, setShowApiKey] = useState(false);
  const [showCanvasKey, setShowCanvasKey] = useState(false);
  const [localOpenAIKey, setLocalOpenAIKey] = useState('');
  const [localCanvasKey, setLocalCanvasKey] = useState('');
  const [localCanvasUrl, setLocalCanvasUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [isSavingKeys, setIsSavingKeys] = useState(false);

  // Load API keys from auth store when they change
  useEffect(() => {
    if (userApiKeys) {
      setLocalOpenAIKey(userApiKeys.openai_api_key || '');
      setLocalCanvasKey(userApiKeys.canvas_api_key || '');
      setLocalCanvasUrl(userApiKeys.canvas_base_url || 'https://canvas.asu.edu');
    }
  }, [userApiKeys]);

  const vibeOptions = {
    'classic-student': {
      name: 'Classic Student',
      description: 'Professional, academic tone with proper citations and formal structure',
      emoji: '🧑‍🎓',
      preview: 'In examining the philosophical implications of determinism versus free will, this essay will analyze the fundamental tensions between these competing worldviews...'
    },
    'lazy-genius': {
      name: 'Lazy Genius',
      description: 'Does everything for you in autopilot mode',
      emoji: '🧠',
      preview: 'Here\'s your complete essay on free will vs determinism with all the key points, citations, and structure you need...'
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setIsSavingKeys(true);
    setSaveStatus('saving');

    try {
      await saveUserApiKeys({
        openaiApiKey: localOpenAIKey,
        canvasApiKey: localCanvasKey,
        canvasBaseUrl: localCanvasUrl
      });

      clearErrors();
      setSaveStatus('success');
    } catch (error) {
      console.error('Error saving API keys:', error);
      setSaveStatus('error');
    } finally {
      setIsSavingKeys(false);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleTestCanvasConnection = async () => {
    if (!localCanvasKey || !localCanvasUrl) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }
    
    setSaveStatus('testing');
    
    // Save credentials first to Supabase
    try {
      await saveUserApiKeys({
        openaiApiKey: localOpenAIKey,
        canvasApiKey: localCanvasKey,
        canvasBaseUrl: localCanvasUrl
      });
      
      // Test connection
      const success = await connectCanvas();
      
      if (success) {
        setSaveStatus('connected');
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveStatus('error');
    }
    
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleTestGPTConnection = async () => {
    if (!localOpenAIKey && !import.meta.env.VITE_OPENAI_API_KEY) {
      setSaveStatus('gpt-error');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }
    
    setSaveStatus('testing-gpt');
    
    // Save key first to Supabase
    try {
      await saveUserApiKeys({
        openaiApiKey: localOpenAIKey,
        canvasApiKey: localCanvasKey,
        canvasBaseUrl: localCanvasUrl
      });
      
      // Test connection
      const success = await testGPTConnection();
      
      if (success) {
        setSaveStatus('gpt-connected');
      } else {
        setSaveStatus('gpt-error');
      }
    } catch (error) {
      setSaveStatus('gpt-error');
    }
    
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleClearAllKeys = async () => {
    if (!user) return;
    
    if (confirm('Are you sure you want to clear all API keys? This action cannot be undone.')) {
      setIsSavingKeys(true);
      setSaveStatus('clearing');

      try {
        await clearUserApiKeys();
        setLocalOpenAIKey('');
        setLocalCanvasKey('');
        setLocalCanvasUrl('https://canvas.asu.edu');
        setSaveStatus('cleared');
      } catch (error) {
        console.error('Error clearing API keys:', error);
        setSaveStatus('error');
      } finally {
        setIsSavingKeys(false);
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }
  };

  const handleUpgradeSubscription = async () => {
    if (!user) return;

    try {
      await createCheckoutSession(user.id, user.email);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    }
  };

  const handleManageSubscription = async () => {
    if (!userSubscription?.stripe_customer_id) {
      alert('No billing information found. Please contact support.');
      return;
    }

    try {
      await createCustomerPortalSession(userSubscription.stripe_customer_id);
    } catch (error) {
      console.error('Error accessing customer portal:', error);
      alert('Failed to access billing portal. Please try again.');
    }
  };

  const subscriptionStatus = getSubscriptionStatus();
  const trialDaysRemaining = getTrialDaysRemaining();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your AI preferences and connect your accounts
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* AI Configuration */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="card">
              <div className="flex items-center mb-6">
                <Key className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Configuration
                </h2>
              </div>

              <div className="space-y-6">
                {/* OpenAI API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    OpenAI API Key
                    {import.meta.env.VITE_OPENAI_API_KEY && (
                      <span className="text-xs text-green-600 ml-2">(Admin key available)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={localOpenAIKey}
                      onChange={(e) => setLocalOpenAIKey(e.target.value)}
                      className="input-field pr-10"
                      placeholder={import.meta.env.VITE_OPENAI_API_KEY ? "Optional - admin key available" : "sk-..."}
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Get your API key from{' '}
                      <a 
                        href="https://platform.openai.com/api-keys" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 inline-flex items-center"
                      >
                        OpenAI Platform
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </p>
                    <motion.button
                      onClick={handleTestGPTConnection}
                      disabled={(!localOpenAIKey && !import.meta.env.VITE_OPENAI_API_KEY) || isTestingGPT}
                      className="btn-secondary text-xs px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isTestingGPT ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" text="" color="accent" />
                          <span className="ml-1">Testing...</span>
                        </div>
                      ) : (
                        'Test API'
                      )}
                    </motion.button>
                  </div>
                  {gptError && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {gptError}
                    </p>
                  )}
                </div>

                {/* Vibe Mode Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Writing Style (Vibe Mode)
                  </label>
                  <div className="grid gap-4">
                    {Object.entries(vibeOptions).map(([key, option]) => (
                      <motion.button
                        key={key}
                        onClick={() => setVibeMode(key)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          vibeMode === key 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-gray-200 dark:border-dark-600 hover:border-primary-300'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <span className="text-2xl">{option.emoji}</span>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {option.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {option.description}
                              </p>
                              <div className="bg-gray-100 dark:bg-dark-700 p-2 rounded text-xs text-gray-700 dark:text-gray-300 italic">
                                "{option.preview}"
                              </div>
                            </div>
                          </div>
                          {vibeMode === key && (
                            <Check className="h-5 w-5 text-primary-600 mt-1" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Canvas Integration */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <LinkIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Canvas Integration
                  </h2>
                </div>
                {isCanvasConnected && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <Check className="h-4 w-4 mr-1" />
                    Connected
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Canvas Base URL
                  </label>
                  <input
                    type="url"
                    value={localCanvasUrl}
                    onChange={(e) => setLocalCanvasUrl(e.target.value)}
                    className="input-field"
                    placeholder="https://yourschool.instructure.com"
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Your school's Canvas URL (e.g., yourschool.instructure.com)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Canvas API Token
                  </label>
                  <div className="relative">
                    <input
                      type={showCanvasKey ? 'text' : 'password'}
                      value={localCanvasKey}
                      onChange={(e) => setLocalCanvasKey(e.target.value)}
                      className="input-field pr-10"
                      placeholder="1234~..."
                    />
                    <button
                      onClick={() => setShowCanvasKey(!showCanvasKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCanvasKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Generate from Canvas → Account → Settings → Approved Integrations → New Access Token
                  </p>
                </div>

                <motion.button
                  onClick={handleTestCanvasConnection}
                  disabled={!localCanvasKey || !localCanvasUrl || isConnectingCanvas}
                  className="btn-accent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isConnectingCanvas ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" text="" color="white" />
                      <span className="ml-2">Testing...</span>
                    </div>
                  ) : (
                    'Test Connection'
                  )}
                </motion.button>
                {canvasError && (
                  <p className="text-xs text-red-600 mt-2 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {canvasError}
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          {/* Appearance */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card">
              <div className="flex items-center mb-6">
                <Palette className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Appearance
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Dark Mode
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <motion.button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDarkMode ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                      layout
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Privacy & Security */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Privacy & Security
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-300">
                        Your Data is Secure
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-400 mt-2 space-y-1">
                        <li>• API keys are stored locally in your browser</li>
                        <li>• No assignment content is sent to our servers</li>
                        <li>• All AI processing happens directly with Claude</li>
                        <li>• Your academic work remains private</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Save Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              {saveStatus && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center space-x-2 text-sm ${
                    saveStatus === 'success' ? 'text-green-600' :
                    saveStatus === 'error' ? 'text-red-600' :
                    saveStatus === 'saving' ? 'text-blue-600' :
                    saveStatus === 'clearing' ? 'text-orange-600' :
                    saveStatus === 'cleared' ? 'text-green-600' :
                    saveStatus === 'testing' ? 'text-blue-600' :
                    saveStatus === 'connected' ? 'text-green-600' :
                    saveStatus === 'claude-connected' ? 'text-green-600' :
                    saveStatus === 'claude-error' ? 'text-red-600' :
                    saveStatus === 'testing-claude' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}
                >
                  {(saveStatus === 'success' || saveStatus === 'connected' || saveStatus === 'claude-connected' || saveStatus === 'cleared') && <Check className="h-4 w-4" />}
                  {(saveStatus === 'error' || saveStatus === 'claude-error') && <AlertCircle className="h-4 w-4" />}
                  {(saveStatus === 'testing' || saveStatus === 'testing-claude' || saveStatus === 'saving' || saveStatus === 'clearing') && (
                     <div className="w-4 h-4">
                       <LoadingSpinner size="sm" text="" color="accent" />
                     </div>
                   )}
                  <span>
                    {saveStatus === 'success' && 'API keys saved successfully!'}
                    {saveStatus === 'error' && 'Failed to save API keys'}
                    {saveStatus === 'saving' && 'Saving API keys...'}
                    {saveStatus === 'clearing' && 'Clearing API keys...'}
                    {saveStatus === 'cleared' && 'All API keys cleared successfully!'}
                    {saveStatus === 'testing' && 'Testing Canvas connection...'}
                    {saveStatus === 'connected' && 'Canvas connected successfully!'}
                                    {saveStatus === 'gpt-connected' && 'OpenAI GPT API connected successfully!'}
                {saveStatus === 'gpt-error' && 'OpenAI GPT API connection failed'}
                {saveStatus === 'testing-gpt' && 'Testing OpenAI GPT API...'}
                  </span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={handleClearAllKeys}
                disabled={isSavingKeys || isLoadingApiKeys}
                className="btn-secondary flex items-center text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSavingKeys ? (
                  <>
                    <LoadingSpinner size="sm" text="" color="red" />
                    <span className="ml-2">Clearing...</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Clear All Keys
                  </>
                )}
              </motion.button>
              
              <motion.button
                onClick={handleSaveSettings}
                disabled={isSavingKeys || isLoadingApiKeys}
                className="btn-primary flex items-center disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSavingKeys ? (
                  <>
                    <LoadingSpinner size="sm" text="" color="white" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Billing Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="heading-md text-white mb-2">
                  💳 Billing & Subscription
                </h2>
                <p className="text-gray-400">
                  Manage your subscription and billing information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Subscription Status */}
              <div className="bg-dark-500/50 rounded-lg p-4 border border-dark-400">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">Current Plan</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscriptionStatus === 'trial' ? 'bg-blue-500/20 text-blue-400' :
                        subscriptionStatus === 'active' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {subscriptionStatus === 'trial' && `Free Trial (${trialDaysRemaining} days left)`}
                        {subscriptionStatus === 'active' && 'Pro Subscription'}
                        {subscriptionStatus === 'inactive' && 'No Active Subscription'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      ${subscriptionStatus === 'active' ? '30' : '0'}
                      <span className="text-sm text-gray-400">/month</span>
                    </div>
                  </div>
                </div>

                {subscriptionStatus === 'trial' && (
                  <div className="text-sm text-gray-300 mb-4">
                    Your free trial includes unlimited AI generations and full access to all features.
                    Upgrade before {new Date(Date.now() + trialDaysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString()} to continue using HomeworkBot.ai.
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  {subscriptionStatus === 'trial' && (
                    <motion.button
                      onClick={handleUpgradeSubscription}
                      className="btn-primary flex items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </motion.button>
                  )}
                  
                  {subscriptionStatus === 'active' && userSubscription?.stripe_customer_id && (
                    <motion.button
                      onClick={handleManageSubscription}
                      className="btn-secondary flex items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </motion.button>
                  )}

                  {subscriptionStatus === 'inactive' && (
                    <motion.button
                      onClick={handleUpgradeSubscription}
                      className="btn-primary flex items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Subscribe Now
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Billing Information */}
              {isLoadingSubscription ? (
                <div className="bg-dark-500/50 rounded-lg p-4 border border-dark-400">
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" text="" color="accent" />
                    <span className="text-gray-300">Loading billing information...</span>
                  </div>
                </div>
              ) : userSubscription && (
                <div className="bg-dark-500/50 rounded-lg p-4 border border-dark-400">
                  <h4 className="text-white font-medium mb-3">Billing Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {userSubscription.current_period_end && (
                      <div>
                        <span className="text-gray-400">Next billing date:</span>
                        <div className="text-white">
                          {new Date(userSubscription.current_period_end).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <div className="text-white capitalize">
                        {userSubscription.status}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 