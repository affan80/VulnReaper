'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import API from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Activity as ActivityIcon, Clock, Search, Trash2, RefreshCw } from 'lucide-react';

export default function Activity() {
  const { handleAuthError } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // Function to convert timestamp to relative time (e.g., "2 hours ago")
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Function to delete an activity
  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }
    
    try {
      await API.deleteActivity(id);
      // Remove the deleted activity from the state
      setActivities(prevActivities => prevActivities.filter(activity => activity._id !== id));
    } catch (error) {
      console.error('Failed to delete activity:', error);
      // Handle authentication errors
      if (error.message.includes('Invalid or expired token') || error.message.includes('Session expired')) {
        handleAuthError(error);
        return;
      }
      // Handle rate limiting errors
      else if (error.message.includes('Too many requests')) {
        alert('Too many requests. Please wait a moment and try again.');
        return;
      }
      alert('Failed to delete activity');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await API.getActivities();
      setActivities(data.data || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      // Handle authentication errors
      if (error.message.includes('Invalid or expired token') || error.message.includes('Session expired')) {
        handleAuthError(error);
      }
      // Handle rate limiting errors
      else if (error.message.includes('Too many requests')) {
        console.warn('Rate limit exceeded for activities API.');
      }
      // Handle connection errors
      else if (error.message.includes('Unable to connect to the server')) {
        console.error('Connection error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedActivities = activities
    .filter((activity) => {
      const matchesSearch =
        !searchTerm ||
        (activity.action && activity.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activity.details && activity.details.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'action') {
        return (a.action || '').localeCompare(b.action || '');
      }
      return 0;
    });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
              <p className="text-gray-600 mt-1">Track all system activities and events</p>
            </div>
            <button
              onClick={fetchActivities}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {/* Search and Sort */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="action">Sort by Action</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            {filteredAndSortedActivities.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredAndSortedActivities.map((activity) => (
                  <div key={activity._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <ActivityIcon size={20} className="text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{activity.action}</h3>
                            {activity.details && (
                              <p className="text-gray-600 mt-1">{activity.details}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <Clock size={16} />
                              <span>{getTimeAgo(activity.createdAt)}</span>
                              <span>•</span>
                              <span>{new Date(activity.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteActivity(activity._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete activity"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <ActivityIcon size={64} className="mb-4 text-gray-300" />
                <p className="text-lg font-medium">No activities found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
