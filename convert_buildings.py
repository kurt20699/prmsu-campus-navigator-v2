
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
IMAGE_DIR = ROOT / "images" / "building images"

if not IMAGE_DIR.is_dir():
    raise SystemExit(f"Folder not found: {IMAGE_DIR}")

conversions = {}
failed = []

for source in IMAGE_DIR.rglob("*"):
    if not source.is_file() or source.suffix.lower() != ".png":
        continue

    target = source.with_suffix(".webp")

    try:
        with Image.open(source) as img:
            img.load()
            img = img.convert("RGBA" if "A" in img.getbands() else "RGB")
            img.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
            img.save(target, "WEBP", quality=82, method=6)

        with Image.open(target) as check:
            check.verify()

        old_path = source.relative_to(ROOT).as_posix()
        new_path = target.relative_to(ROOT).as_posix()
        conversions[old_path] = new_path

        old_mb = source.stat().st_size / 1048576
        new_mb = target.stat().st_size / 1048576

        print(f"OK: {source.name}: {old_mb:.2f} -> {new_mb:.2f} MB")

    except Exception as error:
        failed.append(source.name)
        print(f"FAILED: {source.name}: {error}")

updated_files = []

for file in ROOT.rglob("*"):
    if not file.is_file() or file.suffix.lower() not in {
        ".js", ".html", ".css", ".json"
    }:
        continue

    if any(part in {"node_modules", ".git"} for part in file.parts):
        continue

    try:
        original = file.read_text(encoding="utf-8")
    except UnicodeError:
        continue

    updated = original

    for old, new in conversions.items():
        updated = updated.replace(old, new)
        updated = updated.replace(
            old.replace(" ", "%20"),
            new.replace(" ", "%20")
        )

    if updated != original:
        file.write_text(updated, encoding="utf-8")
        updated_files.append(file.relative_to(ROOT).as_posix())

print("\n=== CONVERSION REPORT ===")
print("Converted:", len(conversions))
print("Failed:", len(failed))
print("Updated source files:", len(updated_files))

for file in updated_files:
    print("UPDATED:", file)

print("\nKeep original PNG files until you verify the application.")
