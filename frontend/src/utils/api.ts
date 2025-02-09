import axios from 'axios';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  token?: string;
}

interface AxiosErrorWithRetry extends Error {
  config: any;
  response?: {
    status: number;
  };
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: unknown) => {
    // Type guard for axios error
    const isAxiosError = (err: unknown): err is AxiosErrorWithRetry => {
      return err instanceof Error && 'config' in err;
    };

    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (error._retry) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401) {
      error._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await api.post<ApiResponse>('/auth/refresh', {
          refresh_token: refreshToken,
        });

        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
          
          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          }
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear auth and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
