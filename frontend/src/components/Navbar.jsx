import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  PawPrint,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Home,
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const baseLink =
  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const inactive = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
const active = 'text-slate-900 bg-slate-100';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const links = useMemo(() => {
    if (user) {
      return [
        { to: '/', label: 'Home', icon: Home },
        { to: '/profile', label: 'Profile', icon: User },
      ];
    }
    return [
      { to: '/', label: 'Home', icon: Home },
      { to: '/login', label: 'Login', icon: LogIn },
      { to: '/register', label: 'Register', icon: UserPlus },
    ];
  }, [user]);

  const onLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate('/');
    } catch {
      // error se već čuva u store-u
    }
  };

  const closeMobile = () => setOpen(false);

  return (
    <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Brand */}
          <NavLink
            to='/'
            className='flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-slate-100'
            onClick={closeMobile}
          >
            <span className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white'>
              <PawPrint className='h-5 w-5' />
            </span>
            <div className='leading-tight'>
              <div className='text-sm font-semibold text-slate-900'>
                PetSafely
              </div>
              <div className='text-xs text-slate-500'>
                Safe walks, smarter alerts
              </div>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <nav className='hidden items-center gap-2 md:flex'>
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cx(baseLink, isActive ? active : inactive)
                }
              >
                <Icon className='h-4 w-4' />
                {label}
              </NavLink>
            ))}

            {/* Right side */}
            {user ? (
              <div className='ml-2 flex items-center gap-2'>
                <div className='hidden lg:flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2'>
                  <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700'>
                    <User className='h-4 w-4' />
                  </span>
                  <div className='max-w-[180px] truncate text-sm text-slate-700'>
                    {user.name || user.email}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  disabled={loading}
                  className='flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60'
                >
                  <LogOut className='h-4 w-4' />
                  Logout
                </button>
              </div>
            ) : (
              <span className='ml-2 hidden lg:inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600'>
                <PawPrint className='h-4 w-4' />
                Report hazards on the map
              </span>
            )}
          </nav>

          {/* Mobile button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className='inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 md:hidden'
            aria-label='Toggle menu'
          >
            {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>

        {/* Mobile panel */}
        <div
          className={cx(
            'md:hidden overflow-hidden transition-[max-height] duration-300',
            open ? 'max-h-80' : 'max-h-0',
          )}
        >
          <div className='pb-4 pt-2'>
            <div className='grid gap-2'>
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cx(baseLink, isActive ? active : inactive, 'w-full')
                  }
                >
                  <Icon className='h-4 w-4' />
                  {label}
                </NavLink>
              ))}

              {user ? (
                <button
                  onClick={onLogout}
                  disabled={loading}
                  className='mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60'
                >
                  <LogOut className='h-4 w-4' />
                  Logout
                </button>
              ) : (
                <div className='mt-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-600'>
                  <div className='flex items-center gap-2 font-medium text-slate-900'>
                    <PawPrint className='h-4 w-4' />
                    PetSafely
                  </div>
                  <div className='mt-1 text-xs text-slate-500'>
                    Check the map and report hazards for safer walks.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
