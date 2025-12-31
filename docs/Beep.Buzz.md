# Beep.Buzz

## Overview

Beep.Buzz is a creative social media platform that gives everyone their own customizable corner of the internet at username.beep.buzz. Think of it as your personal digital canvas where you can express yourself through text, shapes, and YouTube videos, all arranged exactly how you want them.

What makes Beep.Buzz unique is its playful interaction system - instead of traditional likes or comments, users connect through colorful "beep" and "buzz" stickers they place on each other's pages. Each sticker serves as both decoration and a portal, creating an organic web of discovery as users follow sticker trails to find new pages.

The platform emphasizes creative freedom while maintaining simplicity. Whether you're crafting your own digital space or exploring others' creations, Beep.Buzz offers a fresh take on social connection through visual expression and playful interaction.

## Pages

### Home (/) (Public)

The Home page serves as your gateway to the Beep.Buzz community. Here you'll find a dynamic feed of pages to explore, with multiple ways to discover content that interests you. Browse featured sections like Popular Pages, Recently Active, and New Pages, or use the search bar to find specific creators by username or page title.

Content can be filtered by categories to match your interests, and there's always a "Random Page" option for spontaneous discovery. Each page preview card shows you essential details: the page title, creator's username, a visual preview, sticker counts, and category.

### User Page (/[username]) (Public)

Every user's personal canvas lives at their unique subdomain (username.beep.buzz). At the top, you'll see a static header displaying the page title, creator's username, and their personal sticker collection with counts. A sticky navigation bar follows as you scroll, featuring controls to toggle sticker visibility and buttons to place your own beeps and buzzes.

The main content area showcases the creator's carefully arranged elements, with visitor stickers floating above like a collaborative art piece. Clicking any sticker reveals who placed it and takes you to their page, creating an interconnected network of personal spaces.

### Page Editor (/edit) (User)

This is where the magic happens - your personal page building workshop. Add up to 20 elements including text blocks, shapes, dividers, and up to 3 YouTube embeds. Every element can be dragged, resized, and precisely positioned to match your vision.

The editor includes responsive preview modes for desktop, tablet, and mobile views, ensuring your page looks great on any device. Your canvas can extend up to 3000px in height, giving you plenty of room to express yourself while maintaining reasonable loading times.

### Settings (/settings) (User)

Manage your personal sticker identity and account preferences here. Choose your signature beep and buzz icons from extensive libraries, then customize their colors and background shapes. Any changes you make update everywhere your stickers appear, maintaining consistency across the platform.

Track your social footprint with an activity overview showing all pages where you've placed stickers, with quick navigation and sticker removal options. Analytics provide insights into stickers you've received, broken down by type and time periods.

### Onboarding (/welcome) (User)

Your first stop after authentication, this guided setup helps you establish your identity on Beep.Buzz. Choose a unique username (3-20 characters) that will become your personal subdomain. Then, design your signature stickers by selecting icons, colors, and shapes - these will be your calling card across the platform.

### Admin Dashboard (/admin) (Admin)

A comprehensive moderation interface for platform administrators. Review reported pages, manage content that's been automatically hidden due to multiple reports, and take appropriate action to maintain community standards. Admins can approve content, remove violations, issue warnings, or ban users when necessary, with all actions logged for accountability.

## Authentication & Access Control

Beep.Buzz uses a streamlined authentication system centered around email magic links - no passwords to remember! When you sign in, we'll send a secure link to your email that grants access to your account. Email verification ensures account security and helps maintain a trusted community.

### Access Levels

**Public Access** (no authentication required):

- Home (/)
- User Page (/[username])

**Authenticated Users**:

- Page Editor (/edit)
- Settings (/settings)
- Onboarding (/welcome)

**Admin Only**:

- Admin Dashboard (/admin)

## Data & Storage

### users

This is where your personal identity on Beep.Buzz lives. Beyond basic account details like email and username, it stores your unique sticker designs - the personalized beeps and buzzes that represent you across the platform. Your account status, join date, and role (user or admin) are tracked here to ensure proper access and platform safety.

### pages

Think of this as the master directory of all Beep.Buzz pages. Each entry contains a page's title, category, and creator information, plus important metrics like view counts and when it was last updated. This information powers the discovery features on the home page and helps users find content that interests them.

### page_elements

Every piece of content you add to your page - whether it's text, shapes, dividers, or YouTube videos - is carefully tracked here. This ensures your page layout stays exactly as you designed it and helps enforce platform limits like the maximum of 20 elements and 3 YouTube embeds per page.

### stickers

The heart of Beep.Buzz's interaction system, this tracks every beep and buzz placed across the platform. Each sticker record includes who placed it, where it's located, and when it was added, enabling the unique navigation system that lets users follow sticker trails to discover new pages.

### moderation_logs

A comprehensive record of all administrative actions taken to keep the platform safe and friendly. This maintains accountability by tracking which moderators took what actions, when they occurred, and why decisions were made.

### reports

Community safety relies on users helping identify inappropriate content. This tracks user-submitted reports, automatically hiding pages that receive multiple reports until an admin can review them. It's essential for maintaining platform standards and ensuring quick response to potential violations.

## User Experience

New users typically discover Beep.Buzz through shared page links or word of mouth. After signing up with email verification, the onboarding process guides them through creating their username and designing their signature stickers. From there, they can immediately start exploring other pages and placing stickers, or jump into the page editor to create their own space.

Regular users often start their sessions on the home page, discovering new content through featured sections or following sticker trails from page to page. Content creators frequently return to the page editor to update their space and check their sticker analytics in settings.

## Getting Started

1. Visit beep.buzz and click "Sign In" to receive a magic link via email
2. Complete the onboarding process to choose your username and design your stickers
3. Explore the home page to discover interesting pages and place your first stickers
4. Create your own page using the page editor
5. Share your page link (username.beep.buzz) with friends to start building connections
