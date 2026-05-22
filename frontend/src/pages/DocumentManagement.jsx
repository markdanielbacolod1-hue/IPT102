import React, { useState, useRef } from 'react';
import { FileText, Search, ChevronDown, Home, Upload, Clock, RefreshCw, BookmarkPlus, Edit3, Eye, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const initialDocuments = [
  { id: 1, name: 'Transcript Of Records', date: '01/19/26', time: '02:23 pm', size: '1.2 MB', status: 'active' },
  { id: 2, name: 'COR', date: '01/31/26', time: '03:02 pm', size: '0.8 MB', status: 'active' },
  { id: 3, name: 'Form 137', date: '02/09/26', time: '09:46 am', size: '2.1 MB', status: 'active' },
  { id: 4, name: 'Form 137', date: '02/29/26', time: '09:46 am', size: '2.1 MB', status: 'active' },
  { id: 5, name: 'Form 138', date: '03/03/26', time: '04:34 pm', size: '1.5 MB', status: 'active' },
  { id: 6, name: 'Good Moral', date: '02/13/26', time: '04:34 pm', size: '0.6 MB', status: 'active' },
  { id: 7, name: 'Grading Sheet', date: '03/01/26', time: '01:20 pm', size: '3.2 MB', status: 'active' },
  { id: 8, name: 'Diploma', date: '03/01/26', time: '01:20 pm', size: '4.0 MB', status: 'active' },
];

const activityLog = [
  { icon: RefreshCw, label: 'File Updated', detail: 'Form 137 was modified.', time: '2 mins ago' },
  { icon: BookmarkPlus, label: 'New Document Added', detail: 'Diploma uploaded successfully.', time: '15 mins ago' },
  { icon: Edit3, label: 'Document Renamed', detail: 'File name updated.', time: '1 hour ago' },
  { icon: Eye, label: 'Document Viewed', detail: 'COR was opened.', time: '2 hours ago' },
];

export function DocumentManagement() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [activity, setActivity] = useState(activityLog);
  const [openDropdown, setOpenDropdown] = useState(null);
  const fileInputRef = useRef(null);

  const filtered = documents.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const simulateUpload = (files) => {
    const newItems = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      status: 'uploading', // uploading | done | error
      progress: 0,
    }));
    setUploadQueue(prev => [...prev, ...newItems]);

    newItems.forEach((item) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadQueue(prev =>
            prev.map(q => q.id === item.id ? { ...q, status: 'done', progress: 100 } : q)
          );
          const now = new Date();
          const dateStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${String(now.getFullYear()).slice(2)}`;
          const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase();
          setDocuments(prev => [
            {
              id: Date.now(),
              name: item.name.replace(/\.[^.]+$/, ''),
              date: dateStr,
              time: timeStr,
              size: item.size,
              status: 'active',
            },
            ...prev,
          ]);
          setActivity(prev => [
            { icon: BookmarkPlus, label: 'New Document Added', detail: `${item.name} uploaded.`, time: 'Just now' },
            ...prev,
          ]);
        } else {
          setUploadQueue(prev =>
            prev.map(q => q.id === item.id ? { ...q, progress: Math.round(progress) } : q)
          );
        }
      }, 200);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) simulateUpload(e.target.files);
  };

  const removeFromQueue = (id) => setUploadQueue(prev => prev.filter(q => q.id !== id));

  const handleView = (doc) => {
    alert(`Viewing ${doc.name}`);
    setOpenDropdown(null);
  };

  const handleRename = (doc) => {
    const newName = prompt("Enter new document name:", doc.name);

    if (newName && newName.trim()) {
      setDocuments(prev =>
        prev.map(d =>
          d.id === doc.id ? { ...d, name: newName } : d
        )
      );

      setActivity(prev => [
        {
          icon: Edit3,
          label: 'Document Renamed',
          detail: `${doc.name} renamed to ${newName}.`,
          time: 'Just now',
        },
        ...prev,
      ]);
    }

    setOpenDropdown(null);
  };

  const handleDelete = (doc) => {
    const confirmDelete = window.confirm(`Delete ${doc.name}?`);

    if (confirmDelete) {
      setDocuments(prev => prev.filter(d => d.id !== doc.id));

      setActivity(prev => [
        {
          icon: AlertCircle,
          label: 'Document Deleted',
          detail: `${doc.name} was removed.`,
          time: 'Just now',
        },
        ...prev,
      ]);
    }

    setOpenDropdown(null);
  };

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] h-full flex gap-6">
      {/* Left Column */}
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
            {filtered.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-3 border-b border-black/20 last:border-0 hover:bg-black/5 transition-colors px-2 rounded">
                <div className="flex items-center gap-3 w-1/2">
                  <div className="w-8 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                    <FileText className="w-4 h-4 text-[#118592]" />
                  </div>
                  <span className="text-sm font-medium text-black">{doc.name}</span>
                </div>
                <div className="flex items-center justify-between w-1/2">
                  <span className="text-sm text-black">{doc.date}</span>
                  <span className="text-sm text-black">{doc.time}</span>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === doc.id ? null : doc.id)
                      }
                      className="p-1 hover:bg-black/10 rounded"
                    >
                      <ChevronDown
                        className={`w-5 h-5 text-black transition-transform ${
                          openDropdown === doc.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {openDropdown === doc.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => handleView(doc)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleRename(doc)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Rename
                        </button>

                        <button
                          onClick={() => handleDelete(doc)}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-[319px] shrink-0 flex flex-col gap-6">
        {/* Upload Zone */}
        <div className="bg-white rounded-[10px] shadow-md p-6 flex flex-col items-center relative">
          <div className="absolute top-4 left-4">
            <Home className="w-8 h-8 text-black/60" />
          </div>
          <h3 className="text-xl font-semibold text-[#26808A] mb-4 mt-2">Upload Document</h3>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`w-full rounded-[20px] shadow-inner flex flex-col items-center justify-center gap-2 cursor-pointer transition-all border-2 border-dashed py-6 ${
              isDragging
                ? 'border-[#26808A] bg-[#26808A]/10'
                : 'border-gray-300 bg-gray-100 hover:border-[#26808A] hover:bg-[#26808A]/5'
            }`}
          >
            <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-[#26808A]' : 'text-black'}`} />
            <span className="text-sm font-medium text-black">Drag & Drop</span>
            <span className="text-xs text-gray-400">or click to browse</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Upload Queue */}
          {uploadQueue.length > 0 && (
            <div className="w-full mt-4 flex flex-col gap-2">
              {uploadQueue.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-[8px] p-2 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-black truncate max-w-[180px]">{item.name}</span>
                    {item.status === 'done' ? (
                      <button onClick={() => removeFromQueue(item.id)}>
                        <X className="w-3 h-3 text-gray-400 hover:text-black" />
                      </button>
                    ) : (
                      <Loader2 className="w-3 h-3 text-[#26808A] animate-spin" />
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${item.status === 'done' ? 'bg-green-500' : 'bg-[#26808A]'}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400">{item.size}</span>
                    {item.status === 'done' ? (
                      <span className="text-[10px] text-green-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#26808A]">{item.progress}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
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
            {activity.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-start gap-3 border-b border-black/10 pb-3 last:border-0">
                  <Icon className="w-5 h-5 text-black mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">{act.label}</p>
                    <p className="text-[10px] font-light text-black">{act.detail}</p>
                  </div>
                  <span className="text-[9px] text-gray-400 shrink-0">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
