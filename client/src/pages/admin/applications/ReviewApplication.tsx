import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  X,
  Star,
  FileText,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../../../services/api';
import AdminLayout from '../AdminLayout';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  rating?: number;
  coverLetter?: string;
  resume?: string;
  job: {
    id: string;
    title: string;
    department: string;
  };
}

interface ReviewData {
  status: string;
  rating: number;
  notes: string;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'HIRE' | 'REJECT' | 'INTERVIEW' | 'SHORTLIST' | '';
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'REVIEWING', label: 'Reviewing' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
  { value: 'INTERVIEWED', label: 'Interviewed' },
  { value: 'OFFER_SENT', label: 'Offer Sent' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' }
];

const RECOMMENDATION_OPTIONS = [
  { value: '', label: 'No Recommendation Yet' },
  { value: 'HIRE', label: 'Recommend to Hire', color: 'green' },
  { value: 'SHORTLIST', label: 'Move to Shortlist', color: 'blue' },
  { value: 'INTERVIEW', label: 'Schedule Interview', color: 'purple' },
  { value: 'REJECT', label: 'Reject Application', color: 'red' }
];

export default function ReviewApplication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');

  const [reviewData, setReviewData] = useState<ReviewData>({
    status: 'REVIEWING',
    rating: 0,
    notes: '',
    feedback: '',
    strengths: [],
    weaknesses: [],
    recommendation: ''
  });

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
        setReviewData(prev => ({
          ...prev,
          status: response.data!.status,
          rating: response.data!.rating || 0
        }));
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

  const handleSubmitReview = async () => {
    if (!id) return;

    try {
      setSaving(true);
      setError(null);

      // FIXED: Use /admin/applications endpoint
      const response = await api.request(`/admin/applications/${id}/review`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/admin/applications/${id}`);
        }, 1500);
      } else {
        setError(response.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Failed to submit review');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addStrength = () => {
    if (newStrength.trim()) {
      setReviewData({
        ...reviewData,
        strengths: [...reviewData.strengths, newStrength.trim()]
      });
      setNewStrength('');
    }
  };

  const removeStrength = (index: number) => {
    setReviewData({
      ...reviewData,
      strengths: reviewData.strengths.filter((_, i) => i !== index)
    });
  };

  const addWeakness = () => {
    if (newWeakness.trim()) {
      setReviewData({
        ...reviewData,
        weaknesses: [...reviewData.weaknesses, newWeakness.trim()]
      });
      setNewWeakness('');
    }
  };

  const removeWeakness = (index: number) => {
    setReviewData({
      ...reviewData,
      weaknesses: reviewData.weaknesses.filter((_, i) => i !== index)
    });
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

  if (error && !application) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Review Application</h1>
          <p className="text-gray-600 mt-1">
            Review {application?.firstName} {application?.lastName}'s application
          </p>
        </div>
        <button
          onClick={() => navigate(`/admin/applications/${id}`)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="p-6">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">Review submitted successfully! Redirecting...</p>
          </div>
        )}

        {error && application && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Review Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {application?.firstName} {application?.lastName}
                  </h2>
                  <p className="text-gray-600">{application?.job.title}</p>
                  <p className="text-sm text-gray-500">{application?.email}</p>
                </div>
              </div>
            </div>

            {/* Status and Rating */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Status & Rating</h3>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Status
                </label>
                <select
                  value={reviewData.status}
                  onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating })}
                      className="focus:outline-none transition"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= reviewData.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {reviewData.rating > 0 ? `${reviewData.rating}/5` : 'Not rated'}
                  </span>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strengths</h3>
              <div className="space-y-3">
                {reviewData.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">{strength}</span>
                    <button
                      onClick={() => removeStrength(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addStrength()}
                    placeholder="Add a strength..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addStrength}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
              <div className="space-y-3">
                {reviewData.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-orange-800">{weakness}</span>
                    <button
                      onClick={() => removeWeakness(index)}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newWeakness}
                    onChange={(e) => setNewWeakness(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addWeakness()}
                    placeholder="Add an area for improvement..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addWeakness}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Notes</h3>
              <textarea
                value={reviewData.notes}
                onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
                placeholder="Add your detailed review notes here..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Feedback */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Feedback (Optional - to be shared with applicant)
              </h3>
              <textarea
                value={reviewData.feedback}
                onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                placeholder="Add feedback that will be shared with the applicant..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Right Column - Recommendation & Actions */}
          <div className="space-y-6">
            {/* Recommendation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendation</h3>
              <div className="space-y-2">
                {RECOMMENDATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setReviewData({ ...reviewData, recommendation: option.value as any })}
                    className={`w-full p-3 rounded-lg text-left border-2 transition ${
                      reviewData.recommendation === option.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        reviewData.recommendation === option.value
                          ? 'border-indigo-600'
                          : 'border-gray-300'
                      }`}>
                        {reviewData.recommendation === option.value && (
                          <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Application Documents */}
            {application?.resume && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">View Resume</span>
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
              <button
                onClick={handleSubmitReview}
                disabled={saving || success}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
              <button
                onClick={() => navigate(`/admin/applications/${id}`)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}