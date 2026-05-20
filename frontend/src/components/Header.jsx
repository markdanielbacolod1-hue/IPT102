
import React from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCircle, FileText, QrCode, Share2, Bell } from 'lucide-react';

const routeConfig = {
  '/dashboard': { title: 'Dashboard', icon: LayoutDashboard },
  '/user-management': { title: 'User Management', icon: UserCircle },
  '/document-management': { title: 'Document Management', icon: FileText },
  '/qr-code': { title: 'QR Code and Tracking', icon: QrCode },
  '/document-sharing': { title: 'Document Sharing & Notification', icon: Share2 }
};

export function Header() {
  const location = useLocation();
  const currentRoute = routeConfig[location.pathname] || { title: 'Dashboard', icon: LayoutDashboard };
  const Icon = currentRoute.icon;

  return (
    <header className="h-[72px] bg-[url('./assets/cover.jpg')] bg-cover rounded-b-[10px] shadow-md flex items-center justify-between px-8 w-full shrink-0">
      <div className="flex items-center gap-4">
        <Icon className="w-9 h-9 text-white" />
        <h1 className="text-white text-2xl font-normal">{currentRoute.title}</h1>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-white hover:text-white/80 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden border-2 border-white">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
            alt="User profile"
            className="w-full h-full object-cover" />
          
        </div>
      </div>
    </header>);

}