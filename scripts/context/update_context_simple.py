#!/usr/bin/env python3
"""
Context Management System Updater - Simple Version
Uses git command line instead of GitPython for zero dependencies
"""

import subprocess
import json
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict
import sys

class SimpleContextUpdater:
    def __init__(self):
        self.context_dir = Path('context')
        self.since_hours = 12  # Look back 12 hours for changes
        
        # Keywords for categorizing changes
        self.breaking_keywords = ['fix', 'break', 'error', 'bug', 'critical', 'issue']
        self.feature_keywords = ['add', 'implement', 'create', 'new', 'feature', 'enhance']
        self.strategic_keywords = ['multi-language', 'spanish', 'intelligence', 'ux', 'ui', 'scenario', 'visual']
        
    def run(self):
        """Main entry point for context updates"""
        print("Starting context management update...")
        
        # Update daily log
        daily_changes = self.analyze_recent_commits()
        if daily_changes['has_changes']:
            self.update_daily_log(daily_changes)
            print("✓ Updated DAILY_LOG.md")
        else:
            print("No changes to update in DAILY_LOG.md")
        
        print("Context update completed!")
        
    def run_git_command(self, cmd):
        """Run a git command and return output"""
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            return result.stdout.strip()
        except Exception as e:
            print(f"Error running git command: {e}")
            return ""
            
    def analyze_recent_commits(self):
        """Extract meaningful information from recent commits"""
        since = datetime.now() - timedelta(hours=self.since_hours)
        since_str = since.strftime('%Y-%m-%d %H:%M:%S')
        
        # Get commits since timestamp
        commits_raw = self.run_git_command(f'git log --since="{since_str}" --pretty=format:"%H|%an|%s" --name-status')
        
        if not commits_raw:
            return {'has_changes': False}
            
        changes = {
            'has_changes': True,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'commits': [],
            'features': [],
            'fixes': [],
            'strategic_changes': [],
            'files_changed': defaultdict(set),
            'summary': ''
        }
        
        # Parse commits
        lines = commits_raw.split('\n')
        current_commit = None
        
        for line in lines:
            if '|' in line:  # Commit info line
                parts = line.split('|', 2)
                if len(parts) == 3:
                    sha, author, message = parts
                    current_commit = {
                        'sha': sha[:7],
                        'author': author,
                        'message': message
                    }
                    changes['commits'].append(current_commit)
                    
                    # Analyze commit message
                    message_lower = message.lower()
                    if any(kw in message_lower for kw in self.feature_keywords):
                        changes['features'].append(message)
                    if any(kw in message_lower for kw in self.breaking_keywords):
                        changes['fixes'].append(message)
                    if any(kw in message_lower for kw in self.strategic_keywords):
                        changes['strategic_changes'].append(message)
                        
            elif line.strip() and '\t' in line:  # File change line
                status, filepath = line.strip().split('\t', 1)
                
                # Group by component
                if 'assessment-v2' in filepath:
                    changes['files_changed']['Assessment V2'].add(filepath)
                elif 'packages/' in filepath:
                    changes['files_changed']['Core Packages'].add(filepath)
                elif 'intelligence/' in filepath:
                    changes['files_changed']['Intelligence Module'].add(filepath)
                elif '.github/' in filepath:
                    changes['files_changed']['CI/CD'].add(filepath)
                else:
                    changes['files_changed']['Other'].add(filepath)
                    
        # Generate strategic summary
        changes['summary'] = self.generate_strategic_summary(changes)
        
        return changes
        
    def generate_strategic_summary(self, changes):
        """Generate a strategic summary from changes"""
        summary_parts = []
        
        # Look for high-level patterns in commits
        has_multilang = any('multi-language' in c['message'].lower() or 'spanish' in c['message'].lower() 
                           for c in changes['commits'])
        has_intel = any('intel' in c['message'].lower() for c in changes['commits'])
        has_ux = any('ux' in c['message'].lower() or 'ui' in c['message'].lower() for c in changes['commits'])
        has_scenario = any('scenario' in c['message'].lower() for c in changes['commits'])
        
        if has_multilang:
            summary_parts.append("Multi-language Support")
        if has_intel:
            summary_parts.append("Intelligence Engine Enhancements")
        if has_ux:
            summary_parts.append("UX/UI Improvements")
        if has_scenario:
            summary_parts.append("Scenario Planning Features")
            
        if not summary_parts:
            if changes['features']:
                summary_parts.append(f"{len(changes['features'])} new features")
            if changes['fixes']:
                summary_parts.append(f"{len(changes['fixes'])} fixes")
                
        if not summary_parts:
            summary_parts.append("Minor updates and improvements")
            
        return " & ".join(summary_parts)
        
    def update_daily_log(self, changes):
        """Update the DAILY_LOG.md file with strategic focus"""
        log_file = self.context_dir / 'DAILY_LOG.md'
        
        # Read existing content
        with open(log_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check if today's entry already exists
        today_header = f"## {changes['date']}"
        if today_header in content:
            print("Today's entry already exists, skipping DAILY_LOG update")
            return
            
        # Create new entry with strategic focus
        new_entry = f"""
## {changes['date']} - {changes['summary']}

### What Changed
"""
        
        # Add strategic changes first
        if changes['strategic_changes']:
            new_entry += "**Strategic Initiatives:**\n"
            for change in changes['strategic_changes'][:3]:
                new_entry += f"- {change}\n"
            new_entry += "\n"
            
        # Add features
        if changes['features']:
            new_entry += "**New Features:**\n"
            for feature in changes['features'][:3]:
                new_entry += f"- {feature}\n"
            new_entry += "\n"
            
        # Add fixes
        if changes['fixes']:
            new_entry += "**Improvements & Fixes:**\n"
            for fix in changes['fixes'][:3]:
                new_entry += f"- {fix}\n"
            new_entry += "\n"
            
        if not changes['features'] and not changes['fixes'] and not changes['strategic_changes']:
            new_entry += "- Various code improvements and optimizations\n"
            
        new_entry += "\n### What Broke\n"
        # Look for actual breaks in commit messages
        breaks = [c['message'] for c in changes['commits'] 
                 if 'break' in c['message'].lower() or 'critical' in c['message'].lower()]
        if breaks:
            for item in breaks[:2]:
                new_entry += f"- {item}\n"
        else:
            new_entry += "- No breaking changes detected\n"
            
        new_entry += "\n### What Needs Decision\n"
        # Extract strategic decisions from context
        if 'multi-language' in changes['summary'].lower():
            new_entry += "- Additional language support priorities (Portuguese, French?)\n"
        if 'scenario' in changes['summary'].lower():
            new_entry += "- Scenario templates for different industries\n"
        if 'intelligence' in changes['summary'].lower():
            new_entry += "- AI model selection for intelligence features\n"
        else:
            new_entry += "- Review implementation priorities for next sprint\n"
            
        new_entry += "\n### Key Files Modified\n"
        for component, files in sorted(changes['files_changed'].items()):
            if files:
                new_entry += f"- **{component}**: {len(files)} files\n"
                for file in sorted(list(files))[:3]:  # Show first 3 files
                    new_entry += f"  - `{file}`\n"
                    
        new_entry += "\n### Notes for Next Session\n"
        
        # Add strategic notes based on changes
        if 'multi-language' in changes['summary'].lower():
            new_entry += "- Test Spanish translations with native speakers\n"
            new_entry += "- Verify all UI elements are properly internationalized\n"
        if 'intelligence' in changes['summary'].lower():
            new_entry += "- Monitor intelligence engine performance\n"
            new_entry += "- Validate AI-generated insights accuracy\n"
        if 'scenario' in changes['summary'].lower():
            new_entry += "- Create scenario templates for common use cases\n"
            
        new_entry += "- Review automated context updates and refine as needed\n"
        
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
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
            

if __name__ == "__main__":
    try:
        updater = SimpleContextUpdater()
        updater.run()
    except Exception as e:
        print(f"Error updating context: {e}")
        sys.exit(1)