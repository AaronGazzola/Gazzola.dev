# Parse Refactor Plan

## Executive Summary

Refactor the parsing and download system into a modular, extensible architecture that:
- Separates concerns between parsing, transformation, and generation
- Provides better developer experience for testing and debugging
- Creates an AI-optimized output structure
- Enables easy addition of new content types and generators

## Current State Analysis

### Existing Architecture

```
Build Time:
  scripts/parse-markdown.ts → public/data/processed-markdown.json
  scripts/parse-themes.ts → public/data/processed-themes.json
  scripts/parse-files.ts → public/data/components/

Runtime:
  Zustand Store (layout.stores.ts) → User Customizations

Download Time:
  lib/download.utils.ts:
    - processContent() → Replace placeholders, sections, components
    - generateAppStructureAscii() → App directory tree
    - generateRouteMapAscii() → Route map
    - generateThemeCss() → Theme CSS
    - generateInitialConfigurationContent() → Tech docs
    - generateAndDownloadZip() → ZIP file
```

### Pain Points

1. **Monolithic Processing**: All content replacement logic in single `processContent()` function
2. **Hard to Test**: No way to preview output without downloading ZIP
3. **Limited Extensibility**: Adding new generators requires modifying multiple files
4. **Mixed Concerns**: Parsing, validation, transformation, and generation all intertwined
5. **No Validation**: Silent failures for broken placeholders or missing sections
6. **Unclear Output Structure**: Downloaded "Roadmap/" folder doesn't match sidebar navigation

## Proposed Architecture

### Phase 1: Core Refactoring

#### 1.1 Parser Plugin System

Create `/lib/parsers/` directory with plugin architecture:

```typescript
lib/parsers/
├── index.ts                    # Parser registry and orchestrator
├── base.parser.ts              # Abstract base parser class
├── types.ts                    # Shared parser types
├── markdown.parser.ts          # Markdown parser plugin
├── component.parser.ts         # Component file parser plugin
├── theme.parser.ts             # Theme parser plugin
└── validation.parser.ts        # Validation utilities
```

**Base Parser Interface**:

```typescript
interface Parser {
  name: string
  parse(input: ParseInput): Promise<ParseOutput>
  validate(output: ParseOutput): ValidationResult
}

interface ParseInput {
  sourcePath: string
  options: Record<string, unknown>
}

interface ParseOutput {
  type: string
  data: unknown
  metadata: ParserMetadata
}
```

**Benefits**:
- Each content type has isolated parsing logic
- Easy to add new parsers (e.g., `api-spec.parser.ts`, `diagram.parser.ts`)
- Testable in isolation
- Shared validation utilities

#### 1.2 Content Pipeline

Create `/lib/pipeline/` directory for transformation steps:

```typescript
lib/pipeline/
├── index.ts                    # Pipeline orchestrator
├── types.ts                    # Pipeline types
├── steps/
│   ├── parse.step.ts          # Invoke parsers
│   ├── validate.step.ts       # Validate parsed data
│   ├── transform.step.ts      # Apply transformations
│   ├── generate.step.ts       # Generate output files
│   └── bundle.step.ts         # Create ZIP
└── transforms/
    ├── placeholder.transform.ts
    ├── section.transform.ts
    ├── component.transform.ts
    └── template.transform.ts
```

**Pipeline Flow**:

```
Source Files
    ↓
[Parse Step] → Uses parser plugins
    ↓
[Validate Step] → Check for errors
    ↓
[Transform Step] → Apply user customizations
    ↓
[Generate Step] → Create output files
    ↓
[Bundle Step] → Create ZIP
    ↓
Download
```

**Benefits**:
- Each step can be run independently
- Easy to insert new transformation steps
- Clear separation of concerns
- Can stop at any step for debugging

#### 1.3 Generator System

Create `/lib/generators/` directory for content generation:

```typescript
lib/generators/
├── index.ts                    # Generator registry
├── base.generator.ts           # Abstract base generator
├── types.ts                    # Generator types
├── app-structure.generator.ts  # ASCII app tree
├── route-map.generator.ts      # Route map
├── theme-css.generator.ts      # Theme CSS
├── tech-docs.generator.ts      # Tech documentation
├── instructions.generator.ts   # Main INSTRUCTIONS.md
└── templates/
    ├── instructions.template.md
    ├── tech-stack.template.md
    └── readme.template.md
```

**Base Generator Interface**:

```typescript
interface Generator {
  name: string
  outputPath: string
  generate(context: GeneratorContext): Promise<GeneratedFile>
  dependencies?: string[]
}

interface GeneratorContext {
  markdownData: MarkdownData
  store: EditorStore
  appStructure: FileSystemEntry[]
  theme: ThemeConfiguration
  placeholders: Record<string, string>
}

interface GeneratedFile {
  path: string
  content: string
  metadata: FileMetadata
}
```

**Benefits**:
- Each generator is self-contained
- Template-based generation for consistency
- Dependency graph for correct execution order
- Easy to add new generated files

### Phase 2: Output Structure Optimization

#### 2.1 AI-Optimized Directory Structure

```
downloaded-project/
├── INSTRUCTIONS.md             # Main AI entry point
├── docs/
│   ├── roadmap/               # User's customized roadmap
│   │   ├── 1-tech-stack.md
│   │   ├── 2-theme.md
│   │   └── ...
│   ├── tech/                  # Technical documentation
│   │   ├── tech-stack.md
│   │   ├── database.md
│   │   └── architecture.md
│   └── app-structure.md       # App directory diagram
├── config/
│   ├── theme.css              # Generated theme
│   ├── routes.md              # Route map
│   └── features.md            # Selected features
└── components/                # Reference components
    └── ui/
        ├── button.tsx
        └── ...
```

**INSTRUCTIONS.md Template**:

```markdown
# Project Implementation Instructions

This directory contains complete specifications for building {{appName}}.

## Quick Start for AI

1. Read this file completely
2. Review `/docs/roadmap/` in order (files are numbered)
3. Check `/docs/app-structure.md` for directory layout
4. Reference `/config/` for theme and routing
5. Use `/components/` as implementation examples

## Project Overview

{{projectDescription}}

## Technology Stack

See `/docs/tech/tech-stack.md` for details:
- Framework: {{framework}}
- Database: {{database}}
- Auth: {{authProvider}}
...

## App Structure

See `/docs/app-structure.md` for complete directory tree.

## Implementation Steps

Follow the roadmap in `/docs/roadmap/` sequentially:
1. Tech Stack Setup
2. Theme Configuration
3. Database Schema
...

## Important Notes

- All component examples are in `/components/`
- Theme configuration is in `/config/theme.css`
- Route definitions are in `/config/routes.md`
```

**Benefits**:
- AI reads INSTRUCTIONS.md first for complete context
- Logical organization by content type
- Easy to navigate and reference
- Self-contained and complete

#### 2.2 Sidebar Structure Update

Update sidebar to show actual download structure:

```typescript
app/(components)/Sidebar/
├── Sidebar.tsx                 # Main component
├── Sidebar.types.ts
├── NavigationTree.tsx          # Current navigation view
├── DownloadPreview.tsx         # New: Preview download structure
└── FileTreeItem.tsx            # Reusable tree item
```

Add toggle between Navigation and Download Preview modes.

### Phase 3: Developer Experience

#### 3.1 Preview System

Create `/app/(components)/DownloadPreview/` component:

```typescript
DownloadPreview/
├── DownloadPreview.tsx         # Main preview component
├── DownloadPreview.types.ts
├── FileTree.tsx                # Visual tree display
├── FileViewer.tsx              # Individual file preview
└── DownloadPreview.hooks.ts    # useGeneratePreview hook
```

**Features**:
- Generate preview without creating ZIP
- Show file tree with file sizes
- Click files to view generated content
- Highlight which files have user customizations
- Show validation errors inline

**Hook Implementation**:

```typescript
const useGeneratePreview = () => {
  const store = useEditorStore()

  return useQuery({
    queryKey: ['download-preview', store],
    queryFn: async () => {
      const pipeline = new ContentPipeline()
      const result = await pipeline.execute({
        steps: ['parse', 'validate', 'transform', 'generate'],
        skipBundle: true
      })
      return result.files
    }
  })
}
```

#### 3.2 Validation System

Create `/lib/validators/` directory:

```typescript
lib/validators/
├── index.ts                    # Validator registry
├── types.ts
├── placeholder.validator.ts    # Check {{key:default}} usage
├── section.validator.ts        # Check section references
├── component.validator.ts      # Check component placeholders
├── circular.validator.ts       # Check circular dependencies
└── schema.validator.ts         # Zod schemas for data structures
```

**Validation Results**:

```typescript
interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

interface ValidationError {
  type: 'placeholder' | 'section' | 'component' | 'circular'
  message: string
  location: {
    file: string
    line?: number
    nodeId?: string
  }
  suggestion?: string
}
```

**Display in UI**:
- Show validation errors in sidebar with badges
- Highlight problematic files in tree
- Preview panel shows inline errors
- Block download if critical errors exist

#### 3.3 Hot Reload System

Update build scripts to watch for changes:

```typescript
scripts/
├── watch-markdown.ts           # Watch markdown files
├── watch-themes.ts             # Watch theme config
└── dev-server.ts               # Integrated dev server
```

**Features**:
- Watch `/public/data/markdown/` for changes
- Auto-reparse on file modification
- Push updates to browser via WebSocket or polling
- Invalidate Zustand store and refresh UI
- Show toast notification when content updated

#### 3.4 Testing Infrastructure

Create comprehensive test suite:

```typescript
__tests__/
├── parsers/
│   ├── markdown.parser.test.ts
│   ├── component.parser.test.ts
│   └── theme.parser.test.ts
├── pipeline/
│   ├── pipeline.test.ts
│   └── transforms/
│       ├── placeholder.transform.test.ts
│       └── section.transform.test.ts
├── generators/
│   ├── app-structure.generator.test.ts
│   ├── theme-css.generator.test.ts
│   └── instructions.generator.test.ts
└── __snapshots__/
    └── ...

__fixtures__/
├── markdown/                   # Test markdown files
├── themes/                     # Test theme configs
└── expected-output/            # Expected generated files
```

**Test Approach**:
- Unit tests for each parser, transformer, generator
- Integration tests for full pipeline
- Snapshot tests for generated output
- Regression tests for edge cases

## Implementation Plan

### Step 1: Foundation (Week 1)

1. Create `/lib/parsers/` directory structure
2. Implement base parser interface and types
3. Extract markdown parsing to `markdown.parser.ts`
4. Write tests for markdown parser
5. Update build script to use new parser

**Files Modified**:
- `/scripts/parse-markdown.ts` - Refactor to use parser plugin
- `/lib/parsers/` - New directory
- `/__tests__/parsers/` - New tests

### Step 2: Pipeline (Week 2)

1. Create `/lib/pipeline/` directory
2. Implement pipeline orchestrator
3. Create transformation steps
4. Extract placeholder/section/component logic to transforms
5. Write tests for pipeline

**Files Modified**:
- `/lib/download.utils.ts` - Refactor to use pipeline
- `/lib/pipeline/` - New directory
- `/__tests__/pipeline/` - New tests

### Step 3: Generators (Week 2-3)

1. Create `/lib/generators/` directory
2. Extract existing generation functions to generators
3. Create template system
4. Implement INSTRUCTIONS.md generator
5. Write tests for generators

**Files Modified**:
- `/lib/download.utils.ts` - Use generators instead of inline functions
- `/lib/generators/` - New directory
- `/__tests__/generators/` - New tests

### Step 4: Output Structure (Week 3)

1. Update `generateAndDownloadZip()` to use new structure
2. Create INSTRUCTIONS.md template
3. Organize output into `docs/`, `config/`, `components/`
4. Update path references throughout codebase

**Files Modified**:
- `/lib/download.utils.ts` - New output structure
- `/lib/generators/templates/` - New templates

### Step 5: Preview System (Week 4)

1. Create `DownloadPreview` component
2. Implement `useGeneratePreview` hook
3. Add preview modal to sidebar
4. Show file tree and content viewer
5. Add validation error display

**Files Created**:
- `/app/(components)/DownloadPreview/` - New component
- `/app/(components)/Sidebar/DownloadPreview.tsx` - Integration

### Step 6: Validation (Week 4-5)

1. Create `/lib/validators/` directory
2. Implement validators for placeholders, sections, components
3. Add Zod schemas for type safety
4. Integrate validation into pipeline
5. Display errors in preview UI

**Files Created**:
- `/lib/validators/` - New directory
- `/__tests__/validators/` - New tests

### Step 7: Developer Tools (Week 5)

1. Create watch scripts for hot reload
2. Add WebSocket/polling for live updates
3. Implement dev mode with enhanced logging
4. Create debugging utilities

**Files Created**:
- `/scripts/watch-markdown.ts`
- `/scripts/dev-server.ts`

### Step 8: Testing & Documentation (Week 6)

1. Write comprehensive test suite
2. Create test fixtures
3. Add snapshot tests
4. Document new architecture in `/docs/`
5. Create migration guide

**Files Created**:
- `/__tests__/` - Comprehensive tests
- `/__fixtures__/` - Test data
- `/docs/architecture/parsing-system.md`
- `/docs/guides/adding-new-content-types.md`

## Migration Strategy

### Backwards Compatibility

During transition:
1. Keep old `download.utils.ts` functions as fallbacks
2. Add feature flag: `NEXT_PUBLIC_USE_NEW_PARSER=true`
3. Run both old and new systems in parallel
4. Compare outputs to ensure equivalence
5. Gradually migrate users to new system

### Data Migration

Existing Zustand store data remains compatible:
- Same `MarkdownData` type structure
- Same `FileSystemEntry` structure
- Placeholders, sections, include flags unchanged
- No breaking changes to user data

### Rollout Plan

1. **Week 1-3**: Build new system alongside old
2. **Week 4**: Internal testing with new system
3. **Week 5**: Beta flag for opt-in testing
4. **Week 6**: Default to new system, keep old as fallback
5. **Week 7**: Remove old system after validation

## Success Metrics

### Code Quality
- [ ] 90%+ test coverage for parsers, pipeline, generators
- [ ] All validation rules implemented and tested
- [ ] Zero regressions in generated output

### Developer Experience
- [ ] Preview system works without download
- [ ] Validation errors shown inline with helpful messages
- [ ] Hot reload working for markdown changes
- [ ] New content type can be added in < 30 minutes

### User Experience
- [ ] Download contains AI-optimized structure
- [ ] INSTRUCTIONS.md provides clear entry point
- [ ] Sidebar shows accurate download preview
- [ ] Generated files match user expectations

## Future Enhancements

### Phase 4: Advanced Features (Post-Launch)

1. **Export Formats**:
   - PDF export for roadmap
   - Markdown export without ZIP
   - JSON export for API integration

2. **Content Extensions**:
   - API specification generator
   - Database diagram generator
   - Deployment configuration generator
   - CI/CD pipeline generator

3. **Collaboration**:
   - Share roadmap via URL
   - Version control for roadmaps
   - Diff view between versions

4. **AI Integration**:
   - AI assistant that reads INSTRUCTIONS.md
   - Integrated chat with context awareness
   - Auto-generate missing documentation

## Open Questions

1. Should preview mode be a modal, sidebar panel, or separate route?
2. How should validation errors block vs. warn for download?
3. Should generators have access to external APIs (e.g., package registries)?
4. What's the ideal file size limit for preview rendering?
5. Should hot reload be opt-in or always-on in development?

## Risks & Mitigations

### Risk: Breaking Changes
**Mitigation**: Feature flag, parallel systems, gradual rollout

### Risk: Performance Degradation
**Mitigation**: Benchmark pipeline steps, lazy loading, memoization

### Risk: Increased Complexity
**Mitigation**: Comprehensive documentation, examples, migration guide

### Risk: Testing Gaps
**Mitigation**: High coverage requirements, snapshot tests, fixtures

## Conclusion

This refactor transforms the parsing system from a monolithic utility into a modular, extensible architecture. The plugin-based parser system, content pipeline, and generator framework make it trivial to add new content types and processing steps. The preview system and validation tools dramatically improve developer experience, while the AI-optimized output structure ensures generated projects are immediately usable by AI assistants.

The phased approach allows incremental delivery of value while maintaining backwards compatibility and minimizing risk.