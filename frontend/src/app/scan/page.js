'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import API from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Play, Loader, CheckCircle, AlertCircle, Target, TrendingUp, Shield, Activity } from 'lucide-react';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ScanPage() {
  const { handleAuthError } = useAuth();
  const [target, setTarget] = useState('');
  const [scanners, setScanners] = useState({
    nmap: false,
    nikto: false,
    masscan: false,
  });
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleScannerChange = (scanner) => {
    setScanners((prev) => ({ ...prev, [scanner]: !prev[scanner] }));
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);
    setProgress(0);

    const selectedScanners = Object.keys(scanners).filter((key) => scanners[key]);
    
    if (selectedScanners.length === 0) {
      setError('Please select at least one scanner');
      return;
    }

    if (!target) {
      setError('Please enter a target');
      return;
    }

    setScanning(true);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const data = await API.createScan(target, selectedScanners);
      clearInterval(progressInterval);
      setProgress(100);
      setResults(data.data);
      
      await API.createActivity({
        action: 'Scan Completed',
        details: `Scanned ${target} using ${selectedScanners.join(', ')} - Found ${data.data.stats?.total || 0} vulnerabilities`,
      });
    } catch (err) {
      clearInterval(progressInterval);
      // Handle authentication errors
      if (err.message.includes('Invalid or expired token') || err.message.includes('Session expired')) {
        handleAuthError(err);
        return;
      }
      setError(err.message || 'Scan failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const severityChartData = results ? {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [
          results.stats?.critical || 0,
          results.stats?.high || 0,
          results.stats?.medium || 0,
          results.stats?.low || 0,
        ],
        backgroundColor: ['#dc2626', '#ea580c', '#f59e0b', '#3b82f6'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  } : null;

  const vulnerabilityBarData = results ? {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Vulnerabilities Found',
        data: [
          results.stats?.critical || 0,
          results.stats?.high || 0,
          results.stats?.medium || 0,
          results.stats?.low || 0,
        ],
        backgroundColor: ['#dc2626', '#ea580c', '#f59e0b', '#3b82f6'],
      },
    ],
  } : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Security Scanning</h1>
            <p className="text-gray-600 mt-1">Run network and web vulnerability scans</p>
          </div>

          <div className="bg-white rounded-xl shadow p-8 mb-8">
            <form onSubmit={handleScan} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target IP Address or Domain *
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g., 192.168.1.1 or example.com"
                    required
                    disabled={scanning}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg text-black disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Scanners *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500 transition-all">
                    <input
                      type="checkbox"
                      checked={scanners.nmap}
                      onChange={() => handleScannerChange('nmap')}
                      disabled={scanning}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">Nmap</p>
                      <p className="text-sm text-gray-500">Port & Service Scan</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500 transition-all">
                    <input
                      type="checkbox"
                      checked={scanners.nikto}
                      onChange={() => handleScannerChange('nikto')}
                      disabled={scanning}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">Nikto</p>
                      <p className="text-sm text-gray-500">Web Server Scanner</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500 transition-all">
                    <input
                      type="checkbox"
                      checked={scanners.masscan}
                      onChange={() => handleScannerChange('masscan')}
                      disabled={scanning}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">Masscan</p>
                      <p className="text-sm text-gray-500">Fast Port Scanner</p>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="text-red-600" size={20} />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={scanning}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg"
              >
                {scanning ? (
                  <>
                    <Loader className="animate-spin" size={24} />
                    Scanning... Please wait
                  </>
                ) : (
                  <>
                    <Play size={24} />
                    Start Scan
                  </>
                )}
              </button>
            </form>
          </div>

          {scanning && (
            <div className="bg-white rounded-xl shadow p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="animate-spin text-indigo-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scan in Progress</h3>
                <p className="text-gray-600 mb-4">
                  Scanning {target} with {Object.keys(scanners).filter((k) => scanners[k]).join(', ')}...
                </p>
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {results && !scanning && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">Total Found</p>
                      <p className="text-4xl font-bold mt-2">{results.stats?.total || 0}</p>
                    </div>
                    <Shield size={40} className="opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Critical</p>
                      <p className="text-4xl font-bold mt-2">{results.stats?.critical || 0}</p>
                    </div>
                    <AlertCircle size={40} className="opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">High</p>
                      <p className="text-4xl font-bold mt-2">{results.stats?.high || 0}</p>
                    </div>
                    <TrendingUp size={40} className="opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">Medium + Low</p>
                      <p className="text-4xl font-bold mt-2">
                        {(results.stats?.medium || 0) + (results.stats?.low || 0)}
                      </p>
                    </div>
                    <Activity size={40} className="opacity-80" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Scan Completed Successfully</h2>
                    <p className="text-gray-600">Target: {results.summary?.target}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 font-medium">Scanners Used</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {results.summary?.scannersUsed?.join(', ') || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 font-medium">Status</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mt-1">
                      {results.summary?.status || 'Completed'}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 font-medium">Scan Date</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {new Date(results.summary?.scanDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 font-medium">Vulnerabilities</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {results.summary?.totalVulnerabilities || 0}
                    </p>
                  </div>
                </div>
              </div>

              {severityChartData && vulnerabilityBarData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Severity Distribution</h3>
                    <div className="flex justify-center">
                      <div className="w-64 h-64">
                        <Doughnut 
                          data={severityChartData}
                          options={{
                            plugins: {
                              legend: {
                                position: 'bottom',
                              },
                            },
                            maintainAspectRatio: true,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Vulnerability Count by Severity</h3>
                    <Bar 
                      data={vulnerabilityBarData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {results.vulnerabilities && results.vulnerabilities.length > 0 && (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Discovered Vulnerabilities</h3>
                    <p className="text-gray-600 mt-1">{results.vulnerabilities.length} vulnerabilities found</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Target</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Port</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Severity</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {results.vulnerabilities.map((vuln, index) => (
                          <tr key={vuln._id || index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900">{vuln.name || 'Unnamed Vulnerability'}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-700">{vuln.target}</td>
                            <td className="px-6 py-4 text-gray-700">{vuln.port || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(vuln.severity)}`}>
                                {vuln.severity}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-600 max-w-md truncate">{vuln.description}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={() => { 
                    setResults(null); 
                    setTarget(''); 
                    setScanners({ nmap: false, nikto: false, masscan: false }); 
                    setProgress(0);
                  }}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg"
                >
                  Run New Scan
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
