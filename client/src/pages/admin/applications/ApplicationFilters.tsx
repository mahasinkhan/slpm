import { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, Briefcase, MapPin, Star } from 'lucide-react';
import { api } from '../../../services/api';

interface ApplicationFiltersProps {
  onFilterChange: (filters: any) => void;
  onSearch: (query: string) => void;
}

interface Job {
  id: string;
  title: string;
  department: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'NEW', label: 'New' },
  { value: 'REVIEWING', label: 'Reviewing' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
  { value: 'INTERVIEWED', label: 'Interviewed' },
  { value: 'OFFER_SENT', label: 'Offer Sent' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' }
];

const RATING_OPTIONS = [
  { value: 'all', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4+ Stars' },
  { value: '3', label: '3+ Stars' },
  { value: '2', label: '2+ Stars' },
  { value: '1', label: '1+ Star' }
];

const DATE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' }
];

export default function ApplicationFilters({ onFilterChange, onSearch }: ApplicationFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  
  const [filters, setFilters] = useState({
    status: 'all',
    jobId: 'all',
    department: 'all',
    rating: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Use the PUBLIC /jobs endpoint (no auth required, no validation)
      // This endpoint returns published jobs without requiring query params
      const response = await api.request<any>('/jobs');
      
      if (response.success && response.data) {
        // Handle various response formats from different backends
        let jobsData: Job[] = [];
        
        if (Array.isArray(response.data)) {
          // Direct array response
          jobsData = response.data;
        } else if (response.data.jobs && Array.isArray(response.data.jobs)) {
          // { jobs: [...] } format
          jobsData = response.data.jobs;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // { data: [...] } format
          jobsData = response.data.data;
        }
        
        // Extract only needed fields
        setJobs(jobsData.map((job: any) => ({
          id: job.id,
          title: job.title,
          department: job.department || ''
        })));
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      // Don't block the filter UI if jobs fail to load
      setJobs([]);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Convert filters to API format
    const apiFilters: any = {};
    
    if (newFilters.status !== 'all') {
      apiFilters.status = newFilters.status;
    }
    
    if (newFilters.jobId !== 'all') {
      apiFilters.jobId = newFilters.jobId;
    }
    
    if (newFilters.department !== 'all') {
      apiFilters.department = newFilters.department;
    }
    
    if (newFilters.rating !== 'all') {
      apiFilters.minRating = parseInt(newFilters.rating);
    }
    
    if (newFilters.dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (newFilters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      apiFilters.startDate = startDate.toISOString();
      apiFilters.endDate = now.toISOString();
    }
    
    onFilterChange(apiFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      status: 'all',
      jobId: 'all',
      department: 'all',
      rating: 'all',
      dateRange: 'all'
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    onSearch('');
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== 'all') || searchQuery !== '';

  // Get unique departments
  const departments = Array.from(new Set(jobs.map(job => job.department))).filter(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, email, or application ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {hasActiveFilters && !showFilters && (
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Briefcase className="w-4 h-4" />
              <span>Job Position</span>
            </label>
            <select
              value={filters.jobId}
              onChange={(e) => handleFilterChange('jobId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Positions</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Department</span>
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>Rating</span>
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {RATING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Date Range</span>
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {DATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
              Search: {searchQuery}
              <button
                onClick={() => handleSearchChange('')}
                className="ml-2 hover:text-indigo-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.status !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Status: {STATUS_OPTIONS.find(o => o.value === filters.status)?.label}
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="ml-2 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.jobId !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              Job: {jobs.find(j => j.id === filters.jobId)?.title}
              <button
                onClick={() => handleFilterChange('jobId', 'all')}
                className="ml-2 hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.department !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Dept: {filters.department}
              <button
                onClick={() => handleFilterChange('department', 'all')}
                className="ml-2 hover:text-green-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.rating !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
              Rating: {RATING_OPTIONS.find(o => o.value === filters.rating)?.label}
              <button
                onClick={() => handleFilterChange('rating', 'all')}
                className="ml-2 hover:text-yellow-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {filters.dateRange !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800">
              Date: {DATE_OPTIONS.find(o => o.value === filters.dateRange)?.label}
              <button
                onClick={() => handleFilterChange('dateRange', 'all')}
                className="ml-2 hover:text-pink-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}