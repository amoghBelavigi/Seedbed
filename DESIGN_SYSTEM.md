# Seedbed Design System

> A comprehensive design system for Seedbed — a modern idea management platform that nurtures startup ideas from concept to completion.

**Brand personality:** Modern, creative, supportive, organized
**Design philosophy:** Clean white aesthetic with blue primary accent. Subtle borders, generous whitespace, and a gardening/growth metaphor throughout.

---

## Table of Contents

1. [Color System](#1-color-system)
2. [Typography System](#2-typography-system)
3. [Spacing System](#3-spacing-system)
4. [Border Radius](#4-border-radius)
5. [Component Specifications](#5-component-specifications)
6. [Accessibility Guidelines](#6-accessibility-guidelines)
7. [Design Tokens](#7-design-tokens)
8. [CSS Utility Classes](#8-css-utility-classes)
9. [Usage Guidelines](#9-usage-guidelines)
10. [Implementation Guide](#10-implementation-guide)

---

## 1. Color System

Seedbed uses the **OKLCH** color space for perceptually uniform colors. All colors are defined as CSS custom properties and consumed via Tailwind CSS v4.

### 1.1 Primary Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--primary` | `oklch(0.55 0.19 260)` | `oklch(0.65 0.2 265)` | Buttons, links, active states |
| `--primary-foreground` | `oklch(1 0 0)` | `oklch(0.12 0 0)` | Text on primary backgrounds |

**Approximate hex:** Light `#4966d9` / Dark `#6b8af2`

The primary blue conveys trust, clarity, and focus — fitting for a productivity tool.

### 1.2 Secondary & Accent

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--secondary` | `oklch(0.965 0.002 260)` | `oklch(0.21 0 0)` | Secondary buttons, tags |
| `--secondary-foreground` | `oklch(0.25 0.02 260)` | `oklch(0.95 0 0)` | Text on secondary |
| `--accent` | `oklch(0.965 0.002 260)` | `oklch(0.21 0 0)` | Hover states, highlights |
| `--accent-foreground` | `oklch(0.25 0.02 260)` | `oklch(0.95 0 0)` | Text on accent |

### 1.3 Neutral Grays

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--background` | `oklch(0.995 0 0)` | `oklch(0.12 0 0)` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.95 0 0)` | Primary text |
| `--card` | `oklch(1 0 0)` | `oklch(0.17 0 0)` | Card surfaces |
| `--card-foreground` | `oklch(0.145 0 0)` | `oklch(0.95 0 0)` | Card text |
| `--muted` | `oklch(0.965 0 0)` | `oklch(0.21 0 0)` | Disabled backgrounds |
| `--muted-foreground` | `oklch(0.5 0 0)` | `oklch(0.6 0 0)` | Secondary text, captions |
| `--border` | `oklch(0.925 0 0)` | `oklch(0.26 0 0)` | Borders, dividers |
| `--input` | `oklch(0.925 0 0)` | `oklch(0.26 0 0)` | Input borders |
| `--ring` | `oklch(0.55 0.19 260)` | `oklch(0.65 0.2 265)` | Focus rings |

### 1.4 Semantic Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Delete, errors, warnings |

**Extended semantic colors** (for use in custom components):

| Name | Recommended Value | Usage |
|------|-------------------|-------|
| Success | `oklch(0.6 0.15 145)` / `#22c55e` | Completed states, Trophy Case |
| Warning | `oklch(0.72 0.17 55)` / `#eab308` | Caution, attention needed |
| Info | `oklch(0.55 0.19 260)` (same as primary) | Informational badges |

> **Note:** Success, warning, and info are not built into the base shadcn tokens. Use the chart colors or add custom properties when needed.

### 1.5 Chart / Data Visualization

| Token | Value | Color |
|-------|-------|-------|
| `--chart-1` | `oklch(0.55 0.19 260)` | Blue |
| `--chart-2` | `oklch(0.7 0.17 162)` | Teal/Cyan |
| `--chart-3` | `oklch(0.72 0.17 55)` | Gold/Yellow |
| `--chart-4` | `oklch(0.65 0.2 330)` | Pink/Magenta |
| `--chart-5` | `oklch(0.6 0.15 145)` | Green |

### 1.6 Sidebar

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--sidebar` | `oklch(1 0 0)` | `oklch(0.15 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.95 0 0)` |
| `--sidebar-primary` | `oklch(0.55 0.19 260)` | `oklch(0.65 0.2 265)` |
| `--sidebar-primary-foreground` | `oklch(1 0 0)` | `oklch(0.12 0 0)` |
| `--sidebar-accent` | `oklch(0.96 0.01 260)` | `oklch(0.21 0 0)` |
| `--sidebar-accent-foreground` | `oklch(0.25 0.02 260)` | `oklch(0.95 0 0)` |
| `--sidebar-border` | `oklch(0.93 0 0)` | `oklch(0.26 0 0)` |

---

## 2. Typography System

### 2.1 Font Families

| Role | Font | Variable | Fallback Stack |
|------|------|----------|----------------|
| **Body** | DM Sans | `--font-dm-sans` | `system-ui, -apple-system, sans-serif` |
| **Headings** | Space Grotesk | `--font-space-grotesk` | `system-ui, -apple-system, sans-serif` |
| **Monospace** | Geist Mono | `--font-geist-mono` | `ui-monospace, 'Cascadia Code', 'Fira Code', monospace` |

**Why these fonts?**
- **DM Sans** — Friendly, geometric sans-serif. Highly readable at small sizes. Supports the "approachable" brand trait.
- **Space Grotesk** — Distinctive, slightly technical headings. Conveys "modern" and "organized."
- **Geist Mono** — Clean monospace for code snippets and data. Matches the developer audience.

### 2.2 Available Weights

| Font | Weights |
|------|---------|
| DM Sans | 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) |
| Space Grotesk | 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) |
| Geist Mono | 400 (Regular) |

### 2.3 Type Scale

Based on a **1.25 major third** scale with a 16px base:

| Element | Size | Weight | Line Height | Letter Spacing | Font |
|---------|------|--------|-------------|----------------|------|
| **H1** | 36px (2.25rem) | 700 | 1.2 (43px) | -0.025em | Space Grotesk |
| **H2** | 30px (1.875rem) | 700 | 1.25 (37px) | -0.02em | Space Grotesk |
| **H3** | 24px (1.5rem) | 600 | 1.3 (31px) | -0.015em | Space Grotesk |
| **H4** | 20px (1.25rem) | 600 | 1.35 (27px) | -0.01em | Space Grotesk |
| **H5** | 18px (1.125rem) | 600 | 1.4 (25px) | 0 | Space Grotesk |
| **H6** | 16px (1rem) | 600 | 1.4 (22px) | 0 | Space Grotesk |
| **Body (lg)** | 18px (1.125rem) | 400 | 1.6 (29px) | 0 | DM Sans |
| **Body** | 16px (1rem) | 400 | 1.6 (26px) | 0 | DM Sans |
| **Body (sm)** | 14px (0.875rem) | 400 | 1.5 (21px) | 0 | DM Sans |
| **Caption** | 12px (0.75rem) | 500 | 1.5 (18px) | 0.01em | DM Sans |
| **Overline** | 11px (0.6875rem) | 600 | 1.5 (16px) | 0.08em | DM Sans |
| **Code** | 14px (0.875rem) | 400 | 1.6 (22px) | 0 | Geist Mono |

### 2.4 Usage in Tailwind

```html
<!-- Heading -->
<h1 class="font-heading text-4xl font-bold tracking-tight">Page Title</h1>

<!-- Body text -->
<p class="font-sans text-base leading-relaxed">Body content here.</p>

<!-- Caption -->
<span class="font-sans text-xs font-medium text-muted-foreground">Caption text</span>

<!-- Code -->
<code class="font-mono text-sm">console.log()</code>
```

---

## 3. Spacing System

### 3.1 Base Unit

Seedbed uses a **4px base unit** grid. All spacing values are multiples of 4px.

### 3.2 Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `0.5` | 0.125rem | 2px | Micro gaps (icon-to-text inline) |
| `1` | 0.25rem | 4px | Tight padding (badges, chips) |
| `1.5` | 0.375rem | 6px | Small internal padding |
| `2` | 0.5rem | 8px | Default gap between inline elements |
| `3` | 0.75rem | 12px | Card internal padding (compact) |
| `4` | 1rem | 16px | Standard padding, form field spacing |
| `5` | 1.25rem | 20px | Medium section gaps |
| `6` | 1.5rem | 24px | Card padding, section spacing |
| `8` | 2rem | 32px | Large section padding |
| `10` | 2.5rem | 40px | Layout gaps |
| `12` | 3rem | 48px | Page section margins |
| `16` | 4rem | 64px | Hero/header spacing |
| `20` | 5rem | 80px | Major layout breaks |
| `24` | 6rem | 96px | Page-level vertical rhythm |

### 3.3 Layout Spacing Guidelines

| Context | Recommended Spacing |
|---------|-------------------|
| Page horizontal padding | `px-4` (mobile) / `px-6` (tablet) / `px-8` (desktop) |
| Page vertical padding | `py-6` to `py-12` |
| Card internal padding | `p-4` (compact) / `p-6` (standard) |
| Between form fields | `gap-4` (16px) |
| Between card items in a grid | `gap-4` (16px) or `gap-6` (24px) |
| Between sections | `gap-8` (32px) or `gap-12` (48px) |
| Sidebar width | `w-60` (240px) or `w-64` (256px) |
| Max content width | `max-w-5xl` (1024px) or `max-w-6xl` (1152px) |

---

## 4. Border Radius

Built on a base radius of `0.75rem` (12px):

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--radius-sm` | 0.5rem | 8px | Badges, chips, small buttons |
| `--radius-md` | 0.625rem | 10px | Inputs, selects |
| `--radius-lg` | 0.75rem | 12px | Cards, dialogs (default) |
| `--radius-xl` | 1rem | 16px | Large containers, modals |
| `--radius-2xl` | 1.25rem | 20px | Feature cards |
| `--radius-3xl` | 1.5rem | 24px | Hero sections |
| `--radius-4xl` | 1.75rem | 28px | Special emphasis containers |

**Tailwind usage:** `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, etc.

---

## 5. Component Specifications

All components are built on **shadcn/ui** (New York style) with Radix UI primitives. Below are the key specifications and variants.

### 5.1 Buttons

#### Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| **Default (Primary)** | `bg-primary` | `text-primary-foreground` | none | Main CTAs: "Create Idea", "Research" |
| **Secondary** | `bg-secondary` | `text-secondary-foreground` | none | Secondary actions: "Cancel", "Back" |
| **Destructive** | `bg-destructive` | `text-white` | none | Delete, remove actions |
| **Outline** | `bg-transparent` | `text-foreground` | `border border-input` | Tertiary actions, toggles |
| **Ghost** | `bg-transparent` | `text-foreground` | none | Icon buttons, nav items |
| **Link** | `bg-transparent` | `text-primary` | none | Inline text links |

#### Sizes

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| `sm` | 32px | `px-3` | 14px | 16px |
| `default` | 36px | `px-4` | 14px | 16px |
| `lg` | 40px | `px-6` | 16px | 20px |
| `icon` | 36px | `p-0` (square) | — | 16px |

#### States

| State | Behavior |
|-------|----------|
| **Default** | Base styles |
| **Hover** | Slight opacity change (`hover:bg-primary/90`) |
| **Focus** | Focus ring: `ring-2 ring-ring ring-offset-2` |
| **Active** | Slight scale: `active:scale-[0.98]` (optional) |
| **Disabled** | `opacity-50 pointer-events-none` |
| **Loading** | Show spinner icon, disable clicks |

#### Example

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="default">Create Idea</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="ghost" size="icon"><TrashIcon /></Button>
<Button disabled>Processing...</Button>
```

### 5.2 Form Elements

#### Text Input

| Property | Value |
|----------|-------|
| Height | 36px |
| Padding | `px-3 py-2` |
| Border | `border border-input` |
| Border radius | `rounded-md` |
| Font size | 14px (`text-sm`) |
| Placeholder color | `text-muted-foreground` |
| Focus | `ring-2 ring-ring` |
| Disabled | `opacity-50 cursor-not-allowed` |

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div class="grid gap-2">
  <Label htmlFor="title">Idea Title</Label>
  <Input id="title" placeholder="Enter your idea..." />
</div>
```

#### Textarea

Same as input, but with:
- Min height: 80px
- Resize: vertical only (`resize-y`)
- Padding: `p-3`

#### Select

- Same dimensions as input
- Chevron icon right-aligned
- Dropdown uses `--popover` background

#### Checkbox / Radio

| Property | Value |
|----------|-------|
| Size | 16px x 16px |
| Border | `border border-primary` |
| Checked fill | `bg-primary` |
| Check icon | White, 12px |
| Focus | `ring-2 ring-ring ring-offset-2` |

### 5.3 Cards

| Property | Value |
|----------|-------|
| Background | `bg-card` |
| Border | `border border-border` |
| Border radius | `rounded-lg` |
| Shadow | None (clean aesthetic) or `shadow-sm` for elevation |
| Padding | `p-6` (standard) / `p-4` (compact) |

#### Card Anatomy

```
+------------------------------------------+
|  [Header]           [Actions/Badge]      |  <- p-6, border-b (optional)
|------------------------------------------|
|                                          |
|  [Content Area]                          |  <- p-6
|  Body text, form fields, etc.            |
|                                          |
|------------------------------------------|
|  [Footer]           [Buttons]            |  <- p-6, border-t (optional)
+------------------------------------------+
```

#### Idea Card Specific

```tsx
<Card className="hover:border-primary/30 transition-colors">
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="font-heading text-lg">{title}</CardTitle>
    <Badge variant={priorityVariant}>{priority}</Badge>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
  </CardContent>
  <CardFooter className="text-xs text-muted-foreground">
    {formattedDate}
  </CardFooter>
</Card>
```

### 5.4 Badges / Chips

| Variant | Background | Text |
|---------|-----------|------|
| Default | `bg-primary` | `text-primary-foreground` |
| Secondary | `bg-secondary` | `text-secondary-foreground` |
| Outline | `bg-transparent` | `text-foreground` |
| Destructive | `bg-destructive` | `text-white` |

**Custom priority badges:**

| Priority | Style |
|----------|-------|
| High | `bg-red-100 text-red-700` / dark: `bg-red-900/30 text-red-400` |
| Medium | `bg-yellow-100 text-yellow-700` / dark: `bg-yellow-900/30 text-yellow-400` |
| Low | `bg-green-100 text-green-700` / dark: `bg-green-900/30 text-green-400` |

### 5.5 Navigation

#### Sidebar Navigation Item

| State | Background | Text | Left Border |
|-------|-----------|------|-------------|
| Default | transparent | `text-sidebar-foreground` | none |
| Hover | `bg-sidebar-accent` | `text-sidebar-accent-foreground` | none |
| Active | `bg-sidebar-accent` | `text-sidebar-primary` | `border-l-2 border-sidebar-primary` |

#### Top-level structure

```
+--------+------------------------------------------+
|        |  [Header / Breadcrumbs]                  |
| Side   |------------------------------------------|
| bar    |                                          |
|        |  [Main Content Area]                     |
| 240px  |                                          |
|        |  max-width: 1152px                       |
|        |  padding: 24-32px                        |
+--------+------------------------------------------+
```

### 5.6 Dialogs / Modals

| Property | Value |
|----------|-------|
| Overlay | `bg-black/50` with backdrop blur |
| Background | `bg-card` |
| Border radius | `rounded-xl` |
| Max width | `max-w-lg` (default) / `max-w-2xl` (research) |
| Padding | `p-6` |
| Animation | Fade in + scale from 95% to 100% |

### 5.7 Toast Notifications

Using **Sonner** library. Positioned `bottom-right`.

| Type | Left Accent Color |
|------|------------------|
| Success | Green (`#22c55e`) |
| Error | Destructive red |
| Info | Primary blue |
| Warning | Gold/yellow |

---

## 6. Accessibility Guidelines

### 6.1 Color Contrast

All text must meet **WCAG 2.1 AA** requirements:

| Context | Minimum Ratio | Status |
|---------|--------------|--------|
| Body text on background | 4.5:1 | `foreground` on `background` passes |
| Large text (18px+ bold, 24px+) | 3:1 | All heading combos pass |
| Primary button text | 4.5:1 | White on `--primary` passes |
| Muted text on background | 4.5:1 | `muted-foreground` on `background` passes |
| Placeholder text | 3:1 minimum | `muted-foreground` on `input` — verify |

**Dark mode:** All dark mode tokens are calibrated for equivalent contrast ratios.

### 6.2 Focus Indicators

Every interactive element must have a visible focus indicator:

```css
/* Base focus style (applied globally in globals.css) */
* {
  @apply outline-ring/50;
}

/* Component focus style */
.focus-visible:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

| Element | Focus Style |
|---------|-------------|
| Buttons | `ring-2 ring-ring ring-offset-2 ring-offset-background` |
| Inputs | `ring-2 ring-ring` (inset) |
| Cards (interactive) | `ring-2 ring-ring ring-offset-2` |
| Links | `underline` + `ring-2 ring-ring` on keyboard focus |
| Sidebar items | Background change + `ring-2` |

### 6.3 Text Size Minimums

| Element | Minimum Size |
|---------|-------------|
| Body text | 14px (0.875rem) |
| Interactive labels | 14px (0.875rem) |
| Captions / helper text | 12px (0.75rem) |
| Button text | 14px (0.875rem) |
| Never go below | 11px (0.6875rem) — only for overlines |

### 6.4 Additional Requirements

- **Touch targets:** Minimum 44px x 44px for mobile tap targets
- **Motion:** Respect `prefers-reduced-motion` (already implemented in `globals.css`)
- **Screen readers:** Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.) and ARIA labels on icon-only buttons
- **Keyboard navigation:** All interactive elements reachable via Tab, activatable via Enter/Space
- **Color not sole indicator:** Never use color alone to convey meaning — pair with icons or text labels

---

## 7. Design Tokens

### 7.1 JSON Format

```json
{
  "color": {
    "primary": { "light": "oklch(0.55 0.19 260)", "dark": "oklch(0.65 0.2 265)" },
    "primary-foreground": { "light": "oklch(1 0 0)", "dark": "oklch(0.12 0 0)" },
    "secondary": { "light": "oklch(0.965 0.002 260)", "dark": "oklch(0.21 0 0)" },
    "secondary-foreground": { "light": "oklch(0.25 0.02 260)", "dark": "oklch(0.95 0 0)" },
    "background": { "light": "oklch(0.995 0 0)", "dark": "oklch(0.12 0 0)" },
    "foreground": { "light": "oklch(0.145 0 0)", "dark": "oklch(0.95 0 0)" },
    "card": { "light": "oklch(1 0 0)", "dark": "oklch(0.17 0 0)" },
    "card-foreground": { "light": "oklch(0.145 0 0)", "dark": "oklch(0.95 0 0)" },
    "muted": { "light": "oklch(0.965 0 0)", "dark": "oklch(0.21 0 0)" },
    "muted-foreground": { "light": "oklch(0.5 0 0)", "dark": "oklch(0.6 0 0)" },
    "accent": { "light": "oklch(0.965 0.002 260)", "dark": "oklch(0.21 0 0)" },
    "accent-foreground": { "light": "oklch(0.25 0.02 260)", "dark": "oklch(0.95 0 0)" },
    "destructive": { "light": "oklch(0.577 0.245 27.325)", "dark": "oklch(0.704 0.191 22.216)" },
    "border": { "light": "oklch(0.925 0 0)", "dark": "oklch(0.26 0 0)" },
    "input": { "light": "oklch(0.925 0 0)", "dark": "oklch(0.26 0 0)" },
    "ring": { "light": "oklch(0.55 0.19 260)", "dark": "oklch(0.65 0.2 265)" }
  },
  "font": {
    "sans": "var(--font-dm-sans)",
    "heading": "var(--font-space-grotesk)",
    "mono": "var(--font-geist-mono)"
  },
  "radius": {
    "sm": "0.5rem",
    "md": "0.625rem",
    "lg": "0.75rem",
    "xl": "1rem",
    "2xl": "1.25rem",
    "3xl": "1.5rem",
    "4xl": "1.75rem"
  },
  "spacing": {
    "unit": "4px",
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px",
    "3xl": "64px"
  }
}
```

### 7.2 CSS Custom Properties

All tokens are already defined in `src/app/globals.css` via `:root` and `.dark` selectors. Reference Section 1 for the full list.

Usage in plain CSS:

```css
.my-component {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
}
```

---

## 8. CSS Utility Classes

These are available via Tailwind CSS v4. Use them directly in JSX.

### 8.1 Colors

```
bg-background  bg-foreground  bg-card        bg-primary     bg-secondary
bg-muted       bg-accent      bg-destructive bg-popover

text-foreground      text-muted-foreground  text-primary
text-primary-foreground  text-secondary-foreground  text-destructive

border-border  border-input  border-primary  border-destructive
```

### 8.2 Typography

```
font-sans       /* DM Sans (body) */
font-heading    /* Space Grotesk (headings) */
font-mono       /* Geist Mono (code) */

text-xs    /* 12px */    text-sm    /* 14px */
text-base  /* 16px */    text-lg    /* 18px */
text-xl    /* 20px */    text-2xl   /* 24px */
text-3xl   /* 30px */    text-4xl   /* 36px */

font-light     /* 300 */    font-normal   /* 400 */
font-medium    /* 500 */    font-semibold /* 600 */
font-bold      /* 700 */

leading-tight    /* 1.25 */   leading-snug   /* 1.375 */
leading-normal   /* 1.5 */    leading-relaxed /* 1.625 */

tracking-tighter /* -0.05em */  tracking-tight /* -0.025em */
tracking-normal  /* 0 */        tracking-wide  /* 0.025em */
```

### 8.3 Spacing

```
p-1 (4px)   p-2 (8px)   p-3 (12px)  p-4 (16px)  p-6 (24px)  p-8 (32px)
m-1 (4px)   m-2 (8px)   m-3 (12px)  m-4 (16px)  m-6 (24px)  m-8 (32px)
gap-1       gap-2       gap-3       gap-4       gap-6       gap-8
```

### 8.4 Border Radius

```
rounded-sm   /* 8px */     rounded-md   /* 10px */
rounded-lg   /* 12px */    rounded-xl   /* 16px */
rounded-2xl  /* 20px */    rounded-3xl  /* 24px */
rounded-full /* 9999px */
```

### 8.5 Shadows

```
shadow-none  /* Clean aesthetic default */
shadow-sm    /* Subtle elevation for dropdowns, popovers */
shadow-md    /* Dialogs, floating elements */
```

---

## 9. Usage Guidelines

### 9.1 Do's

- **Do** use `font-heading` for all headings (H1-H6) and `font-sans` for body text
- **Do** use semantic color tokens (`bg-primary`, `text-muted-foreground`) instead of raw values
- **Do** maintain consistent spacing using the 4px grid
- **Do** use the `cn()` utility from `@/lib/utils` for conditional classes
- **Do** keep cards flat (no shadow) by default — shadow only for floating/elevated elements
- **Do** use `rounded-lg` as the default border radius for cards and containers
- **Do** always provide focus indicators for interactive elements
- **Do** test both light and dark modes
- **Do** use `text-sm` (14px) as the default for component text
- **Do** pair icons with text labels for clarity

### 9.2 Don'ts

- **Don't** use raw color values (`#4966d9`) — always use CSS variables or Tailwind tokens
- **Don't** mix font families within a single heading or paragraph
- **Don't** use shadows heavily — the design is intentionally flat with border-based definition
- **Don't** go below `text-xs` (12px) for any user-facing text
- **Don't** use color as the sole indicator of state (pair with icons/text)
- **Don't** use `font-bold` (700) on body text — reserve it for headings
- **Don't** override the base radius — use the scale (`rounded-sm` through `rounded-xl`)
- **Don't** use pure black (`#000`) or pure white (`#fff`) — the palette uses near-black/near-white for softer contrast
- **Don't** add custom animations without respecting `prefers-reduced-motion`
- **Don't** nest cards inside cards — flatten the hierarchy

### 9.3 Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `IdeaCard`, `ResearchReport` |
| CSS variables | kebab-case | `--primary-foreground` |
| Tailwind classes | Use `cn()` for composition | `cn("px-4 py-2", isActive && "bg-primary")` |
| Files | kebab-case | `idea-dialog.tsx`, `research-report.tsx` |

### 9.4 Dark Mode

Theme switching is handled by `next-themes` with the `class` strategy:

```tsx
import { useTheme } from "next-themes";
const { theme, setTheme } = useTheme();
```

- All color tokens automatically switch via `:root` / `.dark` selectors
- Never hardcode light-only or dark-only colors
- Use `dark:` variant only when the token-based approach is insufficient

---

## 10. Implementation Guide

### 10.1 Project Setup

The design system is already integrated. Key files:

```
src/app/globals.css          ← All design tokens (CSS custom properties)
src/app/layout.tsx           ← Font loading + ThemeProvider
src/components/ui/           ← shadcn/ui components
src/components/theme-provider.tsx ← Dark/light mode
src/lib/utils.ts             ← cn() utility
components.json              ← shadcn/ui config
```

### 10.2 Adding a New Component

1. **Check shadcn/ui first:** `npx shadcn@latest add [component]`
2. **Customize in** `src/components/ui/[component].tsx`
3. **Use design tokens** — never hardcode colors or spacing
4. **Follow the variant pattern:**

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const myComponentVariants = cva(
  "inline-flex items-center rounded-md font-sans text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-transparent hover:bg-accent",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-9 px-4",
        lg: "h-10 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 10.3 Adding New Colors

To add a new semantic color (e.g., `--success`):

1. Add to `:root` and `.dark` in `globals.css`:
```css
:root {
  --success: oklch(0.6 0.15 145);
  --success-foreground: oklch(1 0 0);
}
.dark {
  --success: oklch(0.65 0.15 145);
  --success-foreground: oklch(0.12 0 0);
}
```

2. Register in `@theme inline`:
```css
@theme inline {
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
}
```

3. Use in Tailwind: `bg-success text-success-foreground`

### 10.4 Responsive Breakpoints

Use Tailwind's default breakpoints:

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

**Mobile-first approach:** Default styles are mobile, then layer on breakpoints.

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### 10.5 Icon Usage

- **Library:** Lucide React
- **Default size:** 16px (`h-4 w-4`) for inline, 20px (`h-5 w-5`) for standalone
- **Color:** Inherit from parent (`currentColor`)
- **Stroke width:** Default (2px)

```tsx
import { Lightbulb, Rocket, Trophy } from "lucide-react";

// Stage icons (brand metaphor)
<Lightbulb className="h-4 w-4" />  // Brain Box
<Rocket className="h-4 w-4" />     // Launch Pad
<Trophy className="h-4 w-4" />     // Trophy Case
```

### 10.6 Animation Guidelines

- **Duration:** 150ms (micro-interactions) / 200ms (transitions) / 300ms (entrances)
- **Easing:** `ease-in-out` for most, `ease-out` for entrances
- **Respect:** `prefers-reduced-motion` is already handled in `globals.css`
- **Use sparingly:** Only animate what provides functional feedback

```html
<div class="transition-colors duration-200">    <!-- Color changes -->
<div class="transition-transform duration-150">  <!-- Scale/move -->
<div class="animate-in fade-in duration-300">    <!-- Entrances (tw-animate-css) -->
```

---

## Quick Reference Card

```
Fonts:      DM Sans (body) | Space Grotesk (headings) | Geist Mono (code)
Primary:    oklch(0.55 0.19 260) — blue
Base unit:  4px grid
Radius:     12px default (rounded-lg)
Shadows:    Minimal — borders over shadows
Contrast:   WCAG AA minimum (4.5:1 body, 3:1 large text)
Icons:      Lucide React, 16px default
Motion:     150-300ms, respects reduced-motion
```
