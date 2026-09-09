# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # astro dev, http://localhost:4321
npm run build      # astro check && astro build  (type errors fail the build)
npm run preview    # serve dist/ (Astro 7 daemonizes it; `npx astro preview stop` to stop)
npm run lint       # eslint . (ts/tsx only; .astro files are not linted)
```

There is no test runner. Verification is `npm run build` plus `npm run lint`. `noUnusedLocals` / `noUnusedParameters` are on, so a stray import fails the build. Lint has a known backlog of `no-explicit-any` errors in the island components (Hero, Project, Profilecard); do not add to it.

## What this is

A single-page Astro 7 portfolio deployed statically on Vercel at ajitkumar.io (no adapter). React 19 islands for the interactive/WebGL parts, static HTML for everything else. Tailwind v4 (CSS-first, no config file), framer-motion, ogl (particles, splash shader), cobe (globe), gsap (typing cursor only). `PLAN.md` records the Vite-to-Astro migration and its decisions.

## Architecture

**`src/pages/index.astro` is the composition root.** Only this file lives in `src/pages/` (Astro's routes dir). `src/layouts/Layout.astro` owns the `<head>`, Google Tag Manager (`is:inline`), the global stylesheet, and two scripts: a blocking head script that sets `html.js` and, on a first visit, `html.splash`; and a bundled IntersectionObserver that adds `.in` to every `.reveal` element once.

**Islands vs static.** Components rendered with a `client:*` directive hydrate: `comp/Splash`, `comp/navbar`, `comp/particles`, `components/ui/globe`, `comp/Audio`, `sections/Hero` (with `Texttype` + `Profilecard`), `sections/Project` (with `Spotlightcard` + `Dialog`). Components rendered with **no** directive (`sections/About`, `Experience`, `Skills`, `Contact`, `comp/Footer`) are still `.tsx` but become static HTML at build and ship no JS; they must not use browser-only hooks, and framer-motion must stay out of them (its `initial="hidden"` styles would be baked into the HTML with nothing to animate them). Island props must be plain data: no functions, no JSX children from `.astro`.

**Splash flow.** `Splash.tsx` server-renders a black overlay hidden by default (`#splash{display:none}`); `html.splash` shows it and locks scroll. On hydrate it runs the animation for first-time visitors, sets `sessionStorage.hasVisited`, removes `html.splash`, dispatches the `window` event `splash:done`, then unmounts. `Hero` and `Profilecard` wait for `splash:done` before their entrance sequences. `Galaxy` sits behind an error boundary so a missing WebGL context cannot stall the sequence. Clear session storage to see the splash again in dev.

**Scroll reveal.** Add `className="reveal"` (variants `reveal-left`, `reveal-right`, `reveal-pop`, `reveal-line`) and an optional `style={{ transitionDelay }}` to any static element that should animate in. Rules live at the end of `src/styles/global.css`, gated on `html.js` so no-JS readers see everything.

**Two component directories.** `src/comp/` is hand-written; `src/components/ui/` is shadcn/magicui-generated (`button`, `dialog`, `globe`, `orbiting-circles`). Imports are relative throughout; the `@/` alias is not configured.

**Content is inline.** Projects: the `projects` array in `src/sections/Project.tsx`. Experience: `experience_content` in `src/data/data.ts`. Skills: `skillCategories` in `src/sections/Skills.tsx` (both desktop and mobile layouts are emitted, switched with `lg:`). Hero copy and ProfileCard props: `src/sections/Hero.tsx`. Globe markers: the `globeConfig` object in `index.astro`.

**Assets** in `public/` are referenced root-absolute (`/ub.jpeg`, `/HaydenFolker.mp3`). Filenames with spaces or `&` are fine; browsers encode them.

**Tailwind v4 gotcha.** The shadcn `@theme inline` colour mapping in `global.css` is commented out, so `bg-primary`, `bg-background`, `text-muted-foreground` in `components/ui/button.tsx` and `dialog.tsx` generate no CSS. Uncomment that block if those utilities are needed.

**Known pre-existing issues, left alone:** every project has `demo2: ""` so "View Demo" opens an empty iframe; `Profilecard.tsx` onError falls back to a non-existent `src/assets/` path; without WebGL the particles, globe and splash shader are simply absent (each island fails on its own).
