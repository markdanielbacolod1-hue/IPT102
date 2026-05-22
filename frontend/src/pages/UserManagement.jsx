import React, { useState, useRef } from 'react';
import {
  Edit2, User, Settings, Bell, LogOut, TrendingUp, FileText, Share2,
  QrCode, Activity, Upload, Scan, Eye, LogIn, X, Check, Save,
  Camera, AlertTriangle, ChevronRight, Mail, Building2,
  Shield, Clock, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AVATAR_URL = '';

const initialProfile = {
  name: 'Princess',
  email: 'princessyeah@gmail.com',
  role: 'Admin',
  status: 'Active',
  department: 'HR, Registrar, Finance',
  lastLogin: '2026-03-19 5PM',
  avatar: AVATAR_URL,
};

const initialSettings = {
  emailNotifications: true,
  activityAlerts: true,
  shareNotifications: false,
  twoFactor: false,
  autoLogout: true,
};

const initialNotifications = [
  { id: 1, title: 'New Comment on Report', detail: 'Maria left a comment on Q1 Report.', time: '2 mins ago', read: false },
  { id: 2, title: 'File Shared with You', detail: 'John shared "Contract_2026.pdf".', time: '15 mins ago', read: false },
  { id: 3, title: 'Reminder: Review Due Date', detail: 'Grading Sheet review due March 5.', time: '1 hour ago', read: true },
];

const initialActivity = [
  { icon: LogOut,  label: 'User Logged Out',    time: '3 mins ago' },
  { icon: Upload,  label: 'Document Uploaded',  time: '15 mins ago' },
  { icon: Scan,    label: 'QR Code Scanned',    time: '40 mins ago' },
  { icon: Eye,     label: 'Document Viewed',    time: '1 hour ago' },
  { icon: Download,label: 'File Downloaded',    time: '2 hours ago' },
  { icon: LogIn,   label: 'Login Successful',   time: '4 hours ago' },
];

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-[#118592]' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

export function UserManagement() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activePanel, setActivePanel] = useState(null); // 'profile' | 'settings' | 'notifications' | 'logout'
  const [profile, setProfile] = useState(initialProfile);
  const [editProfile, setEditProfile] = useState(initialProfile);
  const [settings, setSettings] = useState(initialSettings);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activity, setActivity] = useState(initialActivity);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved'

  const unreadCount = notifications.filter(n => !n.read).length;

  const openPanel = (panel) => {
    setActivePanel(prev => prev === panel ? null : panel);
    if (panel === 'profile') setEditProfile({ ...profile });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile(p => ({ ...p, avatar: url }));
    setEditProfile(p => ({ ...p, avatar: url }));
    pushActivity(Camera, 'Profile Photo Updated');
  };

  const handleSaveProfile = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setProfile({ ...editProfile });
      setSaveStatus('saved');
      pushActivity(Save, 'Profile Updated');
      setTimeout(() => setSaveStatus(null), 1500);
    }, 800);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    pushActivity(Settings, `Setting "${key}" toggled`);
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismissNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  const pushActivity = (icon, label) => {
    setActivity(prev => [{ icon, label, time: 'Just now' }, ...prev]);
  };

  const handleLogout = () => {
    pushActivity(LogOut, 'User Logged Out');
    navigate('/login');
  };

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6 overflow-hidden">

      {/* ── LEFT COLUMN ── */}
      <div className="w-[313px] shrink-0 flex flex-col gap-6 overflow-y-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-[81px] h-[81px] rounded-full bg-gray-200 overflow-hidden">
              <img src={profile.avatar || AVATAR_URL} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white hover:bg-[#118592] transition-colors"
              title="Change photo"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <h2 className="text-[15px] font-medium text-black">{profile.name}</h2>
          <p className="text-[10px] text-black underline mb-6">{profile.email}</p>

          <div className="w-full flex flex-col gap-1">
            {[
              { icon: User,    label: 'My Profile',    key: 'profile' },
              { icon: Settings, label: 'Settings',     key: 'settings' },
              { icon: Bell,    label: 'Notification',  key: 'notifications', badge: unreadCount },
              { icon: LogOut,  label: 'Logout',        key: 'logout', danger: true },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activePanel === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => openPanel(item.key)}
                  className={`flex items-center gap-4 w-full text-left px-2 py-2.5 rounded-[8px] transition-colors group ${
                    isActive
                      ? 'bg-[#118592]/10 text-[#118592]'
                      : item.danger
                      ? 'hover:bg-red-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#118592]' : item.danger ? 'text-red-500' : 'text-black'}`} />
                  <span className={`text-sm flex-1 ${isActive ? 'font-semibold text-[#118592]' : item.danger ? 'text-red-500' : 'text-black'}`}>
                    {item.label}
                  </span>
                  {item.badge > 0 && (
                    <span className="bg-[#118592] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{item.badge}</span>
                  )}
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-[#118592]' : 'text-black group-hover:translate-x-0.5'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-[10px] shadow-md overflow-hidden flex-1">
          <div className="h-[43px] bg-[#B6C6C5] flex items-center px-4 gap-2">
            <TrendingUp className="w-[30px] h-[30px] text-black" />
            <span className="text-[11px] font-semibold text-black">Statistics</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {[
              { bg: '#498562', icon: FileText, value: 234, label: 'Documents Uploaded' },
              { bg: '#2A1467', icon: Share2,   value: 154, label: 'Documents Shared' },
              { bg: '#7A8834', icon: QrCode,   value: 34,  label: 'QR Codes Generated' },
              { bg: '#7D2424', icon: User,     value: 302, label: 'Total Logins' },
            ].map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-[5px] p-3 flex items-center gap-3 text-white" style={{ backgroundColor: stat.bg }}>
                  <Icon className="w-7 h-7" />
                  <div className="leading-tight">
                    <span className="text-[15px] font-bold block">{stat.value}</span>
                    <span className="text-[12px]">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMNS ── */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">

        {/* ── PANEL: MY PROFILE ── */}
        {activePanel === 'profile' && (
          <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-black" />
                <h3 className="text-xl font-semibold text-black">Edit Profile</h3>
              </div>
              <button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-[2px] bg-black"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={editProfile.name}
                    onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))}
                    className="w-full h-[42px] rounded-[8px] border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-[#118592]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={editProfile.email}
                    onChange={e => setEditProfile(p => ({ ...p, email: e.target.value }))}
                    className="w-full h-[42px] rounded-[8px] border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-[#118592]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={editProfile.role}
                    onChange={e => setEditProfile(p => ({ ...p, role: e.target.value }))}
                    className="w-full h-[42px] rounded-[8px] border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-[#118592] bg-white appearance-none"
                  >
                    <option>Admin</option>
                    <option>Staff</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Status</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={editProfile.status}
                    onChange={e => setEditProfile(p => ({ ...p, status: e.target.value }))}
                    className="w-full h-[42px] rounded-[8px] border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-[#118592] bg-white appearance-none"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Departments</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={editProfile.department}
                    onChange={e => setEditProfile(p => ({ ...p, department: e.target.value }))}
                    className="w-full h-[42px] rounded-[8px] border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-[#118592]"
                    placeholder="e.g. HR, Registrar, Finance"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setActivePanel(null)} className="px-5 py-2 rounded-[8px] border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saveStatus === 'saving'}
                className={`px-6 py-2 rounded-[8px] text-white text-sm font-medium transition-all flex items-center gap-2 ${
                  saveStatus === 'saved' ? 'bg-green-500' : 'bg-[#118592] hover:bg-[#118592]/90'
                }`}
              >
                {saveStatus === 'saved' ? <><Check className="w-4 h-4" /> Saved!</> :
                 saveStatus === 'saving' ? 'Saving...' :
                 <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </div>
        )}

        {/* ── PANEL: SETTINGS ── */}
        {activePanel === 'settings' && (
          <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-black" />
                <h3 className="text-xl font-semibold text-black">Settings</h3>
              </div>
              <button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-[2px] bg-black"></div>

            <div className="flex flex-col gap-0 divide-y divide-gray-100">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', detail: 'Receive updates via email.' },
                { key: 'activityAlerts',     label: 'Activity Alerts',     detail: 'Get notified about account activity.' },
                { key: 'shareNotifications', label: 'Share Notifications', detail: 'Notify when a document is shared with you.' },
                { key: 'twoFactor',          label: 'Two-Factor Authentication', detail: 'Add extra security to your account.' },
                { key: 'autoLogout',         label: 'Auto Logout',         detail: 'Automatically log out after 30 minutes of inactivity.' },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-black">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.detail}</p>
                  </div>
                  <Toggle enabled={settings[s.key]} onToggle={() => toggleSetting(s.key)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PANEL: NOTIFICATIONS ── */}
        {activePanel === 'notifications' && (
          <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-black" />
                <h3 className="text-xl font-semibold text-black">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-[#118592] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{unreadCount}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={markAllRead} className="text-xs text-[#118592] hover:underline">Mark all read</button>
                <button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="w-full h-[2px] bg-black"></div>

            {notifications.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No notifications.</p>
            )}
            {notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-3 rounded-[10px] border cursor-pointer transition-colors ${
                  n.read ? 'border-gray-100 bg-white hover:bg-gray-50' : 'border-[#118592]/30 bg-[#f0fafb] hover:bg-[#e6f7f8]'
                }`}
                onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
              >
                <Bell className={`w-5 h-5 mt-0.5 shrink-0 ${n.read ? 'text-gray-300' : 'text-[#118592]'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? 'font-normal text-gray-600' : 'font-semibold text-black'}`}>{n.title}</p>
                  <p className="text-xs text-gray-400">{n.detail}</p>
                  <p className="text-[10px] text-gray-300 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{n.time}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); dismissNotif(n.id); }} className="text-gray-200 hover:text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── PANEL: LOGOUT CONFIRM ── */}
        {activePanel === 'logout' && (
          <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col items-center gap-4">
            <AlertTriangle className="w-12 h-12 text-red-400" />
            <h3 className="text-xl font-semibold text-black">Confirm Logout</h3>
            <p className="text-sm text-gray-500 text-center">Are you sure you want to log out? Any unsaved changes will be lost.</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setActivePanel(null)}
                className="px-6 py-2 rounded-[8px] border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-[8px] bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Yes, Logout
              </button>
            </div>
          </div>
        )}

        {/* ── PROFILE DETAILS (always shown when no panel, or below panel) ── */}
        {activePanel === null && (
          <div className="bg-white rounded-[10px] shadow-md p-8 relative">
            <div className="absolute top-8 right-8">
              <span className={`text-[10px] font-medium px-2 py-1 rounded ${
                profile.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {profile.role.toUpperCase()} · {profile.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-start gap-8">
              <div className="w-[100px] h-[100px] rounded-full bg-gray-200 overflow-hidden shrink-0">
                <img src={profile.avatar || AVATAR_URL} alt="Profile Large" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-xl font-semibold text-black">{profile.name}</p>
                <p className="text-sm text-[#118592] underline">{profile.email}</p>
                <div className="flex gap-8 text-sm text-black">
                  <span>Role: <strong>{profile.role}</strong></span>
                  <span>Status: <strong className={profile.status === 'Active' ? 'text-green-600' : 'text-gray-400'}>{profile.status}</strong></span>
                </div>
                <p className="text-sm text-black">Last Login: {profile.lastLogin}</p>
                <p className="text-sm text-black">Departments: {profile.department}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVITY LOG (always visible) ── */}
        <div className="bg-white rounded-[10px] shadow-md p-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-black" />
              <h3 className="text-2xl font-medium text-black">Activity Log</h3>
            </div>
            <span className="text-xs text-gray-400">{activity.length} entries</span>
          </div>

          <div className="flex flex-col overflow-y-auto flex-1">
            {activity.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center justify-between py-3 border-t border-black/10 first:border-t-0 hover:bg-gray-50 px-2 rounded transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-sm text-black">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}