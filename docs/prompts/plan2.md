# Plan: Tests Component Implementation

## Overview

Create a `Tests` component that displays an editable index of test suites, pre-populated from features defined in AppStructure. The component will replace the `<!-- component-Tests -->` comment in the Tests.md file and follow the same architectural patterns as the existing AppStructure component.

## Reference Architecture

**Working Example:** `app/(components)/AppStructure.tsx`

- WireFrame component: Visual layout representation
- AppStructure component: File system tree with CRUD operations
- LayoutAndStructure component: Combined view wrapper
- Uses Zustand store for state management
- Integrates with ComponentNode for rendering in markdown

## Component Structure

### 1. Core Component: `Tests`

**File:** `app/(components)/Tests.tsx`

**Responsibilities:**

- Display test index with add/remove/edit capabilities
- Sync with features from AppStructure store
- Provide reset functionality to regenerate from features
- Render test structure following Tests.md format

**State Management:**

```typescript
interface TestSuite {
  id: string;
  name: string;
  featureId?: string;
  description: string;
  command: string;
  testCases: TestCase[];
  isEditing?: boolean;
}

interface TestCase {
  id: string;
  description: string;
  passCondition: string;
  isEditing?: boolean;
}
```

### 2. Store Integration

**File:** `app/(editor)/layout.stores.ts`

**New State:**

```typescript
interface EditorStore {
  // Existing state...
  testSuites: TestSuite[];

  // New actions
  addTestSuite: (suite: Omit<TestSuite, "id">) => void;
  updateTestSuite: (id: string, updates: Partial<TestSuite>) => void;
  removeTestSuite: (id: string) => void;
  addTestCase: (suiteId: string, testCase: Omit<TestCase, "id">) => void;
  updateTestCase: (
    suiteId: string,
    caseId: string,
    updates: Partial<TestCase>
  ) => void;
  removeTestCase: (suiteId: string, caseId: string) => void;
  resetTestsFromFeatures: () => void;
  reorderTestSuites: (fromIndex: number, toIndex: number) => void;
}
```

### 3. Feature-to-Test Generation Logic

**Function:** `generateTestsFromFeatures()`

**Algorithm:**

1. Iterate through all features in AppStructure
2. For each feature, create a TestSuite:
   - name: Feature title
   - description: Feature description
   - command: `npm run test:${kebabCase(feature.title)}`
   - featureId: feature.id (for tracking relationship)
3. Generate default test cases based on feature type:
   - Basic CRUD operations
   - Access control checks
   - Data validation tests

**Example Mapping:**

```typescript
Feature: "User Authentication"
├─ stores: auth.stores.ts
├─ hooks: auth.hooks.tsx
├─ actions: auth.actions.ts
└─ types: auth.types.ts

↓ Generates ↓

TestSuite: "User Authentication Tests"
├─ should successfully sign in with valid credentials
│  ✓ User redirected to dashboard after sign in
├─ should reject invalid credentials
│  ✓ Error message displayed for invalid credentials
├─ should update auth store on successful login
│  ✓ Auth store contains user data after login
└─ should handle sign out correctly
   ✓ User redirected to auth page after sign out
```

## Component Layout

### Visual Structure

```
┌─────────────────────────────────────────────────────────┐
│ Tests Component                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [+ Add Test Suite]  [Reset from Features] [Generate]   │
│                                                         │
│ Test Index:                                            │
│ ┌───────────────────────────────────────────────────┐ │
│ │ 1. User Authentication Tests                      │ │
│ │    npm run test:user-authentication               │ │
│ │    [Edit] [Delete] [↑] [↓]                        │ │
│ │                                                    │ │
│ │    Test Cases:                                     │ │
│ │    • should successfully sign in                   │ │
│ │      ✓ User redirected to dashboard               │ │
│ │    • should reject invalid credentials             │ │
│ │      ✓ Error message displayed                    │ │
│ │    [+ Add Test Case]                              │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────────────────────────────────────────┐ │
│ │ 2. Booking Flow Tests                             │ │
│ │    npm run test:booking-flow                      │ │
│ │    [Edit] [Delete] [↑] [↓]                        │ │
│ │    ...                                             │ │
│ └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Edit Mode Layout

```
┌─────────────────────────────────────────────────────────┐
│ Editing: User Authentication Tests                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Test Suite Name:                                       │
│ [User Authentication Tests________________]            │
│                                                         │
│ Description:                                           │
│ [Tests for user sign in, sign out, and session____]   │
│ [management functionality_______________________]      │
│                                                         │
│ Command:                                               │
│ [npm run test:user-authentication_______________]      │
│                                                         │
│ Test Cases:                                            │
│ ┌─────────────────────────────────────────────────┐   │
│ │ • [should successfully sign in______________]   │   │
│ │   ✓ [User redirected to dashboard__________]    │   │
│ │   [Remove]                                      │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ [+ Add Test Case]                                      │
│                                                         │
│ [Save] [Cancel]                                        │
└─────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Extend Store (layout.stores.ts)

**Tasks:**

- Add testSuites array to EditorStore interface
- Implement testSuite CRUD actions
- Implement testCase CRUD actions within suites
- Add resetTestsFromFeatures action
- Add reorderTestSuites action for drag-and-drop

**Key Function:**

```typescript
resetTestsFromFeatures: () => {
  const features = get().features;
  const testSuites: TestSuite[] = [];

  // Iterate through file system to find all features
  Object.entries(features).forEach(([fileId, featureList]) => {
    featureList.forEach((feature) => {
      testSuites.push({
        id: generateId(),
        name: `${feature.title} Tests`,
        featureId: feature.id,
        description: feature.description,
        command: `npm run test:${kebabCase(feature.title)}`,
        testCases: generateDefaultTestCases(feature),
      });
    });
  });

  set({ testSuites });
};
```

### Step 2: Create Helper Utilities

**File:** `app/(components)/Tests.utils.ts`

**Functions:**

- `generateDefaultTestCases(feature: Feature): TestCase[]`
- `generateTestCommand(title: string): string`
- `kebabCase(str: string): string`
- `generateTestsMarkdown(testSuites: TestSuite[]): string`
- `validateTestSuite(suite: TestSuite): boolean`

**Example:**

```typescript
const generateDefaultTestCases = (feature: Feature): TestCase[] => {
  const cases: TestCase[] = [];

  if (feature.linkedFiles.stores) {
    cases.push({
      id: generateId(),
      description: `should update ${feature.title} store correctly`,
      passCondition: `Store contains expected data after operation`,
    });
  }

  if (feature.linkedFiles.hooks) {
    cases.push({
      id: generateId(),
      description: `should handle loading state in ${feature.title} hook`,
      passCondition: `Loading state transitions correctly`,
    });
  }

  // Add default CRUD test cases
  cases.push(
    {
      id: generateId(),
      description: `should create ${feature.title} successfully`,
      passCondition: `New item appears in list after creation`,
    },
    {
      id: generateId(),
      description: `should update ${feature.title} successfully`,
      passCondition: `Changes reflected in UI after update`,
    }
  );

  return cases;
};
```

### Step 3: Build Tests Component

**File:** `app/(components)/Tests.tsx`

**Sub-Components:**

1. `TestSuiteCard` - Individual test suite display/edit
2. `TestCaseItem` - Individual test case display/edit
3. `TestIndexHeader` - Action buttons and controls
4. `TestsMarkdownPreview` - Preview of generated Tests.md content

**Main Component Structure:**

```typescript
export const Tests = () => {
  const {
    testSuites,
    addTestSuite,
    updateTestSuite,
    removeTestSuite,
    resetTestsFromFeatures,
    features
  } = useEditorStore();

  const [isGenerating, setIsGenerating] = useState(false);

  const handleReset = () => {
    resetTestsFromFeatures();
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const markdown = generateTestsMarkdown(testSuites);
    // Save to Tests.md or copy to clipboard
    setIsGenerating(false);
  };

  return (
    <div className="theme-p-4 theme-bg-background theme-rounded">
      <TestIndexHeader
        onAddSuite={() => addTestSuite(createEmptySuite())}
        onReset={handleReset}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      <div className="theme-mt-4 space-y-4">
        {testSuites.map((suite, index) => (
          <TestSuiteCard
            key={suite.id}
            suite={suite}
            index={index}
            onUpdate={(updates) => updateTestSuite(suite.id, updates)}
            onRemove={() => removeTestSuite(suite.id)}
            onMoveUp={() => reorderTestSuites(index, index - 1)}
            onMoveDown={() => reorderTestSuites(index, index + 1)}
            canMoveUp={index > 0}
            canMoveDown={index < testSuites.length - 1}
          />
        ))}
      </div>

      {testSuites.length === 0 && (
        <div className="theme-p-8 text-center theme-text-muted-foreground">
          No test suites defined. Click "Reset from Features" to generate
          test suites from your app features.
        </div>
      )}
    </div>
  );
};
```

### Step 4: Implement TestSuiteCard Component

**Responsibilities:**

- Display test suite information
- Toggle between view and edit modes
- Manage test cases within suite
- Handle reordering

**Features:**

- Collapsible test case list
- Inline editing for all fields
- Drag handles for reordering (future enhancement)
- Visual indication of linked feature

**Example:**

```typescript
const TestSuiteCard = ({
  suite,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}: TestSuiteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { features } = useEditorStore();

  const linkedFeature = suite.featureId
    ? Object.values(features)
        .flat()
        .find(f => f.id === suite.featureId)
    : null;

  return (
    <div className="theme-border theme-rounded theme-p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center theme-gap-2">
            <span className="theme-text-muted-foreground font-mono">
              {index + 1}.
            </span>

            {suite.isEditing ? (
              <Input
                value={suite.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="theme-shadow"
              />
            ) : (
              <h3 className="font-medium theme-text-foreground">
                {suite.name}
              </h3>
            )}
          </div>

          {linkedFeature && (
            <div className="theme-mt-1 text-xs theme-text-muted-foreground">
              Linked to feature: {linkedFeature.title}
            </div>
          )}

          <div className="theme-mt-2 text-sm theme-font-mono theme-text-muted-foreground">
            {suite.command}
          </div>
        </div>

        <div className="flex theme-gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdate({ isEditing: !suite.isEditing })}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 theme-text-destructive" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            disabled={!canMoveDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="theme-mt-4">
          <TestCaseList
            suiteId={suite.id}
            testCases={suite.testCases}
          />
        </div>
      )}
    </div>
  );
};
```

### Step 5: Register Component in ComponentNode

**File:** `app/(editor)/components/ComponentNode.tsx`

**Add to componentMap:**

```typescript
const componentMap: Record<string, any> = {
  // Existing components...
  Tests: lazy(() =>
    import("@/app/(components)/Tests").then((m) => ({
      default: m.Tests,
    }))
  ),
};
```

### Step 6: Update Markdown File

**File:** `public/data/markdown/Start_here/5-Tests.md`

**Verify comment exists:**

```md
# Tests

Describe the expected behaviour of your app verify the functionality and stress-test the security.

<!-- component-Tests -->
```

The ComponentNode parser will automatically replace this comment with the Tests component.

## Data Flow

```
User Action (Add/Edit/Remove Test)
    ↓
Tests Component
    ↓
Zustand Store Action
    ↓
Store State Update
    ↓
Component Re-render
```

```
User Clicks "Reset from Features"
    ↓
resetTestsFromFeatures()
    ↓
Read features from store
    ↓
Generate test suites via generateDefaultTestCases()
    ↓
Update testSuites state
    ↓
Re-render Tests Component
```

```
User Clicks "Generate"
    ↓
generateTestsMarkdown(testSuites)
    ↓
Format as Tests.md structure
    ↓
Copy to clipboard / Download file
```

## UI/UX Considerations

### Theme Integration

- Use theme tokens: `theme-bg-background`, `theme-text-foreground`
- Support dark mode via useEditorStore().darkMode
- Match AppStructure component styling

### Responsive Design

- Stack vertically on mobile
- Collapse test cases by default on small screens
- Horizontal scroll for long command strings

### User Feedback

- Loading state during generation
- Success toast after reset
- Confirmation dialog before destructive actions
- Validation errors inline with fields

### Accessibility

- Proper ARIA labels for all buttons
- Keyboard navigation support
- Screen reader announcements for state changes
- Focus management in edit mode

## Success Criteria

- [ ] Tests component renders in markdown via ComponentNode
- [ ] Test suites can be added, edited, removed
- [ ] Test cases can be added, edited, removed within suites
- [ ] Reset button generates tests from AppStructure features
- [ ] Generated tests follow Tests.md format specification
- [ ] State persists in Zustand store
- [ ] Component styling matches AppStructure theme
- [ ] All interactions work in both light and dark modes
- [ ] Documentation updated in relevant files

## Files to Create/Modify

### New Files

- `app/(components)/Tests.tsx` - Main component
- `app/(components)/Tests.utils.ts` - Helper functions
- `__tests__/tests-component.test.ts` - Unit tests
- `e2e/tests-component.spec.ts` - E2E tests

### Modified Files

- `app/(editor)/layout.stores.ts` - Add test state and actions
- `app/(editor)/layout.types.ts` - Add TestSuite and TestCase types
- `app/(editor)/components/ComponentNode.tsx` - Register Tests component
- `public/data/markdown/Start_here/5-Tests.md` - Already has component comment

### Documentation Updates

- `docs/Testing.md` - Add section on Tests component usage
- `CLAUDE.md` - Add reference to Tests component pattern

## Dependencies

- All Shadcn UI components already installed
- Zustand store infrastructure exists
- ComponentNode system working
- No new package installations required

## Notes

- Follow same patterns as AppStructure component
- Maintain consistency with existing codebase style
- No comments in code per CLAUDE.md rules
- Use conditionalLog for debugging
- All errors should be thrown, no fallbacks
- Import cn from @/lib/utils for class concatenation
