# GitHub Pages Routing Fix

## Problem
GitHub Pages doesn't support client-side routing by default. When you directly access a route like `/admin`, GitHub Pages returns a 404 error because there's no physical file at that path.

## Solution
I've implemented the SPA (Single Page Application) routing fix for GitHub Pages:

1. **Created `public/404.html`**: This file intercepts all 404 errors and redirects them to the main app with the path encoded in the query string.

2. **Updated `index.html`**: Added a script that decodes the path from the query string and updates the browser history so React Router can handle the routing.

3. **Updated build script**: Modified `package.json` to copy `index.html` to `404.html` after building, ensuring both files have the same content in production.

## How it Works
1. User visits `https://percevals.github.io/Laberit-intelligence/apps/assessment-v2/admin/`
2. GitHub Pages doesn't find `/admin/index.html`, so it serves the `404.html` page
3. The `404.html` script redirects to `/?/admin`
4. The `index.html` script detects the `?/admin` pattern and converts it back to `/admin`
5. React Router takes over and renders the correct component

## Deployment Steps
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to GitHub Pages

3. The admin interface will be accessible at:
   - Home: `https://percevals.github.io/Laberit-intelligence/apps/assessment-v2/`
   - Admin: `https://percevals.github.io/Laberit-intelligence/apps/assessment-v2/admin/`

## Important Notes
- The `pathSegmentsToKeep` value in `404.html` is set to 3 to preserve `/Laberit-intelligence/apps/assessment-v2`
- This solution works for all routes in your React application
- No server-side configuration is needed