// src/pages/employee/profile/MyProfile.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit,
  Camera,
  Building,
  Clock,
  Award,
  FileText,
} from 'lucide-react';

const MyProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'documents'>('personal');

  const personalInfo = {
    fullName: `${user?.firstName} ${user?.lastName}`,
    email: user?.email,
    phone: '+91 9876543210',
    dateOfBirth: 'January 15, 1995',
    gender: 'Male',
    address: '123, Park Street, Kolkata, West Bengal - 700016',
    emergencyContact: '+91 9876543211',
    bloodGroup: 'O+',
  };

  const employmentInfo = {
    employeeId: 'EMP-2024-001',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    joiningDate: 'March 1, 2020',
    employmentType: 'Full-time',
    reportingManager: 'John Doe',
    workLocation: 'Kolkata Office',
    shift: 'General (9 AM - 6 PM)',
  };

  const documents = [
    { name: 'Aadhar Card', status: 'Verified', uploadDate: 'Jan 5, 2024' },
    { name: 'PAN Card', status: 'Verified', uploadDate: 'Jan 5, 2024' },
    { name: 'Resume', status: 'Uploaded', uploadDate: 'Jan 10, 2024' },
    { name: 'Educational Certificates', status: 'Pending', uploadDate: '-' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-3xl md:text-4xl">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg">
                <Camera size={16} />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
                {personalInfo.fullName}
              </h1>
              <p className="text-sm md:text-base text-gray-600">{employmentInfo.designation}</p>
              <p className="text-xs md:text-sm text-gray-500">{employmentInfo.employeeId}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/employee/profile/edit')}
            className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center space-x-2"
          >
            <Edit size={18} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 min-w-[120px] px-4 md:px-6 py-3 md:py-4 font-semibold transition ${
              activeTab === 'personal'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('employment')}
            className={`flex-1 min-w-[120px] px-4 md:px-6 py-3 md:py-4 font-semibold transition ${
              activeTab === 'employment'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Employment
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 min-w-[120px] px-4 md:px-6 py-3 md:py-4 font-semibold transition ${
              activeTab === 'documents'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Documents
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* Personal Information */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <User className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-800 truncate">{personalInfo.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-semibold text-gray-800 truncate">{personalInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-semibold text-gray-800">{personalInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-semibold text-gray-800">{personalInfo.dateOfBirth}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <User className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold text-gray-800">{personalInfo.gender}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Award className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-semibold text-gray-800">{personalInfo.bloodGroup}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-800">{personalInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Emergency Contact</p>
                    <p className="font-semibold text-gray-800">{personalInfo.emergencyContact}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employment Information */}
          {activeTab === 'employment' && (
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Briefcase className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Employee ID</p>
                    <p className="font-semibold text-gray-800">{employmentInfo.employeeId}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Award className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="font-semibold text-gray-800">{employmentInfo.designation}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Building className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold text-gray-800">{employmentInfo.department}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Joining Date</p>
                    <p className="font-semibold text-gray-800">{employmentInfo.joiningDate}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Briefcase className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Employment Type</p>
                    <p className="font-semibold text-gray-800">{employmentInfo.employmentType}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <User className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Reporting Manager</p>
                    <p className="font-semibold text-gray-800">{employmentInfo.reportingManager}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Work Location</p>
                    <p className="font-semibold text-gray-800">{employmentInfo.workLocation}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Work Shift</p>
                    <p className="font-semibold text-gray-800">{employmentInfo.shift}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">My Documents</h3>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition space-y-2 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="text-blue-600 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800">{doc.name}</p>
                        <p className="text-sm text-gray-600">
                          {doc.uploadDate !== '-' ? `Uploaded on ${doc.uploadDate}` : 'Not uploaded yet'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          doc.status === 'Verified'
                            ? 'bg-green-100 text-green-700'
                            : doc.status === 'Uploaded'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {doc.status}
                      </span>
                      <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;