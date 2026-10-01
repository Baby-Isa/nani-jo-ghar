#!/usr/bin/env python3
"""Cache-busting: stamp every file URL with ?v=<UTC date-time>.

GitHub Pages lets browsers cache files, so a returning player can keep old
art, data or code. Run this before every push to main:

    python3 build/bump_version.py            # stamp = now (UTC)
    python3 build/bump_version.py --check    # print the current stamp only
    python3 build/bump_version.py --dry-run  # list what would change; write nothing
    python3 build/bump_version.py --stamp 20261001T120000Z   # a given stamp (tests)

It sets the one stamp in all the places that carry it:
  - js/version.js (V), which code uses through njgV(url) / Cook.v(url) for
    data fetches, pictures, backgrounds and voice, and which also stamps
    every file a Phaser scene loads;
  - every local css/js tag and <img src="assets/..."> in the pages
    (every *.html at the root, and every *.html under lab/);
  - every url("../assets/...") in css/**/*.css (css/shared/ reaches them as
    "../../assets/..."), and every local @import ("tokens.css", which
    css/shared/app.css imports: R6);
  - the import map of every page that has one (decision 18, ES modules):
    <script type="importmap" data-njg="core">...</script> is rewritten to map
    every ES module under js/ (a file with a top-level import or export: the
    core, js/shared/{host,mode,input}.js, js/demo/, each mode's main.js; R6)
    to its stamped URL, by name ("#core/save.js", "#shared/host.js") and by
    path ("./js/core/save.js", so a module's own relative imports get the
    stamp too). Pages without that tag are left exactly as before.
"""
import datetime
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = sorted(
    os.path.relpath(f, ROOT)
    for f in glob.glob(os.path.join(ROOT, "*.html")) + glob.glob(os.path.join(ROOT, "lab", "*.html"))
)
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


# the ES-module pilot (decision 18): the import map a page opts into
IMPORTMAP_RE = re.compile(r'(<script\b[^>]*\btype="importmap"[^>]*\bdata-njg="core"[^>]*>)(.*?)(</script>)', re.S)
MODULE_DIRS = ["js/core"]  # always mapped, whole (the core is modules only)
MODULE_RE = re.compile(r"^(?:import\s[^(]|import\s*\{|export\s)", re.M)
SKIP_DIRS = ("js/vendor/",)


def is_module(path):
    """A file with a top-level import or export statement (not a dynamic import())."""
    try:
        return bool(MODULE_RE.search(open(os.path.join(ROOT, path), encoding="utf-8").read()))
    except OSError:
        return False


def module_files():
    """Every module the import map names: js/core/**/*.js and every other ES module under js/, as repo-relative paths."""
    out = set()
    for d in MODULE_DIRS:
        for f in glob.glob(os.path.join(ROOT, d, "**", "*.js"), recursive=True):
            out.add(os.path.relpath(f, ROOT).replace(os.sep, "/"))
    for f in glob.glob(os.path.join(ROOT, "js", "**", "*.js"), recursive=True):
        rel = os.path.relpath(f, ROOT).replace(os.sep, "/")
        if rel not in out and not rel.startswith(SKIP_DIRS) and is_module(rel):
            out.add(rel)
    return sorted(out)


def import_map(page, v):
    """The import map for one page: "#core/x.js" and "./js/core/x.js" -> the stamped URL (lab pages: "../")."""
    up = "../" * page.replace(os.sep, "/").count("/")
    prefix = up or "./"
    imports = {}
    for f in module_files():
        url = stamp_url(prefix + f, v)
        imports["#" + f[len("js/"):]] = url
        imports[prefix + f] = url
    return json.dumps({"imports": imports}, indent=1)


def write(path, text, dry):
    if not dry:
        open(path, "w", encoding="utf-8").write(text)


def main():
    dry = "--dry-run" in sys.argv
    path = os.path.join(ROOT, VERSION_JS)
    src = open(path, encoding="utf-8").read()
    if "--check" in sys.argv:
        print(V_RE.search(src).group(2))
        return
    v = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    if "--stamp" in sys.argv:
        v = sys.argv[sys.argv.index("--stamp") + 1]
    new = V_RE.sub(lambda m: m.group(1) + v + m.group(3), src, count=1)
    assert new != src or v in src, "no stamp found in js/version.js"
    write(path, new, dry)
    changed = [VERSION_JS]

    # pages: <script src>, <link href>, <img src> pointing at local files
    # (lab/*.html reaches them as "../js/..." etc, so the leading "../" is optional)
    tag = re.compile(r'(<(?:script|link|img)\b[^>]*?\b(?:src|href)=")((?:\.\./)?(?:js|css|assets)/[^"]+)(")')
    for page in PAGES:
        p = os.path.join(ROOT, page)
        if not os.path.exists(p):
            continue
        s = open(p, encoding="utf-8").read()
        s2 = tag.sub(lambda m: stamp_attr(m, v), s)
        s2 = IMPORTMAP_RE.sub(lambda m: m.group(1) + "\n" + import_map(page, v) + "\n" + m.group(3), s2)
        if s2 != s:
            write(p, s2, dry)
            changed.append(page)

    # stylesheets (css/ and css/shared/): url("../assets/...") or url("../../assets/..."), and a local @import
    css = re.compile(r'(url\(["\']?)((?:\.\./)+assets/[^"\')]+)(["\']?\))')
    imp = re.compile(r'(@import\s+(?:url\()?["\'])([^"\':]+\.css(?:\?[^"\']*)?)(["\'])')
    for p in sorted(glob.glob(os.path.join(ROOT, "css", "**", "*.css"), recursive=True)):
        s = open(p, encoding="utf-8").read()
        s2 = css.sub(lambda m: stamp_attr(m, v), s)
        s2 = imp.sub(lambda m: stamp_attr(m, v), s2)
        if s2 != s:
            write(p, s2, dry)
            changed.append(os.path.relpath(p, ROOT))

    print(f"{'dry run, would stamp ' if dry else ''}version {v}: " + ", ".join(changed))


if __name__ == "__main__":
    main()
