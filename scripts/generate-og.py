#!/usr/bin/env python3
"""Build-time OG image generator (Pillow).

Generates 1200x630 PNG link-preview cards:
  public/og-image.png              — default (homepage / listing pages)
  public/og/blogs/<slug>.png       — one per blog post
  public/og/projects/<slug>.png    — one per project
  public/og/reports/<slug>.png     — one per security report

Design: simple centered layout in the site's warm sage/beige palette
(src/styles/global.css) — thin frame, two accent bars on the top edge,
letterspaced kicker, big uppercase title, short underline, description,
a "#tag" chip, and the domain at the bottom.

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
FONTS = PUBLIC / "fonts"

W, H = 1200, 630

# Design tokens — must match src/styles/global.css
BG = (241, 235, 225)         # --bg        #F1EBE1
INK = (74, 74, 63)           # --ink       #4A4A3F
OLIVE = (125, 132, 113)      # --olive     #7D8471
STONE = (176, 175, 160)      # --stone     #B0AFA0
LINE = (217, 209, 193)       # --line      #D9D1C1
SAGE_DEEP = (130, 153, 111)  # --sage-deep #82996F
CHIP_BG = (250, 247, 241)    # near-white, like the reference tag chip


def load_font(size: int, weight: str = "Regular") -> ImageFont.FreeTypeFont:
    """Load the Plus Jakarta Sans variable font at a named weight."""
    path = FONTS / "PlusJakartaSans-VariableFont_wght.ttf"
    if path.exists():
        try:
            font = ImageFont.truetype(str(path), size)
            font.set_variation_by_name(weight)
            return font
        except OSError:
            pass
    return ImageFont.load_default()


def normalize_slug(value: str) -> str:
    # Step 1: replicate Astro's entry.slug (github-slugger per path segment):
    # lowercase, drop punctuation except hyphen/underscore/space, spaces -> '-'.
    slug = re.sub(r"[^a-z0-9 _-]+", "", value.strip().lower()).replace(" ", "-")
    # Step 2: replicate src/lib/slug.ts normalizeSlug used by the pages.
    return re.sub(r"[^a-z0-9]+", "-", slug).strip("-")


def tracked(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont,
            tracking: float) -> float:
    """Width of `text` when drawn with extra letter spacing."""
    if not text:
        return 0.0
    widths = [draw.textlength(ch, font=font) for ch in text]
    return sum(widths) + tracking * (len(text) - 1)


def draw_tracked(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont,
                 center_x: float, y: float, fill, tracking: float) -> None:
    """Draw letterspaced text centered on center_x."""
    x = center_x - tracked(draw, text, font, tracking) / 2
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking


def background() -> Image.Image:
    """Flat beige card, thin frame, and a subtle dot grid."""
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    inset = 26
    draw.rectangle([inset, inset, W - inset, H - inset], outline=LINE, width=2)
    # subtle dot grid, bottom-right corner (flat, low contrast)
    for gy in range(H - 156, H - 62, 24):
        for gx in range(W - 312, W - 70, 24):
            draw.ellipse([gx - 2, gy - 2, gx + 2, gy + 2], fill=(223, 215, 200))
    return img


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont,
         max_width: int, max_lines: int) -> list[str]:
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
    if lines and draw.textlength(" ".join(text.split()), font=font) > max_width:
        while draw.textlength(lines[-1] + "…", font=font) > max_width and len(lines[-1]) > 1:
            lines[-1] = lines[-1][:-1]
        lines[-1] += "…"
    return lines


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


def first_list_item(fm: dict, key: str) -> str:
    """First element of an inline YAML array: tags: ["a", "b"] -> a."""
    raw = fm.get(key, "").strip()
    match = re.match(r"\[(.*)\]", raw)
    if not match:
        return raw
    items = [item.strip().strip("\"'") for item in match.group(1).split(",")]
    return items[0] if items else ""


def first_technology(path: Path) -> str:
    """First `- name:` entry of the multi-line technologies list."""
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"\s*-\s*name:\s*\"?([^\"\n]+)\"?", line)
        if match:
            return match.group(1).strip()
    return ""


def format_date(raw: str) -> str:
    months = {
        1: "JANUARY", 2: "FEBRUARY", 3: "MARCH", 4: "APRIL", 5: "MAY",
        6: "JUNE", 7: "JULY", 8: "AUGUST", 9: "SEPTEMBER", 10: "OCTOBER",
        11: "NOVEMBER", 12: "DECEMBER",
    }
    match = re.match(r"(\d{4})-(\d{2})-(\d{2})", raw or "")
    if not match:
        return (raw or "").upper()
    y, m, d = int(match.group(1)), int(match.group(2)), int(match.group(3))
    return f"{d} {months.get(m, '')} {y}"


def card(*, kicker: str, title: str, description: str, tag: str, out: Path) -> None:
    img = background()
    draw = ImageDraw.Draw(img)
    center = W / 2

    # kicker: "■ POST · 20 FEBRUARY 2026"
    kick_font = load_font(25, "Bold")
    kick_text = kicker.upper()
    tracking = 7
    square = 9
    kick_w = tracked(draw, kick_text, kick_font, tracking)
    block_w = square + 14 + kick_w
    kick_y = 142
    draw.rectangle([center - block_w / 2, kick_y + 9,
                    center - block_w / 2 + square, kick_y + 9 + square],
                   fill=SAGE_DEEP)
    draw_tracked(draw, kick_text, kick_font, center + (square + 14) / 2,
                 kick_y, SAGE_DEEP, tracking)

    # measure every block first, then center the whole stack vertically —
    # long titles shrink until everything fits between kicker and footer.
    top = 204
    bottom_limit = H - 118
    avail = bottom_limit - top

    desc_font = load_font(30, "Regular")
    desc_lines = wrap(draw, description, desc_font, W - 320, 2) if description else []
    desc_h = len(desc_lines) * 42
    chip_h = 52 if tag else 0
    underline_gap, underline_h, section_gap = 30, 4, 30

    def measure(size: int):
        font = load_font(size, "ExtraBold")
        lines = wrap(draw, title.upper(), font, W - 260, 3)
        t_block = len(lines) * int(size * 1.1)
        stack = t_block + underline_gap + underline_h + underline_gap
        stack += (desc_h + section_gap) if desc_h else 0
        stack += (section_gap + chip_h) if chip_h else 0
        return font, lines, t_block, stack

    size = 88
    while size >= 42:
        font, lines, t_block, stack = measure(size)
        if stack <= avail:
            break
        size -= 4

    y = top + max((avail - stack) / 2, 0)
    line_h = int(font.size * 1.1)
    for line in lines:
        tw = draw.textlength(line, font=font)
        draw.text((center - tw / 2, y), line, font=font, fill=INK)
        y += line_h

    # short sage underline under the title
    y += underline_gap
    draw.rectangle([center - 30, y, center + 30, y + underline_h], fill=SAGE_DEEP)
    y += underline_h + underline_gap

    # description (up to 2 centered lines)
    for line in desc_lines:
        tw = draw.textlength(line, font=desc_font)
        draw.text((center - tw / 2, y), line, font=desc_font, fill=OLIVE)
        y += 42

    # "#tag" chip
    if tag:
        y += section_gap
        tag_text = f"#{tag.lower()}"
        tag_font = load_font(26, "SemiBold")
        tw = draw.textlength(tag_text, font=tag_font)
        draw.rounded_rectangle(
            [center - tw / 2 - 24, y, center + tw / 2 + 24, y + chip_h],
            radius=12, fill=CHIP_BG, outline=LINE, width=2,
        )
        draw.text((center - tw / 2, y + (chip_h - 26) / 2 - 3),
                  tag_text, font=tag_font, fill=SAGE_DEEP)

    # domain at the bottom
    foot_font = load_font(24, "Bold")
    draw_tracked(draw, "ALEXANDERAR.COM", foot_font, center, H - 92, STONE, 6)

    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG")
    print(f"[og] {out.relative_to(ROOT)}")


def main() -> None:
    card(
        kicker="Portfolio",
        title="Alexander Agung Raya",
        description="Software Developer — Indonesia, East Java",
        tag="portfolio",
        out=PUBLIC / "og-image.png",
    )

    expected: dict[Path, set[str]] = {}

    blogs = sorted((ROOT / "src" / "content" / "blogs").glob("*.md"))
    expected[PUBLIC / "og" / "blogs"] = set()
    for path in blogs:
        fm = parse_frontmatter(path)
        expected[PUBLIC / "og" / "blogs"].add(f"{normalize_slug(path.stem)}.png")
        card(
            kicker=f"Post · {format_date(fm.get('date', ''))}",
            title=fm.get("title", path.stem),
            description=fm.get("description", ""),
            tag=first_list_item(fm, "tags"),
            out=PUBLIC / "og" / "blogs" / f"{normalize_slug(path.stem)}.png",
        )

    projects = sorted((ROOT / "src" / "content" / "projects").glob("*.md"))
    expected[PUBLIC / "og" / "projects"] = set()
    for path in projects:
        fm = parse_frontmatter(path)
        slug = normalize_slug(path.stem)
        expected[PUBLIC / "og" / "projects"].add(f"{slug}.png")
        card(
            kicker=f"Project · {fm.get('year', '')}".strip(),
            title=fm.get("title", path.stem),
            description=fm.get("description", ""),
            tag=first_technology(path),
            out=PUBLIC / "og" / "projects" / f"{slug}.png",
        )

    reports = sorted((ROOT / "src" / "content" / "reports").glob("*.md"))
    expected[PUBLIC / "og" / "reports"] = set()
    for path in reports:
        fm = parse_frontmatter(path)
        slug = normalize_slug(path.stem)
        severity = fm.get("severity", "")
        cwe = fm.get("cwe", "")
        meta = " · ".join(part for part in
                          (f"Severity {severity}" if severity else "", cwe) if part)
        expected[PUBLIC / "og" / "reports"].add(f"{slug}.png")
        card(
            kicker=f"Security Report · {format_date(fm.get('date', ''))}",
            title=fm.get("title", path.stem),
            description=meta,
            tag=first_list_item(fm, "tags"),
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
