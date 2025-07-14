# Context Management System

This directory contains living documentation to maintain context across AI conversations about the DII platform.

## 🎯 Purpose

Enable any AI assistant (Claude, GPT, etc.) to quickly understand:
- Current implementation state
- Business logic and rules
- Recent changes and decisions
- Where to find specific functionality

## 📁 Files

### `CURRENT_STATE.md`
- What's built vs planned
- Active calculation logic
- Open decisions
- Recent changes affecting behavior
- Known issues and priorities

**When to update**: After significant features, breaking changes, or architectural decisions

### `BUSINESS_LOGIC.md`
- How business model detection works
- DII calculation flow with actual formulas
- Question adaptation rules
- Hardcoded values and special cases
- Score interpretation guidelines

**When to update**: When business rules change or new logic is discovered

### `DAILY_LOG.md`
- Template for daily progress tracking
- What changed, broke, and needs decisions
- Key files modified
- Notes for next session

**When to update**: End of each development session

## 🚀 Usage

When starting a new AI conversation:

1. **For general development**: Share `CURRENT_STATE.md`
2. **For business logic questions**: Share `BUSINESS_LOGIC.md`
3. **For continuing recent work**: Share relevant entry from `DAILY_LOG.md`

Example prompt:
```
I'm working on the DII assessment platform. Here's the current state and business logic:
[paste CURRENT_STATE.md]
[paste BUSINESS_LOGIC.md]

I need to implement the remaining 4 DII dimensions...
```

## 🔄 Maintenance

- Review `CURRENT_STATE.md` weekly
- Update `BUSINESS_LOGIC.md` when rules change
- Add to `DAILY_LOG.md` after each session
- Keep descriptions concise and searchable
- Include file paths for quick navigation

## 💡 Tips

- Use markdown headers for easy scanning
- Include code snippets for complex logic
- Link to specific files when mentioning features
- Note TODOs and decisions needed
- Keep a "Next Session" section in daily logs

---

*This system ensures efficient knowledge transfer and consistent context across all AI-assisted development sessions.*