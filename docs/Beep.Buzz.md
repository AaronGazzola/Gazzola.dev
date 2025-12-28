# beep.buzz - Project Description

## Overview

beep.buzz is a playful social media platform where users create personalized pages at their own subdomain (username.beep.buzz). Each page is a customizable, vertically-scrolling canvas containing text, shapes, and embedded YouTube videos. Authenticated users can place decorative "beep" and "buzz" stickers on other users' pages, with each sticker serving as a link back to that visitor's own page. The platform emphasizes creative expression, simple interactions, and organic discovery through sticker-based navigation.

## Core Functionality

### User Authentication & Onboarding

Users sign in via email magic link. Upon first authentication, users:

- Choose a unique username that becomes their subdomain (username.beep.buzz)
- Select their personal beep icon and buzz icon from available icon libraries
- Customize each icon's appearance (background color, icon color, background shape)
- Can immediately start exploring pages and placing stickers

Username requirements:

- URL-friendly characters only
- Reasonable length limit (3-20 characters)
- AI-scanned for inappropriate content before acceptance
- Must be unique across the platform

### Personal Sticker Identity

Each user maintains one beep sticker and one buzz sticker as their persistent identity across the platform.

Sticker customization options:

- Icon selection from three MIT-licensed libraries (Lucide, Phosphor, and one additional library)
- Icon color (color picker)
- Background color (color picker)
- Background shape options: circle, square, diamond, heart, and additional preset shapes
- Changes to personal stickers update retroactively across all pages where the user has placed them

The user's selected beep and buzz stickers are displayed in the header of their own page, serving as their visual identity.

## Page Creation & Editing

### Page Builder Interface

Page owners access an editor mode to build their pages using a component-based layout system. The builder provides:

**Element Types:**

1. Text Blocks
   - Rich text editing (headings, bold, italic, links)
   - Font size options
   - Text color picker
   - Optional background color
   - Alignment controls (left, center, right)

2. Shapes & Dividers
   - Preset shapes (rectangle, circle, line dividers)
   - Size controls
   - Color picker for fill and border
   - Transparency options

3. YouTube Embeds
   - URL input for any YouTube video
   - Aspect ratio options (16:9, 4:3, 1:1)
   - Autoplay toggle

**Layout Controls:**

Each element can be:

- Dragged to reorder vertically in the page flow
- Resized (width options: 25%, 50%, 75%, 100% of container)
- Aligned (left, center, right within its container)
- Edited for content and styling
- Deleted

**Responsive Preview:**

The editor includes a preview toggle showing how the page will render on:

- Desktop
- Tablet
- Mobile

All elements are responsive by default, reflowing naturally for different screen sizes.

**Page Limits:**

Conservative limits to maintain performance and encourage curation:

- Maximum 20 elements per page
- Maximum 3 YouTube embeds per page
- Maximum page height: 3000 pixels
- Maximum 50 beep stickers per page
- Maximum 50 buzz stickers per page

**Page Settings:**

- Page title (displayed in header and search results)
- Category selection from standard options (Art, Music, Personal, Tech, Fun, Memes, Other)
- Optional description for discovery
- Privacy settings: Public or Username Whitelist (page only accessible to specific users by username)

**Publishing:**

When the user saves/publishes their page:

- All text content is AI-scanned for harmful or offensive material
- YouTube video titles and thumbnails are checked via YouTube API
- If moderation passes, the page goes live immediately
- If violations are detected, the creator receives an explanation and the page doesn't publish or reverts to the previous version

## Page Viewing Experience

### Page Structure

Every user page (username.beep.buzz) displays:

**Static Header:**

- Page title
- Username (also the subdomain)
- Creator's personal beep and buzz stickers (showing their visual identity)
- Total sticker count badge (e.g., "42 beeps, 38 buzzes")

**Sticky Header (appears on scroll):**

- Toggle button to show/hide all stickers on the page
- "Add Beep" button
- "Add Buzz" button

**Main Content Area:**

- Vertically scrolling page containing all creator's elements
- Responsive layout that adapts to screen size
- Visitor stickers attached to elements (when toggle is on)

### Sticker Placement System

Each page element maintains a map of sticker placement positions. When a user places a sticker:

1. User clicks "Add Beep" or "Add Buzz" in the sticky header
2. User clicks anywhere on the page
3. The sticker magnets to the closest available position on the closest element
4. User can click the add button again and click elsewhere to reposition the sticker
5. Each sticker is placed at a discrete position on its parent element
6. Multiple stickers on the same element create a layered, partially-overlapping effect where each sticker remains partially visible
7. Elements can become fully covered with stickers over time, creating a visual history of engagement

Sticker placement is relative to the element, ensuring stickers remain contextually positioned across different screen sizes. As the page reflows responsively, stickers maintain their relationship to their parent elements.

### Sticker Interaction

When viewers interact with stickers:

**Hover State:**

- Tooltip appears showing the username of the person who placed the sticker

**Click Action:**

- A popover appears containing:
  - The username of the sticker placer
  - A button to navigate to that user's beep.buzz page
- This creates organic discovery as users can explore the community by following sticker trails

**Personal Stickers:**

- Users' own stickers have a subtle highlight or border to distinguish them
- Users can reposition or remove only their own stickers

**Limits Per User Per Page:**

- Each user can place exactly one beep sticker per page
- Each user can place exactly one buzz sticker per page
- Users can move or remove their placements but cannot place multiple of the same type

### Toggle Visibility

The show/hide toggle in the sticky header allows viewers to:

- See the page with all stickers (default for first-time visitors)
- See the clean page without any stickers (to view creator's original content)
- Preference persists during the session

## Homepage & Discovery

The main homepage at beep.buzz serves as the discovery and navigation hub.

### Homepage Features

**Search Functionality:**

- Search bar accepts page titles or @username queries
- Real-time search results
- Direct navigation to matching pages

**Featured Sections:**

1. Popular Pages
   - Sorted by total sticker count (beeps + buzzes)
   - Displays page cards with preview information

2. Recently Active
   - Pages that have received recent stickers
   - Sorted by most recent sticker placement

3. New Pages
   - Recently created pages
   - Helps new creators get initial visibility

4. Category Filters
   - Standard categories: Art, Music, Personal, Tech, Fun, Memes, Other
   - Click to filter page listings by category

**Random Page Button:**

- Prominent button to discover a random page
- Crucial for small community growth and serendipitous discovery

**Page Card Display:**

Each page card in listings shows:

- Page title
- Username (@username)
- Visual preview (thumbnail or first few elements)
- Total beep count and buzz count
- Category tag
- "Visit" button

### Navigation Between Pages

Users navigate the platform through:

- Homepage search and browsing
- Clicking stickers to visit other users' pages (sticker trail navigation)
- Direct subdomain URLs
- Random page discovery
- Back/forward browser navigation

## User Profile & Settings

Authenticated users access a settings area to:

**Manage Personal Stickers:**

- Change their beep icon (updates everywhere retroactively)
- Change their buzz icon (updates everywhere retroactively)
- Customize icon colors and background shapes
- Preview changes before saving

**Page Management:**

- Edit their page (enters editor mode)
- View their page as others see it
- Access page settings (title, category, privacy)
- View analytics: total stickers received, breakdown by beeps/buzzes

**Activity Overview:**

- List of pages where they've placed stickers
- Quick navigation to revisit those pages
- Remove stickers from this interface

## Content Moderation

### AI Moderation

**Automated Scanning:**

- Text content in all elements is scanned before page publish
- YouTube video titles and thumbnails are checked via YouTube API
- Usernames are scanned before account creation
- Re-scans occur when pages are edited

**Violations:**

- Page doesn't publish or reverts to previous version
- Creator receives clear explanation of the issue
- Repeated violations trigger account review

### User Reporting

Any authenticated user can report a page for inappropriate content.

**Reporting Flow:**

- Report button accessible on every page
- User selects reason (inappropriate content, spam, harassment, other)
- Optional text explanation
- Report submitted to admin queue

**Automatic Actions:**

- Pages receiving 3 reports (configurable threshold) are automatically hidden
- Hidden pages are inaccessible until admin review
- Page creator is notified of the suspension

### Admin Management

**Admin Dashboard:**

- Queue of reported pages requiring review
- List of automatically hidden pages (by report threshold)
- Ability to view full page content and sticker activity
- Actions available:
  - Approve (unhide page, dismiss reports)
  - Remove page (delete permanently)
  - Warn user (send notification)
  - Ban user (prevent access, remove all pages)
- Audit log of all moderation actions
