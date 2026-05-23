import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send/receive cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed.');
        navigate('/login-invalid');
        return;
      }

      // Save user info so other pages can use it
      localStorage.setItem('user', JSON.stringify(data.user));

      // Change this from '/login-success' to go straight to the main app dashboard
      navigate('/dashboard');

    } catch (err) {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="User Login">
      <form onSubmit={handleLogin} className="w-full flex flex-col items-center gap-6">
        <div className="w-full bg-brand-gray rounded-[10px] shadow-md p-6 flex flex-col gap-4 bg-white">
          <div className="flex items-center gap-4 border-b border-black pb-2">
            <User className="w-[30px] h-[30px] text-black shrink-0" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent border-none outline-none text-2xl text-black placeholder:text-black/60 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Lock className="w-[33px] h-[33px] text-black shrink-0" />
            <input
              type="password"
              placeholder="••••••••"
              className="bg-transparent border-none outline-none text-2xl text-black placeholder:text-black/60 w-full tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[56px] bg-[#2090A4] rounded-[20px] shadow-md text-white text-2xl font-semibold hover:bg-[#2090A4]/90 transition-colors disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </AuthLayout>
  );
}