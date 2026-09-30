import api from './api';
import { LoginRequest, LoginResponse, RegisterRequest, UserDTO } from '../types/domain';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<UserDTO> => {
    const response = await api.post<UserDTO>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
