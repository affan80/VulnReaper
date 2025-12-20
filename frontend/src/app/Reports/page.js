'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import API from '../../lib/api';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { FileText, Download, Plus, X, CheckCircle, Eye, TrendingUp, Search } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVulns, setSelectedVulns] = useState([]);
  const [generating, setGenerating] = useState(null);
  const [previewReport, setPreviewReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  // Search, filter, sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsData, vulnsData] = await Promise.all([
        API.getReports(),
        API.getVulnerabilities(),
      ]);

      setReports(reportsData.data || []);
      setVulnerabilities(vulnsData.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (selectedVulns.length === 0) {
      alert('Please select at least one vulnerability');
      return;
    }

    try {
      const data = await API.createReport({
        vulnerabilities: selectedVulns,
      });

      await fetchData();
      setShowModal(false);
      setSelectedVulns([]);
      
      alert(`Report generated successfully with ${selectedVulns.length} vulnerabilities!`);
    } catch (error) {
      alert('Failed to generate report');
    }
  };

  const handlePreview = async (reportId) => {
    try {
      const report = await API.getReport(reportId);
      const vulnDetails = await Promise.all(
        (report.data.vulnerabilities || []).map(id => 
          API.getVulnerability(id).catch(() => null)
        )
      );
      
      setPreviewReport({
        ...report.data,
        vulnerabilityDetails: vulnDetails.filter(v => v !== null).map(v => v.data),
      });
      setShowPreview(true);
    } catch (error) {
      alert('Failed to load report preview');
    }
  };

  const handleDownloadPDF = async (reportId) => {
    setGenerating(reportId);
    try {
      await API.generatePDF(reportId);
      await API.downloadPDF(reportId);
    } catch (error) {
      alert('Failed to download PDF');
    } finally {
      setGenerating(null);
    }
  };

  const toggleVuln = (id) => {
    setSelectedVulns((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const filteredAndSortedReports = reports
    .filter((report) => {
      const matchesSearch =
        !searchTerm ||
        (report.name && report.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = !filterStatus || report.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'vulnerabilities') {
        return (b.vulnerabilities?.length || 0) - (a.vulnerabilities?.length || 0);
      }
      return 0;
    });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 mt-1">Generate and download vulnerability reports</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg"
            >
              <Plus size={20} />
              Generate Report
            </button>
          </div>

          {/* Search, Filter, Sort */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Running">Running</option>
                <option value="Failed">Failed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="vulnerabilities">Sort by Vulnerabilities</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Report Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vulnerabilities</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedReports.length > 0 ? (
                  filteredAndSortedReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="text-indigo-600" size={20} />
                          <span className="font-medium text-gray-900">{report.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {report.vulnerabilities?.length || 0} items
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            report.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : report.status === 'Running'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handlePreview(report._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                          >
                            <Eye size={18} />
                            Preview
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(report._id)}
                            disabled={generating === report._id}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                          >
                            {generating === report._id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Download size={18} />
                                Download
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No reports found. Generate one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Generate New Report</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-gray-600 mb-4">
                Select vulnerabilities to include in the report ({selectedVulns.length} selected)
              </p>

              <div className="space-y-3">
                {vulnerabilities.length > 0 ? (
                  vulnerabilities.map((vuln) => (
                    <label
                      key={vuln._id}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedVulns.includes(vuln._id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedVulns.includes(vuln._id)}
                        onChange={() => toggleVuln(vuln._id)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <p className="font-semibold text-gray-900">{vuln.name || 'Unnamed Vulnerability'}</p>
                        <p className="text-sm text-gray-600 mt-1">{vuln.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">Target: {vuln.target}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              vuln.severity === 'Critical'
                                ? 'bg-red-100 text-red-700'
                                : vuln.severity === 'High'
                                ? 'bg-orange-100 text-orange-700'
                                : vuln.severity === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {vuln.severity}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              vuln.status === 'Open'
                                ? 'bg-red-100 text-red-700'
                                : vuln.status === 'In Progress'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {vuln.status}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No vulnerabilities available. Please add some vulnerabilities first.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={selectedVulns.length === 0}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <CheckCircle size={18} />
                Generate Report ({selectedVulns.length} items)
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && previewReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="text-white">
                <h2 className="text-2xl font-bold">Report Preview</h2>
                <p className="text-indigo-100 mt-1">{previewReport.name}</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-indigo-600" size={24} />
                  Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <p className="text-sm text-indigo-600 font-medium">Total Vulnerabilities</p>
                    <p className="text-2xl font-bold text-indigo-900 mt-1">
                      {previewReport.vulnerabilityDetails?.length || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <p className="text-sm text-red-600 font-medium">Critical</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">
                      {previewReport.vulnerabilityDetails?.filter(v => v.severity === 'Critical').length || 0}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                    <p className="text-sm text-orange-600 font-medium">High</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">
                      {previewReport.vulnerabilityDetails?.filter(v => v.severity === 'High').length || 0}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                    <p className="text-sm text-yellow-600 font-medium">Medium + Low</p>
                    <p className="text-2xl font-bold text-yellow-900 mt-1">
                      {(previewReport.vulnerabilityDetails?.filter(v => v.severity === 'Medium' || v.severity === 'Low').length || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {previewReport.vulnerabilityDetails && previewReport.vulnerabilityDetails.length > 0 && (
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Severity Distribution</h3>
                  <div className="flex justify-center">
                    <div className="w-80 h-80">
                      <Doughnut
                        data={{
                          labels: ['Critical', 'High', 'Medium', 'Low'],
                          datasets: [
                            {
                              data: [
                                previewReport.vulnerabilityDetails.filter(v => v.severity === 'Critical').length,
                                previewReport.vulnerabilityDetails.filter(v => v.severity === 'High').length,
                                previewReport.vulnerabilityDetails.filter(v => v.severity === 'Medium').length,
                                previewReport.vulnerabilityDetails.filter(v => v.severity === 'Low').length,
                              ],
                              backgroundColor: ['#dc2626', '#ea580c', '#f59e0b', '#3b82f6'],
                              borderWidth: 2,
                              borderColor: '#ffffff',
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {previewReport.vulnerabilityDetails && previewReport.vulnerabilityDetails.length > 0 && (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Vulnerabilities</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {previewReport.vulnerabilityDetails.map((vuln, index) => (
                      <div key={vuln._id || index} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">{vuln.name || 'Unnamed Vulnerability'}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              vuln.severity === 'Critical'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : vuln.severity === 'High'
                                ? 'bg-orange-100 text-orange-700 border-orange-200'
                                : vuln.severity === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                            }`}
                          >
                            {vuln.severity}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-500 font-medium">Target:</span>
                            <span className="ml-2 text-gray-900">{vuln.target || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-medium">Port:</span>
                            <span className="ml-2 text-gray-900">{vuln.port || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-medium">Protocol:</span>
                            <span className="ml-2 text-gray-900">{vuln.protocol || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-medium">Status:</span>
                            <span className="ml-2 text-gray-900">{vuln.status || 'Open'}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{vuln.description || 'No description available'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-white flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Created on {new Date(previewReport.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    handleDownloadPDF(previewReport._id);
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
