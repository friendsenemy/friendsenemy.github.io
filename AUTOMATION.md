# Content Engine — Rules of Record

The daily publisher task carries its own fully self-contained prompt. This file is the human-readable copy of the same rules, and the place to change them.

## Repo facts

- Repo: `friendsenemy/friendsenemy.github.io`, branch `main`, direct commits, no PRs.
- Pages live in `blog/`. Sitemap is `sitemap.xml` at repo root. Queue is `content-queue.md` at repo root.
- Site: `https://pagesofpurposellc.com`. GSC property: `https://pagesofpurposellc.com/`.
- Formspree endpoint: `https://formspree.io/f/xjgpnqlj`. Thank-you: `https://pagesofpurposellc.com/thank-you.html`.

## Template

`blog/can-you-sell-house-while-incarcerated.html` is the canonical template. Every new page copies its `<style>` block verbatim, its `<header>` nav, its `.hero`, its `.byline`, its `<footer>`, its floating CTA, and its FAQPage JSON-LD structure.

## Form pattern — non-negotiable

Two forms per page, both posting to the Formspree endpoint above with `_next` set to the thank-you page.

**Mid-article (`.inline-lead-form`):**

- Headline: **Not Sure Yet? Ask Us — Free, No Pressure**
- Button: **Get a Free Answer**
- Fields: name (required), contact_info (required), property_address (**optional**), brief_situation (required textarea)

**Bottom (`.cta-section` > `.contact-form`):**

- Button: **Get a Free Answer**
- Fields: name, email, phone (optional), property_address (**optional**), message

Property address is optional on both. That is the whole point of the low-friction pattern — people researching a situation aren't ready to hand over an address.

`source_page` must be **unique per page**, in the form `blog-inline-{topic}-{geo}` and `blog-bottom-{topic}-{geo}`.

## Hard rules

1. **Never duplicate an existing topic.** List `blog/` first and check. Also check `sell/cities/`, `sell/states/`, `sell/pages/`, and `sell/blog/`.
2. **2,000+ words minimum**, real state-specific statutes, procedures, timelines, and dollar ranges. No filler, no generic national boilerplate wearing a city name.
3. **Cross-link to 2+ existing pillars** from within the body.
4. **Add a contextual link TO the new page FROM the matching pillar** — a surgical string replacement with an assertion that the anchor appears exactly once before replacing. Never rewrite a whole existing file.
5. **Add the page to `sitemap.xml`** and re-submit the sitemap to GSC.
6. **No phone-call CTA as the primary action.** Forms are the goal.
7. **One commit per page.** Commit messages end with:
   `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`
8. **Mark the row `done`** in `content-queue.md` in the same commit.
9. Always include the "not legal advice, talk to an attorney licensed in that state" byline. These pages touch probate, homestead, and incarceration law.

## Tone

Honest to the point of arguing against the sale when the sale isn't right. Every page should tell the reader when listing on the open market beats selling to us — because on a sound house with agreeable heirs, it does, and saying so is what makes the rest of the page credible.


## Blog index (added 2026-10-22)
Every new blog page MUST also get a `<article class="post-card">` entry inserted at the top of the list in `blog/index.html` (tag = state or 'National Pillar', h3 link, one-sentence description, read-more link). Commit it in the same commit as the page. Pages missing from the index get crawled later and rank slower.

## Phone number
The only phone number on the site is (227) 235-9530 / +12272359530. Never use any other number.

## Forms (site-wide rules)
`sms_consent` checkbox and `property_address` are never `required`. Every form has hidden `_next` = https://pagesofpurposellc.com/thank-you.html and a unique `source_page`.

## Design shell (added 2026-10-23)
Every user-facing page uses the shared design system. Full rules: `DESIGN.md`. Non-negotiable for the daily engine:
- Copy the `<head>` asset lines (keep the `?v=` version numbers exactly as in the template), header, footer, floating button and `/assets/pop.js` script tag exactly as they appear in `blog/sell-probate-house-dallas-tx.html` (the engine template). That means: `<link rel="stylesheet" href="/assets/pop.css?v=3">` + both font preloads (`nunito-sans-latin.woff2` and `fraunces-latin.woff2`) before `</head>`; `<body class="pp pp-guide">`; the skip link and `<header class="pp-hd">` right after `<body>`; `<footer class="pp-ft">` at the end.
- Lead forms keep class `inline-lead-form` / `pop-ask`; do not add inline colors or gradients to them, `pop.css` styles them.
- Icons: the owner likes the small emoji icons. Use one fitting emoji icon next to situation/feature headings and list items, as the existing pages do. No colored `border-left` callouts. No gradient backgrounds. No new colors outside DESIGN.md.
- Headings never skip a level (h2 → h3, not h2 → h4). One H1 per page.

## Specialist pages and llms.txt (added 2026-10-31)
AI assistants recommend the most *specific* business for a problem, so every guide must point to the page that says plainly what we do for that problem.

1. **Specialist callout.** Directly after the `.byline` paragraph, every new page gets exactly one box linking to its matching specialist page:
   `<div class="callout pp-specialist"><p><strong>🤝 Need a buyer, not just answers?</strong> {SENTENCE} <a href="/sell/pages/{SLUG}.html">{LINK TEXT}</a>.</p></div>`
   | Topic | SLUG | SENTENCE | LINK TEXT |
   |---|---|---|---|
   | jail / prison / incarcerated | `incarcerated-owner` | Pages of Purpose specializes in buying houses when an owner or co-owner is in jail or prison. | See how we handle these sales |
   | heirs / inherited / probate | `heirs-disagree` | Pages of Purpose specializes in buying inherited houses when the heirs can't agree, probate was never opened, or an heir is missing. | See how we handle these sales |
   | co-owned / partial interest / partition | `co-owner-buyout` | Pages of Purpose specializes in co-owned houses, including buying one owner's share when the other owner won't sell. | See how we buy co-owned houses and shares |
   | divorce | `divorce` | Pages of Purpose specializes in buying houses during and after a divorce, with one written offer both spouses can see. | See how we handle divorce sales |
   Topics outside these four (foreclosure, liens, tax sale): no callout.
2. **llms.txt.** In the same commit, add the new page to `llms.txt` as one line, `- [<title text before any " | ">](https://pagesofpurposellc.com/blog/<slug>.html): <meta description>`, at the end of the matching `### ` list under "Guides by situation" (Owner in jail or prison / Divorce / Co-owners, partial interests and partition / Heirs, probate and inherited houses / Foreclosure, liens, back taxes and tax sales / Other guides). Surgical insert only; never rewrite the file.
3. **Specialist page guide lists.** Also add the new page as an `<li><a href="/blog/<slug>.html"><title></a></li>` at the end of the "📚 Read our guides…" list on the matching `/sell/pages/{SLUG}.html`.
   **Exception, jail pages:** on `/sell/pages/incarcerated-owner.html` the state guides live in the `<ul class="pp-state-hub">` list under "🗺️ Selling a house from jail or prison, state by state". Insert `<li><a href="/blog/<slug>.html"><strong><State></strong>: <title></a></li>` in alphabetical order by state. Non-state jail guides (federal prison, spouse, notary, etc.) go in the "📚 Start here" list instead.

## Tracking and privacy (added 2026-11-04)
Every page must load `/assets/consent.js` and `/assets/pop.js` exactly as the template (`blog/sell-probate-house-dallas-tx.html`) does, with the same `?v=` numbers. `consent.js` loads Google Analytics, Microsoft Clarity and the Meta Pixel, shows the privacy notice, honors Global Privacy Control / Do Not Track, and adds the "Your privacy choices" and "Terms of use" footer links. Never add tracking code directly to a page, never send form contents or personal data to any tracking tool, and never remove the consent.js tag. Before committing a new page, check it contains `assets/consent.js`.

## Inherited / probate / heirs video (added 2026-11-05)
Every new inherited-house, probate or heirs-can't-agree guide must include the explainer video right after the `pp-specialist` callout: copy the whole `<figure class="pp-video">…</figure>` block and the `VideoObject` JSON-LD script from `blog/sell-inherited-house-dallas-tx.html` exactly (video file `/video/when-someone-passes-away-captioned.mp4`, which has the captions burned in, and poster `/video/when-someone-passes-away.jpg`). Updated 2026-11-06: no `<track>` element and no "Read the transcript" dropdown; keep the transcript only inside the VideoObject JSON-LD. Do not re-encode or rename the video files.

## Titles, descriptions, llms.txt and stub links (added 2026-11-07, SEO audit)
Google cuts titles at about 60 characters and descriptions at about 155–160. The 2026-11-07 audit found 50 engine pages over those limits and 22 guides missing from `llms.txt`.
- `<title>`: 60 characters or fewer, counted after HTML entities are decoded. Put the situation and place first; drop "| Pages of Purpose" when it pushes the title past 60.
- `<meta name="description">`: 120–155 characters. When `og:`/`twitter:` title or description copy the meta values, keep them identical.
- Before committing, check both lengths with python and confirm the page's URL appears exactly once in `llms.txt`.
- Never link to a redirect stub (any page with `http-equiv="refresh"`, e.g. `/blog/what-happens-to-your-house-if-you-go-to-prison.html`, `/blog/sell-house-owner-in-jail.html`, `/blog/selling-partial-interest-property-maryland.html`). Link the stub's canonical page instead (`/blog/can-you-sell-house-while-incarcerated.html` for the two jail stubs, `/blog/can-co-owner-sell-house-maryland.html` for the partial-interest stub).

## No near-duplicate pages (added 2026-11-07, hard rule)
Google treats pages that repeat the same text with a different place name swapped in as duplicate or doorway content and can drop all of them. In November 2026 the Maryland town and county pages were 80–88% identical and all 62 had to be rewritten.
- Every new or edited page (blog guide, city, county, state or situation page) MUST pass `python3 tools/check_duplicates.py <path-to-new-page>` before it is committed. The script compares the page's visible `<main>` text (5-word shingles, Jaccard) against every indexable page on the site. A score of 0.30 or more against any page is a FAIL: rewrite the page and run it again. Never commit a FAIL, and never "fix" a FAIL by adding noindex or deleting the other page.
- Location pages (city, town, county, state) must lead with a fact specific to that place, use that place's real numbers (for Maryland: the SDAT tax rates and homestead cap for that county/town, the county's Register of Wills seat), and use their own headings. No shared paragraphs of boilerplate wearing a different place name.
- When a page targets the same situation as an existing page in another state or city, the body must be about what is different in the new place (its statutes, courts, deadlines, taxes, local institutions), not a reworded copy.
- Report the highest score in the run report: `— dup max <score> vs <page>`.
