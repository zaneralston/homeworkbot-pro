import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Database schema functions for API keys
export const getUserApiKeys = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching user API keys:', error);
    return null;
  }
};

export const saveUserApiKeys = async (userId, apiKeys) => {
  try {
    const { data, error } = await supabase
      .from('user_api_keys')
      .upsert({
        user_id: userId,
        openai_api_key: apiKeys.openaiApiKey || null,
        canvas_api_key: apiKeys.canvasApiKey || null,
        canvas_base_url: apiKeys.canvasBaseUrl || 'https://canvas.asu.edu',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving user API keys:', error);
    throw error;
  }
};

export const deleteUserApiKeys = async (userId) => {
  try {
    const { error } = await supabase
      .from('user_api_keys')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting user API keys:', error);
    throw error;
  }
};

// User subscription functions
export const getUserSubscription = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
};

export const updateUserSubscription = async (userId, subscriptionData) => {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: subscriptionData.stripeCustomerId,
        stripe_subscription_id: subscriptionData.stripeSubscriptionId,
        status: subscriptionData.status,
        current_period_end: subscriptionData.currentPeriodEnd,
        trial_end: subscriptionData.trialEnd,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}; 