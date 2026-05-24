import React, { useState, useEffect } from 'react';
import { FileText, Users, ChevronDown, Bell, Share2, Clock, X, Check, Send } from 'lucide-react';

const BASE = 'http://localhost:5000/api';

function authFetch(path, options = {}) {
  const token = localStorage.getItem('token') || '';
  return fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

export function DocumentSharing() {
  const [documents,     setDocuments]     = useState([]);
  const [departments,   setDepartments]   = useState([]);
  const [recentShares,  setRecentShares]  = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedDoc,   setSelectedDoc]   = useState('');
  const [selectedDept,  setSelectedDept]  = useState('');
  const [docDropdown,   setDocDropdown]   = useState(false);
  const [deptDropdown,  setDeptDropdown]  = useState(false);
  const [sendStatus,    setSendStatus]    = useState(null);

  useEffect(() => {
    fetchDocuments();
    fetchDepartments();
    fetchRecentShares();
    fetchNotifications();
  }, []);

  async function fetchDocuments() {
    const res  = await authFetch('/sharing/documents');
    const data = await res.json();
    setDocuments(data.documents || []);
  }

  async function fetchDepartments() {
    const res  = await authFetch('/users/departments');
    const data = await res.json();
    setDepartments(data.departments || []);
  }

  async function fetchRecentShares() {
    const res  = await authFetch('/sharing/recent');
    const data = await res.json();
    setRecentShares(data.shares || []);
  }

  async function fetchNotifications() {
    const res  = await authFetch('/sharing/notifications');
    const data = await res.json();
    setNotifications(data.notifications || []);
  }

  async function handleSend() {
    if (!selectedDoc || !selectedDept) return;
    setSendStatus('sending');
    const res = await authFetch('/sharing/send', {
      method: 'POST',
      body: JSON.stringify({ document_id: selectedDoc, receiver_department: selectedDept }),
    });
    if (res.ok) {
      setSendStatus('sent');
      fetchRecentShares();
      fetchNotifications();
      setTimeout(() => { setSendStatus(null); setSelectedDoc(''); setSelectedDept(''); }, 1500);
    } else {
      setSendStatus(null);
    }
  }

  async function handleMarkRead(id) {
    await authFetch(`/sharing/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
  }

  async function handleDismiss(id) {
    await authFetch(`/sharing/notifications/${id}`, { method: 'DELETE' });
    setNotifications(prev => prev.filter(n => n.notification_id !== id));
  }

  const selectedDocName  = documents.find(d => d.document_id === selectedDoc)?.title || '';
  const selectedDeptName = departments.find(d => d.department_id === selectedDept)?.department_name || '';
  const unreadCount      = notifications.filter(n => !n.is_read).length;

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6">
      {/* Left */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-[20px] shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-black" />
            <h2 className="text-2xl font-semibold text-black">Share Documents</h2>
          </div>
          <div className="w-full h-[2px] bg-black mb-6"></div>
          <div className="flex flex-col gap-6">

            {/* Document Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xl font-medium text-black">Select Document</label>
              <div className="relative">
                <div onClick={() => { setDocDropdown(!docDropdown); setDeptDropdown(false); }}
                  className="w-full h-[70px] rounded-[20px] border border-black bg-[#FFFCFC] shadow-md flex items-center px-6 cursor-pointer hover:bg-gray-50">
                  <FileText className="w-8 h-8 text-black mr-4" />
                  <span className={`text-lg ${selectedDocName ? 'text-black font-medium' : 'text-black/50'}`}>
                    {selectedDocName || (documents.length === 0 ? 'No documents available' : 'Select...')}
                  </span>
                </div>
                <ChevronDown className={`absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-black transition-transform ${docDropdown ? 'rotate-180' : ''}`} />
                {docDropdown && documents.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-20 bg-white border border-black rounded-[10px] shadow-xl mt-1 max-h-60 overflow-y-auto">
                    {documents.map(doc => (
                      <div key={doc.document_id} onClick={() => { setSelectedDoc(doc.document_id); setDocDropdown(false); }}
                        className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-gray-50 ${selectedDoc === doc.document_id ? 'bg-[#118592]/10 font-medium' : ''}`}>
                        <FileText className="w-5 h-5 text-[#118592]" />
                        <span>{doc.title}</span>
                        {selectedDoc === doc.document_id && <Check className="w-4 h-4 text-[#118592] ml-auto" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xl font-medium text-black">Share with Department</label>
              <div className="relative">
                <div onClick={() => { setDeptDropdown(!deptDropdown); setDocDropdown(false); }}
                  className="w-full h-[70px] rounded-[20px] border border-black bg-[#FFFCFC] shadow-md flex items-center px-6 cursor-pointer hover:bg-gray-50">
                  <Users className="w-8 h-8 text-black mr-4" />
                  <span className={`text-lg ${selectedDeptName ? 'text-black font-medium' : 'text-black/50'}`}>
                    {selectedDeptName || 'Select department...'}
                  </span>
                </div>
                <ChevronDown className={`absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-black transition-transform ${deptDropdown ? 'rotate-180' : ''}`} />
                {deptDropdown && (
                  <div className="absolute top-full left-0 right-0 z-20 bg-white border border-black rounded-[10px] shadow-xl mt-1 overflow-hidden">
                    {departments.map(dept => (
                      <div key={dept.department_id} onClick={() => { setSelectedDept(dept.department_id); setDeptDropdown(false); }}
                        className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-gray-50 ${selectedDept === dept.department_id ? 'bg-[#118592]/10' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                          {dept.department_name.charAt(0)}
                        </div>
                        <span className="font-medium text-black text-sm">{dept.department_name}</span>
                        {selectedDept === dept.department_id && <Check className="w-4 h-4 text-[#118592] ml-auto" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Send Button */}
            <div className="bg-gray-100 rounded-[10px] p-4 flex justify-end shadow-md">
              <button onClick={handleSend}
                disabled={!selectedDoc || !selectedDept || sendStatus === 'sending'}
                className={`h-[44px] px-6 rounded-[10px] shadow-md text-xl font-medium flex items-center gap-2 transition-all ${
                  sendStatus === 'sent' ? 'bg-green-500 text-white'
                  : sendStatus === 'sending' ? 'bg-gray-300 cursor-not-allowed text-black'
                  : !selectedDoc || !selectedDept ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                  : 'bg-[#42A5F5] text-white hover:bg-[#42A5F5]/90'
                }`}>
                {sendStatus === 'sent' ? <><Check className="w-5 h-5" /> Sent!</>
                  : sendStatus === 'sending' ? 'Sending...'
                  : <><Send className="w-5 h-5" /> Send</>}
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
          {recentShares.length === 0
            ? <p className="text-sm text-gray-400 text-center mt-4">No shares yet.</p>
            : <div className="flex flex-col gap-4">
                {recentShares.map(share => (
                  <div key={share.share_id} className="w-full min-h-[70px] rounded-[20px] border border-black bg-[#FFFCFC] shadow-md flex items-center px-6 gap-4">
                    <Share2 className="w-8 h-8 text-black shrink-0" />
                    <div className="flex-1">
                      <span className="text-base font-medium text-black">{share.doc} → {share.recipient_dept}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(share.shared_at).toLocaleString()}</p>
                    </div>
                    <span className="text-xs text-green-500 flex items-center gap-1 shrink-0"><Check className="w-3 h-3" /> delivered</span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Right — Notifications */}
      <div className="w-[408px] shrink-0 bg-white rounded-[10px] shadow-md p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-8 h-8 text-black fill-current" />
          <h2 className="text-2xl font-semibold text-black">Notifications</h2>
          {unreadCount > 0 && <span className="bg-[#118592] text-white text-xs font-bold rounded-full px-2 py-0.5">{unreadCount}</span>}
        </div>
        <div className="w-full h-[2px] bg-black mb-6"></div>
        <div className="flex flex-col gap-4 overflow-y-auto flex-1">
          {notifications.length === 0
            ? <p className="text-sm text-gray-400 text-center mt-8">No notifications.</p>
            : notifications.map(notif => (
                <div key={notif.notification_id} onClick={() => handleMarkRead(notif.notification_id)}
                  className={`w-full min-h-[66px] rounded-[20px] border p-4 flex items-center gap-4 cursor-pointer transition-all ${
                    notif.is_read ? 'border-black bg-white hover:bg-gray-50' : 'border-[#118592]/40 bg-[#f0fafb] hover:bg-[#e6f7f8]'
                  }`}>
                  <Share2 className="w-8 h-8 text-black shrink-0" />
                  <div className="flex-1">
                    <span className={`text-black text-base ${!notif.is_read ? 'font-semibold' : 'font-medium'}`}>{notif.message}</span>
                    <p className="text-xs text-gray-400">{new Date(notif.created_at).toLocaleString()}</p>
                  </div>
                  {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#118592] shrink-0"></span>}
                  <button onClick={e => { e.stopPropagation(); handleDismiss(notif.notification_id); }} className="text-gray-300 hover:text-gray-600 shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}