import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Target, 
  Award, 
  Users, 
  Globe, 
  TrendingUp, 
  Shield,
  Heart,
  Zap,
  BookOpen,
  CheckCircle,
  MapPin,
  ArrowRight,
  Briefcase,
  Star, // Added for testimonials
  MessageSquare, // Added for testimonials
  Code // Added for divisions
} from 'lucide-react'
// Assuming these are custom components available in your project structure
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import { Link } from 'react-router-dom'
import React, { useRef } from 'react'

// --- Main About Component ---
const About = () => {
  return (
    <div className="overflow-x-hidden bg-gray-50">
      {/* Hero Section - UPDATED WITH 3D GRID WAVE */}
      <HeroSection />
      
      {/* Mission & Vision */}
      <MissionVision />
      
      {/* Core Values */}
      <CoreValues />
      
      {/* Our Story */}
      <OurStory />
      
      {/* NEW: Testimonials / Customer Impact */}
      <CustomerImpact /> 
      
      {/* Why Choose Us */}
      <WhyChooseUs />
      
      {/* Company Info */}
      <CompanyInfo />
      
      {/* Call to Action */}
      <CallToAction />
    </div>
  )
}



const HeroSection = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Parallax: Text moves up faster than the background
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  return (
    <section 
      ref={ref}
      className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden"
    >
      
      {/* --- UPDATED: 3D Animated-Look Background Effect --- 
        Uses multiple layers for depth and glow to simulate a futuristic, 
        animated/3D wireframe network.
      */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundColor: '#0d111b', // Deep dark blue background
        }}
      >
        {/* Layer 1: Core grid pattern (fainter) */}
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{
            backgroundImage: `
              radial-gradient(circle at center, rgba(30, 58, 138, 0.2) 1px, transparent 0),
              linear-gradient(to right, rgba(23, 37, 84, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(23, 37, 84, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px, 40px 40px',
          }}
        />
        
        {/* Layer 2: Animated Data Lines (CSS Animation for simulated motion) */}
        <motion.div
          initial={{ rotateX: '80deg', y: '100%', opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 perspective-1000 origin-bottom"
          style={{
            // Tilt and position the grid for a 3D ground effect
            transform: 'perspective(1000px) rotateX(75deg) translateY(10%) scale(1.5)', 
            
            // This class simulates an 'animated' vertical flow of data points/lights
            background: `
              repeating-linear-gradient(
                0deg, 
                rgba(30, 64, 175, 0.4), 
                rgba(59, 130, 246, 0) 15px
              )
            `,
            animation: 'flow 10s linear infinite', // Custom CSS animation needed
          }}
        />

        
        
        {/* Layer 3: Radial Glow at center */}
        <div className="absolute inset-0 bg-radial-gradient from-primary/30 via-transparent to-transparent opacity-50 z-5" />
      </div>

      {/* Dark overlay to ensure text is readable */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 via-primary-dark/50 to-primary-dark/80 z-10" />

      {/* Content */}
      <div className="container-custom relative z-20">
        <motion.div
          style={{ y }} // Apply parallax
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">SL Brothers</span> Ltd
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-accent-light/80 leading-relaxed"
          >
            Building the future through learning, technology, and innovation since October 2025
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// =========================================================================
// --- Other Original Sections (Unchanged) ---
// =========================================================================

// Mission & Vision
const MissionVision = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], ['1', '1.15'])

  return (
    <section ref={ref} className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-start space-x-4 mb-12">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                <Target className="text-primary" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary mb-4 tracking-tighter">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To **empower individuals and organizations** through innovative education, cutting-edge technology, 
                  and groundbreaking research. We are committed to creating sustainable, ethical, and impactful 
                  solutions that drive real-world change.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-accent/20">
                <TrendingUp className="text-accent" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary mb-4 tracking-tighter">Our Vision</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To become a **global leader** in bridging education, artificial intelligence, and researchâ€”creating 
                  a future where technology enhances human potential and drives positive societal transformation.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-accent/80 rounded-3xl transform rotate-3 scale-105 shadow-xl" />
              <div className="relative rounded-3xl shadow-2xl overflow-hidden aspect-video">
                <motion.img
                  style={{ scale }}
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="SL Brothers Team collaborating"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Core Values
const CoreValues = () => {
  const values = [
    { icon: Zap, title: 'Innovation', description: 'Pushing boundaries with creative and forward-thinking solutions', color: 'from-yellow-400 to-orange-500' },
    { icon: Award, title: 'Excellence', description: 'Delivering exceptional quality in everything we do', color: 'from-blue-400 to-blue-600' },
    { icon: Shield, title: 'Integrity', description: 'Operating with transparency, ethics, and accountability', color: 'from-green-400 to-green-600' },
    { icon: Users, title: 'Collaboration', description: 'Working together to achieve greater collective impact', color: 'from-purple-400 to-purple-600' },
    { icon: Globe, title: 'Sustainability', description: 'Building solutions for long-term environmental and social success', color: 'from-teal-400 to-teal-600' },
    { icon: Heart, title: 'Empowerment', description: 'Enabling individuals to reach their full potential', color: 'from-pink-400 to-pink-600' },
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
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tighter">
            Our Core Values ðŸ’Ž
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The principles that guide everything we do at SL Brothers Ltd
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative p-1 h-full rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent
                             hover:from-primary/20 hover:to-accent/20 transition-all duration-300">
                <Card className="text-center h-full !p-8 hover:shadow-xl transition-shadow">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <value.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Our Story - Reimagined as a Timeline
const OurStory = () => {
  const storyPoints = [
    {
      icon: Briefcase,
      title: 'The Spark (Oct 2025)',
      text: 'Founded by a team of passionate educators, technologists, and researchers, we recognized a critical need to bridge the gap between AI and ethical, human-centered approaches.'
    },
    {
      icon: Code,
      title: 'The Blueprint',
      text: 'Rapid development of our core AI platforms and educational curricula, focusing on scalable and UK-compliant solutions for our first major clients.'
    },
    {
      icon: BookOpen,
      title: 'Our Divisions Take Shape',
      text: 'What started as a bold idea has grown into a multidisciplinary company operating across Education & Training, AI & Software Development, and Research & Innovation.'
    },
    {
      icon: Globe,
      title: 'Expanding Our Reach',
      text: 'SL Brothers Ltd secures international partnerships, delivering tailored educational technology solutions to organizations outside the UK.'
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tighter">
            Our Journey: A Timeline
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Formed on **23rd October 2025** in London, United Kingdom.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* The Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 h-full w-0.5 bg-primary/20" />
          
          <div className="space-y-16">
            {storyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                // Conditional class for alternating layout
                className={`relative flex items-start ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Icon & Dot */}
                <div className={`flex-shrink-0 relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-primary rounded-full 
                                 ${index % 2 === 0 ? 'md:translate-x-[-50%] md:left-1/2' : 'md:translate-x-[50%] md:right-1/2'} 
                                 left-0 md:static`}
                >
                  <point.icon className="text-primary" size={24} />
                </div>

                {/* Content */}
                <div className={`ml-6 md:ml-0 md:w-1/2 p-4 rounded-lg shadow-sm border border-gray-100 bg-gray-50 
                                 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} 
                                 ${index % 2 !== 0 ? 'md:order-1' : ''}`} // Adjusts content position for alternating
                >
                  <h3 className="text-2xl font-bold text-primary mb-2">{point.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{point.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// --- Customer Impact / Testimonials Section ---
const CustomerImpact = () => {
    const testimonials = [
      { 
          quote: 'SL Brothers transformed our internal training. The blend of cutting-edge AI and human-centric education is unmatched.', 
          name: 'Sarah K.', 
          title: 'Head of Learning, TechCorp UK' 
      },
      { 
          quote: 'Their ethical AI framework was crucial for our project success. Integrity is clearly a core part of their DNA.', 
          name: 'Dr. Alistair R.', 
          title: 'Chief Innovation Officer, Global Research Firm' 
      },
      { 
          quote: 'We now have a scalable software solution that meets all UK regulatory standards, delivered ahead of schedule.', 
          name: 'Mark B.', 
          title: 'Operations Director, Financial Services' 
      },
    ]

    return (
      <section className="section-padding bg-primary-dark/5">
          <div className="container-custom">
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
              >
                  <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tighter">
                      Driving Real-World Impact ðŸŒŸ
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      See what our partners and clients say about working with our multidisciplinary teams.
                  </p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                  {testimonials.map((t, index) => (
                      <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15, duration: 0.6 }}
                          className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                      >
                          <MessageSquare className="text-accent mb-4 w-10 h-10" />
                          <p className="text-xl italic text-gray-800 mb-6 leading-relaxed">
                              "{t.quote}"
                          </p>
                          <div>
                              <div className="flex text-yellow-500 mb-2">
                                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                              </div>
                              <p className="font-bold text-primary">{t.name}</p>
                              <p className="text-sm text-gray-500">{t.title}</p>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>
    )
}

// Why Choose Us
const WhyChooseUs = () => {
  const reasons = [
    { title: 'Multidisciplinary Expertise', description: 'Unique combination of education, AI technology, and research capabilities.' },
    { title: 'London-Based Excellence', description: 'Strategically located in the heart of London, serving UK and international clients.' },
    { title: 'Ethical AI Development', description: 'Committed to responsible AI practices that prioritize human welfare and societal benefit.' },
    { title: 'UK Standards Compliance', description: 'All education and training programmes meet rigorous UK regulatory standards.' },
    { title: 'Innovation-Driven', description: 'Constantly pushing boundaries with cutting-edge research and development.' },
    { title: 'Client-Centric Approach', description: 'Tailored solutions designed around your specific needs and objectives.' },
  ]

  return (
    <section className="section-padding bg-primary text-white relative">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[length:40px_40px] bg-repeat" 
          style={{ backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+)" }}
      />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            Why Choose SL Brothers Ltd?
          </h2>
          <p className="text-xl text-accent-light/80 max-w-3xl mx-auto">
            What sets us apart in the education, technology, and research landscape
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 
                         hover:bg-white/20 transition-colors shadow-lg"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{reason.title}</h3>
                  <p className="text-accent-light/80">{reason.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Company Info
const CompanyInfo = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-12 gap-12 items-stretch">
          
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 tracking-tighter">
              Company Information ðŸ“
            </h2>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
              <InfoBlock title="Registered Name" text="SL Brothers Ltd" />
              <InfoBlock title="Headquarters" text="167-169 Great Portland Street, 5th Floor, London, W1W 5PF, UK" />
              <InfoBlock title="Company Number" text="16804263" />
              <InfoBlock title="Email" text="hello@slbrothers.co.uk" />
              <InfoBlock title="Formation Date" text="23rd October 2025" />
              <InfoBlock title="Phone" text="+44 7405 005823" />
              <InfoBlock title="Registration" text="Registered in England & Wales" />
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4">Business Divisions</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <span className="text-gray-700 font-medium p-2 bg-gray-100 rounded-full border border-gray-200">Education & Training</span>
                <span className="text-gray-700 font-medium p-2 bg-gray-100 rounded-full border border-gray-200">AI & Software</span>
                <span className="text-gray-700 font-medium p-2 bg-gray-100 rounded-full border border-gray-200">Research & Innovation</span>
              </div>
            </div>

          </motion.div>

          {/* Map Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 min-h-[350px] md:min-h-full"
          >
            <div className="relative w-full h-full bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
              {/* Static map image with visual flair */}
              <img 
                src="https://images.unsplash.com/photo-1565347878263-066f733e10f2?auto=format&fit=crop&w=800&q=80"
                alt="Map of London"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-primary/30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* The 'animate-bounce-slow' class would need to be defined in your CSS */}
                <MapPin className="text-accent w-16 h-16 drop-shadow-xl animate-bounce-slow" fill="currentColor" />
              </div>
              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-xl border border-gray-200">
                <h4 className="font-bold text-primary">SL Brothers Ltd</h4>
                <p className="text-gray-600 text-sm">Great Portland Street, London W1W 5PF</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// Helper for InfoBlock
const InfoBlock = ({ title, text }: { title: string, text: string }) => (
  <div>
    <h3 className="text-sm font-semibold text-primary/70 uppercase tracking-wider mb-2">{title}</h3>
    <p className="text-lg text-gray-800 font-medium">{text}</p>
  </div>
)

// Call to Action
const CallToAction = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-primary-dark text-white p-12 md:p-16 rounded-3xl shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
                Ready to Work With Us? ðŸ¤
              </h2>
              <p className="text-xl text-accent-light/80">
                Let's discuss how SL Brothers Ltd can help transform your organization.
              </p>
            </div>
            
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent-dark text-primary-dark font-bold w-full sm:w-auto transition-transform hover:scale-[1.02]">
                  Get In Touch <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/divisions">
                <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10 w-full sm:w-auto">
                  Explore Divisions
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About