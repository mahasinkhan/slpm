import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useSpring, useInView, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Rocket,
  Heart,
  Award,
  TrendingUp,
  Coffee,
  Laptop,
  Globe,
  Zap,
  Shield,
  Target,
  BookOpen,
  Code,
  ArrowRight,
  Search,
  Filter,
  X,
  ChevronDown,
  CheckCircle,
  Star,
  Calendar,
  Send,
  Upload,
  User,
  Mail,
  Phone,
  FileText,
  GraduationCap,
  Building,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Gift,
  Plane,
  Settings,
  Headset,
  ClipboardList,
  Lightbulb,
  PieChart,
  Loader2
} from 'lucide-react'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- Types for Job Data (matching backend) ---
interface Job {
  id: string
  title: string
  department: string
  location: string
  employmentType: string
  experienceLevel: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  applicationsCount: number
  slug: string
  applicationDeadline: string
  createdAt: string
  isPublished: boolean
  status: string
}

// --- API Service for Public Jobs ---
const publicJobsApi = {
  // Get all published jobs
  getJobs: async (): Promise<Job[]> => {
    try {
      console.log('[Careers] Fetching jobs from:', `${API_BASE_URL}/jobs`);
      const response = await fetch(`${API_BASE_URL}/jobs`);
      const data = await response.json();
      
      console.log('[Careers] Response status:', response.status);
      console.log('[Careers] Response data:', data);
      
      if (!response.ok) {
        console.error('[Careers] API error:', data);
        // Don't throw, just return empty array to show "no jobs" gracefully
        return [];
      }
      
      // Handle different response formats
      if (Array.isArray(data)) {
        console.log('[Careers] Found', data.length, 'jobs (array format)');
        return data;
      }
      if (data.jobs) {
        console.log('[Careers] Found', data.jobs.length, 'jobs (jobs property)');
        return data.jobs;
      }
      if (data.data) {
        console.log('[Careers] Found', data.data.length, 'jobs (data property)');
        return data.data;
      }
      
      console.log('[Careers] No jobs found in response');
      return [];
    } catch (error) {
      console.error('[Careers] Error fetching jobs:', error);
      return [];
    }
  },

  // Get single job by slug
  getJobBySlug: async (slug: string): Promise<Job | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${slug}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch job');
      }
      
      return data.data || data;
    } catch (error) {
      console.error('Error fetching job:', error);
      return null;
    }
  },

  // Submit job application
  submitApplication: async (jobId: string, applicationData: any): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }
      
      return { success: true, message: 'Application submitted successfully!' };
    } catch (error: any) {
      console.error('Error submitting application:', error);
      return { success: false, message: error.message || 'Failed to submit application' };
    }
  }
};

// --- Utility Components ---

const Button = ({ children, className = '', variant = 'primary', size = 'md', onClick, type = 'button', disabled = false }: any) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
  const variants: Record<string, string> = {
    primary: 'bg-[#003366] text-white hover:bg-[#002244] shadow-md hover:shadow-lg',
    outline: 'border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white',
    ghost: 'text-[#003366] hover:bg-gray-50',
    success: 'bg-[#004488] text-white hover:bg-[#003366]',
    warning: 'bg-[#C0C0C0] text-[#003366] hover:bg-[#B0B0B0]'
  }
  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  )
}

const Card = ({ children, className = '' }: any) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      {children}
    </div>
  )
}

const Input = ({ label, type = 'text', placeholder, value, onChange, required, icon: Icon, error, name }: any) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#003366] mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:border-[#003366] focus:outline-none transition-colors`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

const Textarea = ({ label, placeholder, value, onChange, required, rows = 4, error, name }: any) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#003366] mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`w-full px-4 py-3 border-2 ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:border-[#003366] focus:outline-none transition-colors resize-none`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

// --- Format Helpers ---
const formatSalary = (min?: number, max?: number, currency: string = 'GBP') => {
  if (!min && !max) return 'Competitive';
  
  const currencySymbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
  
  if (min && max) {
    return `${currencySymbol}${(min / 1000).toFixed(0)}k - ${currencySymbol}${(max / 1000).toFixed(0)}k`;
  }
  if (min) return `From ${currencySymbol}${(min / 1000).toFixed(0)}k`;
  if (max) return `Up to ${currencySymbol}${(max / 1000).toFixed(0)}k`;
  return 'Competitive';
};

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

// --- Hero Section ---
const HeroSection = () => (
  <section className="py-24 md:py-32 bg-gradient-to-br from-[#003366] to-[#004488] text-white">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Sparkles className="mx-auto text-[#C0C0C0] mb-6" size={64} />
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
          Join the <span className="text-[#C0C0C0]">Future</span> Builders
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
          We're solving the world's toughest problems. Find your next great challenge.
        </p>
        <Button size="lg" className="bg-[#C0C0C0] text-[#003366] hover:bg-[#A0A0A0]">
          <Briefcase className="mr-2" size={20} />
          See Open Roles
        </Button>
      </motion.div>
    </div>
  </section>
)

// --- Why Join Us Section ---
const WhyJoinUs = () => {
  const features = [
    { icon: Rocket, title: 'Impactful Work', description: 'Be part of a team building products that change industries.' },
    { icon: Lightbulb, title: 'Innovation Focus', description: 'Explore cutting-edge technology and challenge the status quo.' },
    { icon: BookOpen, title: 'Continuous Learning', description: 'Generous learning budget and internal mentorship programs.' },
    { icon: Heart, title: 'Inclusive Culture', description: 'A diverse, supportive, and truly collaborative work environment.' }
  ]
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-[#003366] mb-4">
            Why SL Brothers?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            It's more than a job. It's a mission.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center h-full">
                <feature.icon className="mx-auto text-[#003366] mb-4" size={40} />
                <h3 className="text-xl font-bold text-[#003366] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- Benefits Section ---
const BenefitsSection = () => {
  const benefits = [
    { icon: DollarSign, title: 'Top-Tier Compensation', desc: 'Competitive salary and equity packages, reviewed annually.' },
    { icon: Plane, title: 'Unlimited PTO', desc: 'Take the time you need to recharge. Mandatory minimum 4 weeks off.' },
    { icon: Gift, title: 'Wellness Stipend', desc: '£100/month for gym, meditation, or mental health services.' },
    { icon: Laptop, title: 'Home Office Setup', desc: '£1,000 budget for monitors, chairs, and other remote work essentials.' },
    { icon: Heart, title: 'Comprehensive Health', desc: '100% covered health, dental, and vision for you and your family.' },
    { icon: Clock, title: 'Flexible Schedule', desc: 'Work when you are most productive, focusing on results, not hours.' }
  ]

  return (
    <section className="py-24 bg-[#003366] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Award className="mx-auto text-[#C0C0C0] mb-4" size={48} />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            The Perks of Joining
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We invest in our people because you are our greatest asset.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                <benefit.icon className="text-[#C0C0C0] mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-300 text-sm">{benefit.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- Job Card Component ---
const JobCard = ({ job, index, onClick }: { job: Job, index: number, onClick: () => void }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="h-full hover:shadow-2xl transition-all duration-300 border-l-4 border-[#003366]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#003366] mb-2 hover:text-[#004488] transition-colors">
              {job.title}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Building size={14} />
                <span className="capitalize">{job.department}</span>
              </span>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <span className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>{job.location}</span>
              </span>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <span className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{job.employmentType}</span>
              </span>
            </div>
          </div>
          <ThumbsUp className="text-[#C0C0C0] flex-shrink-0" size={24} />
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-[#003366]/10 text-[#003366] rounded-full text-xs font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <DollarSign size={16} />
              <span className="font-semibold">{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Users size={16} />
              <span>{job.applicationsCount || 0} applicants</span>
            </span>
          </div>
          <Button size="sm">
            Details <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Posted {getTimeAgo(job.createdAt)}
        </div>
      </Card>
    </motion.div>
  )
}

// --- Job Filters Component ---
const JobFilters = ({ 
  selectedDepartment, 
  setSelectedDepartment, 
  selectedLocation, 
  setSelectedLocation, 
  searchQuery, 
  setSearchQuery,
  departments,
  locations
}: any) => {
  const FilterButton = ({ value, label, current, onClick }: any) => (
    <Button
      variant={current === value ? 'primary' : 'outline'}
      size="sm"
      className="capitalize flex-shrink-0"
      onClick={() => onClick(value)}
    >
      {label}
    </Button>
  )

  return (
    <section className="py-12 bg-gray-50 sticky top-14 z-20 shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6">
            <Input
              icon={Search}
              placeholder="Search by job title or keyword..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-8">
            {/* Department Filter */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[#003366] mb-2 flex items-center">
                <Filter size={16} className="mr-1" /> Department
              </h3>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                <FilterButton
                  value="all"
                  label="All Teams"
                  current={selectedDepartment}
                  onClick={setSelectedDepartment}
                />
                {departments.map((dept: string) => (
                  <FilterButton
                    key={dept}
                    value={dept}
                    label={dept}
                    current={selectedDepartment}
                    onClick={setSelectedDepartment}
                  />
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[#003366] mb-2 flex items-center">
                <MapPin size={16} className="mr-1" /> Location
              </h3>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                <FilterButton
                  value="all"
                  label="Anywhere"
                  current={selectedLocation}
                  onClick={setSelectedLocation}
                />
                {locations.map((loc: string) => (
                  <FilterButton
                    key={loc}
                    value={loc}
                    label={loc}
                    current={selectedLocation}
                    onClick={setSelectedLocation}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// --- Job Listings Component ---
const JobListings = ({ jobs, loading, searchQuery, selectedDepartment, selectedLocation, setSelectedJob }: any) => {
  const filteredJobs = jobs.filter((job: Job) => {
    const departmentMatch = selectedDepartment === 'all' || job.department.toLowerCase() === selectedDepartment.toLowerCase()
    const locationMatch = selectedLocation === 'all' || job.location.toLowerCase().includes(selectedLocation.toLowerCase())
    const searchMatch = searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    return departmentMatch && locationMatch && searchMatch
  })

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="animate-spin mx-auto text-[#003366] mb-4" size={48} />
          <p className="text-gray-600">Loading job openings...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-[#003366] mb-8"
        >
          {filteredJobs.length} {filteredJobs.length === 1 ? 'Opportunity' : 'Openings'} Available
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job: Job, index: number) => (
                <JobCard
                  key={job.id}
                  job={job}
                  index={index}
                  onClick={() => setSelectedJob(job)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:col-span-2 text-center py-12 bg-gray-50 rounded-xl"
              >
                <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-xl text-gray-600 font-semibold">
                  No jobs match your current criteria.
                </p>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// --- Job Modal ---
const JobModal = ({ job, onClose, onApply }: { job: Job | null, onClose: () => void, onApply: () => void }) => {
  if (!job) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#003366]">{job.title}</h2>
            <Button onClick={onClose} variant="ghost" className="rounded-full w-10 h-10 p-0">
              <X size={24} />
            </Button>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-4 mb-6 text-sm md:text-base">
              <span className="flex items-center space-x-2 text-gray-600">
                <Building size={18} />
                <span className="capitalize">{job.department}</span>
              </span>
              <span className="flex items-center space-x-2 text-gray-600">
                <MapPin size={18} />
                <span>{job.location}</span>
              </span>
              <span className="flex items-center space-x-2 text-gray-600">
                <Clock size={18} />
                <span>{job.employmentType}</span>
              </span>
              <span className="flex items-center space-x-2 text-gray-600">
                <DollarSign size={18} />
                <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#003366] mb-4">About the Role</h3>
              <p className="text-gray-700 text-lg">{job.description}</p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#003366] mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="text-[#004488] flex-shrink-0 mt-1" size={18} />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#003366] mb-4">Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Target className="text-[#004488] flex-shrink-0 mt-1" size={18} />
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#003366] mb-4">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-[#003366]/10 text-[#003366] rounded-lg font-semibold text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#003366] mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Gift className="text-green-500 flex-shrink-0 mt-1" size={18} />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={onApply} className="flex-1">
                <Send className="mr-2" size={20} />
                Apply for this Position
              </Button>
              <Button size="lg" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// --- Application Form Modal ---
const ApplicationFormModal = ({ isOpen, onClose, selectedJob }: { isOpen: boolean, onClose: () => void, selectedJob: Job | null }) => {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    portfolioUrl: '',
    yearsExperience: '',
    coverLetter: '',
    resumeUrl: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleClose = () => {
    onClose()
    setSubmitted(false)
    setError('')
    setFormData({
      candidateName: '', email: '', phone: '', location: '', linkedinUrl: '',
      portfolioUrl: '', yearsExperience: '', coverLetter: '', resumeUrl: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!formData.candidateName || !formData.email) {
      setError("Please fill in all required fields.")
      setIsSubmitting(false)
      return
    }

    if (!selectedJob) {
      setError("No job selected.")
      setIsSubmitting(false)
      return
    }

    try {
      const result = await publicJobsApi.submitApplication(selectedJob.id, {
        ...formData,
        yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : undefined
      });

      if (result.success) {
        setSubmitted(true)
        setTimeout(() => {
          handleClose()
        }, 3000)
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
            <h2 className="text-3xl font-bold text-[#003366]">
              {selectedJob ? `Apply for ${selectedJob.title}` : 'General Application'}
            </h2>
            <Button onClick={handleClose} variant="ghost" className="rounded-full w-10 h-10 p-0">
              <X size={24} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-20"
                >
                  <CheckCircle className="mx-auto text-green-500 mb-6" size={64} />
                  <h3 className="text-3xl font-bold text-[#003366] mb-4">Application Submitted!</h3>
                  <p className="text-lg text-gray-600">
                    Thank you for your interest. We've received your application and will be in touch within a week.
                  </p>
                  <Button onClick={handleClose} className="mt-8" variant="success">
                    Close
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                >
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="space-y-6 mb-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        name="candidateName"
                        value={formData.candidateName}
                        onChange={handleChange}
                        required
                        icon={User}
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        icon={Mail}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        icon={Phone}
                      />
                      <Input
                        label="Current Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        icon={MapPin}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="LinkedIn URL"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleChange}
                        icon={Globe}
                      />
                      <Input
                        label="Portfolio/Website (Optional)"
                        name="portfolioUrl"
                        value={formData.portfolioUrl}
                        onChange={handleChange}
                        icon={ClipboardList}
                      />
                    </div>
                    <Input
                      label="Years of Experience"
                      name="yearsExperience"
                      type="number"
                      value={formData.yearsExperience}
                      onChange={handleChange}
                      icon={Briefcase}
                    />

                    <Textarea
                      label="Cover Letter (Optional)"
                      name="coverLetter"
                      placeholder="Why do you want to work with us?"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      rows={4}
                    />

                    <Input
                      label="Resume URL (Google Drive, Dropbox, etc.)"
                      name="resumeUrl"
                      value={formData.resumeUrl}
                      onChange={handleChange}
                      icon={FileText}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                    variant={isSubmitting ? 'warning' : 'primary'}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Loader2 className="animate-spin mr-3" size={20} />
                        Submitting...
                      </div>
                    ) : (
                      <>
                        Submit Application
                        <Send className="ml-2" size={20} />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// --- CTA Section ---
const CTASection = ({ setShowApplicationForm }: any) => {
  return (
    <section className="py-32 bg-gradient-to-r from-[#003366] to-[#004488]">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Rocket className="mx-auto text-[#C0C0C0] mb-6" size={64} />
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Join Us?
          </h2>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            Don't see a perfect fit? Send us your resume anyway. We're always looking for exceptional talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#C0C0C0] text-[#003366] hover:bg-[#B0B0B0]" onClick={() => setShowApplicationForm(true)}>
              <Send className="mr-2" size={20} />
              Apply Now
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#003366]">
              <Mail className="mr-2" size={20} />
              Contact Recruiting Team
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// --- Main Careers Component ---
const Careers = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      const fetchedJobs = await publicJobsApi.getJobs()
      setJobs(fetchedJobs)
      setLoading(false)
    }
    fetchJobs()
  }, [])

  // Extract unique departments and locations from jobs
  const departments = Array.from(new Set(jobs.map(job => job.department).filter(Boolean)))
  const locations = Array.from(new Set(jobs.map(job => job.location).filter(Boolean)))

  // Smooth progress bar on scroll
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Handle body scroll for modals
  useEffect(() => {
    document.body.style.overflow = (selectedJob || showApplicationForm) ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedJob, showApplicationForm])

  return (
    <div className="overflow-x-hidden bg-gray-50">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#003366] via-[#004488] to-[#C0C0C0] z-50 origin-left"
        style={{ scaleX }}
      />

      <HeroSection />
      <WhyJoinUs />
      <BenefitsSection />
      <JobFilters
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        departments={departments}
        locations={locations}
      />
      <JobListings
        jobs={jobs}
        loading={loading}
        searchQuery={searchQuery}
        selectedDepartment={selectedDepartment}
        selectedLocation={selectedLocation}
        setSelectedJob={setSelectedJob}
      />
      <CTASection setShowApplicationForm={setShowApplicationForm} />

      {/* Job Detail Modal */}
      <JobModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={() => {
          setShowApplicationForm(true)
        }}
      />

      {/* Application Form Modal */}
      <ApplicationFormModal
        isOpen={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        selectedJob={selectedJob}
      />
    </div>
  )
}

export default Careers