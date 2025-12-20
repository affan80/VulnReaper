'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
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
import { Shield, Activity as ActivityIcon, FileText, AlertCircle, RefreshCw, TrendingUp, CheckCircle } from 'lucide-react';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const { handleAuthError } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(0);
  const REFRESH_COOLDOWN = 5000; // 5 seconds cooldown

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 2 minutes (reduced from 30 seconds to prevent rate limiting)
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }

    try {
      const [statsData, activitiesData, vulnData] = await Promise.all([
        API.getDashboardStats(),
        API.getActivities(),
        API.getVulnerabilities(),
      ]);

      setStats(statsData.data);
      setActivities(activitiesData.data?.slice(0, 5) || []);
      setVulnerabilities(vulnData.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Handle authentication errors
      if (error.message.includes('Invalid or expired token') || error.message.includes('Session expired')) {
        handleAuthError(error);
      }
      // Handle rate limiting errors
      else if (error.message.includes('Too many requests')) {
        // Don't show alert for rate limiting to avoid spamming the user
        console.warn('Rate limit exceeded. Please wait before refreshing again.');
      }
      // Handle connection errors
      else if (error.message.includes('Unable to connect to the server')) {
        console.error('Connection error:', error.message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    const now = Date.now();
    if (now - lastRefresh < REFRESH_COOLDOWN) {
      console.warn('Refresh cooldown active. Please wait before refreshing again.');
      return;
    }
    setLastRefresh(now);
    fetchDashboardData(true);
  };

  const getResolutionPercentage = () => {
    const total = stats?.totalVulnerabilities || 0;
    if (total === 0) return 0;
    return Math.round(((stats?.resolvedVulnerabilities || 0) / total) * 100);
  };

  const getPendingCount = () => {
    return (stats?.openVulnerabilities || 0) + (stats?.inProgressVulnerabilities || 0);
  };

  if (loading) {
    return <Loading />;
  }

  const severityData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [
          stats?.severityStats?.find(s => s._id === 'Critical')?.count || 0,
          stats?.severityStats?.find(s => s._id === 'High')?.count || 0,
          stats?.severityStats?.find(s => s._id === 'Medium')?.count || 0,
          stats?.severityStats?.find(s => s._id === 'Low')?.count || 0,
        ],
        backgroundColor: ['#dc2626', '#ea580c', '#f59e0b', '#3b82f6'],
      },
    ],
  };

  const statusData = {
    labels: ['Open', 'In Progress', 'Resolved'],
    datasets: [
      {
        label: 'Vulnerabilities',
        data: [
          stats?.openVulnerabilities || 0,
          stats?.inProgressVulnerabilities || 0,
          stats?.resolvedVulnerabilities || 0,
        ],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
      },
    ],
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-700';
      case 'High':
        return 'bg-orange-100 text-orange-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Overview of your vulnerability management system</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>

          {/* Resolution Progress Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Resolution Progress</h2>
                <p className="text-indigo-100 mt-1">Track your vulnerability remediation status</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold">{getResolutionPercentage()}%</p>
                <p className="text-indigo-100 text-sm">Resolved</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={20} />
                  <p className="font-semibold">Pending</p>
                </div>
                <p className="text-3xl font-bold">{getPendingCount()}</p>
                <p className="text-indigo-100 text-sm">Open + In Progress</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={20} />
                  <p className="font-semibold">Resolved</p>
                </div>
                <p className="text-3xl font-bold">{stats?.resolvedVulnerabilities || 0}</p>
                <p className="text-indigo-100 text-sm">Completed</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} />
                  <p className="font-semibold">Total</p>
                </div>
                <p className="text-3xl font-bold">{stats?.totalVulnerabilities || 0}</p>
                <p className="text-indigo-100 text-sm">All Vulnerabilities</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getResolutionPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Vulnerabilities</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalVulnerabilities || 0}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-indigo-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Open Vulnerabilities</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.openVulnerabilities || 0}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.inProgressVulnerabilities || 0}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ActivityIcon className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Resolved</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.resolvedVulnerabilities || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Severity Distribution</h2>
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  <Doughnut data={severityData} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status Overview</h2>
              <Bar data={statusData} />
            </div>
          </div>

          {/* Recent Vulnerabilities & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Vulnerabilities</h2>
              <div className="space-y-3">
                {vulnerabilities.length > 0 ? (
                  vulnerabilities.map((vuln) => (
                    <div key={vuln._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{vuln.name || 'Unnamed Vulnerability'}</p>
                        <p className="text-sm text-gray-600">{vuln.target}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vuln.status)}`}>
                          {vuln.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No vulnerabilities found</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <ActivityIcon size={16} className="text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.details || 'No details'}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
