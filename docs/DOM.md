# DOM (Document Object Model) Basics

The DOM is a tree-like representation of HTML elements that JavaScript can interact with.

## What is the DOM?

The DOM is the browser's interpretation of your HTML document as a JavaScript object tree.
Each HTML element becomes a "node" that can be accessed and modified with JavaScript.

## DOM Tree Structure

```txt
document
    │
    └── html
        │
        ├── head
        │   ├── title
        │   ├── meta
        │   └── link (stylesheets)
        │
        └── body
            ├── header
            │   ├── nav
            │   └── ul
            │       ├── li
            │       ├── li
            │       └── li
            │
            ├── main
            │   ├── section
            │   │   ├── h1
            │   │   ├── p
            │   │   └── div
            │   │       ├── button
            │   │       └── input
            │   │
            │   └── article
            │       ├── h2
            │       ├── p
            │       └── img
            │
            └── footer
                ├── p
                └── div
                    ├── a
                    ├── a
                    └── a
```

## DOM Access Methods

### Finding Elements

```txt
JavaScript Method         │ Purpose
─────────────────────────────────────────
getElementById()          │ Find element by ID
getElementsByClassName()  │ Find elements by class
getElementsByTagName()    │ Find elements by tag
querySelector()           │ Find first matching CSS selector
querySelectorAll()        │ Find all matching CSS selectors
```

## DOM Manipulation Flow

const title = getElementById('main-title')

<h1 id='main-title'>
<span>
text
</span>
<span>
text2
</span>
</h1>

```txt
1. Find Element
       │
       ▼
2. Read/Modify
   ├── Content (.textContent, .innerHTML)
   ├── Attributes (.setAttribute, .getAttribute)
   ├── Styles (.style.property)
   └── Classes (.classList.add, .classList.remove)
       │
       ▼
3. Add Event Listeners
   └── .addEventListener('click', (event)=>{} )
```

## Element Relationships

```txt
Parent Element
    │
    ├── Child Element 1 ◄──── .firstElementChild
    │   │
    │   └── Grandchild ◄───── .children[0].children[0]
    │
    ├── Child Element 2 ◄──── .children[1]
    │   │                     │
    │   │ ◄──── Previous ─────┘
    │   │ ────── Next ────────┐
    │   │                     ▼
    │   └── Grandchild       Child Element 3
    │
    └── Child Element 3 ◄──── .lastElementChild
```

## Common DOM Operations

### Creating and Adding Elements

const title = document.createElement('h1').textContent = "text"
title.className = 'class'

const body = document.getElementsByTagName('body')

body.appendChild(title)

```txt
Create Element
       │
       ▼
┌──────────────────┐
│ document         │
│ .createElement() │
└──────────────────┘
       │
       ▼
Set Properties
   ├── .textContent = "text"
   ├── .className = "class"
   └── .id = "id"
       │
       ▼
┌──────────────────┐
│ Parent Element   │
│ .appendChild()   │
└──────────────────┘
```

### Event Handling Flow

```txt
User Action
(click, type, hover)
       │
       ▼
Browser Creates Event
       │
       ▼
Event Listener Function
   ├── event.target (element that triggered)
   ├── event.type (click, keyup, etc.)
   └── event.preventDefault() (stop default behavior)
       │
       ▼
Your JavaScript Code
   ├── Modify DOM
   ├── Update styles
   └── Change content
```

## DOM vs HTML

```txt
HTML (Static)              DOM (Dynamic)
─────────────────         ─────────────────
<div id="box">            element.textContent = "New text"
  Hello                       │
</div>                        ▼
                          <div id="box">
                            New text
                          </div>
```

## Key Concepts for Beginners

1. **The DOM is live** - changes appear immediately in the browser
2. **Elements are objects** - they have properties and methods
3. **Events connect user actions to your code**
4. **Always check if elements exist** - use if statements before manipulation
5. **The DOM loads top to bottom** - place scripts at bottom or use DOMContentLoaded
<body>
<h1>test</h1>
<script>
       // do something to change the title
</script>
</body>

## Simple DOM Example

```txt
HTML:
<button id="myButton">Click me</button>
<p id="message">Hello</p>

JavaScript Flow:
Find button element
       │
       ▼
Add click event listener
       │
       ▼
When clicked:
├── Find message element
├── Change its text
└── Update browser display
```
