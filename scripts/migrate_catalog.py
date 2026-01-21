#!/usr/bin/env python3
"""
Migration script to import existing lens content from ai-strengths repo.

Reads: /Users/adam/coding/ai-strengths/lenses/generated/catalog.json
Writes to: Supabase database

Usage:
  1. Create .env file with SUPABASE_URL and SUPABASE_SERVICE_KEY
  2. Run: python scripts/migrate_catalog.py
"""

import json
import os
import re
import time
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Path to catalog
CATALOG_PATH = Path("/Users/adam/coding/ai-strengths/lenses/generated/catalog.json")

# Rate limiting - add delay between API calls
API_DELAY = 0.1  # 100ms between calls


def api_call_with_retry(func, max_retries=3, initial_delay=1):
    """Execute an API call with retry logic."""
    for attempt in range(max_retries):
        try:
            time.sleep(API_DELAY)  # Rate limiting
            return func()
        except Exception as e:
            if attempt < max_retries - 1:
                delay = initial_delay * (2 ** attempt)  # Exponential backoff
                print(f"    API error, retrying in {delay}s: {str(e)[:100]}")
                time.sleep(delay)
            else:
                raise


def slugify(text: str) -> str:
    """Convert text to slug format."""
    slug = text.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    return slug


def parse_themes(body: str) -> list[dict]:
    """
    Extract themes from the markdown body.
    
    Themes look like:
    ### Theme 1: Customer as Hero
    **Explanation:** ...
    **Examples:** ...
    """
    themes = []
    
    # Pattern to match theme sections
    theme_pattern = r'### Theme \d+: ([^\n]+)\n\*\*Explanation:\*\* ([^\n]+)\n\*\*Examples:\*\* ([^\n]+)'
    
    matches = re.findall(theme_pattern, body)
    
    for i, (title, explanation, examples) in enumerate(matches):
        themes.append({
            "title": f"Theme {i+1}: {title.strip()}",
            "explanation": explanation.strip(),
            "examples": examples.strip(),
            "display_order": i + 1  # 0 is for summary
        })
    
    return themes


def parse_summary(body: str) -> str:
    """Extract the summary section from markdown body."""
    # Summary is between "## Summary" and "## Theme Analysis"
    summary_match = re.search(
        r'## Summary\n\n(.*?)(?=\n## Theme Analysis|\n---|\Z)',
        body,
        re.DOTALL
    )
    
    if summary_match:
        return summary_match.group(1).strip()
    
    # Fallback: return everything before first theme
    theme_start = body.find("### Theme")
    if theme_start > 0:
        return body[:theme_start].strip()
    
    return body.strip()


def get_existing_data():
    """Fetch existing data to enable resume functionality."""
    print("Checking for existing data...")
    
    # Get existing tags
    tags_result = api_call_with_retry(
        lambda: supabase.table('tags').select('id, slug').execute()
    )
    tag_cache = {t['slug']: t['id'] for t in tags_result.data}
    print(f"  Found {len(tag_cache)} existing tags")
    
    # Get existing content units
    units_result = api_call_with_retry(
        lambda: supabase.table('content_units').select('id, title, author').execute()
    )
    processed_books = {f"{u['title']}|{u['author']}": u['id'] for u in units_result.data}
    print(f"  Found {len(processed_books)} existing content units")
    
    # Get existing tag assignments
    assignments_result = api_call_with_retry(
        lambda: supabase.table('content_unit_tags').select('content_unit_id, tag_id').execute()
    )
    existing_assignments = {(a['content_unit_id'], a['tag_id']) for a in assignments_result.data}
    print(f"  Found {len(existing_assignments)} existing tag assignments")
    
    return tag_cache, processed_books, existing_assignments


def migrate():
    """Main migration function."""
    print(f"Loading catalog from {CATALOG_PATH}")
    
    with open(CATALOG_PATH, 'r') as f:
        catalog = json.load(f)
    
    # Get existing data for resume capability
    tag_cache, processed_books, existing_assignments = get_existing_data()
    
    stats = {
        "tags_created": 0,
        "tags_skipped": 0,
        "content_units_created": 0,
        "content_units_skipped": 0,
        "components_created": 0,
        "tag_assignments_created": 0,
        "tag_assignments_skipped": 0,
    }
    
    print(f"\nFound {len(catalog['tags'])} tags in catalog")
    
    # First pass: create all tags
    print("\n--- Creating tags ---")
    for tag_data in catalog['tags']:
        tag_name = tag_data['name']
        tag_slug = tag_data['slug']
        
        if tag_slug not in tag_cache:
            result = api_call_with_retry(
                lambda tn=tag_name, ts=tag_slug: supabase.table('tags').insert({
                    "name": tn,
                    "slug": ts,
                }).execute()
            )
            
            tag_id = result.data[0]['id']
            tag_cache[tag_slug] = tag_id
            stats["tags_created"] += 1
            print(f"  Created tag: {tag_name}")
        else:
            stats["tags_skipped"] += 1
    
    print(f"\nTags: {stats['tags_created']} created, {stats['tags_skipped']} already existed")
    
    # Second pass: create content units and components
    print("\n--- Processing books ---")
    total_books = sum(len(t['books']) for t in catalog['tags'])
    processed_count = 0
    
    for tag_data in catalog['tags']:
        tag_slug = tag_data['slug']
        tag_id = tag_cache[tag_slug]
        
        for book in tag_data['books']:
            processed_count += 1
            title = book['title']
            author = book['author']
            book_key = f"{title}|{author}"
            
            # Check if we've already processed this book
            if book_key in processed_books:
                content_unit_id = processed_books[book_key]
                stats["content_units_skipped"] += 1
            else:
                # Create new content unit
                body = book.get('body', '')
                sources = book.get('sources', [])
                
                # Create content unit
                result = api_call_with_retry(
                    lambda t=title, a=author, s=sources: supabase.table('content_units').insert({
                        "title": t,
                        "author": a,
                        "source_type": "book",
                        "source_files": s,
                        "status": "published",
                    }).execute()
                )
                
                content_unit_id = result.data[0]['id']
                processed_books[book_key] = content_unit_id
                stats["content_units_created"] += 1
                
                # Parse and create summary component
                summary = parse_summary(body)
                if summary:
                    api_call_with_retry(
                        lambda cuid=content_unit_id, s=summary: supabase.table('content_components').insert({
                            "content_unit_id": cuid,
                            "component_type": "summary",
                            "title": "Summary",
                            "content": s,
                            "display_order": 0,
                        }).execute()
                    )
                    stats["components_created"] += 1
                
                # Parse and create theme components
                themes = parse_themes(body)
                for theme in themes:
                    api_call_with_retry(
                        lambda cuid=content_unit_id, th=theme: supabase.table('content_components').insert({
                            "content_unit_id": cuid,
                            "component_type": "theme",
                            "title": th["title"],
                            "content": f"**Explanation:** {th['explanation']}\n\n**Examples:** {th['examples']}",
                            "explanation": th["explanation"],
                            "examples": th["examples"],
                            "display_order": th["display_order"],
                        }).execute()
                    )
                    stats["components_created"] += 1
                
                print(f"  [{processed_count}/{total_books}] Created: {title} by {author} ({len(themes)} themes)")
            
            # Create tag assignment if it doesn't exist
            if (content_unit_id, tag_id) not in existing_assignments:
                # Determine weight based on priority marker
                body = book.get('body', '')
                has_priority = '**Priority: 1**' in body or '**Priority:** 1' in body
                weight = 3 if has_priority else 1
                
                api_call_with_retry(
                    lambda cuid=content_unit_id, tid=tag_id, w=weight: supabase.table('content_unit_tags').insert({
                        "content_unit_id": cuid,
                        "tag_id": tid,
                        "weight": w,
                    }).execute()
                )
                existing_assignments.add((content_unit_id, tag_id))
                stats["tag_assignments_created"] += 1
            else:
                stats["tag_assignments_skipped"] += 1
    
    print("\n" + "="*50)
    print("Migration Complete!")
    print("="*50)
    print(f"Tags:            {stats['tags_created']} created, {stats['tags_skipped']} skipped")
    print(f"Content units:   {stats['content_units_created']} created, {stats['content_units_skipped']} skipped")
    print(f"Components:      {stats['components_created']} created")
    print(f"Tag assignments: {stats['tag_assignments_created']} created, {stats['tag_assignments_skipped']} skipped")


if __name__ == "__main__":
    migrate()
