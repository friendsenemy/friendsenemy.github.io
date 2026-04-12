# Pages of Purpose LLC — Inbound Lead Generation System
## Complete Setup & Deployment Guide

---

## BEFORE ANYTHING ELSE — REQUIRED CUSTOMIZATIONS

**Do a global Find & Replace across ALL files before deploying:**

| Placeholder | Replace With | Where |
|-------------|-------------|-------|
| `Pages of Purpose LLC` | Your business name | All HTML files |
| `(227) 235-9530` | Your phone number | All HTML files |
| `pagesofpurposellc@gmail.com` | Your email address | All HTML files |
| `your area` | Your primary market city | All HTML files |
| `nationwide` | Your state | All HTML files |
| `00000` | Your ZIP code | geo-schema.json |
| `YOUR_FORMSPREE_ID` | Your Formspree form ID | All HTML files |
| `pagesofpurposellc.com/sell` | Your actual domain | All HTML files |
| `YOUR_LATITUDE` | GPS latitude | geo-schema.json |
| `YOUR_LONGITUDE` | GPS longitude | geo-schema.json |

**Recommended tool:** VS Code → Edit → Replace in Files (Ctrl+Shift+H)

---

## GITHUB PAGES DEPLOYMENT — STEP BY STEP

### Step 1: Create a GitHub Account
Go to github.com → Sign Up → Free plan is sufficient.

### Step 2: Create a New Repository
Option A — Personal domain: Name it `yourusername.github.io`
(Your site will be at: `https://yourusername.github.io`)

Option B — Custom path: Name it anything (e.g., `property-leads`)
(Your site will be at: `https://yourusername.github.io/property-leads`)

**Settings:** Public repo | Do NOT initialize with README (we have our own)

### Step 3: Upload Your Files
**Easy method (no command line):**
1. Click "Upload files" in the new repository
2. Drag and drop the ENTIRE `property-leads-system` folder contents
3. Make sure the folder structure is preserved:
   ```
   index.html          ← ROOT level
   robots.txt
   sitemap.xml
   llms.txt
   answers.html
   css/style.css
   js/main.js
   pages/contact.html
   pages/distressed.html
   pages/probate.html
   pages/title-issues.html
   pages/landlords.html
   pages/retail.html
   pages/fsbo.html
   pages/land.html
   blog/index.html
   blog/stop-foreclosure.html
   blog/sell-inherited-house.html
   blog/sell-house-with-lien.html
   blog/tired-landlord.html
   blog/sell-land-fast.html
   blog/sell-house-before-foreclosure.html
   blog/probate-property-guide.html
   blog/sell-house-as-is.html
   blog/sell-house-divorce.html
   blog/fsbo-vs-cash-buyer.html
   blog/sell-house-back-taxes.html
   blog/sell-rental-property-tenants.html
   blog/what-is-my-house-worth.html
   blog/sell-house-code-violations.html
   ```
4. Click "Commit changes"

**Git method (faster for updates):**
```bash
git init
git add .
git commit -m "Initial site launch"
git remote add origin https://github.com/YOURUSERNAME/REPONAME.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repository → **Settings**
2. Left sidebar: **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` | Folder: `/ (root)`
5. Click **Save**
6. Wait 2-5 minutes → Your site is live!

### Step 5: Connect a Custom Domain (Optional but Recommended)
**Get a domain:** namecheap.com or Porkbun.com (~$10-12/year)
Recommended format: `yourcompanyname.com` or `sellyour[city]house.com`

**Connect to GitHub Pages:**
1. In your domain registrar: Add a CNAME record: `www` → `yourusername.github.io`
2. Add 4 A records pointing to GitHub's IPs:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
3. In GitHub repo → Settings → Pages → Custom domain → Enter your domain
4. Check "Enforce HTTPS" (free SSL certificate — always use this!)
5. DNS propagation takes 24-48 hours

---

## FORMSPREE SETUP (FREE LEAD CAPTURE)

### Step 1: Create Account
Go to formspree.io → Sign Up with your email (pagesofpurposellc@gmail.com)
Free plan: 50 submissions/month

### Step 2: Create a Form
1. Dashboard → New Form
2. Name it: "Property Leads"
3. Email: Enter where you want leads delivered
4. Copy your Form ID (looks like: `xpzgowqa`)

### Step 3: Configure Notifications
- Settings → Email → Add your phone's email-to-SMS address for instant text alerts
  (Example for AT&T: `1234567890@txt.att.net`)

### Step 4: Install in the Website
Replace `YOUR_FORMSPREE_ID` in all HTML files with your actual ID:
```html
<!-- Before: -->
<form action="https://formspree.io/f/YOUR_FORMSPREE_ID">
<!-- After: -->
<form action="https://formspree.io/f/xpzgowqa">
```

### Step 5: Connect to Google Sheets (Optional)
Formspree → Your Form → Integrations → Google Sheets
→ Every lead automatically populates your spreadsheet CRM

---

## UPDATING THE SITE

### Adding a New Blog Article:
1. Create `blog/your-article-slug.html` using the template in CONTENT-ENGINE.md
2. Add it to `blog/index.html` (copy an existing blog card and edit)
3. Add it to `sitemap.xml` (copy an existing URL entry and update)
4. Upload the new file to GitHub → It deploys automatically in ~2 minutes

### Editing Content:
1. Open the file on GitHub → Click the pencil (edit) icon
2. Make changes → Commit changes → Auto-deploys

---

## SITE STRUCTURE AT A GLANCE

```
property-leads-system/
│
├── index.html                    ← HOMEPAGE (all seller types)
├── answers.html                  ← GEO Answer Blocks (AI citability)
├── robots.txt                    ← Allows all AI crawlers
├── llms.txt                      ← AI site guide
├── sitemap.xml                   ← Full page index
├── geo-schema.json               ← Copy into all pages' <head>
│
├── css/
│   └── style.css                 ← All styles
│
├── js/
│   └── main.js                   ← Form handling, mobile nav
│
├── pages/
│   ├── contact.html              ← LEAD CAPTURE (main form)
│   ├── distressed.html           ← Foreclosure/distressed sellers
│   ├── probate.html              ← Inherited/probate property
│   ├── title-issues.html         ← Liens, title problems
│   ├── landlords.html            ← Tired landlords
│   ├── retail.html               ← Just exploring/curious sellers
│   ├── fsbo.html                 ← FSBO sellers
│   └── land.html                 ← Land/lot sellers
│
└── blog/
    ├── index.html                ← All articles index
    ├── stop-foreclosure.html
    ├── sell-inherited-house.html
    ├── sell-house-with-lien.html
    ├── tired-landlord.html
    ├── sell-land-fast.html
    ├── sell-house-before-foreclosure.html
    ├── probate-property-guide.html
    ├── sell-house-as-is.html
    ├── sell-house-divorce.html
    ├── fsbo-vs-cash-buyer.html
    ├── sell-house-back-taxes.html
    ├── sell-rental-property-tenants.html
    ├── what-is-my-house-worth.html
    └── sell-house-code-violations.html
```

---

## KEY FILES TO READ

| File | When to Read |
|------|-------------|
| `LAUNCH-STRATEGY.md` | Before deploying — has the 7-day execution plan |
| `KEYWORDS.md` | For understanding target keywords and which to prioritize |
| `CONTENT-ENGINE.md` | When adding new articles |
| `GEO-SEO-IMPLEMENTATION.md` | For dominating AI search (ChatGPT, Perplexity, etc.) |
| `geo-schema.json` | Copy into index.html `<head>` after customization |

---

## FREE TOOLS USED (Zero Cost)

| Tool | Purpose | Cost |
|------|---------|------|
| GitHub Pages | Website hosting | Free |
| Formspree | Form-to-email lead capture | Free (50/mo) |
| Google Search Console | SEO monitoring | Free |
| Google Business Profile | Local search visibility | Free |
| Bing Webmaster Tools | Bing search indexing | Free |
| Canva | Simple graphics/thumbnails | Free tier |
| YouTube | Video marketing | Free |

---

## GETTING HELP

If you get stuck:
- GitHub Pages docs: docs.github.com/pages
- Formspree docs: help.formspree.io
- Google Search Console help: support.google.com/webmasters

Questions about content or strategy:
- See CONTENT-ENGINE.md for the AI-assisted article writing system
- See LAUNCH-STRATEGY.md for the week-by-week execution roadmap

