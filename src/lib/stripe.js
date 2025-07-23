import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePriceId = import.meta.env.VITE_STRIPE_PRICE_ID;
const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:9000';

if (!stripePublishableKey || !stripePriceId) {
  console.warn('Missing Stripe environment variables. Billing features will be disabled.');
}

// Initialize Stripe
let stripePromise = null;
if (stripePublishableKey) {
  stripePromise = loadStripe(stripePublishableKey);
}

export const getStripe = () => stripePromise;

// Create Stripe Checkout session for subscription
export const createCheckoutSession = async (userId, userEmail) => {
  if (!stripePromise) {
    throw new Error('Stripe is not configured. Please check environment variables.');
  }

  try {
    // In a real app, this would call your backend API
    // For now, we'll use Stripe Checkout directly
    const stripe = await stripePromise;
    
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/dashboard`,
      customerEmail: userEmail,
      clientReferenceId: userId,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: {
        metadata: {
          userId: userId
        },
        trial_period_days: 7
      }
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create Stripe Customer Portal session
export const createCustomerPortalSession = async (stripeCustomerId) => {
  if (!stripePromise) {
    throw new Error('Stripe is not configured. Please check environment variables.');
  }

  try {
    // In a real app, this would call your backend API to create a portal session
    // For now, we'll show a placeholder message
    alert('Customer portal integration requires a backend API. This would redirect to Stripe customer portal.');
    
    // This is how you would typically handle it:
    /*
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: stripeCustomerId,
        return_url: `${appUrl}/settings`
      }),
    });
    
    const session = await response.json();
    window.location.href = session.url;
    */
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
};

// Subscription status helpers
export const getSubscriptionStatus = (subscription) => {
  if (!subscription) return 'inactive';
  
  const now = new Date();
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null;
  const currentPeriodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null;

  // Check if in trial period
  if (trialEnd && now < trialEnd) {
    return 'trial';
  }

  // Check subscription status
  if (subscription.status === 'active' && currentPeriodEnd && now < currentPeriodEnd) {
    return 'active';
  }

  if (subscription.status === 'past_due') {
    return 'past_due';
  }

  if (subscription.status === 'canceled') {
    return 'canceled';
  }

  return 'inactive';
};

export const getTrialDaysRemaining = (subscription) => {
  if (!subscription || !subscription.trial_end) return 0;
  
  const now = new Date();
  const trialEnd = new Date(subscription.trial_end);
  const diffTime = trialEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

export const hasActiveSubscription = (subscription) => {
  const status = getSubscriptionStatus(subscription);
  return status === 'active' || status === 'trial';
}; 