import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useAuthStore } from './stores/auth.store';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import GuestOnly from './components/GuestOnly';

function App() {
  const me = useAuthStore((s) => s.me);

  useEffect(() => {
    me();
  }, [me]);

  return (
    <BrowserRouter>
      <div className='flex min-h-screen flex-col bg-slate-50'>
        <Navbar />

        <main className='flex-1'>
          <div className='mx-auto max-w-6xl px-4 py-6'>
            <Routes>
              <Route path='/' element={<Home />} />

              <Route
                path='/login'
                element={
                  <GuestOnly>
                    <Login />
                  </GuestOnly>
                }
              />

              <Route
                path='/register'
                element={
                  <GuestOnly>
                    <Register />
                  </GuestOnly>
                }
              />

              <Route
                path='/profile'
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />

              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
