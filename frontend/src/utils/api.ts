const API_URL = import.meta.env.VITE_API_URL;

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
  },
  ADMIN: {
    ANALYTICS: `${API_URL}/admin/analytics`,
    USERS: `${API_URL}/admin/users`,
    EVENTS: `${API_URL}/admin/events`,
    MARKETING: `${API_URL}/marketing`,
  },
  EVENTS: {
    LIST: `${API_URL}/events`,
    CREATE: `${API_URL}/events`,
    DETAILS: (id: string) => `${API_URL}/events/${id}`,
  },
  SPONSORS: {
    LIST: `${API_URL}/sponsors`,
    CREATE: `${API_URL}/sponsors`,
    DETAILS: (id: string) => `${API_URL}/sponsors/${id}`,
  },
};

export const fetchApi = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  console.log('Making request to:', url);
  console.log('With headers:', headers);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', responseText);

    if (!response.ok) {
      try {
        const errorJson = JSON.parse(responseText);
        throw new Error(errorJson.detail || errorJson.message || 'API request failed');
      } catch {
        throw new Error(responseText || 'API request failed');
      }
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid JSON response from server');
    }
  } catch (e) {
    console.error('API request failed:', e);
    throw e;
  }
};
