
import React, { useState } from 'react';
import { User, Plus, Calendar, Mail, Check, QrCode as QrCodeIcon, ChevronDown } from 'lucide-react';

export function QrCode() {
  const [view, setView] = useState('list');

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex flex-col relative">
      {view === 'list' &&
      <div className="bg-white rounded-[10px] shadow-md p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <User className="w-8 h-8 text-black" />
              <h2 className="text-2xl font-semibold text-black">Student Requests</h2>
            </div>
            <button
            onClick={() => setView('add')}
            className="bg-[#22A6BA] hover:bg-[#22A6BA]/90 text-white px-4 py-2 rounded-[10px] flex items-center gap-2 transition-colors">
            
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Request</span>
            </button>
          </div>
          
          <div className="w-full h-[2px] bg-black mb-6"></div>

          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 mb-4 px-4">
            <span className="font-semibold text-lg">File Request</span>
            <span className="font-semibold text-lg">Due Date</span>
            <span className="font-semibold text-lg">QR Code</span>
            <span></span>
          </div>
          <div className="w-full h-[1px] bg-black mb-4"></div>

          <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
            {/* Row 1 */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 items-center px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div>
                  <p className="font-semibold text-black">Jade Francine Atencio</p>
                  <p className="text-sm text-black underline">jadefrancineatencio@gmail.com</p>
                </div>
              </div>
              <span className="font-semibold text-sm">02/25/2026 09:39 AM</span>
              <button
              onClick={() => setView('generated')}
              className="bg-[#578FC6] hover:bg-[#578FC6]/90 text-white px-4 py-2 rounded-[10px] text-sm font-medium w-fit transition-colors">
              
                Generate QR Code
              </button>
              <div className="flex justify-end">
                 <button onClick={() => setView('scan')} className="text-sm font-bold bg-brand-teal text-white px-3 py-1 rounded hover:bg-brand-teal/90">Scan</button>
              </div>
            </div>
            <div className="w-full h-[1px] bg-black/20"></div>

            {/* Row 2 */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 items-center px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div>
                  <p className="font-semibold text-black">Althea Mae Estores</p>
                  <p className="text-sm text-black underline">altheaestores@gmail.com</p>
                </div>
              </div>
              <span className="font-semibold text-sm">02/09/2026 04:30 PM</span>
              <button className="bg-[#578FC6] hover:bg-[#578FC6]/90 text-white px-4 py-2 rounded-[10px] text-sm font-medium w-fit transition-colors">
                Generate QR Code
              </button>
              <div></div>
            </div>
            <div className="w-full h-[1px] bg-black/20"></div>

            {/* Row 3 */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 items-center px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div>
                  <p className="font-semibold text-black">Ma. Rinafe Lozano</p>
                  <p className="text-sm text-black underline">rinafelozano@gmail.com</p>
                </div>
              </div>
              <span className="font-semibold text-sm">02/01/2026 02:37 PM</span>
              <button className="bg-[#578FC6] hover:bg-[#578FC6]/90 text-white px-4 py-2 rounded-[10px] text-sm font-medium w-fit transition-colors">
                Generate QR Code
              </button>
              <div></div>
            </div>
          </div>
        </div>
      }

      {/* Add Request Modal/Overlay */}
      {view === 'add' &&
      <div className="absolute inset-0 bg-[url('./assets/cover.jpg')] flex items-center justify-center p-6 z-50 rounded-[20px]">
          <div className="bg-brand-gray w-full bg-white max-w-[792px] rounded-[20px] shadow-xl p-8 flex flex-col">
            <h2 className="text-2xl font-medium text-black mb-4">Add Request</h2>
            <div className="w-full h-[2px] bg-black mb-6"></div>

            <div className="flex flex-col gap-6 flex-1">
              <div className="flex flex-col gap-2">
                <label className="text-base text-black">Student Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-black/60" />
                  <input type="text" defaultValue="Mark Daniel Bacolod" className="w-full h-[44px] rounded-[10px] border border-black pl-12 pr-4 outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-base text-black">Student Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/60" />
                  <input type="email" defaultValue="markdaniel@gmail.com" className="w-full h-[44px] rounded-[10px] border border-black pl-12 pr-4 outline-none" />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xl text-black">Document Type</label>
                  <div className="relative">
                    <select className="w-full h-[47px] rounded-[10px] border border-black px-4 appearance-none outline-none bg-white font-medium">
                      <option>Transcript of Records</option>
                      <option>Form 137</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-black pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xl text-black">Due By</label>
                  <div className="relative">
                    <input type="text" defaultValue="02/20/2026" className="w-full h-[47px] rounded-[10px] border border-black px-4 outline-none font-medium text-xl" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 text-black/60" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xl text-black">Description</label>
                <textarea
                placeholder="Notes or additional instructions."
                className="w-full h-[105px] rounded-[10px] border border-black p-4 outline-none resize-none">
              </textarea>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
              onClick={() => setView('list')}
              className="w-[149px] h-[51px] rounded-[10px] border border-black bg-white text-xl font-light hover:bg-gray-50 transition-colors">
              
                Cancel
              </button>
              <button
              onClick={() => setView('list')}
              className="w-[207px] h-[51px] rounded-[10px] border border-black bg-[#22A6BA] text-white text-2xl hover:bg-[#22A6BA]/90 transition-colors">
              
                Add Request
              </button>
            </div>
          </div>
        </div>
      }

      {/* Generated QR Code View */}
      {view === 'generated' &&
      <div className="bg-brand-gray rounded-[10px] p-6 flex-1 flex flex-col items-center justify-center">
           <div className="w-full max-w-[533px] bg-[#279CC7] rounded-t-[10px] h-[36px] flex items-center px-4">
             <span className="text-white font-bold text-sm">Generate QR Code</span>
           </div>
           <div className="w-full max-w-[533px] bg-[#C2C0C0] rounded-b-[10px] shadow-md p-8 flex flex-col items-center">
             <div className="flex items-center gap-4 w-full mb-6">
                <div className="w-12 h-24 bg-gray-300 rounded"></div>
                <div>
                  <p className="font-semibold text-black text-lg">Jade Francine Atencio</p>
                  <p className="text-sm text-black underline">jadefrancineatencio@gmail.com</p>
                  <div className="w-full h-[1px] bg-black my-2"></div>
                  <p className="font-medium text-black">Transcript of Records</p>
                </div>
             </div>

             <div className="w-full bg-[#A2B4B6] rounded-[10px] p-4 flex flex-col items-center mb-6">
               <div className="w-full bg-[#297681] rounded-[10px] h-[45px] flex items-center justify-center gap-2 mb-2">
                 <Check className="w-6 h-6 text-white" />
                 <span className="text-white font-medium">Generate QR Code</span>
               </div>
               <p className="text-[11px] font-medium text-center">The QR Code has been generated for this Document Request.</p>
             </div>

             <button
            onClick={() => setView('list')}
            className="bg-[#207EBC] hover:bg-[#207EBC]/90 text-white px-8 py-2 rounded-[10px] text-xl font-medium shadow-md transition-colors">
            
               Print QR Code
             </button>
           </div>
        </div>
      }

      {/* Scan QR Code View */}
      {view === 'scan' &&
      <div className="bg-brand-gray rounded-[10px] p-6 flex-1 flex flex-col items-center justify-center">
           <div className="w-full max-w-[533px] bg-[#279CC7] rounded-t-[10px] h-[36px] flex items-center px-4">
             <span className="text-white font-bold text-sm">Scan QR Code</span>
           </div>
           <div className="w-full max-w-[533px] bg-[#C2C0C0] rounded-b-[10px] shadow-md p-8 flex flex-col items-center">
             <div className="w-[188px] h-[177px] bg-white rounded-lg flex items-center justify-center mb-8 shadow-inner">
               <QrCodeIcon className="w-32 h-32 text-black" />
             </div>
             
             <div className="flex flex-col items-center text-center">
                <p className="font-semibold text-black text-lg">Jade Francine Atencio</p>
                <p className="text-sm text-black underline">jadefrancineatencio@gmail.com</p>
             </div>

             <button
            onClick={() => setView('list')}
            className="mt-8 bg-brand-teal hover:bg-brand-teal/90 text-white px-8 py-2 rounded-[10px] text-lg font-medium shadow-md transition-colors">
            
               Done
             </button>
           </div>
        </div>
      }
    </div>);

}