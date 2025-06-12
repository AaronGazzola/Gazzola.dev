<!-- filepath: README.md -->

# Chat App MVP

A lightweight client communication and contract management app with role-based access.

## Route Structure

```
/
├── / (Chat App)
│   ├── admin view: chat + admin sidebar
│   └── public view: chat + public sidebar
│
└── /admin/
    ├── /clients (data table)
    ├── /contracts (data table)
    └── /conversations (data table)
```

## App Store Structure

```
AppStore
├── user (Supabase User)
├── profile
├── conversations[]
├── contracts[]
├── messages[]
├── files[]
├── profiles[] (admin only)
└── ui
    ├── selectedConversationId
    ├── contractModal
    ├── profileModal
    └── filters
```

## Data Relationships

```
User (1) ←→ (1) Profile
User (1) ←→ (N) Conversations
User (1) ←→ (N) Contracts
Contract (N) ←→ (N) Conversations
Conversation (1) ←→ (N) Messages
Message (1) ←→ (N) Files
```

## Components

### Main App (/)

- Conditional rendering based on user role
- Public: chat + conversations/contracts sidebar
- Admin: chat + recent items sidebar

### Admin Tables (/admin/\*)

- Sortable, filterable data tables
- Status updates via dropdowns
- Search and filter controls

### Modals

- Contract details with edit restrictions
- Profile management

## Tech Stack

- React + TypeScript
- Supabase Auth + Database
- Zustand + React Query
- Tailwind CSS
