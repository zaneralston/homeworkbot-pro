import { create } from 'zustand';
import { supabase, getUserApiKeys, saveUserApiKeys, deleteUserApiKeys, getUserSubscription } from '../lib/supabase';
import { hasActiveSubscription, getSubscriptionStatus, getTrialDaysRemaining } from '../lib/stripe';

const useAuthStore = create((set, get) => ({
  // Auth state
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  // User data
  userApiKeys: null,
  userSubscription: null,

  // Loading states
  isLoadingApiKeys: false,
  isLoadingSubscription: false,

  // Initialize auth state
  initializeAuth: async () => {
    try {
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        set({ isLoading: false });
        return;
      }

      if (session) {
        set({ 
          session, 
          user: session.user, 
          isAuthenticated: true,
          isLoading: false 
        });
        
        // Load user data
        await Promise.all([
          get().loadUserApiKeys(session.user.id),
          get().loadUserSubscription(session.user.id)
        ]);
      } else {
        set({ isLoading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          set({ 
            session, 
            user: session.user, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          // Load user data after sign in
          await Promise.all([
            get().loadUserApiKeys(session.user.id),
            get().loadUserSubscription(session.user.id)
          ]);
        } else if (event === 'SIGNED_OUT') {
          set({ 
            session: null, 
            user: null, 
            isAuthenticated: false,
            userApiKeys: null,
            userSubscription: null,
            isLoading: false 
          });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },

  // API Keys management
  loadUserApiKeys: async (userId) => {
    if (!userId) return;
    
    set({ isLoadingApiKeys: true });
    try {
      const apiKeys = await getUserApiKeys(userId);
      set({ userApiKeys: apiKeys, isLoadingApiKeys: false });
    } catch (error) {
      console.error('Error loading user API keys:', error);
      set({ isLoadingApiKeys: false });
    }
  },

  saveUserApiKeys: async (apiKeys) => {
    const { user } = get();
    if (!user) throw new Error('User not authenticated');

    set({ isLoadingApiKeys: true });
    try {
      const savedKeys = await saveUserApiKeys(user.id, apiKeys);
      set({ userApiKeys: savedKeys, isLoadingApiKeys: false });
      return savedKeys;
    } catch (error) {
      console.error('Error saving user API keys:', error);
      set({ isLoadingApiKeys: false });
      throw error;
    }
  },

  clearUserApiKeys: async () => {
    const { user } = get();
    if (!user) throw new Error('User not authenticated');

    set({ isLoadingApiKeys: true });
    try {
      await deleteUserApiKeys(user.id);
      set({ userApiKeys: null, isLoadingApiKeys: false });
    } catch (error) {
      console.error('Error clearing user API keys:', error);
      set({ isLoadingApiKeys: false });
      throw error;
    }
  },

  // Subscription management
  loadUserSubscription: async (userId) => {
    if (!userId) return;
    
    set({ isLoadingSubscription: true });
    try {
      const subscription = await getUserSubscription(userId);
      set({ userSubscription: subscription, isLoadingSubscription: false });
    } catch (error) {
      console.error('Error loading user subscription:', error);
      set({ isLoadingSubscription: false });
    }
  },

  updateUserSubscription: async (subscriptionData) => {
    const { user } = get();
    if (!user) throw new Error('User not authenticated');

    set({ isLoadingSubscription: true });
    try {
      const updatedSubscription = await updateUserSubscription(user.id, subscriptionData);
      set({ userSubscription: updatedSubscription, isLoadingSubscription: false });
      return updatedSubscription;
    } catch (error) {
      console.error('Error updating user subscription:', error);
      set({ isLoadingSubscription: false });
      throw error;
    }
  },

  // Computed getters
  hasActiveSubscription: () => {
    const { userSubscription } = get();
    return hasActiveSubscription(userSubscription);
  },

  getSubscriptionStatus: () => {
    const { userSubscription } = get();
    return getSubscriptionStatus(userSubscription);
  },

  getTrialDaysRemaining: () => {
    const { userSubscription } = get();
    return getTrialDaysRemaining(userSubscription);
  },

  // API key getters - user-controlled only
  getGptKey: () => {
    const { userApiKeys } = get();
    return userApiKeys?.openai_api_key || '';
  },

  getCanvasKey: () => {
    const { userApiKeys } = get();
    return userApiKeys?.canvas_api_key || '';
  },

  getCanvasBaseUrl: () => {
    const { userApiKeys } = get();
    return userApiKeys?.canvas_base_url || 'https://canvas.asu.edu';
  },

  // Check if user has required API keys
  hasGptKey: () => {
    const { userApiKeys } = get();
    return !!(userApiKeys?.openai_api_key?.trim());
  },

  hasCanvasKey: () => {
    const { userApiKeys } = get();
    return !!(userApiKeys?.canvas_api_key?.trim());
  },

  // Check if user has both keys for full functionality
  hasAllKeys: () => {
    const { userApiKeys } = get();
    return !!(userApiKeys?.openai_api_key?.trim() && userApiKeys?.canvas_api_key?.trim());
  }
}));

export default useAuthStore; 