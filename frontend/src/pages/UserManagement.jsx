import React, { useState, useEffect, useRef } from 'react';
import {
  Edit2, User, Settings, Bell, LogOut, Activity,
  Upload, Scan, Eye, LogIn, X, Save, Camera,
  AlertTriangle, ChevronRight, Clock, Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserManagement() {
  const navigate    = useNavigate();
  const fileInputRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [activity, setActivity]       = useState([]);
  const [activePanel, setActivePanel] = useState(null);
  const [editForm, setEditForm]       = useState({});
  const [saveStatus, setSaveStatus]   = useState(null);
  const [loading, setLoading]         = useState(true);

  // Load logged-in user on mount
  useEffect(() => {
    fetchCurrentUser();
    fetchActivityLog();
  }, []);

  async function fetchCurrentUser() {
    try {
      const res  = await fetch('http://localhost:5000/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      setCurrentUser(data.user);
      setEditForm(data.user);
    } catch (err) {
      console.error('Failed to load user:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchActivityLog() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) return;
      const res  = await fetch(`http://localhost:5000/api/users/${user.id}/activity`, { credentials: 'include' });
      const data = await res.json();
      setActivity(data.logs || []);
    } catch (err) {
      console.error('Failed to load activity:', err);
    }
  }

  async function handleSaveProfile() {
    setSaveStatus('saving');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res  = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ full_name: editForm.full_name, email: editForm.email }),
      });

      if (res.ok) {
        setSaveStatus('saved');
        fetchCurrentUser();
        setTimeout(() => setSaveStatus(null), 1500);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogout() {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('user');
    navigate('/login');
  }

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6 overflow-hidden">

      {/* Left: Profile Card */}
      <div className="w-[313px] shrink-0 flex flex-col gap-6 overflow-y-auto">
        <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col items-center">

          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-[81px] h-[81px] rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <h2 className="text-[15px] font-medium text-black">{currentUser?.full_name}</h2>
          <p className="text-[10px] text-black underline mb-6">{currentUser?.email}</p>

          {/* Menu */}
          {[
            { icon: User,    label: 'My Profile', key: 'profile' },
            { icon: LogOut,  label: 'Logout',     key: 'logout',  danger: true },
          ].map(item => {
            const Icon     = item.icon;
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
                <span className={`text-sm flex-1 ${isActive ? 'text-[#118592] font-semibold' : item.danger ? 'text-red-500' : 'text-black'}`}>
                  {item.label}
                </span>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'rotate-90 text-[#118592]' : 'text-black'}`} />
              </button>
            );
          })}
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-[10px] shadow-md p-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-black" />
            <h3 className="text-2xl font-medium text-black">Activity Log</h3>
          </div>

          <div className="flex flex-col overflow-y-auto flex-1">
            {activity.length === 0 && (
              <p className="text-sm text-gray-400 text-center mt-4">No activity yet.</p>
            )}
            {activity.map((item) => (
              <div key={item.log_id} className="flex items-center justify-between py-3 border-t border-black/10 first:border-t-0 px-2">
                <span className="text-sm text-black">{item.activity}</span>
                <span className="text-[10px] text-gray-400 shrink-0">
                  {new Date(item.activity_time).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Active Panel */}
      <div className="flex-1 flex flex-col gap-6">

        {/* Edit Profile Panel */}
        {activePanel === 'profile' && (
          <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-black" />
                <h3 className="text-xl font-semibold text-black">My Profile</h3>
              </div>
              <button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-[2px] bg-black"></div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-black">Full Name</label>
                <input
                  type="text"
                  value={editForm.full_name || ''}
                  onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
                  className="w-full mt-1 border border-gray-300 rounded-[8px] px-4 py-2 text-sm outline-none focus:border-[#118592]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-black">Email</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full mt-1 border border-gray-300 rounded-[8px] px-4 py-2 text-sm outline-none focus:border-[#118592]"
                />
              </div>
              <div className="text-sm text-gray-400">
                Role: <strong>{currentUser?.role_name}</strong> &nbsp;|&nbsp;
                Department: <strong>{currentUser?.department_name || '—'}</strong>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="self-end px-6 py-2 bg-[#118592] text-white rounded-[8px] text-sm font-medium hover:bg-[#118592]/90 transition-colors"
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Logout Confirm Panel */}
        {activePanel === 'logout' && (
          <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col items-center gap-4">
            <AlertTriangle className="w-12 h-12 text-red-400" />
            <h3 className="text-xl font-semibold text-black">Confirm Logout</h3>
            <p className="text-sm text-gray-500 text-center">Are you sure you want to log out?</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setActivePanel(null)}
                className="px-6 py-2 rounded-[8px] border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-[8px] bg-red-500 text-white text-sm font-medium hover:bg-red-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Yes, Logout
              </button>
            </div>
          </div>
        )}

        {/* Default view when no panel open */}
        {activePanel === null && currentUser && (
          <div className="bg-white rounded-[10px] shadow-md p-8">
            <div className="flex items-start gap-8">
              <div className="w-[100px] h-[100px] rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <User className="w-14 h-14 text-gray-400" />
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-xl font-semibold text-black">{currentUser.full_name}</p>
                <p className="text-sm text-[#118592] underline">{currentUser.email}</p>
                <div className="flex gap-8 text-sm text-black">
                  <span>Role: <strong>{currentUser.role_name}</strong></span>
                  <span>Status: <strong className={currentUser.status === 'Active' ? 'text-green-600' : 'text-gray-400'}>{currentUser.status}</strong></span>
                </div>
                <p className="text-sm text-black">Department: {currentUser.department_name || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}