
import React from 'react';
import { Users, FileText, Share2, QrCode } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell } from
'recharts';

const lineData = [
{ name: 'Jan', value: 400 },
{ name: 'Feb', value: 300 },
{ name: 'Mar', value: 600 },
{ name: 'Apr', value: 800 },
{ name: 'May', value: 500 },
{ name: 'Jun', value: 900 }];


const barData = [
{ name: 'HR', value: 40 },
{ name: 'Registrar', value: 80 },
{ name: 'Finance', value: 20 },
{ name: 'Admin', value: 50 }];


const pieData = [
{ name: 'Active', value: 400 },
{ name: 'Inactive', value: 100 }];

const COLORS = ['#118592', '#D9D9D9'];

export function Dashboard() {
  return (
    <div className="p-6 bg-[url('./assets/cover.jpg')] bg-left bg-cover flex flex-col gap-6 h-full">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-[10px] shadow-md relative overflow-hidden h-[112px] flex flex-col justify-center px-6">
          <div className="flex items-center gap-4">
            <Users className="w-7 h-7 text-black" />
            <div>
              <p className="text-lg font-instrument text-[#131312]">Total User</p>
              <p className="text-[21px] font-medium font-instrument text-[#111111]">57</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[8px] bg-[#768040]"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[10px] shadow-md relative overflow-hidden h-[112px] flex flex-col justify-center px-6">
          <div className="flex items-center gap-4">
            <FileText className="w-7 h-7 text-black" />
            <div>
              <p className="text-lg font-instrument text-black">Total Documents</p>
              <p className="text-[21px] font-medium font-instrument text-[#111010]">1,435</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[8px] bg-[#408055]"></div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[10px] shadow-md relative overflow-hidden h-[112px] flex flex-col justify-center px-6">
          <div className="flex items-center gap-4">
            <Share2 className="w-7 h-7 text-black" />
            <div>
              <p className="text-lg font-instrument text-black">Shared Documents</p>
              <p className="text-[21px] font-medium font-instrument text-[#181717]">85</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[8px] bg-[#406480]"></div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-[10px] shadow-md relative overflow-hidden h-[112px] flex flex-col justify-center px-6">
          <div className="flex items-center gap-4">
            <QrCode className="w-7 h-7 text-black" />
            <div>
              <p className="text-lg font-instrument text-black">QR Scan</p>
              <p className="text-[21px] font-medium font-instrument text-[#111010]">256</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[8px] bg-[#6B4080]"></div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="bg-white rounded-[10px] shadow-md p-4 flex flex-col">
          <h3 className="text-lg font-medium mb-4">Document Uploads</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#118592" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[10px] shadow-md p-4 flex flex-col">
          <h3 className="text-lg font-medium mb-4">Documents by Department</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#62C7D2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[10px]  shadow-md p-4 flex flex-col">
          <h3 className="text-lg font-medium mb-4">User Status</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value">
                  
                  {pieData.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[10px] shadow-md p-4 flex flex-col">
          <h3 className="text-lg font-medium mb-4">Recent Activity Overview</h3>
          <div className="flex-1 min-h-0">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#C65050" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>);

}