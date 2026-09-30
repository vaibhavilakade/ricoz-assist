# RicozAssist Frontend Development Skill

This document provides comprehensive instructions for building a frontend application that integrates with the RicozAssist backend API.

---

## 1. Project Overview

**RicozAssist** is an enterprise AI assistant for productivity augmentation with conversational intelligence, contextual drafting, and real-time knowledge access.

### Backend Architecture
- **Framework**: Spring Boot 3.2.0 with Java 17
- **Architecture**: Clean Architecture with 4 modules:
  - `ricoz-assist-core`: Domain entities and business logic
  - `ricoz-assist-application`: Application services and use cases
  - `ricoz-assist-infrastructure`: Database persistence and external integrations
  - `ricoz-assist-presentation`: REST controllers, DTOs, security configuration

### Core Entities
- **User**: Users with roles (ADMIN, USER, VIEWER)
- **Document**: Documents with versioning, AI generation flags, and knowledge base association
- **KnowledgeBase**: Knowledge bases with access levels (PRIVATE, TEAM, ORGANIZATION, PUBLIC)
- **Meeting**: Meetings with participants, transcriptions, and action items
- **ActionItem**: Action items with priorities, statuses, and assignments
- **Query**: AI queries with processing status and responses

### Technology Stack
- **Database**: PostgreSQL with Flyway migrations
- **Cache**: Redis for conversation context
- **Security**: JWT authentication with Spring Security
- **API Documentation**: OpenAPI 3.0 / Swagger UI
- **Validation**: Jakarta Bean Validation with custom validators

---

## 2. Backend API Contract

### Base URL
- **Development**: `http://localhost:8080/api/v1`
- **Production**: `https://api.ricozassist.com/api/v1`

### API Documentation
- **Swagger UI**: `/api/v1/swagger-ui.html`
- **OpenAPI JSON**: `/api/v1/api-docs`

### HTTP Status Codes
- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE, logout
- `400 Bad Request`: Validation errors, invalid input
- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden**: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected server error

### Date/Time Formats
- **LocalDateTime**: ISO-8601 format (e.g., `2024-01-15T10:30:00`)
- **LocalDate**: ISO-8601 format (e.g., `2024-01-15`)
- **Timestamps**: String format `yyyy-MM-dd HH:mm:ss` in error responses

---

## 3. Authentication Flow

### JWT-Based Authentication

#### Login Flow
1. User submits credentials to `POST /auth/login`
2. Backend validates credentials and returns JWT token
3. Frontend stores token in secure storage (httpOnly cookie or localStorage with caution)
4. Include token in Authorization header for all subsequent requests

#### Login Request
```json
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### Login Response
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "USER|ADMIN|VIEWER",
    "active": true,
    "createdAt": "yyyy-MM-dd HH:mm:ss",
    "updatedAt": "yyyy-MM-dd HH:mm:ss"
  }
}
```

#### Registration Flow
1. User submits registration data to `POST /auth/register`
2. Backend validates and creates user with default USER role
3. Returns created user details
4. User must then login to get JWT token

#### Registration Request
```json
POST /auth/register
Content-Type: application/json

{
  "username": "string (3-50 chars)",
  "email": "valid email",
  "password": "string (strong password)",
  "firstName": "string (optional)",
  "lastName": "string (optional)"
}
```

#### Logout Flow
1. Send `POST /auth/logout` request
2. Frontend removes JWT token from storage
3. Redirect to login page

### Token Management
- **Token Type**: Bearer JWT
- **Expiration**: 24 hours (86400000 ms) by default
- **Storage**: Use httpOnly cookie for security, or localStorage with XSS protection
- **Refresh**: No refresh token - user must re-login after expiration
- **Header Format**: `Authorization: Bearer <token>`

---

## 4. API Integration Rules

### Request Headers
```typescript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt-token>"
}
```

### Error Response Format
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Error description",
  "errorCode": "BUSINESS_ERROR",
  "path": "/api/v1/endpoint",
  "timestamp": "2024-01-15 10:30:00",
  "fieldErrors": [
    {
      "field": "username",
      "rejectedValue": "ab",
      "message": "Username must be between 3 and 50 characters"
    }
  ]
}
```

### Validation Error Handling
- Check `fieldErrors` array for field-specific validation errors
- Display each field error next to the corresponding form input
- Use `message` field for general errors

### Pagination
- **Max Page Size**: 100
- **Default Page Size**: 20 (recommended)
- **Query Params**: `page`, `size`, `sortBy`, `sortDirection`
- **Sort Direction**: `asc` or `desc`

### CORS Configuration
- **Allowed Origins**: Configured via `CORS_ALLOWED_ORIGINS` environment variable
- **Default**: `http://localhost:3000,http://localhost:8080`
- **Allowed Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Allow Credentials**: true

---

## 5. Backend API Contract - Detailed Endpoints

### Authentication Endpoints

#### POST /auth/login
- **Purpose**: Authenticate user and receive JWT token
- **Auth Required**: No
- **Request**: LoginRequest
- **Response**: LoginResponse (200), ErrorResponse (401)

#### POST /auth/register
- **Purpose**: Register new user
- **Auth Required**: No
- **Request**: RegisterRequest
- **Response**: UserDTO (201), ErrorResponse (400)

#### POST /auth/logout
- **Purpose**: Logout user (client-side token removal)
- **Auth Required**: Yes
- **Response**: 204 No Content

### User Management Endpoints

#### GET /users
- **Purpose**: Get all active users
- **Auth Required**: Yes
- **Response**: UserDTO[] (200)

#### GET /users/{id}
- **Purpose**: Get user by ID
- **Auth Required**: Yes
- **Response**: UserDTO (200), ErrorResponse (404)

#### GET /users/username/{username}
- **Purpose**: Get user by username
- **Auth Required**: Yes
- **Response**: UserDTO (200), ErrorResponse (404)

#### GET /users/email/{email}
- **Purpose**: Get user by email
- **Auth Required**: Yes
- **Response**: UserDTO (200), ErrorResponse (404)

#### POST /users
- **Purpose**: Create new user
- **Auth Required**: Yes (ADMIN only)
- **Request**: UserDTO
- **Response**: UserDTO (201), ErrorResponse (403)

#### PUT /users/{id}
- **Purpose**: Update user
- **Auth Required**: Yes (ADMIN or self)
- **Request**: UserDTO
- **Response**: UserDTO (200), ErrorResponse (403, 404)

#### PATCH /users/{id}/deactivate
- **Purpose**: Deactivate user
- **Auth Required**: Yes (ADMIN only)
- **Response**: 204 No Content (200), ErrorResponse (403, 404)

#### PATCH /users/{id}/activate
- **Purpose**: Activate user
- **Auth Required**: Yes (ADMIN only)
- **Response**: 204 No Content (200), ErrorResponse (403, 404)

#### PATCH /users/{id}/password
- **Purpose**: Change user password
- **Auth Required**: Yes (ADMIN or self)
- **Request**: String (new password)
- **Response**: 204 No Content (200), ErrorResponse (403, 404)

#### DELETE /users/{id}
- **Purpose**: Delete user (soft delete)
- **Auth Required**: Yes (ADMIN only)
- **Response**: 204 No Content (200), ErrorResponse (403, 404)

### Document Management Endpoints

#### GET /documents
- **Purpose**: Get all documents (add pagination params)
- **Auth Required**: Yes
- **Query Params**: page, size, sortBy, sortDirection
- **Response**: DocumentDTO[] (200)

#### GET /documents/{id}
- **Purpose**: Get document by ID
- **Auth Required**: Yes
- **Response**: DocumentDTO (200), ErrorResponse (404)

#### GET /documents/owner/{ownerId}
- **Purpose**: Get documents by owner
- **Auth Required**: Yes
- **Response**: DocumentDTO[] (200)

#### GET /documents/knowledge-base/{kbId}
- **Purpose**: Get documents by knowledge base
- **Auth Required**: Yes
- **Response**: DocumentDTO[] (200)

#### GET /documents/search
- **Purpose**: Search documents by keyword
- **Auth Required**: Yes
- **Query Params**: keyword
- **Response**: DocumentDTO[] (200)

#### POST /documents
- **Purpose**: Create new document
- **Auth Required**: Yes
- **Request**: DocumentDTO
- **Response**: DocumentDTO (201), ErrorResponse (400)

#### PUT /documents/{id}
- **Purpose**: Update document
- **Auth Required**: Yes
- **Request**: DocumentDTO
- **Response**: DocumentDTO (200), ErrorResponse (404)

#### PATCH /documents/{id}/knowledge-base/{kbId}
- **Purpose**: Add document to knowledge base
- **Auth Required**: Yes
- **Response**: DocumentDTO (200), ErrorResponse (404)

#### PATCH /documents/{id}/status
- **Purpose**: Update document status
- **Auth Required**: Yes
- **Query Params**: status (DRAFT, IN_REVIEW, PUBLISHED, ARCHIVED)
- **Response**: DocumentDTO (200), ErrorResponse (404)

#### DELETE /documents/{id}
- **Purpose**: Delete document (soft delete)
- **Auth Required**: Yes
- **Response**: 204 No Content (200), ErrorResponse (404)

### Knowledge Base Endpoints

#### GET /knowledge-bases
- **Purpose**: Get all knowledge bases
- **Auth Required**: Yes
- **Response**: KnowledgeBaseDTO[] (200)

#### GET /knowledge-bases/{id}
- **Purpose**: Get knowledge base by ID
- **Auth Required**: Yes
- **Response**: KnowledgeBaseDTO (200), ErrorResponse (404)

#### GET /knowledge-bases/indexed
- **Purpose**: Get all indexed knowledge bases
- **Auth Required**: Yes
- **Response**: KnowledgeBaseDTO[] (200)

#### GET /knowledge-bases/access-level/{accessLevel}
- **Purpose**: Get knowledge bases by access level
- **Auth Required**: Yes
- **Path Param**: accessLevel (PRIVATE, TEAM, ORGANIZATION, PUBLIC)
- **Response**: KnowledgeBaseDTO[] (200)

#### POST /knowledge-bases
- **Purpose**: Create new knowledge base
- **Auth Required**: Yes
- **Request**: KnowledgeBaseDTO
- **Response**: KnowledgeBaseDTO (201), ErrorResponse (400)

#### POST /knowledge-bases/{id}/index
- **Purpose**: Index a knowledge base
- **Auth Required**: Yes
- **Response**: 202 Accepted

#### GET /knowledge-bases/{id}/search
- **Purpose**: Search within a knowledge base
- **Auth Required**: Yes
- **Query Params**: query
- **Response**: DocumentDTO[] (200)

#### POST /knowledge-bases/document/{documentId}/knowledge-base/{kbId}
- **Purpose**: Add document to knowledge base
- **Auth Required**: Yes
- **Response**: 202 Accepted

#### DELETE /knowledge-bases/document/{documentId}
- **Purpose**: Remove document from knowledge base
- **Auth Required**: Yes
- **Response**: 204 No Content

### Meeting Management Endpoints

#### GET /meetings
- **Purpose**: Get all meetings
- **Auth Required**: Yes
- **Response**: MeetingDTO[] (200)

#### GET /meetings/{id}
- **Purpose**: Get meeting by ID
- **Auth Required**: Yes
- **Response**: MeetingDTO (200), ErrorResponse (404)

#### GET /meetings/owner/{ownerId}
- **Purpose**: Get meetings by owner
- **Auth Required**: Yes
- **Response**: MeetingDTO[] (200)

#### GET /meetings/owner/{ownerId}/status/{status}
- **Purpose**: Get meetings by owner and status
- **Auth Required**: Yes
- **Path Params**: ownerId, status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- **Response**: MeetingDTO[] (200)

#### GET /meetings/date-range
- **Purpose**: Get meetings in date range
- **Auth Required**: Yes
- **Query Params**: start (ISO-8601), end (ISO-8601)
- **Response**: MeetingDTO[] (200)

#### POST /meetings
- **Purpose**: Create new meeting
- **Auth Required**: Yes
- **Request**: MeetingDTO
- **Response**: MeetingDTO (201), ErrorResponse (400)

#### PUT /meetings/{id}
- **Purpose**: Update meeting
- **Auth Required**: Yes
- **Request**: MeetingDTO
- **Response**: MeetingDTO (200), ErrorResponse (404)

#### POST /meetings/{id}/participants/{userId}
- **Purpose**: Add participant to meeting
- **Auth Required**: Yes
- **Response**: MeetingDTO (200), ErrorResponse (404)

#### DELETE /meetings/{id}/participants/{userId}
- **Purpose**: Remove participant from meeting
- **Auth Required**: Yes
- **Response**: MeetingDTO (200), ErrorResponse (404)

#### POST /meetings/{id}/start
- **Purpose**: Start meeting
- **Auth Required**: Yes
- **Response**: MeetingDTO (200), ErrorResponse (404)

#### POST /meetings/{id}/end
- **Purpose**: End meeting
- **Auth Required**: Yes
- **Response**: MeetingDTO (200), ErrorResponse (404)

#### POST /meetings/{id}/transcription
- **Purpose**: Process meeting transcription
- **Auth Required**: Yes
- **Request**: String (transcription text)
- **Response**: 202 Accepted

#### DELETE /meetings/{id}
- **Purpose**: Delete meeting (soft delete)
- **Auth Required**: Yes
- **Response**: 204 No Content (200), ErrorResponse (404)

### Action Item Endpoints

#### GET /action-items
- **Purpose**: Get all action items
- **Auth Required**: Yes
- **Response**: ActionItemDTO[] (200)

#### GET /action-items/{id}
- **Purpose**: Get action item by ID
- **Auth Required**: Yes
- **Response**: ActionItemDTO (200), ErrorResponse (404)

#### GET /action-items/assigned-to/{userId}
- **Purpose**: Get action items assigned to user
- **Auth Required**: Yes
- **Response**: ActionItemDTO[] (200)

#### GET /action-items/assigned-to/{userId}/status/{status}
- **Purpose**: Get action items by assigned user and status
- **Auth Required**: Yes
- **Path Params**: userId, status (OPEN, IN_PROGRESS, COMPLETED, CANCELLED, BLOCKED)
- **Response**: ActionItemDTO[] (200)

#### GET /action-items/meeting/{meetingId}
- **Purpose**: Get action items by meeting
- **Auth Required**: Yes
- **Response**: ActionItemDTO[] (200)

#### GET /action-items/overdue
- **Purpose**: Get overdue action items
- **Auth Required**: Yes
- **Response**: ActionItemDTO[] (200)

#### GET /action-items/due-between
- **Purpose**: Get action items due between dates
- **Auth Required**: Yes
- **Query Params**: start (ISO-8601 date), end (ISO-8601 date)
- **Response**: ActionItemDTO[] (200)

#### GET /action-items/assigned-to/{userId}/priority/{priority}
- **Purpose**: Get action items by assigned user and priority
- **Auth Required**: Yes
- **Path Params**: userId, priority (LOW, MEDIUM, HIGH, URGENT)
- **Response**: ActionItemDTO[] (200)

#### POST /action-items
- **Purpose**: Create new action item
- **Auth Required**: Yes
- **Request**: ActionItemDTO
- **Response**: ActionItemDTO (201), ErrorResponse (400)

#### PUT /action-items/{id}
- **Purpose**: Update action item
- **Auth Required**: Yes
- **Request**: ActionItemDTO
- **Response**: ActionItemDTO (200), ErrorResponse (404)

#### PATCH /action-items/{id}/complete
- **Purpose**: Complete action item
- **Auth Required**: Yes
- **Response**: ActionItemDTO (200), ErrorResponse (404)

#### PATCH /action-items/{id}/status
- **Purpose**: Update action item status
- **Auth Required**: Yes
- **Query Params**: status
- **Response**: ActionItemDTO (200), ErrorResponse (404)

#### PATCH /action-items/{id}/assign/{userId}
- **Purpose**: Assign action item to user
- **Auth Required**: Yes
- **Response**: ActionItemDTO (200), ErrorResponse (404)

#### DELETE /action-items/{id}
- **Purpose**: Delete action item (soft delete)
- **Auth Required**: Yes
- **Response**: 204 No Content (200), ErrorResponse (404)

### Query Processing Endpoints

#### POST /queries
- **Purpose**: Create and process a new query
- **Auth Required**: Yes
- **Request**: QueryDTO (queryText, queryType, knowledgeBaseId optional)
- **Response**: QueryDTO (202), ErrorResponse (400)

#### GET /queries/{id}
- **Purpose**: Get query by ID
- **Auth Required**: Yes
- **Response**: QueryDTO (200), ErrorResponse (404)

#### GET /queries/user/{userId}
- **Purpose**: Get queries by user
- **Auth Required**: Yes
- **Response**: QueryDTO[] (200)

#### GET /queries/user/{userId}/type/{type}
- **Purpose**: Get queries by user and type
- **Auth Required**: Yes
- **Path Params**: userId, type (KNOWLEDGE_SEARCH, DOCUMENT_QUERY, BUSINESS_SYSTEM_QUERY, GENERAL_QA)
- **Response**: QueryDTO[] (200)

#### GET /queries/pending
- **Purpose**: Get pending queries
- **Auth Required**: Yes
- **Response**: QueryDTO[] (200)

#### GET /queries/metrics/avg-processing-time
- **Purpose**: Get average query processing time
- **Auth Required**: Yes
- **Response**: Double (200)

#### DELETE /queries/{id}
- **Purpose**: Delete query (soft delete)
- **Auth Required**: Yes
- **Response**: 204 No Content (200), ErrorResponse (404)

---

## 6. DTO Structures

### UserDTO
```typescript
{
  id: string (UUID),
  username: string (3-50 chars, required),
  email: string (valid email, required),
  firstName: string (optional),
  lastName: string (optional),
  role: "USER" | "ADMIN" | "VIEWER",
  active: boolean,
  createdAt: string (yyyy-MM-dd HH:mm:ss),
  updatedAt: string (yyyy-MM-dd HH:mm:ss)
}
```

### DocumentDTO
```typescript
{
  id: string (UUID),
  title: string (max 200 chars, required),
  content: string (optional),
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED" (required),
  documentType: "REPORT" | "EMAIL" | "PROPOSAL" | "MEMO" | "CONTRACT" | "PRESENTATION" | "OTHER" (required),
  ownerId: string (UUID),
  ownerUsername: string,
  knowledgeBaseId: string (UUID),
  knowledgeBaseName: string,
  version: number,
  lastEditedAt: string (yyyy-MM-dd HH:mm:ss),
  aiGenerated: boolean,
  tags: string,
  createdAt: string (yyyy-MM-dd HH:mm:ss),
  updatedAt: string (yyyy-MM-dd HH:mm:ss)
}
```

### KnowledgeBaseDTO
```typescript
{
  id: string (UUID),
  name: string (max 100 chars, required),
  description: string (optional),
  accessLevel: "PRIVATE" | "TEAM" | "ORGANIZATION" | "PUBLIC" (required),
  indexed: boolean,
  indexingStatus: string,
  documentCount: number,
  createdAt: string (yyyy-MM-dd HH:mm:ss),
  updatedAt: string (yyyy-MM-dd HH:mm:ss)
}
```

### MeetingDTO
```typescript
{
  id: string (UUID),
  title: string (max 200 chars, required),
  description: string (optional),
  scheduledStart: string (ISO-8601 datetime, required),
  scheduledEnd: string (ISO-8601 datetime, required),
  actualStart: string (ISO-8601 datetime),
  actualEnd: string (ISO-8601 datetime),
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" (required),
  transcription: string,
  summary: string,
  recordingUrl: string,
  ownerId: string (UUID),
  ownerUsername: string,
  participantIds: string[] (UUID[]),
  actionItemCount: number,
  createdAt: string (yyyy-MM-dd HH:mm:ss),
  updatedAt: string (yyyy-MM-dd HH:mm:ss)
}
```

### ActionItemDTO
```typescript
{
  id: string (UUID),
  title: string (max 200 chars, required),
  description: string (optional),
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" (required),
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "BLOCKED" (required),
  dueDate: string (ISO-8601 date),
  completedAt: string (ISO-8601 datetime),
  meetingId: string (UUID),
  meetingTitle: string,
  assignedToId: string (UUID),
  assignedToUsername: string,
  aiExtracted: boolean,
  createdAt: string (yyyy-MM-dd HH:mm:ss),
  updatedAt: string (yyyy-MM-dd HH:mm:ss)
}
```

### QueryDTO
```typescript
{
  id: string (UUID),
  queryText: string (required),
  response: string,
  queryType: "KNOWLEDGE_SEARCH" | "DOCUMENT_QUERY" | "BUSINESS_SYSTEM_QUERY" | "GENERAL_QA" (required),
  status: "PROCESSING" | "COMPLETED" | "FAILED" | "TIMEOUT",
  processingTimeMs: number,
  confidenceScore: number,
  createdByUserId: string (UUID),
  createdByUsername: string,
  knowledgeBaseId: string (UUID),
  knowledgeBaseName: string,
  contextUsed: string,
  sourceSystem: string,
  createdAt: string (yyyy-MM-dd HH:mm:ss),
  updatedAt: string (yyyy-MM-dd HH:mm:ss)
}
```

---

## 7. Roles and Permissions

### User Roles
- **ADMIN**: Full system access, user management, all operations
- **USER**: Standard user access, can manage own resources
- **VIEWER**: Read-only access to most resources

### Permission Matrix

| Resource | Create | Read | Update | Delete | Special |
|----------|--------|------|--------|--------|---------|
| Users | ADMIN | All | ADMIN/self | ADMIN | Activate/deactivate: ADMIN |
| Documents | Authenticated | All | Owner | Owner | Status update: Owner |
| Knowledge Bases | Authenticated | All | Owner | Owner | Index: Owner |
| Meetings | Authenticated | All | Owner | Owner | Start/end: Owner |
| Action Items | Authenticated | All | Owner/Assigned | Owner | Complete: Assigned |
| Queries | Authenticated | Own | Own | Own | - |

### UI Access Control
- Hide/show UI elements based on user role
- Disable buttons for unauthorized actions
- Show permission error messages when attempting unauthorized actions
- Redirect to appropriate page if access denied

---

## 8. Validation Rules

### Registration Validation
- **username**: 3-50 characters, required, unique
- **email**: Valid email format, required, unique
- **password**: Strong password (8+ chars, uppercase, lowercase, digit, special character)
- **firstName**: Optional
- **lastName**: Optional

### Document Validation
- **title**: Required, max 200 characters
- **status**: Required (DRAFT, IN_REVIEW, PUBLISHED, ARCHIVED)
- **documentType**: Required (REPORT, EMAIL, PROPOSAL, MEMO, CONTRACT, PRESENTATION, OTHER)

### Meeting Validation
- **title**: Required, max 200 characters
- **scheduledStart**: Required, ISO-8601 datetime
- **scheduledEnd**: Required, ISO-8601 datetime, must be after scheduledStart
- **status**: Required (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)

### Action Item Validation
- **title**: Required, max 200 characters
- **priority**: Required (LOW, MEDIUM, HIGH, URGENT)
- **status**: Required (OPEN, IN_PROGRESS, COMPLETED, CANCELLED, BLOCKED)
- **dueDate**: Optional, ISO-8601 date

### Query Validation
- **queryText**: Required, not empty
- **queryType**: Required (KNOWLEDGE_SEARCH, DOCUMENT_QUERY, BUSINESS_SYSTEM_QUERY, GENERAL_QA)

---

## 9. Frontend Architecture

### Recommended Tech Stack
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit or Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **UI Components**: shadcn/ui, Material-UI, or Ant Design
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns or dayjs
- **Icons**: Lucide React or React Icons

### Project Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Table.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── documents/
│   │   ├── DocumentList.tsx
│   │   └── DocumentForm.tsx
│   └── ...
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── DocumentsPage.tsx
│   └── ...
├── services/
│   ├── api.ts (Axios instance)
│   ├── authService.ts
│   ├── userService.ts
│   └── ...
├── store/
│   ├── authSlice.ts
│   ├── userSlice.ts
│   └── ...
├── hooks/
│   ├── useAuth.ts
│   └── useApi.ts
├── types/
│   ├── api.ts
│   └── domain.ts
└── utils/
    ├── validation.ts
    └── formatting.ts
```

---

## 10. Page/Route Requirements

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (require authentication)
- `/` - Dashboard
- `/documents` - Document management
- `/documents/:id` - Document details
- `/knowledge-bases` - Knowledge base management
- `/knowledge-bases/:id` - Knowledge base details
- `/meetings` - Meeting management
- `/meetings/:id` - Meeting details
- `/action-items` - Action item management
- `/queries` - Query/AI chat interface
- `/profile` - User profile
- `/admin/users` - User management (ADMIN only)

### Route Guards
- Implement authentication guard for protected routes
- Implement role-based guard for admin routes
- Redirect unauthenticated users to login
- Redirect authenticated users away from login/register

---

## 11. Component Requirements

### Common Components
- **Button**: Primary, secondary, danger variants with loading state
- **Input**: Text, email, password with validation states
- **Modal**: Confirm dialogs, form modals
- **Table**: Sortable, paginated with row actions
- **Badge**: Status indicators, role badges
- **Avatar**: User avatars with initials
- **DatePicker**: Date and datetime pickers
- **Select**: Dropdowns for enums (status, priority, etc.)
- **Toast**: Success/error notifications
- **LoadingSpinner**: Loading indicators
- **EmptyState**: Empty list states

### Domain-Specific Components
- **DocumentCard**: Document preview with metadata
- **MeetingCard**: Meeting details with participant avatars
- **ActionItemCard**: Action item with priority badge
- **QueryChat**: Chat interface for AI queries
- **KnowledgeBaseCard**: KB with document count
- **UserCard**: User with role badge

---

## 12. State Management

### Global State Structure
```typescript
{
  auth: {
    user: UserDTO | null,
    token: string | null,
    isAuthenticated: boolean,
    isLoading: boolean
  },
  documents: {
    items: DocumentDTO[],
    selected: DocumentDTO | null,
    filters: DocumentFilters,
    pagination: PaginationState
  },
  meetings: {
    items: MeetingDTO[],
    selected: MeetingDTO | null,
    filters: MeetingFilters
  },
  actionItems: {
    items: ActionItemDTO[],
    selected: ActionItemDTO | null,
    filters: ActionItemFilters
  },
  queries: {
    items: QueryDTO[],
    current: QueryDTO | null,
    isProcessing: boolean
  }
}
```

### State Management Patterns
- Use Redux Toolkit for complex state with async actions
- Use Zustand for simpler state needs
- Keep API calls in service layer with async thunks
- Cache frequently accessed data (users, knowledge bases)
- Implement optimistic updates for better UX

---

## 13. Forms & Validation

### Form Validation Strategy
- Use React Hook Form for form management
- Use Zod schemas for validation matching backend rules
- Display validation errors inline with form fields
- Implement custom validators for strong password, UUID format

### Example Zod Schema (Registration)
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain digit')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});
```

### Form Submission Flow
1. Validate form on client side
2. Show loading state
3. Submit to API
4. Handle success/error responses
5. Update state on success
6. Show success/error toast
7. Reset form or redirect

---

## 14. Error & Loading Handling

### Error Handling Strategy
- Global error interceptor in Axios
- Handle 401 errors by redirecting to login
- Handle 403 errors by showing permission denied message
- Handle 404 errors by showing not found message
- Handle 500 errors with generic error message
- Display field-specific validation errors

### Loading States
- Show loading spinners during API calls
- Disable buttons during form submission
- Show skeleton loaders for lists
- Implement optimistic updates where appropriate

### Toast Notifications
- Success: Green toast for successful operations
- Error: Red toast for errors
- Info: Blue toast for informational messages
- Auto-dismiss after 5 seconds
- Manual dismiss option

---

## 15. API Service/Client Structure

### Axios Configuration
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Layer Example
```typescript
// services/documentService.ts
import api from './api';
import { DocumentDTO } from '../types';

export const documentService = {
  getAll: async (params?: PaginationParams) => {
    const response = await api.get<DocumentDTO[]>('/documents', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<DocumentDTO>(`/documents/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<DocumentDTO>) => {
    const response = await api.post<DocumentDTO>('/documents', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<DocumentDTO>) => {
    const response = await api.put<DocumentDTO>(`/documents/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/documents/${id}`);
  },
  
  search: async (keyword: string) => {
    const response = await api.get<DocumentDTO[]>('/documents/search', {
      params: { keyword }
    });
    return response.data;
  }
};
```

---

## 16. Environment Configuration

### Environment Variables
```bash
# .env.development
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=RicozAssist
VITE_ENABLE_SWAGGER=true

# .env.production
VITE_API_URL=https://api.ricozassist.com/api/v1
VITE_APP_NAME=RicozAssist
VITE_ENABLE_SWAGGER=false
```

### Configuration Access
```typescript
const API_URL = import.meta.env.VITE_API_URL;
const APP_NAME = import.meta.env.VITE_APP_NAME;
```

---

## 17. Frontend Security

### Security Best Practices
1. **JWT Storage**: Use httpOnly cookies if possible, otherwise localStorage with XSS protection
2. **XSS Protection**: Sanitize user input before rendering (DOMPurify)
3. **CSRF Protection**: Backend handles CSRF, ensure frontend sends credentials
4. **Content Security Policy**: Implement CSP headers
5. **HTTPS Only**: Use HTTPS in production
6. **Sensitive Data**: Never log or expose JWT tokens
7. **Password Handling**: Never store passwords in frontend state
8. **Role-Based UI**: Hide/show features based on user role
9. **Input Validation**: Validate all inputs on client and server
10. **Error Messages**: Don't expose sensitive information in error messages

### Security Headers (Backend)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

---

## 18. Important Business Workflows

### Document Creation Workflow
1. User navigates to Documents page
2. Clicks "Create Document" button
3. Fills in document form (title, content, type, status)
4. Optionally selects knowledge base
5. Submits form
6. Document created with version 1
7. User can edit document (increments version)
8. User can change status (DRAFT → IN_REVIEW → PUBLISHED)

### Meeting Workflow
1. User creates meeting with title, description, scheduled times
2. Adds participants from user list
3. Meeting starts (status: IN_PROGRESS)
4. Transcription uploaded after meeting
5. AI processes transcription to generate summary and action items
6. Meeting ends (status: COMPLETED)
7. Action items assigned to participants
8. Participants complete action items

### Query/AI Workflow
1. User navigates to Query/AI chat page
2. Selects query type (KNOWLEDGE_SEARCH, DOCUMENT_QUERY, etc.)
3. Optionally selects knowledge base
4. Enters query text
5. Submits query
6. Query status: PROCESSING
7. Backend processes query asynchronously
8. Frontend polls or receives update
9. Query status: COMPLETED with response
10. User can view query history

### Action Item Workflow
1. Action items created manually or AI-extracted from meetings
2. Assigned to users
3. Users view their assigned action items
4. Users update status (from OPEN to IN_PROGRESS to COMPLETED)
5. Overdue action items highlighted
6. Completed action items show completion timestamp

---

## 19. Testing Considerations

### Frontend Testing
- **Unit Tests**: Test components, hooks, utilities
- **Integration Tests**: Test API service layer with mocked responses
- **E2E Tests**: Test critical user flows (login, create document, etc.)
- **Mock API**: Use MSW or similar for API mocking

### Test Scenarios
- Login with valid/invalid credentials
- Registration with valid/invalid data
- CRUD operations for all entities
- Permission-based access control
- Error handling and display
- Loading states
- Form validation
- Pagination and sorting

---

## 20. Performance Optimization

### Optimization Strategies
- **Code Splitting**: Lazy load routes and components
- **Image Optimization**: Use WebP, lazy loading
- **API Caching**: Cache API responses with appropriate TTL
- **Debouncing**: Debounce search inputs
- **Virtual Scrolling**: For large lists
- **Memoization**: Use React.memo, useMemo, useCallback
- **Bundle Size**: Analyze and optimize bundle size

---

## 21. Accessibility

### Accessibility Requirements
- **ARIA Labels**: Add appropriate ARIA labels
- **Keyboard Navigation**: Ensure all features accessible via keyboard
- **Focus Management**: Proper focus management in modals
- **Color Contrast**: Meet WCAG AA standards
- **Screen Readers**: Test with screen readers
- **Alt Text**: Add alt text for images
- **Semantic HTML**: Use proper semantic elements

---

## 22. Internationalization (i18n)

### i18n Considerations
- Backend supports i18n via MessageSource
- Frontend should implement i18n library (react-i18next)
- Support for multiple languages
- Date/number formatting based on locale
- Error messages in user's language

---

## 23. Deployment

### Build Process
```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

### Environment-Specific Builds
- Development: Local backend, debug mode
- Staging: Staging backend, debug logs
- Production: Production backend, optimized

### Static Asset Hosting
- Build outputs to `/dist` or `/build`
- Deploy to CDN or static hosting (Netlify, Vercel, etc.)
- Configure proper MIME types
- Enable gzip compression

---

## 24. Monitoring & Analytics

### Frontend Monitoring
- **Error Tracking**: Sentry or similar
- **Performance Monitoring**: Web Vitals
- **User Analytics**: Google Analytics or similar
- **API Performance**: Track API response times
- **User Behavior**: Track user flows

---

## 25. Development Workflow

### Git Workflow
- Feature branches for new features
- Pull requests for code review
- CI/CD pipeline for automated testing and deployment
- Semantic versioning for releases

### Code Quality
- ESLint for linting
- Prettier for formatting
- TypeScript for type safety
- Husky for pre-commit hooks
- Commitlint for commit message standards

---

## Summary

This frontend development skill provides all necessary information to build a comprehensive frontend application for RicozAssist. The backend API is well-structured with clear endpoints, DTOs, validation rules, and authentication mechanisms. Follow the guidelines in this document to ensure proper integration with the backend API.

### Key Takeaways
1. JWT-based authentication with 24-hour token expiration
2. Role-based access control (ADMIN, USER, VIEWER)
3. Comprehensive CRUD APIs for all entities
4. Strong validation rules enforced on both client and server
5. Proper error handling with detailed error responses
6. CORS configured for cross-origin requests
7. OpenAPI/Swagger documentation available
8. Pagination support for list endpoints
9. Soft delete pattern for all entities
10. AI-powered features (queries, action item extraction)

### Next Steps
1. Set up frontend project with recommended tech stack
2. Configure Axios with interceptors for JWT handling
3. Implement authentication flow (login/register/logout)
4. Create API service layer for all endpoints
5. Build UI components following component requirements
6. Implement pages and routing
7. Add state management
8. Implement form validation
9. Add error handling and loading states
10. Test all user flows
11. Deploy and monitor

---

**Document Version**: 1.0  
**Last Updated**: September 2024  
**Backend API Version**: 1.0.0
