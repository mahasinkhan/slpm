// jobs/CreateJob.tsx - FIXED VERSION WITH DEBUG LOGGING
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import AdminHeader from '../components/AdminHeader';
import { jobApi, JobFormData } from '../../../services/jobApi';

const CreateJob: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    location: '',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    salaryMin: undefined,
    salaryMax: undefined,
    salaryCurrency: 'GBP',
    description: '',
    responsibilities: [],
    requirements: [],
    benefits: [],
    skills: [],
    applicationDeadline: '',
    status: 'DRAFT',
    isPublished: false
  });

  const [currentResponsibility, setCurrentResponsibility] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [currentBenefit, setCurrentBenefit] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'salaryMin' || name === 'salaryMax') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value) : undefined
      }));
    } else if (name === 'salaryCurrency') {
      setFormData(prev => ({ ...prev, salaryCurrency: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };

  const addArrayItem = (
    field: 'responsibilities' | 'requirements' | 'benefits' | 'skills',
    value: string
  ) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      
      if (field === 'responsibilities') setCurrentResponsibility('');
      if (field === 'requirements') setCurrentRequirement('');
      if (field === 'benefits') setCurrentBenefit('');
      if (field === 'skills') setCurrentSkill('');
    }
  };

  const removeArrayItem = (
    field: 'responsibilities' | 'requirements' | 'benefits' | 'skills',
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description || formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }
    if (formData.responsibilities.length === 0) {
      newErrors.responsibilities = 'At least one responsibility is required';
    }
    if (formData.requirements.length === 0) {
      newErrors.requirements = 'At least one requirement is required';
    }
    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = 'Application deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, saveType: 'draft' | 'publish') => {
    e.preventDefault();
    
    if (saveType === 'publish' && !validateForm()) {
      alert('Please fill in all required fields before publishing');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // IMPORTANT: Explicitly set status and isPublished based on saveType
      const isPublishing = saveType === 'publish';
      
      const jobData: JobFormData = {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        salaryCurrency: formData.salaryCurrency,
        description: formData.description,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        benefits: formData.benefits,
        skills: formData.skills,
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
        // Set these - backend might ignore them but we try anyway
        status: isPublishing ? 'ACTIVE' : 'DRAFT',
        isPublished: isPublishing
      };

      console.log('='.repeat(50));
      console.log('[CreateJob] 📤 SUBMIT TYPE:', saveType);
      console.log('[CreateJob] 📤 isPublishing:', isPublishing);
      console.log('[CreateJob] 📤 Sending status:', jobData.status, 'isPublished:', jobData.isPublished);
      console.log('='.repeat(50));

      // Step 1: Create the job
      const response = await jobApi.createJob(jobData);

      console.log('[CreateJob] 📥 Create API Response:', response);

      if (response.success && response.data) {
        const createdJobId = response.data.id;
        console.log('[CreateJob] ✅ Job created with ID:', createdJobId);
        console.log('[CreateJob] 📊 Created job status:', response.data.status, 'isPublished:', response.data.isPublished);
        
        // Step 2: If publishing and backend didn't set it correctly, call togglePublish
        if (isPublishing && (response.data.status !== 'ACTIVE' || response.data.isPublished !== true)) {
          console.log('[CreateJob] ⚠️ Backend ignored publish status, calling togglePublish...');
          
          const publishResponse = await jobApi.togglePublish(createdJobId, true);
          
          if (publishResponse.success) {
            console.log('[CreateJob] ✅ Job published successfully via togglePublish');
            console.log('[CreateJob] 📊 Final status:', publishResponse.data?.status, 'isPublished:', publishResponse.data?.isPublished);
          } else {
            console.error('[CreateJob] ❌ Failed to publish job:', publishResponse.error);
            alert('Job created but failed to publish. You can publish it from the Jobs list.');
          }
        }
        
        // Show success message
        const message = saveType === 'draft' 
          ? 'Job saved as draft successfully!' 
          : 'Job published successfully! It is now live on your careers page.';
        
        alert(message);
        
        // Navigate to the appropriate page
        if (saveType === 'publish') {
          navigate('/admin/jobs/published', { replace: true });
        } else {
          navigate('/admin/jobs/drafts', { replace: true });
        }
      } else {
        console.error('[CreateJob] ❌ Failed to create job:', response.error);
        alert('Failed to create job: ' + (response.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('[CreateJob] ❌ Exception:', error);
      alert(error.message || 'Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Create New Job Position"
        subtitle="Fill in the details to post a new career opportunity"
        backButton
        backPath="/admin/jobs"
      />

      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <form className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                  </select>
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., London, UK / Remote"
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.applicationDeadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.applicationDeadline && (
                    <p className="text-red-500 text-xs mt-1">{errors.applicationDeadline}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Salary Range (Optional)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary (Annual)
                  </label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Salary (Annual)
                  </label>
                  <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="salaryCurrency"
                    value={formData.salaryCurrency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Job Description
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Provide a comprehensive overview of the role (minimum 50 characters)..."
                />
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-sm ${formData.description.length < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                    {formData.description.length} / 50 characters minimum
                  </p>
                  {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Key Responsibilities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Key Responsibilities <span className="text-red-500">*</span>
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentResponsibility}
                    onChange={(e) => setCurrentResponsibility(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('responsibilities', currentResponsibility);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a key responsibility..."
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('responsibilities', currentResponsibility)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Add
                  </button>
                </div>

                {errors.responsibilities && formData.responsibilities.length === 0 && (
                  <p className="text-red-500 text-xs">{errors.responsibilities}</p>
                )}

                {formData.responsibilities.length > 0 && (
                  <ul className="space-y-2 mt-4">
                    {formData.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="flex-1 text-gray-700">{resp}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('responsibilities', index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Requirements & Qualifications <span className="text-red-500">*</span>
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentRequirement}
                    onChange={(e) => setCurrentRequirement(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('requirements', currentRequirement);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a requirement..."
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements', currentRequirement)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Add
                  </button>
                </div>

                {errors.requirements && formData.requirements.length === 0 && (
                  <p className="text-red-500 text-xs">{errors.requirements}</p>
                )}

                {formData.requirements.length > 0 && (
                  <ul className="space-y-2 mt-4">
                    {formData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="flex-1 text-gray-700">{req}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requirements', index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Required Skills (Optional)
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('skills', currentSkill);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a skill..."
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('skills', currentSkill)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Add
                  </button>
                </div>

                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('skills', index)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Benefits & Perks (Optional)
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentBenefit}
                    onChange={(e) => setCurrentBenefit(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('benefits', currentBenefit);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a benefit..."
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('benefits', currentBenefit)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Add
                  </button>
                </div>

                {formData.benefits.length > 0 && (
                  <ul className="space-y-2 mt-4">
                    {formData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="flex-1 text-gray-700">{benefit}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('benefits', index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'draft')}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'publish')}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                >
                  {loading ? 'Publishing...' : 'Publish Job'}
                </button>
              </div>
              
              {/* Debug info - remove in production */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                <p className="font-semibold text-yellow-800">Debug Info:</p>
                <p>Current form status: {formData.status}</p>
                <p>Current form isPublished: {String(formData.isPublished)}</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateJob;