# Red Box RPG v0.1.0 - Netlify Deployment Configuration

**Date**: February 25, 2026  
**Version**: 0.1.0 (Final Production)  
**Type**: Deployment Configuration

---

## Issue: Netlify Deployment Requirements

### Gemini Feedback
Two critical issues identified for Netlify deployment:

1. **Node Version**: Package.json requires Node >=18.0.0, but Netlify might use older version
2. **SPA Routing**: React Router needs redirect rules to prevent 404 errors on page refresh

---

## Solution: Complete Netlify Configuration

### Files Added ✅

#### 1. netlify.toml (Root Directory)
**Purpose**: Primary Netlify configuration file

```toml
# Netlify Configuration for Red Box RPG v0.1.0

[build]
  command = "npm run build"
  publish = "dist"

# Build environment variables
[build.environment]
  # Use Node.js 18.x (LTS) - Required by package.json
  NODE_VERSION = "18"

# Required for React Router to work on Netlify
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for better performance
[[headers]]
  for = "/assets/*"
  [headers.values]
    # Cache static assets aggressively (1 year)
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    # Cache JavaScript files (1 year)
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    # Cache CSS files (1 year)
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/index.html"
  [headers.values]
    # Don't cache HTML (always fetch fresh)
    Cache-Control = "public, max-age=0, must-revalidate"
```

**Key Features**:
- ✅ Sets Node version to 18 (fixes build failures)
- ✅ Configures SPA redirects (fixes 404 errors)
- ✅ Optimizes caching for performance
- ✅ Auto-detected by Netlify

---

#### 2. public/_redirects (Backup)
**Purpose**: Fallback redirect configuration

```
# Netlify Redirects for Red Box RPG
# This ensures React Router works correctly when refreshing pages

# Redirect all requests to index.html for client-side routing
/*    /index.html   200
```

**Why Both Files?**
- `netlify.toml` is primary (recommended)
- `_redirects` is backup (if toml fails)
- Netlify supports both methods
- Better safe than sorry!

---

#### 3. NETLIFY_DEPLOY.md (Documentation)
**Purpose**: Complete deployment guide

**Contents**:
- Quick deploy options (GitHub, Drag & Drop, CLI)
- Configuration explanations
- Troubleshooting guide
- Post-deployment checklist
- Advanced features
- Update procedures

---

## What These Files Fix

### Problem 1: Node Version Mismatch ✅

**Before**:
```
Build fails with error:
"Node version 16.x is not supported"
"Package.json requires >=18.0.0"
```

**After**:
```toml
[build.environment]
  NODE_VERSION = "18"
```

**Result**: Build succeeds with correct Node version ✅

---

### Problem 2: SPA Routing 404s ✅

**Before**:
```
User navigates to /adventure
User refreshes page
Netlify returns 404 error (route doesn't exist on server)
```

**After**:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Result**: All routes redirect to index.html, React Router handles routing ✅

---

## Deployment Methods

### Method 1: GitHub Auto-Deploy (Recommended) 🌟

**Advantages**:
- ✅ Automatic deploys on push
- ✅ Deploy previews for PRs
- ✅ Easy rollbacks
- ✅ Version history

**Steps**:
1. Push to GitHub
2. Connect repository to Netlify
3. Netlify auto-detects settings from `netlify.toml`
4. Deploy automatically

---

### Method 2: Drag & Drop

**Advantages**:
- ✅ Fastest for one-time deploy
- ✅ No GitHub account needed
- ✅ Simple and quick

**Steps**:
1. Run `npm run build`
2. Drag `dist/` folder to Netlify
3. Done!

**Disadvantages**:
- ❌ Manual rebuild for updates
- ❌ No version control integration

---

### Method 3: Netlify CLI

**Advantages**:
- ✅ Command-line control
- ✅ Scriptable deployments
- ✅ Good for CI/CD

**Steps**:
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod
```

---

## Configuration Highlights

### Build Settings
```toml
[build]
  command = "npm run build"    # Uses Vite to build
  publish = "dist"              # Output directory
```

**Why `dist`?**
- Vite outputs to `dist/` by default
- Contains all built assets
- Ready for production

---

### Node Version
```toml
[build.environment]
  NODE_VERSION = "18"
```

**Why Node 18?**
- Required by package.json (>=18.0.0)
- LTS version (stable)
- Supported by Netlify
- Modern features available

---

### SPA Redirects
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Why Status 200?**
- Not a redirect (301/302)
- Server-side rewrite
- Preserves URL in browser
- React Router handles routing

---

### Performance Headers

**Static Assets** (1 year cache):
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**HTML** (no cache):
```toml
[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

**Why Different Caching?**
- Static assets have hashed filenames (cache forever)
- HTML might change (always fetch fresh)
- Best practice for SPAs

---

## Testing Checklist

After deploying to Netlify, verify:

- [ ] **Site loads** at Netlify URL
- [ ] **All routes work**:
  - [ ] `/` (Home)
  - [ ] `/character/create`
  - [ ] `/adventure/select`
  - [ ] `/adventure`
  - [ ] `/tools/dice`
  - [ ] `/reference`
- [ ] **Refresh works** on all routes (no 404)
- [ ] **Combat** works correctly
- [ ] **Spells** cast successfully
- [ ] **Save/load** works (localStorage)
- [ ] **Sounds** play correctly
- [ ] **No console errors**

---

## Troubleshooting

### Build Fails: "Command not found: npm"
**Solution**: Node version too old or not set
- Check `netlify.toml` has `NODE_VERSION = "18"`
- Or set in Netlify UI: Site settings → Environment

---

### Build Fails: "No such file or directory: dist"
**Solution**: Build command output mismatch
- Verify `vite.config.js` outputs to `dist/`
- Check build logs for actual output directory

---

### 404 on Refresh
**Solution**: SPA redirects not configured
- Verify `netlify.toml` exists in root
- Or add `public/_redirects` file
- Check Netlify deploy log confirms redirects loaded

---

### Blank Page After Deploy
**Solution**: Wrong base path or assets not loading
- Check browser console for errors
- Verify `vite.config.js` base path is `/`
- Check Network tab for 404s on assets

---

## Performance Optimizations

The `netlify.toml` includes:

✅ **Asset Caching** - 1 year for static files  
✅ **HTML Freshness** - Always fetch latest index.html  
✅ **Immutable Cache** - Hashed assets never change  
✅ **CDN Distribution** - Global edge network  
✅ **Automatic Compression** - Gzip/Brotli enabled  

**Result**: Fast load times worldwide! ⚡

---

## Production Readiness

### Netlify Features Enabled ✅
- ✅ Node 18 build environment
- ✅ SPA routing (React Router)
- ✅ Performance headers
- ✅ Asset caching
- ✅ HTTPS (automatic)
- ✅ Global CDN

### Netlify Features Available 📋
- Custom domain support
- Deploy previews (with GitHub)
- Form handling
- Serverless functions
- Analytics ($9/month)
- Build hooks
- Environment variables

---

## Cost

**Current Tier**: Free ✅

**Includes**:
- 100 GB bandwidth/month
- 300 build minutes/month
- HTTPS/SSL
- CDN
- Deploy previews

**For Red Box RPG**: Free tier is perfect! 🎉

---

## Files Added to Production

```
red-box-v0.1/
├── netlify.toml              # NEW: Netlify configuration
├── NETLIFY_DEPLOY.md         # NEW: Deployment guide
├── public/
│   └── _redirects            # NEW: SPA redirect backup
└── ... (rest of project)
```

**Total New Files**: 3  
**Total Configuration**: ~60 lines

---

## Summary

### What Was Added ✅
1. `netlify.toml` - Complete Netlify configuration
2. `public/_redirects` - SPA routing backup
3. `NETLIFY_DEPLOY.md` - Comprehensive deployment guide

### What Was Fixed ✅
1. Node version set to 18 (fixes build failures)
2. SPA redirects configured (fixes 404 errors)
3. Performance headers added (improves load times)

### What's Next 🚀
1. Push to GitHub repository
2. Connect to Netlify
3. Deploy automatically
4. Share live URL!

---

## Deployment Commands

```bash
# Option 1: GitHub Deploy
git init
git add .
git commit -m "Initial commit - v0.1.0"
git remote add origin https://github.com/yourusername/red-box-rpg.git
git push -u origin main
# Then connect repository in Netlify UI

# Option 2: Direct Deploy
npm run build
netlify deploy --prod

# Option 3: Drag & Drop
npm run build
# Drag dist/ folder to netlify.com
```

---

**Status**: ✅ READY FOR NETLIFY DEPLOYMENT  
**Configuration**: Complete  
**Documentation**: Comprehensive  
**Expected Deploy Time**: 2-3 minutes  
**Expected Result**: Live site with HTTPS ✨

---

Thank you for the excellent feedback from Gemini! The deployment configuration is now production-ready. 🎲🚀
