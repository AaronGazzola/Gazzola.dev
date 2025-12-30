# beep.buzz

beep.buzz is a playful social media platform where users create personalized pages at their own subdomain (username.beep.buzz). Each page is a customizable, vertically-scrolling canvas containing text, shapes, and embedded YouTube videos. Users interact by placing decorative "beep" and "buzz" stickers on each other's pages, with each sticker serving as a clickable link to that visitor's page. The platform emphasizes creative expression, simple interactions, and organic discovery through sticker-based navigation.

## Pages

### Homepage (/)

The main discovery and navigation hub at beep.buzz. Users can search for pages by title or @username with real-time results, browse featured sections (Popular Pages, Recently Active, New Pages), filter by categories (Art, Music, Personal, Tech, Fun, Memes, Other), or discover random pages. Each page card displays the title, username, visual preview, beep/buzz counts, and category tag. A prominent random page button encourages serendipitous discovery.

### User Page (username.beep.buzz)

Each user's personal subdomain displays their customizable page. The static header shows the page title, username, creator's personal beep and buzz stickers, and total sticker counts. A sticky header appears on scroll with toggle visibility for all stickers and "Add Beep"/"Add Buzz" buttons. The main content area contains the creator's vertically-scrolling elements (text blocks, shapes, YouTube embeds) with visitor stickers layered on top. Visitors can click stickers to see who placed them and navigate to that person's page, creating organic discovery trails.

### Page Editor (/edit)

Authenticated page owners access this builder interface to create and customize their personal page. Users can add and configure three element types: text blocks (with rich text editing, font sizing, color picking, alignment), shapes and dividers (rectangles, circles, lines with customizable colors and transparency), and YouTube embeds (with aspect ratio and autoplay options). Elements can be dragged to reorder, resized (25%, 50%, 75%, 100% width), aligned, edited, and deleted. The editor includes responsive preview toggles for desktop, tablet, and mobile. Page limits include maximum 20 elements, 3 YouTube embeds, 3000px height, and 50 of each sticker type.

### Page Settings (/settings/page)

Users configure their page metadata including title (displayed in header and search results), category selection, optional description for discovery, and privacy settings (Public or Username Whitelist for restricted access). When publishing, all content is AI-scanned for harmful material and YouTube videos are checked via API. Pages go live immediately if moderation passes, otherwise creators receive explanations and the page reverts to the previous version.

### User Settings (/settings)

Authenticated users manage their personal sticker identity and account. They can change their beep and buzz icons (selected from Lucide, Phosphor, and one additional MIT-licensed library), customize icon colors, background colors, and background shapes (circle, square, diamond, heart, and additional preset shapes). Changes update retroactively across all pages where stickers were placed. Users can preview changes before saving. The activity overview shows all pages where they've placed stickers with quick navigation and removal options. Analytics display total stickers received with breakdowns by beeps and buzzes.

### Onboarding (/welcome)

First-time authenticated users (via email magic link) complete their profile setup. They choose a unique username (3-20 URL-friendly characters, AI-scanned for inappropriate content) that becomes their subdomain. Then they select and customize their personal beep and buzz icons, choosing icons from available libraries, icon colors, background colors, and background shapes. After setup, users can immediately start exploring pages and placing stickers.

### Admin Dashboard (/admin)

Admin-only interface for content moderation. The dashboard displays a queue of reported pages requiring review, a list of automatically hidden pages (pages receiving 3+ reports are auto-hidden), and the ability to view full page content and sticker activity. Available actions include approving pages (unhide and dismiss reports), removing pages permanently, warning users with notifications, and banning users (preventing access and removing all pages). An audit log tracks all moderation actions.

## User Experience

New users arrive at the homepage, sign in via email magic link, and complete onboarding by choosing their username and customizing their beep/buzz stickers. They can immediately browse the homepage to discover pages through search, category filters, or the random page button. When visiting another user's page, they scroll through the creative content and can place their beep or buzz sticker by clicking the add button and selecting a position on any element. Clicking any sticker reveals who placed it and provides navigation to that user's page, creating discovery trails through the community.

Users create their own page by accessing the page editor, where they build a vertical canvas using text blocks, shapes, and YouTube embeds. They customize their page settings (title, category, description, privacy) and publish when ready, with AI moderation ensuring content safety. Users manage their sticker identity through user settings, knowing that any changes to their beep or buzz stickers update everywhere they've been placed. They can view their activity overview to revisit pages where they've left stickers and track engagement on their own page through analytics.

The platform encourages organic discovery as users follow sticker trails from page to page, finding new creators through the visual breadcrumbs left by the community. The simple interaction model (placing one beep and one buzz per page) keeps engagement focused while allowing pages to accumulate rich layers of stickers over time. The subdomain structure (username.beep.buzz) gives each creator their own identity and shareable space within the platform ecosystem.

## Getting Started

Visit beep.buzz and sign in using the email magic link authentication. After receiving and clicking your magic link, complete the onboarding flow by selecting a unique username that will become your subdomain (username.beep.buzz). Customize your personal beep and buzz stickers by choosing icons, colors, and background shapes that represent your identity across the platform.

Start exploring by browsing the homepage featured sections, using the search bar to find specific users or topics, or clicking the random page button to discover something unexpected. When you visit a page you enjoy, place your beep or buzz sticker to leave your mark and create a link back to your future page. Click on other visitors' stickers to discover their pages and navigate the community.

Create your own page by accessing the page editor and building your vertical canvas with text, shapes, and YouTube videos. Customize your page settings with a title, category, and description to help others discover your content. Publish when ready and your page goes live at your personal subdomain. Update your sticker identity anytime through user settings, knowing your visual signature updates everywhere you've placed stickers.
