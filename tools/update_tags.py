"""Update book tags and priorities based on spreadsheet mapping.

This script reads the original markdown files and a spreadsheet containing
tag updates and priority assignments, then creates updated markdown files
with the new tags while preserving all other content.
"""

from __future__ import annotations

import argparse
import logging
import re
from pathlib import Path
from typing import Dict, Optional, Tuple

import pandas as pd


LOGGER_NAME = "lens_tools.update_tags"


def _default_logger() -> logging.Logger:
    logger = logging.getLogger(LOGGER_NAME)
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter("%(levelname)s: %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


def normalize_title(title: str) -> str:
    """Normalize book title for matching."""
    return re.sub(r"\s+", " ", title).strip().lower()


def load_spreadsheet_mapping(
    xlsx_path: Path,
    *,
    logger: Optional[logging.Logger] = None,
) -> Tuple[Dict[str, str], Dict[str, int]]:
    """Load tag updates and priority assignments from spreadsheet.
    
    Args:
        xlsx_path: Path to the Excel spreadsheet
        logger: Optional logger instance
        
    Returns:
        Tuple of (tag_mapping, priority_mapping)
        - tag_mapping: {normalized_title: new_tags_string}
        - priority_mapping: {normalized_title: priority_value}
    """
    logger = logger or _default_logger()
    df = pd.read_excel(xlsx_path)
    
    # Column indices:
    # A (0): Book Title
    # B (1): Author
    # D (3): Current Tags
    # E (4): Updated Tags
    # G (6): Priority
    
    tag_mapping: Dict[str, str] = {}
    priority_mapping: Dict[str, int] = {}
    
    for idx, row in df.iterrows():
        title = row.iloc[0]
        if pd.isna(title):
            continue
            
        normalized = normalize_title(str(title))
        
        # Check for tag updates (column E)
        updated_tags = row.iloc[4]
        if pd.notna(updated_tags):
            tag_mapping[normalized] = str(updated_tags).strip()
            
        # Check for priority (column G)
        priority = row.iloc[6]
        if pd.notna(priority):
            try:
                priority_mapping[normalized] = int(priority)
            except (ValueError, TypeError):
                logger.warning(f"Invalid priority value for '{title}': {priority}")
    
    logger.info(f"Loaded {len(tag_mapping)} tag updates and {len(priority_mapping)} priority assignments")
    return tag_mapping, priority_mapping


def update_markdown_file(
    input_path: Path,
    output_path: Path,
    tag_mapping: Dict[str, str],
    priority_mapping: Dict[str, int],
    *,
    logger: Optional[logging.Logger] = None,
) -> Tuple[int, int]:
    """Update tags in a markdown file based on mapping.
    
    Args:
        input_path: Source markdown file
        output_path: Destination markdown file
        tag_mapping: Dictionary of title -> new tags
        priority_mapping: Dictionary of title -> priority value
        logger: Optional logger instance
        
    Returns:
        Tuple of (tags_updated_count, priorities_added_count)
    """
    logger = logger or _default_logger()
    
    content = input_path.read_text(encoding="utf-8")
    lines = content.splitlines(keepends=True)
    
    updated_lines = []
    current_title: Optional[str] = None
    tags_updated = 0
    priorities_added = 0
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check for book title (starts with "# ")
        if line.startswith("# "):
            current_title = line[2:].strip()
            updated_lines.append(line)
            i += 1
            continue
        
        # Check for tags line
        if current_title and line.strip().startswith("**Tags:**"):
            normalized = normalize_title(current_title)
            
            # Check if we have a tag update for this book
            if normalized in tag_mapping:
                new_tags = tag_mapping[normalized]
                updated_line = f"**Tags:** {new_tags}\n"
                updated_lines.append(updated_line)
                tags_updated += 1
                logger.debug(f"Updated tags for '{current_title}': {new_tags}")
            else:
                # Keep original tags
                updated_lines.append(line)
            
            # Check if we need to add priority metadata
            if normalized in priority_mapping:
                priority = priority_mapping[normalized]
                # Add priority as metadata comment after tags
                priority_line = f"**Priority:** {priority}\n"
                updated_lines.append(priority_line)
                priorities_added += 1
                logger.debug(f"Added priority {priority} for '{current_title}'")
            
            i += 1
            continue
        
        # Keep all other lines as-is
        updated_lines.append(line)
        i += 1
    
    # Write updated content
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("".join(updated_lines), encoding="utf-8")
    
    return tags_updated, priorities_added


def update_all_files(
    input_dir: Path,
    output_dir: Path,
    spreadsheet_path: Path,
    *,
    logger: Optional[logging.Logger] = None,
) -> Dict[str, object]:
    """Update all markdown files in a directory.
    
    Args:
        input_dir: Directory containing source markdown files
        output_dir: Directory for updated markdown files
        spreadsheet_path: Path to Excel spreadsheet with mappings
        logger: Optional logger instance
        
    Returns:
        Dictionary with summary statistics
    """
    logger = logger or _default_logger()
    
    if not input_dir.exists() or not input_dir.is_dir():
        raise ValueError(f"Input directory {input_dir} does not exist or is not a directory")
    
    if not spreadsheet_path.exists():
        raise ValueError(f"Spreadsheet {spreadsheet_path} does not exist")
    
    # Load mappings from spreadsheet
    tag_mapping, priority_mapping = load_spreadsheet_mapping(
        spreadsheet_path,
        logger=logger,
    )
    
    # Process all markdown files
    files_processed = 0
    total_tags_updated = 0
    total_priorities_added = 0
    
    for input_path in sorted(input_dir.glob("book_analysis_export_*.md")):
        if not input_path.is_file():
            continue
        
        output_path = output_dir / input_path.name
        tags_updated, priorities_added = update_markdown_file(
            input_path,
            output_path,
            tag_mapping,
            priority_mapping,
            logger=logger,
        )
        
        files_processed += 1
        total_tags_updated += tags_updated
        total_priorities_added += priorities_added
        
        logger.info(
            f"Processed {input_path.name}: "
            f"{tags_updated} tags updated, {priorities_added} priorities added"
        )
    
    summary = {
        "files_processed": files_processed,
        "tags_updated": total_tags_updated,
        "priorities_added": total_priorities_added,
        "tag_updates_available": len(tag_mapping),
        "priority_assignments_available": len(priority_mapping),
    }
    
    return summary


def _parse_args(argv=None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Update book tags and priorities from spreadsheet"
    )
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=Path("lenses/raw"),
        help="Directory containing source markdown files",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("lenses/updated"),
        help="Directory for updated markdown files",
    )
    parser.add_argument(
        "--spreadsheet",
        type=Path,
        default=Path("books_kb.xlsx"),
        help="Path to Excel spreadsheet with tag updates and priorities",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging",
    )
    return parser.parse_args(argv)


def main(argv=None) -> int:
    args = _parse_args(argv)
    logger = _default_logger()
    logger.setLevel(logging.DEBUG if args.verbose else logging.INFO)
    
    try:
        summary = update_all_files(
            input_dir=args.input_dir,
            output_dir=args.output_dir,
            spreadsheet_path=args.spreadsheet,
            logger=logger,
        )
    except ValueError as exc:
        logger.error(str(exc))
        return 1
    
    logger.info(
        f"\n=== Update Complete ===\n"
        f"Files processed: {summary['files_processed']}\n"
        f"Tags updated: {summary['tags_updated']} (of {summary['tag_updates_available']} available)\n"
        f"Priorities added: {summary['priorities_added']} (of {summary['priority_assignments_available']} available)\n"
    )
    
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
