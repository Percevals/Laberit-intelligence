# GitHub Pages Setup Instructions

## Quick Setup (5 minutes)

### 1. Add Mistral API Key to GitHub Secrets

1. **Go to your repository on GitHub**
   - Navigate to: `https://github.com/[your-username]/Laberit-intelligence`

2. **Access Secrets Settings**
   - Click on **Settings** tab (top of repo)
   - In left sidebar, click **Secrets and variables** → **Actions**

3. **Add New Secret**
   - Click **"New repository secret"**
   - **Name**: `VITE_MISTRAL_API_KEY`
   - **Value**: `mr-your-actual-mistral-api-key`
   - Click **"Add secret"**

### 2. Trigger Deployment

1. **Push any change** to trigger rebuild:
   ```bash
   git add .
   git commit -m "Enable Mistral AI in GitHub Pages"
   git push
   ```

2. **Monitor deployment**:
   - Go to **Actions** tab in your repo
   - Watch the "Deploy to GitHub Pages" workflow
   - Should complete in ~3-5 minutes

### 3. Verify It's Working

1. **Open your app**: `https://[your-username].github.io/Laberit-intelligence/apps/assessment-v2/`

2. **Test AI integration**:
   - Click "Comenzar Evaluación"
   - Type a company name (e.g., "Microsoft")
   - Look for:
     - 🟢 **Green AI health indicator** (right side of search box)
     - Real company results appearing
     - Console log: "Searching with Mistral AI..."

3. **If issues, check debug page**:
   - Go to: `https://[your-username].github.io/Laberit-intelligence/apps/assessment-v2/debug`
   - Should show:
     - ✅ Has Mistral: true
     - 🟢 Mistral: Available

## What Was Fixed

### ✅ GitHub Actions Workflow
- Added `VITE_MISTRAL_API_KEY: ${{ secrets.VITE_MISTRAL_API_KEY }}` to build step
- Now injects API key during build process

### ✅ AI Health Indicator
- Added to search input (right side): `/src/features/company-search/CompanySearchInput.tsx:78-81`
- Shows real-time provider status:
  - 🟢 Green = Mistral/OpenAI working
  - 🟡 Yellow = Cache/fallback  
  - 🔴 Red = No AI available

### ✅ Robust Configuration
- Created `/src/config/ai-config.ts` with fallback system
- Handles both development and production environments
- Debug page at `/debug` route for troubleshooting

## Success Indicators

✅ **Working correctly when you see:**
1. Green pulsing dot in search input
2. Real company data in search results (not mock data)
3. Console shows "Company search completed using Mistral AI"
4. No authentication errors in browser Network tab

## Common Issues

❌ **"No AI provider available"**
- Check GitHub Secret is named exactly: `VITE_MISTRAL_API_KEY`
- Verify API key starts with `mr-`
- Re-deploy: push any change to trigger rebuild

❌ **Still showing mock data**
- Clear browser cache
- Check debug page shows "Has Mistral: true"
- Wait for new deployment to complete

❌ **Rate limit errors**
- Mistral free tier: 5 requests/minute
- Wait 1 minute between tests

The AI integration provides intelligent company search that pre-fills assessment data, making the evaluation process much faster and more accurate for users! 🚀