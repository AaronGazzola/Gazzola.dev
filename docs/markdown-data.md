# Markdown Data System

This document explains how to create and organize markdown content in the `data/markdown/` directory. The markdown files are parsed by `scripts/parse-markdown.ts` into a structured data format that powers the editor interface.

## File Structure and Organization

### Directory Layout
```
data/markdown/
├── 1-Getting Started/
│   ├── 1-Welcome.md
│   ├── 2-Setup.md
│   └── 3-Advanced.section-1.md
├── 2-Features/
│   ├── 1-Basic.md
│   └── 2-Advanced.md
└── *3-Hidden/
    └── 1-Secret.md
```

### File and Directory Naming

**Basic Names**: Files and directories can use any valid filename
- `welcome.md`
- `Getting Started/`

**Ordered Names**: Prepend numbers to control ordering
- `1-welcome.md` → Order: 1, Display: "welcome"
- `2-setup.md` → Order: 2, Display: "setup"
- `10-advanced.md` → Order: 10, Display: "advanced"

**Excluded Content**: Prepend asterisk (*) to exclude from the editor
- `*1-hidden.md` → Excluded file
- `*Hidden/` → Excluded directory (and all children)

## URL Generation

Files are automatically converted to URLs based on their path:
- `data/markdown/1-Getting Started/2-Setup.md` → `/getting-started/setup`
- `data/markdown/Features/Basic.md` → `/features/basic`

The system:
- Removes numeric prefixes and file extensions
- Converts to lowercase
- Replaces spaces with hyphens
- Removes asterisks and special characters

## Sections System

### Adding Sections to Files

Use section markers in your markdown files:

```markdown
# Welcome

This is the main content.

<!-- section-1 -->

More content here.

<!-- section-2 -->

Final content.
```

### Creating Section Files

For each section marker, create a corresponding section file:
- Main file: `1-welcome.md`
- Section file: `1-welcome.section-1.md`
- Section file: `1-welcome.section-2.md`

### Section File Structure

Section files contain multiple options using option blocks:

```markdown
<!-- option-1 -->
This is the first option for this section.
It can contain **markdown** and multiple paragraphs.
<!-- /option-1 -->

<!-- option-2 -->
This is the second option.
Users can choose between different options.
<!-- /option-2 -->

<!-- option-3 -->
This is a third alternative.
Each option is independent.
<!-- /option-3 -->
```

### How Sections Work in the Editor

When the parser encounters:
1. `<!-- section-1 -->` in `welcome.md`
2. A corresponding `welcome.section-1.md` file

It creates a **SectionNode** in the editor with:
- A dropdown to select between options
- A nested editor for the selected option content
- All options available for switching

## Components System

### Adding Component References

Use component markers to embed React components:

```markdown
# App Structure

Here's an interactive diagram:

<!-- component-AppStructure -->

The component will be rendered here.
```

### Component Processing

The parser:
- Finds `<!-- component-AppStructure -->`
- Creates a **ComponentRef** with ID "AppStructure"
- The editor renders the actual React component

## Inclusion and Exclusion Rules

### File-Level Exclusion
```
*1-hidden.md          # File excluded
1-visible.md          # File included
```

### Directory-Level Exclusion
```
*Hidden/              # Directory and ALL children excluded
├── 1-secret.md       # Excluded (parent excluded)
├── 2-private.md      # Excluded (parent excluded)
└── Nested/           # Excluded (parent excluded)
    └── file.md       # Excluded (parent excluded)
```

### Inheritance Behavior
- Child nodes inherit the `include` status from their parents
- If a parent directory is excluded (*), all children are excluded
- If a parent directory is included, children can still be individually excluded

## Complete Example

### File Structure
```
data/markdown/
├── 1-Tutorial/
│   ├── 1-basics.md
│   ├── 1-basics.section-1.md
│   ├── 2-advanced.md
│   └── *3-internal.md
└── 2-Reference/
    └── 1-api.md
```

### Main File: `1-Tutorial/1-basics.md`
```markdown
# Getting Started

Welcome to the tutorial!

## Basic Concepts

Let's start with the fundamentals.

<!-- section-1 -->

## Next Steps

Continue to the advanced section.

<!-- component-NextButton -->
```

### Section File: `1-Tutorial/1-basics.section-1.md`
```markdown
<!-- option-1 -->
**Beginner Path**: Start with the simple examples.
We'll walk through each step carefully.
<!-- /option-1 -->

<!-- option-2 -->
**Advanced Path**: Jump to complex examples.
This assumes you have prior experience.
<!-- /option-2 -->

<!-- option-3 -->
**Interactive Path**: Learn by doing.
Complete hands-on exercises as you go.
<!-- /option-3 -->
```

### Resulting Structure

The parser creates:
1. **FileNode** for `basics.md` with:
   - Content: Full markdown with section markers
   - Section: `section1` with 3 options
   - Component: `NextButton` reference

2. **SectionNode** in editor with:
   - Dropdown: ["Beginner Path", "Advanced Path", "Interactive Path"]
   - Nested editor for selected option content

3. **ComponentRef** for embedding the NextButton component

## Running the Parser

The parser runs automatically, but you can manually trigger it:

```bash
npm run parse-markdown
```

This processes all files in `data/markdown/` and generates `app/(editor)/layout.data.ts` with the structured data.

## Best Practices

1. **Use consistent numbering**: `1-`, `2-`, `3-` for clear ordering
2. **Logical grouping**: Group related content in directories
3. **Meaningful names**: Use descriptive names after the number prefix
4. **Section planning**: Plan sections before writing to avoid reorganization
5. **Option clarity**: Make option differences clear to users
6. **Component integration**: Use components for interactive content

## Troubleshooting

**Section not showing**: Ensure the section file exists and follows naming convention
**Wrong order**: Check numeric prefixes are correct
**Content not updating**: Re-run the parser after changes
**File excluded**: Check for asterisk (*) prefix in filename or parent directory