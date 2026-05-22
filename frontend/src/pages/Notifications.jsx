import React, { useState } from 'react';
import { Bell, MessageSquare, Share2, AlertTriangle, CheckCircle2, FileText, X, Check, Filter } from 'lucide-react';

const initialNotifications = [
  { id: 1, type: 'comment', icon: MessageSquare, title: 'New Comment on Report', detail: 'Maria left a comment on Q1 Financial Report.', time: '2 mins ago', read: false, color: '#578FC6' },
  { id: 2, type: 'share', icon: Share2, title: 'File Shared with You', detail: 'John shared "Contract_2026.pdf" with you.', time: '15 mins ago', read: false, color: '#118592' },
  { id: 3, type: 'reminder', icon: AlertTriangle, title: 'Reminder: Review Due Date', detail: 'Grading Sheet review is due by March 5, 2026.', time: '1 hour ago', read: false, color: '#E07B39' },
  { id: 4, type: 'upload', icon: FileText, title: 'Document Upload Complete', detail: 'Diploma.pdf was uploaded successfully.', time: '2 hours ago', read: true, color: '#498562' },
  { id: 5, type: 'share', icon: Share2, title: 'New Document Shared', detail: '"Project Plan" was shared with Marvie, John.', time: '3 hours ago', read: true, color: '#118592' },
  { id: 6, type: 'comment', icon: MessageSquare, title: 'Reply on Form 137', detail: 'Admin replied to your query on Form 137.', time: 'Yesterday', read: true, color: '#578FC6' },
];

const filterOptions = ['All', 'Unread', 'Comment', 'Share', 'Reminder', 'Upload'];

export function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState('All');

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => setNotifications([]);

  const filtered = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.read;
    return n.type === activeFilter.toLowerCase();
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6">
      <div className="flex-1 bg-white rounded-[10px] shadow-md p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-7 h-7 text-black fill-current" />
            <h2 className="text-2xl font-semibold text-black">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-[#118592] text-white text-xs font-bold rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={markAllRead}
              className="text-sm text-[#118592] hover:underline flex items-center gap-1"
            >
              <Check className="w-4 h-4" /> Mark all read
            </button>
            <button
              onClick={clearAll}
              className="text-sm text-red-400 hover:underline flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Clear all
            </button>
          </div>
        </div>
        <div className="w-full h-[2px] bg-black mb-4"></div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeFilter === f
                  ? 'bg-[#118592] text-white border-[#118592]'
                  : 'bg-white text-black border-gray-300 hover:border-[#118592] hover:text-[#118592]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex flex-col gap-3 overflow-y-auto flex-1">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-300 gap-3">
              <Bell className="w-16 h-16" />
              <p className="text-lg">No notifications here</p>
            </div>
          )}
          {filtered.map(notif => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`w-full rounded-[20px] border p-4 flex items-start gap-4 cursor-pointer transition-all ${
                  notif.read
                    ? 'bg-white border-gray-200 hover:bg-gray-50'
                    : 'bg-[#f0fafb] border-[#118592]/30 hover:bg-[#e6f7f8] shadow-sm'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: notif.color + '22' }}
                >
                  <Icon className="w-5 h-5" style={{ color: notif.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-black ${!notif.read ? 'text-base' : 'text-sm'}`}>
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#118592] shrink-0"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{notif.detail}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); dismiss(notif.id); }}
                  className="text-gray-300 hover:text-gray-600 shrink-0 mt-0.5"
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
