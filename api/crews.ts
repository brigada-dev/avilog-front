import { api } from './api';

export type CrewRole = {
  id: number;
  role: string;
};

export const fetchCrewRoles = async (token?: string): Promise<CrewRole[]> => {
  const response = await api('/crews', token);
  return response.data;
};

export const createCrewRole = async (role: string, token?: string) => {
  return await api('/crews', token, {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
};

export const deleteCrewRole = async (roleId: number, token?: string) => {
  return await api(`/crews/${roleId}`, token, {
    method: 'DELETE',
  });
};

export const editCrewRole = async (roleId: number, updatedRole: string, token?: string) => {
  return await api(`/crews/${roleId}`, token, {
    method: 'PUT',
    body: JSON.stringify({ role: updatedRole }),
  });
};
