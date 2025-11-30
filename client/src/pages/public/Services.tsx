// @ts-nocheck
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useSpring, useInView } from 'framer-motion'
import {
  BookOpen,
  Brain,
  Lightbulb,
  ArrowRight,
  Check,
  Code,
  Database,
  Lock,
  Zap,
  Users,
  Award,
  Target,
  Briefcase,
  Globe,
  TrendingUp,
  FileText,
  MessageSquare,
  Layers,
  Cpu,
  Shield,
  Rocket,
  BarChart,
  Settings,
  Package,
  CheckCircle,
  Star,
  ChevronDown,
  Sparkles,
  Mail,
  Phone,
  Monitor,
  Cloud,
  Repeat
} from 'lucide-react'

// --- Utility Components ---

const Button = ({ children, className = '', variant = 'primary', size = 'md', onClick, type = 'button' }) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center whitespace-nowrap'
  const variants = {
    primary: 'bg-[#003366] text-white hover:bg-[#002244] shadow-md hover:shadow-lg',
    outline: 'border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white',
    ghost: 'text-[#003366] hover:bg-gray-50'
  }
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      type={type as any}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  )
}

const Card = ({ children, className = '', motionProps = {} }) => {
  return (
    <motion.div
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

// --- Service Page Components ---

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#003366] via-[#002244] to-[#001122] overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#C0C0C0] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute top-20 left-10 w-32 h-32 border-4 border-[#C0C0C0] rounded-3xl opacity-20"
        animate={{ rotate: 360, y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 border-4 border-[#C0C0C0]/60 rounded-full opacity-20"
        animate={{ rotate: -360, x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-4 relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="bg-[#C0C0C0]/20 backdrop-blur-sm rounded-full px-6 py-2 text-[#C0C0C0] font-semibold border border-[#C0C0C0]/30">
              âœ¨ Comprehensive Solutions
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            Services That Drive
            <span className="block bg-gradient-to-r from-[#C0C0C0] to-[#A0A0A0] bg-clip-text text-transparent">
              Real Impact
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
          >
            From education to AI innovation, we deliver intelligent solutions tailored to your needs
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="bg-[#C0C0C0] text-[#003366] hover:bg-[#B0B0B0]">
              <span className="flex items-center space-x-2">
                <span>Explore Services</span>
                <ArrowRight size={20} />
              </span>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#003366]">
              <span>Schedule Consultation</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown className="text-white" size={32} />
      </motion.div>
    </section>
  )
}

const ServiceCategories = ({ activeTab, setActiveTab }) => {
  const categories = [
    { id: 'education', icon: BookOpen, label: 'Education & Training', color: 'from-[#003366] to-[#004488]' },
    { id: 'ai', icon: Brain, label: 'AI & Software', color: 'from-[#003366] to-[#002244]' },
    { id: 'research', icon: Lightbulb, label: 'Research & Innovation', color: 'from-[#004488] to-[#006699]' },
  ]

  return (
    <section className="py-8 bg-white sticky top-0 z-40 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 flex-wrap">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center space-x-3 px-6 py-3 md:py-4 rounded-xl transition-all duration-300 ${
                activeTab === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon size={20} className="md:size-24" />
              <span className="font-semibold text-sm md:text-base">{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

const DetailedServices = ({ activeTab }) => {
  const services = {
    education: {
      title: 'Education & Training Services',
      subtitle: 'Empowering learners through innovative educational solutions',
      services: [
        {
          icon: BookOpen,
          title: 'Course Creation & Design',
          description: 'Custom curriculum development aligned with UK standards and industry needs',
          features: [
            'Learning objectives mapping',
            'Interactive content development',
            'Assessment design',
            'Multimedia integration',
            'Accessibility compliance'
          ]
        },
        {
          icon: Users,
          title: 'Training Delivery',
          description: 'Blended learning experiences combining online and face-to-face instruction',
          features: [
            'Live virtual classrooms',
            'In-person workshops',
            'Self-paced modules',
            'Group facilitation',
            'Coaching & mentoring'
          ]
        },
        {
          icon: Globe,
          title: 'Learning Platform Development',
          description: 'Custom LMS and educational technology solutions',
          features: [
            'Platform customization',
            'Content management systems',
            'Analytics & reporting',
            'Mobile-responsive design',
            'Integration services'
          ]
        },
        {
          icon: Award,
          title: 'Professional Certifications',
          description: 'Industry-recognized certification programs',
          features: [
            'Certification design',
            'Assessment frameworks',
            'Digital badge systems',
            'Continuing education',
            'Skills validation'
          ]
        },
        {
          icon: Target,
          title: 'Corporate Training',
          description: 'Tailored training solutions for business teams',
          features: [
            'Skills gap analysis',
            'Leadership development',
            'Technical training',
            'Soft skills workshops',
            'ROI measurement'
          ]
        },
        {
          icon: FileText,
          title: 'Educational Consulting',
          description: 'Strategic guidance for educational institutions',
          features: [
            'Program evaluation',
            'Curriculum audits',
            'Quality assurance',
            'Accreditation support',
            'Change management'
          ]
        }
      ]
    },
    ai: {
      title: 'AI & Software Development',
      subtitle: 'Building intelligent systems for the digital age',
      services: [
        {
          icon: Brain,
          title: 'Custom AI Solutions',
          description: 'Bespoke artificial intelligence systems tailored to your business',
          features: [
            'Machine learning models',
            'Natural language processing',
            'Computer vision systems',
            'Predictive analytics',
            'AI strategy consulting'
          ]
        },
        {
          icon: Code,
          title: 'Software Development',
          description: 'Full-stack development services for web and mobile',
          features: [
            'Web applications',
            'Mobile apps (iOS/Android)',
            'API development',
            'Cloud solutions',
            'Legacy modernization'
          ]
        },
        {
          icon: Zap,
          title: 'Process Automation',
          description: 'Streamline operations with intelligent automation',
          features: [
            'Workflow automation',
            'RPA implementation',
            'Document processing',
            'Data integration',
            'Task orchestration'
          ]
        },
        {
          icon: Lock,
          title: 'Cybersecurity Solutions',
          description: 'Protect your digital assets with robust security',
          features: [
            'Security audits',
            'Penetration testing',
            'Compliance management',
            'Incident response',
            'Security training'
          ]
        },
        {
          icon: Database,
          title: 'Data Engineering',
          description: 'Build scalable data infrastructure and pipelines',
          features: [
            'Data warehouse design',
            'ETL pipelines',
            'Real-time processing',
            'Data governance',
            'Analytics platforms'
          ]
        },
        {
          icon: Cpu,
          title: 'AI Integration Services',
          description: 'Seamlessly integrate AI into existing systems',
          features: [
            'System assessment',
            'API integration',
            'Model deployment',
            'Performance optimization',
            'Ongoing support'
          ]
        }
      ]
    },
    research: {
      title: 'Research & Innovation',
      subtitle: 'Pioneering solutions for tomorrow\'s challenges',
      services: [
        {
          icon: Lightbulb,
          title: 'Innovation Consulting',
          description: 'Strategic guidance for research and development initiatives',
          features: [
            'Innovation workshops',
            'Technology roadmaps',
            'Feasibility studies',
            'Competitive analysis',
            'Trend forecasting'
          ]
        },
        {
          icon: Layers,
          title: 'Prototype Development',
          description: 'Rapid prototyping and proof-of-concept development',
          features: [
            'Concept validation',
            'MVP development',
            'User testing',
            'Iterative design',
            'Technical documentation'
          ]
        },
        {
          icon: BarChart,
          title: 'Research Projects',
          description: 'Collaborative research in AI, education, and technology',
          features: [
            'Applied research',
            'Academic partnerships',
            'Grant applications',
            'Research publications',
            'Knowledge transfer'
          ]
        },
        {
          icon: Shield,
          title: 'Ethical AI Research',
          description: 'Developing responsible and transparent AI systems',
          features: [
            'Bias detection',
            'Fairness assessment',
            'Explainable AI',
            'Privacy preservation',
            'Ethics frameworks'
          ]
        },
        {
          icon: Rocket,
          title: 'Technology Incubation',
          description: 'Supporting startups and innovative ventures',
          features: [
            'Technical mentorship',
            'Product validation',
            'Market research',
            'Investor readiness',
            'Go-to-market strategy'
          ]
        },
        {
          icon: FileText,
          title: 'Technical Documentation',
          description: 'Comprehensive documentation for complex systems',
          features: [
            'White papers',
            'Technical specifications',
            'User manuals',
            'API documentation',
            'Research reports'
          ]
        }
      ]
    }
  }

  const currentServices = services[activeTab]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            {currentServices.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentServices.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentServices.services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const ServiceCard = ({ service, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="h-full hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#004488] rounded-2xl flex items-center justify-center mb-6"
        >
          <service.icon className="text-white" size={32} />
        </motion.div>

        {/* This line was the problematic one in the previous error (but is correct here) */}
        <h3 className="text-2xl font-bold text-[#003366] mb-3 group-hover:text-[#004488] transition-colors">
          {service.title}
        </h3>

        <p className="text-gray-600 mb-6">{service.description}</p>

        <div className="space-y-2">
          {service.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 + idx * 0.05 }}
              className="flex items-start space-x-2"
            >
              <CheckCircle className="text-[#004488] flex-shrink-0 mt-1" size={16} />
              <span className="text-sm text-gray-700">{feature}</span>
            </motion.div>
          ))}
        </div>

        <Button className="w-full mt-6">
          <span className="flex items-center justify-center space-x-2">
            <span>Learn More</span>
            <ArrowRight size={16} />
          </span>
        </Button>
      </Card>
    </motion.div>
  )
}

const Interactive3DSection = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const sectionRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const x = (e.clientY - rect.top - rect.height / 2) / 20
      const y = (e.clientX - rect.left - rect.width / 2) / 20
      setRotation({ x, y })
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('mousemove', handleMouseMove)
      section.addEventListener('mouseleave', () => setRotation({ x: 0, y: 0 }))
      return () => {
        section.removeEventListener('mousemove', handleMouseMove)
        section.removeEventListener('mouseleave', () => setRotation({ x: 0, y: 0 }))
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-[#003366] via-[#002244] to-[#001122] overflow-hidden relative"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Experience Our <span className="text-[#C0C0C0]">Interactive Approach</span>
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              We combine cutting-edge technology with human-centered design to create solutions that are both powerful and intuitive.
            </p>
            <ul className="space-y-4">
              {[
                'Collaborative development process',
                'Real-time feedback and iterations',
                'Transparent project management',
                'Continuous improvement mindset'
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <Sparkles className="text-[#C0C0C0]" size={20} />
                  <span className="text-lg">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            style={{
              rotateX: rotation.x,
              rotateY: rotation.y,
              transformStyle: 'preserve-3d',
              perspective: 1000,
              transition: 'transform 0.5s ease-out'
            }}
            className="relative h-96 hidden md:flex items-center justify-center"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-64 h-64 border-4 border-[#C0C0C0] rounded-3xl opacity-50"
                  style={{
                    transform: `translateZ(${(i - 1) * 50}px) rotateY(${i * 20}deg)`,
                  }}
                  animate={{
                    rotateZ: 360,
                  }}
                  transition={{
                    duration: 20 + i * 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
              <div className="absolute w-32 h-32 bg-[#C0C0C0] rounded-full flex items-center justify-center shadow-2xl">
                <Cpu className="text-[#003366]" size={48} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const ProcessTimeline = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: 'Discovery & Consultation',
      description: 'We start by understanding your needs, challenges, and goals',
      color: 'from-[#003366] to-[#004488]'
    },
    {
      icon: Target,
      title: 'Strategy & Planning',
      description: 'Develop a comprehensive roadmap tailored to your objectives',
      color: 'from-[#004488] to-[#005599]'
    },
    {
      icon: Settings,
      title: 'Development & Implementation',
      description: 'Execute the plan with precision and regular updates',
      color: 'from-[#005599] to-[#0066AA]'
    },
    {
      icon: BarChart,
      title: 'Testing & Quality Assurance',
      description: 'Rigorous testing to ensure excellence and reliability',
      color: 'from-[#0066AA] to-[#0077BB]'
    },
    {
      icon: Rocket,
      title: 'Launch & Deployment',
      description: 'Smooth rollout with comprehensive support',
      color: 'from-[#0077BB] to-[#0088CC]'
    },
    {
      icon: TrendingUp,
      title: 'Optimization & Support',
      description: 'Continuous improvement and ongoing assistance',
      color: 'from-[#0088CC] to-[#0099DD]'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Our Proven Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A structured approach that ensures successful project delivery
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#003366] via-[#004488] to-[#0088CC]" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center md:items-start ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                  <Card className="inline-block hover:shadow-xl transition-shadow w-full md:w-auto">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-4 ${
                        index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'
                      }`}
                    >
                      <step.icon className="text-white" size={32} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-[#003366] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </Card>
                </div>

                <div className="hidden md:flex w-2/12 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    className="w-8 h-8 bg-[#C0C0C0] rounded-full border-4 border-white shadow-lg z-10"
                  />
                </div>

                <div className="hidden md:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const IndustrySolutions = () => {
  const industries = [
    {
      icon: Briefcase,
      title: 'Enterprise & Corporate',
      description: 'Scalable solutions for large organizations',
      solutions: ['Digital transformation', 'Process automation', 'Data analytics']
    },
    {
      icon: BookOpen,
      title: 'Education & Training',
      description: 'Innovative learning platforms and content',
      solutions: ['E-learning systems', 'Virtual classrooms', 'Assessment tools']
    },
    {
      icon: Shield,
      title: 'Healthcare & Life Sciences',
      description: 'Secure and compliant healthcare solutions',
      solutions: ['Patient management', 'Data security', 'AI diagnostics']
    },
    {
      icon: TrendingUp,
      title: 'Finance & Banking',
      description: 'Robust financial technology solutions',
      solutions: ['Risk analytics', 'Fraud detection', 'Automated compliance']
    },
    {
      icon: Package,
      title: 'Retail & E-commerce',
      description: 'Customer-centric digital experiences',
      solutions: ['Personalization', 'Inventory optimization', 'Customer insights']
    },
    {
      icon: Globe,
      title: 'Government & Public Sector',
      description: 'Citizen-focused digital services',
      solutions: ['Digital services', 'Data governance', 'Public platforms']
    }
  ]
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Industry-Specific Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tailored services for diverse sectors and markets
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-[#003366]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <industry.icon className="text-[#003366]" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[#003366]">{industry.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{industry.description}</p>
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p className="font-semibold text-gray-700 text-sm mb-1">Key Solutions:</p>
                  {industry.solutions.map((solution, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Check className="text-[#004488]" size={14} />
                      <span className="text-sm text-gray-700">{solution}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ContactSection = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-[#004488] to-[#002244] text-white">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl text-gray-200 mb-8">
                        Let's discuss how our intelligent solutions can drive your next success story.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-[#C0C0C0] text-[#003366] hover:bg-[#B0B0B0] shadow-xl">
                            <span className="flex items-center space-x-2">
                                <Mail size={20} />
                                <span>Get a Free Quote</span>
                            </span>
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="border-white text-white hover:bg-white hover:text-[#003366]"
                        >
                            <span className="flex items-center space-x-2">
                                <Phone size={20} />
                                <span>Call Us Today</span>
                            </span>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default function Services() {
  const [activeTab, setActiveTab] = useState('education')
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#C0C0C0] z-50 origin-[0%]" style={{ scaleX }} />

      <HeroSection />
      
      <ServiceCategories activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <DetailedServices activeTab={activeTab} />
      
      <Interactive3DSection />
      
      <ProcessTimeline />

      <IndustrySolutions />

      <ContactSection />
    </div>
  )
}