

# TECH VIBE - AI Coding Course Platform
## Complete Implementation Plan

---

### Phase 1: Foundation & Design System
Set up the core infrastructure that everything else builds on:

- **Custom theme** with the brand gradient (#AF0C15 → #EA3302), light/dark mode using pure black/white backgrounds
- **Bengali fonts** (Hind Siliguri) + Inter for English text loaded via Google Fonts
- **Gradient text utility** component for highlighted words throughout the site
- **Button system**: Primary (filled gradient), Secondary (outlined), Text, and Icon buttons with hover/active states
- **Dark/light mode toggle** with local storage persistence and smooth transitions
- **Responsive container** setup with 1400px max-width

---

### Phase 2: Navigation & Hero Section
The first impression — sticky navbar and compelling hero:

- **Sticky navbar** with backdrop blur, logo with gradient accent, Bengali navigation links (কোর্স, মডিউল, ফ্রি গিফট, ফ্রি ক্লাস, রিভিউ), theme toggle, and gradient "Dashboard" button
- **Mobile hamburger menu** with smooth slide-in animation
- **Smooth scroll** to all sections with offset for sticky nav
- **Hero section** with enrollment counter ("1000+ students enrolled"), YouTube video embed (16:9), two CTA buttons, special offer banner with pricing (৳999 vs ৳4999 strikethrough), and animated countdown timer

---

### Phase 3: Content Sections (Part 1)
Core informational sections:

- **Introduction section** with expandable "সম্পূর্ণ পড়ুন" read-more text and gradient headline
- **Course Highlights** — 4-column metrics grid (1:1 মেন্টরশিপ, 1000+ স্টুডেন্টস, ১০+ ঘন্টা, ৫০+ ভিডিও) with icon cards and offer banner below
- **"এই নেক্সট লেভেল কোর্সে কি কি থাকছে?"** — 14 feature cards in responsive grid with hover lift effects, gradient-highlighted keywords, and icons for each feature (Limitless Projects, 5+ Tools, ৫৮ হাজার টাকার গিফট, Lifetime Free Hosting, etc.)

---

### Phase 4: Content Sections (Part 2)
Interactive and comparison sections:

- **Course Modules** — 12 expandable accordion modules with module number badges, lesson lists with checkmarks, smooth expand/collapse animations, and a pulsing CTA below
- **Free Class section** — 3 YouTube video cards with thumbnail overlays, play buttons, and modal/popup video player with dark backdrop
- **Comparison table** ("আমরা যা দিচ্ছি vs অন্যরা") — Responsive table with green checkmarks vs red crosses for 10 features, converting to cards on mobile

---

### Phase 5: Trust & Information Sections
Build credibility and answer questions:

- **Instructor section** — Horizontal card with photo (placeholder for your upload), name, title, bio, stats (experience, projects, students, rating), and social links with gradient hover
- **FAQ accordion** — 10 Bengali FAQs with plus/minus icons, gradient accents, smooth slide-down animations
- **Partners/Clients section** — Split layout with sticky headline + infinite scrolling logo carousel (grayscale → color on hover), multiple rows at different speeds

---

### Phase 6: Footer & Polish
Complete the page and add finishing touches:

- **Footer** — 4-column layout (Brand + social icons, Quick Links, Support info, Legal links) with dark background, gradient headings, mobile accordion variant, and bottom bar with copyright
- **Scroll animations** — Fade-in on scroll for all sections, staggered entry, count-up animations for numbers
- **SEO meta tags** — Title, description, Open Graph, Twitter Card tags in Bengali
- **Performance** — Lazy loading for images/videos, optimized font loading with font-display: swap

---

### Phase 7: Backend Setup (Lovable Cloud + Supabase)
Enable content management and checkout:

- **Lovable Cloud setup** with Supabase database
- **Admin authentication** with role-based access (admin role)
- **Content management tables** — Editable fields for: enrollment count, YouTube URLs, countdown timer date, pricing, offer text, course modules, free class videos, instructor info, FAQs, company logos
- **Admin dashboard page** — Protected route with forms to update all dynamic content, drag-to-reorder for modules/FAQs, image upload for logos and instructor photo via Supabase Storage

---

### Phase 8: Checkout & Payment Integration
Enable course enrollment:

- **Stripe integration** for payment processing (supports card payments)
- **Checkout page** with course summary, pricing display (৳999 offer vs ৳4999 original), and payment form
- **Payment confirmation page** with success message and next steps
- **Order tracking** in the admin dashboard

---

### Phase 9: Student Dashboard
Post-enrollment experience:

- **Login/signup pages** for enrolled students
- **Student dashboard** with course access status, enrollment details
- **Protected routes** — Dashboard only accessible to authenticated users

---

> **Note:** This is a large project. Each phase will be implemented incrementally. You'll be able to review and provide feedback after each phase. Assets (instructor photo, company logos) can be uploaded at any point during the build.

