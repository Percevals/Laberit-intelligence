# Mistral AI Integration Setup Guide

## Step 1: Get Your Free Mistral API Key

1. Go to [Mistral Console](https://console.mistral.ai/)
2. Create a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key (starts with `mr-...`)

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the assessment-v2 directory:
```bash
cd apps/assessment-v2
touch .env.local
```

2. Add your Mistral API key to `.env.local`:
```env
VITE_MISTRAL_API_KEY=mr-your-actual-api-key-here
```

**Important**: `.env.local` is automatically ignored by git, so your API key stays secure.

## Step 3: Test the Integration

1. Start the development server:
```bash
npm run dev
```

2. Open the assessment app in your browser
3. Go to company search and try searching for a real company
4. Check the browser console - you should see messages like:
   - `Searching with Mistral AI...`
   - `Company search completed using Mistral AI in XXXms`

## How It Works

The system automatically:

1. **Prioritizes Mistral**: If you have a Mistral API key, it becomes the primary provider
2. **Falls back gracefully**: If Mistral fails, it uses Mock data in development
3. **Caches results**: Successful searches are cached for 1 hour
4. **Respects rate limits**: Free tier allows 5 requests per minute
5. **Shows AI health**: Green dot indicates Mistral is working

## AI Health Indicator

- 🟢 **Green (pulsing)**: Mistral AI is active and working
- 🟡 **Yellow**: Using cached data or fallback
- 🔴 **Red**: Manual entry only (no AI available)

## Free Tier Limits

Mistral free tier includes:
- **5 requests per minute**
- **mistral-small-latest model**
- **No cost** for basic usage

## Adding More Providers

To add OpenAI as a secondary provider, add to `.env.local`:
```env
VITE_MISTRAL_API_KEY=mr-your-mistral-key
VITE_OPENAI_API_KEY=sk-your-openai-key
```

The system will try Mistral first, then OpenAI if Mistral fails.

## Troubleshooting

### "No results found"
- Check your API key is correct
- Verify you have internet connection
- Check browser console for errors

### "Rate limit exceeded"
- Wait 1 minute and try again
- Consider upgrading to Mistral paid tier

### API Key not working
- Ensure the key starts with `mr-`
- Check it's properly set in `.env.local`
- Restart the development server after adding the key

## Success Indicators

When working correctly, you should see:
1. ✅ Real company data returned from searches
2. ✅ Green AI health indicator
3. ✅ Console logs showing "Mistral AI" as provider
4. ✅ Enhanced company information with confidence scores

The AI will help find companies, enhance missing data, and suggest business models based on industry analysis.