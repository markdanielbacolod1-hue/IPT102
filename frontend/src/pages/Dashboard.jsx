import React, { useEffect, useState } from 'react';
import { Users, FileText, Share2, QrCode } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#118592', '#D9D9D9'];

export function Dashboard() {
  const [stats,      setStats]      = useState(null);
  const [uploads,    setUploads]    = useState([]);
  const [deptData,   setDeptData]   = useState([]);
  const [userStatus, setUserStatus] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    try {
      const token = localStorage.getItem('token') || '';

      const response = await fetch('http://localhost:5000/api/dashboard', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      setStats(data.stats);
      setUploads(data.uploadsPerMonth  || []);
      setDeptData(data.documentsByDept || []);
      setUserStatus([
        { name: 'Active',   value: Number(data.stats?.activeUsers)   || 0 },
        { name: 'Inactive', value: Number(data.stats?.inactiveUsers) || 0 },
      ]);
    } catch (err) {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6 overflow-auto h-full">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard icon={Users}    label="Total Users"      value={stats?.totalUsers      ?? '—'} color="#768040" />
        <StatCard icon={FileText} label="Total Documents"  value={stats?.totalDocuments  ?? '—'} color="#408055" />
        <StatCard icon={Share2}   label="Shared Documents" value={stats?.sharedDocuments ?? '—'} color="#406480" />
        <StatCard icon={QrCode}   label="QR Scans"         value={stats?.qrScans         ?? '—'} color="#6B4080" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <ChartCard title="Document Uploads">
          <LineChart data={uploads}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#118592" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Documents by Department">
          <BarChart data={deptData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#62C7D2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="User Status">
          <PieChart>
            <Pie data={userStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
              {userStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard title="Recent Activity Overview">
          <LineChart data={uploads}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#C65050" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-[10px] shadow-md relative overflow-hidden h-[112px] flex flex-col justify-center px-6">
      <div className="flex items-center gap-4">
        <Icon className="w-7 h-7 text-black" />
        <div>
          <p className="text-lg text-[#131312]">{label}</p>
          <p className="text-[21px] font-medium text-[#111111]">{value}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[8px]" style={{ background: color }}></div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-[10px] shadow-md p-4">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}