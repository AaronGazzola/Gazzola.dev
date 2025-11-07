<!-- option-1 -->
Types and store files alongside ancestor files. Actions and hooks files alongside descendent files.

```txt
app/
├── layout.tsx
├── layout.providers.tsx
├── layout.types.ts
├── layout.stores.ts ◄─── useAppStore
└── (dashboard)/
    ├── layout.tsx
    ├── layout.types.tsx
    ├── layout.stores.tsx ◄─── useDashboardStore
    ├── page.tsx              ─┐
    ├── page.hooks.tsx         ├────► useAppStore
    ├── Component.tsx          ├────► useDashboardStore
    ├── Component.hooks.tsx   ─┘
    ├── page.actions.ts
    └── Component.actions.ts

    key:
    ◄─── = defined
    ───► = imported
```
<!-- /option-1 -->

<!-- option-2 -->
<!-- component-AppStructureAscii -->
<!-- /option-2 -->
