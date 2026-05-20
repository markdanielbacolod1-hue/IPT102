
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserCircle, FileText, QrCode, Share2 } from 'lucide-react';

const navItems = [
{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
{ path: '/user-management', label: 'User Account', icon: UserCircle },
{ path: '/document-management', label: 'Document Management', icon: FileText },
{ path: '/qr-code', label: 'Generate QR Code', icon: QrCode },
{ path: '/document-sharing', label: 'Document Sharing &\nNotification', icon: Share2 }];


export function Sidebar() {
  return (
    <div className="w-[293px] bg-[url('./assets/cover.jpg')] h-[calc(100vh-100px)] bg-brand-dark rounded-[20px] shadow-md flex flex-col py-6 px-4 shrink-0">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
              `flex items-center gap-4 px-4 bg-white py-4 rounded-xl transition-colors ${
              isActive ? 'bg-brand-active shadow-md' : 'bg-brand-sidebar shadow-md hover:bg-brand-sidebar/80'}`

              }>
              
              <Icon className="w-7 h-7 text-black shrink-0" />
              <span className="text-black font-medium text-lg leading-tight whitespace-pre-line">
                {item.label}
              </span>
            </NavLink>);

        })}
      </div>
    </div>);

}