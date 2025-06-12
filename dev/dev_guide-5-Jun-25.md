<!-- filepath: dev/dev_guide-5-Jun-25 -->

# Development Guide - Chat App MVP

## Project Structure

### Routes

- `/` - Main chat app (admin and public views)
- `/admin/clients` - Admin clients data table
- `/admin/contracts` - Admin contracts data table
- `/admin/conversations` - Admin conversations data table

### Core Files

- `app.store.ts` - Zustand state management
- `app.types.ts` - TypeScript interfaces
- `README.md` - Project documentation

### Components

#### Main App (`/`)

- `ChatApp.tsx` - Main chat interface with conditional admin/public rendering
- `ChatWindow.tsx` - Central chat with accordion conversations
- `Sidebar.tsx` - Conditional sidebar (public: conversations/contracts, admin: recent items)
- `ConversationAccordion.tsx` - Expandable conversation groups

#### Admin Tables (`/admin/*`)

- `AdminTable.tsx` - Reusable sortable/filterable data table
- `ClientsTable.tsx` - Clients management table
- `ContractsTable.tsx` - Contracts management table
- `ConversationsTable.tsx` - Conversations management table

#### Modals

- `ContractModal.tsx` - Contract viewing/editing
- `ProfileModal.tsx` - User profile management

#### Shared

- `Layout.tsx` - App layout wrapper
- `StatusSelect.tsx` - Status dropdown component
