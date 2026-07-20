import React, { useState, useEffect } from 'react';

export default function FallbackImage({ src, fallback, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallback);
    setError(false);
  }, [src, fallback]);

  const handleError = () => {
    if (!error) {
      setImgSrc(fallback);
      setError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
}
