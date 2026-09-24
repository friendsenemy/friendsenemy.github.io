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
