import React, { useEffect, useState } from 'react';
import { Users, FileText, Share2, QrCode } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#118592', '#D9D9D9'];

export function Dashboard() {
  const [stats, setStats]         = useState(null);
  const [uploadsData, setUploads] = useState([]);
  const [deptData, setDeptData]   = useState([]);
  const [userStatus, setUserStatus] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const res = await fetch('http://localhost:5000/api/dashboard', {
        credentials: 'include',
      });
      const data = await res.json();

      setStats(data.stats);
      setUploads(data.uploadsPerMonth || []);
      setDeptData(data.documentsByDept || []);
      setUserStatus([
        { name: 'Active',   value: data.stats?.activeUsers   || 0 },
        { name: 'Inactive', value: data.stats?.inactiveUsers || 0 },
      ]);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] bg-left bg-cover flex flex-col gap-6 h-full">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard icon={Users}    label="Total Users"      value={stats?.totalUsers      ?? '—'} color="#768040" />
        <StatCard icon={FileText} label="Total Documents"  value={stats?.totalDocuments  ?? '—'} color="#408055" />
        <StatCard icon={Share2}   label="Shared Documents" value={stats?.sharedDocuments ?? '—'} color="#406480" />
        <StatCard icon={QrCode}   label="QR Scans"         value={stats?.qrScans         ?? '—'} color="#6B4080" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        <ChartCard title="Document Uploads">
          <LineChart data={uploadsData}>
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
            <Pie data={userStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {userStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard title="Recent Activity Overview">
          <LineChart data={uploadsData}>
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

// Small reusable stat card
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-[10px] shadow-md relative overflow-hidden h-[112px] flex flex-col justify-center px-6">
      <div className="flex items-center gap-4">
        <Icon className="w-7 h-7 text-black" />
        <div>
          <p className="text-lg font-instrument text-[#131312]">{label}</p>
          <p className="text-[21px] font-medium font-instrument text-[#111111]">{value}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[8px]" style={{ background: color }}></div>
    </div>
  );
}

// Small reusable chart wrapper
function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-[10px] shadow-md p-4 flex flex-col">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="flex-1 min-h-0" style={{ minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}