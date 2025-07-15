# Admin Interface Access Options

Due to GitHub Pages limitations with SPA routing in subdirectories, here are the current options to access the admin interface:

## Option 1: Direct Navigation from Home Page
1. Visit: https://percevals.github.io/Laberit-intelligence/apps/assessment-v2/
2. Click the "Admin" link in the navigation header

## Option 2: Use Hash-based URL (Workaround)
While we work on fixing the direct routing, you can bookmark this approach:
1. Visit: https://percevals.github.io/Laberit-intelligence/apps/assessment-v2/
2. Once loaded, manually change the URL in your browser to:
   https://percevals.github.io/Laberit-intelligence/apps/assessment-v2/admin
3. The React Router will handle the navigation

## Option 3: Local Development
For immediate access during development:
```bash
cd apps/assessment-v2
npm run dev
```
Then visit: http://localhost:5173/Laberit-intelligence/apps/assessment-v2/admin

## Why Direct Access Fails
GitHub Pages serves static files and doesn't have server-side routing. When you directly access `/admin`:
1. GitHub Pages looks for `/admin/index.html` (doesn't exist)
2. Returns a 404 error
3. Our 404.html redirect only works at the repository root level, not in subdirectories

## Permanent Solution Options
1. **Move to GitHub Pages with custom domain** - Allows better control over routing
2. **Use Netlify or Vercel** - Better SPA support with proper redirects
3. **Implement hash routing** - Change routes to use `#/admin` instead of `/admin`
4. **Create a separate deployment** - Deploy assessment-v2 as its own GitHub Pages site

For now, please use Option 1 (navigate from home page) to access the admin interface.