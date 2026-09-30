// API-specific types

export interface ApiError {
  response?: {
    data: {
      status: number;
      error: string;
      message: string;
      fieldErrors?: Array<{
        field: string;
        message: string;
      }>;
    };
  };
  message?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
