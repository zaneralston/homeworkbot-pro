# HomeworkBot.pro Production Deployment Guide

## 🎯 GOAL: Deploy HomeworkBot.pro to production at https://homeworkbot.pro

### ✅ Current Status
Your HomeworkBot.pro project is ready for deployment with:
- ✅ Vite + React setup
- ✅ Supabase authentication
- ✅ Stripe billing integration
- ✅ Canvas API integration
- ✅ GPT-4 generation
- ✅ Secure per-user storage
- ✅ .env properly excluded from git

---

## 🚀 Step 1: Push to GitHub

### Create Repository
1. Go to [github.com](https://github.com) → New repository
2. Repository name: `homeworkbot-pro`
3. Description: `AI-powered SaaS platform for automating schoolwork with Canvas integration`
4. Set to **Public** (required for Vercel free plan)
5. Do **NOT** initialize with README, .gitignore, or license

### Push Code
After creating the repository, run these commands:

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/homeworkbot-pro.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Deploy to Vercel

### Import Project
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your `homeworkbot-pro` repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

---

## 🔐 Step 3: Environment Variables

In Vercel dashboard → Settings → Environment Variables, add these:

### Required Environment Variables:
```
VITE_SUPABASE_URL=https://kvaaapznwjekymplisgu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...your_actual_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...your_live_publishable_key
VITE_STRIPE_PRICE_ID=price_...your_live_price_id
VITE_OPENAI_API_KEY=sk-...your_openai_api_key
VITE_CANVAS_BASE_URL=https://canvas.asu.edu/api/v1
VITE_APP_URL=https://homeworkbot.pro
```

---

## 🌍 Step 4: Custom Domain Setup

### Add Domain in Vercel
1. Vercel Dashboard → Settings → Domains
2. Add domain: `homeworkbot.pro`
3. Vercel will provide DNS records

### Configure Namecheap DNS
1. Go to [namecheap.com](https://namecheap.com)
2. Domain List → `homeworkbot.pro` → Advanced DNS
3. Add CNAME records from Vercel

---

## 🎉 Final Result

✅ **HomeworkBot.pro live at https://homeworkbot.pro**
✅ **Full SaaS platform with all features working**

