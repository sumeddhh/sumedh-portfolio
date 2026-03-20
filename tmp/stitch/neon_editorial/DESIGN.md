# Design System: High-End Editorial Tech

## 1. Overview & Creative North Star

### The Creative North Star: "The Neon Monolith"
This design system is built for a premium, editorial tech experience that avoids the cluttered, "boxed-in" feel of traditional SaaS blogs. We treat digital content like a high-end physical publication. The goal is a **Sophisticated, Minimalist, and Future-Forward** aesthetic that utilizes atmospheric depth rather than structural lines.

We break the "template" look through:
*   **Intentional Asymmetry:** Strategic use of negative space to lead the eye.
*   **Tonal Layering:** Replacing borders with subtle shifts in surface color.
*   **High-Contrast Scale:** Dramatic differences between oversized Display type and functional Body text.
*   **Atmospheric Soul:** Integrating grain textures and soft, neon glows to create a "living" digital surface.

---

## 2. Colors

The palette is rooted in deep, cinematic blacks with a singular, high-voltage accent.

### Palette Strategy
*   **Background (`#131313`):** The canvas. Never pure black, but a deep charcoal that allows for "lower" containers to exist.
*   **Primary (`#FFFFFF`):** Reserved for high-importance text and iconography.
*   **Accent/Primary Container (`#B2F722`):** Our signature Neon-Lime. Use this with extreme restraint—only for primary CTAs, highlighting key metrics, or a single "spark" in a quote.
*   **Surface Containers:** Use `surface_container_lowest` (`#0E0E0E`) to create "wells" of content and `surface_container_highest` (`#353534`) for floating or elevated elements.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off content.
Boundaries must be defined by background color shifts. A `surface_container_low` section sitting on a `surface` background provides all the separation needed. If you feel the need to "box" something, you have failed the layout’s editorial integrity.

### The "Glass & Gradient" Rule
To add professional polish:
*   **Floating Elements:** Use `surface_container_highest` with an 80% opacity and a `24px` backdrop-blur (Glassmorphism).
*   **Signature Gradients:** For CTAs or Hero backgrounds, use a subtle radial gradient transitioning from `surface_container_high` to `surface_container_lowest` to give the screen "breath."

---

## 3. Typography

The typography system is a dialogue between the industrial precision of **Space Grotesk** and the human readability of **Inter**.

*   **Display & Headlines (Space Grotesk):** These are your "Editorial Voices." Use `display-lg` for hero statements. These should feel heavy, expressive, and slightly futuristic.
*   **Body & Titles (Inter):** Designed for maximum absorption. `body-lg` is the workhorse for article content.
*   **Captions & Metadata (IBM Plex Mono - Supplemental):** Use for "tech-heavy" details, code snippets, or dates to lean into the developer-centric editorial feel.

**Hierarchy Tip:** Keep the contrast high. If your headline is `headline-lg`, ensure your body text is `body-md`. Avoid "middle-ground" sizing that creates visual muddle.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering**, not structural shadows.

*   **The Layering Principle:** Stack your containers. 
    *   *Level 0:* `surface` (Main background)
    *   *Level 1:* `surface_container_low` (Content sections)
    *   *Level 2:* `surface_container_highest` (Cards, Modals)
*   **Ambient Shadows:** When a floating effect is required (e.g., a primary button or a hover state), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);`. Never use high-contrast black shadows on dark backgrounds.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` at **15% opacity**. It should be felt, not seen.
*   **Grain & Texture:** Apply a global `noise` texture overlay at 3% opacity. This breaks the "flat digital" feel and provides a tactile, premium paper quality to the dark surfaces.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary_container` (Neon-Lime) with `on_primary` (Deep Dark) text. Sharp or `sm` rounded corners. No border.
*   **Secondary:** Ghost style. Transparent background with a `Ghost Border` and `primary` text.
*   **Tertiary:** Text-only with an `IBM Plex Mono` underline that appears on hover.

### Cards
*   **Style:** No borders, no heavy shadows. Use `surface_container_low`. 
*   **Interaction:** On hover, transition to `surface_container_high` and apply a subtle `0.5rem` vertical lift. 

### Input Fields
*   **Style:** Underline only (using `outline_variant`) or a subtle `surface_container_lowest` fill. 
*   **Focus State:** The underline transitions to `primary_container` (Neon-Lime) with a soft outer glow of the same color.

### Lists & Dividers
*   **Rule:** Forbid divider lines. Use `spacing.8` (2.75rem) to separate list items. Use typography (weight and color) to distinguish between a list title and its metadata.

### Editorial Quotes
*   **Style:** Use `display-sm` for the text. Place a single 4px wide vertical bar of `primary_container` (Neon-Lime) to the left, but offset it by `spacing.4` to maintain an asymmetrical, airy feel.

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme white space. If a section feels "almost right," double the padding.
*   **Do** use `IBM Plex Mono` for small labels (dates, tags) to give a "data-stream" editorial vibe.
*   **Do** use subtle neon glows (15% opacity) behind high-priority images to make them pop from the dark background.

### Don't
*   **Don't** use 100% opaque borders. They kill the futuristic, atmospheric vibe.
*   **Don't** use the Neon-Lime (`#B2F722`) for long-form text. It is a "spark," not a "floodlight." It will cause eye strain.
*   **Don't** use standard "Drop Shadows." Use tonal shifts and backdrop blurs to define depth.
*   **Don't** center-align everything. Use the grid to create "weighted" layouts where text might be left-aligned and images are offset to the right.