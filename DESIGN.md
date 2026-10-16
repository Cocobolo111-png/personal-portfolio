---
name: He Yang Portfolio
description: Sporty UI, playful sculptural accents and an everyday product mindset; V0.2 Phase A.
colors:
  bg: "#f8f9f5"
  surface: "#eff2ec"
  ink: "#183e38"
  ink-soft: "#3d5751"
  muted: "#66736c"
  border: "#d8e0d6"
  border-strong: "#96938d"
  accent: "#236b53"
  accent-on-dark: "#b9e7be"
  accent-soft: "#dceccd"
  status: "#9a4c27"
  mint: "#b9e7be"
  orange: "#f5a16d"
  lilac: "#c9c6ed"
typography:
  display:
    fontFamily: "Archivo Variable, Source Han Sans SC, Noto Sans CJK SC, PingFang SC, sans-serif"
    fontSize: "clamp(48px, 5.25vw, 76px)"
    fontWeight: 720
    lineHeight: 1.32
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Archivo Variable, Source Han Sans SC, Noto Sans CJK SC, PingFang SC, sans-serif"
    fontSize: "clamp(2rem, 3vw, 3.2rem)"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Archivo Variable, Source Han Sans SC, Noto Sans CJK SC, PingFang SC, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
  label:
    fontFamily: "Archivo Variable, Source Han Sans SC, Noto Sans CJK SC, PingFang SC, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 650
    letterSpacing: "0.04em"
  tab:
    fontFamily: "Archivo Variable, Source Han Sans SC, Noto Sans CJK SC, PingFang SC, sans-serif"
    fontSize: "11px"
    fontWeight: 650
    letterSpacing: "0.035em"
rounded:
  frame: "0px"
  notice: "12px"
  pill: "99px"
spacing:
  '1': "0.5rem"
  '2': "0.75rem"
  '3': "1rem"
  '4': "1.5rem"
  '5': "2rem"
  '6': "3rem"
  '7': "4.5rem"
  '8': "7rem"
  '9': "10rem"
components:
  chapter-tab:
    backgroundColor: "transparent"
    textColor: "#5b6c62"
    typography: "{typography.tab}"
    rounded: "{rounded.pill}"
    padding: "0 17px"
  chapter-tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    typography: "{typography.tab}"
    rounded: "{rounded.pill}"
  editorial-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.frame}"
    padding: "0.35rem 0"
  editorial-link-hover:
    textColor: "{colors.accent}"
  navigation:
    textColor: "{colors.ink}"
    height: "100px"
  availability-notice:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.notice}"
    padding: "10px 16px"
  wip-status:
    textColor: "{colors.status}"
    typography: "{typography.label}"
  project-frame:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.frame}"
---

# Design System: He Yang Portfolio — V0.2 Phase A

## Overview

**Creative North Star: "Everyday Momentum / 日常的行动感"**

Sporty UI × Playful 3D × Lifestyle App gives this recruitment portfolio a curious, hands-on personality. A fresh off-white ground and deep teal type keep the page readable; forest-green controls and three soft sculptural accents add a sense of movement without competing with the person or the work.

Compact pill controls and a spacious centered introduction form the current expressive layer. The existing project evidence keeps its flat, ruled composition. Depth belongs to the decorative sculptures and small control feedback, while factual material stays easy to inspect. This records the implemented V0.2 Phase A direction for user review; it does not authorize Phase B expansion.

This document supersedes the historical Swiss/red identity in the previous DESIGN.md and compatibility documents. The active surface contract in `.impeccable/surfaces/src-app-tsx.md` owns homepage composition and phase scope. Runtime sources are `src/styles/tokens.css`, `hero.css`, `globals.css` and the current components; dormant legacy section styles are not new design guidance.

**Key Characteristics:**
- Fresh off-white and deep teal provide the reading foundation; forest green handles interaction.
- Mint, apricot and lilac are decorative sculpture accents, not extra text or status colors.
- Self-hosted Archivo and the existing CJK fallback order remain the only type family system.
- Compact pill controls coexist with flat, square project evidence frames.
- Short chapter transitions and mild scroll movement stop for reduced-motion preferences.

## Colors

The frontmatter records the shared CSS palette without renaming runtime tokens. Green is the interactive voice; pastel colors give the decorative objects their distinct material character.

### Primary

- **Forest Green (`accent`)** carries highlighted statement text, active navigation marks, hover and focus.
- **Mint on Dark (`accent-on-dark`)** is the existing light-on-dark alias; it shares the mint value rather than defining another hue.
- **Soft Green Feedback (`accent-soft`)** supports the scroll control hover.

### Secondary

- **Mint Sculpture (`mint`)**, **Apricot Sculpture (`orange`)** and **Lilac Sculpture (`lilac`)** describe the three artwork families. Their CSS materials contain local highlight/shadow shades, not a broader semantic palette.

### Tertiary

- **Warm WIP Brown (`status`)** keeps In Progress readable and distinct from decorative apricot.

### Neutral

- **Fresh Off-white (`bg`)** covers the page and the scrolled navigation surface.
- **Soft Sage Surface (`surface`)** contains project previews.
- **Deep Teal Ink (`ink`)** carries headings, body text and selected tabs; **Soft Teal Ink (`ink-soft`)** supports descriptions.
- **Sage Gray (`muted`)** carries secondary metadata and unavailable navigation labels.
- **Sage Hairline (`border`)** divides evidence; **Strong Hairline (`border-strong`)** is the retained stronger workflow divider.

**The Reading First Rule.** Use deep teal and forest green for readable content and controls. Reserve mint, apricot and lilac for decorative artwork.

## Typography

**Display and Body Font:** Self-hosted Archivo Variable, followed by Source Han Sans SC, Noto Sans CJK SC, PingFang SC and sans-serif. No added font or font package.

**Character:** The same grotesk family serves confident Chinese headlines, compact English labels and precise project details. The italic lowercase personal mark adds energy without introducing a second display family.

### Hierarchy

- **Display:** The frontmatter display role is the current desktop Hero heading. At mobile widths it becomes `clamp(31px, 8.6vw, 46px)` with line-height (1.48).
- **Title:** Project names use the title role; on mobile they settle at (2rem).
- **Body:** Base reading uses the body role. Hero supporting copy uses (15px / 1.9), a maximum width (420px), and on mobile (13px / 1.9) within (275px).
- **Label:** Project metadata uses the label role. Navigation is (14px, weight 550), reducing to (12px) on mobile.
- **Tab:** Desktop labels use the tab role; tablet and mobile use (10px), with (9px) below the smallest breakpoint.
- **Personal mark:** The lowercase italic mark is (43px, weight 850); mobile uses (36px). Preserve the compact name lockup on desktop and mark-only treatment on mobile.

Legacy `--text-display` and `--text-xl` remain in the CSS scale for retained components; they are not the active Hero headline specification.

## Layout

The shared content container is capped at (92rem), with fluid page padding `clamp(1.25rem, 3.5vw, 4rem)`. At mobile widths, page padding becomes (1.15rem). Use the existing spacing scale rather than imposing a new grid on retained evidence.

The current Hero is spacious and centered; its exact chapter order and first-viewport arrangement belong to the active surface contract. It uses `100svh`, bounded by a desktop minimum (820px) and maximum (1120px). At the tablet breakpoint the minimum becomes (780px). Mobile keeps `100svh`, bounded by (780px–1000px), and places the tab controls in wrapping rows within (342px). These bounds intentionally allow the Hero to exceed short viewports.

Navigation is fixed, centered within the same container, and measures (100px) high on desktop or (82px) on mobile. It acquires a solid page-color background and one-pixel divider after scroll (24px). Scroll targets and keyboard focus remain visible.

The retained Work row uses a (1.6fr / 1fr) split and stacks at (900px). The workflow frame is (16:10) with minimum height (420px), reducing to (370px) on mobile. Phase A preserves this layout and the existing footer. The Hero's (1000px), mobile (640px) and small-device (360px) breakpoints do not redefine the Work breakpoint.

## Elevation & Depth

Depth is local and purposeful: the CSS mint loop, apricot spark and lilac capsule simulate soft sculptural materials with gradients, inset shading and light cast shadows. Those material shades are implementation details in `hero.css`, not independent shared color tokens. The rest of the page uses tonal surfaces and fine borders; the shared lift token remains `none`.

### Shadow Vocabulary

- **Selected tab:** `0 3px 8px #183e3818` gives the active pill a small tactile lift.
- **Availability notice:** `0 6px 20px #183e3812` separates the temporary status message from the page.
- **Scrolled navigation:** `0 1px 0 var(--color-border)` acts as a divider, not an elevated card.
- **Sculpture shading:** Preserve each shape's local gradient, inset shadow and transform together; the exact material recipes remain in `hero.css`.

**The Evidence Stays Flat Rule.** Sculptures may use gradients, inset shading and soft shadows; project evidence keeps its existing flat frame and ruled information layout.

## Shapes

Pill geometry (99px) belongs to chapter tabs, the scroll cue and sculptural capsules. Temporary notices have soft corners (12px). Work frames remain square (0px) with one-pixel borders. The circular mint loop and eight-ray apricot spark are decorative silhouettes; do not use them as containers for factual content. The legacy `--radius-sm/md/lg` values still exist in CSS, but are not a universal ban on the implemented pills.

## Components

### Chapter tabs

Compact and tactile. Desktop tabs sit inside a pale sage pill rail (5px padding, 4px gap); individual buttons have a minimum target height (44px) and horizontal padding (17px). The selected tab uses deep teal with off-white text; hover uses a lighter sage field. Mobile removes the shared rail and gives each pill its own pale surface. Maintain `tablist` / `tab` / `tabpanel`, roving tab index, arrow and Home/End navigation, and native horizontal-swipe chapter switching.

A chapter changes its statement, description, tag and keyword together. The blur-and-rise transition settles in (500ms) with `cubic-bezier(.16, 1, .3, 1)`. There is no automatic slideshow. Scroll gently moves the text and artwork at different depths; reduced motion removes the transform and chapter animation.

### Navigation and availability notices

The compact personal mark anchors one side; Work, Play, Résumé and Story align on the other. Work is an anchor. Play, Story and the unconfigured Résumé use muted `aria-disabled` buttons that report truthful availability in a `role="status"` notice for (4000ms). They do not open fabricated content. The website has not configured a résumé PDF; selecting or mounting a real résumé belongs to later authorized work.

### Scroll action and text links

The scroll invitation uses a rounded outlined icon target (30px × 38px) inside an overall target of at least (100px × 66px); hover lowers the icon (4px) and adds soft green feedback. Retained text actions use a minimum target height (44px), an underline rule, and (180ms) color/border feedback; an arrow can shift (4px). Keep the global focus outline (2px) and offset (4px).

### Project evidence frame and status

Flat sage previews use square corners and a fine border. The current workflow keeps its numbered six-row structure; adjacent facts retain their existing ruled layout. Warm brown marks In Progress. A case-study link renders only when a real destination exists. Image, gallery and comparison variants remain evidence slots, not permission to synthesize results.

### Replaceable artwork slots

Three independent decorative objects are configured in `src/data/hero.ts` and rendered by `HeroArtwork.tsx`. Each accepts `src` and `media` (`image` / `video`) with desktop/mobile x, y and size; rotation, opacity, layer and parallax depth stay independently controllable. With no `src`, the current CSS shape renders. Supplied public assets use native image/video elements with `object-fit: contain`; there is no GLB viewer or new player runtime. Video is muted, inline and looping, pauses offscreen and for reduced motion, and is decorative rather than informational.

**The Media Slot Rule.** Replace artwork through the existing per-object image/video slots; preserve independent composition controls and do not turn decorative assets into project evidence.

No input or form component is currently rendered; do not invent a canonical form style during this documentation pass.

## Do's and Don'ts

### Do:
- **Do** preserve the declared Archivo and CJK fallback order.
- **Do** keep artwork behind the copy, with independent desktop and mobile composition controls.
- **Do** retain keyboard focus, 44px control targets and reduced-motion behavior.
- **Do** preserve the current Work layout and truthful WIP labels during Phase A.
- **Do** describe unavailable destinations with their actual current state; the website has not configured a résumé PDF.

### Don't:
- **Don't** reintroduce signal-red branding, the old numbered Hero square or the superseded Swiss-only visual restrictions.
- **Don't** spread sculptural gradients and shadows across factual project frames.
- **Don't** fabricate project screenshots, results, employers, metrics or resource destinations.
- **Don't** add Work / Play categorization, Story pages, a résumé modal or new animation/model libraries before Phase B is authorized.
