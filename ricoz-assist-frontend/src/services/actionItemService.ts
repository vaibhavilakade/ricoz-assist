import api from './api';
import { ActionItemDTO, ActionItemStatus, Priority } from '../types/domain';

export const actionItemService = {
  getAll: async (): Promise<ActionItemDTO[]> => {
    const response = await api.get<ActionItemDTO[]>('/action-items');
    return response.data;
  },

  getById: async (id: string): Promise<ActionItemDTO> => {
    const response = await api.get<ActionItemDTO>(`/action-items/${id}`);
    return response.data;
  },

  getByAssignedTo: async (userId: string): Promise<ActionItemDTO[]> => {
    const response = await api.get<ActionItemDTO[]>(`/action-items/assigned-to/${userId}`);
    return response.data;
  },

  getByAssignedToAndStatus: async (userId: string, status: ActionItemStatus): Promise<ActionItemDTO[]> => {
    const response = await api.get<ActionItemDTO[]>(`/action-items/assigned-to/${userId}/status/${status}`);
    return response.data;
  },

  getByMeeting: async (meetingId: string): Promise<ActionItemDTO[]> => {
    const response = await api.get<ActionItemDTO[]>(`/action-items/meeting/${meetingId}`);
    return response.data;
  },

  getOverdue: async (): Promise<ActionItemDTO[]> => {
    const response = await api.get<ActionItemDTO[]>('/action-items/overdue');
    return response.data;
  },

  getDueBetween: async (start: string, end: string): Promise<ActionItemDTO[]> => {
    const response = await api.get<ActionItemDTO[]>('/action-items/due-between', {
      params: { start, end },
    });
    return response.data;
  },

  getByPriority: async (userId: string, priority: Priority): Promise<ActionItemDTO[]> => {
    const response = await api.get<ActionItemDTO[]>(`/action-items/assigned-to/${userId}/priority/${priority}`);
    return response.data;
  },

  create: async (actionItem: Partial<ActionItemDTO>): Promise<ActionItemDTO> => {
    const response = await api.post<ActionItemDTO>('/action-items', actionItem);
    return response.data;
  },

  update: async (id: string, actionItem: Partial<ActionItemDTO>): Promise<ActionItemDTO> => {
    const response = await api.put<ActionItemDTO>(`/action-items/${id}`, actionItem);
    return response.data;
  },

  complete: async (id: string): Promise<ActionItemDTO> => {
    const response = await api.patch<ActionItemDTO>(`/action-items/${id}/complete`);
    return response.data;
  },

  updateStatus: async (id: string, status: ActionItemStatus): Promise<ActionItemDTO> => {
    const response = await api.patch<ActionItemDTO>(`/action-items/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  assignToUser: async (id: string, userId: string): Promise<ActionItemDTO> => {
    const response = await api.patch<ActionItemDTO>(`/action-items/${id}/assign/${userId}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/action-items/${id}`);
  },
};
