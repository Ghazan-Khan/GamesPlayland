# 90-day SEO roadmap — GamesPlayLand

This plan is built around what the site actually is: seven original playable games, honest editorial, and no fabricated metrics. It assumes the site is deployed on `https://gamesplayland.com` by Day 7.

Success criteria are expressed as *actions completed* and *measurements to take*, not as guaranteed rankings. No traffic or ranking numbers are promised.

## Days 0–7 — Foundation and launch

| Task | Owner | Done when |
| --- | --- | --- |
| Confirm contact email and hosting | Human | A real monitored inbox is configured; production URL responds over HTTPS. |
| Deploy `dist/` | Engineering | Home and all 22 indexable URLs return 200; `/404.html` returns 404. |
| Verify domain in Search Console | Human | Property verified; sitemap submitted. |
| Submit sitemap and request indexing for the 3 flagship game pages | Human | `sitemap.xml` reads cleanly; no coverage errors after 7 days. |
| Run `node scripts/qa.mjs` against the deployed origin | Engineering | 0 failures, 0 warnings. |
| Check Core Web Vitals in PageSpeed Insights (mobile + desktop) | Engineering | LCP/INP/CLS recorded as real numbers; any budget miss filed as a bug. |
| Add `rel="noopener"` audit and confirm no external trackers | Engineering | Confirmed by source review. |

## Days 8–30 — Measurement and technical cleanup

| Task | Owner | Done when |
| --- | --- | --- |
| Review Search Console coverage and indexing weekly | Human | Every valid page indexed; no "discovered – currently not indexed" cluster on important pages. |
| Record first real query impressions | Human | Query data exported; compared against `docs/keyword-map.csv`. |
| Fix any Core Web Vitals regressions | Engineering | Field LCP ≤2.5 s, INP <200 ms, CLS ≤0.1 on the majority of visits. |
| Check mobile touch issues reported via the contact page | Engineering | Every confirmed bug either fixed or acknowledged with a note. |
| Verify JSON-LD in Rich Results Test | Engineering | Organization, WebSite, BreadcrumbList, VideoGame and FAQPage all valid. |
| Add an editorial "last verified" date to each game page if content changes | Engineering | Dates reflect real updates, not automatic bumps. |

**Gate at Day 30:** if the head terms (`parking fury`, `parking games`) show no impressions, that is expected — the competitive set is large. Do not change strategy based on 30 days of head-term data. Look at the long-tail group instead.

## Days 31–60 — Long-tail expansion and internal linking

| Task | Owner | Done when |
| --- | --- | --- |
| Publish two new *original* games, chosen from contact-page suggestions | Engineering | Each has a validated level set, full original content, FAQ and VideoGame schema. |
| Strengthen internal links from game pages to the matching guides | Engineering | Every game page links to at least one relevant guide and one category. |
| Expand the three thinnest guides with genuinely new material | Editorial | No padding, no repeated FAQ; each addition answers a question seen in real search data. |
| Review query data and update the keyword map | Human | `keyword-map.csv` reflects observed queries, with new terms grouped A/B/C. |
| Add a "which game should I play" comparison if search data shows comparison intent | Editorial | Built only if there is evidence; otherwise skip. |
| Test one email outreach to relevant parking-game roundup authors | Human | Sent once, personalised, no link-exchange pressure. |

**Gate at Day 60:** long-tail pages (`parking fury controls`, `parking fury levels`, `truck parking`, `parking jam`) should have impressions. If a page has impressions but a low click-through rate, rewrite the title and description using the actual query language — never with invented numbers or superlatives.

## Days 61–90 — Consolidation and honest growth

| Task | Owner | Done when |
| --- | --- | --- |
| Prune or merge any page with zero impressions and no strategic role | Editorial | Consolidation done with 301 redirects; no thin pages left indexable. |
| Publish one data-backed editorial piece (e.g., how parking-game steering models differ) | Editorial | Original explanation, no scraped claims, links to our own playable examples. |
| Re-run the full validation and QA suite | Engineering | 0 failures, 0 warnings; sitemap matches built pages. |
| Re-audit Lighthouse on home, one game and one guide | Engineering | 100/100/100 maintained; any accessibility regression fixed. |
| Review the 90-day data and write a short retrospective | Human | Decisions for the next quarter recorded in `docs/`, including what did not work. |
| Decide whether to expand into a new adjacent category | Human | Decision based on measured demand, not guesswork. |

## Standing rules

1. **Never invent demand.** No search-volume figures, difficulty scores, player counts or ratings are published unless they come from a named, verifiable source.
2. **Never ship a broken game.** Every new level must pass `scripts/validate-levels.mjs` before it ships.
3. **Never imply affiliation with the 2016 *Parking Fury*.** Keep the disclaimer on every game page.
4. **Never buy links or mass-generate pages.** Growth comes from better games and better answers.
5. **Keep the tech budget.** No external fonts, no trackers, no framework, engine loaded only on Play click.
6. **Update content only when it is actually updated.** No fake "last updated" bumps.

## What would change the plan

- Search Console shows strong mobile intent for a query we do not cover → build one focused original page for it.
- A real bug report reveals a widespread touch issue → pause content work and fix it.
- A competitor publishes a demonstrably better original game → analyse honestly, improve ours or leave the term alone.
- Hosting cannot meet the performance budget → reduce image sizes and defer non-critical JS before adding new content.

No numeric traffic or ranking targets are set because none can be forecast responsibly from qualitative SERP observation alone.
