import axios from 'axios';

let rawBase = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'https://aattral-v1-backend.onrender.com/api'
).trim();

// Fix any malformed protocol like http:https://
rawBase = rawBase.replace(/^http:https:\/\//, 'https://').replace(/\/+$/, '');

// Automatically ensure baseURL ends with '/api'
export const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 globally — clear token and redirect to sign-in
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/sign-in') && !window.location.pathname.includes('/sign-up')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  },
);

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
};

export const getAuthUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};
export const setAuthUser = (user) => {
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (payload) => api.patch('/auth/me', payload),
  sendOtp: (email) => api.post('/auth/send-otp', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email, otp, newPassword) => api.post('/auth/reset-password', { email, otp, newPassword }),
};

export const chatApi = {
  sendMessage: (payload) => api.post('/chat/message', payload),
  sendFeedback: (messageId, feedback) => api.patch(`/chat/messages/${messageId}/feedback`, { feedback }),

  // Streaming via Server-Sent Events
  streamMessage: async (payload, onEvent, onDone, onError) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Stream request failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const rawJson = line.slice(6).trim();
            if (rawJson) {
              try {
                const parsed = JSON.parse(rawJson);
                onEvent(parsed);
                if (parsed.type === 'done') {
                  if (onDone) onDone(parsed);
                }
              } catch (e) {
                console.warn('Could not parse SSE event:', e);
              }
            }
          }
        }
      }
    } catch (err) {
      if (onError) onError(err);
      else console.error('Streaming error:', err);
    }
  },
};

export const conversationsApi = {
  getAll: () => api.get('/conversations'),
  getById: (id) => api.get(`/conversations/${id}`),
  create: (title, industry, mode) => api.post('/conversations', { title, industry, mode }),
  update: (id, data) => api.patch(`/conversations/${id}`, data),
  delete: (id) => api.delete(`/conversations/${id}`),
};

export default api;
