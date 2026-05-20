
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

export function LoginSuccess() {
  const navigate = useNavigate();

  return (
    <AuthLayout title="Login Successful">
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2">
         <CheckCircle2 className="w-[80px] h-[80px] text-white drop-shadow-md" />
      </div>
      <div className="w-full flex flex-col items-center gap-6 mt-4">
        <div className="w-full bg-brand-gray rounded-[10px] bg-white shadow-md p-8 flex flex-col items-center text-center gap-4 min-h-[232px] justify-center">
          <h2 className="text-2xl font-semibold text-black">Login Successful</h2>
          <p className="text-xl text-black">Your login credentials have validated.</p>
        </div>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="w-[454px] h-[56px] bg-[#2090A4] bg-brand-cyan rounded-[20px] shadow-md text-white text-2xl font-semibold hover:bg-brand-cyan/90 transition-colors">
          
          Continue
        </button>
      </div>
    </AuthLayout>);

}