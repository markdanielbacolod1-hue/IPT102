
import React from 'react';
import { FileText, Users, ChevronDown, Bell, MessageSquare, Share2, Clock, Folder, FileSignature } from 'lucide-react';
// comment
export function DocumentSharing() {
  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6">
      {/* Left Column - Share Documents & Recent Shares */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Share Documents */}
        <div className="bg-white rounded-[20px] shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-black" />
            <h2 className="text-2xl font-semibold text-black">Share Documents</h2>
          </div>
          <div className="w-full h-[2px] bg-black mb-6"></div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xl font-medium text-black">Select Document</label>
              <div className="relative">
                <div className="w-full h-[70px] rounded-[20px] border border-black bg-[#FFFCFC] shadow-md flex items-center px-6">
                  <FileText className="w-8 h-8 text-black mr-4" />
                  <span className="text-lg text-black/50">Select...</span>
                </div>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-black" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xl font-medium text-black">Share with</label>
              <div className="relative">
                <div className="w-full h-[70px] rounded-[20px] border border-black bg-[#FFFCFC] shadow-md flex items-center px-6">
                  <Users className="w-8 h-8 text-black mr-4" />
                  <span className="text-lg text-black/50">Select users or departments...</span>
                </div>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-black" />
              </div>
            </div>

            <div className="bg-brand-gray rounded-[10px] p-4 flex justify-end shadow-md">
              <button className="w-[102px] h-[44px] bg-[#42A5F5] rounded-[10px] shadow-md text-black text-xl font-medium hover:bg-[#42A5F5]/90 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Recent Shares */}
        <div className="bg-white rounded-[20px] shadow-md p-6 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-8 h-8 text-black" />
            <h2 className="text-2xl font-semibold text-black">Recent Shares</h2>
          </div>
          <div className="w-full h-[2px] bg-black mb-6"></div>

          <div className="flex flex-col gap-4">
            <div className="w-full h-[70px] rounded-[20px] border border-black bg-[#FFFCFC] shadow-md flex items-center px-6 gap-4">
              <Folder className="w-8 h-8 text-black" />
              <span className="text-xl font-medium text-black">Project Plan Shared with Marvie, John</span>
            </div>
            
            <div className="w-full h-[70px] rounded-[20px] border border-black bg-[#FFFCFC] shadow-md flex items-center px-6 gap-4">
              <FileSignature className="w-8 h-8 text-black" />
              <span className="text-xl font-medium text-black">Contract File Shared with Registrar Office</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Notifications */}
      <div className="w-[408px] shrink-0 bg-white rounded-[10px] shadow-md p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-8 h-8 text-black fill-current" />
          <h2 className="text-2xl font-semibold text-black">Notifications</h2>
        </div>
        <div className="w-full h-[2px] bg-black mb-6"></div>

        <div className="flex flex-col gap-4">
          <div className="w-full min-h-[66px] rounded-[20px] border border-black bg-white shadow-md flex items-center px-4 py-2 gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-8 h-8 text-black shrink-0" />
            <span className="text-xl font-medium text-black flex-1">New Comment on Report</span>
            <span className="text-2xl text-black">›</span>
          </div>

          <div className="w-full min-h-[66px] rounded-[20px] border border-black bg-white shadow-md flex items-center px-4 py-2 gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <Share2 className="w-8 h-8 text-black shrink-0" />
            <span className="text-xl font-medium text-black flex-1">File Shared with you</span>
            <span className="text-2xl text-black">›</span>
          </div>

          <div className="w-full min-h-[66px] rounded-[20px] border border-black bg-white shadow-md flex items-center px-4 py-2 gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-black">!</span>
            </div>
            <span className="text-xl font-medium text-black flex-1">Reminder: Review Due Date</span>
            <span className="text-2xl text-black">›</span>
          </div>
        </div>
      </div>
    </div>);

}