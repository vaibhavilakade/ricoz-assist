import api from './api';
import { UserDTO, PaginationParams } from '../types/domain';

export const userService = {
  getAll: async (params?: PaginationParams): Promise<UserDTO[]> => {
    const response = await api.get<UserDTO[]>('/users', { params });
    return response.data;
  },

  getById: async (id: string): Promise<UserDTO> => {
    const response = await api.get<UserDTO>(`/users/${id}`);
    return response.data;
  },

  getByUsername: async (username: string): Promise<UserDTO> => {
    const response = await api.get<UserDTO>(`/users/username/${username}`);
    return response.data;
  },

  getByEmail: async (email: string): Promise<UserDTO> => {
    const response = await api.get<UserDTO>(`/users/email/${email}`);
    return response.data;
  },

  create: async (user: Partial<UserDTO>): Promise<UserDTO> => {
    const response = await api.post<UserDTO>('/users', user);
    return response.data;
  },

  update: async (id: string, user: Partial<UserDTO>): Promise<UserDTO> => {
    const response = await api.put<UserDTO>(`/users/${id}`, user);
    return response.data;
  },

  deactivate: async (id: string): Promise<void> => {
    await api.patch(`/users/${id}/deactivate`);
  },

  activate: async (id: string): Promise<void> => {
    await api.patch(`/users/${id}/activate`);
  },

  changePassword: async (id: string, newPassword: string): Promise<void> => {
    await api.patch(`/users/${id}/password`, newPassword, {
      headers: { 'Content-Type': 'text/plain' },
    });
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
