import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export default function GuestOnly({ children }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) return <div>Loading...</div>;

  if (user) {
    return <Navigate to='/profile' replace />;
  }

  return children;
}
