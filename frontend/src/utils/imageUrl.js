export function resolveImageUrl(image) {
    if (!image) {
        return "/gallery/placeholder.webp";
    }

    if (image.startsWith("http")) {
        return image;
    }

    if (image.startsWith("data:image")) {
        return image;
    }

    // Fallback to Render URL in case VITE_API_URL is not set properly on Vercel
    const API_URL = import.meta.env.VITE_API_URL || "https://lvb-surat.onrender.com";
    const base = API_URL.replace(/\/+$/, '');

    return `${base}${image.startsWith("/") ? image : "/" + image}`;
}
