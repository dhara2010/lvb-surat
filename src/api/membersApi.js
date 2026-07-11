import { apiClient } from './apiClient';

export const getMembers = () => apiClient('/api/members');

