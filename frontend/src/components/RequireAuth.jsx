import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export default function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  }

  return children;
}
