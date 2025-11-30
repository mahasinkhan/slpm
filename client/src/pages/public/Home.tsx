import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Brain, 
  Lightbulb, 
  ArrowRight, 
  Users} from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* About Preview */}
      <AboutPreview />
      
      {/* Divisions Overview */}
      <DivisionsOverview />
      
      {/* Services Snapshot */}
      <ServicesSnapshot />
      
      {/* Featured Projects */}
      <FeaturedProjects />
      
      {/* News & Insights */}
      <NewsInsights />
      
      {/* Careers Section */}
      <CareersSection />
      
      {/* Contact Section */}
      <ContactSection />
    </div>
  )
}

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary via-primary-dark to-primary-light overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
          >
            Building the Future Through{' '}
            <span className="text-accent">Learning</span>,{' '}
            <span className="text-accent">Technology</span> &{' '}
            <span className="text-accent">Innovation</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-accent-light mb-8 leading-relaxed"
          >
            SL Brothers Ltd is a London-based multidisciplinary company combining education, AI, and research to empower individuals and industries.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="bg-white text-primary hover:bg-accent">
              <Link to="/divisions" className="flex items-center space-x-2">
                <span>Explore Divisions</span>
                <ArrowRight size={20} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <a href="#contact" className="flex items-center space-x-2">
                <span>Contact Us</span>
              </a>
            </Button>
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

// About Preview
const AboutPreview = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-3xl transform rotate-6" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="SL Brothers Team"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Empowering Minds.<br />Engineering Futures.
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              SL Brothers Ltd unites education, technology, and research to deliver intelligent, ethical, and scalable solutions that make a real-world difference.
            </p>
            <p className="text-gray-600 mb-8">
              Officially formed on 23rd October 2025 in London, we bridge the gap between traditional learning, artificial intelligence, and applied research.
            </p>
            <Link to="/about">
              <Button className="group">
                <span className="flex items-center space-x-2">
                  <span>Learn More About Us</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Divisions Overview
const DivisionsOverview = () => {
  const divisions = [
    {
      icon: BookOpen,
      title: 'Education & Training',
      description: 'Blended learning through online and face-to-face programmes that meet UK standards.',
      color: 'from-blue-500 to-blue-600',
      link: '/divisions#education'
    },
    {
      icon: Brain,
      title: 'AI & Software',
      description: 'Building secure, intelligent software systems and AI solutions for modern businesses.',
      color: 'from-purple-500 to-purple-600',
      link: '/divisions#ai'
    },
    {
      icon: Lightbulb,
      title: 'Research & Innovation',
      description: 'Driving ethical research and technological progress through collaboration.',
      color: 'from-green-500 to-green-600',
      link: '/divisions#research'
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
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Three Divisions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how we combine education, technology, and innovation to drive meaningful change
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {divisions.map((division, index) => (
            <motion.div
              key={division.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="text-center h-full">
                <div className={`w-16 h-16 bg-gradient-to-br ${division.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <division.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {division.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {division.description}
                </p>
                <Link to={division.link}>
                  <Button variant="outline" size="sm" className="group">
                    <span className="flex items-center space-x-2">
                      <span>Explore</span>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                    </span>
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Services Snapshot
const ServicesSnapshot = () => {
  const services = [
    {
      title: 'Education',
      items: ['Course creation', 'Training delivery', 'Learning platform design']
    },
    {
      title: 'AI & Software',
      items: ['Custom development', 'Automation', 'Cybersecurity']
    },
    {
      title: 'Research',
      items: ['Prototype design', 'Innovation consultancy', 'Technical documentation']
    },
  ]

  return (
    <section className="section-padding bg-primary text-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            One Team, Three Strengths
          </h2>
          <p className="text-xl text-accent-light max-w-3xl mx-auto">
            Comprehensive solutions across education, technology, and innovation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <ul className="space-y-2">
                {service.items.map((item) => (
                  <li key={item} className="flex items-start space-x-2">
                    <span className="text-accent mt-1">âœ“</span>
                    <span className="text-accent-light">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/services">
            <Button size="lg" className="bg-white text-primary hover:bg-accent">
              View All Services
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// Featured Projects
const FeaturedProjects = () => {
  const projects = [
    {
      title: 'Smart Learning Suite',
      description: 'Hybrid training analytics platform for next-generation education',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      category: 'Education'
    },
    {
      title: 'AI Insight Engine',
      description: 'Predictive system for operational efficiency and decision-making',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
      category: 'AI & Software'
    },
    {
      title: 'FutureVision Lab',
      description: 'Research hub for responsible AI and sustainable technology',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      category: 'Research'
    },
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
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600">
            Pioneering solutions developed in London, serving industries worldwide
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden p-0">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600">
                    {project.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/projects">
            <Button variant="outline">See All Projects</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// News & Insights
const NewsInsights = () => {
  const news = [
    {
      title: 'How AI is Transforming Workforce Learning',
      excerpt: 'Explore the intersection of artificial intelligence and professional development...',
      date: 'Nov 1, 2025',
      category: 'AI & Technology',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Bridging Human and Machine Intelligence',
      excerpt: 'Our approach to ethical AI development and human-centered design...',
      date: 'Oct 28, 2025',
      category: 'Research',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'The Future of Ethical Innovation',
      excerpt: 'Why responsible innovation matters more than ever in 2025...',
      date: 'Oct 25, 2025',
      category: 'Innovation',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
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
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            News & Insights
          </h2>
          <p className="text-xl text-gray-600">
            Latest updates and thought leadership from SL Brothers Ltd
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden p-0 h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span>{article.date}</span>
                    <span>â€¢</span>
                    <span className="text-primary font-semibold">{article.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {article.excerpt}
                  </p>
                  <button className="text-primary font-semibold hover:underline flex items-center space-x-1">
                    <span>Read More</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/news">
            <Button variant="outline">Read All News</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// Careers Section
const CareersSection = () => {
  return (
    <section className="section-padding bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
          alt="Team"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users className="mx-auto mb-6" size={48} />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join a Team Shaping the Future
            </h2>
            <p className="text-xl text-accent-light mb-8">
              Explore exciting opportunities in education, AI development, research, and innovation.
            </p>
            <Link to="/careers">
              <Button size="lg" className="bg-white text-primary hover:bg-accent">
                View Open Positions
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Contact Section
const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-primary mb-6">
              Get In Touch
            </h2>
            <p className="text-gray-600 mb-8">
              Ready to start your journey with us? Contact our team today.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white">ðŸ“</span>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Office Address</h4>
                  <p className="text-gray-600">
                    167-169, Great Portland Street, 5th Floor<br />
                    London, United Kingdom, W1W 5PF
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white">ðŸ“§</span>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Email</h4>
                  <p className="text-gray-600">hello@slbrothers.co.uk</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white">ðŸ“ž</span>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Phone</h4>
                  <p className="text-gray-600">+44 7405 005823</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    className="input-field min-h-[150px]"
                    placeholder="Tell us about your project..."
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Home