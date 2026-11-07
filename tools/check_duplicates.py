#!/usr/bin/env python3
"""Near-duplicate checker for pagesofpurposellc.com.

Compares the visible text inside <main> (forms, scripts and styles removed) of one or more
pages against every other indexable HTML page in the repo, using 5-word shingles
(Jaccard similarity). A page FAILS if it overlaps any other page by >= the threshold.

Usage (from the repo root):
  python3 tools/check_duplicates.py blog/new-page.html [more pages...]   # check specific pages
  python3 tools/check_duplicates.py --all                                 # report every page over the threshold
Options: --threshold 0.30 (default)
Exit code 1 if any checked page fails.
"""
import sys, os, re, html, glob, argparse

def visible_main(path):
    s = open(path, encoding='utf-8', errors='replace').read()
    m = re.search(r'<main\b.*?</main>', s, re.S | re.I)
    s = m.group(0) if m else s
    s = re.sub(r'<(script|style|form|nav|footer|header)\b.*?</\1>', ' ', s, flags=re.S | re.I)
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', html.unescape(s)).lower().split()

def shingles(words, n=5):
    return {' '.join(words[i:i+n]) for i in range(max(0, len(words) - n + 1))}

def indexable(path):
    s = open(path, encoding='utf-8', errors='replace').read(4000)
    if re.search(r'http-equiv=["\']refresh', s, re.I): return False
    if re.search(r'<meta name="robots" content="[^"]*noindex', s, re.I): return False
    return True

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pages', nargs='*')
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--threshold', type=float, default=0.30)
    a = ap.parse_args()
    files = [f for f in glob.glob('**/*.html', recursive=True)
             if not f.startswith(('.git', 'tools/')) and os.path.basename(f) not in ('thank-you.html',) and indexable(f)]
    S = {f: shingles(visible_main(f)) for f in files}
    targets = files if a.all else a.pages
    failed = 0
    for t in targets:
        if t not in S: S[t] = shingles(visible_main(t))
        best, other = 0.0, None
        for f, sh in S.items():
            if f == t or not sh or not S[t]: continue
            j = len(S[t] & sh) / len(S[t] | sh)
            if j > best: best, other = j, f
        status = 'FAIL' if best >= a.threshold else 'ok'
        if status == 'FAIL' or not a.all:
            print(f'{status}  {best:.2f}  {t}  (closest: {other})')
        failed += status == 'FAIL'
    sys.exit(1 if failed else 0)

if __name__ == '__main__':
    main()
