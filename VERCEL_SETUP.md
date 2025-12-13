# Vercel Deployment Setup Guide

## Backend Setup (Run Tests + Deploy API)

### 1. Vercel Configuration Files
- `vercel.json` is already created with:
  - Build command includes `npm run test` to run all test cases
  - Environment variables for MongoDB and JWT

### 2. Environment Variables in Vercel
Set these in your Vercel Project Settings → Environment Variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### 3. Steps to Deploy Backend
1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `backend` folder as root directory
5. Add environment variables (MONGODB_URI, JWT_SECRET)
6. Click "Deploy"

**The build will:**
- Install dependencies
- Run all test cases with Jest
- Build and deploy the API

### 4. Verify Tests Run
After deployment, check the build logs in Vercel dashboard:
- Look for "npm run test" output
- All tests should pass before deployment completes

---

## Frontend Setup (Build & Deploy React App)

### 1. Vercel Configuration Files
- `vercel.json` is already created with build settings
- `.env.production` contains Vercel backend URL

### 2. Environment Variables in Vercel
Set this in your Vercel Project Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-vercel-url
```

### 3. Steps to Deploy Frontend
1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `frontend` folder as root directory
5. Add environment variable: `VITE_API_URL=<your-backend-url>`
6. Click "Deploy"

**The build will:**
- Install React dependencies
- Build optimized production bundle with Vite
- Deploy static files to CDN

### 4. Verify Deployment
- Frontend URL: `https://your-project.vercel.app`
- Check `.env.production` file has correct backend URL
- Test login/register to ensure API connection works

---

## Summary of Changes

### Backend (`/backend`)
- ✅ `vercel.json` - Includes test command in build process
- ✅ `package.json` - Has `test` script for Jest

### Frontend (`/frontend`)
- ✅ `vercel.json` - Build and dev settings
- ✅ `.env.production` - Production backend URL
- ✅ `.env.local` - Development backend URL
- ✅ `src/api/config.js` - Dynamic API URL based on environment

---

## Quick Deployment Checklist

### Backend
- [ ] MongoDB URI configured in Vercel env vars
- [ ] JWT_SECRET configured in Vercel env vars
- [ ] All tests pass locally (`npm run test`)
- [ ] vercel.json has test command in build

### Frontend
- [ ] Backend URL set in VITE_API_URL env var
- [ ] Build succeeds locally (`npm run build`)
- [ ] .env.production file exists
- [ ] Can successfully connect to backend API

---

## Troubleshooting

**Tests fail during backend build:**
- Check `npm run test` works locally
- Verify MongoDB test database is accessible
- Check Jest configuration in jest.config.js

**Frontend can't connect to backend:**
- Verify VITE_API_URL points to correct backend URL
- Check backend CORS settings allow frontend domain
- Review browser console for API error details

**Build timeout:**
- Increase function timeout in vercel.json
- Split large builds into smaller chunks
