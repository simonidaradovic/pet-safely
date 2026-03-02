import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/profile';

  useEffect(() => {
    clearError();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch {}
  };

  return (
    <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <div className='mb-6'>
            <h1 className='text-2xl font-semibold text-slate-900'>Sign in</h1>
            <p className='mt-1 text-sm text-slate-600'>
              Log in to view the map and report hazards.
            </p>
          </div>

          {error ? (
            <div className='mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
              <AlertCircle className='mt-0.5 h-4 w-4' />
              <div>{error}</div>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className='space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium text-slate-700'>
                Email
              </label>
              <div className='relative'>
                <Mail className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete='email'
                  className='w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400'
                  placeholder='e.g. anna@gmail.com'
                />
              </div>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-slate-700'>
                Password
              </label>
              <div className='relative'>
                <Lock className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete='current-password'
                  className='w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400'
                  placeholder='••••••••'
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60'
            >
              <LogIn className='h-4 w-4' />
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className='mt-5 text-center text-sm text-slate-600'>
            Don&apos;t have an account?{' '}
            <NavLink
              to='/register'
              className='font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900'
            >
              Create one
            </NavLink>
          </div>
        </div>

        <div className='mt-4 text-center text-xs text-slate-500'>
          PetSafely • Safer walks, smarter alerts
        </div>
      </div>
    </div>
  );
}
