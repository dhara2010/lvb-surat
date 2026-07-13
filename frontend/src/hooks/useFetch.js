import { useState, useEffect } from 'react';

export const useFetch = (apiFunction, ...args) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...args);
        setData(result);
      } catch (err) {
        setError(err.message || 'Error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiFunction, ...args]);

  return { data, loading, error };
};
