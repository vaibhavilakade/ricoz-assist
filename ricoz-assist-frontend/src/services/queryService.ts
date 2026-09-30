import api from './api';
import { QueryDTO, QueryType } from '../types/domain';

export const queryService = {
  create: async (query: Partial<QueryDTO>): Promise<QueryDTO> => {
    const response = await api.post<QueryDTO>('/queries', query);
    return response.data;
  },

  getById: async (id: string): Promise<QueryDTO> => {
    const response = await api.get<QueryDTO>(`/queries/${id}`);
    return response.data;
  },

  getByUser: async (userId: string): Promise<QueryDTO[]> => {
    const response = await api.get<QueryDTO[]>(`/queries/user/${userId}`);
    return response.data;
  },

  getByUserAndType: async (userId: string, type: QueryType): Promise<QueryDTO[]> => {
    const response = await api.get<QueryDTO[]>(`/queries/user/${userId}/type/${type}`);
    return response.data;
  },

  getPending: async (): Promise<QueryDTO[]> => {
    const response = await api.get<QueryDTO[]>('/queries/pending');
    return response.data;
  },

  getAverageProcessingTime: async (): Promise<number> => {
    const response = await api.get<number>('/queries/metrics/avg-processing-time');
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/queries/${id}`);
  },
};
