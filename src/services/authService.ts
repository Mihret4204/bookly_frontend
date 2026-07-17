import api from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

export const authService = {
  /** POST /auths/signup → { message, user } — backend does NOT return tokens on signup */
  register: async (data: RegisterData): Promise<{ message: string; user: User }> => {
    const response = await api.post('/auths/signup', data);
    return response.data;
  },

  /** POST /auths/login → { message, access_token, refresh_token, user } */
  login: async (data: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auths/login', data);
    return response.data;
  },

  /** GET /auths/logout — blocklists the current JTI */
  logout: async (): Promise<void> => {
    await api.get('/auths/logout');
  },

  /** GET /auths/me → full user profile with books + favorites count */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auths/me');
    return response.data;
  },
};
