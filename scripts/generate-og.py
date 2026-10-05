#!/usr/bin/env python3
"""Build-time OG image generator (elianiva uses Takumi for this; here Pillow).

Generates 1200x630 PNG link-preview cards:
  public/og-image.png              — default (homepage / listing pages)
  public/og/blogs/<slug>.png       — one per blog post
  public/og/projects/<slug>.png    — one per project
  public/og/reports/<slug>.png     — one per security report

Slug rule mirrors how page URLs are built:
  1. Astro's `entry.slug` (github-slugger): lowercase, *drop* punctuation
     such as dots — e.g. `...-v1.0.md` -> `...-v10`.
  2. `src/lib/slug.ts` normalizeSlug as used in getStaticPaths + lookups:
     lowercase, [^a-z0-9]+ -> '-', trim dashes.

Runs on every build (`bun run build`). New posts from the issue-to-blog
workflow automatically get their card on the next deploy.
Stale cards (source .md deleted/renamed) are removed so crawlers never
get a 404 og:image.
Requires pillow; if it is missing the script tries `python -m pip install
pillow` once (works on CI/Cloudflare build images). If installation is
impossible (no pip / no network), it exits 0 without touching anything so
the build keeps working off the committed PNGs in public/og/.
"""

import re
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    try:
        print("[og] pillow missing, trying: python -m pip install pillow")
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "--quiet", "pillow"],
            check=True,
        )
        from PIL import Image, ImageDraw, ImageFont
    except Exception as exc:  # pip missing, offline, or install failed
        print(
            f"[og] WARNING: pillow unavailable ({exc}); skipping OG regeneration, "
            "using committed PNGs in public/.",
        )
        sys.exit(0)

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
FONTS = PUBLIC

W, H = 1200, 630
BG_TOP = (11, 17, 32)      # deep navy, matches site atmosphere
BG_BOTTOM = (2, 6, 23)
ACCENT = (129, 140, 248)   # indigo-400
ACCENT_STRONG = (34, 211, 238)  # cyan-400
WHITE = (241, 245, 249)
MUTED = (148, 163, 184)
CARD = (15, 23, 42)


def load_font(name: str, size: int):
    for candidate in (FONTS / name, Path(f"/usr/share/fonts/truetype/dejavu/{name}")):
        if candidate.exists():
            try:
                return ImageFont.truetype(str(candidate), size)
            except OSError:
                continue
    return ImageFont.load_default()


FONT_BOLD = "PlusJakartaSans-Bold.ttf"
FONT_XBOLD = "PlusJakartaSans-ExtraBold.ttf"
FONT_REG = "PlusJakartaSans-Regular.ttf"

MONTHS = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
}


def normalize_slug(value: str) -> str:
    # Step 1: replicate Astro's entry.slug (github-slugger per path segment):
    # lowercase, drop punctuation except hyphen/underscore/space, spaces -> '-'.
    slug = re.sub(r"[^a-z0-9 _-]+", "", value.strip().lower()).replace(" ", "-")
    # Step 2: replicate src/lib/slug.ts normalizeSlug used by the pages.
    return re.sub(r"[^a-z0-9]+", "-", slug).strip("-")


def lerp(a: int, b: int, t: float) -> int:
    return round(a + (b - a) * t)


def background() -> Image.Image:
    img = Image.new("RGB", (W, H), BG_TOP)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / (H - 1)
        draw.line(
            [(0, y), (W, y)],
            fill=(lerp(BG_TOP[0], BG_BOTTOM[0], t),
                  lerp(BG_TOP[1], BG_BOTTOM[1], t),
                  lerp(BG_TOP[2], BG_BOTTOM[2], t)),
        )
    # subtle grid
    grid = (30, 41, 59)
    for x in range(0, W, 60):
        draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 60):
        draw.line([(0, y), (W, y)], fill=grid, width=1)
    # accent bar on top
    draw.rectangle([0, 0, W, 10], fill=ACCENT)
    # soft glow bottom-right
    cx, cy = W - 200, H - 170
    for r in range(200, 0, -10):
        t = 1 - r / 200
        draw.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            outline=(int(lerp(BG_BOTTOM[0], ACCENT[0], t * 0.35)),
                     int(lerp(BG_BOTTOM[1], ACCENT[1], t * 0.35)),
                     int(lerp(BG_BOTTOM[2], ACCENT[2], t * 0.35))),
        )
    return img


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont,
         max_width: int, max_lines: int = 3) -> list[str]:
    words = text.split()
    lines, current = [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=font) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
            if len(lines) == max_lines:
                break
    if current and len(lines) < max_lines:
        lines.append(current)
    lines = lines[:max_lines]
    if lines:
        last = lines[-1]
        while draw.textlength(last + "…", font=font) > max_width and len(last) > 1:
            last = last[:-1]
        if last != lines[-1]:
            lines[-1] = last + "…"
        elif draw.textlength(" ".join(text.split()), font=font) > max_width and len(lines) == max_lines:
            # truncated: indicate overflow
            while draw.textlength(lines[-1] + "…", font=font) > max_width and len(lines[-1]) > 1:
                lines[-1] = lines[-1][:-1]
            lines[-1] += "…"
    return lines


def fit_title(draw: ImageDraw.ImageDraw, title: str, max_width: int,
              start_size: int = 84) -> tuple[ImageFont.ImageFont, list[str]]:
    size = start_size
    while size >= 40:
        font = load_font(FONT_XBOLD, size)
        lines = wrap(draw, title, font, max_width, 3)
        block_h = len(lines) * int(size * 1.12)
        if block_h <= 300:
            return font, lines
        size -= 6
    font = load_font(FONT_XBOLD, 40)
    return font, wrap(draw, title, font, max_width, 3)


def parse_frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    data: dict = {}
    if not match:
        return data
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        data[key.strip()] = value.strip().strip("\"'")
    return data


def format_date(raw: str) -> str:
    match = re.match(r"(\d{4})-(\d{2})-(\d{2})", raw or "")
    if not match:
        return raw or ""
    y, m, d = int(match.group(1)), int(match.group(2)), int(match.group(3))
    return f"{d} {MONTHS.get(m, '')} {y}"


def card(*, kicker: str, title: str, meta: str, out: Path) -> None:
    img = background()
    draw = ImageDraw.Draw(img)
    pad = 80
    max_w = W - pad * 2

    kick_font = load_font(FONT_BOLD, 30)
    draw.text((pad, 84), kicker.upper(), font=kick_font, fill=ACCENT_STRONG)

    title_font, lines = fit_title(draw, title, max_w)
    y = 150
    line_h = int(title_font.size * 1.12)
    for line in lines:
        draw.text((pad, y), line, font=title_font, fill=WHITE)
        y += line_h

    meta_font = load_font(FONT_REG, 30)
    draw.text((pad, H - 110), meta, font=meta_font, fill=MUTED)

    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG")
    print(f"[og] {out.relative_to(ROOT)}")


def main() -> None:
    card(
        kicker="alexanderar.com",
        title="Alexander Agung Raya",
        meta="Software Developer — Portfolio",
        out=PUBLIC / "og-image.png",
    )

    expected: dict[Path, set[str]] = {}

    blogs = sorted((ROOT / "src" / "content" / "blogs").glob("*.md"))
    expected[PUBLIC / "og" / "blogs"] = set()
    for path in blogs:
        fm = parse_frontmatter(path)
        title = fm.get("title", path.stem)
        slug = normalize_slug(path.stem)
        expected[PUBLIC / "og" / "blogs"].add(f"{slug}.png")
        card(
            kicker="blog · alexanderar.com",
            title=title,
            meta=format_date(fm.get("date", "")),
            out=PUBLIC / "og" / "blogs" / f"{slug}.png",
        )

    projects = sorted((ROOT / "src" / "content" / "projects").glob("*.md"))
    expected[PUBLIC / "og" / "projects"] = set()
    for path in projects:
        fm = parse_frontmatter(path)
        title = fm.get("title", path.stem)
        slug = normalize_slug(path.stem)
        year = fm.get("year", "")
        expected[PUBLIC / "og" / "projects"].add(f"{slug}.png")
        card(
            kicker="project · alexanderar.com",
            title=title,
            meta=f"Project · {year}".strip(" ·"),
            out=PUBLIC / "og" / "projects" / f"{slug}.png",
        )

    reports = sorted((ROOT / "src" / "content" / "reports").glob("*.md"))
    expected[PUBLIC / "og" / "reports"] = set()
    for path in reports:
        fm = parse_frontmatter(path)
        title = fm.get("title", path.stem)
        slug = normalize_slug(path.stem)
        severity = fm.get("severity", "")
        date = format_date(fm.get("date", ""))
        meta = " · ".join(part for part in (severity, date) if part)
        expected[PUBLIC / "og" / "reports"].add(f"{slug}.png")
        card(
            kicker="security report · alexanderar.com",
            title=title,
            meta=meta,
            out=PUBLIC / "og" / "reports" / f"{slug}.png",
        )

    # Remove stale cards whose source .md was deleted/renamed so that
    # og:image URLs referenced by old deploys never 404 on new ones.
    for directory, wanted in expected.items():
        if not directory.exists():
            continue
        for stale in sorted(directory.glob("*.png")):
            if stale.name not in wanted:
                stale.unlink()
                print(f"[og] removed stale {stale.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
