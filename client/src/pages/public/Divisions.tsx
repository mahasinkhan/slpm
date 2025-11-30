// src/pages/public/Divisions.tsx
import { motion } from 'framer-motion'
import {
  BookOpen,
  Brain,
  Lightbulb,
  GraduationCap,
  Users,
  Award,
  Code,
  Shield,
  Database,
  FlaskConical,
  FileText,
  Target,
  CheckCircle,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Settings,
  Zap,
  Globe,
  Lock,
  Cpu,
  BarChart,
  BookMarked,
  Calendar,
  Clock,
  DollarSign,
  Microscope,
  Rocket,
  LineChart
} from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import { Link } from 'react-router-dom'

const Divisions = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <DivisionsHero />

      {/* Overview Stats */}
      <DivisionsOverview />

      {/* Education & Training Division */}
      <EducationDivision />

      {/* AI & Software Division */}
      <AISoftwareDivision />

      {/* Research & Innovation Division */}
      <ResearchDivision />

      {/* Comparison Table */}
      <DivisionsComparison />

      {/* Success Stories */}
      <SuccessStories />

      {/* CTA Section */}
      <DivisionsCTA />
    </div>
  )
}

// Hero Section
const DivisionsHero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-primary via-primary-dark to-primary-light overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="absolute top-10 left-10 w-64 h-64 animate-spin-slow" viewBox="0 0 200 200" fill="white">
            <circle cx="100" cy="100" r="80" opacity="0.3" />
            <circle cx="100" cy="100" r="60" opacity="0.5" />
            <circle cx="100" cy="100" r="40" opacity="0.7" />
          </svg>
          <svg className="absolute bottom-10 right-10 w-80 h-80 animate-pulse" viewBox="0 0 200 200" fill="#C0C0C0">
            <polygon points="100,10 190,60 190,140 100,190 10,140 10,60" opacity="0.3" />
          </svg>
        </div>
      </div>

      <div className="container-custom relative z-10 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-full">
              <BookOpen className="text-accent" size={24} />
              <div className="w-px h-6 bg-accent" />
              <Brain className="text-accent" size={24} />
              <div className="w-px h-6 bg-accent" />
              <Lightbulb className="text-accent" size={24} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight"
          >
            Three Divisions,<br />
            <span className="text-accent">Infinite Possibilities</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-accent-light mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            From empowering learners to building intelligent systems and pioneering research â€”
            we deliver comprehensive solutions that transform industries
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a href="#education">
              <Button size="lg" className="bg-white text-primary hover:bg-accent">
                Education & Training
              </Button>
            </a>
            <a href="#ai-software">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                AI & Software
              </Button>
            </a>
            <a href="#research">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Research & Innovation
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}

// Overview Stats
const DivisionsOverview = () => {
  const stats = [
    { icon: BookOpen, number: '3', label: 'Major Divisions', color: 'from-blue-500 to-blue-600' },
    { icon: Users, number: '50+', label: 'Industry Partners', color: 'from-purple-500 to-purple-600' },
    { icon: Globe, number: '10+', label: 'Countries Served', color: 'from-green-500 to-green-600' },
    { icon: Award, number: '100%', label: 'UK Compliance', color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <section className="py-16 md:py-20 bg-white relative -mt-20 z-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-2xl transition-shadow">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="text-white" size={32} />
                </div>
                <div className="text-4xl font-black text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Education & Training Division
const EducationDivision = () => {
  const offerings = [
    {
      icon: GraduationCap,
      title: 'Vocational & CPD Programmes',
      description: 'Industry-recognized qualifications that advance careers',
      details: ['OFQUAL regulated', 'Level 3-7 qualifications', 'Online & blended delivery']
    },
    {
      icon: Users,
      title: 'Corporate Training',
      description: 'Tailored workforce development solutions',
      details: ['Custom course design', 'On-site delivery', 'Assessment & certification']
    },
    {
      icon: BookMarked,
      title: 'E-Learning Platforms',
      description: 'Modern learning management systems',
      details: ['LMS setup', 'Content creation', '24/7 access']
    },
    {
      icon: Award,
      title: 'Compliance Training',
      description: 'Keep your workforce certified',
      details: ['GDPR & data protection', 'Health & safety', 'Industry-specific']
    }
  ]

  const benefits = [
    { icon: Clock, text: 'Flexible learning schedules' },
    { icon: DollarSign, text: 'Cost-effective solutions' },
    { icon: TrendingUp, text: 'Career advancement' },
    { icon: CheckCircle, text: 'Accredited certificates' },
  ]

  return (
    <section id="education" className="section-padding bg-gradient-to-br from-blue-50 via-white to-blue-50 scroll-mt-20">
      <div className="container-custom">
        {/* Division Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-3 bg-blue-100 px-6 py-3 rounded-full mb-6">
            <BookOpen className="text-blue-600" size={28} />
            <span className="text-blue-600 font-bold text-lg">Education & Training Division</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-6">
            Empowering Learners Through<br />Modern Education
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Flexible, blended learning solutions combining online training, face-to-face instruction,
            and professional qualifications that meet UK industry standards
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Left: Image & Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl transform rotate-3 scale-105" />
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
                alt="Education & Training"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-primary">UK Standards</div>
                    <div className="text-sm text-gray-600">Fully Compliant</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Our Approach</h3>
              <p className="text-gray-600 leading-relaxed">
                We combine traditional teaching methods with cutting-edge e-learning technology to deliver engaging and effective professional development. Our programmes are designed by industry experts to ensure immediate applicability in the workplace.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {benefits.map((benefit) => (
                  <div key={benefit.text} className="flex items-center space-x-3">
                    <benefit.icon className="text-blue-600 flex-shrink-0" size={20} />
                    <span className="text-primary font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Offerings Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid gap-6"
          >
            {offerings.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {item.description}
                      </p>
                      <ul className="space-y-1">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-500">
                            <CheckCircle className="text-blue-600 flex-shrink-0" size={16} />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" className="group">
                <span className="flex items-center space-x-2">
                  <span>View All Courses</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">Enquire About Corporate Training</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// AI & Software Division (NEW)
const AISoftwareDivision = () => {
  const services = [
    {
      icon: Cpu,
      title: 'Custom AI/ML Solutions',
      description: 'Building bespoke intelligent models for business problems',
      details: ['Predictive Analytics', 'Natural Language Processing', 'Computer Vision']
    },
    {
      icon: Code,
      title: 'Enterprise Software Development',
      description: 'Scalable, secure, and robust business applications',
      details: ['Full-Stack Development', 'Cloud Architecture (AWS/Azure)', 'Legacy System Modernization']
    },
    {
      icon: BarChart,
      title: 'Data & Business Intelligence',
      description: 'Transforming raw data into actionable insights',
      details: ['Data Warehousing', 'Real-time Dashboards', 'Big Data Processing']
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Ensuring your digital assets are protected and compliant',
      details: ['Cybersecurity Consulting', 'Data Governance', 'GDPR/ISO Compliance']
    }
  ]

  const metrics = [
    { icon: LineChart, number: '30%', label: 'Average Efficiency Gain' },
    { icon: Database, number: '10TB+', label: 'Data Managed Daily' },
    { icon: Zap, number: '100+', label: 'Successful Deployments' },
  ]

  return (
    <section id="ai-software" className="section-padding bg-gradient-to-br from-purple-50 via-white to-purple-50 scroll-mt-20">
      <div className="container-custom">
        {/* Division Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-3 bg-purple-100 px-6 py-3 rounded-full mb-6">
            <Brain className="text-purple-600" size={28} />
            <span className="text-purple-600 font-bold text-lg">AI & Software Division</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-6">
            Building the Intelligent<br />Future of Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our expert team designs, develops, and deploys high-performance AI models and enterprise software
            that drive digital transformation and competitive advantage.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Left: Services Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid gap-6"
          >
            {services.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-purple-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {item.description}
                      </p>
                      <ul className="space-y-1">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-500">
                            <CheckCircle className="text-purple-600 flex-shrink-0" size={16} />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Image & Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl transform -rotate-3 scale-105" />
              <img
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80"
                alt="AI & Software Development"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Settings className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-primary">High Performance</div>
                    <div className="text-sm text-gray-600">Secure & Scalable</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 text-center shadow-md"
                >
                  <metric.icon className="text-purple-600 mx-auto mb-2" size={32} />
                  <div className="text-xl font-black text-primary">{metric.number}</div>
                  <div className="text-xs text-gray-600">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/portfolio">
              <Button size="lg" className="group">
                <span className="flex items-center space-x-2">
                  <span>View Our Portfolio</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">Schedule a Consultation</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Research & Innovation Division (Corrected Component Name)

// Missing data for ResearchDivision
const focusAreas = [
  {
    icon: Rocket,
    title: 'Advanced AI Methodologies',
    description: 'Pioneering work in explainable and reliable AI (XAI/RAI)',
    details: ['Causal Inference', 'Model Interpretability', 'Adversarial Robustness']
  },
  {
    icon: Microscope,
    title: 'Sustainable Technology',
    description: 'Researching technologies for a greener, more efficient future',
    details: ['Energy-Efficient Computing', 'Resource Optimisation', 'Climate Modelling']
  },
  {
    icon: FileText,
    title: 'Industry Whitepapers & Publications',
    description: 'Sharing knowledge to drive industry standards forward',
    details: ['Open Access Publications', 'Policy Recommendations', 'Standardisation']
  },
];


const ResearchDivision = () => {
  // Existing data from the incomplete block:
  const researchPrinciples = [
    { icon: Lock, title: 'Ethical Innovation', description: 'Every project adheres to strict ethical guidelines' },
    { icon: Globe, title: 'Global Impact', description: 'Solutions designed to benefit society worldwide' },
    { icon: Users, title: 'Collaborative', description: 'Working with universities and industry partners' },
    { icon: Target, title: 'Goal-Oriented', description: 'Research with practical applications' },
  ]

  return (
    <section id="research" className="section-padding bg-gradient-to-br from-green-50 via-white to-green-50 scroll-mt-20">
      <div className="container-custom">
        {/* Division Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-3 bg-green-100 px-6 py-3 rounded-full mb-6">
            <Lightbulb className="text-green-600" size={28} />
            <span className="text-green-600 font-bold text-lg">Research & Innovation Division</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-6">
            Driving Responsible<br />Discovery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The creative core of SL Brothers Ltd â€” designing and testing forward-thinking ideas that shape future technologies
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Left: Image & Featured Lab */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl transform rotate-3 scale-105" />
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
                alt="Research & Innovation"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FlaskConical className="text-green-600" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-primary">Innovation Hub</div>
                    <div className="text-sm text-gray-600">FutureVision Lab</div>
                  </div>
                </div>
              </div>
            </div>

            {/* FutureVision Lab Card */}
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="text-white" size={28} />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1 text-green-100">FLAGSHIP INITIATIVE</div>
                  <h3 className="text-2xl font-bold mb-2">FutureVision Lab</h3>
                  <p className="text-green-100 mb-4">
                    Our internal research programme exploring safe and sustainable AI methodologies
                    for the benefit of society
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full text-sm">Ethical AI</span>
                    <span className="bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full text-sm">Sustainability</span>
                    <span className="bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full text-sm">Open Research</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Research Principles */}
            <div className="grid grid-cols-2 gap-4">
              {researchPrinciples.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all"
                >
                  <principle.icon className="text-green-600 mb-2" size={24} />
                  <div className="font-bold text-primary text-sm mb-1">{principle.title}</div>
                  <div className="text-xs text-gray-600">{principle.description}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Focus Areas */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid gap-6"
          >
            {focusAreas.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-green-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {item.description}
                      </p>
                      <ul className="space-y-1">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-500">
                            <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* SIC Code */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 md:p-12 text-white mb-12"
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-black mb-2">SIC Code: 72190</h3>
              <p className="text-green-100">R&D in natural sciences and engineering</p>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-bold mb-4 text-xl">Secondary Codes:</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                  <div className="font-bold mb-1">72200</div>
                  <div className="text-sm text-green-100">Social sciences R&D</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                  <div className="font-bold mb-1">74909</div>
                  <div className="text-sm text-green-100">Professional, scientific & technical</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects">
              <Button size="lg" className="group">
                <span className="flex items-center space-x-2">
                  <span>Explore Research Projects</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">Partner With Us</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Divisions Comparison Table
const DivisionsComparison = () => {
  const comparison = [
    {
      feature: 'Primary Focus',
      education: 'Professional Development',
      ai: 'Digital Transformation',
      research: 'Innovation & Discovery'
    },
    {
      feature: 'Target Audience',
      education: 'Learners & Corporations',
      ai: 'Businesses & Enterprises',
      research: 'Academia & Industry'
    },
    {
      feature: 'Delivery Method',
      education: 'Blended Learning',
      ai: 'Custom Solutions',
      research: 'Collaborative Projects'
    },
    {
      feature: 'Timeframe',
      education: 'Weeks to Months',
      ai: 'Months to Years',
      research: 'Ongoing'
    },
    {
      feature: 'Certification',
      education: 'UK Accredited',
      ai: 'Industry Standards',
      research: 'Publications & Patents'
    },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Division Comparison
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding how our divisions complement each other
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full bg-white rounded-xl shadow-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-primary-dark text-white">
                <th className="px-6 py-4 text-left font-bold">Feature</th>
                <th className="px-6 py-4 text-center font-bold">
                  <div className="flex items-center justify-center space-x-2">
                    <BookOpen size={20} />
                    <span>Education</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center font-bold">
                  <div className="flex items-center justify-center space-x-2">
                    <Brain size={20} />
                    <span>AI & Software</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center font-bold">
                  <div className="flex items-center justify-center space-x-2">
                    <Lightbulb size={20} />
                    <span>Research</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, index) => (
                <motion.tr
                  key={row.feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-primary">{row.feature}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{row.education}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{row.ai}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{row.research}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}

// Success Stories
const SuccessStories = () => {
  const stories = [
    {
      division: 'Education',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      title: 'Corporate Training Programme',
      client: 'Major UK Financial Institution',
      result: '500+ employees upskilled in 6 months',
      metrics: ['95% completion rate', '40% productivity increase', '100% satisfaction'],
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
    },
    {
      division: 'AI & Software',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      title: 'AI-Powered Analytics Platform',
      client: 'Healthcare Provider Network',
      result: 'Reduced diagnosis time by 60%',
      metrics: ['10,000+ patients served', '99.2% accuracy', 'Â£2M cost savings'],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
    },
    {
      division: 'Research',
      icon: Lightbulb,
      color: 'from-green-500 to-green-600',
      title: 'Ethical AI Framework',
      client: 'University Collaboration',
      result: '3 patents filed, 5 publications',
      metrics: ['2 years of research', 'Industry adoption', 'Policy influence'],
      image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80'
    },
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real results from our divisions working with clients across industries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden p-0 h-full hover:shadow-2xl transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 left-4 bg-gradient-to-br ${story.color} text-white px-4 py-2 rounded-full flex items-center space-x-2`}>
                    <story.icon size={20} />
                    <span className="font-semibold">{story.division}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">{story.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{story.client}</p>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold text-primary mb-1">{story.result}</div>
                  </div>
                  <div className="space-y-2">
                    {story.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="text-green-600 flex-shrink-0" size={16} />
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
const DivisionsCTA = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-primary via-primary-dark to-primary-light text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="absolute top-20 left-20 w-64 h-64 animate-spin-slow" viewBox="0 0 200 200" fill="white">
            <circle cx="100" cy="100" r="80" opacity="0.2" />
          </svg>
          <svg className="absolute bottom-20 right-20 w-96 h-96 animate-pulse" viewBox="0 0 200 200" fill="#C0C0C0">
            <polygon points="100,10 190,60 190,140 100,190 10,140 10,60" opacity="0.2" />
          </svg>
        </div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Ready to Transform<br />Your Business?
          </h2>
          <p className="text-xl md:text-2xl text-accent-light mb-12 leading-relaxed">
            Whether you need education solutions, AI development, or research partnerships,<br className="hidden md:block" />
            our expert divisions are here to help you succeed
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur-lg text-white border-0">
              <BookOpen className="mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Education</h3>
              <p className="text-sm text-accent-light mb-4">Transform your workforce</p>
              <Link to="/contact">
                <Button className="w-full bg-white text-primary hover:bg-accent">Get Started</Button>
              </Link>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg text-white border-0">
              <Brain className="mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">AI & Software</h3>
              <p className="text-sm text-accent-light mb-4">Build intelligent systems</p>
              <Link to="/contact">
                <Button className="w-full bg-white text-primary hover:bg-accent">Request Demo</Button>
              </Link>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg text-white border-0">
              <Lightbulb className="mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Research</h3>
              <p className="text-sm text-accent-light mb-4">Partner on innovation</p>
              <Link to="/contact">
                <Button className="w-full bg-white text-primary hover:bg-accent">Collaborate</Button>
              </Link>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-accent">
                <span className="flex items-center space-x-2">
                  <span>Get in Touch</span>
                  <ArrowRight size={20} />
                </span>
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                View All Services
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Divisions