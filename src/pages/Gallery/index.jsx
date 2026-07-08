import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { getGalleryImages } from '../../api/galleryApi';

export default function Showcase() {
  const [gallery, setGallery] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  const { data: galleryData, loading, error } = useFetch(getGalleryImages);

  useEffect(() => {
    if (galleryData) {
      setGallery(galleryData.map(item => item.image_url));
    }
  }, [galleryData]);

  return (
    <section id="showcase" className="section-light">
      <div className="container-xl section-padding pt-32">

        {/* ─── Section Header ───────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <span className="section-label block mb-3">Chapter Gallery</span>
          <h2
            className="h-lg"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Moments From Our Meetings
          </h2>
          <p className="text-body text-sm max-w-xl mt-3">
            A glimpse inside the premium weekly assemblies, conclaves, and
            award ceremonies of the Surat Platinum Chapter.
          </p>
        </motion.div>

        {/* ─── Gallery Grid ─────────────────── */}
        {loading && <div className="py-20 flex justify-center w-full text-gray-500 font-bold tracking-widest">LOADING GALLERY...</div>}
        {error && <div className="py-20 flex justify-center w-full text-red-400 font-bold tracking-widest">FAILED TO LOAD GALLERY</div>}
        {!loading && !error && gallery.length === 0 && <div className="py-20 flex justify-center w-full text-gray-500 font-bold tracking-widest">NO IMAGES AVAILABLE</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gallery.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: (i % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setLightbox(src)}
              className="group rounded-xl overflow-hidden cursor-zoom-in relative aspect-[4/3]"
              style={{
                border:     '1px solid var(--color-border)',
                boxShadow:  'var(--shadow-card)',
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
              }}
              whileHover={{ scale: 1.02 }}
              aria-label="View Image"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setLightbox(src)}
            >
              <img
                src={src}
                alt={`Gallery image ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                onError={(e) => { e.target.src = '/KVS_3369-scaled.jpg'; }}
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-end justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(11,31,58,0.72), transparent)' }}
              >
                <div className="p-5">
                  <ZoomIn className="w-5 h-5 text-white/90" aria-hidden />
                </div>
              </div>

              {/* Mint corner dot */}
              <div
                className="absolute top-3 right-3 w-2 h-2 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Lightbox ─────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: 'rgba(11, 31, 58, 0.90)', backdropFilter: 'blur(6px)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Expanded Image"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full rounded-2xl overflow-hidden relative"
              style={{
                backgroundColor: 'var(--color-bg)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.45)',
                border: '1px solid var(--color-border)',
              }}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(11,31,58,0.75)', color: '#fff' }}
                aria-label="Close image"
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={lightbox}
                alt="Expanded Gallery Image"
                className="w-full max-h-[85vh] object-contain bg-black/5"
                onError={(e) => { e.target.src = '/KVS_3369-scaled.jpg'; }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
