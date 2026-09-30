# Database Schema Documentation

## Entity Relationship Diagram (ERD)

### Core Entities

#### User
- **Primary Key:** id (UUID)
- **Fields:**
  - username (VARCHAR 50, unique)
  - email (VARCHAR 100, unique)
  - password_hash (VARCHAR 255)
  - first_name (VARCHAR 50)
  - last_name (VARCHAR 50)
  - role (ENUM: ADMIN, USER, VIEWER)
  - active (BOOLEAN)
- **Relationships:**
  - One-to-Many with Document (as owner)
  - One-to-Many with Meeting (as owner)
  - One-to-Many with ActionItem (as assignedTo)
  - One-to-Many with Query (as createdByUser)
  - Many-to-Many with Meeting (as participant)

#### Document
- **Primary Key:** id (UUID)
- **Fields:**
  - title (VARCHAR 200)
  - content (TEXT)
  - status (ENUM: DRAFT, IN_REVIEW, PUBLISHED, ARCHIVED)
  - document_type (ENUM: REPORT, EMAIL, PROPOSAL, MEMO, CONTRACT, PRESENTATION, OTHER)
  - version (INTEGER)
  - last_edited_at (TIMESTAMP)
  - ai_generated (BOOLEAN)
  - tags (VARCHAR 500)
- **Relationships:**
  - Many-to-One with User (owner)
  - Many-to-One with KnowledgeBase

#### KnowledgeBase
- **Primary Key:** id (UUID)
- **Fields:**
  - name (VARCHAR 100)
  - description (TEXT)
  - access_level (ENUM: PRIVATE, TEAM, ORGANIZATION, PUBLIC)
  - indexed (BOOLEAN)
  - indexing_status (VARCHAR 20)
  - document_count (INTEGER)
- **Relationships:**
  - One-to-Many with Document

#### Meeting
- **Primary Key:** id (UUID)
- **Fields:**
  - title (VARCHAR 200)
  - description (TEXT)
  - scheduled_start (TIMESTAMP)
  - scheduled_end (TIMESTAMP)
  - actual_start (TIMESTAMP)
  - actual_end (TIMESTAMP)
  - status (ENUM: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
  - transcription (TEXT)
  - summary (TEXT)
  - recording_url (VARCHAR 500)
- **Relationships:**
  - Many-to-One with User (owner)
  - Many-to-Many with User (participants)
  - One-to-Many with ActionItem

#### ActionItem
- **Primary Key:** id (UUID)
- **Fields:**
  - title (VARCHAR 200)
  - description (TEXT)
  - priority (ENUM: LOW, MEDIUM, HIGH, URGENT)
  - status (ENUM: OPEN, IN_PROGRESS, COMPLETED, CANCELLED, BLOCKED)
  - due_date (DATE)
  - completed_at (TIMESTAMP)
  - ai_extracted (BOOLEAN)
- **Relationships:**
  - Many-to-One with Meeting
  - Many-to-One with User (assignedTo)

#### Query
- **Primary Key:** id (UUID)
- **Fields:**
  - query_text (TEXT)
  - response (TEXT)
  - query_type (ENUM: KNOWLEDGE_SEARCH, DOCUMENT_QUERY, BUSINESS_SYSTEM_QUERY, GENERAL_QA)
  - status (ENUM: PROCESSING, COMPLETED, FAILED, TIMEOUT)
  - processing_time_ms (BIGINT)
  - confidence_score (DOUBLE)
  - context_used (TEXT)
  - source_system (VARCHAR 100)
- **Relationships:**
  - Many-to-One with User (createdByUser)
  - Many-to-One with KnowledgeBase

## Junction Tables

### meeting_participants
- meeting_id (UUID, FK to meetings)
- user_id (UUID, FK to users)
- Primary Key: (meeting_id, user_id)

## Indexes

### Performance Indexes
- `idx_documents_owner` - on documents(owner_id)
- `idx_documents_knowledge_base` - on documents(knowledge_base_id)
- `idx_documents_status` - on documents(status)
- `idx_meetings_owner` - on meetings(owner_id)
- `idx_meetings_status` - on meetings(status)
- `idx_meetings_scheduled_start` - on meetings(scheduled_start)
- `idx_action_items_assigned_to` - on action_items(assigned_to_id)
- `idx_action_items_meeting` - on action_items(meeting_id)
- `idx_action_items_status` - on action_items(status)
- `idx_action_items_due_date` - on action_items(due_date)
- `idx_queries_created_by_user` - on queries(created_by_user_id)
- `idx_queries_knowledge_base` - on queries(knowledge_base_id)
- `idx_queries_status` - on queries(status)
- `idx_queries_query_type` - on queries(query_type)
- `idx_users_username` - on users(username)
- `idx_users_email` - on users(email)
- `idx_users_role` - on users(role)

## Audit Fields

All entities inherit from BaseEntity and include:
- `created_at` (TIMESTAMP) - Auto-populated on creation
- `updated_at` (TIMESTAMP) - Auto-updated on modification
- `created_by` (VARCHAR 100) - User who created the record
- `updated_by` (VARCHAR 100) - User who last modified the record
- `deleted` (BOOLEAN) - Soft delete flag (default: false)

## Data Integrity

### Foreign Key Constraints
- `fk_documents_owner` - documents.owner_id → users.id
- `fk_documents_knowledge_base` - documents.knowledge_base_id → knowledge_bases.id
- `fk_meetings_owner` - meetings.owner_id → users.id
- `fk_meeting_participants_meeting` - meeting_participants.meeting_id → meetings.id
- `fk_meeting_participants_user` - meeting_participants.user_id → users.id
- `fk_action_items_meeting` - action_items.meeting_id → meetings.id
- `fk_action_items_assigned_to` - action_items.assigned_to_id → users.id
- `fk_queries_created_by_user` - queries.created_by_user_id → users.id
- `fk_queries_knowledge_base` - queries.knowledge_base_id → knowledge_bases.id

### Unique Constraints
- users.username
- users.email

## Migration Strategy

Database migrations are managed using Flyway:
- Version: V1__create_schema.sql
- Baseline migration enabled
- Location: classpath:db/migration
- Automatic schema validation on startup

## Notes

- All primary keys use UUID for distributed system compatibility
- Soft delete pattern implemented via `deleted` flag
- Text fields use PostgreSQL TEXT type for unlimited length
- Enum types stored as VARCHAR for flexibility
- Timestamps use timezone-aware storage
- All queries should include `deleted = false` filter unless explicitly retrieving deleted records
