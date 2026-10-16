---
name: He Yang Portfolio
description: Accepted black-white-blue desktop Hero with a Sanvi-inspired project showcase.
colors:
  bg: "#ffffff"
  surface: "#f7f7f7"
  ink: "#161616"
  ink-soft: "#414141"
  muted: "#666666"
  border: "#e4e4e4"
  accent: "#1646e8"
  accent-soft: "#edf1ff"
  project-bg: "#b4b098"
  project-tag: "#77735c"
  project-tag-ink: "#ffffff"
typography:
  display:
    fontFamily: "Archivo Variable, Source Han Sans SC, Noto Sans CJK SC, PingFang SC, sans-serif"
    fontSize: "96px"
    fontWeight: 850
    lineHeight: 1.16
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Archivo Variable, Source Han Sans SC, Noto Sans CJK SC, PingFang SC, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Archivo Variable, Source Han Sans SC, Noto Sans CJK SC, PingFang SC, sans-serif"
    fontSize: "18px"
    lineHeight: 1.5
  label:
    fontFamily: "Archivo Variable, Source Han Sans SC, Noto Sans CJK SC, PingFang SC, sans-serif"
    fontSize: "12px"
    fontWeight: 500
rounded:
  folder: "28px"
  image: "7px"
  tag: "16px"
  pill: "99px"
---

# He Yang Portfolio — current visual contract

Updated 2026-10-17. Scope: the accepted Stage A desktop introduction and Stage B.1 Work refinement. Mode: Experience. This is one portfolio, independent of TrainTrace and its design rules.

## Authority and scope

The accepted Stage A implementation at `d79f145` is the visual baseline: `HeroSection.tsx`, `HeroArtwork.tsx`, `hero.ts`, `Navbar.tsx` and the A1/A2/A3 desktop rules in `hero.css`. Those files are preserved during Stage B.1. Current user instructions take priority, followed by the accepted implementation and this document. `PRODUCT.md` owns product truth; the existing homepage surface and compatibility entries point here.

Earlier forest-green, sage, mint/apricot/lilac and Sporty UI descriptions are not the current desktop palette. The root tokens and small-screen fallback still contain those historical values; their presence is compatibility, not permission to recolor the accepted desktop Hero. The existing footer is also retained. Playful 3D may remain a future art direction, but cannot override the black-white-blue baseline or authorize new features. No TrainTrace component, palette or layout is a portfolio specification.

## Accepted Stage A introduction

White page, near-black type and #1646e8 accents. Preserve the fixed 100px desktop navigation, five tabs, Chinese statements and each chapter's current artwork. The Who I Am composition uses the blue folded-paper image beside large black/blue text. Other chapters retain their existing SVG/media compositions, transitions and copy. The precise per-chapter sizes and offsets live in `hero.css` and `hero.ts`; do not replace them with an older generic centered-heading or three-sculpture layout.

Preserve the existing font family, chapter keyboard navigation, arrow/Home/End behavior, scroll movement and reduced-motion support. The font values in frontmatter describe key roles, not replacements for per-chapter accepted overrides. No new font package or 3D runtime is required.

## Work composition

Reference: https://sanvithi.com/ . Playwright inspected the first real Work card and its mouse enter/leave states. Reuse observable composition and rhythm with our own real content; do not import the reference's project assets or claim its results.

At 1440×900 the Work width is 880px; at 1920 it is 960px. The stable 420px interaction stage contains a 500px rounded folder extending 40px above and below. Keep the image centered at 50% width in the default state. Our genuine Love Journal screenshot stays 16:9; no simulated UI or artificial perspective is added. The folder's 28px standard radius approximates the reference superellipse.

Hover/focus enlarges the image 1.8 times to 90% of the folder width and raises its center 100px. The caption does not move. Four current tags cluster behind the image by default and spread beyond the left/right edges on interaction. Additional tags are assigned balanced columns and distinct row numbers. Optional tag objects in `projects.ts` can set label, side, row and rotations; rows beyond four per side reserve additional stage space. Do not repeat four fixed positions or introduce an automatic packing engine.

Use a heavily damped, converging motion, not a large bounce or a common ease-in-out on every element. Tag translation uses a sampled exponential response; image, rotation and fog use separate ~980–1100ms transitions. Interrupted interactions reverse from their current state. No extra scroll entrance or large mouse parallax is added.

## Progressive fog and layers

Layer order: theme canvas → tags → real screenshot → progressive lower fog → blue preview capsule → caption. The canvas itself fades at its bottom into the white page.

The fog contains three transparent backdrop-filter layers (2px, 6px, 14px), each revealed by a different vertical gradient mask, plus a white gradient. The upper image remains clear, then blur strengthens before the lower part fades to white. There is no fog border, rounded front panel or hard rectangular seam. On hover the fog field translates down 230px and fades away; on leave it smoothly returns. The field is clipped within the fixed stage, so surrounding content does not reflow. Only transform/opacity animate the fog; no per-frame height animation or Canvas/WebGL system is needed.

The blue 12px capsule appears near the pointer with short opacity/scale feedback. Keyboard focus uses a centered fallback position. Without a confirmed real demo URL it is a non-interactive preview label; a configured demoUrl renders a real link. Do not invent a detail route.

## Type, spacing and controls

Work outcome statement: 32px / 1.3, weight 600. Metadata: 18px / 1.5 with a 14px gap. Tags: 17px, 48px high; capsule: 12px, minimum 28px high. Keep Chinese copy's natural wrapping; do not add text or claims just to match the reference's English line count. Work heading spacing must leave room above the enlarged screenshot. Project colors are data-owned; Love Journal uses warm olive #b4b098 and dark olive #77735c with white tag text, coordinated with its existing screenshot.

The 80px document scroll padding plus Work's 20px desktop scroll margin accounts for the 100px fixed navigation. Initial fragment navigation runs after React mounts using requestAnimationFrame; hash changes and browser history remain supported. No arbitrary timeout is used for navigation. Preserve visible keyboard focus and disable transitions for reduced motion.

## Delivery boundaries

Homepage only; exactly one visible project. Existing React/Vite architecture and `src/data/projects.ts` remain the content source. No new dependency, CMS, details page, second project or Stage C work. Small-screen fallback remains usable, but this stage does not redesign it. Browser checks and visual comparison establish the tested desktop result; they do not imply real-device frame-rate or public deployment validation.
