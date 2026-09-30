import api from './api';
import { MeetingDTO, MeetingStatus } from '../types/domain';

export const meetingService = {
  getAll: async (): Promise<MeetingDTO[]> => {
    const response = await api.get<MeetingDTO[]>('/meetings');
    return response.data;
  },

  getById: async (id: string): Promise<MeetingDTO> => {
    const response = await api.get<MeetingDTO>(`/meetings/${id}`);
    return response.data;
  },

  getByOwner: async (ownerId: string): Promise<MeetingDTO[]> => {
    const response = await api.get<MeetingDTO[]>(`/meetings/owner/${ownerId}`);
    return response.data;
  },

  getByOwnerAndStatus: async (ownerId: string, status: MeetingStatus): Promise<MeetingDTO[]> => {
    const response = await api.get<MeetingDTO[]>(`/meetings/owner/${ownerId}/status/${status}`);
    return response.data;
  },

  getByDateRange: async (start: string, end: string): Promise<MeetingDTO[]> => {
    const response = await api.get<MeetingDTO[]>('/meetings/date-range', {
      params: { start, end },
    });
    return response.data;
  },

  create: async (meeting: Partial<MeetingDTO>): Promise<MeetingDTO> => {
    const response = await api.post<MeetingDTO>('/meetings', meeting);
    return response.data;
  },

  update: async (id: string, meeting: Partial<MeetingDTO>): Promise<MeetingDTO> => {
    const response = await api.put<MeetingDTO>(`/meetings/${id}`, meeting);
    return response.data;
  },

  addParticipant: async (id: string, userId: string): Promise<MeetingDTO> => {
    const response = await api.post<MeetingDTO>(`/meetings/${id}/participants/${userId}`);
    return response.data;
  },

  removeParticipant: async (id: string, userId: string): Promise<MeetingDTO> => {
    const response = await api.delete<MeetingDTO>(`/meetings/${id}/participants/${userId}`);
    return response.data;
  },

  startMeeting: async (id: string): Promise<MeetingDTO> => {
    const response = await api.post<MeetingDTO>(`/meetings/${id}/start`);
    return response.data;
  },

  endMeeting: async (id: string): Promise<MeetingDTO> => {
    const response = await api.post<MeetingDTO>(`/meetings/${id}/end`);
    return response.data;
  },

  processTranscription: async (id: string, transcription: string): Promise<void> => {
    await api.post(`/meetings/${id}/transcription`, transcription, {
      headers: { 'Content-Type': 'text/plain' },
    });
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/meetings/${id}`);
  },
};
