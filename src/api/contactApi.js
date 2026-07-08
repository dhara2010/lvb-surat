import { apiClient } from './apiClient';

export const submitContactForm = (data) => apiClient('/api/contacts', {
  method: 'POST',
  body: JSON.stringify(data),
});
