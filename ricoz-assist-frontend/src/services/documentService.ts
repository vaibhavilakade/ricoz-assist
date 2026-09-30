import api from './api';
import { DocumentDTO, DocumentStatus, PaginationParams } from '../types/domain';

export const documentService = {
  getAll: async (params?: PaginationParams): Promise<DocumentDTO[]> => {
    const response = await api.get<DocumentDTO[]>('/documents', { params });
    return response.data;
  },

  getById: async (id: string): Promise<DocumentDTO> => {
    const response = await api.get<DocumentDTO>(`/documents/${id}`);
    return response.data;
  },

  getByOwner: async (ownerId: string): Promise<DocumentDTO[]> => {
    const response = await api.get<DocumentDTO[]>(`/documents/owner/${ownerId}`);
    return response.data;
  },

  getByKnowledgeBase: async (kbId: string): Promise<DocumentDTO[]> => {
    const response = await api.get<DocumentDTO[]>(`/documents/knowledge-base/${kbId}`);
    return response.data;
  },

  search: async (keyword: string): Promise<DocumentDTO[]> => {
    const response = await api.get<DocumentDTO[]>('/documents/search', {
      params: { keyword },
    });
    return response.data;
  },

  create: async (document: Partial<DocumentDTO>): Promise<DocumentDTO> => {
    const response = await api.post<DocumentDTO>('/documents', document);
    return response.data;
  },

  update: async (id: string, document: Partial<DocumentDTO>): Promise<DocumentDTO> => {
    const response = await api.put<DocumentDTO>(`/documents/${id}`, document);
    return response.data;
  },

  addToKnowledgeBase: async (id: string, kbId: string): Promise<DocumentDTO> => {
    const response = await api.patch<DocumentDTO>(`/documents/${id}/knowledge-base/${kbId}`);
    return response.data;
  },

  updateStatus: async (id: string, status: DocumentStatus): Promise<DocumentDTO> => {
    const response = await api.patch<DocumentDTO>(`/documents/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },
};
