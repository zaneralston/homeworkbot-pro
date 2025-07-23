#!/bin/bash

# 🚀 HomeworkBot.ai - Vercel Deployment Script
# This script prepares and deploys the application to Vercel

echo "🚀 Starting HomeworkBot.ai Vercel Deployment..."

# Step 1: Clean and build
echo "📦 Building production version..."
rm -rf dist/
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix build errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Step 2: Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Step 3: Deploy to Vercel
echo "🌐 Deploying to Vercel..."

# Deploy to production
vercel --prod

echo "🎉 Deployment complete!"

# Step 4: Display next steps
echo ""
echo "📋 POST-DEPLOYMENT CHECKLIST:"
echo ""
echo "1. ✅ Verify deployment at your Vercel URL"
echo "2. 🔑 Add environment variables in Vercel dashboard:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo "   - VITE_STRIPE_PUBLISHABLE_KEY"
echo "   - VITE_STRIPE_PRICE_ID"
echo "3. 🌐 Configure custom domain (homeworkbot.ai)"
echo "4. 🧪 Run end-to-end tests on live environment"
echo "5. 📈 Set up monitoring and analytics"
echo ""
echo "🚀 HomeworkBot.ai is ready for students!" 