import React from 'react';

export function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-[url('./assets/cover.jpg')] bg-no-repeat bg-cover relative overflow-hidden flex items-center justify-center">
      {/* Background Decorative Shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1440px] h-full pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[668px] h-[668px] bg-brand-teal rounded-full opacity-80 mix-blend-multiply blur-3xl"></div>
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-brand-teal rounded-full opacity-60 mix-blend-multiply blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-brand-teal rounded-full opacity-70 mix-blend-multiply blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-[515px]">
        <h1 className="text-white text-[40px] font-bold mb-8 drop-shadow-md text-center">
          {title}
        </h1>
        {children}
      </div>
    </div>);

}