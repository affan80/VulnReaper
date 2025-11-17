// API utility functions for authenticated requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to make authenticated API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add Authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle token expiration
    if (response.status === 401) {
      const data = await response.json();
      if (data.message === 'Token expired' || data.message === 'Invalid token') {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
    }

    return response;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Specific API functions
export const getProfile = async () => {
  const response = await apiCall('/auth/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  return response.json();
};

export const logout = async () => {
  try {
    await apiCall('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
};
