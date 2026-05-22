import React, { useState } from 'react';
import { User, Plus, Calendar, Mail, Check, QrCode as QrCodeIcon, ChevronDown, ArrowLeft, MapPin, Clock, CheckCircle2, Circle, Scan } from 'lucide-react';

const initialRequests = [
  {
    id: 1,
    name: 'Jade Francine Atencio',
    email: 'jadefrancineatencio@gmail.com',
    dueDate: '02/25/2026 09:39 AM',
    document: 'Transcript of Records',
    qrGenerated: true,
    tracking: [
      { label: 'Request Submitted', detail: 'Student submitted document request.', time: '02/20/2026 08:00 AM', done: true },
      { label: 'QR Code Generated', detail: 'Admin generated a QR code for this request.', time: '02/21/2026 10:15 AM', done: true },
      { label: 'QR Code Scanned', detail: 'Document scanned at Registrar Office.', time: '02/23/2026 02:30 PM', done: true },
      { label: 'Document Processing', detail: 'Document is being prepared.', time: '02/24/2026 09:00 AM', done: false },
      { label: 'Ready for Release', detail: 'Document ready for student pick-up.', time: '--', done: false },
    ],
  },
  {
    id: 2,
    name: 'Althea Mae Estores',
    email: 'altheaestores@gmail.com',
    dueDate: '02/09/2026 04:30 PM',
    document: 'Form 137',
    qrGenerated: false,
    tracking: [
      { label: 'Request Submitted', detail: 'Student submitted document request.', time: '02/05/2026 11:00 AM', done: true },
      { label: 'QR Code Generated', detail: 'Pending QR generation.', time: '--', done: false },
      { label: 'QR Code Scanned', detail: '--', time: '--', done: false },
      { label: 'Document Processing', detail: '--', time: '--', done: false },
      { label: 'Ready for Release', detail: '--', time: '--', done: false },
    ],
  },
  {
    id: 3,
    name: 'Ma. Rinafe Lozano',
    email: 'rinafelozano@gmail.com',
    dueDate: '02/01/2026 02:37 PM',
    document: 'Good Moral Certificate',
    qrGenerated: false,
    tracking: [
      { label: 'Request Submitted', detail: 'Student submitted document request.', time: '01/28/2026 03:45 PM', done: true },
      { label: 'QR Code Generated', detail: 'Pending QR generation.', time: '--', done: false },
      { label: 'QR Code Scanned', detail: '--', time: '--', done: false },
      { label: 'Document Processing', detail: '--', time: '--', done: false },
      { label: 'Ready for Release', detail: '--', time: '--', done: false },
    ],
  },
];

export function QrCode() {
  const [view, setView] = useState('list');
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [trackingTarget, setTrackingTarget] = useState(null);

  const generateQR = (id) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      return {
        ...r,
        qrGenerated: true,
        tracking: r.tracking.map(t =>
          t.label === 'QR Code Generated'
            ? { ...t, done: true, time: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) }
            : t
        ),
      };
    }));
    setSelectedRequest(requests.find(r => r.id === id));
    setView('generated');
  };

  const openTracking = (req) => {
    setTrackingTarget(req);
    setView('tracking');
  };

  const openScan = (req) => {
    setSelectedRequest(req);
    setView('scan');
  };

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex flex-col relative">

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="bg-white rounded-[10px] shadow-md p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <User className="w-8 h-8 text-black" />
              <h2 className="text-2xl font-semibold text-black">Student Requests</h2>
            </div>
            <button
              onClick={() => setView('add')}
              className="bg-[#22A6BA] hover:bg-[#22A6BA]/90 text-white px-4 py-2 rounded-[10px] flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Request</span>
            </button>
          </div>
          <div className="w-full h-[2px] bg-black mb-6"></div>

          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 mb-4 px-4">
            <span className="font-semibold text-lg">File Request</span>
            <span className="font-semibold text-lg">Due Date</span>
            <span className="font-semibold text-lg">QR Code</span>
            <span className="font-semibold text-lg">Tracking</span>
            <span></span>
          </div>
          <div className="w-full h-[1px] bg-black mb-4"></div>

          <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
            {requests.map((req) => (
              <React.Fragment key={req.id}>
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 items-center px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold text-sm">
                      {req.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-black">{req.name}</p>
                      <p className="text-sm text-black underline">{req.email}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">{req.dueDate}</span>
                  <button
                    onClick={() => generateQR(req.id)}
                    className={`${req.qrGenerated ? 'bg-green-500 hover:bg-green-600' : 'bg-[#578FC6] hover:bg-[#578FC6]/90'} text-white px-4 py-2 rounded-[10px] text-sm font-medium w-fit transition-colors flex items-center gap-1`}
                  >
                    {req.qrGenerated ? <><Check className="w-3 h-3" /> Generated</> : 'Generate QR'}
                  </button>
                  <button
                    onClick={() => openTracking(req)}
                    className="text-sm font-bold bg-[#2090A4] text-white px-3 py-1 rounded hover:bg-[#2090A4]/90 w-fit"
                  >
                    Track
                  </button>
                  <div className="flex justify-end">
                    {req.qrGenerated && (
                      <button
                        onClick={() => openScan(req)}
                        className="text-sm font-bold bg-[#118592] text-white px-3 py-1 rounded hover:bg-[#118592]/90"
                      >
                        Scan
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full h-[1px] bg-black/20"></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* TRACKING VIEW */}
      {view === 'tracking' && trackingTarget && (
        <div className="bg-white rounded-[10px] shadow-md p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setView('list')} className="flex items-center gap-1 text-[#118592] hover:underline text-sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-2xl font-semibold text-black">QR Tracking</h2>
          </div>
          <div className="w-full h-[2px] bg-black mb-6"></div>

          <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-[10px]">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-lg text-gray-600">
              {trackingTarget.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-black text-lg">{trackingTarget.name}</p>
              <p className="text-sm text-gray-500">{trackingTarget.document}</p>
              <p className="text-xs text-[#118592] underline">{trackingTarget.email}</p>
            </div>
          </div>

          <div className="relative flex flex-col gap-0 flex-1">
            {trackingTarget.tracking.map((step, i) => {
              const isLast = i === trackingTarget.tracking.length - 1;
              return (
                <div key={i} className="flex gap-6 relative">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className={`absolute left-[19px] top-8 w-[2px] h-full ${step.done ? 'bg-[#118592]' : 'bg-gray-200'}`} />
                  )}
                  {/* Dot */}
                  <div className="shrink-0 mt-1">
                    {step.done ? (
                      <CheckCircle2 className="w-10 h-10 text-[#118592]" />
                    ) : (
                      <Circle className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-8 flex-1 ${!step.done ? 'opacity-40' : ''}`}>
                    <p className="font-semibold text-black text-base">{step.label}</p>
                    <p className="text-sm text-gray-500">{step.detail}</p>
                    {step.time !== '--' && (
                      <p className="text-xs text-[#118592] flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {step.time}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD REQUEST */}
      {view === 'add' && (
        <div className="absolute inset-0 bg-[url('./assets/cover.jpg')] flex items-center justify-center p-6 z-50 rounded-[20px]">
          <div className="bg-white w-full max-w-[792px] rounded-[20px] shadow-xl p-8 flex flex-col">
            <h2 className="text-2xl font-medium text-black mb-4">Add Request</h2>
            <div className="w-full h-[2px] bg-black mb-6"></div>

            <div className="flex flex-col gap-6 flex-1">
              <div className="flex flex-col gap-2">
                <label className="text-base text-black">Student Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-black/60" />
                  <input type="text" placeholder="Enter student name" className="w-full h-[44px] rounded-[10px] border border-black pl-12 pr-4 outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-base text-black">Student Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/60" />
                  <input type="email" placeholder="email@example.com" className="w-full h-[44px] rounded-[10px] border border-black pl-12 pr-4 outline-none" />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xl text-black">Document Type</label>
                  <div className="relative">
                    <select className="w-full h-[47px] rounded-[10px] border border-black px-4 appearance-none outline-none bg-white font-medium">
                      <option>Transcript of Records</option>
                      <option>Form 137</option>
                      <option>Form 138</option>
                      <option>Good Moral Certificate</option>
                      <option>Diploma</option>
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
                <textarea placeholder="Notes or additional instructions." className="w-full h-[105px] rounded-[10px] border border-black p-4 outline-none resize-none"></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setView('list')} className="w-[149px] h-[51px] rounded-[10px] border border-black bg-white text-xl font-light hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => setView('list')} className="w-[207px] h-[51px] rounded-[10px] border border-black bg-[#22A6BA] text-white text-2xl hover:bg-[#22A6BA]/90 transition-colors">
                Add Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATED QR */}
      {view === 'generated' && selectedRequest && (
        <div className="bg-gray-100 rounded-[10px] p-6 flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-[533px] bg-[#279CC7] rounded-t-[10px] h-[36px] flex items-center px-4">
            <span className="text-white font-bold text-sm">Generate QR Code</span>
          </div>
          <div className="w-full max-w-[533px] bg-[#C2C0C0] rounded-b-[10px] shadow-md p-8 flex flex-col items-center">
            <div className="flex items-center gap-4 w-full mb-6">
              <div className="w-12 h-24 bg-gray-300 rounded flex items-center justify-center font-bold text-gray-600">
                {selectedRequest.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-black text-lg">{selectedRequest.name}</p>
                <p className="text-sm text-black underline">{selectedRequest.email}</p>
                <div className="w-full h-[1px] bg-black my-2"></div>
                <p className="font-medium text-black">{selectedRequest.document}</p>
              </div>
            </div>

            <div className="w-full bg-[#A2B4B6] rounded-[10px] p-4 flex flex-col items-center mb-6">
              <div className="w-full bg-[#297681] rounded-[10px] h-[45px] flex items-center justify-center gap-2 mb-2">
                <Check className="w-6 h-6 text-white" />
                <span className="text-white font-medium">QR Code Generated Successfully</span>
              </div>
              <p className="text-[11px] font-medium text-center">The QR Code has been generated for this Document Request.</p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setView('list')} className="bg-[#207EBC] hover:bg-[#207EBC]/90 text-white px-8 py-2 rounded-[10px] text-xl font-medium shadow-md transition-colors">
                Print QR Code
              </button>
              <button onClick={() => setView('list')} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-[10px] text-xl font-medium shadow-md transition-colors">
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCAN VIEW */}
      {view === 'scan' && selectedRequest && (
        <div className="bg-gray-100 rounded-[10px] p-6 flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-[533px] bg-[#279CC7] rounded-t-[10px] h-[36px] flex items-center px-4">
            <span className="text-white font-bold text-sm">Scan QR Code</span>
          </div>
          <div className="w-full max-w-[533px] bg-[#C2C0C0] rounded-b-[10px] shadow-md p-8 flex flex-col items-center">
            <div className="w-[188px] h-[177px] bg-white rounded-lg flex items-center justify-center mb-8 shadow-inner">
              <QrCodeIcon className="w-32 h-32 text-black" />
            </div>
            <div className="flex flex-col items-center text-center">
              <p className="font-semibold text-black text-lg">{selectedRequest.name}</p>
              <p className="text-sm text-black underline">{selectedRequest.email}</p>
              <p className="text-sm text-black mt-1">{selectedRequest.document}</p>
            </div>
            <button
              onClick={() => setView('list')}
              className="mt-8 bg-[#118592] hover:bg-[#118592]/90 text-white px-8 py-2 rounded-[10px] text-lg font-medium shadow-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
