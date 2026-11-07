# tools/

## check_duplicates.py
Finds pages that are near-copies of each other (Google treats those as duplicate/doorway content).

- Check one or more pages before committing: `python3 tools/check_duplicates.py blog/<slug>.html`
- Check the whole site (every audit): `python3 tools/check_duplicates.py --all`
- Threshold: `--threshold 0.30` (default). A score of 0.30 or more against any indexable page is a FAIL and the script exits 1.

It compares the visible `<main>` text (forms, nav, header and footer removed) using 5-word shingles. Fix a FAIL by rewriting the page, never by adding noindex or deleting the other page. See AUTOMATION.md, "No near-duplicate pages".
