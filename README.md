# GamesPlayLand

A complete, dependency-free static portal for original browser parking and driving games.

Seven playable games, four category hubs, six guides, trust pages, search, full technical SEO and procedurally generated artwork — all built with Node.js and plain ES modules, with no runtime dependencies.

## Quick start

```powershell
node scripts/validate-levels.mjs   # geometry + puzzle solvability
node build.mjs                     # generate dist/
node scripts/qa.mjs                # static QA over dist/
node scripts/serve.mjs 4173        # local preview at http://localhost:4173/
```

Where npm is available: `npm run validate`, `npm run build`, `npm run qa`, `npm run serve`, `npm run check`.

Requires Node 18+ (developed on Node 22). No `npm install` step is needed.

## Repository layout

| Path | Contents |
| --- | --- |
| `build.mjs` | Static site generator entry point. |
| `src/` | Page templates, layout, styles, content data, game engines, procedural art libraries. |
| `scripts/` | Level validator, QA suite and preview server. |
| `docs/` | Keyword research, keyword map, build/verification report and 90-day SEO roadmap. |
| `dist/` | Generated, deployable site. **This is a build artifact — regenerate it with `node build.mjs` rather than editing by hand.** |

## Deployment

Publish the **contents of `dist/`** to the web root. Serve `/<slug>/` from `/<slug>/index.html` and map `404.html` as the custom not-found document. Canonical URLs assume `https://gamesplayland.com`.

See `docs/build-report.md` for full deployment notes and `docs/seo-roadmap.md` for the post-launch plan.

## Important

All games are original in-house implementations. They are not affiliated with the 2016 browser game *Parking Fury* by Andriy Pidvirnyy. No player counts, ratings or download numbers are published, and no third-party game files or screenshots are used.

## Status

Build, level validation and QA all pass: 23 pages + 404, 7 games, 49 validated levels/puzzles, 22 sitemap URLs, 0 QA failures, 0 warnings. Lighthouse scores 100/100/100 for accessibility, best practices and SEO on both the home page and a game page.
