# Context Management Automation

This directory contains scripts for automatically updating the context management system.

## 🤖 Automated Updates

The context management system updates automatically twice daily:
- **8:00 AM** - Morning update capturing overnight changes
- **8:00 PM** - Evening update capturing daytime work

## 📁 Scripts

### `update_context_simple.py`
Main automation script that:
- Analyzes git commits from the last 12 hours
- Extracts strategic changes and technical updates
- Updates DAILY_LOG.md with meaningful summaries
- Identifies what broke and what needs decisions
- Groups file changes by component

### `manual_update.sh`
Convenience script for manual testing:
```bash
./scripts/context/manual_update.sh
```

## 🔄 GitHub Actions Workflow

The automation runs via `.github/workflows/context-updater.yml`:
- Scheduled twice daily
- Can be manually triggered from GitHub Actions tab
- Commits changes automatically with timestamp

## 🎯 What Gets Captured

### Strategic Focus
- Multi-language support initiatives
- Intelligence engine enhancements
- UX/UI improvements
- New feature deployments
- Business logic changes

### Technical Details
- Breaking changes and critical fixes
- Files modified grouped by component
- Decisions that need to be made
- Notes for the next development session

## 🚀 Manual Usage

To run the context updater manually:

```bash
# Navigate to repository root
cd /path/to/Laberit-intelligence

# Run the updater
python3 scripts/context/update_context_simple.py

# Check what changed
git diff context/*.md

# Commit if satisfied
git add context/*.md
git commit -m "Update context management files"
```

## 🔧 Customization

The script looks for keywords to categorize changes:
- **Features**: add, implement, create, new, feature, enhance
- **Fixes**: fix, break, error, bug, critical, issue
- **Strategic**: multi-language, spanish, intelligence, ux, ui, scenario, visual

Modify these in `update_context_simple.py` to match your workflow.

## 📈 Future Enhancements

Planned improvements:
- Weekly summary generation
- Automatic CURRENT_STATE.md updates
- Business logic extraction
- Integration with project management tools
- Slack/Discord notifications

---

*The context management system ensures AI assistants always have current project context for more effective development sessions.*