# 🔧 HomeworkBot.ai Setup Guide

## Prerequisites
- Supabase account (free tier available)
- Stripe account (for payments)
- Canvas LMS access (student account)
- Claude API key from Anthropic

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose your organization and set project details
4. Wait for project to be ready (2-3 minutes)

### 1.2 Get Supabase Credentials
1. Go to Settings → API
2. Copy your "Project URL" (starts with `https://`)
3. Copy your "anon/public" key (starts with `eyJhbGciOi`)

### 1.3 Setup Database Schema
1. Go to SQL Editor in your Supabase dashboard
2. Copy the entire content from `supabase-schema.sql`
3. Paste and run the SQL script
4. Verify tables were created: `user_api_keys` and `user_subscriptions`

## Step 2: Stripe Payment Setup

### 2.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and sign up
2. Activate your account (may require business verification)

### 2.2 Create Subscription Product
1. Go to Products → Add Product
2. Set name: "HomeworkBot.ai Pro"
3. Set price: $30.00 USD
4. Set billing: Recurring monthly
5. Copy the Price ID (starts with `price_`)

### 2.3 Get Stripe Keys
1. Go to Developers → API Keys
2. Copy "Publishable key" (starts with `pk_test_`)
3. Keep the Secret key safe (for backend later)

## Step 3: Update Environment Variables

### 3.1 Update .env File
Replace the placeholder values in `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi... (your actual anon key)

# Stripe Configuration  
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (your actual publishable key)
VITE_STRIPE_PRICE_ID=price_... (your actual price ID)

# App Configuration
VITE_APP_URL=http://localhost:9000
```

## Step 4: Test the Application

### 4.1 Rebuild and Restart
```bash
npm run build
cd dist && python3 -m http.server 9000
```

### 4.2 Test User Flow
1. Go to http://localhost:9000
2. Click "Start Free Trial"
3. Sign up with email/password
4. Check email for verification link
5. Login and access dashboard
6. Go to Settings to add API keys

## Step 5: Get API Keys for Students

### 5.1 Canvas API Token
Students need to get their Canvas API token:
1. Login to your school's Canvas
2. Go to Account → Settings
3. Scroll to "Approved Integrations"
4. Click "+ New Access Token"
5. Set purpose: "HomeworkBot.ai Integration"
6. Copy the generated token (starts with `1~`)

### 5.2 OpenAI API Key (Optional)
Students can optionally add their own OpenAI API key:
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up and verify account
3. Add billing information ($5 minimum)
4. Go to API Keys → Create Key
5. Copy the key (starts with `sk-`)

**Note:** Admin can set `VITE_OPENAI_API_KEY` for all users

## Step 6: Production Deployment (Optional)

### 6.1 Deploy to Vercel/Netlify
```bash
# Build the app
npm run build

# Deploy to Vercel
npx vercel --prod

# Or deploy to Netlify
npx netlify deploy --prod --dir=dist
```

### 6.2 Update Environment Variables
Update `VITE_APP_URL` to your production domain.

## Troubleshooting

### Common Issues:
1. **Supabase connection errors**: Check URL and anon key
2. **Email verification not working**: Check Supabase Auth settings
3. **Stripe errors**: Verify publishable key and price ID
4. **Canvas sync fails**: Verify Canvas URL is `https://canvas.asu.edu` and API token is valid
5. **GPT API errors**: Check OpenAI API key and billing status

### Support:
- Check browser console for error messages
- Verify all environment variables are set correctly
- Test API connections in Settings page
- Ensure sufficient OpenAI API credits

## Security Notes

✅ **Client-side storage**: API keys stored locally in browser
✅ **No data collection**: No user data sent to third parties  
✅ **Encrypted communications**: All API calls use HTTPS
✅ **RLS policies**: Database protected with Row Level Security

**Ready to launch!** 🚀 