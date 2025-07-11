# Deployment Guide - DevSecOps Best Practices

## Overview

This guide documents the deployment architecture and security practices for the Laberit Intelligence platform, following DevSecOps principles.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     GitHub Repository                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Main Site  │  │Quick Assess │  │ Intel Reports   │ │
│  │  (Static)    │  │  (React)    │  │   (Static)      │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ Push to main
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  GitHub Actions Workflow                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Security   │  │    Build    │  │     Deploy      │ │
│  │   Checks     │  │   Process   │  │   to Pages      │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                          │
│         https://percevals.github.io/Laberit-intelligence │
└─────────────────────────────────────────────────────────┘
```

## DevSecOps Pipeline

### 1. Development Phase (Shift Left Security)

**Security Controls:**
- Pre-commit hooks for secret scanning
- IDE security plugins recommended
- Local dependency scanning

**Developer Checklist:**
```bash
# Before committing
npm audit                    # Check for vulnerabilities
npm run lint                 # Code quality
npm run test                 # Run tests
git diff --name-only        # Review changed files
```

### 2. Source Control Security

**Branch Protection Rules:**
- Main branch protected
- Require pull request reviews
- Dismiss stale reviews
- Require up-to-date branches

**Git Security:**
```bash
# Configure git to sign commits
git config --global user.signingkey YOUR_GPG_KEY
git config --global commit.gpgsign true

# Verify commits
git log --show-signature
```

### 3. CI/CD Pipeline Security

**Workflow Permissions (Principle of Least Privilege):**
```yaml
permissions:
  contents: read      # Read repository
  pages: write       # Deploy to Pages
  id-token: write    # OIDC token for deployment
```

**Secure Build Process:**
1. **Dependency Installation**: Using `npm ci` (not `npm install`)
2. **Build Isolation**: Each build in fresh environment
3. **Artifact Verification**: Build outputs verified before deployment

### 4. Deployment Security

**Deployment Workflow (`deploy-pages.yml`):**
```yaml
# Key security features:
- uses: actions/checkout@v4         # Pinned version
- uses: actions/setup-node@v4       # Pinned version
- run: npm ci                       # Reproducible installs
- uses: actions/configure-pages@v4  # Official GitHub action
- uses: actions/deploy-pages@v4     # Official deployment
```

**Environment Protection:**
- Production environment requires approval
- Deployment history tracked
- Rollback capability maintained

### 5. Runtime Security

**Content Security:**
- `.nojekyll` prevents directory traversal
- No server-side code execution
- Static hosting eliminates many attack vectors

**Client-Side Security:**
- React's XSS protections
- No inline scripts
- External resources validated

## Security Monitoring

### Automated Scanning

1. **Dependency Scanning**:
   ```yaml
   - name: Audit Dependencies
     run: |
       npm audit --audit-level=moderate
       if [ $? -ne 0 ]; then
         echo "Security vulnerabilities found!"
         exit 1
       fi
   ```

2. **Secret Scanning**:
   - GitHub secret scanning enabled
   - Custom patterns for API keys

3. **Code Analysis**:
   - CodeQL analysis for JavaScript
   - SAST scanning on pull requests

### Manual Security Reviews

**Quarterly Reviews:**
- [ ] Dependency updates
- [ ] Access control audit
- [ ] Security configuration review
- [ ] Incident response test

## Incident Response Plan

### Detection
- GitHub security alerts
- Dependabot notifications
- User reports

### Response Process
1. **Assess** - Determine severity and scope
2. **Contain** - Disable affected features if needed
3. **Remediate** - Fix vulnerability
4. **Deploy** - Emergency deployment process
5. **Review** - Post-incident analysis

### Emergency Deployment
```bash
# For critical security fixes
git checkout -b security-fix-YYYY-MM-DD
# Make fixes
git add .
git commit -m "security: critical fix for CVE-XXXX-XXXXX"
git push origin security-fix-YYYY-MM-DD
# Create PR with security label
gh pr create --title "Security Fix" --label security
```

## Compliance & Audit

### Audit Trail
- All deployments logged in GitHub Actions
- Commit history preserved
- Access logs available

### Compliance Checklist
- [x] HTTPS only deployment
- [x] No sensitive data in repository
- [x] Automated security scanning
- [x] Access control implemented
- [x] Incident response plan
- [x] Regular security reviews

## Best Practices Summary

### Do's ✅
- Use official GitHub Actions
- Pin action versions
- Scan dependencies regularly
- Review security alerts promptly
- Document security decisions
- Use environment variables for config
- Enable 2FA for all contributors

### Don'ts ❌
- Never commit secrets
- Don't use deprecated dependencies
- Avoid custom deployment scripts
- Don't ignore security warnings
- Never bypass security checks
- Don't grant excessive permissions

## Security Contacts

- Security Team: security@laberit.com
- GitHub Security Advisories: [Create private advisory](https://github.com/Percevals/Laberit-intelligence/security/advisories/new)

## References

- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---
*Last Updated: July 2025*
*Next Review: October 2025*