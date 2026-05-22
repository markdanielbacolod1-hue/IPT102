import React, { useState } from 'react';
import { FileText, Users, ChevronDown, Bell, MessageSquare, Share2, Clock, Folder, FileSignature, X, Check, Send } from 'lucide-react';

const availableDocuments = [
  'Transcript Of Records',
  'COR',
  'Form 137',
  'Form 138',
  'Good Moral',
  'Grading Sheet',
  'Diploma',
];

const availableRecipients = [
  { id: 1, name: 'Marvie Santos', dept: 'HR' },
  { id: 2, name: 'John dela Cruz', dept: 'Registrar' },
  { id: 3, name: 'Anna Reyes', dept: 'Finance' },
  { id: 4, name: 'HR Department', dept: 'Department' },
  { id: 5, name: 'Registrar Office', dept: 'Department' },
  { id: 6, name: 'Finance Office', dept: 'Department' },
];

const initialShares = [
  { id: 1, icon: Folder, doc: 'Project Plan', recipients: 'Marvie, John', time: '2 hours ago', status: 'delivered' },
  { id: 2, icon: FileSignature, doc: 'Contract File', recipients: 'Registrar Office', time: '1 day ago', status: 'delivered' },
];

const initialNotifications = [
  { id: 1, icon: MessageSquare, title: 'New Comment on Report', time: '2 mins ago', read: false },
  { id: 2, icon: Share2, title: 'File Shared with you', time: '15 mins ago', read: false },
  { id: 3, icon: Bell, title: 'Reminder: Review Due Date', time: '1 hour ago', read: true },
];

export function DocumentSharing() {
  const [selectedDoc, setSelectedDoc] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [docDropdown, setDocDropdown] = useState(false);
  const [recipientDropdown, setRecipientDropdown] = useState(false);
  const [shares, setShares] = useState(initialShares);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [sendStatus, setSendStatus] = useState(null); // null | 'sending' | 'sent'

  const toggleRecipient = (person) => {
    setSelectedRecipients(prev =>
      prev.find(r => r.id === person.id)
        ? prev.filter(r => r.id !== person.id)
        : [...prev, person]
    );
  };

  const handleSend = () => {
    if (!selectedDoc || selectedRecipients.length === 0) return;
    setSendStatus('sending');
    setTimeout(() => {
      const recipientNames = selectedRecipients.map(r => r.name).join(', ');
      setShares(prev => [
        {
          id: Date.now(),
          icon: FileText,
          doc: selectedDoc,
          recipients: recipientNames,
          time: 'Just now',
          status: 'delivered',
        },
        ...prev,
      ]);
      setNotifications(prev => [
        {
          id: Date.now(),
          icon: Share2,
          title: `${selectedDoc} shared with ${recipientNames}`,
          time: 'Just now',
          read: false,
        },
        ...prev,
      ]);
      setSendStatus('sent');
      setTimeout(() => {
        setSendStatus(null);
        setSelectedDoc('');
        setSelectedRecipients([]);
      }, 1500);
    }, 1000);
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6">
      {/* Left Column */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Share Documents */}
        <div className="bg-white rounded-[20px] shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-black" />
            <h2 className="text-2xl font-semibold text-black">Share Documents</h2>
          </div>
          <div className="w-full h-[2px] bg-black mb-6"></div>

          <div className="flex flex-col gap-6">
            {/* Document Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xl font-medium text-black">Select Document</label>
              <div className="relative">
                <div
                  onClick={() => { setDocDropdown(!docDropdown); setRecipientDropdown(false); }}
                  className="w-full h-[70px] rounded-[20px] border border-black bg-[#FFFCFC] shadow-md flex items-center px-6 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-8 h-8 text-black mr-4" />
                  <span className={`text-lg ${selectedDoc ? 'text-black font-medium' : 'text-black/50'}`}>
                    {selectedDoc || 'Select...'}
                  </span>
                </div>
                <ChevronDown className={`absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-black transition-transform ${docDropdown ? 'rotate-180' : ''}`} />
                {docDropdown && (
                  <div className="absolute top-full left-0 right-0 z-20 bg-white border border-black rounded-[10px] shadow-xl mt-1 overflow-hidden">
                    {availableDocuments.map(doc => (
                      <div
                        key={doc}
                        onClick={() => { setSelectedDoc(doc); setDocDropdown(false); }}
                        className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedDoc === doc ? 'bg-[#118592]/10 font-medium' : ''}`}
                      >
                        <FileText className="w-5 h-5 text-[#118592]" />
                        <span>{doc}</span>
                        {selectedDoc === doc && <Check className="w-4 h-4 text-[#118592] ml-auto" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recipients Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xl font-medium text-black">Share with</label>
              {selectedRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedRecipients.map(r => (
                    <span key={r.id} className="flex items-center gap-1 bg-[#118592]/10 text-[#118592] text-sm px-3 py-1 rounded-full border border-[#118592]/30">
                      {r.name}
                      <button onClick={() => toggleRecipient(r)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="relative">
                <div
                  onClick={() => { setRecipientDropdown(!recipientDropdown); setDocDropdown(false); }}
                  className="w-full h-[70px] rounded-[20px] border border-black bg-[#FFFCFC] shadow-md flex items-center px-6 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-8 h-8 text-black mr-4" />
                  <span className="text-lg text-black/50">
                    {selectedRecipients.length === 0 ? 'Select users or departments...' : `${selectedRecipients.length} selected`}
                  </span>
                </div>
                <ChevronDown className={`absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-black transition-transform ${recipientDropdown ? 'rotate-180' : ''}`} />
                {recipientDropdown && (
                  <div className="absolute top-full left-0 right-0 z-20 bg-white border border-black rounded-[10px] shadow-xl mt-1 overflow-hidden">
                    {availableRecipients.map(person => {
                      const isSelected = selectedRecipients.find(r => r.id === person.id);
                      return (
                        <div
                          key={person.id}
                          onClick={() => toggleRecipient(person)}
                          className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'bg-[#118592]/10' : ''}`}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                            {person.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-black text-sm">{person.name}</p>
                            <p className="text-xs text-gray-400">{person.dept}</p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#118592] ml-auto" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Send Button */}
            <div className="bg-gray-100 rounded-[10px] p-4 flex justify-end shadow-md">
              <button
                onClick={handleSend}
                disabled={!selectedDoc || selectedRecipients.length === 0 || sendStatus === 'sending'}
                className={`h-[44px] px-6 rounded-[10px] shadow-md text-black text-xl font-medium transition-all flex items-center gap-2 ${
                  sendStatus === 'sent'
                    ? 'bg-green-500 text-white'
                    : sendStatus === 'sending'
                    ? 'bg-gray-300 cursor-not-allowed'
                    : !selectedDoc || selectedRecipients.length === 0
                    ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                    : 'bg-[#42A5F5] hover:bg-[#42A5F5]/90 text-white'
                }`}
              >
                {sendStatus === 'sent' ? (
                  <><Check className="w-5 h-5" /> Sent!</>
                ) : sendStatus === 'sending' ? (
                  'Sending...'
                ) : (
                  <><Send className="w-5 h-5" /> Send</>
                )}
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

          <div className="flex flex-col gap-4 overflow-y-auto">
            {shares.map(share => {
              const Icon = share.icon;
              return (
                <div key={share.id} className="w-full min-h-[70px] rounded-[20px] border border-black bg-[#FFFCFC] shadow-md flex items-center px-6 gap-4">
                  <Icon className="w-8 h-8 text-black shrink-0" />
                  <div className="flex-1">
                    <span className="text-base font-medium text-black">{share.doc} shared with {share.recipients}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{share.time}</p>
                  </div>
                  <span className="text-xs text-green-500 flex items-center gap-1 shrink-0">
                    <Check className="w-3 h-3" /> {share.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column - Notifications */}
      <div className="w-[408px] shrink-0 bg-white rounded-[10px] shadow-md p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-8 h-8 text-black fill-current" />
          <h2 className="text-2xl font-semibold text-black">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-[#118592] text-white text-xs font-bold rounded-full px-2 py-0.5">{unreadCount}</span>
          )}
        </div>
        <div className="w-full h-[2px] bg-black mb-6"></div>

        <div className="flex flex-col gap-4 overflow-y-auto flex-1">
          {notifications.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-8">No notifications.</p>
          )}
          {notifications.map(notif => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`w-full min-h-[66px] rounded-[20px] border p-4 flex items-center gap-4 cursor-pointer transition-all ${
                  notif.read
                    ? 'border-black bg-white hover:bg-gray-50'
                    : 'border-[#118592]/40 bg-[#f0fafb] hover:bg-[#e6f7f8]'
                }`}
              >
                <Icon className="w-8 h-8 text-black shrink-0" />
                <div className="flex-1">
                  <span className={`font-medium text-black ${notif.read ? 'text-base' : 'text-base font-semibold'}`}>
                    {notif.title}
                  </span>
                  <p className="text-xs text-gray-400">{notif.time}</p>
                </div>
                {!notif.read && <span className="w-2 h-2 rounded-full bg-[#118592] shrink-0"></span>}
                <button
                  onClick={e => { e.stopPropagation(); dismissNotif(notif.id); }}
                  className="text-gray-300 hover:text-gray-600 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}