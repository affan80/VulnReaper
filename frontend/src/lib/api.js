// API utility for making requests to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

// Rate limiting and backoff mechanism
const BASE_RATE_LIMIT_DELAY = 500; // 0.5 second between requests
const MAX_BACKOFF_DELAY = 30000; // 30 seconds max backoff
let lastRequestTime = 0;
let backoffDelay = 0;

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  // Calculate delay needed (base delay + backoff)
  const totalDelayNeeded = Math.max(BASE_RATE_LIMIT_DELAY, backoffDelay);
  
  if (timeSinceLastRequest < totalDelayNeeded) {
    const delay = totalDelayNeeded - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
}

function increaseBackoff() {
  // Exponential backoff, capped at MAX_BACKOFF_DELAY
  backoffDelay = Math.min(backoffDelay * 2 || 1000, MAX_BACKOFF_DELAY);
}

function resetBackoff() {
  backoffDelay = 0;
}

class API {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  async request(endpoint, options = {}) {
    // Apply rate limiting
    await rateLimit();
    
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Handle rate limiting (429) errors
      if (response.status === 429) {
        // Increase backoff delay for future requests
        increaseBackoff();
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
      
      // If we get a 401 Unauthorized error, automatically logout the user
      if (response.status === 401) {
        // Remove token from localStorage
        localStorage.removeItem('token');
        
        // Redirect to login page if we're in the browser
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        throw new Error('Session expired. Please log in again.');
      }
      
      // Try to parse JSON, but handle cases where response is not JSON
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If not JSON, try to get text
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || 'Request failed');
        }
        // If it's OK but not JSON, return the text
        data = { success: true, data: text };
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      // Reset backoff on successful request
      resetBackoff();
      
      return data;
    } catch (error) {
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please make sure the backend is running.');
      }
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard');
  }

  // Vulnerability endpoints
  async getVulnerabilities(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/vulnerabilities${queryString ? `?${queryString}` : ''}`);
  }

  async getVulnerability(id) {
    return this.request(`/vulnerabilities/${id}`);
  }

  async createVulnerability(data) {
    return this.request('/vulnerabilities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVulnerability(id, data) {
    return this.request(`/vulnerabilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVulnerability(id) {
    return this.request(`/vulnerabilities/${id}`, {
      method: 'DELETE',
    });
  }

  // Scan endpoints
  async createScan(target, scanners) {
    return this.request('/scan', {
      method: 'POST',
      body: JSON.stringify({ target, scanners }),
    });
  }

  // Report endpoints
  async getReports() {
    return this.request('/reports');
  }

  async getReport(id) {
    return this.request(`/reports/${id}`);
  }

  async createReport(data) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generatePDF(id) {
    return this.request(`/pdf/generate/${id}`);
  }

  async downloadPDF(id) {
    const token = this.getToken();
    const url = `${this.baseURL}/pdf/download/${id}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `report_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  }

  // Profile endpoints
  async updateProfile(data) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Activity endpoints
  async getActivities() {
    return this.request('/activity');
  }

  async createActivity(data) {
    return this.request('/activity', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteActivity(id) {
    return this.request(`/activity/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new API();
