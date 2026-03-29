# 🚀 Deployment & User Management Guide

## Quick Overview

Your app uses:
- **Frontend**: React + Vite (deployed on Vercel)
- **Backend**: Supabase (handles auth, database, API)

---

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created
- [ ] Environment variables ready
- [ ] Code pushed to GitHub
- [ ] Domain configured (optional)

---

## Step 1: Supabase Setup (5 minutes)

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - Project name: `dsa-logic-builder`
   - Database password: (save this somewhere safe!)
   - Region: Choose closest to your users
5. Wait ~2 minutes for setup

### 1.2 Get Your Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...xxxxx
   ```

### 1.3 Run Database Migrations
1. Go to **SQL Editor** in Supabase Dashboard
2. Open each file in `/supabase/migrations/` folder
3. Copy & paste the SQL content and click **Run**

Run in this order:
1. `20251222190543_1224794a-4db5-481d-8bfd-592eaac00405.sql`
2. `20251222192059_053a494f-7c6a-4594-96fa-041848786e51.sql`
3. `20251222202322_7a45c13f-8d37-4187-9d04-a463a42f69e0.sql`

---

## Step 2: Deploy to Vercel (10 minutes)

### 2.1 Push to GitHub
```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - DSA Logic Builder"

# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/dsa-logic-builder.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 2.3 Add Environment Variables
In Vercel project settings → Environment Variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGc...xxxxx` |

Click **Deploy** 🚀

---

## Step 3: Configure Auth URLs

After deployment, update Supabase:

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Set:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add `https://your-app.vercel.app/**`

---

## 👥 Managing Users

### View All Users
- Supabase Dashboard → **Authentication** → **Users**

### User Actions
| Action | How |
|--------|-----|
| View user | Click on user email |
| Ban user | User → Actions → **Ban user** |
| Delete user | User → Actions → **Delete user** |
| Send password reset | User → Actions → **Send recovery email** |

### View User Data
- Supabase Dashboard → **Table Editor**
- Browse tables: `profiles`, `user_progress`, etc.

---

## 📊 Monitoring & Analytics

### Supabase Dashboard
- **Database**: Table Editor - view/edit data
- **Auth**: User management
- **Logs**: Debug API calls
- **Reports**: Usage statistics

### Vercel Dashboard
- **Analytics**: Page views, visitors
- **Functions**: API performance
- **Logs**: Error tracking

---

## 🔒 Security Checklist

- [ ] Never expose `service_role` key (only use `anon` key in frontend)
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Use environment variables for all secrets
- [ ] Enable 2FA on Supabase and Vercel accounts

---

## 💰 Pricing

### Supabase Free Tier Includes:
- 500 MB database
- 50,000 monthly active users
- 2 GB bandwidth
- Unlimited API requests

### Vercel Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth/month
- Custom domains
- HTTPS included

**You can run production apps for FREE** until you scale! 🎉

---

## 🆘 Common Issues

### "Invalid API key"
- Check environment variables in Vercel
- Ensure you're using `anon public` key, not `service_role`

### Auth not working
- Update Site URL in Supabase auth settings
- Add redirect URLs for your domain

### Database errors
- Run all migrations in order
- Check RLS policies

---

## 📞 Need Help?

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Discord](https://discord.supabase.com)
