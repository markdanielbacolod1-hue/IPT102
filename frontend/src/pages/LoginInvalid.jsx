
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

export function LoginInvalid() {
  const navigate = useNavigate();

  return (
    <AuthLayout title="Invalid Login">
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2">
         <AlertTriangle className="w-[80px] h-[80px] text-white drop-shadow-md" />
      </div>
      <div className="w-full flex flex-col items-center gap-6 mt-4">
        <div className="w-full bg-brand-gray rounded-[10px] bg-white shadow-md p-8 flex flex-col items-center text-center gap-4 min-h-[203px] justify-center">
          <p className="text-xl text-black">Incorrect username or password.</p>
        </div>
        
        <button
          onClick={() => navigate('/login')}
          className="w-[454px] bg-[#2090A4] h-[56px] bg-brand-red rounded-[20px] shadow-md text-white text-2xl hover:bg-brand-red/90 transition-colors">
          
          Return to Login
        </button>
      </div>
    </AuthLayout>);

}