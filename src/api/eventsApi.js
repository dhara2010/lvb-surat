import { apiClient } from './apiClient';

export const getEvents = () => apiClient('/api/events');
export const getEvent = (id) => apiClient(`/api/events/${id}`);

