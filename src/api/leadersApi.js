import { apiClient } from './apiClient';

export const getLeaders = () => apiClient('/api/leaders');
export const getLeaderById = (id) => apiClient(`/api/leaders/${id}`);
