#!/usr/bin/env sh
# Wraps tracker.html (the published page body) into a standalone index.html
# that you can open straight from disk or serve with GitHub Pages.
set -e
cd "$(dirname "$0")"
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n'
  cat tracker.html
  printf '\n</body>\n</html>\n'
} > index.html
