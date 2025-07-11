# Troubleshooting Guide

## Common Issues and Solutions

### Deployment Issues

#### Problem: GitHub Pages shows 404 for all pages
**Symptoms:**
- Main site returns 404
- Quick Assessment returns 404
- Even simple HTML files return 404

**Root Cause:**
GitHub Pages was serving stale artifacts from a previous deployment system.

**Solution:**
1. Check GitHub Pages settings (Settings → Pages)
2. Ensure source is set to "GitHub Actions"
3. Run a new deployment:
   ```bash
   git commit --allow-empty -m "fix: trigger fresh deployment"
   git push origin main
   ```
4. Wait 5-10 minutes for cache to clear

#### Problem: Quick Assessment app shows at root instead of /quick-assessment/
**Symptoms:**
- Main site (/) shows Quick Assessment app
- Quick Assessment (/quick-assessment/) shows 404

**Root Cause:**
Build artifacts were incorrectly placed in root directory.

**Solution:**
1. Check for `/assets/` directory in repository root
2. Remove if present: `rm -rf assets/`
3. Verify workflow copies files in correct order
4. Rebuild and redeploy

#### Problem: Assets not loading in Quick Assessment
**Symptoms:**
- Quick Assessment page loads but no styles/functionality
- Console shows 404 for JS/CSS files

**Root Cause:**
Incorrect base path configuration in Vite.

**Solution:**
1. Check `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/Laberit-intelligence/quick-assessment/'
   })
   ```
2. Rebuild: `npm run build`
3. Verify paths in `dist/index.html`

### Build Issues

#### Problem: npm audit shows vulnerabilities
**Solution:**
```bash
# Fix automatically where possible
npm audit fix

# For breaking changes
npm audit fix --force

# Review what can't be fixed automatically
npm audit
```

#### Problem: Build fails with "out of memory"
**Solution:**
Add to build command:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Local Development Issues

#### Problem: Cannot run site locally
**Solution:**
```bash
# For main site
python3 -m http.server 8080

# For Quick Assessment development
cd quick-assessment
npm install
npm run dev
```

#### Problem: Port already in use
**Solution:**
```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 [PID]

# Or use different port
python3 -m http.server 8081
```

### Security Issues

#### Problem: Dependabot alerts for vulnerabilities
**Action Required:**
1. Review the alert details
2. Check if update breaks functionality
3. Test locally before merging
4. For critical vulnerabilities, merge immediately

#### Problem: Secrets accidentally committed
**Immediate Action:**
1. Revoke the exposed secret immediately
2. Remove from repository:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch PATH_TO_FILE" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (coordinate with team)
4. Update secret in secure location

### Performance Issues

#### Problem: Slow deployment times
**Optimization Steps:**
1. Check workflow logs for bottlenecks
2. Cache dependencies:
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
       cache-dependency-path: quick-assessment/package-lock.json
   ```
3. Optimize build process

#### Problem: Large bundle size
**Solution:**
1. Analyze bundle:
   ```bash
   npm run build -- --analyze
   ```
2. Remove unused dependencies
3. Implement code splitting
4. Use dynamic imports

### Debugging Tips

#### Enable Verbose Logging
In workflow:
```yaml
- name: Build with verbose logging
  run: |
    npm run build --verbose
  env:
    DEBUG: '*'
```

#### Check Deployment Artifacts
1. Go to Actions tab
2. Click on workflow run
3. Download artifacts from bottom of page
4. Inspect structure locally

#### Verify File Permissions
```bash
# Check file permissions
ls -la

# Fix if needed
chmod 644 *.html
chmod 755 directories/
```

### Getting Help

1. **Check Logs First**
   - GitHub Actions logs
   - Browser console
   - Build output

2. **Search Existing Issues**
   - GitHub Issues
   - Stack Overflow

3. **Create Detailed Bug Report**
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Relevant logs

### Emergency Contacts

- **Critical Security Issues**: security@laberit.com
- **Deployment Emergencies**: Create issue with `urgent` label
- **General Support**: Use GitHub Discussions

---
*Remember: Most issues can be resolved by clearing caches and running a fresh deployment.*