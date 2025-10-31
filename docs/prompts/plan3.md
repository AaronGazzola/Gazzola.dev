# Plan: Header Component Refactor with Testimonial Carousel and CTA

## Overview
Refactor the Header component to replace the three static floating elements with a horizontally scrolling testimonial carousel, and add a call-to-action section at the bottom that opens the CodeReviewDialog.

## Current State Analysis

### Existing Floating Elements
- Located at [Header.tsx:192-218](app/(components)/Header.tsx#L192-L218)
- Three `ScrollParallax` wrapped divs containing:
  - "Top Rated Plus" badge (line 193-200)
  - "100% Job Success" badge (line 202-211)
  - "7 years of experience" badge (line 213-217)
- Only visible when `!headerIsCollapsed`

### Reference Components
- Get Started button pattern: [page.tsx:994-1002](app/about/page.tsx#L994-L1002)
- Footer CodeReviewDialog trigger: [Footer.tsx:23-50](app/(editor)/Footer.tsx#L23-L50)

## Implementation Plan

### 1. Create Header State Store with Persist

**File**: `app/(components)/Header.store.ts`

Create a new zustand persist store alongside Header.tsx following the pattern from [docs/util.md](docs/util.md#stores-file-example):

**Store interface** (define in `Header.types.ts`):
- `HeaderState` interface containing:
  - `isExpanded: boolean` - Whether header is in expanded state
  - `hasBeenCollapsed: boolean` - Whether header has ever been collapsed (used to control walkthrough dialog)
  - `setIsExpanded: (isExpanded: boolean) => void` - Update expanded state
  - `reset: () => void` - Reset to initial state

**Store implementation**:
- Use `create` from `zustand`
- Use `persist` middleware from `zustand/middleware`
- Initial state: `{ isExpanded: true, hasBeenCollapsed: false }`
- Persist to localStorage with name: `header-state`
- When `setIsExpanded(false)` is called, also set `hasBeenCollapsed: true`

### 2. Create Testimonial Data Structure

**File**: `app/(components)/Header.types.ts`

Create a new type file alongside Header.tsx with:
- `Testimonial` interface containing:
  - `title: string` - Project title
  - `rating: string` - Rating value (e.g., "5.0")
  - `dateRange: string` - Contract dates
  - `quote: string` - Client testimonial
  - `amount: string` - Contract value
  - `contractType: "Fixed price" | "Hourly"` - Type of contract
  - `hourlyRate?: string` - Hourly rate (if applicable)
  - `hours?: number` - Total hours (if applicable)

- `HeaderState` interface (for store)
- Export `testimonials` constant array with the 13 provided testimonials (all 5.0 rating):

```typescript
export const testimonials: Testimonial[] = [
  {
    title: "Next.js Supabase School Menu Feature Development",
    rating: "5.0",
    dateRange: "Jul 5, 2025 - Sep 22, 2025",
    quote: "Aaron was great and would definitely work with him in the future! Super communicative and completed the project above and beyond",
    amount: "$2,125.00",
    contractType: "Fixed price"
  },
  {
    title: "Kitcode Tests",
    rating: "5.0",
    dateRange: "Apr 14, 2025 - Apr 26, 2025",
    quote: "Aaron is a talented freelancer who makes an effort to understand the problems he is asked to solve.",
    amount: "$400.00",
    contractType: "Fixed price"
  },
  {
    title: "Kitcode improvements",
    rating: "5.0",
    dateRange: "Mar 29, 2025 - Apr 14, 2025",
    quote: "Aaron is an extremely talented and thoughtful developer who writes and engineers excellent code and is focused on a quality, maintainable deliverable.",
    amount: "$800.00",
    contractType: "Fixed price"
  },
  {
    title: "Mednotes Kitcodes",
    rating: "5.0",
    dateRange: "Mar 18, 2025 - Mar 27, 2025",
    quote: "Aaron is a highly conscientious and talented developer who really came through on my project(s). I look forward to working with him again many times!",
    amount: "$1,350.00",
    contractType: "Fixed price"
  },
  {
    title: "NextJS developer to pass Google Core Web Vitals",
    rating: "5.0",
    dateRange: "Nov 4, 2023 - Sep 4, 2024",
    quote: "Aaron is a great communicator and gets work done. He helped us with NextJs and other frameworks.",
    amount: "$35,565.81",
    contractType: "Hourly",
    hourlyRate: "$65.00",
    hours: 547
  },
  {
    title: "Product development using Next.js/Ant D/Typescript/Supabase",
    rating: "5.0",
    dateRange: "Mar 25, 2024 - May 14, 2024",
    quote: "Great to work with Aaron. He understood what we were trying to achieve and was swiftly up and running on the project. He provided great value suggestions and came up…",
    amount: "$10,139.99",
    contractType: "Hourly",
    hourlyRate: "$65.00",
    hours: 156
  },
  {
    title: "NextJS Engineer",
    rating: "5.0",
    dateRange: "Dec 7, 2021 - Dec 9, 2023",
    quote: "Aaron helped us create an MVP of a key feature of our product in an efficient manner. The scope of the contract grew as he continued delivering features and was very enjoyable to work with. I appreciated that he frequently sought feedback and worked to deliver a high quality product.",
    amount: "$218,441.66",
    contractType: "Hourly",
    hourlyRate: "$70.00",
    hours: 3251
  },
  {
    title: "Firebase authentication and Realtime database with Next.js for an RPG Maker JavaScript game",
    rating: "5.0",
    dateRange: "Dec 18, 2021 - Nov 3, 2023",
    quote: "If you are going to work with any developer on Upwork, make sure it is Aaron. Why should you work with Aaron? 1) He has the ability to work on…",
    amount: "$4,322.67",
    contractType: "Hourly",
    hourlyRate: "$50.00",
    hours: 85
  },
  {
    title: "Reporting dashboard for Facebook digital marketing agency",
    rating: "5.0",
    dateRange: "Dec 16, 2021 - Feb 12, 2022",
    quote: "Aaron is extremely professional & knowledge. Aaron sends video updates on all work that has been completed & at each step of the milestone. I would definitely work with Aaron…",
    amount: "$205.80",
    contractType: "Fixed price"
  },
  {
    title: "Board Game Company looking for PWA Developer for Fun Web App for existing Physical Game",
    rating: "5.0",
    dateRange: "Oct 27, 2021 - Dec 3, 2021",
    quote: "Working with Aaron has been a real pleasure. From the creative introduction, Aaron caught my attention by sending a video of himself talking about the project and the services we could provide. Fully understanding what we wanted to accomplish. Needless to say, we hired him. The contract was for a streamlined Progressive Web App to be used in connection with our board games. The application needed to be both visually appealing, responsive and contain an admin for us to moderate the game mechanics. Aaron delivered exactly what we requested. On time and with excellent results.",
    amount: "$1,876.00",
    contractType: "Fixed price"
  },
  {
    title: "Create React App to NextJS migration",
    rating: "5.0",
    dateRange: "Sep 23, 2021 - Sep 25, 2021",
    quote: "He understood the requirements, provided a personalized video to apply for the gig, got to work right away, and delivered on time. Wasn't expecting this kind of work. It was a delight to work with Aaron. Totally recommended!",
    amount: "$196.00",
    contractType: "Fixed price"
  },
  {
    title: "Rainbow of Emotions web app",
    rating: "5.0",
    dateRange: "Jun 25, 2021 - Jul 14, 2021",
    quote: "Even though Aaron appeared to be alot younger and not as the experienced as the other Freelancers I feel so blessed that I chose him. His professionalism, insight and communication skills was exactly what I needed. Thankyou Aaron.",
    amount: "$1,980.00",
    contractType: "Fixed price"
  }
];
```

### 3. Create Testimonial Card Component

**File**: `app/(components)/TestimonialCard.tsx`

Create a new component with:
- Props: `testimonial: Testimonial`
- Visual design:
  - Similar styling to current floating badges (dark background, rounded, shadow)
  - White text on black background with gray-500 shadow
  - Display rating with stars or numeric value
  - Show abbreviated quote (first 100 characters with ellipsis)
  - Display contract amount prominently with subscript "USD" (e.g., `$2,125.00<sub>USD</sub>`)
  - Show date range in smaller text
  - Responsive sizing: similar to current badges (auto width based on content, ~padding-2)
  - Add `whitespace-nowrap` to prevent text wrapping
- Use theme colors from `useThemeStore` for accent colors (gradient or single color)
- No data-attributes needed (not a test target per CLAUDE.md)

### 4. Create Horizontal Scroll Container Hook

**File**: `app/(components)/Header.hooks.ts`

Existing file contains `useYouTubeSubscriberCount`. Add new hooks:

**Hook 1**: `useAutoScroll`
- Parameters:
  - `scrollContainerRef: RefObject<HTMLDivElement>`
  - `scrollSpeed: number` (default: 1 pixel per 30ms)
- State:
  - `isHovering: boolean`
  - `lastInteractionTime: number | null`
  - `isPaused: boolean`
- Effects:
  - Auto-scroll effect:
    - Use `setInterval` to increment `scrollLeft` continuously
    - Pause when `isHovering` is true
    - Pause for 3 seconds after `lastInteractionTime`
    - Loop back to start when reaching end
  - Mouse enter/leave listeners on container
  - Mouse/touch event listeners to update `lastInteractionTime`
- Returns: Event handlers for container element

**Hook 2**: `useHeaderCollapseOnScroll`
- Import `getBrowserAPI` from `@/lib/env.utils` (per CLAUDE.md)
- Uses `useHeaderStore` to get/set `isExpanded` state
- Parameters: none
- Effects:
  - Add scroll event listener using `getBrowserAPI(() => window)`
  - Detect when user scrolls to bottom of page:
    - `window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100`
  - When at bottom: call `setIsExpanded(false)`
  - Cleanup listener on unmount
- Returns: nothing (side effects only)

### 5. Replace Floating Elements with Carousel

**Location**: [Header.tsx:190-232](app/(components)/Header.tsx#L190-L232)

Replace the current state management:
- Remove local `headerIsCollapsed` state
- Import and use `useHeaderStore` instead: `const { isExpanded } = useHeaderStore()`
- Call `useHeaderCollapseOnScroll()` to enable auto-collapse behavior

Replace the current `!headerIsCollapsed` section containing three `ScrollParallax` elements with:

```tsx
{isExpanded && (
  <>
    <div
      ref={scrollContainerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
      className="w-full overflow-x-auto overflow-y-hidden hide-scrollbar"
      style={{
        scrollBehavior: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="flex gap-4 py-4 px-2">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>

    {/* Bottom CTA Section */}
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-lg font-medium text-center">
        Are you vibe coding a web app? You need tests!
      </p>
      <Button
        variant="outline"
        className="border border-transparent bg-transparent text-gray-300 bg-black font-semibold flex items-center gap-4 text-xl px-8 py-6"
        onClick={() => setCodeReviewDialogOpen("yesPlease")}
      >
        Get a free code review!
        <FlaskConical className="w-6 h-6" />
      </Button>
    </div>

    {/* Keep existing image and vignette */}
    <Image ... />
    <div className="absolute bottom-0 ..." />
  </>
)}
```

### 6. Add CodeReviewDialog Integration

**Location**: [Header.tsx](app/(components)/Header.tsx)

Add imports and state management:
- Import `CodeReviewDialog` from `@/app/(editor)/CodeReviewDialog`
- Import `useQueryState` from `nuqs`
- Add query state: `const [codeReviewDialogOpen, setCodeReviewDialogOpen] = useQueryState("codeReview")`
- Add dialog component after main component return (similar to Footer.tsx pattern)
- Create `handleDialogOpenChange` function to manage dialog state

### 7. Add Scrollbar Hiding CSS

**File**: `app/globals.css` or inline styles

Add utility class to hide scrollbars while maintaining scroll functionality:
```css
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
```

### 8. Responsive Behavior

- Desktop (md and up):
  - Show multiple testimonial cards in viewport
  - Smooth auto-scroll
  - Hover to pause
- Mobile (sm and below):
  - Show 1-2 cards in viewport
  - Touch-friendly scrolling
  - Touch to pause for 3 seconds

### 9. Icon Selection for CTA Button

Use `FlaskConical` from lucide-react (already imported) to represent testing/code review.
Alternative icons: `FileCheck`, `ClipboardCheck`, `Code2`

## File Changes Summary

### New Files
1. `app/(components)/Header.types.ts` - Testimonial interface, HeaderState interface, and testimonials data
2. `app/(components)/Header.store.ts` - Zustand persist store for header state
3. `app/(components)/TestimonialCard.tsx` - Individual testimonial card component

### Modified Files
1. `app/(components)/Header.tsx` - Main component refactor
   - Replace local state with zustand store
   - Add auto-collapse behavior
   - Replace floating badges with carousel
   - Add CTA section
   - Add CodeReviewDialog integration
2. `app/(components)/Header.hooks.ts` - Add useAutoScroll and useHeaderCollapseOnScroll hooks
3. `app/globals.css` - Add scrollbar hiding utility
4. `app/(editor)/components/Toolbar.tsx` - Update walkthrough dialog condition
   - Import `useHeaderStore` from `@/app/(components)/Header.store`
   - Add condition to `showInitialDialog`: only show if `hasBeenCollapsed` is true
   - Change line 163 from:
     ```tsx
     const showInitialDialog =
       mounted && shouldShowStep(WalkthroughStep.INITIAL_DIALOG) && !codeReviewDialogOpen;
     ```
     To:
     ```tsx
     const { hasBeenCollapsed } = useHeaderStore();
     const showInitialDialog =
       mounted && shouldShowStep(WalkthroughStep.INITIAL_DIALOG) && !codeReviewDialogOpen && hasBeenCollapsed;
     ```

### Dependencies
No new dependencies required. Using existing:
- `zustand` and `zustand/middleware` for persist store
- `nuqs` for query state management
- `lucide-react` for icons
- `framer-motion` (optional for card animations)
- `@/components/ui/button` for CTA button
- `@/lib/env.utils` for browser API access
- Existing theme store hooks

## Testing Considerations

Per CLAUDE.md testing guidelines:
- Add data-attributes enum to `@/test.types.ts` if needed:
  - `HEADER_CTA_BUTTON`
  - `TESTIMONIAL_CAROUSEL`
- Create tests in appropriate test file
- Test auto-scroll behavior
- Test pause on hover/touch
- Test dialog opening from CTA button
- Test responsive behavior
- Test header collapse on scroll to bottom
- Test persist store (header state should survive page reload)

## Implementation Order

1. Create `Header.types.ts` with:
   - `Testimonial` interface
   - `HeaderState` interface (with `hasBeenCollapsed` field)
   - `testimonials` constant array (12 testimonials)
2. Create `Header.store.ts` with zustand persist store
   - Implement logic to set `hasBeenCollapsed: true` when header collapses
3. Create `TestimonialCard.tsx` component
4. Add hooks to `Header.hooks.ts`:
   - `useAutoScroll`
   - `useHeaderCollapseOnScroll` (should update both `isExpanded` and `hasBeenCollapsed`)
5. Add scrollbar hiding CSS to `app/globals.css`
6. Refactor Header.tsx:
   - Replace local state with zustand store
   - Add `useHeaderCollapseOnScroll()` call
   - Add CodeReviewDialog imports and query state
   - Replace floating elements with carousel
   - Add CTA section
   - Add CodeReviewDialog component
7. Update Toolbar.tsx:
   - Import `useHeaderStore`
   - Add `hasBeenCollapsed` check to `showInitialDialog` condition
8. Test functionality across breakpoints
9. Test auto-collapse on scroll to bottom
10. Test persist store functionality
11. Test walkthrough dialog only shows after header has been collapsed
12. Add tests if required

## Notes

- Follow CLAUDE.md rules: no comments in code
- Use `cn` from `@/lib/utils` for class concatenation (per CLAUDE.md line 17)
- Use `getBrowserAPI` from `@/lib/env.utils` for browser API access (per CLAUDE.md lines 100-109)
- Maintain existing `sourceCodePro` font className
- Replace local state with zustand persist store (per CLAUDE.md patterns)
- Preserve existing YouTube button and theme controls
- Ensure no layout shift when header collapses
- Consider performance: virtualize testimonials if carousel becomes laggy
- Initial state: header is expanded (`isExpanded: true, hasBeenCollapsed: false`)
- Auto-collapse behavior: header collapses when user scrolls to bottom of page
- Persist behavior: header state survives page reloads via localStorage
- Walkthrough dialog behavior: The walkthrough dialog in Toolbar.tsx should ONLY display after the header has been collapsed at least once (i.e., when `hasBeenCollapsed` is true). This ensures users see the testimonial carousel before being shown the walkthrough.
