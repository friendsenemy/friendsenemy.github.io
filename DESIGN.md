# Pages of Purpose LLC — Design System

Rules of record for every page on pagesofpurposellc.com. The daily content engine and any future edits follow this file. If something here conflicts with a page, the page is wrong.

## 1. Creative brief

**Business.** Pages of Purpose LLC is a Maryland company that buys houses for cash in all 50 states, specializing in houses that are stuck for legal or family reasons: probate and estates nobody opened, heirs who disagree, owners who are incarcerated, co-owners who won't sign, divorces, liens, back taxes and broken chains of title. The company does the title and heir research itself and works with attorneys and courts where needed. It is not a law firm and gives no legal advice.

**Audience.** Adult children and relatives of someone who died; co-owners in a dispute; family members of an incarcerated owner; people in a divorce; executors and attorneys-in-fact. Usually stressed, unfamiliar with the vocabulary (personal representative, partition, quitclaim), often reading on a phone at night, often asking on someone else's behalf.

**What the site must make them feel.** "These people have seen my exact mess before, they know the paperwork, and they'll tell me straight." Calm competence. Not urgency, not hype.

**Primary job.** Get the visitor to describe their situation in the short form (address optional). Secondary: call.

**The subject's world.** County land records, deeds, estate files, the *chain of title* — the recorded sequence of owners a title company checks before a sale can close. A stuck house is a chain with a broken or missing link. That is the one idea only this client has, and it carries the design:

- The hero shows a stuck chain of title as an actual sequence (it is a real sequence, so the numbered/linked treatment is earned).
- Situations are organized the way a records clerk would file them — by *what is blocking the sale* — and presented as an index, not a wall of identical cards.
- Rules (thin lines) are used the way a deed uses them: to separate entries, not as decoration.

## 2. Direction, reviewed against the brief

First draft and what was changed:

| First instinct | Problem | Revised to |
|---|---|---|
| Glassmorphism, teal + sky blue, Cinzel/Josefin (UI UX Pro Max's generator output for "real estate") | Luxury-listing look; a probate seller is not shopping for a penthouse. Teal discards the existing navy/gold identity. | Keep the existing navy + gold identity, refine the values, add discipline. |
| Cream background + big serif headline | The single most common generated-site look (frontend-design calibration list, item 1). | Cool white paper and a civic sans for display. Serif only for long reading. |
| Grid of 15 icon cards for situations | SaaS card kit; emoji icons render as empty boxes on some devices. | A filed index: five groups by "what's blocking the sale", plain links with one-line explanations. |
| Fade-up on every section | Generic motion; nothing to do with the subject. | No scroll animation. Motion only answers an action (menu, FAQ, form). |
| Neon "Click for sound" pulse over an autoplaying video | Distracting, fails contrast, costs 1.8 MB on load. | Video moves to the founder section, click to play, real poster image, no autoplay. |

Check: could this design be reused for a SaaS startup by swapping the logo? No — the hero device, the situation index and the records vocabulary only make sense for this business.

## 3. Taste dials

- Design variance **6/10** — one distinctive device (the chain), everything else disciplined.
- Motion **2/10** — CSS transitions on user actions only; nothing moves on its own; `prefers-reduced-motion` removes all transitions.
- Density **5/10** — real information per screen; long guides keep their depth.

## 4. Color

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#14213A` | Primary. Headings, dark bands, header, footer. |
| `--ink-2` | `#22324F` | Secondary. Panels on dark bands, hover on dark. |
| `--paper` | `#FFFFFF` | Page background. |
| `--paper-2` | `#F3F5F8` | Alternate band, form fields. Cool, never cream. |
| `--rule` | `#D5DBE3` | Hairlines, borders, dividers. |
| `--text` | `#2B3445` | Body text on light (12.5:1 on white). |
| `--muted` | `#566173` | Secondary text on light (6.3:1 on white; 5.7:1 on paper-2). |
| `--gold` | `#C9A44C` | The one accent. Buttons (with ink text, 6.8:1), rules and text **on dark only** (6.8:1 on ink). Never as text on white. |
| `--brass` | `#7A5C14` | Gold-family text/links on light backgrounds (6.2:1 on white). |
| `--alert` | `#9B2C2C` | Form errors and the "broken link" marker in the chain only. |

No gradients. No colored glows. Shadows are neutral and used only for things that float (dialog, sticky bar).

## 5. Type

Self-hosted, OFL-licensed, free:

- **Public Sans** (variable, 400–800) — headings, UI, body on marketing pages. Built for U.S. government services; reads as public-record, not startup.
- **Source Serif 4** (variable, 400–700) — body copy of long guides only, where reading comfort matters.

Scale (1.25 ratio, rem): 0.875 / 1 / 1.125 / 1.375 / 1.75 / 2.25 / 2.875. Body 1.0625rem/1.6 sans, 1.125rem/1.7 serif. Headings weight 750, letter-spacing −0.015em, `text-wrap: balance`. Measure ≤ 70ch. Sentence case everywhere. No all-caps eyebrows, no single-word color accents in headlines, no "→" glued to button labels, no middle-dot meta strings.

## 6. Space and layout

Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96. Content width 1120px; reading width 70ch. Sections are separated by space and a single rule, not by stacked cards. Left-aligned text. Breakpoints: 375 (base), 600, 900, 1200.

## 7. Components

- **Header** `.pp-hd`: logo, Situations / Guides / About / Sell, phone link, one gold button "Ask a question". Below 900px: native `<details>` menu (works without JavaScript). Sticky on desktop only.
- **Skip link** first in body.
- **Buttons**: primary = gold fill, ink text, 6px radius, 48px min height; secondary = ink outline. Labels say what happens: "Ask a question", "Call (227) 235-9530".
- **Form** `.pop-ask`: visible labels, autocomplete attributes, address optional, consent checkbox optional with full text kept, `aria-live` status, errors inline in `--alert`.
- **FAQ**: native `<details>/<summary>`.
- **Callout**: paper-2 background with a 1px rule — no colored side stripes.
- **Floating button** (mobile only): one, bottom-right, ink with gold text, hides when the form is on screen.
- **Footer** `.pp-ft`: three link columns, contact, disclaimer, © 2026.

## 8. Accessibility floor

WCAG 2.2 AA: 4.5:1 text contrast, visible `:focus-visible` ring (3px gold on dark, 3px ink on light, 2px offset), 44×44px touch targets, labels on every control, skip link, one H1 per page, no heading level skipped, images sized to prevent layout shift, below-fold images lazy, decorative SVG `aria-hidden`.

## 9. What not to do (enforced)

Emoji as icons; purple or blue-purple gradients; neon/glow shadows; colored left-border "side tab" callouts; cards nested in cards; autoplaying media; fake testimonials, deal counts, review stars or credentials; claiming to give legal advice.
