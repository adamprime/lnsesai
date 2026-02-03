"""Split multi-book markdown files into individual source files.

This script reads the raw lenses export files (which contain multiple books per file)
and creates individual markdown files for each book/article, plus a CSV overview.
"""

from __future__ import annotations

import argparse
import csv
import logging
import re
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional


LOGGER_NAME = "lens_tools.split_sources"


def _default_logger() -> logging.Logger:
    logger = logging.getLogger(LOGGER_NAME)
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter("%(levelname)s: %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


def slugify(text: str) -> str:
    """Create a filename-safe slug from text."""
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower())
    slug = slug.strip("-")
    # Limit length for filesystem compatibility
    if len(slug) > 80:
        slug = slug[:80].rsplit("-", 1)[0]
    return slug or "untitled"


@dataclass
class SourceEntry:
    """Represents a single book or article entry."""
    title: str
    author: Optional[str]
    tags: Optional[str]
    content: str
    source_file: str
    word_count: int
    char_count: int
    has_summary: bool
    has_themes: bool
    theme_count: int
    
    @property
    def slug(self) -> str:
        """Generate a slug for the filename."""
        author_part = slugify(self.author or "unknown")[:20]
        title_part = slugify(self.title)[:50]
        return f"{author_part}--{title_part}"


AUTHOR_PATTERN = re.compile(r"^\*\*Author:\*\*\s*(.+)$", re.IGNORECASE | re.MULTILINE)
TAGS_PATTERN = re.compile(r"^\*\*Tags:\*\*\s*(.+)$", re.IGNORECASE | re.MULTILINE)


def count_words(text: str) -> int:
    """Count words in text."""
    return len(text.split())


def parse_markdown_file(path: Path, *, logger: logging.Logger) -> List[SourceEntry]:
    """Parse a multi-book markdown file into individual SourceEntry objects."""
    content = path.read_text(encoding="utf-8")
    lines = content.splitlines(keepends=True)
    
    entries: List[SourceEntry] = []
    current_title: Optional[str] = None
    buffer: List[str] = []
    
    def flush_buffer() -> None:
        nonlocal current_title, buffer
        if current_title is None or not buffer:
            return
        
        block_content = "".join(buffer)
        
        # Skip header blocks (like "Book Analysis and Theme Extraction Report")
        if "Total books analyzed:" in block_content and len(buffer) < 20:
            logger.debug(f"Skipping header block: {current_title}")
            return
        
        # Extract metadata
        author_match = AUTHOR_PATTERN.search(block_content)
        author = author_match.group(1).strip() if author_match else None
        
        tags_match = TAGS_PATTERN.search(block_content)
        tags = tags_match.group(1).strip() if tags_match else None
        
        # Analyze content
        has_summary = "## comprehensive summary" in block_content.lower() or "## summary" in block_content.lower()
        has_themes = "## theme" in block_content.lower() or "## detailed theme" in block_content.lower()
        
        # Count themes (look for "### Theme N:" patterns)
        theme_count = len(re.findall(r"###\s*Theme\s*\d+", block_content, re.IGNORECASE))
        
        # Full content for the individual file (include the title)
        full_content = f"# {current_title}\n{''.join(buffer)}"
        
        entry = SourceEntry(
            title=current_title,
            author=author,
            tags=tags,
            content=full_content,
            source_file=path.name,
            word_count=count_words(full_content),
            char_count=len(full_content),
            has_summary=has_summary,
            has_themes=has_themes,
            theme_count=theme_count,
        )
        entries.append(entry)
        logger.debug(f"Parsed: '{current_title}' by {author} ({entry.word_count} words)")
    
    for line in lines:
        # Check for book title (single #, not ## or ###)
        if line.startswith("# ") and not line.startswith("## "):
            flush_buffer()
            current_title = line[2:].strip()
            buffer = []
        else:
            if current_title is not None:
                buffer.append(line)
    
    # Don't forget the last entry
    flush_buffer()
    
    return entries


def process_directory(
    input_dir: Path,
    output_dir: Path,
    csv_path: Path,
    *,
    overwrite: bool = False,
    logger: Optional[logging.Logger] = None,
) -> dict:
    """Process all markdown files and create individual source files + CSV."""
    logger = logger or _default_logger()
    
    if not input_dir.exists() or not input_dir.is_dir():
        raise ValueError(f"Input directory {input_dir} does not exist or is not a directory")
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    all_entries: List[SourceEntry] = []
    files_processed = 0
    
    # Process all markdown files
    for path in sorted(input_dir.glob("*.md")):
        if not path.is_file():
            continue
        files_processed += 1
        entries = parse_markdown_file(path, logger=logger)
        all_entries.extend(entries)
        logger.info(f"Parsed {path.name}: {len(entries)} sources")
    
    # Deduplicate by title+author (keep first occurrence)
    seen = set()
    unique_entries: List[SourceEntry] = []
    duplicates = 0
    
    for entry in all_entries:
        key = (entry.title.lower(), (entry.author or "").lower())
        if key not in seen:
            seen.add(key)
            unique_entries.append(entry)
        else:
            duplicates += 1
            logger.debug(f"Duplicate skipped: '{entry.title}' by {entry.author}")
    
    # Write individual markdown files
    files_written = 0
    for entry in unique_entries:
        output_path = output_dir / f"{entry.slug}.md"
        
        # Handle filename collisions
        if output_path.exists() and not overwrite:
            counter = 2
            while output_path.exists():
                output_path = output_dir / f"{entry.slug}-{counter}.md"
                counter += 1
        
        output_path.write_text(entry.content, encoding="utf-8")
        files_written += 1
    
    logger.info(f"Wrote {files_written} individual source files to {output_dir}")
    
    # Write CSV overview
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Status",
            "Title",
            "Author",
            "Tags",
            "Word Count",
            "Character Count",
            "Has Summary",
            "Has Themes",
            "Theme Count",
            "Source File",
            "Output Filename",
        ])
        
        # Sort: incomplete entries first, then alphabetically by title
        def sort_key(e):
            is_complete = e.has_summary and e.has_themes
            return (is_complete, e.title.lower())
        
        for entry in sorted(unique_entries, key=sort_key):
            # Determine status
            if not entry.has_summary and not entry.has_themes:
                status = "INCOMPLETE - No Summary or Themes"
            elif not entry.has_summary:
                status = "INCOMPLETE - No Summary"
            elif not entry.has_themes:
                status = "INCOMPLETE - No Themes"
            else:
                status = "Complete"
            
            writer.writerow([
                status,
                entry.title,
                entry.author or "",
                entry.tags or "",
                entry.word_count,
                entry.char_count,
                "Yes" if entry.has_summary else "No",
                "Yes" if entry.has_themes else "No",
                entry.theme_count,
                entry.source_file,
                f"{entry.slug}.md",
            ])
    
    logger.info(f"Wrote CSV overview to {csv_path}")
    
    # Summary statistics
    total_words = sum(e.word_count for e in unique_entries)
    with_summary = sum(1 for e in unique_entries if e.has_summary)
    with_themes = sum(1 for e in unique_entries if e.has_themes)
    
    return {
        "files_processed": files_processed,
        "total_sources_found": len(all_entries),
        "unique_sources": len(unique_entries),
        "duplicates_skipped": duplicates,
        "files_written": files_written,
        "total_word_count": total_words,
        "sources_with_summary": with_summary,
        "sources_with_themes": with_themes,
        "csv_path": str(csv_path),
        "output_dir": str(output_dir),
    }


def _parse_args(argv=None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Split multi-book markdown files into individual source files"
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
        default=Path("lenses/individual_sources"),
        help="Directory for individual source files",
    )
    parser.add_argument(
        "--csv",
        type=Path,
        default=Path("lenses/sources_overview.csv"),
        help="Path for CSV overview file",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing files",
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
        summary = process_directory(
            input_dir=args.input_dir,
            output_dir=args.output_dir,
            csv_path=args.csv,
            overwrite=args.overwrite,
            logger=logger,
        )
    except ValueError as exc:
        logger.error(str(exc))
        return 1
    
    logger.info(
        f"\n=== Split Complete ===\n"
        f"Input files processed: {summary['files_processed']}\n"
        f"Total sources found: {summary['total_sources_found']}\n"
        f"Unique sources: {summary['unique_sources']}\n"
        f"Duplicates skipped: {summary['duplicates_skipped']}\n"
        f"Files written: {summary['files_written']}\n"
        f"Total word count: {summary['total_word_count']:,}\n"
        f"Sources with summary: {summary['sources_with_summary']}\n"
        f"Sources with themes: {summary['sources_with_themes']}\n"
        f"\nOutput directory: {summary['output_dir']}\n"
        f"CSV overview: {summary['csv_path']}\n"
    )
    
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
