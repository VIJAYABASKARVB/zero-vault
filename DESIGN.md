---
name: Zero Vault
description: Zero-knowledge password manager with client-side encryption
colors:
  primary: "#008B1E"
  neutral-bg: "#121414"
  neutral-surface: "#1a1d1e"
  neutral-elevated: "#0a0c0d"
  neutral-border: "#3f3f46"
  text-primary: "#ffffff"
  text-secondary: "#9CA3AF"
  text-tertiary: "#6B7280"
  error: "#ef4444"
  error-bg: "#dc2626"
  accent-work: "#60A5FA"
  accent-personal: "#34D399"
  accent-finance: "#FBBF24"
  accent-developer: "#A78BFA"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    border: "2px solid {colors.primary}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-danger:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  input:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    border: "1px solid {colors.neutral-border}"
  card:
    backgroundColor: "transparent"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    border: "0.5px solid {colors.neutral-border}"
  modal:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  nav-sticky:
    backgroundColor: "rgba(0, 0, 0, 0.2)"
    padding: "20px"
  tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
  tab-inactive:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
  fab:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    size: "56px"
---

# Design System: Zero Vault

## 1. Overview

**Creative North Star: "The Dark Observatory"**

Zero Vault is a dark, precision-engineered interface for managing secrets. The atmosphere is clinical without being cold: dark surfaces (#121414) absorb attention, Vault Green (#008B1E) provides the single point of visual conviction. Every element exists for a reason. There is no decoration, no gradient, no glass. Just structure, hierarchy, and the quiet confidence of a system that knows exactly what it protects.

The design treats the user as technically literate. Copy is direct. Feedback is immediate. The master password screen is not a marketing moment; it is a security ritual performed in calm, deliberate steps.

**Key Characteristics:**
- Single accent color used sparingly and deliberately (Vault Green on ≤10% of surfaces)
- Flat by default, depth via tonal background shifts and thin borders
- Mono-forward typography for technical touchpoints (search, buttons, code)
- Zero decorative flourishes: no gradients, no glass, no illustrated embellishments

## 2. Colors

A restrained palette anchored by a single accent. The dark neutral range absorbs light; Vault Green provides the only color event. Category accent colors exist only inside the vault grid, never outside it.

### Primary
- **Vault Green** (#0081B): All interactive elements. Buttons, focus rings, active tabs, password strength "Strong" indicator, the register CTA, the search border. Used on ≤10% of any screen. Its rarity is the point.

### Neutral
- **Observatory Black** (#121414): Primary surface background. The default state of every screen. A near-black tinted with a whisper of green (chroma ~0.008) so pure #000 never appears.
- **Deep Void** (#0a0c0d): Loading screens and the deepest background layer. Even darker than Observatory Black.
- **Panel Dark** (#1a1d1e): Modal dialogs, confirmation sheets, and elevated surfaces. One step lighter than the background to create tonal separation without shadows.
- **Zinc Edge** (#3f3f46): Borders, dividers, and card strokes. Thin, precise, recessive.
- **White Pure** (#ffffff): Primary text. High contrast on dark backgrounds.
- **Ash Muted** (#9CA3AF): Secondary text, placeholder text, inactive controls.
- **Ash Dim** (#6B7280): Tertiary text, metadata, captions.

### Semantic
- **Error Red** (#ef4444): Validation messages, error banners, required field indicators.
- **Delete Red** (#dc2626): Destructive action buttons.

### Category Accents
- **Work Blue** (#60A5FA / rgba(59,130,246,0.2)): Work category badge.
- **Personal Green** (#34D399 / rgba(34,197,94,0.2)): Personal category badge.
- **Finance Amber** (#FBBF24 / rgba(245,158,11,0.2)): Finance category badge.
- **Developer Purple** (#A78BFA / rgba(168,85,247,0.2)): Developer category badge.

### Named Rules
**The Single Voice Rule.** Vault Green is the only accent. Category colors exist as badge-only tints. If a screen uses more than Vault Green + one category color, something is wrong.

## 3. Typography

**Display Font:** Geist (with ui-sans-serif, system-ui fallback)
**Body Font:** Geist
**Label/Mono Font:** JetBrains Mono (for search, buttons, technical copy, category tabs, strength labels)

**Character:** A clean, technical sans paired with a precise monospace for interface touchpoints. Geist provides warmth through geometry, not decoration. JetBrains Mono signals that this is a tool for people who care about detail.

### Hierarchy
- **Display** (700, clamp(2.25rem, 5vw, 3.5rem), 1.1): Landing page hero headline only. Never used inside the vault.
- **Headline** (700, 1.5rem, 1.2): Section headers, modal titles, vault header.
- **Title** (600, 1.25rem, 1.3): Card labels, entry names.
- **Body** (400, 1rem, 1.5): Most text. Max line length 65-75ch on the landing page; no line length constraint in the dashboard grid.
- **Label** (500, 0.875rem, 1.4, JetBrains Mono): Button text, tab labels, form labels, metadata, badges.

### Named Rules
**The Mono Touch Rule.** JetBrains Mono is used for any text the user acts on: buttons, search input, copy actions, category tabs, password strength labels. Geist is for reading. JetBrains Mono is for doing.

## 4. Elevation

Flat by default. Depth is conveyed through tonal background shifts (Observatory Black -> Panel Dark -> Deep Void) and a single thin border (Zinc Edge, 0.5px). Shadows exist but are reserved for special cases: the FAB uses shadow for affordance, the hero image uses a green-tinted shadow for atmosphere. No surface casts a shadow at rest unless it demands attention.

### Shadow Vocabulary
- **FAB Shadow** (`box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)`): The floating action button. Hover escalates to `shadow-2xl`.
- **Hero Glow** (`box-shadow: 0 10px 15px -3px rgba(0, 139, 30, 0.2)`): The landing page hero image. A subtle green-tinted ambient glow.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation change) or special affordance (FAB). Cards, modals, and panels never carry a resting shadow.

## 5. Components

### Buttons
- **Shape:** Gently curved corners (8px / rounded-md).
- **Primary (Vault Green):** Background Vault Green (#008B1E), white text, 12px 24px padding. Hover reduces opacity to 90%. Used for all primary actions: Save, Create, Unlock, Copy.
- **Outline:** Transparent background, Vault Green border (2px), Vault Green text. Hover uses the same values. Used for secondary actions: Register, Get Started, Learn More.
- **Ghost:** Transparent background, white text. Used for tertiary actions: Login, Cancel. Hover transitions to white.
- **Danger:** Background Delete Red (#dc2626), white text. Reserved for destructive actions: Delete. Hover darkens to bg-red-700.

### Inputs / Fields
- **Style:** Flat background (Observatory Black #121414), Zinc Edge border (1px), 8px 12px padding, 8px rounded corners. Placeholder text in Ash Muted.
- **Focus:** Border shifts to Vault Green. No glow, no ring expansion. A clean color swap.
- **Error:** Border shifts to Error Red (#ef4444). Error message appears below in Error Red at 0.75rem in JetBrains Mono.
- **Disabled:** Opacity 50%. Used during loading states on the master password screen.

### Cards / Containers (Entry Cards)
- **Corner Style:** Gently curved (8px / rounded-md).
- **Background:** Inherit (transparent, revealing the Observatory Black canvas).
- **Border:** Zinc Edge, 0.5px. Extremely thin, nearly invisible at rest.
- **Shadow Strategy:** None at rest. Flat by default per The Flat-By-Default Rule.
- **Internal Padding:** 16px.
- **Hover:** Reveals edit (pencil) and delete (trash) icon group in the top-right corner. No card lift or background shift.

### Modals (Entry / Confirm)
- **Style:** Centered overlay with black/50 backdrop. Panel Dark (#1a1d1e) surface, 12px rounded corners, 24px padding. Max width 480px (entry) or 400px (confirm). Scrollable with max-h-90vh.
- **Close:** Text-gray-400 hover:text-white, positioned top-right.
- **Backdrop click:** Dismisses the modal.

### Navigation
- **Top Navbar:** Sticky, full-width. Three-column grid layout. Backdrop blur (4px) on black/20 background. Logo left, search center, user button right. No border bottom; floats on the page content.
- **Category Tabs:** Horizontal row of pill-buttons. Active tab fills with Vault Green (white text). Inactive tabs are Ash Muted text, hover shifts to white on white/10 background. 8px rounded corners, 200ms transition.

### FAB (Add Entry)
- **Style:** Fixed bottom-right (32px inset). 56px circle, Vault Green fill, white plus icon. Full rounded.
- **Shadow:** Resting shadow for affordance. Hover scales to 110% with elevated shadow (shadow-2xl). 200ms transition.

### Chips / Badges (Category Tags)
- **Style:** Rounded-full, small horizontal padding (4px 8px), 0.75rem font in JetBrains Mono. Background is a 20% tint of the category accent color (semi-transparent via rgba). Text is the full-opacity accent color.
- **Variants:** Work (blue), Personal (green), Finance (amber), Developer (purple). No gray default; if no category, no badge.

### Password Strength Indicator
- **Track:** Deep panel (#1F1F1F), full-width, 8px height, rounded-full.
- **Fill:** Dynamic width based on score (0-100%). Colors: red-500 (Weak), yellow-500 (Medium), Vault Green (Strong).
- **Label:** Score percentage shown inline next to "Strength" label.

## 6. Do's and Don'ts

### Do:
- **Do** use Vault Green sparingly. One accent element per screen region. If the search border is green, the button shouldn't also compete.
- **Do** use JetBrains Mono for all interactive text: buttons, search, tabs, copy actions.
- **Do** use tonal layering for depth: shift background color, not elevation.
- **Do** keep the master password screen minimal. No branding flourishes, no illustrations. A form, a title, and a button.
- **Do** show encryption state transparently. Let the user see that their vault is locked, deriving, or ready.

### Don't:
- **Don't** use gradient text, glassmorphism, or backdrop blurs beyond the navbar.
- **Don't** use side-stripe borders (border-left/right > 1px as an accent). Use full borders or background shifts.
- **Don't** use illustrated icons or emoji. Use clean line icons (react-icons, Heroicons-style).
- **Don't** wrap everything in a container card. Cards are for entries; most layout elements don't need one.
- **Don't** use modals as a first thought. Exhaust inline alternatives before overlaying.
- **Don't** use em dashes in copy. Use commas, colons, or periods.
- **Don't** use neon-on-black cyber aesthetics. This is a Dark Observatory, not a gaming terminal.
- **Don't** use placeholder profile images or generic avatars. Clerk's UserButton handles identity.
