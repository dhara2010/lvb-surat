import { apiClient } from './apiClient';

// For Testimonials (Assuming we will create this or it exists, using leaders or mocked if missing later)
// Currently making request to /api/testimonials
export const getTestimonials = () => apiClient('/api/testimonials');
