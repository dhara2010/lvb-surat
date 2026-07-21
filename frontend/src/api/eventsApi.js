import { apiClient } from './apiClient';

export const getEvents = () => apiClient('/api/events');
export const getEvent = (id) => apiClient(`/api/events/${id}`);
export const bookTicket = (id, data) => apiClient(`/api/events/${id}/book`, {
  method: 'POST',
  body: JSON.stringify(data)
});
