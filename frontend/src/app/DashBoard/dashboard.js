"use client";

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from 'recharts';

export default function VMSDashboard() {
  const [summary, setSummary] = useState({ high: 0, medium: 0, low: 0, info: 0 });
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Fetch initial vulnerability data
    fetchVulnerabilitySummary();
  }, []);

  const fetchVulnerabilitySummary = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/scans/summary`);
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Failed to fetch vulnerability summary:', error);
    }
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/scans/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'localhost' }) // Default target
      });

      if (response.ok) {
        // Refresh data after scan
        setTimeout(fetchVulnerabilitySummary, 2000);
      }
    } catch (error) {
      console.error('Failed to start scan:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const pieData = [
    { name: 'High', value: summary.high },
    { name: 'Medium', value: summary.medium },
    { name: 'Low', value: summary.low },
    { name: 'Info', value: summary.info },
  ];

  const COLORS = ['#FF5555', '#FFB86B', '#9AA6FF', '#80CBC4'];

  const barData = [
    { date: '2024-01', detected: 12, patched: 5 },
    { date: '2024-02', detected: 10, patched: 6 },
    { date: '2024-03', detected: 8, patched: 7 },
    { date: '2024-04', detected: 14, patched: 10 },
    { date: '2024-05', detected: 9, patched: 8 },
  ];

  const lineData = [
    { month: 'Jan', avgRisk: 8.2 },
    { month: 'Feb', avgRisk: 7.5 },
    { month: 'Mar', avgRisk: 6.8 },
    { month: 'Apr', avgRisk: 5.9 },
    { month: 'May', avgRisk: 5.2 },
  ];

  return (
    <div className="min-h-screen bg-[#071021] text-slate-200 p-8 font-sans">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Vulnerability Management System (VMS)</h1>
        <button
          onClick={handleStartScan}
          disabled={isScanning}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow hover:opacity-90 font-semibold disabled:opacity-50"
        >
          {isScanning ? 'SCANNING...' : 'START SCAN'}
        </button>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3 bg-[#0b1520] border border-slate-800 p-5 rounded-xl space-y-4">
          <ul className="space-y-3">
            <li className="hover:text-cyan-400 cursor-pointer">📊 Dashboard</li>
            <li className="hover:text-cyan-400 cursor-pointer">🖥️ Assets</li>
            <li className="hover:text-cyan-400 cursor-pointer">🛡️ Vulnerabilities</li>
            <li className="hover:text-cyan-400 cursor-pointer">📈 Reports</li>
          </ul>
        </aside>

        <main className="col-span-9 space-y-6">
          <section className="bg-[#0b1520] border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Vulnerability Summary</h2>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(summary).map(([key, val]) => (
                <div key={key} className="p-6 rounded-lg bg-slate-900 flex flex-col items-center">
                  <div className="text-sm capitalize opacity-80">{key}</div>
                  <div className="text-4xl font-bold mt-2">{val}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-6">
            <div className="bg-[#0b1520] border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Vulnerabilities by Severity</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={90}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#0b1520] border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Detected vs Patched Vulnerabilities</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2a33" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="detected" fill="#FF5555" />
                  <Bar dataKey="patched" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-[#0b1520] border border-slate-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Average Risk Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2a33" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgRisk" stroke="#8884d8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="bg-[#0b1520] border border-slate-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Key Security Stats</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded bg-slate-900">
                <p className="text-3xl font-bold text-red-400">12</p>
                <p className="text-sm mt-1 opacity-80">Critical Vulnerabilities</p>
              </div>
              <div className="p-4 rounded bg-slate-900">
                <p className="text-3xl font-bold text-yellow-400">28</p>
                <p className="text-sm mt-1 opacity-80">Systems Monitored</p>
              </div>
              <div className="p-4 rounded bg-slate-900">
                <p className="text-3xl font-bold text-green-400">94%</p>
                <p className="text-sm mt-1 opacity-80">Patch Compliance</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
