"""Downscale project covers for mobile.

The project pages show a cover about 360 CSS px wide on a phone (up to 2x DPR),
but the source files are ~1900px wide and ~100 KB. Shipping the full-size file
put the cover *after* the JS bundle on a slow connection, which is what pushed
mobile LCP past 2.5s. This writes a 960px-wide sibling (`<name>-960.webp`, which
covers 360px at 2x with room to spare); the cover uses it through `srcset` while
desktop keeps the full-resolution file.

Run from the repo root: python3 scripts/generate-image-variants.py
"""
from pathlib import Path

from PIL import Image

WIDTH = 960
QUALITY = 80
ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "public" / "images"


def main() -> None:
    written = 0
    for source in sorted(IMAGES.glob("*.webp")):
        if source.stem.endswith(f"-{WIDTH}"):
            continue
        with Image.open(source) as image:
            if image.width <= WIDTH:
                continue
            height = round(image.height * WIDTH / image.width)
            small = image.convert("RGB").resize((WIDTH, height), Image.LANCZOS)
            target = source.with_name(f"{source.stem}-{WIDTH}.webp")
            small.save(target, "WEBP", quality=QUALITY, method=6)
            written += 1
            print(f"[images] {target.name} {WIDTH}x{height} {target.stat().st_size // 1024} KB")
    print(f"[images] {written} variant(s)")


if __name__ == "__main__":
    main()
