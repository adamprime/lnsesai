"""Fix abbreviated tag names to be human-readable.

This script updates tags in the updated markdown files to use
full, human-readable names instead of abbreviations.
"""

from pathlib import Path
import re

# Mapping of abbreviated tags to human-readable names
TAG_FIXES = {
    "OD": "Organizational Development",
    "OD HR": "Human Resources",
    "Should be Influence": "Influence",
}

def fix_tags_in_file(file_path: Path) -> int:
    """Fix tag names in a single markdown file.
    
    Returns the number of tags fixed.
    """
    content = file_path.read_text(encoding="utf-8")
    original_content = content
    fixes_made = 0
    
    for old_tag, new_tag in TAG_FIXES.items():
        # Pattern to match the entire Tags line
        pattern = r'\*\*Tags:\*\*\s+(.+?)(?:\n|$)'
        
        def replace_tag(match):
            nonlocal fixes_made
            tags_str = match.group(1).strip()
            # Replace the old tag with new tag (handles word boundaries)
            new_tags_str = re.sub(rf'\b{re.escape(old_tag)}\b', new_tag, tags_str)
            if tags_str != new_tags_str:
                fixes_made += 1
            return f'**Tags:** {new_tags_str}\n'
        
        content = re.sub(pattern, replace_tag, content)
    
    if content != original_content:
        file_path.write_text(content, encoding="utf-8")
    
    return fixes_made

def main():
    updated_dir = Path("lenses/updated")
    
    if not updated_dir.exists():
        print(f"Error: {updated_dir} does not exist. Run update_tags.py first.")
        return 1
    
    total_fixes = 0
    files_modified = 0
    
    for md_file in sorted(updated_dir.glob("book_analysis_export_*.md")):
        fixes = fix_tags_in_file(md_file)
        if fixes > 0:
            files_modified += 1
            total_fixes += fixes
            print(f"✓ {md_file.name}: {fixes} tags fixed")
    
    print(f"\nSummary:")
    print(f"  Files modified: {files_modified}")
    print(f"  Total tags fixed: {total_fixes}")
    print(f"\nTag mappings applied:")
    for old, new in TAG_FIXES.items():
        print(f"  '{old}' → '{new}'")
    
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
