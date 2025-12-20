// Utility to check backend connection status
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

export async function checkBackendConnection() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    return response.ok;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    clearTimeout(timeoutId);
    return false;
  }
}

export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    return {
      isHealthy: response.ok,
      status: response.status,
      message: response.ok ? 'Backend is healthy' : 'Backend is unreachable'
    };
  } catch (error) {
    console.error('Backend health check failed:', error);
    clearTimeout(timeoutId);
    return {
      isHealthy: false,
      status: null,
      message: 'Unable to connect to backend server. Please ensure the backend is running on port 5002.'
    };
  }
}