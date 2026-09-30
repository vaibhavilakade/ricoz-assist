// Domain types matching backend DTOs

export type UserRole = 'ADMIN' | 'USER' | 'VIEWER';

export type DocumentStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type DocumentType = 'REPORT' | 'EMAIL' | 'PROPOSAL' | 'MEMO' | 'CONTRACT' | 'PRESENTATION' | 'OTHER';

export type AccessLevel = 'PRIVATE' | 'TEAM' | 'ORGANIZATION' | 'PUBLIC';

export type MeetingStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ActionItemStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED';

export type QueryType = 'KNOWLEDGE_SEARCH' | 'DOCUMENT_QUERY' | 'BUSINESS_SYSTEM_QUERY' | 'GENERAL_QA';

export type QueryStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'TIMEOUT';

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentDTO {
  id: string;
  title: string;
  content?: string;
  status: DocumentStatus;
  documentType: DocumentType;
  ownerId?: string;
  ownerUsername?: string;
  knowledgeBaseId?: string;
  knowledgeBaseName?: string;
  version: number;
  lastEditedAt?: string;
  aiGenerated: boolean;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseDTO {
  id: string;
  name: string;
  description?: string;
  accessLevel: AccessLevel;
  indexed: boolean;
  indexingStatus?: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingDTO {
  id: string;
  title: string;
  description?: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: MeetingStatus;
  transcription?: string;
  summary?: string;
  recordingUrl?: string;
  ownerId?: string;
  ownerUsername?: string;
  participantIds?: string[];
  actionItemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActionItemDTO {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: ActionItemStatus;
  dueDate?: string;
  completedAt?: string;
  meetingId?: string;
  meetingTitle?: string;
  assignedToId?: string;
  assignedToUsername?: string;
  aiExtracted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QueryDTO {
  id: string;
  queryText: string;
  response?: string;
  queryType: QueryType;
  status: QueryStatus;
  processingTimeMs?: number;
  confidenceScore?: number;
  createdByUserId?: string;
  createdByUsername?: string;
  knowledgeBaseId?: string;
  knowledgeBaseName?: string;
  contextUsed?: string;
  sourceSystem?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  expiresIn: number;
  user: UserDTO;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  errorCode?: string;
  path?: string;
  timestamp: string;
  fieldErrors?: FieldError[];
}

export interface FieldError {
  field: string;
  rejectedValue?: any;
  message: string;
}

export interface PaginationParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginationResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
