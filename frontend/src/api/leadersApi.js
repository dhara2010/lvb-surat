import { apiClient } from './apiClient';

export const getLeaders = () => apiClient('/api/leaders');

