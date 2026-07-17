import { useLocation } from 'react-router-dom';

export const usePrimaryTextClass = () => {
  const location = useLocation();
  return location.pathname === '/' ? 'text-primary' : 'text-cyan-900';
};
