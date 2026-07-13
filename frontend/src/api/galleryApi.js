import { apiClient } from './apiClient';

export const getGalleryImages = () => apiClient('/api/gallery');
