
import React from 'react';
import { Edit2, User, Settings, Bell, LogOut, TrendingUp, FileText, Share2, QrCode, Activity, Upload, Scan, Eye, LogIn } from 'lucide-react';

export function UserManagement() {
  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6">
      {/* Left Column - Profile & Menu */}
      <div className="w-[313px] shrink-0 flex flex-col gap-6">
        <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-[81px] h-[81px] rounded-full bg-gray-200 overflow-hidden">
              <img
                src=""
                alt="Profile"
                className="w-full h-full object-cover" />
              
            </div>
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white">
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
          <h2 className="text-[15px] font-medium text-black">Princess</h2>
          <p className="text-[10px] text-black underline mb-6">princessyeah@gmail.com</p>

          <div className="w-full flex flex-col gap-4">
            <button className="flex items-center gap-4 w-full text-left group">
              <User className="w-6 h-6 text-black" />
              <span className="text-sm font-semibold text-black flex-1">My Profile</span>
              <span className="text-black group-hover:translate-x-1 transition-transform">›</span>
            </button>
            <button className="flex items-center gap-4 w-full text-left group">
              <Settings className="w-6 h-6 text-black" />
              <span className="text-sm text-black flex-1">Settings</span>
              <span className="text-black group-hover:translate-x-1 transition-transform">›</span>
            </button>
            <button className="flex items-center gap-4 w-full text-left group">
              <Bell className="w-6 h-6 text-black" />
              <span className="text-sm text-black flex-1">Notification</span>
              <span className="text-black group-hover:translate-x-1 transition-transform">›</span>
            </button>
            <button className="flex items-center gap-4 w-full text-left group">
              <LogOut className="w-6 h-6 text-black" />
              <span className="text-sm text-black flex-1">Logout</span>
              <span className="text-black group-hover:translate-x-1 transition-transform">›</span>
            </button>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-[10px] shadow-md overflow-hidden flex-1">
          <div className="h-[43px] bg-[#B6C6C5] flex items-center px-4 gap-2">
            <TrendingUp className="w-[30px] h-[30px] text-black" />
            <span className="text-[11px] font-semibold text-black">Statistics</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="bg-[#498562] rounded-[5px] p-3 flex items-center gap-3 text-white">
              <FileText className="w-7 h-7" />
              <div className="leading-tight">
                <span className="text-[15px] font-bold block">234</span>
                <span className="text-[12px]">Documents Uploaded</span>
              </div>
            </div>
            <div className="bg-[#2A1467] rounded-[5px] p-3 flex items-center gap-3 text-white">
              <Share2 className="w-7 h-7" />
              <div className="leading-tight">
                <span className="text-[15px] font-bold block">154</span>
                <span className="text-[12px]">Documents Shared</span>
              </div>
            </div>
            <div className="bg-[#7A8834] rounded-[5px] p-3 flex items-center gap-3 text-white">
              <QrCode className="w-7 h-7" />
              <div className="leading-tight">
                <span className="text-[15px] font-bold block">34</span>
                <span className="text-[12px]">QR Codes Generated</span>
              </div>
            </div>
            <div className="bg-[#7D2424] rounded-[5px] p-3 flex items-center gap-3 text-white">
              <User className="w-7 h-7" />
              <div className="leading-tight">
                <span className="text-[15px] font-bold block">302</span>
                <span className="text-[12px]">Total Logins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle & Right Columns */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Profile Details Card */}
        <div className="bg-white rounded-[10px] shadow-md p-8 relative">
          <div className="absolute top-8 right-8">
            <span className="text-[10px] text-black font-medium bg-gray-100 px-2 py-1 rounded">ADMIN</span>
          </div>
          <div className="flex items-start gap-8">
            <div className="w-[100px] h-[100px] rounded-full bg-gray-200 overflow-hidden shrink-0">
               <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
                alt="Profile Large"
                className="w-full h-full object-cover" />
              
            </div>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex gap-8">
                <p className="text-[15px] text-black w-[200px]">Role: Admin</p>
                <p className="text-[15px] text-black">Account Status: Active</p>
              </div>
              <p className="text-[15px] text-black">Last Login: 2026-03-19 5PM</p>
              <p className="text-[15px] text-black">Assigned Departments: HR, Registrar, Finance</p>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-[10px] shadow-md p-6 flex-1">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-black" />
            <h3 className="text-2xl font-medium text-black">Activity Log</h3>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-4 border-t border-black">
              <div className="flex items-center gap-4">
                <LogOut className="w-6 h-6 text-black" />
                <span className="text-xl text-black">User Logged Out</span>
              </div>
              <span className="text-[10px] text-black">3 mins ago</span>
            </div>
            
            <div className="flex items-center justify-between py-4 border-t border-black">
              <div className="flex items-center gap-4">
                <Upload className="w-6 h-6 text-black" />
                <span className="text-xl text-black">Document Uploaded</span>
              </div>
              <span className="text-[10px] text-black">15 mins ago</span>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-black">
              <div className="flex items-center gap-4">
                <Scan className="w-6 h-6 text-black" />
                <span className="text-xl text-black">QR Code Scanned</span>
              </div>
              <span className="text-[10px] text-black">40 mins ago</span>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-black">
              <div className="flex items-center gap-4">
                <Eye className="w-6 h-6 text-black" />
                <span className="text-xl text-black">Document Viewed</span>
              </div>
              <span className="text-[10px] text-black">1 hour ago</span>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-black">
              <div className="flex items-center gap-4">
                <Upload className="w-6 h-6 text-black rotate-180" />
                <span className="text-xl text-black">File Downloaded</span>
              </div>
              <span className="text-[10px] text-black">2 hours ago</span>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-black">
              <div className="flex items-center gap-4">
                <LogIn className="w-6 h-6 text-black" />
                <span className="text-xl text-black">Login Successful</span>
              </div>
              <span className="text-[10px] text-black">4 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>);

}