// src/pages/employee/documents/MyDocuments.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Eye,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  FolderOpen,
  Plus,
  File,
  Image,
  FileSpreadsheet,
} from 'lucide-react';

const MyDocuments: React.FC = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = [
    { value: 'all', label: 'All Documents' },
    { value: 'identity', label: 'Identity' },
    { value: 'personal', label: 'Personal' },
    { value: 'educational', label: 'Educational' },
    { value: 'employment', label: 'Employment' },
    { value: 'financial', label: 'Financial' },
  ];

  const documents = [
    {
      id: 1,
      name: 'Aadhar Card',
      category: 'Identity',
      type: 'PDF',
      size: '1.2 MB',
      uploadedOn: '2024-01-15',
      status: 'Verified',
      required: true,
    },
    {
      id: 2,
      name: 'PAN Card',
      category: 'Identity',
      type: 'PDF',
      size: '856 KB',
      uploadedOn: '2024-01-15',
      status: 'Verified',
      required: true,
    },
    {
      id: 3,
      name: 'Passport',
      category: 'Identity',
      type: 'PDF',
      size: '2.4 MB',
      uploadedOn: '2024-02-20',
      status: 'Pending',
      required: false,
    },
    {
      id: 4,
      name: 'Degree Certificate',
      category: 'Educational',
      type: 'PDF',
      size: '3.1 MB',
      uploadedOn: '2024-01-10',
      status: 'Verified',
      required: true,
    },
    {
      id: 5,
      name: 'Previous Employment Letter',
      category: 'Employment',
      type: 'PDF',
      size: '456 KB',
      uploadedOn: '2024-01-10',
      status: 'Verified',
      required: true,
    },
    {
      id: 6,
      name: 'Bank Statement',
      category: 'Financial',
      type: 'PDF',
      size: '1.8 MB',
      uploadedOn: '2024-11-01',
      status: 'Pending',
      required: false,
    },
    {
      id: 7,
      name: 'Profile Photo',
      category: 'Personal',
      type: 'JPG',
      size: '245 KB',
      uploadedOn: '2024-01-05',
      status: 'Verified',
      required: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle size={12} /> Verified
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
            <Clock size={12} /> Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="text-red-500" size={24} />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <Image className="text-blue-500" size={24} />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="text-green-500" size={24} />;
      default:
        return <File className="text-gray-500" size={24} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'identity':
        return 'bg-blue-100 text-blue-700';
      case 'personal':
        return 'bg-purple-100 text-purple-700';
      case 'educational':
        return 'bg-green-100 text-green-700';
      case 'employment':
        return 'bg-orange-100 text-orange-700';
      case 'financial':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = filterCategory === 'all' || doc.category.toLowerCase() === filterCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: documents.length,
    verified: documents.filter(d => d.status === 'Verified').length,
    pending: documents.filter(d => d.status === 'Pending').length,
    required: documents.filter(d => d.required).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <FolderOpen className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-600">Total Documents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              <p className="text-xs text-gray-600">Verified</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 rounded-lg">
              <Clock className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 rounded-lg">
              <FileText className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.required}</p>
              <p className="text-xs text-gray-600">Required Docs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filter & Upload */}
          <div className="flex items-center gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
            >
              <Upload size={18} />
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  {getFileIcon(doc.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </span>
                    {doc.required && (
                      <span className="text-xs text-red-600 font-semibold">Required</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Size</span>
                <span className="text-gray-800">{doc.size}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Uploaded</span>
                <span className="text-gray-800">
                  {new Date(doc.uploadedOn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                {getStatusBadge(doc.status)}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => navigate(`/employee/documents/${doc.id}`)}
                className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-semibold flex items-center justify-center gap-1"
              >
                <Eye size={16} /> View
              </button>
              <button className="flex-1 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition text-sm font-semibold flex items-center justify-center gap-1">
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No documents found</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Document</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Document Type
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select type</option>
                  {categories.filter(c => c.value !== 'all').map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  placeholder="Enter document name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition cursor-pointer">
                <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Upload Button - Mobile */}
      <div className="md:hidden fixed bottom-20 right-6 z-20">
        <button
          onClick={() => setShowUploadModal(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default MyDocuments;