# Tasks

## Active tasks

- [ ] The power of opinionation
- [ ] fix globals.css output:
      .theme-radius {
      border-radius: var(--theme-radius);
      }

.theme-shadow {
box-shadow: var(--theme-shadow);
}

|
v

.radius {
border-radius: var(--radius);
}

.shadow {
box-shadow: var(--shadow);
}

- [ ] Portfolio videos
- [ ] fix layout wireframe in app structure
- [ ] Update the theme components script to remove the "-theme" prefix and change tailwind util file import to the default
- [ ] fix letter spacing in light mode
- [ ] extend walkthrough
- [ ] fix the ability to create a app directory and page file from adding a route segment in AppStructure
- [ ] The theme styles aren't being applied to the correct elements in the shadcn components - go through and update each of the components in "component/editor/ui/\*" to use apply the correct styles to the correct elements.
- [ ] Add templates for the route structure
- [ ] expand/improve walkthrough
- [ ] Add theme presets from tweakcn
- [ ] fix editor reset bug on editor store state change (eg. after updating the ThemeConfiugration)
- [ ] Landing page
- [-] improve App Directory page UX
- [ ] Update the tech stack page
  - [ ] Add a database question and hosting service selection that will include/exclude Supabase, Vercel and Railway
- [ ] Add reminder icon/badge to download the roadmap in case the content changes (and explaining that the app is in development)
- [-] Update `markdown-data.md`
- [ ] fix: reset placeholder data with reset all
- [ ] test: set and reset single page and all data local and deployed.
- [ ] Update downloaded content to handle new content (ie PlaceholderNodes, initial config)
- [ ] Add steps to walkthrough
- [ ] Make the walkthrough reset button more prominent
- [ ] Add labels for options in section nodes
- [ ] remove sections menu from toolbar
- [ ] Move files selection to sidebar
- [ ] fix hydration error (AppStructure)
- [ ] Add dropdown for add new button in AppStructure (layout file, page file etc)
- [ ] Update downloaded content to handle new content (ie PlaceholderNodes, initial config)
- [ ] Add tests
- [ ] Update source markdown content
  - [ ] Add styling content
- [ ] Add shadcn variants for the editor components
- [ ] Add donate UX on download
- [ ] Add donation goal tracking
- [-] fix Header responsive design
- [ ] Update source markdown content

## Completed tasks

- [x] Write a prompt on lecture to quiz learning method.
- [x] Add dynamic component theme and styling page
- [x] Fix bug: when switching between preview and edit mode in the editor, the editor changes are lost.
- [x] rename "default" shadcn directory to "editor"
- [x] Fix automatic reset on page load in deployment
- [x] Remove "reset all" prompt on stale version, automatically update
- [x] Add wire-frame page and layout builder component
- [x] Refactor tech stack selection
- [x] Add output preview toggle
- [x] Progress walkthrough when the user clicks the target element
- [x] Fix the width of the accordion triggers in the InitialConfig component
- [x] Refactor parse markdown script to use a server action
- [x] Fix walkthrough styling and position
- [x] initial config component
- [x] Reset prompt from markdown version change
- [x] Fix walkthrough position
- [x] Highlight target element in walkthrough
- [x] Fix section selection popover
- [x] Add inline text edit components
- [x] update parse script to include/exclude sections by default with asterix ("\*")
- [x] Add section selection popover to each SectionNode
- [x] Update section node styling
- [x] Add sheet UI to edit app structure throughout the app
- [x] fix hydration error (AppStructure)
- [x] Simplify initial App Structure
- [x] remove console.logs
- [x] Expand AppStructure component to output nested layout diagrams
- [x] Update the claude document
- [x] Remove excluded content from downloaded files
- [x] Default to dark theme
- [x] Make section selection agnostic (currently hard coded to "welcome")
- [x] Add UX for configuring the app structure with nested layouts
- [x] Refactor data management to include/exclude files/directories
- [x] Add a download button to download files
- [x] Delete all UX except for the hero, sidebar and about page
- [x] Add a permanently open dialog that will display a "coming soon" message
- [x] Add the navigation buttons to the sidebar
- [x] Standardize the outline button in the shadcn component
- [x] Update Next steps section of about page
  - [x] Make flow diagram with icons
  - [x] Add step 4 - download roadmap
- [x] Add a theme control panel
  - [x] Colors
  - [x] number, density, size of stars
  - [x] Make header collapsible
- [x] Catch all nested navigation route
- [x] Sidebar route navigation
- [x] Create a theme selection UX
- [x] Add theme configuration page
- [x] Add rich text editor to display markdown instruction files.
- [x] Refactor away from hard coded documents
- [x] Add a toolbar with progress tracking and reset functionality
- [x] Improve progress tracking
- [x] Improve sidebar navigation
- [x] Add buttons to control section content
- [x] Add a dynamic route map generator
  - [x] app dir config UI -> output route structure
- [x] refactor to use dynamic sections.
  - [x] Dynamic editor state and types to store the markdown source in object structure for editor state access.
- [x] rename compile to parse
- [x] Refactor markdown parsing and editor data management
- [x] Update the user input storage method
- [x] Fix editor comment transform error
- [x] Add section selection menu to the editor Toolbar
- [x] Remove asterix ("\*") from paths

## Live stream notes

- [ ] payload cms
  - [ ] https://payloadcms.com/get-started
- [ ] playright mcp (needs policy change to change setting)
  - [ ] https://playwright.dev/agents
- [ ] ~~augment code~~ (context and collab features aren't required for my use)
- [ ] ~~warp ai~~ (cannot use claude plan)
- [x] Sean kochle "my new method"
- [ ] AGENTS.md
- [x] GPT-5 Codex news
- [ ] Poll results: (what do you want to see?)
  - Explain stuff 43%
  - Bug fixes 29%
  - New features 14%
  - e2e and unit tests 14%
- [x] Research Codex
- [x] N8N
- Poll results: (What should my next "side quest" be?)
  - AI image analysis/recognition 57%
  - Bitcoin trading simulator 29%
  - Project management dashboard 14%
  - Dream analysis consultation app 0% lol
- What should I do next in Minecraft?
  Go to the Nether (50%)
  Parkour! (25%)
  Build automated farms (25%)
  Trade to get diamond tools & armor (0%)
- What made you click on this stream?
  I'm a vibe coder here to learn! (33%)
  Just bored & curious, what is this? (33%)
  Background company and chill vibes (17%)
  Minecraft + programming looks fun (17%)

Poll complete: 6 votes

- Godel's incompleteness theorem states that any formal system contains truths that cannot be proved within that formal system.
- RL trained on minecraft
- Parmededes

- OpenAI agent builder
- Phoenix live view
- ​lerty.ai
