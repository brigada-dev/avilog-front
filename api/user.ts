import { api } from './api';

export const getUser = async (token: string | null) => {
  if (!token) throw new Error('No authentication token found');

  return await api('/user', token, { method: 'GET' });
};
