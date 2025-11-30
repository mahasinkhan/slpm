import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  Star,
  FileText,
  User,
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { api } from '../../../services/api';
import AdminLayout from '../AdminLayout';
import AdminHeader from '../components/AdminHeader';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  status: string;
  rating?: number;
  coverLetter?: string;
  resume?: string;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    department: string;
  };
  notes?: ApplicationNote[];
  timeline?: TimelineEvent[];
}

interface ApplicationNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

interface TimelineEvent {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

export default function ApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      // FIXED: Use /admin/applications endpoint
      const response = await api.request<Application>(`/admin/applications/${id}`);
      if (response.success && response.data) {
        setApplication(response.data);
      } else {
        setError(response.error || 'Failed to fetch application');
      }
    } catch (err) {
      setError('Failed to fetch application details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !id) return;

    try {
      setAddingNote(true);
      // FIXED: Use /admin/applications endpoint
      const response = await api.request(`/admin/applications/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content: newNote })
      });

      if (response.success) {
        setNewNote('');
        fetchApplication(); // Refresh to get updated notes
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setAddingNote(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;

    try {
      // FIXED: Use /admin/applications endpoint
      const response = await api.request(`/admin/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.success) {
        fetchApplication();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleRatingChange = async (rating: number) => {
    if (!id) return;

    try {
      // FIXED: Use /admin/applications endpoint
      const response = await api.request(`/admin/applications/${id}/rating`, {
        method: 'PATCH',
        body: JSON.stringify({ rating })
      });

      if (response.success) {
        fetchApplication();
      }
    } catch (err) {
      console.error('Failed to update rating:', err);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      NEW: 'bg-blue-100 text-blue-800',
      REVIEWING: 'bg-yellow-100 text-yellow-800',
      SHORTLISTED: 'bg-purple-100 text-purple-800',
      INTERVIEW_SCHEDULED: 'bg-indigo-100 text-indigo-800',
      INTERVIEWED: 'bg-cyan-100 text-cyan-800',
      OFFER_SENT: 'bg-green-100 text-green-800',
      HIRED: 'bg-green-200 text-green-900',
      REJECTED: 'bg-red-100 text-red-800',
      WITHDRAWN: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading application...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !application) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Application not found'}</p>
            <button
              onClick={() => navigate('/admin/applications')}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Back to Applications
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
          <p className="text-gray-600 mt-1">Review application for {application.job.title}</p>
        </div>
        <button
          onClick={() => navigate('/admin/applications')}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Applicant Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {application.firstName} {application.lastName}
                    </h2>
                    <p className="text-gray-600">{application.job.title}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/admin/applications/${id}/review`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Edit className="w-4 h-4" />
                  <span>Review</span>
                </button>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${application.email}`} className="text-indigo-600 hover:underline">
                      {application.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${application.phone}`} className="text-gray-900">
                      {application.phone}
                    </a>
                  </div>
                </div>
                {application.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-900">{application.address}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Applied</p>
                    <p className="text-gray-900">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Rating</p>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingChange(rating)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= (application.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Cover Letter</span>
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              
              {/* Add Note */}
              <div className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this application..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || addingNote}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {addingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-4">
                {application.notes && application.notes.length > 0 ? (
                  application.notes.map((note) => (
                    <div key={note.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                      <p className="text-gray-700">{note.content}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        By {note.createdBy.firstName} {note.createdBy.lastName} •{' '}
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No notes yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Timeline */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {application.resume && (
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </a>
                )}
                <button
                  onClick={() => navigate(`/admin/applications/${id}/review`)}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  <span>Review Application</span>
                </button>
                <button
                  onClick={() => window.location.href = `mailto:${application.email}`}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="NEW">New</option>
                <option value="REVIEWING">Reviewing</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="INTERVIEWED">Interviewed</option>
                <option value="OFFER_SENT">Offer Sent</option>
                <option value="HIRED">Hired</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-4">
                {application.timeline && application.timeline.length > 0 ? (
                  application.timeline.map((event, index) => (
                    <div key={event.id} className="relative">
                      {index !== application.timeline!.length - 1 && (
                        <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200" />
                      )}
                      <div className="flex items-start space-x-3">
                        <div className="w-4 h-4 bg-indigo-600 rounded-full mt-1 z-10" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{event.action}</p>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(event.createdAt).toLocaleDateString()} •{' '}
                            {event.createdBy.firstName} {event.createdBy.lastName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No timeline events</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}