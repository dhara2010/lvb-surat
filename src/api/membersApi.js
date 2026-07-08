import { apiClient } from './apiClient';

export const getMembers = () => apiClient('/api/members');
export const getMemberById = (id) => apiClient(`/api/members/${id}`);
