import React, { useState, useRef, useEffect } from 'react';
import { FileText, Search, ChevronDown, Home, Upload, Clock, RefreshCw, BookmarkPlus, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token') || '';
}

function authFetch(path, options = {}) {
  return fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
}

function authUpload(path, formData) {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData,
  });
}

export function DocumentManagement() {
  const [documents,    setDocuments]    = useState([]);
  const [activity,     setActivity]     = useState([]);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [isDragging,   setIsDragging]   = useState(false);
  const [uploadQueue,  setUploadQueue]  = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
    fetchActivity();
  }, []);

  async function fetchDocuments() {
    try {
      const res  = await authFetch('/documents');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  }

  async function fetchActivity() {
    try {
      const res  = await authFetch('/documents/activity');
      const data = await res.json();
      setActivity(data.activity || []);
    } catch (err) {
      console.error('Failed to load activity:', err);
    }
  }

  async function uploadFile(file, queueId) {
    const formData = new FormData();
    formData.append('file',  file);
    formData.append('title', file.name.replace(/\.[^.]+$/, ''));

    try {
      const res = await authUpload('/documents/upload', formData);
      if (res.ok) {
        setUploadQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: 'done', progress: 100 } : q));
        fetchDocuments();
        fetchActivity();
      } else {
        setUploadQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: 'error', progress: 100 } : q));
      }
    } catch (err) {
      setUploadQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: 'error' } : q));
    }
  }

  function handleFiles(files) {
    const items = Array.from(files).map((file, i) => ({
      id: Date.now() + i, name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      status: 'uploading', progress: 0, file,
    }));
    setUploadQueue(prev => [...prev, ...items]);

    items.forEach(item => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 10;
        if (progress >= 90) {
          clearInterval(interval);
          setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: 90 } : q));
          uploadFile(item.file, item.id);
        } else {
          setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: Math.round(progress) } : q));
        }
      }, 150);
    });
  }

  async function handleRename(doc) {
    const newName = prompt('Enter new document name:', doc.title);
    if (!newName?.trim()) return;
    await authFetch(`/documents/${doc.document_id}/rename`, {
      method: 'PUT',
      body: JSON.stringify({ title: newName.trim() }),
    });
    fetchDocuments();
    setOpenDropdown(null);
  }

  async function handleDelete(doc) {
    if (!window.confirm(`Delete "${doc.title}"?`)) return;
    await authFetch(`/documents/${doc.document_id}`, { method: 'DELETE' });
    fetchDocuments();
    setOpenDropdown(null);
  }

  const filtered = documents.filter(d =>
    d.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6">
      {/* Left — Document Library */}
      <div className="flex-1 bg-white rounded-[10px] shadow-md p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-7 h-7 text-black" />
          <h2 className="text-2xl font-semibold text-black">Document Library</h2>
        </div>
        <div className="w-full h-[2px] bg-black mb-4"></div>

        <div className="bg-gray-100 rounded-[5px] p-4 flex-1 flex flex-col shadow-inner">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-black" />
              <span className="text-sm font-medium">Files ({filtered.length})</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-[235px] h-[30px] rounded-full px-4 pl-10 text-sm outline-none border border-gray-200"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center mt-8">No documents found.</p>
            )}
            {filtered.map(doc => {
              const date    = new Date(doc.created_at);
              const dateStr = `${String(date.getMonth()+1).padStart(2,'0')}/${String(date.getDate()).padStart(2,'0')}/${String(date.getFullYear()).slice(2)}`;
              const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase();
              return (
                <div key={doc.document_id} className="flex items-center justify-between py-3 border-b border-black/20 last:border-0 hover:bg-black/5 px-2 rounded">
                  <div className="flex items-center gap-3 w-1/2">
                    <div className="w-8 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                      <FileText className="w-4 h-4 text-[#118592]" />
                    </div>
                    <span className="text-sm font-medium text-black">{doc.title}</span>
                  </div>
                  <div className="flex items-center justify-between w-1/2">
                    <span className="text-sm text-black">{dateStr}</span>
                    <span className="text-sm text-black">{timeStr}</span>
                    <div className="relative">
                      <button onClick={() => setOpenDropdown(openDropdown === doc.document_id ? null : doc.document_id)} className="p-1 hover:bg-black/10 rounded">
                        <ChevronDown className={`w-5 h-5 text-black transition-transform ${openDropdown === doc.document_id ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === doc.document_id && (
                        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                          <button onClick={() => { alert(`File: ${doc.file_name || doc.title}`); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">View</button>
                          <button onClick={() => handleRename(doc)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Rename</button>
                          <button onClick={() => handleDelete(doc)} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right — Upload + Activity */}
      <div className="w-[319px] shrink-0 flex flex-col gap-6">
        <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col items-center relative">
          <div className="absolute top-4 left-4"><Home className="w-8 h-8 text-black/60" /></div>
          <h3 className="text-xl font-semibold text-[#26808A] mb-4 mt-2">Upload Document</h3>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
            className={`w-full rounded-[20px] shadow-inner flex flex-col items-center justify-center gap-2 cursor-pointer transition-all border-2 border-dashed py-6 ${
              isDragging ? 'border-[#26808A] bg-[#26808A]/10' : 'border-gray-300 bg-gray-100 hover:border-[#26808A]'
            }`}
          >
            <Upload className={`w-8 h-8 ${isDragging ? 'text-[#26808A]' : 'text-black'}`} />
            <span className="text-sm font-medium text-black">Drag & Drop</span>
            <span className="text-xs text-gray-400">or click to browse</span>
          </div>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => { if (e.target.files.length) handleFiles(e.target.files); }} />

          {uploadQueue.length > 0 && (
            <div className="w-full mt-4 flex flex-col gap-2">
              {uploadQueue.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-[8px] p-2 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-black truncate max-w-[180px]">{item.name}</span>
                    {item.status === 'done' || item.status === 'error'
                      ? <button onClick={() => setUploadQueue(prev => prev.filter(q => q.id !== item.id))}><X className="w-3 h-3 text-gray-400" /></button>
                      : <Loader2 className="w-3 h-3 text-[#26808A] animate-spin" />}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${item.status === 'done' ? 'bg-green-500' : item.status === 'error' ? 'bg-red-400' : 'bg-[#26808A]'}`} style={{ width: `${item.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400">{item.size}</span>
                    {item.status === 'done'
                      ? <span className="text-[10px] text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>
                      : item.status === 'error'
                      ? <span className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Failed</span>
                      : <span className="text-[10px] text-[#26808A]">{item.progress}%</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-[10px] shadow-md p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-black" />
            <h3 className="text-lg font-medium text-[#0D3682]">Recent Activity</h3>
          </div>
          <div className="w-full h-[1px] bg-black mb-4"></div>
          <div className="bg-gray-100 rounded-t-[10px] p-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-black" />
            <span className="text-lg font-medium text-black">Latest Updates</span>
          </div>
          <div className="bg-white rounded-b-[10px] shadow-inner p-4 flex flex-col gap-4 flex-1 border border-t-0 border-gray-200 overflow-y-auto">
            {activity.length === 0 && <p className="text-xs text-gray-400 text-center mt-4">No recent activity.</p>}
            {activity.map((act, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-black/10 pb-3 last:border-0">
                <BookmarkPlus className="w-5 h-5 text-black mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">{act.activity}</p>
                  <p className="text-[10px] text-black">{act.full_name}</p>
                </div>
                <span className="text-[9px] text-gray-400 shrink-0">
                  {new Date(act.activity_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}