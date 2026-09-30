-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted BOOLEAN NOT NULL DEFAULT false
);

-- Create knowledge_bases table
CREATE TABLE knowledge_bases (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    access_level VARCHAR(20) NOT NULL DEFAULT 'PRIVATE',
    indexed BOOLEAN NOT NULL DEFAULT false,
    indexing_status VARCHAR(20),
    document_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted BOOLEAN NOT NULL DEFAULT false
);

-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    document_type VARCHAR(50) NOT NULL,
    owner_id UUID NOT NULL,
    knowledge_base_id UUID,
    version INTEGER NOT NULL DEFAULT 1,
    last_edited_at TIMESTAMP,
    ai_generated BOOLEAN NOT NULL DEFAULT false,
    tags VARCHAR(500),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_documents_owner FOREIGN KEY (owner_id) REFERENCES users(id),
    CONSTRAINT fk_documents_knowledge_base FOREIGN KEY (knowledge_base_id) REFERENCES knowledge_bases(id)
);

-- Create meetings table
CREATE TABLE meetings (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    transcription TEXT,
    summary TEXT,
    recording_url VARCHAR(500),
    owner_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_meetings_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Create meeting_participants junction table
CREATE TABLE meeting_participants (
    meeting_id UUID NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (meeting_id, user_id),
    CONSTRAINT fk_meeting_participants_meeting FOREIGN KEY (meeting_id) REFERENCES meetings(id),
    CONSTRAINT fk_meeting_participants_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create action_items table
CREATE TABLE action_items (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    due_date DATE,
    completed_at TIMESTAMP,
    meeting_id UUID,
    assigned_to_id UUID NOT NULL,
    ai_extracted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_action_items_meeting FOREIGN KEY (meeting_id) REFERENCES meetings(id),
    CONSTRAINT fk_action_items_assigned_to FOREIGN KEY (assigned_to_id) REFERENCES users(id)
);

-- Create queries table
CREATE TABLE queries (
    id UUID PRIMARY KEY,
    query_text TEXT NOT NULL,
    response TEXT,
    query_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PROCESSING',
    processing_time_ms BIGINT,
    confidence_score DOUBLE PRECISION,
    created_by_user_id UUID NOT NULL,
    knowledge_base_id UUID,
    context_used TEXT,
    source_system VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_queries_created_by_user FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_queries_knowledge_base FOREIGN KEY (knowledge_base_id) REFERENCES knowledge_bases(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_documents_knowledge_base ON documents(knowledge_base_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_meetings_owner ON meetings(owner_id);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_scheduled_start ON meetings(scheduled_start);
CREATE INDEX idx_action_items_assigned_to ON action_items(assigned_to_id);
CREATE INDEX idx_action_items_meeting ON action_items(meeting_id);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);
CREATE INDEX idx_queries_created_by_user ON queries(created_by_user_id);
CREATE INDEX idx_queries_knowledge_base ON queries(knowledge_base_id);
CREATE INDEX idx_queries_status ON queries(status);
CREATE INDEX idx_queries_query_type ON queries(query_type);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
