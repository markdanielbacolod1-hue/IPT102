import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Share2, AlertTriangle, FileText, X, Check, Filter } from 'lucide-react';

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

// Map notification_type from DB to an icon
function getIcon(type) {
  switch (type) {
    case 'Email':         return MessageSquare;
    case 'Status Update': return AlertTriangle;
    case 'System':        return Share2;
    default:              return FileText;
  }
}

const filterOptions = ['All', 'Unread', 'Read'];

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter,  setActiveFilter]  = useState('All');
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res  = await authFetch('/sharing/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id) {
    await authFetch(`/sharing/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
  }

  async function markAllRead() {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => authFetch(`/sharing/notifications/${n.notification_id}/read`, { method: 'PATCH' })));
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
  }

  async function dismiss(id) {
    await authFetch(`/sharing/notifications/${id}`, { method: 'DELETE' });
    setNotifications(prev => prev.filter(n => n.notification_id !== id));
  }

  async function clearAll() {
    await Promise.all(notifications.map(n => authFetch(`/sharing/notifications/${n.notification_id}`, { method: 'DELETE' })));
    setNotifications([]);
  }

  const filtered = notifications.filter(n => {
    if (activeFilter === 'Unread') return !n.is_read;
    if (activeFilter === 'Read')   return  n.is_read;
    return true;
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
              <span className="bg-[#118592] text-white text-xs font-bold rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
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
        <div className="w-full h-[2px] bg-black mb-4"></div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
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
            const Icon = getIcon(notif.notification_type);
            return (
              <div
                key={notif.notification_id}
                onClick={() => markRead(notif.notification_id)}
                className={`w-full rounded-[20px] border p-4 flex items-start gap-4 cursor-pointer transition-all ${
                  notif.is_read
                    ? 'bg-white border-gray-200 hover:bg-gray-50'
                    : 'bg-[#f0fafb] border-[#118592]/30 hover:bg-[#e6f7f8] shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#118592]/10">
                  <Icon className="w-5 h-5 text-[#118592]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-black ${!notif.is_read ? 'font-semibold text-base' : 'font-normal text-sm'}`}>
                      {notif.message}
                    </p>
                    {!notif.is_read && <span className="w-2 h-2 rounded-full bg-[#118592] shrink-0"></span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); dismiss(notif.notification_id); }}
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