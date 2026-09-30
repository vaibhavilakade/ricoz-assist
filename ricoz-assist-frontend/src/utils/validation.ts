import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must not exceed 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const documentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters'),
  content: z.string().optional(),
  status: z.enum(['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED']),
  documentType: z.enum(['REPORT', 'EMAIL', 'PROPOSAL', 'MEMO', 'CONTRACT', 'PRESENTATION', 'OTHER']),
  knowledgeBaseId: z.string().uuid().optional().or(z.literal('')),
});

export const meetingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters'),
  description: z.string().optional(),
  scheduledStart: z.string().min(1, 'Scheduled start time is required'),
  scheduledEnd: z.string().min(1, 'Scheduled end time is required'),
});

export const actionItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'BLOCKED']),
  dueDate: z.string().optional(),
  assignedToId: z.string().uuid().optional().or(z.literal('')),
});

export const knowledgeBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
  description: z.string().optional(),
  accessLevel: z.enum(['PRIVATE', 'TEAM', 'ORGANIZATION', 'PUBLIC']),
});

export const querySchema = z.object({
  queryText: z.string().min(1, 'Query is required'),
  queryType: z.enum(['KNOWLEDGE_SEARCH', 'DOCUMENT_QUERY', 'BUSINESS_SYSTEM_QUERY', 'GENERAL_QA']),
  knowledgeBaseId: z.string().uuid().optional().or(z.literal('')),
});
