# GitHub Pages AI Integration Setup

## The Problem
GitHub Pages doesn't support environment variables at build time, so your `VITE_MISTRAL_API_KEY` isn't available in the deployed app.

## Solution Options

### Option 1: GitHub Secrets + Actions (Recommended)

1. **Add your API key as a GitHub Secret:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VITE_MISTRAL_API_KEY`
   - Value: `mr-your-actual-api-key`

2. **Update GitHub Actions workflow** (if you have one):
   ```yaml
   # .github/workflows/deploy.yml
   - name: Build
     run: npm run build
     env:
       VITE_MISTRAL_API_KEY: ${{ secrets.VITE_MISTRAL_API_KEY }}
   ```

### Option 2: Runtime Configuration (Quick Fix)

Add this to your `index.html` before the script tags:

```html
<!-- Add before </head> tag in apps/assessment-v2/index.html -->
<script>
  window.__AI_CONFIG__ = {
    VITE_MISTRAL_API_KEY: 'mr-your-actual-api-key-here'
  };
</script>
```

**⚠️ Security Warning:** This exposes your API key in the browser. Only use for testing!

### Option 3: Environment-specific Build

Create different builds for different environments:

```bash
# For local development
VITE_MISTRAL_API_KEY=mr-your-key npm run build

# For GitHub Pages (you'll need a deployment script)
echo "VITE_MISTRAL_API_KEY=mr-your-key" > .env.production
npm run build
```

## Verification Steps

1. **Check the browser console** in GitHub Pages for:
   ```
   AI Configuration: {env: "production", hasMistral: true, hasOpenAI: false, useMock: false}
   ```

2. **Test company search** - should see:
   ```
   Searching with Mistral AI...
   Company search completed using Mistral AI in XXXms
   ```

3. **AI Health Indicator** should show:
   - 🟢 Green dot (pulsing) when working
   - In the search input field (right side)
   - In company confirmation page (top-right)

## Debugging

If it's not working in GitHub Pages:

1. **Open browser console** and check for:
   - `AI Configuration:` log
   - Any error messages
   - Network requests to `api.mistral.ai`

2. **Check AI Health Indicator:**
   - 🟢 = Mistral working
   - 🟡 = Cache/fallback
   - 🔴 = No AI available

3. **Test locally first:**
   ```bash
   # Make sure it works locally
   echo "VITE_MISTRAL_API_KEY=mr-your-key" > .env.local
   npm run dev
   ```

## Common Issues

### "No AI provider available"
- API key not properly set in GitHub Pages
- Wrong API key format (should start with `mr-`)

### "Rate limit exceeded"  
- Free tier: 5 requests/minute
- Wait 1 minute between tests

### "CORS errors"
- Mistral API should work from browser
- Check if your API key is valid

## Success Indicators

✅ **Working correctly when you see:**
1. Green AI health indicator
2. Real company data in search results  
3. Console shows "Mistral AI" as provider
4. No 401/403 errors in Network tab

The AI integration provides intelligent company search and enhances the assessment with real business data!