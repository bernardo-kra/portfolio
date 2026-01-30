# Vercel Deployment Guide

## 🚨 **CRITICAL: NEVER CHANGE THESE SETTINGS**

### ❌ **FORBIDDEN CONFIGURATIONS**
- **Root Directory:** NEVER set to `backend` (doesn't exist in gh-pages)
- **Framework Preset:** MUST be `vite` (not Other)
- **Build Command:** MUST be `npm run build`
- **Output Directory:** MUST be `dist`

### ✅ **CORRECT CONFIGURATION**

#### `vercel.json` (NEVER MODIFY)
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist", 
  "installCommand": "npm install",
  "framework": "vite"
}
```

#### `vite.config.ts` (BASE PATH CRITICAL)
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',  // ⚠️ CRITICAL: Must match GitHub Pages path
  // ...
});
```

## 🔄 **DEPLOYMENT PROCESS**

### **Current Setup**
- **Source:** GitHub repository `portfolio`
- **Branch:** `gh-pages` (auto-generated)
- **Framework:** Vite + React
- **URL:** https://portfolio-bernardokras-projects.vercel.app/

### **Deploy Commands**
```bash
# ONLY use this command for deployment
npm run deploy

# NEVER use these:
# ❌ git push origin main (triggers wrong workflow)
# ❌ Manual Vercel deploy (wrong configuration)
# ❌ GitHub Actions (disabled)
```

## 🚨 **COMMON MISTAKES TO AVOID**

### **Mistake 1: Root Directory = backend**
```
❌ ERROR: "The specified Root Directory 'backend' does not exist"
✅ SOLUTION: Root Directory should be empty (root of project)
```

### **Mistake 2: Wrong Framework Preset**
```
❌ Framework Preset: Other
✅ Framework Preset: vite
```

### **Mistake 3: Wrong Base Path**
```
❌ base: '/' (breaks GitHub Pages)
✅ base: '/portfolio/' (works with GitHub Pages)
```

### **Mistake 4: Using GitHub Actions**
```
❌ GitHub Actions deploy (conflicts with Vercel)
✅ Only use npm run deploy
```

## 📋 **DEPLOYMENT CHECKLIST**

### **Before Deploy**
- [ ] `vite.config.ts` has `base: '/portfolio/'`
- [ ] `vercel.json` matches the configuration above
- [ ] Run `npm run build` locally first
- [ ] Test with `npm run preview`

### **Deploy Process**
1. `npm run deploy` (ONLY command)
2. Wait for Vercel to detect changes
3. Check deployment at Vercel dashboard

### **After Deploy**
- [ ] Site loads at correct URL
- [ ] All assets load (no 404s)
- [ ] Navigation works correctly

## 🔧 **TROUBLESHOOTING**

### **Build Failed**
1. Check `vercel.json` matches EXACT configuration
2. Verify `base: '/portfolio/'` in vite.config.ts
3. Run `npm run build` locally first

### **Assets 404**
1. Check base path in `vite.config.ts`
2. Verify build generated correct paths
3. Clear Vercel cache

### **Wrong URL**
1. Check Vercel project settings
2. Verify correct branch (`gh-pages`)
3. Check domain configuration

## 🚫 **NEVER DO THESE**

### **Configuration Changes**
- ❌ Modify `vercel.json` without testing
- ❌ Change Root Directory to `backend`
- ❌ Set Framework Preset to `Other`
- ❌ Remove `framework: "vite"`

### **Deploy Commands**
- ❌ Use GitHub Actions for deployment
- ❌ Push directly to trigger deploy
- ❌ Manual Vercel dashboard deploys
- ❌ Use `gh-pages` directly

### **Base Path Changes**
- ❌ Change `base: '/'` (breaks GitHub Pages)
- ❌ Remove base path completely
- ❌ Use relative paths

## ✅ **ALWAYS DO THESE**

### **Before Any Change**
1. Test locally with `npm run build`
2. Test with `npm run preview`
3. Check Vercel dashboard for errors
4. Create backup branch if major changes

### **Deployment**
1. Only use `npm run deploy`
2. Wait for Vercel to complete
3. Verify site loads correctly
4. Check all assets work

### **Documentation**
1. Update this file if changes needed
2. Document any new requirements
3. Share changes with team

## 🎯 **CURRENT STATUS**

### **Working Configuration**
- ✅ Vercel deploy working
- ✅ GitHub Pages working
- ✅ Base path correct
- ✅ Assets loading properly

### **URLs**
- **Vercel:** https://portfolio-bernardokras-projects.vercel.app/
- **GitHub Pages:** https://bernardo-kra.github.io/portfolio/

### **Last Updated**
- **Date:** 2026-01-30
- **Version:** 1.0
- **Status:** Working ✅

---

## 🚨 **EMERGENCY PROCEDURES**

### **If Vercel Breaks**
1. Revert `vercel.json` to configuration above
2. Check `vite.config.ts` base path
3. Run `npm run deploy` again
4. Contact team if still broken

### **If GitHub Pages Breaks**
1. Check base path in `vite.config.ts`
2. Verify `base: '/portfolio/'`
3. Run `npm run deploy`
4. Check GitHub Pages settings

---

**⚠️ CRITICAL: This configuration works. DO NOT change without thorough testing and documentation updates!**
