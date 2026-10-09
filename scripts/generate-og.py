#!/usr/bin/env python3
"""Build-time OG image generator (Pillow).

Generates 1200x630 PNG link-preview cards:
  public/og-image.png              — default (homepage / listing pages)
  public/og/blogs/<slug>.png       — one per blog post
  public/og/projects/<slug>.png    — one per project
  public/og/reports/<slug>.png     — one per security report

Design mirrors src/styles/global.css (the warm sage/beige theme):
flat #F1EBE1 background, ink text, sage accents, soft type chips,
and the circular pixel-art avatar from the site hero bottom-right.

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
AVATAR = PUBLIC / "IconAlex.png"

W, H = 1200, 630

# Design tokens — must match src/styles/global.css
BG = (241, 235, 225)        # --bg        #F1EBE1
BG_SOFT = (233, 225, 211)   # --bg-soft   #E9E1D3
INK = (74, 74, 63)          # --ink       #4A4A3F
OLIVE = (125, 132, 113)     # --olive     #7D8471
STONE = (176, 175, 160)     # --stone     #B0AFA0
LINE = (217, 209, 193)      # --line      #D9D1C1
SAGE = (156, 175, 136)      # --sage      #9CAF88
SAGE_DEEP = (130, 153, 111)  # --sage-deep #82996F

CHIP = {
    "PORTFOLIO": ((235, 230, 240), (179, 166, 194), (110, 95, 130)),   # lavender
    "BLOG": ((237, 241, 243), (197, 210, 220), (95, 123, 144)),        # dusty blue
    "PROJECT": ((227, 232, 218), (178, 196, 158), (107, 127, 90)),     # sage
    "SECURITY REPORT": ((244, 231, 229), (227, 196, 192), (154, 94, 88)),  # blush
}


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


def background() -> Image.Image:
    """Flat warm beige card with a sage top bar and a tonal corner."""
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, W, 8], fill=SAGE)
    # tonal quarter-circle bottom-right (under everything else)
    draw.ellipse([W - 360, H - 340, W + 160, H + 180], fill=BG_SOFT)
    return img


def avatar(img: Image.Image) -> None:
    """Circular pixel-art avatar with a thin ring, bottom-right — like the hero."""
    size = 104
    box = (W - 76 - size, H - 76 - size)
    ring_pad = 6
    draw = ImageDraw.Draw(img)
    draw.ellipse(
        [box[0] - ring_pad, box[1] - ring_pad,
         box[0] + size + ring_pad, box[1] + size + ring_pad],
        fill=BG,
        outline=LINE,
        width=3,
    )
    if AVATAR.exists():
        pic = Image.open(AVATAR).convert("RGB").resize((size, size), Image.LANCZOS)
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).ellipse([0, 0, size, size], fill=255)
        img.paste(pic, box, mask)
    else:
        draw.ellipse([box[0], box[1], box[0] + size, box[1] + size], fill=SAGE)


def chip(draw: ImageDraw.ImageDraw, label: str, right_x: int, center_y: int) -> None:
    """Soft rounded tag, right-aligned — same chip style as the site cards."""
    bg, border, ink = CHIP.get(label, CHIP["PORTFOLIO"])
    font = load_font(26, "Bold")
    text_w = draw.textlength(label.upper(), font=font)
    pad_x, pad_y = 22, 13
    x1 = right_x - text_w - pad_x * 2
    y1 = center_y - pad_y - 13
    x2 = right_x
    y2 = center_y + pad_y + 13
    draw.rounded_rectangle([x1, y1, x2, y2], radius=y2 - y1, fill=bg,
                           outline=border, width=2)
    draw.text((x1 + pad_x, y1 + pad_y), label.upper(), font=font, fill=ink)


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont,
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
              start_size: int = 84) -> tuple[ImageFont.FreeTypeFont, list[str]]:
    size = start_size
    while size >= 40:
        font = load_font(size, "ExtraBold")
        lines = wrap(draw, title, font, max_width, 3)
        block_h = len(lines) * int(size * 1.1)
        if block_h <= 300:
            return font, lines
        size -= 6
    font = load_font(40, "ExtraBold")
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
    months = {
        1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
        7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
    }
    match = re.match(r"(\d{4})-(\d{2})-(\d{2})", raw or "")
    if not match:
        return raw or ""
    y, m, d = int(match.group(1)), int(match.group(2)), int(match.group(3))
    return f"{d} {months.get(m, '')} {y}"


def card(*, title: str, meta: str, chip_label: str, out: Path) -> None:
    img = background()
    draw = ImageDraw.Draw(img)
    pad = 76
    max_w = W - pad * 2

    # header: brand left, type chip right
    brand_font = load_font(30, "Bold")
    draw.rectangle([pad, 74, pad + 14, 88], fill=SAGE_DEEP)
    draw.text((pad + 28, 66), "alexanderar.com", font=brand_font, fill=INK)
    chip(draw, chip_label, W - pad, 80)

    # title
    title_font, lines = fit_title(draw, title, max_w)
    y = 172
    line_h = int(title_font.size * 1.1)
    for line in lines:
        draw.text((pad, y), line, font=title_font, fill=INK)
        y += line_h

    # footer: divider, meta left, author right (avatar sits past the corner)
    divider_y = H - 150
    draw.line([(pad, divider_y), (W - pad, divider_y)], fill=LINE, width=2)
    meta_font = load_font(30, "Regular")
    name_font = load_font(30, "SemiBold")
    meta_w = draw.textlength(meta, font=meta_font) if meta else 0
    name = "Alexander Agung Raya"
    name_w = draw.textlength(name, font=name_font)
    draw.text((pad, divider_y + 34), meta, font=meta_font, fill=OLIVE)
    draw.text((W - pad - name_w - 150, divider_y + 34), name,
              font=name_font, fill=STONE)
    avatar(img)

    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG")
    print(f"[og] {out.relative_to(ROOT)}")


def main() -> None:
    card(
        title="Alexander Agung Raya",
        meta="Software Developer — Indonesia, East Java",
        chip_label="PORTFOLIO",
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
            title=title,
            meta=format_date(fm.get("date", "")),
            chip_label="BLOG",
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
            title=title,
            meta=f"Project · {year}".strip(" ·"),
            chip_label="PROJECT",
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
            title=title,
            meta=meta,
            chip_label="SECURITY REPORT",
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
