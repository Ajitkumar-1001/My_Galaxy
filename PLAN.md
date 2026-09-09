# Vite → Astro 7 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn this Vite + React 19 single-page portfolio into an Astro 7 site whose content sections are static HTML at build time, with the WebGL/animation pieces hydrated as React islands, and with unused dependencies removed. Same look, same behaviour.

**Architecture:** `src/pages/index.astro` composes the page. Seven React islands hydrate (`Splash`, `Navbar`, `Particles`, `Globe`, `Audio`, `Hero`, `Projects`). Five sections (`About`, `Experience`, `Skills`, `Contact`, `Footer`) stay `.tsx` but render with **no client directive**, so Astro emits their HTML at build and ships no JS for them. The one-time splash becomes an overlay island on top of already-rendered HTML, gated by a blocking head script so returning visitors never see it. Scroll-reveal animations for the static sections use one IntersectionObserver script plus CSS.

**Tech Stack:** astro 7.3.x, @astrojs/react 6.x, @astrojs/check 0.9.x, React 19, Tailwind v4 via @tailwindcss/vite (already installed), framer-motion 12, ogl, cobe, gsap (kept). Static output, Vercel, no adapter.

**Spec:** the approved plan at `~/.claude/plans/pure-cooking-rabin.md`. This document is self-contained; the spec is background.

## Global Constraints

- Node >= 22.12 (local: 22.23.1). Astro 7 requires it.
- Pixel parity with the current site is the acceptance bar. Any visual difference must be listed in the "Accepted differences" section below, nothing else.
- `npm run lint` currently reports **54 errors, 8 warnings**, all pre-existing (`@typescript-eslint/no-explicit-any`, `react-hooks/exhaustive-deps`). The migration must not add any. Removing some is fine.
- `tsconfig` keeps `noUnusedLocals` and `noUnusedParameters`. Every import you orphan must be removed in the same task.
- Islands receive plain-data props only. No functions, no JSX children from `.astro`.
- `public/` files are **not** deleted. gsap is **not** removed. `.gitignore` must not ignore `public/`.
- Inline scripts that must not be bundled use `is:inline`. Astro's compiler rejects unclosed tags in `.astro` files.
- Do not fix pre-existing bugs outside scope: every project has `demo2: ""` (View Demo opens an empty iframe); `Profilecard.tsx` onError falls back to a non-existent `src/assets/` path.
- Commit at the end of every task with the trailer lines shown in each commit step.

## Accepted differences (the only allowed deviations)

- Static-section hover and reveal effects use CSS easing instead of framer spring physics. Reveals play once (Skills used to re-animate on re-entry).
- The globe no longer shows the "Away from the World......" spinner while loading, nor a red "failed" badge on WebGL failure. It fades in when ready.
- No `<StrictMode>` wrapper (dev-only behaviour, no production effect).
- Footer year is computed at build time instead of in the browser.

## Verified facts the plan relies on

| Fact | Source |
|---|---|
| A React component in `.astro` **without** a `client:*` directive renders to static HTML, ships zero JS | docs.astro.build/en/guides/framework-components |
| `astro check` type-checks `.astro` frontmatter and props | @astrojs/check |
| cobe's `COBEOptions` requires `onRender`, `width`, `height` | `node_modules/cobe/dist/index.d.ts` |
| Only one SSR-unsafe line in the tree: `src/App.tsx:26` reads `sessionStorage` in a `useState` initializer | audit |
| `useInView(ref, 0.3)` in Hero/About/Contact/Project is a no-op (second arg is an options object), so the effective reveal threshold today is 0 | framer-motion API |
| Astro treats `src/pages/` as the routes directory | docs.astro.build/en/basics/astro-pages |
| Vercel needs no adapter for static Astro | docs.astro.build/en/guides/deploy/vercel |

---

### Task 0: Baseline

**Files:**
- Modify: `.gitignore` (revert working-tree change only)

- [x] **Step 1: Revert the uncommitted `public/` ignore line and branch**

```bash
git checkout -- .gitignore
git checkout -b astro-migration
git status --short   # expect only ?? CLAUDE.md and ?? public/*.png|jpeg
```

- [x] **Step 2: Record the Vite baseline**

```bash
npm run build 2>&1 | tail -5
ls -l dist/assets
du -ch dist/assets/*.js | tail -1        # write this number down: BASELINE_JS
npm run lint 2>&1 | tail -3              # expect "62 problems (54 errors, 8 warnings)"
```

- [x] **Step 3: Capture reference screenshots**

`npm run preview`, open http://localhost:4173 in a browser at widths 1440, 1024, 375. Screenshot the first visit (splash) and the reload (no splash), plus each section scrolled into view. Keep them for Task 5.

No commit for this task.

---

### Task 1: Astro shell with the whole app as one island (toolchain checkpoint)

Proves Astro 7 + Vite 8 + Tailwind v4 + React 19 + ogl/cobe work together before any component changes. The page is still an empty shell for crawlers at this point; that is expected.

**Files:**
- Create: `astro.config.mjs`, `src/layouts/Layout.astro`, `src/pages/index.astro`
- Move: `src/pages/{Hero,About,Experience,Skills,Project,Contact}.tsx` → `src/sections/`; `src/index.css` → `src/styles/global.css`
- Modify: `package.json`, `tsconfig.json`, `eslint.config.js`, `src/App.tsx:2-9`, `.gitignore`
- Delete: `index.html`, `src/main.tsx`, `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `src/vite-env.d.ts`

**Interfaces:**
- Produces: `Layout.astro` with a default `<slot />`; `src/styles/global.css` as the single global stylesheet; `src/sections/*` as the new home of section components.

- [x] **Step 1: Install Astro, remove the standalone Vite toolchain**

```bash
npm i astro @astrojs/react @astrojs/check
npm uninstall vite @vitejs/plugin-react @vitejs/plugin-react-swc
node -p "require('astro/package.json').version"   # 7.x
```

- [x] **Step 2: Write `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://ajitkumar.io",
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
```

- [x] **Step 3: Replace `tsconfig.json` (single config) and delete the two project references**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

```bash
git rm tsconfig.app.json tsconfig.node.json src/vite-env.d.ts vite.config.ts index.html src/main.tsx
```

- [x] **Step 4: Update `package.json` scripts**

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro check && astro build",
  "preview": "astro preview",
  "lint": "eslint ."
}
```

- [x] **Step 5: Ignore Astro's generated folder in ESLint and git**

In `eslint.config.js` change `{ ignores: ['dist'] }` to `{ ignores: ['dist', '.astro'] }`. Append `.astro/` to `.gitignore`.

- [x] **Step 6: Move the section components and the stylesheet**

```bash
mkdir -p src/sections src/styles
git mv src/pages/Hero.tsx src/pages/About.tsx src/pages/Experience.tsx src/pages/Skills.tsx src/pages/Project.tsx src/pages/Contact.tsx src/sections/
git mv src/index.css src/styles/global.css
```

In `src/App.tsx` change the six page imports:

```ts
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Project';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
```

(`./comp/...` and `./components/...` imports are unchanged.)

- [x] **Step 7: Write `src/layouts/Layout.astro`** (head copied from the old `index.html`; GTM must be `is:inline`)

```astro
---
import "../styles/global.css";
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ajitkumar Senthil Kumar – Portfolio</title>
    <meta name="description" content="Professional Portfolio of Mine! AK" />
    <link rel="canonical" href="https://ajitkumar.io/" />
    <!-- Google Tag Manager -->
    <script is:inline>
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", "GTM-THJCRGGG");
    </script>
    <!-- End Google Tag Manager -->
  </head>
  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript
      ><iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-THJCRGGG"
        height="0"
        width="0"
        style="display:none;visibility:hidden"></iframe></noscript
    >
    <!-- End Google Tag Manager (noscript) -->
    <slot />
  </body>
</html>
```

- [x] **Step 8: Write `src/pages/index.astro`** (temporary: whole app as a client-only island because `App.tsx:26` reads `sessionStorage` during render)

```astro
---
import Layout from "../layouts/Layout.astro";
import App from "../App";
---

<Layout>
  <App client:only="react" />
</Layout>
```

- [x] **Step 9: Build and probe whether `astro check` type-checks `.tsx`**

```bash
npm run build 2>&1 | tail -15         # expect 0 errors, dist/ produced
```

Probe: add `import { useId } from "react";` (unused) to the top of `src/comp/Footer.tsx`, run `npx astro check`. If it reports the unused import, remove the line and move on. If it does **not**, remove the line and change the build script to `"build": "astro check && tsc --noEmit && astro build"` so `noUnusedLocals` still gates the build.

- [x] **Step 10: Visual parity check**

```bash
npm run preview   # http://localhost:4321
```

Compare with Task 0 screenshots: splash on first visit, none on reload, particles, globe, all sections, mobile menu at 375. `view-source:` shows an `<astro-island>` with no section text inside; expected at this checkpoint.

- [x] **Step 11: Commit**

```bash
git add -A
git commit -m "Move to Astro 7 shell; app mounted as a single client:only island

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016fzuBG2ns53C7wgM2ZWCvD"
```

---

### Task 2: Compose the page in Astro (static HTML appears here)

**Files:**
- Create: `src/comp/Splash.tsx`
- Modify: `src/pages/index.astro` (full replace), `src/layouts/Layout.astro` (head script), `src/styles/global.css` (splash rules), `src/sections/Hero.tsx`, `src/comp/Profilecard.tsx`, `src/components/ui/globe.tsx`
- Delete: `src/App.tsx`, `src/App.css`, `src/components/LazyGlobe.tsx`

**Interfaces:**
- Produces: `html.splash` class (set by the head script on first visit, removed by `Splash` when done); `window` event `"splash:done"`; `Globe` prop `config?: Omit<COBEOptions, "onRender">`.
- Consumes: `Layout.astro` slot, `src/sections/*`.

- [x] **Step 1: Add the blocking head script to `Layout.astro`**

Insert directly after `<link rel="canonical" ... />`:

```astro
    <script is:inline>
      document.documentElement.classList.add("js");
      try {
        if (sessionStorage.getItem("hasVisited") !== "true") {
          document.documentElement.classList.add("splash");
        }
      } catch {}
    </script>
```

`js` is consumed by Task 3's reveal CSS. `splash` gates the overlay below.

- [x] **Step 2: Add the splash rules to the end of `src/styles/global.css`**

```css
/* Splash overlay: only shown when the head script marked a first visit.
   Default (no JS, crawlers) is no overlay and a scrollable page. */
#splash {
  display: none;
}
html.splash #splash {
  display: block;
}
html.splash {
  overflow: hidden;
}
```

- [x] **Step 3: Create `src/comp/Splash.tsx`** (extracted from the splash branch of `App.tsx`; `Galaxy` mounts only for first-time visitors so returning visitors never create a WebGL context)

```tsx
import { useEffect, useState } from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import Galaxy from "./Galaxy";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 1 } },
};

const item: Variants = {
  hidden: { opacity: 0, scale: 0.2 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function Splash() {
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const control2 = useAnimation();
  const control3 = useAnimation();

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("splash")) {
      setDone(true);
      return;
    }
    setActive(true);
    let cancelled = false;
    (async () => {
      await wait(500);
      await control2.start("visible");
      await wait(500);
      await control3.start("visible");
      await wait(1500);
      if (cancelled) return;
      sessionStorage.setItem("hasVisited", "true");
      html.classList.remove("splash");
      window.dispatchEvent(new Event("splash:done"));
      setDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [control2, control3]);

  if (done) return null;

  return (
    <div id="splash" className="fixed inset-0 z-[100] overflow-hidden bg-black">
      {active && (
        <div className="absolute inset-0 w-full h-full z-1">
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={false}
            density={2.5}
            glowIntensity={0.2}
            twinkleIntensity={1}
            autoCenterRepulsion={0.2}
            starSpeed={2}
            saturation={0.1}
            hueShift={50}
            speed={2}
          />
        </div>
      )}

      <motion.div
        className="flex flex-col items-center justify-center min-h-screen relative z-10"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.h1
          className="text-4xl subpixel-antialiased md:text-6xl text-border-2 font-sans text-white font-extrabold text-center"
          variants={item}
        >
          <span className="bg-gradient-to-r from-blue-300 to-indigo-600 bg-clip-text text-transparent">Welcome</span> to{" "}
          <span className="bg-gradient-to-r from-blue-300 to-indigo-600 bg-clip-text text-transparent">My Galaxy</span>
        </motion.h1>

        <motion.h5
          className="text-2xl subpixel-antialiased md:text-4xl font-sans text-border-2 text-white border-white font-extrabold  space-y-10 text-center mt-10"
          variants={item}
          initial="hidden"
          animate={control2}
        >
          A space to host my{" "}
          <span className="bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent">Personal</span>{" "}
          <span className="text-white">/</span>{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Professional</span> works.
        </motion.h5>

        <motion.h5
          className="text-2xl subpixel-antialiased md:text-4xl font-sans text-border-2 text-white border-white font-extrabold  space-y-10 text-center mt-10"
          variants={item}
          initial="hidden"
          animate={control3}
        >
          Let's Explore !!....
        </motion.h5>
      </motion.div>
    </div>
  );
}
```

- [x] **Step 4: Widen the Globe config prop and use one animation runtime** (`src/components/ui/globe.tsx`)

Line 3: `import { useMotionValue, useSpring } from "motion/react"` → `import { useMotionValue, useSpring } from "framer-motion"`.

The props type:

```tsx
export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: Omit<COBEOptions, "onRender">
}) {
```

Nothing else changes; the component already overrides `onRender` inside `createGlobe(...)`.

- [x] **Step 5: Hero fixes** (`src/sections/Hero.tsx`)

a. Lines 2-3, drop the `.tsx` suffixes:

```ts
import ProfileCard from '../comp/Profilecard';
import TextType from '../comp/Texttype';
```

b. Line 69: the `<h2>` nested inside `<motion.h1>` is invalid HTML and would break hydration once server-rendered. Change the opening tag to

```tsx
Hi, I am <span className="sr-only">Ajitkumar Senthil Kumar</span> <span className='block sm:text-xl md:text-5xl font-sans font-extrabold brightness-110'><span className='bg-gradient-to-br from-blue-400 to-blue-500 bg-clip-text text-transparent text-outline-white'><TextType
```

and its closing `</h2>` (the line after `/></span>`) to `</span>`. The `sr-only` span puts the full name into the static HTML because `TextType` renders empty text on the server.

c. Lines 46-57, gate the entrance on the splash finishing:

```tsx
  useEffect(() => {
    if (!onView) return;
    const run = async () => {
      await control1.start("visible");
      await new Promise((res) => setTimeout(res, 1000));
      await control2.start("visible");
    };
    if (document.documentElement.classList.contains("splash")) {
      window.addEventListener("splash:done", run, { once: true });
      return () => window.removeEventListener("splash:done", run);
    }
    run();
  }, [onView, control1, control2]);
```

d. Asset paths: line 152 `href="../.././Ajitkumar_senthilkumar_AI.pdf"` → `href="/Ajitkumar_senthilkumar_AI.pdf"`; lines 180-181 `"../../IMG_5451 2.jpeg"` → `"/IMG_5451 2.jpeg"` (both props).

- [x] **Step 6: ProfileCard gate** (`src/comp/Profilecard.tsx`, the effect at lines 89-106)

```tsx
    useEffect(()=>{
      const sequence = async() => {
        await control1.start("visible");
        await new Promise((res)=> setTimeout(res,1000));
        await control2.start("visible");
        if (isHovered === true) {
          await control3.start("visible");
        }
        else{
          control3.start("hidden")
        }
      }
      if (document.documentElement.classList.contains("splash")) {
        window.addEventListener("splash:done", sequence, { once: true });
        return () => window.removeEventListener("splash:done", sequence);
      }
      sequence();
    },[control1,control2,control3])
```

- [x] **Step 7: Replace `src/pages/index.astro`** (same wrapper divs and z-index layering as `App.tsx`; the four `client:visible` on About/Experience/Skills/Contact are temporary and removed in Task 3)

```astro
---
import type { COBEOptions } from "cobe";
import Layout from "../layouts/Layout.astro";
import Splash from "../comp/Splash";
import Particles from "../comp/particles";
import Navbar from "../comp/navbar";
import BgMusicButton from "../comp/Audio";
import { Globe } from "../components/ui/globe";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Experience from "../sections/Experience";
import Skills from "../sections/Skills";
import Projects from "../sections/Project";
import Contact from "../sections/Contact";
import Footer from "../comp/Footer";

const globeConfig: Omit<COBEOptions, "onRender"> = {
  width: 1100,
  height: 1100,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.2,
  dark: 0.9,
  diffuse: 0.1,
  mapSamples: 24000,
  mapBrightness: 2,
  baseColor: [0.1, 0.2, 0.3],
  markerColor: [0.2, 0.4, 0.6],
  glowColor: [0.2, 0.3, 0.5],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.05 },
    { location: [23.8103, 90.4125], size: 0.04 },
    { location: [30.0444, 31.2357], size: 0.04 },
    { location: [39.9042, 116.4074], size: 0.05 },
    { location: [-23.5505, -46.6333], size: 0.05 },
    { location: [19.4326, -99.1332], size: 0.05 },
    { location: [40.7128, -74.006], size: 0.06 },
    { location: [34.6937, 135.5022], size: 0.04 },
    { location: [41.0082, 28.9784], size: 0.04 },
  ],
};
---

<Layout>
  <main class="relative">
    <Splash client:load />

    <div class="fixed inset-0 z-0">
      <Particles
        client:idle
        particleCount={1200}
        particleSpread={20}
        particleColors={["#ffffff", "#1ffff", "#3f3f3f", "#fefefe"]}
        moveParticlesOnHover={true}
        particleBaseSize={50}
        speed={0.25}
        cameraDistance={10}
        disableRotation={false}
        className="w-full h-full brightness-200 "
      />
    </div>

    <div class="relative z-10">
      <Navbar client:load />
      <BgMusicButton client:load src="/HaydenFolker.mp3" />

      <div class="fixed inset-0 w-screen h-screen pointer-events-none z-0 flex items-center justify-center">
        <div class="w-full h-full flex items-center justify-center">
          <Globe
            client:idle
            className="w-full h-full opacity-70 hover:opacity-10 transition-opacity duration-500"
            config={globeConfig}
          />
        </div>
      </div>

      <Hero client:load />
      <About client:visible />
      <Experience client:visible />
      <Skills client:visible />
      <Projects client:visible={{ rootMargin: "200px" }} />
      <Contact client:visible />
      <Footer />
    </div>
  </main>
</Layout>
```

- [x] **Step 8: Delete the old composition root**

```bash
git rm src/App.tsx src/App.css src/components/LazyGlobe.tsx
```

- [x] **Step 9: Build and verify static HTML**

```bash
npm run build 2>&1 | tail -15
grep -c "University at Buffalo" dist/index.html        # > 0
grep -c '<astro-island' dist/index.html                  # 11 (7 real + 4 temporary)
```

- [x] **Step 10: Browser verification (`npm run preview`)**

- DevTools console: **zero** hydration / "recoverable error" messages. Any such message means invalid HTML nesting inside an island (Profilecard, Project, Spotlightcard, Dialog were not scanned); fix by swapping the offending tag for a `span`/`div` with the same classes.
- DevTools → Application → Session Storage → clear; Network throttling Slow 3G; reload. Expect: black overlay from first paint, no page content flashing underneath, page not scrollable, overlay lifts after ~3 s, then Hero and ProfileCard animate in.
- Reload normally: no overlay at any point.
- Site matches Task 0 screenshots otherwise.

- [x] **Step 11: Commit**

```bash
git add -A
git commit -m "Compose page in Astro: splash overlay island, static sections, islands per component

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016fzuBG2ns53C7wgM2ZWCvD"
```

---

### Task 3: De-React the static sections

After this task About, Experience, Skills, Contact and Footer ship zero JS. Reveal animations come from one IntersectionObserver script and CSS.

**Files:**
- Modify: `src/layouts/Layout.astro` (reveal script), `src/styles/global.css` (reveal rules), `src/sections/Experience.tsx` (full replace), `src/sections/About.tsx`, `src/sections/Contact.tsx`, `src/sections/Skills.tsx`, `src/data/data.ts:17,29,43,56`, `src/pages/index.astro`
- Delete: `src/hooks/useMobile.ts`, `src/data/animate.ts`

**Interfaces:**
- Produces: CSS classes `reveal`, `reveal-left`, `reveal-right`, `reveal-pop`, `reveal-line`; the observer adds `in`.
- Consumes: `html.js` from Task 2.

- [x] **Step 1: Reveal CSS, appended to `src/styles/global.css`**

```css
/* Scroll reveal for the static sections. Only active when JS is present
   (html.js is set by the head script), so no-JS readers see everything. */
html.js .reveal {
  opacity: 0;
  transform: translateY(40px) scale(0.9);
  /* scale and box-shadow are listed so Tailwind hover:scale-* / hover:shadow-*
     on the same element still ease (Tailwind v4 sets the standalone `scale` property). */
  transition:
    opacity 0.7s ease-out,
    transform 0.7s ease-out,
    scale 0.4s ease-out,
    box-shadow 0.4s ease-out;
}
html.js .reveal-left {
  transform: translate(-50px, 30px);
}
html.js .reveal-right {
  transform: translate(50px, 30px);
}
html.js .reveal-pop {
  transform: scale(0);
  transition-duration: 0.5s;
}
html.js .reveal-line {
  opacity: 1;
  height: 0;
  transform: none;
  transition: height 1.5s ease-in-out;
}
html.js .reveal.in {
  opacity: 1;
  transform: none;
}
html.js .reveal-line.in {
  height: calc(100% - 100px);
}
@media (prefers-reduced-motion: reduce) {
  html.js .reveal {
    transition: none;
    opacity: 1;
    transform: none;
  }
  html.js .reveal-line {
    height: calc(100% - 100px);
  }
}
```

- [x] **Step 2: Reveal script in `Layout.astro`**, inserted just before `</body>` (a bundled module script; runs after the DOM is parsed):

```astro
    <script>
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      });
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    </script>
```

- [x] **Step 3: Replace `src/sections/Experience.tsx`**

```tsx
import React from "react";
import { experience_content } from "../data/data";

const Experience: React.FC = () => {
  return (
    <section id="experience" className="min-h-screen flex flex-col justify-center items-center bg-transparent py-24 w-full relative z-10 overflow-hidden">

      {/* Ambient background glow to fit the Galaxy theme */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[800px] bg-blue-600/10 rounded-[100%] blur-[120px] pointer-events-none -z-10"></div>

      <div className="text-center mb-24 relative z-20">
        <h1 className="reveal text-2xl md:text-3xl font-extrabold font-sans bg-gradient-to-tr from-blue-300 via-blue-700 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Experience
        </h1>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 flex flex-col space-y-16">

        {/* The Vertical Glowing Timeline Axis */}
        <div className="reveal reveal-line absolute z-0 w-[3px] bg-gradient-to-b from-blue-400 via-transparent to-black-600 left-[40px] md:left-1/2 transform md:-translate-x-1/2 top-4 shadow-[0_0_20px_rgba(59,130,246,0.8)] rounded-full"></div>

        {experience_content.map((exp, index) => {
          // Even indices will display the card on the left side on desktop
          const isEven = index % 2 === 0;

          return (
            <div key={exp.id} className={`relative z-10 flex items-center justify-start md:justify-between w-full flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}>

              {/* Desktop offset spacer */}
              <div className="hidden md:block md:w-[45%]"></div>

              {/* Center Celestial Node */}
              <div className="absolute left-[40px] md:left-1/2 transform -translate-x-1/2 flex justify-center items-center h-full top-0 md:top-auto z-20">
                <div
                  className="reveal reveal-pop w-5 h-5 bg-black border-[3px] border-blue-400 rounded-full shadow-[0_0_20px_rgba(96,165,250,1)] relative"
                  style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
                >
                  {/* Pulse effect */}
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30"></div>
                </div>
              </div>

              {/* The Detail Card */}
              <div
                className={`reveal ${isEven ? 'reveal-left' : 'reveal-right'} w-full md:w-[45%] pl-[90px] md:pl-0 mt-2 md:mt-0 relative`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="p-6 sm:p-8 rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.4)] hover:bg-black/60 hover:border-blue-500/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-500 group">

                  <div className="flex flex-col lg:flex-row gap-5 items-center lg:items-start mb-6">
                    <div className="w-20 h-20 shrink-0 rounded-2xl bg-white/5 border border-white/10 shadow-lg p-3 flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:border-blue-400/50 transition-all duration-500">
                      <img src={exp.logo} alt={exp.company_name} className="w-full h-full object-contain brightness-110 group-hover:brightness-125 transition-all" />
                    </div>
                    <div className="text-center lg:text-left flex flex-col justify-center">
                      <h3 className="text-2xl font-bold bg-gradient-to-br from-gray-500 to-white bg-clip-text text-transparent mb-2 group-hover:from-white group-hover:to-blue-300 transition-colors drop-shadow-sm leading-tight">{exp.company_name}</h3>
                      <div className="inline-flex items-center justify-center lg:justify-start space-x-2 text-sm font-semibold text-gray-300 bg-white/10 border border-white/5 py-1.5 px-4 rounded-full w-max mx-auto lg:mx-0 shadow-inner">
                        <span>{exp.period_Start}</span>
                        <span className="text-blue-500">—</span>
                        <span>{exp.period_end}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-5 mt-2">
                    <h4 className="text-xl font-semibold text-white/95 mb-3 tracking-wide">{exp.role}</h4>
                    <p className="text-[15px] text-gray-300 leading-relaxed font-normal whitespace-pre-line group-hover:text-gray-100 transition-colors">{exp.role_description}</p>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Experience;
```

- [x] **Step 4: `src/sections/About.tsx`**

a. Replace the imports (lines 1-3) with:

```tsx
import React from "react";
```

b. Delete everything from `const secRef = useRef(null);` through the end of the `useEffect(() => { const animate ... }, [inView, control1, control2, control3]);` block (the refs, the three controls, `threshold`, `inView`, `hideContainer`, `parentVariant`, `childVariant`, the commented handlers, and the effect). Keep the `cards` array.

c. Replace the JSX from `<section id="about" ...>` to the end of the component with:

```tsx
    <section id="about" className="min-h-screen flex flex-col justify-center bg-transparent py-10">
      <div className="relative">
        <h1 className="reveal text-4xl font-extrabold font-sans mx-auto my-20 text-center bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent cursor-pointer">
          About
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10 md:px-20">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="reveal relative w-full max-w-2xl mx-auto p-[2px] rounded-2xl hover:scale-[1.03] hover:shadow-[0_0_15px_#3b82f6,0_0_30px_#8b5cf6,0_0_45px_#a855f7]"
              style={{ transitionDelay: `${0.3 + idx * 0.1}s` }}
            >
              <div className={`absolute inset-0 z-0 bg-gradient-to-tl ${card.gradient} rounded-[18px] brightness-120 opacity-50`} />

              <div className="relative z-10 bg-black/100 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between transition-shadow duration-300 ">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent text-center mb-2">
                  {card.title}
                </h2>
                <p className="bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent font-sans font-semibold text-center leading-relaxed text-md capitalize">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
```

- [x] **Step 5: `src/sections/Contact.tsx`**

a. Imports become:

```tsx
import React from "react";
import { GitHubLogoIcon, LinkedInLogoIcon, EnvelopeOpenIcon } from "@radix-ui/react-icons";
```

b. Delete `contactRef`, `threshold`, `inView`, `controls`, `parentVariant`, `childVariant`, `glowColors`, `iconVariants` and the `useEffect`.

c. Replace the JSX from `<section` to the end of the component with:

```tsx
    <section
      id="contact"
      className="min-h-screen py-24 px-6 flex flex-col items-center justify-center"
    >
      <div className="max-w-3xl text-center space-y-8">
        <h1
          className="reveal text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent brightness-120"
        >
          Contact Me
        </h1>

        <p
          className="reveal sm:text-lg md:text-2xl leading-relaxed font-bold bg-gradient-to-tr from-white to-gray-600 bg-clip-text text-transparent brightness-120"
          style={{ transitionDelay: "0.3s" }}
        >
          Whether you're interested in collaborating, hiring, or just want to connect —feel free to reach out. I'm always open to new opportunities in AI, machine learning, and full-stack development.
        </p>

        <div
          className="reveal flex flex-row justify-center items-center gap-6 mt-6"
          style={{ transitionDelay: "0.6s" }}
        >
          {[{
            href: "mailto:dev@ajitkumar.io",
            Icon: EnvelopeOpenIcon,
            glow: "hover:shadow-[0_0_15px_#f5f5f5,0_0_25px_#3b82f6,0_0_35px_#331FC5]",
          }, {
            href: "https://www.linkedin.com/in/ajitkumar1001",
            Icon: LinkedInLogoIcon,
            glow: "hover:shadow-[0_0_15px_#ffffff,0_0_25px_#3b56f6,0_0_35px_#341FC5]",
          }, {
            href: "https://github.com/ajitkumar-1001",
            Icon: GitHubLogoIcon,
            glow: "hover:shadow-[0_0_15px_#e0e0ff,0_0_25px_#3a55f5,0_0_35px_#321FC5]",
          }].map(({ href, Icon, glow }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`border border-blue-600 text-indigo-400 hover:text-white font-semibold px-6 py-3 rounded-2xl transition duration-200 ease-in-out hover:scale-[1.2] brightness-120 ${glow}`}
            >
              <Icon className="w-8 h-8" />
            </a>
          ))}
        </div>
      </div>
    </section>
```

- [x] **Step 6: `src/sections/Skills.tsx`**

a. Delete lines 1 through the line before `import { motion } from "framer-motion";` (the ~330-line commented-out earlier version; Tailwind scans comments and emits CSS for classes in them).

b. Remove `import { motion } from "framer-motion";` and `import useMobile from "../hooks/useMobile";`. Remove the line `const isMobile = useMobile(1024); // Use 1024px as breakpoint for lg screens`.

c. Heading: replace the `<motion.h2 initial=... whileInView=... transition=... className="text-4xl ...">` opening tag with `<h2 className="reveal text-4xl font-bold mt-12 bg-gradient-to-tr from-blue-900 to-blue-500 bg-clip-text text-transparent brightness-110">` and its `</motion.h2>` with `</h2>`.

d. Desktop branch: replace

```tsx
      {!isMobile && (
        <motion.div
          className="flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-12 max-w-none w-full z-20 py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
        >
```

with

```tsx
      <div className="reveal hidden lg:flex lg:flex-row justify-center items-center gap-12 lg:gap-12 max-w-none w-full z-20 py-16">
```

and inside it replace each category wrapper

```tsx
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, duration: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-8 px-4 py-8"
            >
```

with

```tsx
            <div
              key={category}
              className="reveal flex flex-col items-center space-y-8 px-4 py-8"
              style={{ transitionDelay: `${i * 0.2}s` }}
            >
```

Close them with `</div>` instead of `</motion.div>`, and replace the branch's trailing `</motion.div>\n      )}` with `</div>`.

e. Mobile branch: same treatment. `{isMobile && (<motion.div className="grid grid-cols-1 gap-12 max-w-sm w-full z-20 py-15" ...>` becomes `<div className="reveal grid grid-cols-1 gap-12 max-w-sm w-full z-20 py-15 lg:hidden">`; the per-category `motion.div` becomes `<div key={category} className="reveal flex flex-col items-center space-y-10" style={{ transitionDelay: `${i * 0.2}s` }}>`; closers become `</div>`; drop the `)}`.

- [x] **Step 7: Asset paths in `src/data/data.ts`**

Lines 17, 29, 43, 56: `"../../ub.jpeg"` → `"/ub.jpeg"`, `"../../hcs.jpeg"` → `"/hcs.jpeg"`, `"../../klicknet.jpeg"` → `"/klicknet.jpeg"`, `"../../L&T.webp"` → `"/L&T.webp"`.

- [x] **Step 8: Remove the temporary directives and the orphaned modules**

In `src/pages/index.astro` change `<About client:visible />`, `<Experience client:visible />`, `<Skills client:visible />`, `<Contact client:visible />` to `<About />`, `<Experience />`, `<Skills />`, `<Contact />`. `Projects` keeps its directive.

```bash
git rm src/hooks/useMobile.ts src/data/animate.ts
```

- [x] **Step 9: Build and verify**

```bash
npm run build 2>&1 | tail -15
grep -c '<astro-island' dist/index.html                              # 7
grep -l "Human Cloud Soft" dist/_astro/*.js || echo "static sections not in JS: OK"
grep -c 'class="reveal' dist/index.html                               # > 20
```

`npm run preview`: sections fade/slide in on scroll at 1440 and 375; the Experience timeline line grows; About cards glow and scale on hover; Contact icons glow; Skills orbits spin, tooltips show on hover, desktop layout at >= 1024px and mobile layout below; `astro check` 0 errors; console clean.

- [x] **Step 10: Commit**

```bash
git add -A
git commit -m "Render About, Experience, Skills, Contact, Footer as static HTML with CSS reveals

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016fzuBG2ns53C7wgM2ZWCvD"
```

---

### Task 4: Cleanup

**Files:**
- Delete: `src/comp/Notfound.tsx`, `src/comp/BlurText.tsx`, `src/comp/IconCloud.tsx`, `src/comp/Perspectivecarousel.tsx`, `src/comp/Scrambletext.tsx`, `src/comp/Scrambletext.css`, `src/comp/Shinnytext.tsx`, `src/comp/TiltedCard.tsx`, `src/comp/Profilecard.css`, `src/data/controls.ts`
- Modify: `src/comp/Texttype.tsx:1`, `components.json`, `package.json`, `CLAUDE.md`

- [x] **Step 1: Delete dead files and the stray directive**

```bash
git rm src/comp/Notfound.tsx src/comp/BlurText.tsx src/comp/IconCloud.tsx src/comp/Perspectivecarousel.tsx src/comp/Scrambletext.tsx src/comp/Scrambletext.css src/comp/Shinnytext.tsx src/comp/TiltedCard.tsx src/comp/Profilecard.css src/data/controls.ts
```

Delete line 1 of `src/comp/Texttype.tsx` (`"use client";`).

- [x] **Step 2: Uninstall zero-importer packages**

```bash
npm uninstall three @types/three @react-three/fiber @react-three/drei react-globe.gl @vercel/analytics @vercel/speed-insights @radix-ui/react-label radix-ui react-router-dom motion @types/node
grep -rn "motion/react\|react-router\|LazyGlobe\|useMobile\|three" src   # expect no output
```

- [x] **Step 3: Point shadcn at the moved stylesheet**

In `components.json`, `"css": "src/index.css"` → `"css": "src/styles/global.css"`.

- [x] **Step 4: Rewrite `CLAUDE.md`** (the current one documents the Vite layout)

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # astro dev, http://localhost:4321
npm run build      # astro check && astro build  (type errors fail the build)
npm run preview    # serve dist/
npm run lint       # eslint . (ts/tsx only; .astro files are not linted)
```

There is no test runner. Verification is `npm run build` plus `npm run lint`. `noUnusedLocals` / `noUnusedParameters` are on, so a stray import fails the build. Lint has a known backlog of `no-explicit-any` errors in the island components; do not add to it.

## What this is

A single-page Astro 7 portfolio deployed statically on Vercel at ajitkumar.io. React 19 islands for the interactive/WebGL parts, static HTML for everything else. Tailwind v4 (CSS-first, no config file), framer-motion, ogl (particles, splash shader), cobe (globe), gsap (typing cursor).

## Architecture

**`src/pages/index.astro` is the composition root.** Only this file lives in `src/pages/` (Astro's routes dir). `src/layouts/Layout.astro` owns the `<head>`, Google Tag Manager (`is:inline`), the global stylesheet, and two scripts: a blocking head script that sets `html.js` and, on a first visit, `html.splash`; and a bundled IntersectionObserver that adds `.in` to every `.reveal` element once.

**Islands vs static.** Components rendered with a `client:*` directive hydrate: `comp/Splash`, `comp/navbar`, `comp/particles`, `components/ui/globe`, `comp/Audio`, `sections/Hero` (with `Texttype` + `Profilecard`), `sections/Project` (with `Spotlightcard` + `Dialog`). Components rendered with **no** directive (`sections/About`, `Experience`, `Skills`, `Contact`, `comp/Footer`) are still `.tsx` but become static HTML at build; they must not use hooks that need the browser, and framer-motion must stay out of them. Island props must be plain data.

**Splash flow.** `Splash.tsx` server-renders a black overlay hidden by default (`#splash{display:none}`); `html.splash` shows it and locks scroll. On hydrate it runs the animation for first-time visitors, sets `sessionStorage.hasVisited`, removes `html.splash`, dispatches `window` event `splash:done`, then unmounts. `Hero` and `Profilecard` wait for `splash:done` before their entrance sequences.

**Scroll reveal.** Add `className="reveal"` (variants `reveal-left`, `reveal-right`, `reveal-pop`, `reveal-line`) and an optional `style={{ transitionDelay }}` to any static element that should animate in. Rules live at the end of `src/styles/global.css`, gated on `html.js` so no-JS readers see everything.

**Two component directories.** `src/comp/` is hand-written; `src/components/ui/` is shadcn/magicui-generated (`button`, `dialog`, `globe`, `orbiting-circles`). Imports are relative throughout.

**Content is inline.** Projects: the `projects` array in `src/sections/Project.tsx`. Experience: `experience_content` in `src/data/data.ts`. Skills: `skillCategories` in `src/sections/Skills.tsx`. Hero copy and ProfileCard props: `src/sections/Hero.tsx`. Globe markers: the `globeConfig` object in `index.astro`.

**Assets** in `public/` are referenced root-absolute (`/ub.jpeg`, `/HaydenFolker.mp3`).

**Tailwind v4 gotcha.** The shadcn `@theme inline` colour mapping in `global.css` is commented out, so `bg-primary`, `bg-background`, `text-muted-foreground` in `components/ui/button.tsx` and `dialog.tsx` generate no CSS. Uncomment that block if those utilities are needed.

**Known pre-existing issues, left alone:** every project has `demo2: ""` so "View Demo" opens an empty iframe; `Profilecard.tsx` onError falls back to a non-existent `src/assets/` path.
```

- [x] **Step 5: Build, lint, size**

```bash
npm run build 2>&1 | tail -5
npm run lint 2>&1 | tail -3          # no more than 54 errors / 8 warnings
du -ch dist/_astro/*.js | tail -1    # compare with BASELINE_JS from Task 0
```

- [x] **Step 6: Commit**

```bash
git add -A
git commit -m "Remove dead components and unused dependencies; document the Astro layout

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016fzuBG2ns53C7wgM2ZWCvD"
```

---

### Task 5: Deploy preview and final verification

- [x] **Step 1: Push and get a Vercel preview**

```bash
git push -u origin astro-migration
```

In the Vercel project settings confirm: Framework Preset = Astro, Build Command = `npm run build`, Output Directory = `dist`, Node.js version = 22.x. Open the preview URL.

- [x] **Step 2: Automated checks on the built output**

```bash
npm run build && npm run lint
grep -o 'id="\(hero\|about\|experience\|skills\|projects\|contact\)"' dist/index.html | sort -u   # 6 lines
grep -c "A Brief\|Human Cloud Soft\|Contact Me" dist/index.html                                   # > 0
grep -c '<astro-island' dist/index.html                                                           # 7
grep -l "Human Cloud Soft" dist/_astro/*.js || echo "static sections not in JS: OK"
du -ch dist/_astro/*.js | tail -1                                                                  # vs BASELINE_JS
```

- [x] **Step 3: Manual parity checklist** (preview URL and local, at 1440 and 375 wide)

- First visit: overlay from first paint, no content flash, page not scrollable, overlay removes itself, Hero and ProfileCard animate after it. Reload: no splash. Chrome DevTools "Disable JavaScript" + reload: every section readable, no overlay.
- Particles and globe render; globe fades in and drags; the wrapper's hover dims it.
- Navbar links scroll to each section; mobile menu opens, closes on tap and on resize past 768px.
- Music autoplays or unlocks on first interaction; mute/unmute fades.
- Hero typing runs; Projects button scrolls to projects; Resume opens `/Ajitkumar_senthilkumar_AI.pdf`.
- About/Experience/Skills/Contact reveal on scroll; Skills orbits spin, tooltips on hover, mobile layout under 1024px.
- Project cards tilt; "Read More" opens the blog iframe; the X closes it.
- Network tab: no 404s (`ub.jpeg`, `hcs.jpeg`, `klicknet.jpeg`, `L&T.webp`, `IMG_5451 2.jpeg`, `favicon.ico`, `gtm.js`).
- Console: zero hydration warnings. `view-source:` shows section text.

- [x] **Step 4: Open the PR**

```bash
gh pr create --base main --head astro-migration --title "Migrate from Vite SPA to Astro 7 with React islands" --body "$(cat <<'EOF'
## Summary
- Astro 7 static site; About/Experience/Skills/Contact/Footer are build-time HTML with zero JS
- Splash is now an overlay island on top of rendered HTML (crawlers and no-JS readers never see it)
- 7 React islands: Splash, Navbar, Particles, Globe, Audio, Hero, Projects
- Removed dead components and 12 unused packages

## Verification
- `npm run build && npm run lint` clean (lint backlog unchanged)
- Static HTML + island count checks in PLAN.md Task 5
- Manual parity checklist run on the Vercel preview

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_016fzuBG2ns53C7wgM2ZWCvD
EOF
)"
```

---

## Risks and how to detect them

- **Hydration mismatch from invalid HTML nesting inside an island.** React 19 recovers silently by client-rendering; only the DevTools console shows it. One known instance (Hero `h2` in `h1`) is fixed in Task 2. Profilecard, Project, Spotlightcard, Dialog were not scanned; fix any new report the same way.
- **`astro check` may not type-check `.tsx`.** The Task 1 probe decides whether `tsc --noEmit` joins the build script.
- **Vercel still on the Vite preset or an older Node.** Symptom: failed build. Fix in project settings.
- **Framer `initial="hidden"` inline `opacity:0` remains in the server HTML of Hero and Projects.** JS-executing crawlers are fine; no-JS readers get the static sections only.
- **Tailwind class detection.** Tailwind v4 scans `.tsx` and `.astro` automatically; a missing style after a file move usually means the file is gitignored.
