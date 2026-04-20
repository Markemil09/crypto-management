# Design System Document: The Kinetic Vault

## 1. Overview & Creative North Star

### The Creative North Star: "The Kinetic Vault"
This design system is built to transform the standard CRM experience from a static utility into a high-performance command center. We are moving away from the "template" look of SaaS dashboards. Instead, we embrace a "Digital Editorial" approach where data is treated as high-value content. 

The aesthetic is rooted in **Kinetic Depth**: a philosophy where the UI feels like a series of layered, translucent glass panes suspended in a deep, dark void. We break the rigid grid through intentional asymmetry—using wide margins and varied container widths to guide the eye toward critical financial metrics. This is not just a tool; it is a premium environment for high-stakes decision-making.

---

## 2. Colors: Tonal Depth & The No-Line Rule

Our palette is anchored in `#0c0e17` (The Void). We do not use color simply for decoration; we use it to signal pulse and priority.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off the UI. Standard borders create "visual noise" that cheapens the experience. Instead, define boundaries through:
- **Tonal Shifts:** Place a `surface-container-low` component on a `surface` background.
- **Elevation Layering:** Use the natural contrast between `surface-container-lowest` and `surface-container-highest` to create separation.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. Use these tokens to "stack" importance:
1.  **Background (`#0c0e17`):** The base canvas.
2.  **Surface-Container-Low:** For secondary navigation or sidebar areas.
3.  **Surface-Container-High:** For primary content cards or data tables.
4.  **Surface-Container-Highest:** For active, hovering, or focused states.

### The Glass & Gradient Rule
To move beyond "standard" dark mode, use **Glassmorphism** for floating elements (like modals or dropdowns). 
- Use `surface-variant` at 60% opacity with a `backdrop-filter: blur(12px)`.
- **Signature Textures:** For primary CTAs, apply a subtle linear gradient from `primary` (#a1faff) to `on_primary_container` (#00575b) at a 135-degree angle. This adds a "lithographic" sheen that feels expensive.

---

## 3. Typography: Data as Content

The typography scale balances the brutalist tech feel of **Space Grotesk** with the surgical precision of **Inter**.

- **Display & Headlines (Space Grotesk):** Used for large balance amounts and section headers. The wide apertures of Space Grotesk feel "high-tech" and authoritative.
- **Body & Labels (Inter):** Used for all functional data. Inter is selected for its high X-height, ensuring crypto addresses and complex transaction IDs remain legible at small scales.
- **Monospacing (Data):** When displaying wallet addresses or ticker symbols, use a tabular-nums font feature to ensure digits line up perfectly in tables.

---

## 4. Elevation & Depth: Tonal Layering

We convey hierarchy through **Tonal Layering** rather than traditional structural lines or heavy drop shadows.

- **The Layering Principle:** Place a `surface-container-lowest` card on top of a `surface-container-low` section to create a soft, natural "recessed" look.
- **Ambient Shadows:** For floating elements (Modals/Popovers), use an extra-diffused shadow: `box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.5)`. The shadow should feel like an absence of light, not a dark gray smudge.
- **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility, use a **Ghost Border**: `outline-variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components: High-Performance Primitives

### Data Tables (The Core Component)
- **Styling:** No vertical or horizontal lines. Use `surface-container-low` for the header row and a 1px `outline-variant` (at 10% opacity) only at the very bottom of each row.
- **Interaction:** On hover, change the row background to `surface-bright`.
- **Typography:** Use `label-md` for headers in all-caps with 0.05em tracking.

### Interactive Charts
- **Positive Growth:** Use `secondary` (#3fff8b) with a 20% opacity gradient fill beneath the line.
- **Losses/Volatility:** Use `tertiary` (#ff716c) for subtle warnings.
- **Grid Lines:** Use `outline-variant` at 5% opacity. They should be nearly invisible.

### Status Badges
- **Success:** Emerald Green text (`on_secondary_fixed`) on a low-opacity `secondary` background.
- **Danger:** Red text (`on_tertiary_fixed`) on a low-opacity `tertiary` background.
- **Shape:** Use the `full` (9999px) roundedness for a pill-shaped, "app-like" feel.

### Buttons
- **Primary:** Neon Cyan (`primary`) background with `on_primary_fixed` text. Apply a subtle outer glow using the `primary_dim` color on hover.
- **Secondary:** Transparent background with a `Ghost Border` and `primary` text.
- **Rounding:** Use `md` (0.375rem) for a modern, sharp architectural look.

### Input Fields
- **Base:** Use `surface-container-highest` with no border.
- **Active State:** A 1px bottom-border using the `primary` cyan token.
- **Helper Text:** Use `on_surface_variant` in `label-sm`.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use whitespace as a separator. If a section feels cluttered, add 16px of padding rather than a line.
- **Do** use "Optical Sizing." Large numbers in Space Grotesk should have tighter letter spacing than body text in Inter.
- **Do** use the `secondary` (#3fff8b) emerald green for "Buy" actions and `primary` (#a1faff) for "System" actions.

### Don't:
- **Don’t** use pure black (#000000) for surfaces; it kills the sense of depth. Always use the specified `surface` or `surface-container` tiers.
- **Don’t** use high-contrast white text for everything. Use `on_surface_variant` for secondary information to maintain the "Dark Pro" hierarchy.
- **Don’t** use standard "drop shadows" on cards. Stick to tonal shifts unless the element is literally "floating" over the interface.