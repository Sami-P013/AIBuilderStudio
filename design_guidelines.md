# Design Guidelines: AI Website Builder Platform

## Design Approach

**Selected Approach:** Design System (Productivity-Focused)

**Primary Inspiration:** Linear, VS Code, Notion - Modern developer tools that prioritize efficiency, clarity, and professional aesthetics

**Key Principles:**
- Function over form - every element serves a purpose
- Information density balanced with breathing room
- Developer-friendly, professional aesthetic
- Mobile-first responsive design for Android accessibility

---

## Typography System

**Font Families:**
- Primary: Inter (body text, UI elements, labels)
- Monospace: JetBrains Mono (code blocks, editor content, technical data)

**Hierarchy:**
- Hero/Page Titles: text-4xl md:text-5xl font-bold
- Section Headers: text-2xl md:text-3xl font-semibold
- Card Titles: text-lg font-semibold
- Body Text: text-base font-normal
- Labels/Meta: text-sm font-medium
- Code/Technical: text-sm font-mono

---

## Layout System

**Spacing Primitives:** Tailwind units 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-16
- Card gaps: gap-4 to gap-6
- Element margins: m-2, m-4

**Container Strategy:**
- Main wrapper: max-w-7xl mx-auto px-4
- Code editor: Full-width panels with max-w-screen-2xl
- Resource cards: max-w-6xl mx-auto
- Mobile: px-4 with full-width touch targets

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Sticky header (sticky top-0 z-50)
- Logo/brand left, navigation center, user menu right
- Height: h-16
- Items: text-sm font-medium with px-4 spacing
- Mobile: Hamburger menu collapsing to drawer

### Dashboard Layout
**Split-Panel Design:**
- Left sidebar: w-64 (collapsible on mobile)
  - Project list, quick actions, resource categories
  - Each item: p-3 rounded-lg hover state
- Main content: flex-1 with overflow handling
  - Project cards grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

### AI Code Generation Interface
**Primary Editor View:**
- Prompt input area: Top section with h-32 textarea, rounded-xl border
- Generate button: Prominent, px-8 py-3 rounded-lg
- Split view below: 50/50 on desktop, stacked on mobile
  - Left: Generated code with syntax highlighting
  - Right: Live preview in iframe
- Code editor styling: Monospace font, line numbers, padding p-4

### Resource Library
**Categorized Grid System:**
- Category sections with text-xl font-semibold headers
- Card grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
- Each resource card:
  - Rounded-xl border, p-6 spacing
  - Icon/logo top (h-12 w-12)
  - Title: text-lg font-semibold
  - Description: text-sm, 2 lines clamped
  - Tags: Inline chips with text-xs, px-2 py-1, rounded-full
  - External link indicator

**Categories to Display:**
- IDEs & Editors (VS Code, Replit, CodeSandbox)
- Frameworks & Libraries (React, Vue, Express, Next.js)
- Deployment & Hosting (Vercel, Netlify, Railway)
- Design Tools (Figma, Canva, Excalidraw)
- APIs & Services (RapidAPI, Public APIs list)
- Learning Resources (freeCodeCamp, MDN, W3Schools)

### Project Management Dashboard
**Project Cards:**
- Card design: rounded-lg border p-6
- Header: Project name (text-lg font-semibold) + status badge
- Meta info: Creation date, last modified (text-sm)
- Tech stack: Icon row with tooltips
- Action buttons: Edit, Preview, Deploy, GitHub sync
- Grid: grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6

### GitHub Integration Panel
**Connection Status & Actions:**
- Connection status card at top
- Repository list with search/filter
- Each repo item: Flex layout with name, description, last updated
- Quick actions: Create new repo, push code, sync buttons (px-4 py-2 rounded-md)

### Template Gallery
**Template Selection Grid:**
- Large preview cards: aspect-video thumbnail
- Hover overlay with "Use Template" button
- Categories filter bar above grid
- Templates: Landing page, SaaS app, Blog, E-commerce, Chatbot, AI agent

### Mobile Optimization (Android Priority)
**Touch-Friendly Design:**
- Minimum touch targets: 44x44px (h-11 w-11 or larger)
- Bottom navigation bar on mobile (fixed bottom-0)
- Drawer navigation from left edge
- Code editor: Horizontal scroll, zoom controls
- FAB (Floating Action Button) for quick "New Project": fixed bottom-6 right-6, rounded-full, h-14 w-14

### Forms & Inputs
**Consistent Input Design:**
- Text inputs: rounded-lg border px-4 py-3 text-base
- Textareas: min-h-32 for prompts, rounded-lg
- Buttons: Primary (px-6 py-3), Secondary (px-4 py-2), all rounded-lg
- Focus states: Clear outline treatment
- Labels: text-sm font-medium mb-2

### Export & Download Features
**Export Modal:**
- Centered modal: max-w-md rounded-xl p-6
- Options list: ZIP download, GitHub push, Copy to clipboard
- Each option: Flex row with icon, text, and action button

---

## Animations

**Minimal, Purposeful Motion:**
- Page transitions: Simple fade
- Modals: Slide-up animation (duration-200)
- Hover states: Scale subtle (hover:scale-105) on cards
- Loading states: Spinner only, no elaborate animations

---

## Images

**No Hero Image Needed** - This is a productivity tool, not a marketing site

**Icon Usage:**
- Use Heroicons throughout for consistency
- Resource cards: Display actual tool logos via `<img>` tags
- Template previews: Screenshots of actual template outputs
- Dashboard: Project type icons (web, mobile, AI agent indicators)

**Implementation:**
- Tool logos: h-10 w-10 to h-12 w-12, rounded or original shape
- Template thumbnails: aspect-video, object-cover, rounded-lg
- All images: lazy loading enabled