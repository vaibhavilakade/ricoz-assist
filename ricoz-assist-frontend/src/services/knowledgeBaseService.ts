import api from './api';
import { KnowledgeBaseDTO, AccessLevel, DocumentDTO } from '../types/domain';

export const knowledgeBaseService = {
  getAll: async (): Promise<KnowledgeBaseDTO[]> => {
    const response = await api.get<KnowledgeBaseDTO[]>('/knowledge-bases');
    return response.data;
  },

  getById: async (id: string): Promise<KnowledgeBaseDTO> => {
    const response = await api.get<KnowledgeBaseDTO>(`/knowledge-bases/${id}`);
    return response.data;
  },

  getIndexed: async (): Promise<KnowledgeBaseDTO[]> => {
    const response = await api.get<KnowledgeBaseDTO[]>('/knowledge-bases/indexed');
    return response.data;
  },

  getByAccessLevel: async (accessLevel: AccessLevel): Promise<KnowledgeBaseDTO[]> => {
    const response = await api.get<KnowledgeBaseDTO[]>(`/knowledge-bases/access-level/${accessLevel}`);
    return response.data;
  },

  create: async (kb: Partial<KnowledgeBaseDTO>): Promise<KnowledgeBaseDTO> => {
    const response = await api.post<KnowledgeBaseDTO>('/knowledge-bases', kb);
    return response.data;
  },

  index: async (id: string): Promise<void> => {
    await api.post(`/knowledge-bases/${id}/index`);
  },

  searchInKnowledgeBase: async (id: string, query: string): Promise<DocumentDTO[]> => {
    const response = await api.get<DocumentDTO[]>(`/knowledge-bases/${id}/search`, {
      params: { query },
    });
    return response.data;
  },

  addDocumentToKnowledgeBase: async (documentId: string, kbId: string): Promise<void> => {
    await api.post(`/knowledge-bases/document/${documentId}/knowledge-base/${kbId}`);
  },

  removeDocumentFromKnowledgeBase: async (documentId: string): Promise<void> => {
    await api.delete(`/knowledge-bases/document/${documentId}`);
  },
};
