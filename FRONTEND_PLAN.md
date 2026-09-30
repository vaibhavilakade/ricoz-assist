# RicozAssist Frontend Implementation Plan

## Application Overview

**RicozAssist** is an enterprise AI assistant for productivity augmentation. The frontend will provide a web interface for:
- User authentication and management
- Document management with versioning
- Knowledge base management
- Meeting management with transcription processing
- Action item tracking
- AI-powered query interface

**Tech Stack:**
- React 18+ with TypeScript
- Vite for build tooling
- React Router v6 for routing
- Axios for API communication
- React Hook Form + Zod for form validation
- shadcn/ui + TailwindCSS for UI components
- Zustand for state management
- date-fns for date handling
- Lucide React for icons

---

## Pages/Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (require authentication)
- `/` - Dashboard (overview of user's resources)
- `/documents` - Document list and management
- `/documents/:id` - Document details and editing
- `/knowledge-bases` - Knowledge base list and management
- `/knowledge-bases/:id` - Knowledge base details and search
- `/meetings` - Meeting list and management
- `/meetings/:id` - Meeting details and transcription
- `/action-items` - Action item list and management
- `/queries` - AI query/chat interface
- `/profile` - User profile settings

### Admin Routes (require ADMIN role)
- `/admin/users` - User management

---

## Backend API Mapping

### Base URL
- Development: `http://localhost:8080/api/v1`
- Production: `https://api.ricozassist.com/api/v1`

### Authentication Endpoints
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/logout` - Logout

### User Endpoints
- `GET /users` - Get all active users
- `GET /users/{id}` - Get user by ID
- `GET /users/username/{username}` - Get user by username
- `GET /users/email/{email}` - Get user by email
- `POST /users` - Create user (ADMIN)
- `PUT /users/{id}` - Update user (ADMIN or self)
- `PATCH /users/{id}/deactivate` - Deactivate user (ADMIN)
- `PATCH /users/{id}/activate` - Activate user (ADMIN)
- `PATCH /users/{id}/password` - Change password
- `DELETE /users/{id}` - Delete user (ADMIN)

### Document Endpoints
- `GET /documents` - Get all documents (with pagination)
- `GET /documents/{id}` - Get document by ID
- `GET /documents/owner/{ownerId}` - Get documents by owner
- `GET /documents/knowledge-base/{kbId}` - Get documents by knowledge base
- `GET /documents/search?keyword=` - Search documents
- `POST /documents` - Create document
- `PUT /documents/{id}` - Update document
- `PATCH /documents/{id}/knowledge-base/{kbId}` - Add to knowledge base
- `PATCH /documents/{id}/status?status=` - Update status
- `DELETE /documents/{id}` - Delete document

### Knowledge Base Endpoints
- `GET /knowledge-bases` - Get all knowledge bases
- `GET /knowledge-bases/{id}` - Get knowledge base by ID
- `GET /knowledge-bases/indexed` - Get indexed knowledge bases
- `GET /knowledge-bases/access-level/{accessLevel}` - Get by access level
- `POST /knowledge-bases` - Create knowledge base
- `POST /knowledge-bases/{id}/index` - Index knowledge base
- `GET /knowledge-bases/{id}/search?query=` - Search in knowledge base
- `POST /knowledge-bases/document/{documentId}/knowledge-base/{kbId}` - Add document to KB
- `DELETE /knowledge-bases/document/{documentId}` - Remove document from KB

### Meeting Endpoints
- `GET /meetings` - Get all meetings
- `GET /meetings/{id}` - Get meeting by ID
- `GET /meetings/owner/{ownerId}` - Get meetings by owner
- `GET /meetings/owner/{ownerId}/status/{status}` - Get by owner and status
- `GET /meetings/date-range?start=&end=` - Get in date range
- `POST /meetings` - Create meeting
- `PUT /meetings/{id}` - Update meeting
- `POST /meetings/{id}/participants/{userId}` - Add participant
- `DELETE /meetings/{id}/participants/{userId}` - Remove participant
- `POST /meetings/{id}/start` - Start meeting
- `POST /meetings/{id}/end` - End meeting
- `POST /meetings/{id}/transcription` - Process transcription
- `DELETE /meetings/{id}` - Delete meeting

### Action Item Endpoints
- `GET /action-items` - Get all action items
- `GET /action-items/{id}` - Get action item by ID
- `GET /action-items/assigned-to/{userId}` - Get by assigned user
- `GET /action-items/assigned-to/{userId}/status/{status}` - Get by user and status
- `GET /action-items/meeting/{meetingId}` - Get by meeting
- `GET /action-items/overdue` - Get overdue action items
- `GET /action-items/due-between?start=&end=` - Get due between dates
- `GET /action-items/assigned-to/{userId}/priority/{priority}` - Get by user and priority
- `POST /action-items` - Create action item
- `PUT /action-items/{id}` - Update action item
- `PATCH /action-items/{id}/complete` - Complete action item
- `PATCH /action-items/{id}/status?status=` - Update status
- `PATCH /action-items/{id}/assign/{userId}` - Assign to user
- `DELETE /action-items/{id}` - Delete action item

### Query Endpoints
- `POST /queries` - Create and process query
- `GET /queries/{id}` - Get query by ID
- `GET /queries/user/{userId}` - Get queries by user
- `GET /queries/user/{userId}/type/{type}` - Get by user and type
- `GET /queries/pending` - Get pending queries
- `GET /queries/metrics/avg-processing-time` - Get average processing time
- `DELETE /queries/{id}` - Delete query

---

## Authentication Flow

### Login Flow
1. User enters username and password
2. Frontend sends POST to `/auth/login`
3. Backend validates and returns JWT token in response
4. Frontend stores token in localStorage
5. Frontend stores user info in state
6. Redirect to dashboard

### Registration Flow
1. User enters registration details (username, email, password, names)
2. Frontend validates password strength (8+ chars, uppercase, lowercase, digit, special)
3. Send POST to `/auth/register`
4. Backend creates user with default USER role
5. Redirect to login page

### Logout Flow
1. User clicks logout
2. Send POST to `/auth/logout`
3. Remove token from localStorage
4. Clear user state
5. Redirect to login

### Token Management
- Store JWT in localStorage (key: `ricoz_token`)
- Include token in Authorization header: `Bearer <token>`
- Handle 401 responses by redirecting to login
- Token expires after 24 hours - user must re-login

---

## Authorization Rules

### User Roles
- **ADMIN**: Full access to all resources, user management
- **USER**: Standard access, can manage own resources, view others where permitted
- **VIEWER**: Read-only access to most resources

### Permission Matrix
- **User Management**: ADMIN only
- **Document CRUD**: Owner can edit/delete, all can read
- **Knowledge Base CRUD**: Owner can edit/delete, all can read based on access level
- **Meeting CRUD**: Owner can edit/delete, participants can read
- **Action Item CRUD**: Owner and assigned user can edit, all can read
- **Query**: Users can create and view own queries

### UI Access Control
- Hide admin routes for non-ADMIN users
- Disable edit/delete buttons for non-owners
- Show permission errors when attempting unauthorized actions
- Use route guards for protected pages

---

## Main Components

### Layout Components
- `Layout` - Main layout with sidebar/header
- `Sidebar` - Navigation menu
- `Header` - Top bar with user info and logout
- `ProtectedRoute` - Route guard component

### Common Components
- `Button` - Primary, secondary, danger variants
- `Input` - Text, email, password inputs
- `Select` - Dropdown for enums
- `DatePicker` - Date and datetime pickers
- `Modal` - Dialog modals
- `Table` - Sortable, paginated table
- `Badge` - Status and role badges
- `Avatar` - User avatar with initials
- `Card` - Content cards
- `LoadingSpinner` - Loading indicator
- `EmptyState` - Empty list state
- `Toast` - Notification system

### Domain Components
- `DocumentCard` - Document preview
- `MeetingCard` - Meeting details
- `ActionItemCard` - Action item with priority
- `QueryChat` - Chat interface for AI queries
- `KnowledgeBaseCard` - KB with document count
- `UserCard` - User with role badge

---

## State Management Approach

### State Management Library: Zustand

**Why Zustand?**
- Simple and lightweight
- No boilerplate like Redux
- TypeScript support
- Easy to use with React

### Store Structure
```typescript
{
  auth: {
    user: UserDTO | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
  }
  documents: {
    items: DocumentDTO[]
    selected: DocumentDTO | null
    filters: DocumentFilters
    pagination: { page: number, size: number, total: number }
  }
  meetings: {
    items: MeetingDTO[]
    selected: MeetingDTO | null
    filters: MeetingFilters
  }
  actionItems: {
    items: ActionItemDTO[]
    selected: ActionItemDTO | null
    filters: ActionItemFilters
  }
  queries: {
    items: QueryDTO[]
    current: QueryDTO | null
    isProcessing: boolean
  }
  ui: {
    sidebarOpen: boolean
    toast: Toast[]
  }
}
```

### State Patterns
- API calls in service layer, update state on success
- Optimistic updates for better UX
- Cache frequently accessed data (users, knowledge bases)
- Clear state on logout

---

## API Client/Service Structure

### Axios Configuration
- Base URL from environment variable
- Request interceptor: Add JWT token to Authorization header
- Response interceptor: Handle 401 (redirect to login), 403 (show error)
- Timeout: 30 seconds
- Default headers: Content-Type: application/json

### Service Layer Structure
```
services/
├── api.ts - Axios instance configuration
├── authService.ts - Authentication API
├── userService.ts - User API
├── documentService.ts - Document API
├── knowledgeBaseService.ts - Knowledge base API
├── meetingService.ts - Meeting API
├── actionItemService.ts - Action item API
└── queryService.ts - Query API
```

### Service Pattern
Each service exports:
- CRUD methods (getAll, getById, create, update, delete)
- Custom query methods (search, filter)
- Type-safe request/response types
- Error handling

---

## Forms and Validation

### Form Library: React Hook Form + Zod

### Validation Rules
Match backend validation exactly:
- **Username**: 3-50 characters, required
- **Email**: Valid email format, required
- **Password**: 8+ chars, uppercase, lowercase, digit, special character
- **Document Title**: Required, max 200 characters
- **Meeting Title**: Required, max 200 characters
- **Action Item Title**: Required, max 200 characters
- **Dates**: ISO-8601 format

### Form Components
- `LoginForm` - Login form
- `RegisterForm` - Registration form
- `DocumentForm` - Document create/edit form
- `MeetingForm` - Meeting create/edit form
- `ActionItemForm` - Action item create/edit form
- `KnowledgeBaseForm` - Knowledge base form
- `ProfileForm` - User profile form

---

## Error/Loading/Empty States

### Loading States
- Show loading spinner during API calls
- Disable buttons during form submission
- Show skeleton loaders for lists
- Show loading overlay for full-page loads

### Error States
- Display error toasts for API errors
- Show inline validation errors for form fields
- Display error page for 404, 500
- Show retry button for failed requests

### Empty States
- Show empty state illustration when lists are empty
- Provide clear call-to-action (e.g., "Create your first document")
- Different messages for different contexts (no results vs no data)

---

## Recommended Folder Structure

```
ricoz-assist-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── documents/
│   │   │   ├── DocumentList.tsx
│   │   │   ├── DocumentCard.tsx
│   │   │   └── DocumentForm.tsx
│   │   ├── meetings/
│   │   │   ├── MeetingList.tsx
│   │   │   ├── MeetingCard.tsx
│   │   │   └── MeetingForm.tsx
│   │   ├── action-items/
│   │   │   ├── ActionItemList.tsx
│   │   │   ├── ActionItemCard.tsx
│   │   │   └── ActionItemForm.tsx
│   │   ├── knowledge-bases/
│   │   │   ├── KnowledgeBaseList.tsx
│   │   │   ├── KnowledgeBaseCard.tsx
│   │   │   └── KnowledgeBaseForm.tsx
│   │   └── queries/
│   │       ├── QueryChat.tsx
│   │       └── QueryHistory.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── DocumentsPage.tsx
│   │   ├── DocumentDetailPage.tsx
│   │   ├── KnowledgeBasesPage.tsx
│   │   ├── KnowledgeBaseDetailPage.tsx
│   │   ├── MeetingsPage.tsx
│   │   ├──meetingDetailPage.tsx
│   │   ├── ActionItemsPage.tsx
│   │   ├── QueriesPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── AdminUsersPage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── documentService.ts
│   │   ├── knowledgeBaseService.ts
│   │   ├── meetingService.ts
│   │   ├── actionItemService.ts
│   │   └── queryService.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── documentStore.ts
│   │   ├── meetingStore.ts
│   │   ├── actionItemStore.ts
│   │   ├── queryStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── api.ts
│   │   └── domain.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── constants.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.development
├── .env.production
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Environment Variables

### Development (.env.development)
```bash
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=RicozAssist
```

### Production (.env.production)
```bash
VITE_API_URL=https://api.ricozassist.com/api/v1
VITE_APP_NAME=RicozAssist
```

---

## Testing Strategy

### Unit Tests
- Test components with React Testing Library
- Test hooks with custom test utilities
- Test utility functions
- Test form validation

### Integration Tests
- Test API service layer with mocked responses
- Test store actions and state updates
- Test routing with React Router

### E2E Tests
- Test login flow
- Test CRUD operations for each entity
- Test role-based access control
- Test error handling

### Testing Tools
- Vitest for unit/integration tests
- React Testing Library for component tests
- Playwright for E2E tests

---

## Implementation Priority

### Phase 1: Core Infrastructure
1. Project setup with Vite + React + TypeScript
2. TailwindCSS + shadcn/ui setup
3. Axios configuration
4. Zustand store setup
5. React Router setup
6. Authentication flow (login, register, logout)

### Phase 2: Common Components
1. Layout components (Layout, Sidebar, Header)
2. Common UI components (Button, Input, Modal, etc.)
3. Protected route wrapper
4. Toast notification system

### Phase 3: User Management
1. User list page
2. User profile page
3. Admin user management page

### Phase 4: Documents
1. Document list page
2. Document detail/edit page
3. Document CRUD operations

### Phase 5: Knowledge Bases
1. Knowledge base list page
2. Knowledge base detail page
3. Knowledge base search

### Phase 6: Meetings
1. Meeting list page
2. Meeting detail page
3. Meeting CRUD operations
4. Participant management

### Phase 7: Action Items
1. Action item list page
2. Action item CRUD operations
3. Status updates

### Phase 8: Queries
1. Query/chat interface
2. Query history
3. Real-time query processing

### Phase 9: Polish
1. Responsive design
2. Loading states
3. Error handling
4. Empty states
5. Accessibility improvements

---

## Notes and Assumptions

1. **Pagination**: Backend supports pagination via Spring Data Pageable (page, size, sort)
2. **File Upload**: No file upload endpoints found - documents use text content
3. **Real-time**: No WebSocket endpoints - queries are async, may need polling
4. **Search**: Keyword search available for documents and knowledge bases
5. **Filtering**: Backend has specific filter endpoints (by owner, status, priority, etc.)
6. **Soft Delete**: All entities use soft delete pattern
7. **Versioning**: Documents have version field that increments on update
8. **AI Features**: Queries and action item extraction are AI-powered features

---

## Next Steps

1. Create frontend project structure
2. Set up build tooling and dependencies
3. Implement authentication flow
4. Build layout and common components
5. Implement pages incrementally
6. Integrate with backend API
7. Test end-to-end
8. Deploy and verify
