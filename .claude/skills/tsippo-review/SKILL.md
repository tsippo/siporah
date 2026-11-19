---
name: tsippo-review
description: Review changes to the Tsippo website (Next.js 16, Dutch + English) before they are committed or merged. Use when asked to review, check or approve the current changes, a branch, or a PR in this repo, or before pushing.
---

# Tsippo code review

Review the changes, not the whole codebase. Report problems that would hurt real visitors (kids, parents, the author) first; skip style nitpicks that ESLint already covers.

## 1. Find what changed

- Uncommitted work: `git status --short` and `git diff` (plus `git diff --staged`)
- A branch: `git diff main...HEAD`
- A PR: `gh pr diff <number>`

Read every changed file in full, not only the diff hunks, before judging it.

## 2. Run the checks

```bash
npm run lint
npx tsc --noEmit
npm test
```

Any failure is a finding. If a change adds behaviour without a test in `src/__tests__/`, say which test is missing.

## 3. Project checklist

**Next.js 16 (not the version you remember)**
- Check APIs against `node_modules/next/dist/docs/` before flagging or suggesting them. Routing uses `src/proxy.ts`, not `middleware.ts`.
- `cacheComponents` is on: no `dynamic`, `revalidate`, `fetchCache` or `dynamicParams` route segment options (replaced by `"use cache"` + `cacheLife`); dynamic data needs `<Suspense>` or `"use cache"`.
- Server components must not import plain constants from `"use client"` files; shared constants live in `src/lib/`.
- `params` is a Promise: it must be awaited, then checked with `hasLocale` (call `notFound()` if it fails).

**Two languages**
- Every new text goes in both `nl.json` and `en.json` with the same keys (a test enforces this). No hard-coded Dutch or English in components, except the name "Tsippo".
- Links include the locale (`/${lang}/…`); the language switch must keep the visitor on the same page.

**Buying the book**
- Amazon links: `target="_blank"` + `rel="noopener noreferrer"` + a screen-reader hint that it opens a new tab.
- Book data (URL, cover, title, author) comes from `EDITIONS` in `src/lib/book.ts`, never copied into components.

**Animations and kids' devices**
- Every animation respects `prefers-reduced-motion` (CSS and JS).
- `requestAnimationFrame` and timers are cleaned up on unmount and pause when off screen or when the tab is hidden.
- Nothing should block the first paint of the hero; the globe image stays `fetchPriority="high"`.

**Accessibility**
- Images: meaningful `alt` text from the dictionary, or `alt=""` for decoration.
- Interactive things are `<a>`/`<button>`, reachable by keyboard, with visible focus.
- Accessible names start with the visible text.
- Colour contrast is at least 4.5:1 for body text.

**Images and performance**
- Use `next/image` with correct `width`/`height` and a realistic `sizes`. Plain `<img>` only with a comment saying why.
- New images in `public/images/` should be WebP/AVIF/PNG of a sensible size; flag anything over ~400 KB.

**Layout**
- Check at phone width (≤ 767px), tablet (≤ 900px) and large screens (≥ 1920px). The hero uses the `--u` unit; new hero pieces should too.

**Privacy and safety (a children's site)**
- No trackers, analytics, or third-party scripts without the owner's decision.
- No personal data collected without a clear reason.

## 4. Report

List findings from most to least serious. For each one give:
- the file and line, as a clickable link
- what goes wrong, for whom, and when
- a concrete fix

End with the check results (lint / types / tests) and a one-line verdict: **ready to merge** or **needs changes**. Don't change code unless asked; offer to fix the findings.
