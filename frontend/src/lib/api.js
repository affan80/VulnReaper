// API utility for making requests to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
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
}

export default new API();
