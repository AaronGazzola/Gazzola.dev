# Dynamic Components in Markdown

This markdown editor supports special HTML comments that render interactive React components within the editor. These components provide dynamic functionality beyond standard markdown.

## Select Component

The select component allows users to choose from multiple options, with the selected content being displayed below the dropdown.

### Syntax

```
<!-- select:options:{"option1":"Content 1","option2":"Content 2"} -->
```

### Parameters

- **options**: A JSON object where keys are the option labels and values are the content to display when selected

### Example

```markdown
<!-- select:options:{"JavaScript":"JavaScript is a programming language","TypeScript":"TypeScript is a superset of JavaScript","Python":"Python is a high-level programming language"} -->
```

This creates a dropdown with three options: JavaScript, TypeScript, and Python. When a user selects an option, the corresponding description appears below the dropdown.

### Features

- **Interactive Selection**: Users can change options and see content update in real-time
- **Rich Content**: Option values can contain HTML for formatted text
- **Persistent State**: Selected options maintain their state during editing
- **Responsive Design**: Adapts to both light and dark themes

### Usage Notes

1. **JSON Format**: The options must be valid JSON. Use double quotes for keys and values.
2. **Escaping**: If your content contains quotes, escape them with backslashes: `"He said \"Hello\""`
3. **HTML Support**: Content values can include basic HTML tags for formatting
4. **Position**: The component renders in place of the HTML comment
5. **Multiple Components**: You can have multiple select components in a single document

### Advanced Example

```markdown
# Programming Languages Guide

Choose a language to learn more:

<!-- select:options:{"JavaScript":"<strong>JavaScript</strong><br/>Used for web development, both frontend and backend.<br/><em>Difficulty: Beginner</em>","TypeScript":"<strong>TypeScript</strong><br/>Adds static typing to JavaScript for better development experience.<br/><em>Difficulty: Intermediate</em>","Python":"<strong>Python</strong><br/>Versatile language great for data science, web development, and automation.<br/><em>Difficulty: Beginner</em>"} -->

Continue with the rest of your content here.
```

## Implementation Details

- HTML comments are parsed during markdown compilation
- Components are rendered as custom Lexical nodes in the editor
- Content updates trigger re-rendering of the component and surrounding content
- The system is extensible - new component types can be added to the transformer

## Limitations

- Only the `select` component type is currently supported
- Component content is rendered as HTML, so be cautious with user input
- Components cannot be nested within each other
- JSON parsing errors will prevent the component from rendering

## Future Enhancements

The system is designed to support additional component types such as:
- Tabs
- Accordions
- Interactive forms
- Code snippets with syntax highlighting
- Image galleries

To add new component types, extend the `DynamicComponent` interface and create corresponding transformers.