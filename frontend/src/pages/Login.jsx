
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      navigate('/login-success');
    } else {
      navigate('/login-invalid');
    }
  };

  return (
    <AuthLayout title="User Login">
      <form onSubmit={handleLogin} className="w-full flex flex-col items-center gap-6">
        <div className="w-full bg-brand-gray rounded-[10px] shadow-md p-6 flex flex-col gap-4 bg-white">
          <div className="flex items-center gap-4 border-b border-black pb-2">
            <User className="w-[30px] h-[30px] text-black shrink-0" />
            <input
              type="text"
              placeholder="Username"
              className="bg-transparent border-none outline-none text-2xl text-black placeholder:text-black/60 w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
            
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Lock className="w-[33px] h-[33px] text-black shrink-0" />
            <input
              type="password"
              placeholder="••••••••"
              className="bg-transparent border-none outline-none text-2xl text-black placeholder:text-black/60 w-full tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full h-[56px] bg-brand-cyan rounded-[20px] shadow-md text-white text-2xl font-semibold hover:bg-brand-cyan/90 transition-colors bg-[#2090A4]">
          
          Login
        </button>
      </form>
    </AuthLayout>);

}