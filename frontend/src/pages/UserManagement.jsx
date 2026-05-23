import React, { useState, useRef, useEffect } from 'react';
import {
  Edit2, User, Settings, Bell, LogOut, Activity,
  Upload, Eye, LogIn, X, Check, Save, Camera,
  AlertTriangle, ChevronRight, Clock, Download, Scan,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserManagement() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activePanel, setActivePanel] = useState(null);
  const [profile, setProfile]         = useState(null);
  const [editProfile, setEditProfile] = useState({});
  const [activity, setActivity]       = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings]       = useState({
    emailNotifications: true,
    activityAlerts: true,
    shareNotifications: false,
    twoFactor: false,
    autoLogout: true,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchActivity();
    fetchNotifications();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        setEditProfile(data.user);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/me/activity`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setActivity(data.data);
    } catch (err) {
      console.error('Failed to load activity:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setNotifications(data.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${profile.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ full_name: editProfile.full_name, email: editProfile.email }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(prev => ({ ...prev, full_name: editProfile.full_name, email: editProfile.email }));
        setActivePanel(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
    navigate('/login');
  };

  const markNotifRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PATCH', credentials: 'include' });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return <div className="p-6 h-full flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6 overflow-hidden">
      {/* Left: Profile Card */}
      <div className="w-[313px] shrink-0 flex flex-col gap-6 overflow-y-auto">
        <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-[81px] h-[81px] rounded-full bg-gray-200 overflow-hidden">
              {profile?.avatar
                ? <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500">
                    {profile?.full_name?.charAt(0) ?? '?'}
                  </div>
              }
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white hover:bg-[#118592]"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          </div>

          <h2 className="text-[15px] font-medium text-black">{profile?.full_name}</h2>
          <p className="text-[10px] text-black underline mb-6">{profile?.email}</p>

          <div className="w-full flex flex-col gap-1">
            {[
              { icon: User,    label: 'My Profile',   key: 'profile' },
              { icon: Settings, label: 'Settings',    key: 'settings' },
              { icon: Bell,    label: 'Notification', key: 'notifications', badge: unreadCount },
              { icon: LogOut,  label: 'Logout',       key: 'logout', danger: true },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activePanel === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActivePanel(prev => prev === item.key ? null : item.key)}
                  className={`flex items-center gap-4 w-full text-left px-2 py-2.5 rounded-[8px] transition-colors ${
                    isActive ? 'bg-[#118592]/10' : item.danger ? 'hover:bg-red-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#118592]' : item.danger ? 'text-red-500' : 'text-black'}`} />
                  <span className={`text-sm flex-1 ${isActive ? 'font-semibold text-[#118592]' : item.danger ? 'text-red-500' : 'text-black'}`}>
                    {item.label}
                  </span>
                  {item.badge > 0 && (
                    <span className="bg-[#118592] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{item.badge}</span>
                  )}
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-[#118592]' : 'text-black'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-[10px] shadow-md p-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-black" />
              <h3 className="text-2xl font-medium text-black">Activity Log</h3>
            </div>
            <span className="text-xs text-gray-400">{activity.length} entries</span>
          </div>
          <div className="flex flex-col overflow-y-auto flex-1">
            {activity.length === 0 && <p className="text-sm text-gray-400 text-center mt-4">No activity yet.</p>}
            {activity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-t border-black/10 first:border-t-0 hover:bg-gray-50 px-2 rounded">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <LogIn className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm text-black">{item.activity}</span>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">
                  {new Date(item.activity_time).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Active Panel */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-6">

        {/* Edit Profile */}
        {activePanel === 'profile' && (
          <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-black" />
                <h3 className="text-xl font-semibold">My Profile</h3>
              </div>
              <button onClick={() => setActivePanel(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="w-full h-[2px] bg-black" />

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={editProfile.full_name || ''}
                  onChange={e => setEditProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-[8px] px-4 py-2 text-sm outline-none focus:border-[#118592]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                <input
                  type="email"
                  value={editProfile.email || ''}
                  onChange={e => setEditProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-[8px] px-4 py-2 text-sm outline-none focus:border-[#118592]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{profile?.role_name}</span>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">{profile?.status}</span>
                {profile?.department_name && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{profile.department_name}</span>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#118592] text-white rounded-[8px] text-sm font-medium hover:bg-[#118592]/90 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        {activePanel === 'settings' && (
          <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-black" />
                <h3 className="text-xl font-semibold">Settings</h3>
              </div>
              <button onClick={() => setActivePanel(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="w-full h-[2px] bg-black" />

            {[
              { key: 'emailNotifications', label: 'Email Notifications',       detail: 'Receive updates via email.' },
              { key: 'activityAlerts',     label: 'Activity Alerts',           detail: 'Get notified about account activity.' },
              { key: 'shareNotifications', label: 'Share Notifications',       detail: 'Notify when a document is shared with you.' },
              { key: 'twoFactor',          label: 'Two-Factor Authentication', detail: 'Add extra security to your account.' },
              { key: 'autoLogout',         label: 'Auto Logout',               detail: 'Log out after 30 mins of inactivity.' },
            ].map(s => (
              <div key={s.key} className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-black">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.detail}</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, [s.key]: !prev[s.key] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settings[s.key] ? 'bg-[#118592]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[s.key] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Notifications */}
        {activePanel === 'notifications' && (
          <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-black" />
                <h3 className="text-xl font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-[#118592] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{unreadCount}</span>
                )}
              </div>
              <button onClick={() => setActivePanel(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="w-full h-[2px] bg-black" />

            {notifications.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No notifications.</p>}
            {notifications.map(n => (
              <div
                key={n.notification_id}
                onClick={() => markNotifRead(n.notification_id)}
                className={`flex items-start gap-3 p-3 rounded-[10px] border cursor-pointer ${
                  n.is_read ? 'border-gray-100 bg-white' : 'border-[#118592]/30 bg-[#f0fafb]'
                }`}
              >
                <Bell className={`w-5 h-5 mt-0.5 shrink-0 ${n.is_read ? 'text-gray-300' : 'text-[#118592]'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${n.is_read ? 'text-gray-600' : 'font-semibold text-black'}`}>{n.message}</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logout Confirm */}
        {activePanel === 'logout' && (
          <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col items-center gap-4">
            <AlertTriangle className="w-12 h-12 text-red-400" />
            <h3 className="text-xl font-semibold text-black">Confirm Logout</h3>
            <p className="text-sm text-gray-500 text-center">Are you sure you want to log out?</p>
            <div className="flex gap-4 mt-2">
              <button onClick={() => setActivePanel(null)} className="px-6 py-2 rounded-[8px] border border-gray-300 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleLogout} className="px-6 py-2 rounded-[8px] bg-red-500 text-white text-sm font-medium hover:bg-red-600 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Yes, Logout
              </button>
            </div>
          </div>
        )}

        {/* Profile Detail (shown when no panel is open) */}
        {activePanel === null && (
          <div className="bg-white rounded-[10px] shadow-md p-8 relative">
            <div className="absolute top-8 right-8">
              <span className="text-[10px] font-medium px-2 py-1 rounded bg-green-100 text-green-700">
                {profile?.role_name?.toUpperCase()} · {profile?.status?.toUpperCase()}
              </span>
            </div>
            <div className="flex items-start gap-8">
              <div className="w-[100px] h-[100px] rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-4xl font-bold text-gray-500">
                {profile?.full_name?.charAt(0) ?? '?'}
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-xl font-semibold text-black">{profile?.full_name}</p>
                <p className="text-sm text-[#118592] underline">{profile?.email}</p>
                <p className="text-sm text-black">Department: <strong>{profile?.department_name ?? '—'}</strong></p>
                <p className="text-sm text-black">
                  Member since: <strong>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</strong>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}