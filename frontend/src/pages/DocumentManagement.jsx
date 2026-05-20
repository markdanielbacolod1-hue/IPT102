
import React from 'react';
import { FileText, Search, ChevronDown, Home, Upload, Clock, RefreshCw, BookmarkPlus, Edit3, Eye } from 'lucide-react';

const documents = [
{ name: 'Transcript Of Records', date: '01/19/26', time: '02:23 pm' },
{ name: 'COR', date: '01/31/26', time: '03:02 pm' },
{ name: 'Form 137', date: '02/09/26', time: '09:46 am' },
{ name: 'Form 137', date: '02/29/26', time: '09:46 am' },
{ name: 'Form 138', date: '03/03/26', time: '04:34 pm' },
{ name: 'Good Moral', date: '02/13/26', time: '04:34 pm' },
{ name: 'Grading Sheet', date: '03/01/26', time: '01:20 pm' },
{ name: 'Diploma', date: '03/01/26', time: '01:20 pm' }];


export function DocumentManagement() {
  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6">
      {/* Left Column - Document Library */}
      <div className="flex-1 bg-white rounded-[10px] shadow-md p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-7 h-7 text-black" />
          <h2 className="text-2xl font-semibold text-black">Document Library</h2>
        </div>
        <div className="w-full h-[2px] bg-black mb-4"></div>

        <div className="bg-brand-gray rounded-[5px] p-4 flex-1 flex flex-col shadow-inner">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-black" />
              <span className="text-sm font-medium">Files</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-[235px] h-[30px] rounded-full px-4 pl-10 text-sm outline-none" />
              
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="flex flex-col flex-1">
            {documents.map((doc, index) =>
            <div key={index} className="flex items-center justify-between py-3 border-b border-black/20 last:border-0 hover:bg-black/5 transition-colors px-2 rounded">
                <div className="flex items-center gap-3 w-1/2">
                  <div className="w-8 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                    <FileText className="w-4 h-4 text-brand-teal" />
                  </div>
                  <span className="text-sm font-medium text-black">{doc.name}</span>
                </div>
                <div className="flex items-center justify-between w-1/2">
                  <span className="text-sm text-black">{doc.date}</span>
                  <span className="text-sm text-black">{doc.time}</span>
                  <button className="p-1 hover:bg-black/10 rounded">
                    <ChevronDown className="w-5 h-5 text-black" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Upload & Activity */}
      <div className="w-[319px] shrink-0 flex flex-col gap-6">
        {/* Upload Document */}
        <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col items-center relative">
          <div className="absolute top-4 left-4">
            <Home className="w-8 h-8 text-black/60" />
          </div>
          <h3 className="text-xl font-semibold text-[#26808A] mb-6 mt-2">Upload Document</h3>
          
          <div className="w-[209px] h-[98px] bg-brand-gray rounded-[40px] shadow-inner flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-brand-gray/80 transition-colors border-2 border-dashed border-transparent hover:border-[#26808A]">
            <Upload className="w-8 h-8 text-black" />
            <span className="text-sm font-medium text-black">Drag & Drop</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[10px] shadow-md p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-black" />
            <h3 className="text-lg font-medium text-[#0D3682]">Recent Activity</h3>
          </div>
          <div className="w-full h-[1px] bg-black mb-4"></div>

          <div className="bg-brand-gray rounded-t-[10px] p-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-black" />
            <span className="text-lg font-medium text-black">Latest Updates</span>
          </div>
          
          <div className="bg-white rounded-b-[10px] shadow-inner p-4 flex flex-col gap-4 flex-1 border border-t-0 border-gray-200">
            <div className="flex items-start gap-3 border-b border-black/10 pb-3">
              <RefreshCw className="w-5 h-5 text-black mt-1" />
              <div>
                <p className="text-sm font-medium text-black">File Updated</p>
                <p className="text-[10px] font-light text-black">the file has been changed.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 border-b border-black/10 pb-3">
              <BookmarkPlus className="w-5 h-5 text-black mt-1" />
              <div>
                <p className="text-sm font-medium text-black">New Document Added</p>
                <p className="text-[10px] font-light text-black">the file has been changed.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-b border-black/10 pb-3">
              <Edit3 className="w-5 h-5 text-black mt-1" />
              <div>
                <p className="text-sm font-medium text-black">Document Rename</p>
                <p className="text-[10px] font-light text-black">file name updated.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-black mt-1" />
              <div>
                <p className="text-sm font-medium text-black">Document Viewed</p>
                <p className="text-[10px] font-light text-black">file opened.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}