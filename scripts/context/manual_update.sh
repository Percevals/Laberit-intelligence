#!/bin/bash
# Manual context update script for testing

echo "🔄 Running manual context update..."

# Navigate to repo root
cd "$(git rev-parse --show-toplevel)"

# Run the Python updater
python3 scripts/context/update_context.py

# Show what changed
echo ""
echo "📝 Changes in context files:"
git diff --stat context/*.md

echo ""
echo "✅ Context update complete!"
echo ""
echo "To commit changes:"
echo "  git add context/*.md"
echo "  git commit -m 'Update context management files'"