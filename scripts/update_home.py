"""Refresh the static homepage excerpts from the complete archive pages."""

from datetime import date
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent.parent
RECENT = (("blogs", "posts/index.html", 8), ("creations", "creations/index.html", 4))


def recent_entries(path, limit):
    articles = re.findall(r"<article\b.*?</article>", path.read_text(), re.S)

    def published(article):
        match = re.search(r'data-date="([^"]+)"', article)
        if not match:
            raise ValueError(f"An entry in {path} is missing data-date (YYYY-MM-DD).")
        return date.fromisoformat(match.group(1))

    return sorted(articles, key=published, reverse=True)[:limit]


def main():
    homepage = ROOT / "index.html"
    content = homepage.read_text()
    for name, source, limit in RECENT:
        entries = recent_entries(ROOT / source, limit)
        start, end = f"<!-- recent-{name}:start -->", f"<!-- recent-{name}:end -->"
        if content.count(start) != 1 or content.count(end) != 1:
            raise ValueError(f"Expected one pair of homepage markers for {name}.")
        before, remainder = content.split(start, 1)
        _, after = remainder.split(end, 1)
        content = before + start + "\n" + "\n".join(entries) + "\n          " + end + after
        print(f"Recent {name}: {len(entries)} entries (maximum {limit}).")
    homepage.write_text(content)


if __name__ == "__main__":
    main()
