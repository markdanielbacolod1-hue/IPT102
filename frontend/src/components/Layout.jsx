
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex flex-1 p-4 gap-6 overflow-hidden max-w-[1440px] mx-auto w-full">
        <Sidebar />
        <main className="flex-1 bg-white rounded-[20px] shadow-md overflow-y-auto relative border border-gray-100">
          <Outlet />
        </main>
      </div>
    </div>);

}