  export const resolveImageUrl = (url) => {
    if (!url) return ''; // No fallback image, handled by components
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('data:image')) return url;

    // Normalize slashes
    let normalizedUrl = url.startsWith('/') ? url : '/' + url;
    
    // Backwards compatibility for early admin uploads stored as /gallery/17843...-name.webp
    if (/^\/gallery\/\d{13,}-[^/]+$/.test(normalizedUrl)) {
        normalizedUrl = '/uploads' + normalizedUrl;
    }
    
    // Backend uploads get the backend domain
    if (normalizedUrl.startsWith('/uploads/')) {
      let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      baseUrl = baseUrl.replace(/\/+$/, '');
      return `${baseUrl}${normalizedUrl}`;
    }
    
    // Frontend statics (/gallery/, /members/) remain relative to be served by Vite/Vercel
    return normalizedUrl;
  };
