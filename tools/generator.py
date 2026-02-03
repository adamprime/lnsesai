from __future__ import annotations

import argparse
import json
import logging
import re
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple


LOGGER_NAME = "lens_tools.generator"


TAG_SEPARATOR = re.compile(r"[;,]")


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
    return re.sub(r"\s+", " ", title).strip().lower()


def normalize_tag_name(tag: str) -> str:
    return " ".join(tag.strip().split())


def slugify_tag(tag: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", tag.lower())
    slug = slug.strip("-")
    return slug or "tag"


@dataclass
class BookEntry:
    title: str
    author: Optional[str]
    tags: Dict[str, str]
    body_lines: List[str]
    sources: set[str] = field(default_factory=set)
    priority: int = 999

    def merge(self, other: "BookEntry") -> None:
        self.tags.update(other.tags)
        self.sources.update(other.sources)
        if not self.body_lines and other.body_lines:
            self.body_lines = list(other.body_lines)
        if not self.author and other.author:
            self.author = other.author
        if other.priority < self.priority:
            self.priority = other.priority


@dataclass
class AggregateResult:
    books: Dict[Tuple[str, str], BookEntry]
    files_processed: int
    books_parsed: int


AUTHOR_PATTERN = re.compile(r"^\*\*Author:\*\*\s*(.+)$", re.IGNORECASE)
TAGS_PATTERN = re.compile(r"^\*\*Tags:\*\*\s*(.+)$", re.IGNORECASE)
PRIORITY_PATTERN = re.compile(r"^\*\*Priority:\*\*\s*(.+)$", re.IGNORECASE)


def parse_markdown_file(path: Path, *, logger: logging.Logger) -> List[BookEntry]:
    raw_lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    entries: List[BookEntry] = []
    current_title: Optional[str] = None
    buffer: List[str] = []

    def flush_buffer() -> None:
        if current_title is None:
            return
        logger.debug("Flushing section '%s' with %d lines", current_title, len(buffer))
        entry = _parse_book_block(
            title=current_title,
            lines=buffer,
            source_label=path.name,
            logger=logger,
        )
        if entry:
            entries.append(entry)

    for line in raw_lines:
        if line.startswith("# "):
            # Start of a new book section
            flush_buffer()
            current_title = line[2:].strip()
            buffer = []
        else:
            if current_title is not None:
                buffer.append(line)

    flush_buffer()
    return entries


def _parse_book_block(
    *, title: str, lines: Sequence[str], source_label: str, logger: logging.Logger
) -> Optional[BookEntry]:
    author: Optional[str] = None
    tags_line: Optional[str] = None
    priority: int = 999
    body_lines: List[str] = []

    for raw_line in lines:
        stripped = raw_line.strip()
        author_match = AUTHOR_PATTERN.match(stripped)
        if author_match and author is None:
            author = author_match.group(1).strip() or None
            continue

        tags_match = TAGS_PATTERN.match(stripped)
        if tags_match and tags_line is None:
            tags_line = tags_match.group(1).strip()
            continue

        priority_match = PRIORITY_PATTERN.match(stripped)
        if priority_match:
            try:
                priority = int(priority_match.group(1).strip())
            except ValueError:
                logger.warning("Invalid priority value for '%s' in %s", title, source_label)
            continue

        body_lines.append(raw_line)

    tags: Dict[str, str] = {}
    if tags_line:
        for raw_tag in TAG_SEPARATOR.split(tags_line):
            normalized = normalize_tag_name(raw_tag)
            if not normalized:
                continue
            slug = slugify_tag(normalized)
            tags.setdefault(slug, normalized)
    else:
        logger.warning("No tags found for '%s' in %s; skipping entry", title, source_label)
        return None

    entry = BookEntry(
        title=title,
        author=author,
        tags=tags,
        body_lines=_trim_leading_blank_lines(body_lines),
        sources={source_label},
        priority=priority,
    )
    return entry


def _trim_leading_blank_lines(lines: Iterable[str]) -> List[str]:
    lines_list = list(lines)
    index = 0
    while index < len(lines_list) and lines_list[index].strip() == "":
        index += 1
    return lines_list[index:]


def aggregate_books(
    input_dir: Path,
    *,
    logger: Optional[logging.Logger] = None,
) -> AggregateResult:
    logger = logger or _default_logger()
    books: Dict[Tuple[str, str], BookEntry] = {}
    files_processed = 0
    books_parsed = 0

    for path in sorted(input_dir.glob("*.md")):
        if not path.is_file():
            continue
        files_processed += 1
        for entry in parse_markdown_file(path, logger=logger):
            books_parsed += 1
            key = (normalize_title(entry.title), (entry.author or "").lower())
            existing = books.get(key)
            if existing:
                existing.merge(entry)
            else:
                books[key] = entry

    return AggregateResult(
        books=books,
        files_processed=files_processed,
        books_parsed=books_parsed,
    )


def build_tag_map(
    books: Iterable[BookEntry],
    *,
    include: Optional[Sequence[str]] = None,
    exclude: Optional[Sequence[str]] = None,
) -> Tuple[Dict[str, List[BookEntry]], Dict[str, str]]:
    include_slugs = (
        {slugify_tag(normalize_tag_name(tag)) for tag in include}
        if include
        else None
    )
    exclude_slugs = (
        {slugify_tag(normalize_tag_name(tag)) for tag in exclude}
        if exclude
        else None
    )

    tag_map: Dict[str, List[BookEntry]] = defaultdict(list)
    tag_display: Dict[str, str] = {}

    for book in books:
        for slug, display in book.tags.items():
            if include_slugs and slug not in include_slugs:
                continue
            if exclude_slugs and slug in exclude_slugs:
                continue
            tag_map[slug].append(book)
            tag_display.setdefault(slug, display)

    for slug in tag_map:
        tag_map[slug].sort(key=lambda b: (b.priority, normalize_title(b.title)))

    return tag_map, tag_display


def write_markdown_outputs(
    tag_map: Dict[str, List[BookEntry]],
    tag_display: Dict[str, str],
    output_dir: Path,
    *,
    generated_at: datetime,
    overwrite: bool,
) -> List[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    written_files: List[Path] = []
    for slug, books in sorted(tag_map.items(), key=lambda item: tag_display[item[0]].lower()):
        display_name = tag_display[slug]
        target = output_dir / f"{slug}.md"
        if target.exists() and not overwrite:
            continue
        with target.open("w", encoding="utf-8") as handle:
            handle.write(f"# {display_name} Lens\n")
            handle.write(f"_Generated: {generated_at.isoformat()}_\n\n")
            for index, book in enumerate(books):
                handle.write(f"## {book.title}\n")
                handle.write(f"**Author:** {book.author or 'Unknown'}\n")
                handle.write(
                    f"**Source Files:** {', '.join(sorted(book.sources))}\n\n"
                )
                body = "".join(book.body_lines).strip()
                if body:
                    handle.write(f"{body}\n")
                    handle.write("\n")
                if index != len(books) - 1:
                    handle.write("\n")
        written_files.append(target)
    return written_files


def write_json_catalog(
    tag_map: Dict[str, List[BookEntry]],
    tag_display: Dict[str, str],
    *,
    generated_at: datetime,
    destination: Path,
) -> None:
    catalog = {
        "generated_at": generated_at.isoformat(),
        "tags": [],
    }

    for slug in sorted(tag_map, key=lambda s: tag_display[s].lower()):
        books_payload = []
        for book in tag_map[slug]:
            books_payload.append(
                {
                    "title": book.title,
                    "author": book.author,
                    "sources": sorted(book.sources),
                    "body": "".join(book.body_lines).strip(),
                    "tags": sorted(book.tags.values()),
                }
            )
        catalog["tags"].append(
            {
                "slug": slug,
                "name": tag_display[slug],
                "book_count": len(tag_map[slug]),
                "books": books_payload,
            }
        )

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(catalog, indent=2, ensure_ascii=False), encoding="utf-8")


def generate_catalog(
    input_dir: Path,
    output_dir: Path,
    *,
    catalog_json: Optional[Path] = None,
    dry_run: bool = False,
    include_tags: Optional[Sequence[str]] = None,
    exclude_tags: Optional[Sequence[str]] = None,
    overwrite: bool = False,
    logger: Optional[logging.Logger] = None,
) -> Dict[str, object]:
    logger = logger or _default_logger()
    if not input_dir.exists() or not input_dir.is_dir():
        raise ValueError(f"Input directory {input_dir} does not exist or is not a directory")

    aggregate = aggregate_books(input_dir, logger=logger)
    tag_map, tag_display = build_tag_map(
        aggregate.books.values(), include=include_tags, exclude=exclude_tags
    )

    generated_at = datetime.now(timezone.utc)
    written_files: List[Path] = []
    if not dry_run:
        written_files = write_markdown_outputs(
            tag_map,
            tag_display,
            output_dir,
            generated_at=generated_at,
            overwrite=overwrite,
        )
        if catalog_json:
            write_json_catalog(
                tag_map,
                tag_display,
                generated_at=generated_at,
                destination=catalog_json,
            )

    summary = {
        "files_processed": aggregate.files_processed,
        "books_parsed": aggregate.books_parsed,
        "unique_books": len(aggregate.books),
        "unique_tags": len(tag_map),
        "markdown_files_written": [str(path) for path in written_files],
        "json_catalog": str(catalog_json) if catalog_json else None,
    }
    return summary


def _parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate tag-based lens markdown files")
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=Path("lenses/updated"),
        help="Directory containing source markdown exports (use lenses/raw for unprocessed)",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("lenses/generated"),
        help="Directory to write tag-specific markdown files",
    )
    parser.add_argument(
        "--catalog-json",
        type=Path,
        default=None,
        help="Optional path to write consolidated JSON catalog",
    )
    parser.add_argument(
        "--include-tag",
        action="append",
        default=None,
        help="Tag(s) to include (can be specified multiple times)",
    )
    parser.add_argument(
        "--exclude-tag",
        action="append",
        default=None,
        help="Tag(s) to exclude (can be specified multiple times)",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing markdown outputs",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse inputs without writing outputs",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging",
    )
    return parser.parse_args(argv)


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = _parse_args(argv)
    logger = _default_logger()
    logger.setLevel(logging.DEBUG if args.verbose else logging.INFO)

    try:
        summary = generate_catalog(
            input_dir=args.input_dir,
            output_dir=args.output_dir,
            catalog_json=args.catalog_json,
            dry_run=args.dry_run,
            include_tags=args.include_tag,
            exclude_tags=args.exclude_tag,
            overwrite=args.overwrite,
            logger=logger,
        )
    except ValueError as exc:
        logger.error(str(exc))
        return 1

    logger.info(
        "Processed %s files, parsed %s books, produced %s tags",
        summary["files_processed"],
        summary["books_parsed"],
        summary["unique_tags"],
    )
    if summary["markdown_files_written"]:
        logger.info("Markdown outputs: %s", ", ".join(summary["markdown_files_written"]))
    if summary["json_catalog"]:
        logger.info("JSON catalog written to %s", summary["json_catalog"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
