# Build Error Fix

## Issue
The GitHub Actions workflow failed during the "Build Quick Assessment" step with:
```
Error: Process completed with exit code 1
Line 33 at Array.blockStatement (file:///home/runner/work/Laberit-intelligence/quick-assessment/node_modules/rollup/dist/es/shared/node-entry.js:15690:21)
```

## Root Cause
In `src/services/ai/providers/OfflineProvider.js`, the variable `modelId` was declared twice in the same function scope:
- First declaration at line 287
- Second declaration at line 328

This caused a JavaScript syntax error: "Identifier 'modelId' has already been declared"

## Solution
Removed the duplicate variable declaration at line 328 and reused the existing `modelId` variable that was already declared and assigned at the beginning of the function.

## Changes Made
```diff
- const modelId = Object.keys(this.riskProfiles).find(
-   key => this.riskProfiles[key].name === profile.name
- );
+ // modelId was already declared above, reuse it
```

## Verification
- Build now completes successfully
- Output: `✓ built in 944ms`
- No other build errors detected