import { apiClient } from './apiClient';

export const getEvents = () => apiClient('/api/events');
export const getEventById = (id) => apiClient(`/api/events/${id}`);
