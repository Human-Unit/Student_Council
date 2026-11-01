#!/usr/bin/env bash
# Renders page 1 of every DOCX template into a PNG preview for
# /student/documents/[slug] and writes their sizes to
# src/data/document-previews.json.
#
# The DOCX files are read-only input: they are copied to a temp folder and
# never modified. Re-run after replacing or adding a template.
#
# Needs LibreOffice (soffice), poppler-utils (pdftoppm), ImageMagick (convert)
# and fonts-liberation (Liberation Serif is metric-compatible with
# Times New Roman, so line breaks match Word).
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
templates="$root/public/documents/templates"
previews="$root/public/documents/previews"
manifest="$root/src/data/document-previews.json"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# Times New Roman -> Liberation Serif. A few characters in the originals are
# set in "Bad Script", which is not installed on most computers; draw them in
# the body font instead of an unrelated system fallback.
cat >"$work/fonts.conf" <<'XML'
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
  <alias binding="same">
    <family>Times New Roman</family>
    <prefer><family>Liberation Serif</family></prefer>
  </alias>
  <alias binding="same">
    <family>Bad Script</family>
    <prefer><family>Liberation Serif</family></prefer>
  </alias>
</fontconfig>
XML
export FONTCONFIG_FILE="$work/fonts.conf"

mkdir -p "$previews"
entries=()
for docx in "$templates"/*.docx; do
  name="$(basename "$docx" .docx)"
  cp "$docx" "$work/$name.docx"
  soffice --headless --norestore \
    "-env:UserInstallation=file://$work/profile" \
    --convert-to pdf --outdir "$work" "$work/$name.docx" >/dev/null
  pdftoppm -r 220 -f 1 -l 1 -gray -png "$work/$name.pdf" "$work/$name"
  # Crop the empty lower half of the sheet, keep even white margins, cap the
  # width at 1200px (2x the widest layout slot) and store as 8-bit grey.
  convert "$work/$name-1.png" -trim +repage \
    -bordercolor white -border 7%x6% \
    -resize '1200x>' -strip \
    -define png:color-type=0 -depth 8 \
    "$previews/$name.png"
  size="$(identify -format '%w %h' "$previews/$name.png")"
  entries+=("  \"$name\": { \"src\": \"/documents/previews/$name.png\", \"width\": ${size% *}, \"height\": ${size#* } }")
done

{
  echo "{"
  for index in "${!entries[@]}"; do
    separator=","
    [[ $index -eq $((${#entries[@]} - 1)) ]] && separator=""
    echo "${entries[$index]}$separator"
  done
  echo "}"
} >"$manifest"

echo "Rendered ${#entries[@]} previews into ${previews#"$root/"}"
