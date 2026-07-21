import { apiClient } from './apiClient';

export const getEvents = () => apiClient('/api/events');
export const getEvent = (id) => apiClient(`/api/events/${id}`);
<<<<<<< HEAD
export const bookTicket = (id, data) => apiClient(`/api/events/${id}/book`, {
  method: 'POST',
  body: JSON.stringify(data)
});
=======
export const checkAttendance = (eventId, memberId) => 
  apiClient(`/api/attendance/check?eventId=${eventId}&memberId=${memberId}`);
export const markEventAttendance = (payload) => 
  apiClient('/api/attendance/mark', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
>>>>>>> 3357e0df5b435410dd8b44ec3274501dc391a6e5
