import { apiClient } from './apiClient';

export const getEvents = () => apiClient('/api/events');
export const getEvent = (id) => apiClient(`/api/events/${id}`);
export const bookTicket = (id, data) => apiClient(`/api/events/${id}/book`, {
  method: 'POST',
  body: JSON.stringify(data)
});
export const checkAttendance = (eventId, memberId) => 
  apiClient(`/api/attendance/check?eventId=${eventId}&memberId=${memberId}`);
export const markEventAttendance = (payload) => 
  apiClient('/api/attendance/mark', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
