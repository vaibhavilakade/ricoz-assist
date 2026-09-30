import { UserRole, DocumentStatus, DocumentType, AccessLevel, MeetingStatus, Priority, ActionItemStatus, QueryType, QueryStatus } from '../types/domain';

export const USER_ROLES: Record<UserRole, string> = {
  ADMIN: 'Admin',
  USER: 'User',
  VIEWER: 'Viewer',
};

export const DOCUMENT_STATUSES: Record<DocumentStatus, string> = {
  DRAFT: 'Draft',
  IN_REVIEW: 'In Review',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

export const DOCUMENT_TYPES: Record<DocumentType, string> = {
  REPORT: 'Report',
  EMAIL: 'Email',
  PROPOSAL: 'Proposal',
  MEMO: 'Memo',
  CONTRACT: 'Contract',
  PRESENTATION: 'Presentation',
  OTHER: 'Other',
};

export const ACCESS_LEVELS: Record<AccessLevel, string> = {
  PRIVATE: 'Private',
  TEAM: 'Team',
  ORGANIZATION: 'Organization',
  PUBLIC: 'Public',
};

export const MEETING_STATUSES: Record<MeetingStatus, string> = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const PRIORITIES: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const ACTION_ITEM_STATUSES: Record<ActionItemStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  BLOCKED: 'Blocked',
};

export const QUERY_TYPES: Record<QueryType, string> = {
  KNOWLEDGE_SEARCH: 'Knowledge Search',
  DOCUMENT_QUERY: 'Document Query',
  BUSINESS_SYSTEM_QUERY: 'Business System Query',
  GENERAL_QA: 'General Q&A',
};

export const QUERY_STATUSES: Record<QueryStatus, string> = {
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  TIMEOUT: 'Timeout',
};
