# Novel Weaver AI - Design Specification: Modern Tech AI SaaS Style

## 1. Introduction & Philosophy

**Goal:** To establish a unified, modern, sleek, and sophisticated "Tech AI SaaS" aesthetic for Novel Weaver AI, enhancing user experience and brand identity, drawing inspiration from contemporary platforms like Pollo AI.
**Keywords:** Clean, futuristic, intelligent, intuitive, polished, premium, tech-forward.
**Core Principles:**
    - **Clarity & Focus:** Design should be uncluttered, guiding the user towards novel creation with minimal friction.
    - **Consistency:** UI elements and interactions should be predictable and harmonious.
    - **Sophistication:** The look and feel should reflect advanced AI capabilities with a polished, premium feel.
    - **Engagement:** Visually appealing elements and subtle interactions should make the experience enjoyable.

## 2. Color Palette (Refined Dark Theme with Vibrant Accents)

*   **Primary Backgrounds (Slate Palette):**
    *   `#0F172A` (Tailwind `bg-slate-950`): Main application body (`body`). Deep, near-black.
    *   `#1E293B` (Tailwind `bg-slate-900`): Primary content areas, large surfaces within sections.
    *   `#334155` (Tailwind `bg-slate-800`): Cards, modals, sidebars, distinct UI sections.
    *   `#475569` (Tailwind `bg-slate-700`): Input backgrounds, secondary content areas, hover states on darker elements.
*   **Accent Colors (Vibrant & Energetic - Sky, Cyan, Teal):**
    *   **Primary Accent (Brand & Interactive Elements - Sky Blue):**
        *   Base: `#0EA5E9` (Tailwind `sky-500`) - For primary buttons (gradients), active navigation, focused states.
        *   Hover/Lighter: `#0284C7` (Tailwind `sky-600`)
        *   Text/Icon: `#38BDF8` (Tailwind `sky-400`) - For highlighted text, icons.
    *   **Secondary Accent (CTAs, Highlights - Cyan):**
        *   Base: `#06B6D4` (Tailwind `cyan-500`)
        *   Hover/Lighter: `#0891B2` (Tailwind `cyan-600`)
        *   Text/Icon: `#22D3EE` (Tailwind `cyan-400`)
    *   **Tertiary Accent (Success, Optional CTAs - Teal/Greenish-Blue):**
        *   Base: `#14B8A6` (Tailwind `teal-500`)
        *   Text/Icon: `#2DD4BF` (Tailwind `teal-400`)
    *   **Gradient for Primary CTAs:** `bg-gradient-to-r from-sky-500 to-cyan-400` (or similar vibrant combinations).
*   **Text Colors (Slate Palette for Readability):**
    *   Headings (Primary): `#F1F5F9` (Tailwind `text-slate-100`) or `#E2E8F0` (Tailwind `text-slate-200`).
    *   Body/Standard Text: `#CBD5E1` (Tailwind `text-slate-300`).
    *   Subtle/Instructional Text: `#94A3B8` (Tailwind `text-slate-400`).
    *   Placeholder Text: `#64748B` (Tailwind `text-slate-500`).
    *   Disabled Text: `#475569` (Tailwind `text-slate-600`).
*   **Borders & Dividers (Subtle Slate):**
    *   `#334155` (Tailwind `border-slate-700`) - Standard.
    *   `#475569` (Tailwind `border-slate-600`) - Slightly more prominent, e.g., for input fields.

## 3. Typography

**Font Family:** `Inter`, sans-serif (continue usage).

*   **Headings:**
    *   **H1 (Page Titles, Hero):** `text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100` (or accent `text-sky-400`).
    *   **H2 (Section Titles):** `text-3xl font-bold text-slate-100` (or accent `text-sky-300`).
    *   **H3 (Sub-Section/Card Titles):** `text-xl sm:text-2xl font-semibold text-slate-100`.
*   **Body Text:** `text-base text-slate-300 leading-relaxed`.
*   **Labels & UI Text:** `text-sm font-medium text-slate-300`.
*   **Instructional/Helper Text:** `text-xs italic text-slate-400`.
*   **Line Height:** `leading-relaxed` or `leading-7` for body text.
*   **Letter Spacing:** Consider `tracking-tight` for headings for a modern, compact look.

## 4. UI Components & Elements

*   **Buttons:**
    *   **Base:** `px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950`
    *   **Primary CTA:** `bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white shadow-lg hover:shadow-cyan-500/30 focus:ring-sky-400 active:scale-[0.98]`
    *   **Secondary Accent (e.g., Cyan/Teal):** `bg-cyan-600 hover:bg-cyan-500 text-white focus:ring-cyan-400 active:scale-[0.98]`
    *   **Secondary (Subtle/Slate):** `bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white focus:ring-slate-500 active:scale-[0.98]`
    *   **Destructive:** `bg-red-600 hover:bg-red-700 text-white focus:ring-red-400 active:scale-[0.98]`
    *   **Disabled:** `bg-slate-600 text-slate-400 cursor-not-allowed opacity-70`
*   **Input Fields (TextInput, TextAreaInput, Select):**
    *   **Base:** `w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 focus:outline-none transition-colors duration-200`
    *   **Focus State:** `focus:ring-2 focus:ring-sky-500 focus:border-sky-500`.
    *   Placeholder text: `placeholder-slate-500`.
*   **Cards & Containers:**
    *   **Base:** `bg-slate-800 rounded-xl shadow-xl p-6`.
    *   **Border:** Optional `border border-slate-700` for subtle definition.
    *   **Hover (Interactive Cards):** `hover:shadow-sky-500/10 hover:border-slate-600 transform hover:-translate-y-1 transition-all`.
*   **Modals:**
    *   **Backdrop:** `bg-black/70 backdrop-blur-md` (frosted glass effect).
    *   **Content Box:** `bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl border border-slate-700`.
*   **Navigation (Sidebars & Tabs):**
    *   **Sidebar Item (Active):** `bg-sky-600 text-white shadow-inner`. Consider a subtle `border-l-4 border-sky-400`.
    *   **Sidebar Item (Inactive):** `text-slate-300 hover:bg-slate-700 hover:text-white rounded-md`.
    *   **Tabs (Active):** `bg-slate-900 text-sky-400 rounded-t-md border-x border-t border-slate-700 border-b-transparent`.
    *   **Tabs (Inactive):** `text-slate-400 hover:text-sky-400 hover:bg-slate-700/50 rounded-t-md`.
*   **Tooltips:** `bg-slate-900 text-white text-xs px-2 py-1 rounded-md shadow-lg`.

## 5. Iconography

*   **Style:** Clean, modern line icons (e.g., Heroicons). SVGs preferred.
*   **Color:** `text-sky-400` (accent), `text-slate-400` (standard).
*   **Usage:** Purposeful, enhance comprehension.

## 6. Spacing & Layout

*   **Grid System:** Tailwind responsive grids.
*   **Whitespace:** Generous, consistent padding (`p-4`, `p-6`, `p-8`) and margins (`mb-4`, `mb-6`, `mb-8`).
*   **Section Separation:** Headings, spacing, subtle dividers (`border-t border-slate-700`).

## 7. Microinteractions & Animations

*   **Transitions:** `transition-all duration-200 ease-in-out` or `duration-300`.
*   **Button Press:** `active:scale-[0.97]` or `active:brightness-95`.
*   **Loading States:**
    *   `LoadingSpinner`: `border-sky-500`.
    *   Skeleton Loaders: `animate-pulse bg-slate-700`.
*   **Subtle Glows/Shadows:** Consider soft glows (e.g., `shadow-sky-500/10`) for focused or active elements.

## 8. Specific Component Styling Notes

*   **Error/Success Messages:** Use distinct colors and icons (e.g., `bg-red-900/50 text-red-300 border-red-700`; `bg-teal-900/50 text-teal-300 border-teal-700`).

## 9. Accessibility (A11y)

*   **Contrast Ratios:** Ensure text and interactive elements meet WCAG AA.
*   **Focus Indicators:** Clear, visible focus states (`focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-950`).
*   **ARIA Attributes:** Use correctly.
*   **Keyboard Navigation:** Ensure full accessibility.

## 10. Responsive Design

*   Tailwind responsive prefixes.
*   Optimize for touch targets and mobile navigation.

This specification aims for a visually stunning, user-friendly interface that reflects the cutting-edge nature of Novel Weaver AI.
