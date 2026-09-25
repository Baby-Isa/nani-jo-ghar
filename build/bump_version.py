#!/usr/bin/env python3
"""Cache-busting: stamp every file URL with ?v=<UTC date-time>.

GitHub Pages lets browsers cache files, so a returning player can keep old
art, data or code. Run this before every push to main:

    python3 build/bump_version.py            # stamp = now (UTC)
    python3 build/bump_version.py --check    # print the current stamp only

It sets the one stamp in all the places that carry it:
  - js/version.js (V), which code uses through njgV(url) / Cook.v(url) for
    data fetches, pictures, backgrounds and voice, and which also stamps
    every file a Phaser scene loads;
  - every local css/js tag and <img src="assets/..."> in the pages
    (cook.html, find.html, index.html);
  - every url("../assets/...") in css/*.css.
"""
import datetime
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["cook.html", "find.html", "index.html"]
VERSION_JS = "js/version.js"
V_RE = re.compile(r'(const V = ")([^"]*)(";)')


def stamp_url(url, v):
    """Local URL -> URL with ?v=<v> (replacing an old v=)."""
    if re.match(r"^(data:|blob:|[a-z]+://|//|#)", url, re.I):
        return url
    url = re.sub(r"([?&])v=[^&#]*&?", r"\1", url).rstrip("?&")
    return url + ("&" if "?" in url else "?") + "v=" + v


def stamp_attr(m, v):
    return f'{m.group(1)}{stamp_url(m.group(2), v)}{m.group(3)}'


def main():
    path = os.path.join(ROOT, VERSION_JS)
    src = open(path, encoding="utf-8").read()
    if "--check" in sys.argv:
        print(V_RE.search(src).group(2))
        return
    v = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    new = V_RE.sub(lambda m: m.group(1) + v + m.group(3), src, count=1)
    assert new != src or v in src, "no stamp found in js/version.js"
    open(path, "w", encoding="utf-8").write(new)
    changed = [VERSION_JS]

    # pages: <script src>, <link href>, <img src> pointing at local files
    tag = re.compile(r'(<(?:script|link|img)\b[^>]*?\b(?:src|href)=")((?:js|css|assets)/[^"]+)(")')
    for page in PAGES:
        p = os.path.join(ROOT, page)
        if not os.path.exists(p):
            continue
        s = open(p, encoding="utf-8").read()
        s2 = tag.sub(lambda m: stamp_attr(m, v), s)
        if s2 != s:
            open(p, "w", encoding="utf-8").write(s2)
            changed.append(page)

    # stylesheets: url("../assets/...")
    css = re.compile(r'(url\(["\']?)(\.\./assets/[^"\')]+)(["\']?\))')
    for p in sorted(glob.glob(os.path.join(ROOT, "css", "*.css"))):
        s = open(p, encoding="utf-8").read()
        s2 = css.sub(lambda m: stamp_attr(m, v), s)
        if s2 != s:
            open(p, "w", encoding="utf-8").write(s2)
            changed.append(os.path.relpath(p, ROOT))

    print(f"version {v}: " + ", ".join(changed))


if __name__ == "__main__":
    main()
