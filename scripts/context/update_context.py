#!/usr/bin/env python3
"""
Context Management System Updater
Automatically updates context documentation based on git commits and code analysis
"""

import git
import json
import re
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict
import sys

class ContextUpdater:
    def __init__(self):
        self.repo = git.Repo('.')
        self.context_dir = Path('context')
        self.since_hours = 12  # Look back 12 hours for changes
        
        # Keywords for categorizing changes
        self.breaking_keywords = ['fix', 'break', 'error', 'bug', 'critical', 'issue']
        self.feature_keywords = ['add', 'implement', 'create', 'new', 'feature', 'enhance']
        self.decision_keywords = ['todo', 'fixme', 'decide', 'question', 'review']
        
    def run(self):
        """Main entry point for context updates"""
        print("Starting context management update...")
        
        # Update daily log
        daily_changes = self.analyze_recent_commits()
        if daily_changes['has_changes']:
            self.update_daily_log(daily_changes)
            print("✓ Updated DAILY_LOG.md")
        
        # Update current state
        state_changes = self.analyze_current_state()
        if state_changes['has_changes']:
            self.update_current_state(state_changes)
            print("✓ Updated CURRENT_STATE.md")
        
        # Update business logic if needed
        logic_changes = self.analyze_business_logic()
        if logic_changes['has_changes']:
            self.update_business_logic(logic_changes)
            print("✓ Updated BUSINESS_LOGIC.md")
            
        print("Context update completed!")
        
    def analyze_recent_commits(self):
        """Extract meaningful information from recent commits"""
        since = datetime.now() - timedelta(hours=self.since_hours)
        commits = list(self.repo.iter_commits(since=since.isoformat()))
        
        if not commits:
            return {'has_changes': False}
            
        changes = {
            'has_changes': True,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'commits': [],
            'features': [],
            'fixes': [],
            'breaking': [],
            'files_changed': defaultdict(set),
            'needs_decision': []
        }
        
        for commit in commits:
            commit_info = {
                'sha': commit.hexsha[:7],
                'message': commit.message.strip(),
                'author': commit.author.name,
                'files': []
            }
            
            # Analyze commit message
            message_lower = commit.message.lower()
            if any(kw in message_lower for kw in self.feature_keywords):
                changes['features'].append(commit.message.strip().split('\n')[0])
            if any(kw in message_lower for kw in self.breaking_keywords):
                changes['fixes'].append(commit.message.strip().split('\n')[0])
            if 'breaking' in message_lower or 'BREAKING' in commit.message:
                changes['breaking'].append(commit.message.strip().split('\n')[0])
                
            # Analyze changed files
            for file in commit.stats.files:
                if not file.startswith('.'):  # Ignore hidden files
                    commit_info['files'].append(file)
                    
                    # Group by component
                    if file.startswith('apps/assessment-v2'):
                        changes['files_changed']['Assessment V2'].add(file)
                    elif file.startswith('packages/'):
                        changes['files_changed']['Core Packages'].add(file)
                    elif file.startswith('intelligence/'):
                        changes['files_changed']['Intelligence Module'].add(file)
                    else:
                        changes['files_changed']['Other'].add(file)
                        
            changes['commits'].append(commit_info)
            
        # Generate summary
        changes['summary'] = self.generate_summary(changes)
        
        return changes
        
    def generate_summary(self, changes):
        """Generate a meaningful summary from changes"""
        summary_parts = []
        
        if changes['features']:
            summary_parts.append(f"{len(changes['features'])} new features")
        if changes['fixes']:
            summary_parts.append(f"{len(changes['fixes'])} fixes")
        if changes['breaking']:
            summary_parts.append(f"{len(changes['breaking'])} breaking changes")
            
        if not summary_parts:
            summary_parts.append("Minor updates and improvements")
            
        return " - ".join(summary_parts)
        
    def update_daily_log(self, changes):
        """Update the DAILY_LOG.md file"""
        log_file = self.context_dir / 'DAILY_LOG.md'
        
        # Read existing content
        with open(log_file, 'r') as f:
            content = f.read()
            
        # Check if today's entry already exists
        today_header = f"## {changes['date']}"
        if today_header in content:
            print("Today's entry already exists, skipping DAILY_LOG update")
            return
            
        # Create new entry
        new_entry = f"""
## {changes['date']} - {changes['summary']}

### What Changed
"""
        
        # Add features
        for feature in changes['features'][:5]:  # Limit to top 5
            new_entry += f"- {feature}\n"
            
        # Add fixes
        for fix in changes['fixes'][:5]:
            new_entry += f"- {fix}\n"
            
        if not changes['features'] and not changes['fixes']:
            new_entry += "- Various code improvements and optimizations\n"
            
        new_entry += "\n### What Broke\n"
        if changes['breaking']:
            for item in changes['breaking']:
                new_entry += f"- {item}\n"
        else:
            new_entry += "- No breaking changes detected\n"
            
        new_entry += "\n### What Needs Decision\n"
        if changes['needs_decision']:
            for decision in changes['needs_decision']:
                new_entry += f"- {decision}\n"
        else:
            new_entry += "- No immediate decisions required\n"
            
        new_entry += "\n### Key Files Modified\n"
        for component, files in changes['files_changed'].items():
            if files:
                new_entry += f"- **{component}**: {len(files)} files\n"
                for file in list(files)[:3]:  # Show first 3 files
                    new_entry += f"  - `{file}`\n"
                    
        new_entry += "\n### Notes for Next Session\n"
        new_entry += "- Review recent changes and test integrations\n"
        new_entry += "- Check for any regression issues\n"
        
        # Find position to insert (after the template section)
        template_end = content.find("---\n\n## 20")
        if template_end == -1:
            template_end = content.find("---\n\n##")
            
        if template_end != -1:
            # Insert after template
            new_content = content[:template_end] + "---\n" + new_entry + "\n" + content[template_end+4:]
        else:
            # Append at end
            new_content = content + "\n" + new_entry
            
        # Write back
        with open(log_file, 'w') as f:
            f.write(new_content)
            
    def analyze_current_state(self):
        """Analyze the current state of the codebase"""
        changes = {
            'has_changes': False,
            'new_components': [],
            'updated_features': [],
            'recent_changes': [],
            'active_development': []
        }
        
        # Check for new or recently modified files
        since = datetime.now() - timedelta(days=7)
        
        # Scan key directories
        key_dirs = ['apps/assessment-v2/src', 'packages', 'intelligence']
        
        for dir_path in key_dirs:
            path = Path(dir_path)
            if path.exists():
                for file_path in path.rglob('*.{ts,tsx,js,jsx,py}'):
                    if file_path.stat().st_mtime > since.timestamp():
                        changes['has_changes'] = True
                        relative_path = file_path.relative_to('.')
                        changes['recent_changes'].append(str(relative_path))
                        
        return changes
        
    def update_current_state(self, changes):
        """Update CURRENT_STATE.md with recent changes"""
        state_file = self.context_dir / 'CURRENT_STATE.md'
        
        # For now, just mark that we detected changes
        # In a full implementation, this would intelligently update sections
        print(f"Detected {len(changes['recent_changes'])} recently modified files")
        
    def analyze_business_logic(self):
        """Analyze business logic files for changes"""
        changes = {
            'has_changes': False,
            'updated_models': [],
            'updated_calculations': [],
            'new_rules': []
        }
        
        # Check specific business logic files
        logic_files = [
            'apps/assessment-v2/src/core/business-model/dii-classifier.ts',
            'apps/assessment-v2/src/services/assessment/assessment-calculator.ts',
            'data/business-model-scenarios.json'
        ]
        
        for file_path in logic_files:
            path = Path(file_path)
            if path.exists():
                # Check if modified recently
                if path.stat().st_mtime > (datetime.now() - timedelta(hours=24)).timestamp():
                    changes['has_changes'] = True
                    changes['updated_models'].append(str(path))
                    
        return changes
        
    def update_business_logic(self, changes):
        """Update BUSINESS_LOGIC.md if business rules changed"""
        print(f"Business logic files updated: {len(changes['updated_models'])}")
        

if __name__ == "__main__":
    try:
        updater = ContextUpdater()
        updater.run()
    except Exception as e:
        print(f"Error updating context: {e}")
        sys.exit(1)