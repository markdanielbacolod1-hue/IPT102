import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Share2, AlertTriangle, FileText, X, Check } from 'lucide-react';

const ICON_MAP = {
  comment:  MessageSquare,
  share:    Share2,
  reminder: AlertTriangle,
  upload:   FileText,
};

const filterOptions = ['All', 'Unread', 'comment', 'share', 'reminder', 'upload'];

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter]   = useState('All');
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setNotifications(data.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PATCH', credentials: 'include' });
  };

  const dismiss = async (id) => {
    setNotifications(prev => prev.filter(n => n.notification_id !== id));
    await fetch(`http://localhost:5000/api/notifications/${id}`, { method: 'DELETE', credentials: 'include' });
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await fetch('http://localhost:5000/api/notifications/read-all', { method: 'PATCH', credentials: 'include' });
  };

  const clearAll = async () => {
    setNotifications([]);
    await fetch('http://localhost:5000/api/notifications', { method: 'DELETE', credentials: 'include' });
  };

  const filtered = notifications.filter(n => {
    if (activeFilter === 'All')    return true;
    if (activeFilter === 'Unread') return !n.is_read;
    return n.notification_type?.toLowerCase() === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6">
      <div className="flex-1 bg-white rounded-[10px] shadow-md p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bell className="w-7 h-7 text-black fill-current" />
            <h2 className="text-2xl font-semibold text-black">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-[#118592] text-white text-xs font-bold rounded-full px-2 py-0.5">{unreadCount}</span>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={markAllRead} className="text-sm text-[#118592] hover:underline flex items-center gap-1">
              <Check className="w-4 h-4" /> Mark all read
            </button>
            <button onClick={clearAll} className="text-sm text-red-400 hover:underline flex items-center gap-1">
              <X className="w-4 h-4" /> Clear all
            </button>
          </div>
        </div>
        <div className="w-full h-[2px] bg-black mb-4" />

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${
                activeFilter === f
                  ? 'bg-[#118592] text-white border-[#118592]'
                  : 'bg-white text-black border-gray-300 hover:border-[#118592] hover:text-[#118592]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-3 overflow-y-auto flex-1">
          {loading && <p className="text-sm text-gray-400 text-center mt-8">Loading...</p>}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-300 gap-3">
              <Bell className="w-16 h-16" />
              <p className="text-lg">No notifications here</p>
            </div>
          )}

          {filtered.map(notif => {
            const Icon = ICON_MAP[notif.notification_type?.toLowerCase()] ?? Bell;
            return (
              <div
                key={notif.notification_id}
                onClick={() => markRead(notif.notification_id)}
                className={`w-full rounded-[20px] border p-4 flex items-start gap-4 cursor-pointer transition-all ${
                  notif.is_read
                    ? 'bg-white border-gray-200 hover:bg-gray-50'
                    : 'bg-[#f0fafb] border-[#118592]/30 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#118592]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#118592]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-black ${notif.is_read ? 'text-sm' : 'text-base'}`}>
                      {notif.message}
                    </p>
                    {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#118592] shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); dismiss(notif.notification_id); }}
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