# 🚀 HomeworkBot.ai Deployment Guide

## Production Setup Instructions

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings → API
3. In the SQL Editor, run the script from `supabase-schema.sql`
4. In Authentication → Settings:
   - Enable email confirmations (optional)
   - Set site URL to your production domain
   - Configure SMTP for email sending (optional)

### 2. Stripe Setup
1. Go to [stripe.com](https://stripe.com) and create an account
2. Create a new product:
   - Name: "HomeworkBot.ai Pro"
   - Price: $30.00 USD
   - Billing period: Monthly
   - Copy the Price ID (starts with `price_`)
3. Get your publishable key from Developers → API keys

### 3. Environment Variables
Create a `.env` file with your actual values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
VITE_STRIPE_PRICE_ID=price_your_actual_price_id
VITE_APP_URL=https://yourdomain.com
```

### 4. Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect Vercel to your GitHub repository
3. Set environment variables in Vercel dashboard
4. Deploy!

```bash
# Alternative: Deploy with Vercel CLI
npm i -g vercel
vercel --prod
```

### 5. Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Configure redirects for SPA:

Create `dist/_redirects`:
```
/*    /index.html   200
```

### 6. Other Hosting Options

**Static Hosting (GitHub Pages, etc.):**
- Build: `npm run build`
- Upload `dist` folder
- Ensure environment variables are set during build

**VPS/Server:**
- Install Node.js and nginx
- Build the project
- Serve with nginx
- Use PM2 for process management

### 7. Database Backup & Security

**Supabase Configuration:**
- Enable Row Level Security (RLS) - already configured
- Set up database backups
- Configure API rate limits
- Review user policies

**Security Checklist:**
- ✅ RLS policies enabled
- ✅ Environment variables secured
- ✅ HTTPS enabled
- ✅ API keys not exposed in frontend
- ✅ User input validation
- ✅ Secure authentication flow

### 8. Monitoring & Analytics

**Recommended Tools:**
- Vercel Analytics (if using Vercel)
- Google Analytics
- Sentry for error tracking
- Stripe Dashboard for payment monitoring
- Supabase Dashboard for user analytics

### 9. Custom Domain Setup

1. Configure DNS to point to your hosting provider
2. Update `VITE_APP_URL` to your domain
3. Update Supabase site URL setting
4. Update Stripe webhook URLs (if using webhooks)

### 10. Production Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Stripe products created
- [ ] Domain configured
- [ ] SSL certificate enabled
- [ ] Error monitoring setup
- [ ] Analytics tracking enabled
- [ ] Email notifications working
- [ ] Payment flow tested
- [ ] User registration flow tested

## Scaling Considerations

### For 100+ Users:
- Enable Supabase Pro plan
- Set up database connection pooling
- Implement API rate limiting
- Add Redis for session storage

### For 1000+ Users:
- CDN for static assets
- Database optimization
- Implement caching strategies
- Consider dedicated Stripe webhooks handler

## Support & Maintenance

**Regular Tasks:**
- Monitor error rates
- Check payment failures
- Review user feedback
- Update dependencies
- Monitor API usage costs

**Emergency Contacts:**
- Supabase Support: [support portal]
- Stripe Support: [dashboard]
- Hosting Provider Support

---

**Your HomeworkBot.ai is ready for production! 🎉**
