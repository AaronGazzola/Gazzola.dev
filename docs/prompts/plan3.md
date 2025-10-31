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
  - `setIsExpanded: (isExpanded: boolean) => void` - Update expanded state
  - `reset: () => void` - Reset to initial state

**Store implementation**:
- Use `create` from `zustand`
- Use `persist` middleware from `zustand/middleware`
- Initial state: `{ isExpanded: true }`
- Persist to localStorage with name: `header-state`

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
- Export `testimonials` constant array with the 13 provided testimonials:
1. Next.js Supabase School Menu Feature Development
2. Kitcode Tests
3. Kitcode improvements
4. Mednotes Kitcodes
5. NextJS developer to pass Google Core Web Vitals
6. Product development using Next.js/Ant D/Typescript/Supabase
7. NextJS Engineer
8. Firebase authentication and Realtime database
9. Reporting dashboard for Facebook digital marketing agency
10. Board Game Company PWA Developer
11. Create React App to NextJS migration
12. Rainbow of Emotions web app
13. NextJS developer to pass Google Core Web Vitals (duplicate entry)

### 3. Create Testimonial Card Component

**File**: `app/(components)/TestimonialCard.tsx`

Create a new component with:
- Props: `testimonial: Testimonial`
- Visual design:
  - Similar styling to current floating badges (dark background, rounded, shadow)
  - White text on black background with gray-500 shadow
  - Display rating with stars or numeric value
  - Show abbreviated quote (first 100 characters with ellipsis)
  - Display contract amount prominently
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
   - `HeaderState` interface
   - `testimonials` constant array (13 testimonials)
2. Create `Header.store.ts` with zustand persist store
3. Create `TestimonialCard.tsx` component
4. Add hooks to `Header.hooks.ts`:
   - `useAutoScroll`
   - `useHeaderCollapseOnScroll`
5. Add scrollbar hiding CSS to `app/globals.css`
6. Refactor Header.tsx:
   - Replace local state with zustand store
   - Add `useHeaderCollapseOnScroll()` call
   - Add CodeReviewDialog imports and query state
   - Replace floating elements with carousel
   - Add CTA section
   - Add CodeReviewDialog component
7. Test functionality across breakpoints
8. Test auto-collapse on scroll to bottom
9. Test persist store functionality
10. Add tests if required

## Notes

- Follow CLAUDE.md rules: no comments in code
- Use `cn` from `@/lib/utils` for class concatenation (per CLAUDE.md line 17)
- Use `getBrowserAPI` from `@/lib/env.utils` for browser API access (per CLAUDE.md lines 100-109)
- Maintain existing `sourceCodePro` font className
- Replace local state with zustand persist store (per CLAUDE.md patterns)
- Preserve existing YouTube button and theme controls
- Ensure no layout shift when header collapses
- Consider performance: virtualize testimonials if carousel becomes laggy
- Initial state: header is expanded (`isExpanded: true`)
- Auto-collapse behavior: header collapses when user scrolls to bottom of page
- Persist behavior: header state survives page reloads via localStorage
