// src/pages/employee/documents/ViewDocument.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Info,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const ViewDocument: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock document data
  const document = {
    id: 1,
    name: 'Aadhar Card',
    category: 'Identity',
    type: 'PDF',
    size: '1.2 MB',
    uploadedOn: '2024-01-15',
    verifiedOn: '2024-01-17',
    verifiedBy: 'HR Admin',
    status: 'Verified',
    required: true,
    description: 'Government issued identity document',
    documentNumber: 'XXXX XXXX 1234',
    expiryDate: null,
    previewUrl: '/documents/aadhar.pdf',
    history: [
      { action: 'Document Uploaded', date: '2024-01-15', by: 'You' },
      { action: 'Sent for Verification', date: '2024-01-15', by: 'System' },
      { action: 'Document Verified', date: '2024-01-17', by: 'HR Admin' },
    ],
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            <CheckCircle size={16} /> Verified
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
            <Clock size={16} /> Pending Verification
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            <AlertCircle size={16} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/employee/documents')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{document.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-600">{document.category}</span>
              {getStatusBadge(document.status)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-gray-100 rounded-lg transition" title="Print">
            <Printer size={20} className="text-gray-600" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Document Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Document Preview</h2>
              <span className="text-sm text-gray-500">{document.type} • {document.size}</span>
            </div>
            {/* Preview Area */}
            <div className="bg-gray-100 h-[500px] flex items-center justify-center">
              <div className="text-center">
                <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">{document.name}.{document.type.toLowerCase()}</p>
                <p className="text-sm text-gray-500 mt-1">Click to view full document</p>
                <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Open Document
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Document Details Sidebar */}
        <div className="space-y-6">
          {/* Document Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Info size={18} />
              Document Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-gray-800">{document.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Document No.</span>
                <span className="font-medium text-gray-800">{document.documentNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">File Type</span>
                <span className="font-medium text-gray-800">{document.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">File Size</span>
                <span className="font-medium text-gray-800">{document.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Required</span>
                <span className={`font-medium ${document.required ? 'text-red-600' : 'text-gray-800'}`}>
                  {document.required ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Upload Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={18} />
              Upload Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Uploaded On</p>
                <p className="font-medium text-gray-800">
                  {new Date(document.uploadedOn).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {document.verifiedOn && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Verified On</p>
                    <p className="font-medium text-gray-800">
                      {new Date(document.verifiedOn).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Verified By</p>
                    <p className="font-medium text-gray-800">{document.verifiedBy}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2">
                <RefreshCw size={18} />
                Replace Document
              </button>
              <button className="w-full py-2.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2">
                <AlertCircle size={18} />
                Request Re-verification
              </button>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Document History</h2>
            <div className="space-y-4">
              {document.history.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5" />
                    {index < document.history.length - 1 && (
                      <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-200 -translate-x-1/2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-gray-800 text-sm">{item.action}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })} • {item.by}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDocument;