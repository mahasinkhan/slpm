// @ts-nocheck
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import {
    BookOpen, Brain, Lightbulb, ArrowRight, Code, Database, Lock, Zap, Users, Award, Target, Briefcase, Globe, TrendingUp, Layers, Cpu, Shield, Rocket, BarChart, Settings, CheckCircle, Star, Eye, Github, ExternalLink, Calendar, Tag, Filter, Search, X, Play, Sparkles, Clock, MapPin, Percent, Smartphone, Monitor, Cloud, LineChart, PieChart, Activity
} from 'lucide-react'

// Custom Button Component - SL Brothers Brand
const Button = ({ children, className = '', variant = 'primary', size = 'md', onClick, type = 'button' }) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center'
    const variants = {
        primary: 'bg-[#003366] text-white hover:bg-[#002244] shadow-md hover:shadow-lg',
        outline: 'border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white',
        ghost: 'text-[#003366] hover:bg-gray-50',
        success: 'bg-[#004488] text-white hover:bg-[#003366]',
        warning: 'bg-[#C0C0C0] text-[#003366] hover:bg-[#B0B0B0]'
    }
    const sizes = {
        sm: 'px-3 py-2 text-sm', // Adjusted for better mobile tap target
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    }

    return (
        <button
            type={type as any}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    )
}

// Custom Card Component
const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
            {children}
        </div>
    )
}

// Dummy Project Data (Extended with a few more details for the modal)
const allProjectsData = [
    {
        id: 1, title: 'Smart Learning Platform', category: 'education', description: 'AI-powered adaptive learning system with personalized study paths.', image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80', tags: ['React', 'Node.js', 'TensorFlow', 'MongoDB', 'AWS Lambda'], metrics: { users: '50K+', satisfaction: '96%', completion: '89%' }, status: 'Live', client: 'University of London', duration: '8 months', year: '2024',
        details: { challenge: "Integrating diverse content sources with an adaptive engine.", solution: "Developed a microservices architecture and a custom TensorFlow model for real-time personalization." }
    },
    {
        id: 2, title: 'AI Diagnostics Engine', category: 'ai', description: 'Machine learning system for medical image analysis and diagnosis.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', tags: ['Python', 'PyTorch', 'OpenCV', 'AWS', 'Docker'], metrics: { accuracy: '98.5%', speed: '2s', improvement: '45%' }, status: 'Live', client: 'HealthTech Solutions', duration: '12 months', year: '2024',
        details: { challenge: "Achieving high accuracy with limited, sensitive data.", solution: "Utilized transfer learning and a strict data anonymization pipeline to train a robust CNN." }
    },
    {
        id: 3, title: 'Enterprise Dashboard', category: 'web', description: 'Real-time analytics and reporting platform for business intelligence.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', tags: ['Vue.js', 'D3.js', 'PostgreSQL', 'Docker', 'Kubernetes'], metrics: { dataPoints: '10M+', response: '0.3s', uptime: '99.9%' }, status: 'Live', client: 'Tech Corp International', duration: '6 months', year: '2024',
        details: { challenge: "Handling massive, real-time data streams for visualization.", solution: "Implemented a Pub/Sub model with Redis caching and optimized D3.js rendering for sub-second dashboard updates." }
    },
    {
        id: 4, title: 'Mobile Fitness Tracker', category: 'mobile', description: 'Cross-platform fitness app with AI-powered workout recommendations.', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', tags: ['React Native', 'Firebase', 'TensorFlow Lite', 'Redux'], metrics: { downloads: '100K+', rating: '4.8', retention: '78%' }, status: 'Live', client: 'FitLife Pro', duration: '5 months', year: '2024',
        details: { challenge: "Ensuring smooth performance across diverse mobile devices.", solution: "Focused on native module optimization and using a headless state management system for a seamless UX." }
    },
    {
        id: 5, title: 'Climate Data Analysis', category: 'research', description: 'Advanced predictive modeling for climate change impact assessment.', image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80', tags: ['Python', 'Jupyter', 'Pandas', 'Scikit-learn', 'R'], metrics: { datasets: '500+', models: '15', accuracy: '94%' }, status: 'Research', client: 'Environmental Institute', duration: '10 months', year: '2023',
        details: { challenge: "Managing and processing petabytes of global climate data.", solution: "Built a distributed data processing pipeline using Apache Spark on a high-performance computing cluster." }
    },
    {
        id: 6, title: 'E-Commerce Platform', category: 'web', description: 'Scalable multi-vendor marketplace with AI-powered recommendations.', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80', tags: ['Next.js', 'Stripe', 'Redis', 'Kubernetes', 'Microservices'], metrics: { vendors: '500+', orders: '1M+', conversion: '3.2%' }, status: 'Live', client: 'MarketPlace Pro', duration: '9 months', year: '2024',
        details: { challenge: "Maintaining scalability during peak shopping seasons.", solution: "Implemented a fully containerized microservices architecture managed by Kubernetes, enabling auto-scaling." }
    },
    {
        id: 7, title: 'Virtual Reality Training', category: 'education', description: 'Immersive VR environment for professional skills training.', image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=80', tags: ['Unity', 'C#', 'Oculus SDK', 'WebXR'], metrics: { modules: '50+', users: '5K+', engagement: '92%' }, status: 'Beta', client: 'Corporate Training Ltd', duration: '7 months', year: '2024',
        details: { challenge: "Optimizing complex 3D environments for standalone VR headsets.", solution: "Aggressively poly-reduced models and used custom shaders for high frame rates and a smooth VR experience." }
    },
    {
        id: 8, title: 'Chatbot Assistant', category: 'ai', description: 'NLP-powered customer service bot with multi-language support.', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80', tags: ['GPT-4', 'LangChain', 'FastAPI', 'Redis', 'NLP'], metrics: { languages: '25', queries: '100K/day', resolution: '87%' }, status: 'Live', client: 'Global Services Inc', duration: '4 months', year: '2024',
        details: { challenge: "Ensuring accurate, non-hallucinatory multi-language responses.", solution: "Fine-tuned a custom LLM model on client-specific knowledge bases and implemented guardrails via LangChain." }
    },
    {
        id: 9, title: 'Banking Mobile App', category: 'mobile', description: 'Secure digital banking solution with biometric authentication.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', tags: ['Flutter', 'Node.js', 'PostgreSQL', 'AWS', 'Biometric'], metrics: { transactions: '500K/day', security: 'AAA', users: '250K+' }, status: 'Live', client: 'Digital Bank UK', duration: '11 months', year: '2023',
        details: { challenge: "Meeting stringent financial compliance and security standards.", solution: "Adopted end-to-end encryption, multi-factor authentication, and passed rigorous external security audits." }
    }
];

const HeroSection = () => {
    // ... (HeroSection component code remains the same as it was complete)
    return (
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#003366] via-[#002244] to-[#001122] overflow-hidden">
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -50, 0],
                            opacity: [0.1, 0.5, 0.1],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    >
                        <div className="w-2 h-2 bg-[#C0C0C0] rounded-full" />
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="absolute top-20 left-10 w-24 h-24 md:w-40 md:h-40" // Responsive size adjustment
                animate={{
                    y: [0, 30, 0],
                    rotate: [0, 180, 360],
                }}
                transition={{ duration: 15, repeat: Infinity }}
            >
                <div className="w-full h-full border-4 border-[#C0C0C0] rounded-3xl opacity-20" style={{ transform: 'rotateX(45deg) rotateY(45deg)' }} />
            </motion.div>

            <motion.div
                className="absolute bottom-10 right-5 w-20 h-20 md:w-32 md:h-32" // Responsive size adjustment
                animate={{
                    x: [0, 30, 0],
                    rotate: [0, -180, -360],
                }}
                transition={{ duration: 12, repeat: Infinity }}
            >
                <div className="w-full h-full border-4 border-[#C0C0C0]/60 rounded-full opacity-20" />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto text-center"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block mb-6"
                    >
                        <div className="bg-[#C0C0C0]/20 backdrop-blur-sm rounded-full px-4 py-2 md:px-8 md:py-3 text-[#C0C0C0] font-bold text-sm md:text-lg shadow-2xl border border-[#C0C0C0]/30">
                            ðŸš€ Innovation in Action
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight" // Responsive text size
                    >
                        Our
                        <span className="block bg-gradient-to-r from-[#C0C0C0] to-[#A0A0A0] bg-clip-text text-transparent">
                            Portfolio
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-lg md:text-3xl text-gray-300 mb-8 leading-relaxed px-4" // Responsive text size and padding
                    >
                        Transforming ideas into reality through cutting-edge technology and innovative design
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Button size="lg" className="bg-[#C0C0C0] text-[#003366] hover:bg-[#B0B0B0]">
                            <span className="flex items-center space-x-2">
                                <span>Explore Projects</span>
                                <ArrowRight size={20} />
                            </span>
                        </Button>
                        <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#003366]">
                            <span className="flex items-center space-x-2">
                                <Play size={20} />
                                <span>Watch Demo</span>
                            </span>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-16 max-w-3xl mx-auto" // Responsive grid
                    >
                        {[
                            { num: '150+', label: 'Projects Delivered' },
                            { num: '98%', label: 'Client Satisfaction' },
                            { num: '25+', label: 'Industries Served' }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }} // Slight hover change for mobile friendly interaction
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20"
                            >
                                <div className="text-3xl md:text-5xl font-black text-[#C0C0C0] mb-1 md:mb-2">{stat.num}</div>
                                <div className="text-xs md:text-sm text-gray-300">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-5 md:bottom-10 left-1/2 transform -translate-x-1/2"
            >
                <div className="text-white text-center">
                    <div className="text-sm mb-2">Scroll to explore</div>
                    <ArrowRight className="rotate-90 mx-auto" size={24} />
                </div>
            </motion.div>
        </section>
    )
}

const StatsSection = () => {
    // ... (StatsSection component code remains the same as it was complete, but I'll make a minor responsiveness adjustment)
    const stats = [
        { icon: Rocket, value: '150+', label: 'Projects Completed', color: 'from-[#003366] to-[#004488]' },
        { icon: Users, value: '200+', label: 'Happy Clients', color: 'from-[#004488] to-[#005599]' },
        { icon: Globe, value: '35+', label: 'Countries Reached', color: 'from-[#005599] to-[#006699]' },
        { icon: Award, value: '45+', label: 'Awards Won', color: 'from-[#C0C0C0] to-[#A0A0A0]' },
    ]

    return (
        <section className="py-12 md:py-20 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50 opacity-50" />
            
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-[#003366] mb-2 md:mb-4">
                        Impact at Scale
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600">Measurable results that drive success</p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"> {/* Responsive grid */}
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                        >
                            <Card className="text-center relative overflow-hidden group p-4 md:p-6">
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className={`w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg`}
                                >
                                    <stat.icon className="text-white" size={24} md={40} />
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                                    className={`text-3xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 md:mb-2`}
                                >
                                    {stat.value}
                                </motion.div>
                                <div className="text-sm md:text-base text-gray-600 font-semibold">{stat.label}</div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const ProjectFilters = ({ selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }) => {
    // ... (ProjectFilters component code remains the same, with minor responsive tweaks)
    const categories = [
        { id: 'all', label: 'All', icon: Layers },
        { id: 'education', label: 'Education', icon: BookOpen },
        { id: 'ai', label: 'AI & ML', icon: Brain },
        { id: 'web', label: 'Web', icon: Monitor },
        { id: 'mobile', label: 'Mobile', icon: Smartphone },
        { id: 'research', label: 'Research', icon: Lightbulb },
    ]

    return (
        <section className="py-6 md:py-12 bg-white sticky top-0 z-40 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:border-[#003366] focus:outline-none transition-colors text-sm md:text-base"
                        />
                    </div>

                    <div className="flex items-center space-x-2 hidden md:flex"> {/* Hidden on mobile for space */}
                        <Filter size={20} className="text-gray-600" />
                        <span className="text-sm text-gray-600 font-semibold">Filter by:</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3 justify-center overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <motion.button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center space-x-1 md:space-x-2 px-3 py-2 md:px-6 md:py-3 rounded-xl text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
                                selectedCategory === category.id
                                    ? 'bg-gradient-to-r from-[#003366] to-[#004488] text-white shadow-lg scale-100' // Removed scale-105 for mobile usability
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <category.icon size={16} md={20} />
                            <span className="font-semibold">{category.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    )
}

const ProjectsGrid = ({ selectedCategory, searchQuery, setSelectedProject }) => {
    // Project filtering logic remains the same
    const filteredProjects = allProjectsData.filter(project => {
        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesCategory && matchesSearch
    })

    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 md:mb-8"
                >
                    <p className="text-sm md:text-base text-gray-600">
                        Showing <span className="font-bold text-[#003366]">{filteredProjects.length}</span> projects
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <AnimatePresence>
                        {filteredProjects.map((project, index) => (
                            <ProjectCard 
                                key={project.id} 
                                project={project} 
                                index={index}
                                onClick={() => setSelectedProject(project)}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-5xl md:text-6xl mb-4">ðŸ”</div>
                        <h3 className="text-xl md:text-2xl font-bold text-[#003366] mb-2">No projects found</h3>
                        <p className="text-gray-600">Try adjusting your filters or search query</p>
                    </motion.div>
                )}
            </div>
        </section>
    )
}

const ProjectCard = ({ project, index, onClick }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }} // Adjusted hover for more subtle effect
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
            className="cursor-pointer"
        >
            <Card className="h-full overflow-hidden p-0 group hover:shadow-2xl transition-shadow">
                <div className="relative h-48 md:h-64 overflow-hidden"> {/* Responsive height */}
                    <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute inset-0 bg-[#003366]/90 flex items-center justify-center"
                    >
                        <div className="text-center text-white">
                            <Eye size={30} md={40} className="mx-auto mb-2" />
                            <p className="font-semibold text-sm md:text-base">View Details</p>
                        </div>
                    </motion.div>

                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            project.status === 'Live' ? 'bg-[#004488] text-white' :
                            project.status === 'Beta' ? 'bg-[#C0C0C0] text-[#003366]' :
                            'bg-[#005599] text-white'
                        }`}>
                            {project.status}
                        </span>
                    </div>

                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-[#003366]">
                            {project.year}
                        </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
                            {project.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-200">{project.client}</p>
                    </div>
                </div>

                <div className="p-4 md:p-6">
                    <p className="text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 md:px-3 md:py-1 bg-[#003366]/10 text-[#003366] rounded-full text-xs font-semibold"
                            >
                                {tag}
                            </span>
                        ))}
                        {project.tags.length > 3 && (
                            <span className="px-2 py-0.5 md:px-3 md:py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                +{project.tags.length - 3}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(project.metrics).slice(0, 3).map(([key, value], idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-base md:text-lg font-bold text-[#003366]">{value}</div>
                                <div className="text-xs text-gray-500 capitalize">{key}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-500">
                            <Clock size={16} />
                            <span>{project.duration}</span>
                        </div>
                        <Button size="sm" className="group-hover:bg-[#002244]">
                            <span className="flex items-center space-x-1">
                                <span className="hidden sm:inline">View</span>
                                <ArrowRight size={16} />
                            </span>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

const FeaturedProjects = ({ setSelectedProject }) => {
    const featuredProjects = [
        allProjectsData.find(p => p.id === 2), // AI Diagnostics Engine
        allProjectsData.find(p => p.id === 6), // E-Commerce Platform
    ].filter(Boolean); // Filter out potential undefined entries

    return (
        <section className="py-12 md:py-20 bg-[#003366] text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">ðŸ† Featured Innovations</h2>
                    <p className="text-lg text-gray-300">Our flagship projects pushing the boundaries of technology.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="bg-[#004488] text-white p-6 md:p-8 h-full">
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0">
                                        <Brain size={48} className="text-[#C0C0C0]" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
                                        <p className="text-gray-300 mb-4">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tags.slice(0, 4).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-[#C0C0C0]/20 text-[#C0C0C0] rounded-full text-xs font-semibold"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Button
                                            variant="warning"
                                            onClick={() => setSelectedProject(project)}
                                            className="mt-2"
                                        >
                                            <span className="flex items-center space-x-2">
                                                <span>Deep Dive</span>
                                                <Eye size={18} />
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Missing Components Added Below ---

const Interactive3DShowcase = () => {
    return (
        <section className="py-12 md:py-20 bg-gray-100 text-center">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">ðŸŒ Interactive 3D Showcase</h2>
                    <p className="text-lg text-gray-600 mb-8">Visualizing the complexity of our most ambitious projects.</p>
                </motion.div>
                <Card className="p-8 h-64 md:h-96 flex items-center justify-center bg-gray-200 border-4 border-dashed border-gray-400">
                    <Zap size={60} className="text-gray-500" />
                    <p className="ml-4 text-xl font-medium text-gray-700">3D Model Placeholder (Three.js/WebGL Integration)</p>
                </Card>
            </div>
        </section>
    );
};

const TechnologyStack = () => {
    const technologies = [
        { name: 'React/Next.js', icon: Code, color: 'text-blue-500' },
        { name: 'Python/ML', icon: Brain, color: 'text-green-600' },
        { name: 'Cloud (AWS/Azure)', icon: Cloud, color: 'text-orange-500' },
        { name: 'Databases (SQL/NoSQL)', icon: Database, color: 'text-red-500' },
        { name: 'DevOps (Docker/K8s)', icon: Cpu, color: 'text-indigo-500' },
        { name: 'Security', icon: Shield, color: 'text-gray-600' },
    ];
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">ðŸ› ï¸ Core Technology Stack</h2>
                    <p className="text-lg text-gray-600">The tools we use to build future-proof solutions.</p>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {technologies.map((tech, index) => (
                        <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <Card className="p-4 flex flex-col items-center">
                                <tech.icon size={40} className={`${tech.color} mb-3`} />
                                <div className="font-semibold text-sm md:text-base text-[#003366]">{tech.name}</div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProjectTimeline = () => {
    const timelineEvents = [
        { year: '2020', title: 'Founded & First 10 Projects', icon: Star },
        { year: '2022', title: 'Launched AI/ML Division', icon: Brain },
        { year: '2023', title: 'Global Expansion to 35+ Countries', icon: Globe },
        { year: '2024', title: '150+ Projects Milestone Achieved', icon: Rocket },
    ];

    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">ðŸ“… Project History & Milestones</h2>
                    <p className="text-lg text-gray-600">A journey of continuous growth and innovation.</p>
                </motion.div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#003366]/20 hidden md:block" />

                    {timelineEvents.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6 }}
                            className={`flex mb-8 md:mb-16 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center w-full`}
                        >
                            {/* Mobile/Left Content */}
                            <div className="md:w-1/2 p-4 text-left md:text-right">
                                <h3 className="text-xl font-bold text-[#003366]">{event.title}</h3>
                                <p className="text-gray-600">{event.year}</p>
                            </div>

                            {/* Dot */}
                            <div className="hidden md:block w-10 h-10 bg-[#003366] rounded-full absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center border-4 border-white shadow-xl">
                                <event.icon size={20} className="text-white" />
                            </div>

                            {/* Right Content (Hidden on mobile as it's combined with left) */}
                            <div className="hidden md:block w-1/2 p-4">
                                {/* Empty for spacing on desktop */}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ClientImpact = () => {
    const impacts = [
        { metric: 'Revenue Increase', value: '45%', icon: TrendingUp },
        { metric: 'Operational Efficiency', value: '60%', icon: Activity },
        { metric: 'Market Reach', value: '3x', icon: Target },
    ];
    return (
        <section className="py-12 md:py-20 bg-[#002244] text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">ðŸ“ˆ Client Impact Stories</h2>
                    <p className="text-lg text-gray-300">Success is measured by the change we create.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {impacts.map((impact, index) => (
                        <motion.div
                            key={impact.metric}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="text-center"
                        >
                            <Card className="bg-[#003366] text-white p-6 md:p-8">
                                <impact.icon size={48} className="text-[#C0C0C0] mx-auto mb-4" />
                                <div className="text-5xl font-black mb-2">{impact.value}</div>
                                <div className="text-lg font-semibold">{impact.metric}</div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProcessShowcase = () => {
    const steps = [
        { title: 'Discovery', icon: Search, description: 'Deep analysis of requirements and strategic planning.' },
        { title: 'Design', icon: Lightbulb, description: 'Prototyping, UX/UI design, and architecture blueprint.' },
        { title: 'Development', icon: Code, description: 'Agile development, continuous integration, and testing.' },
        { title: 'Deployment', icon: Rocket, description: 'Seamless launch, monitoring, and scale-up.' },
    ];
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">âš™ï¸ Our Development Process</h2>
                    <p className="text-lg text-gray-600">A structured, iterative approach to guarantee success.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="relative"
                        >
                            <Card className="p-6 md:p-8 h-full">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 flex items-center justify-center bg-[#003366] rounded-full flex-shrink-0 shadow-lg">
                                        <step.icon size={24} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#003366]">{index + 1}. {step.title}</h3>
                                </div>
                                <p className="text-gray-600">{step.description}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const InnovationLab = () => {
    return (
        <section className="py-12 md:py-20 bg-[#C0C0C0]/20">
            <div className="container mx-auto px-4">
                <Card className="bg-white p-6 md:p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Sparkles size={60} className="text-[#003366] mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">ðŸ§ª SL Innovation Lab</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                            Beyond client work, our dedicated lab explores future technologies like Quantum Computing, advanced AI models, and Decentralized applications.
                        </p>
                        <Button>
                            <span className="flex items-center space-x-2">
                                <span>See Our Research</span>
                                <ArrowRight size={20} />
                            </span>
                        </Button>
                    </motion.div>
                </Card>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        { quote: "SL Brothers didn't just meet our specs; they delivered a solution that reshaped our entire operation. The 45% revenue lift speaks for itself.", client: "Alex R., HealthTech CEO", icon: TrendingUp },
        { quote: "Their technical expertise in AI is unparalleled. The diagnostic engine they built is now a core asset for our medical team.", client: "Dr. Lena K., Research Director", icon: Brain },
    ];
    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">ðŸ—£ï¸ What Our Clients Say</h2>
                    <p className="text-lg text-gray-600">Trust built on proven results.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <Card className="p-6 md:p-8 border-l-4 border-[#003366] h-full flex flex-col justify-between">
                                <t.icon size={30} className="text-[#003366] mb-4" />
                                <blockquote className="text-xl italic text-gray-700 mb-6">"{t.quote}"</blockquote>
                                <footer className="font-semibold text-gray-800">â€” {t.client}</footer>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection = () => {
    return (
        <section className="py-12 md:py-20 bg-gradient-to-r from-[#003366] to-[#004488]">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Ready to Start Your Project?</h2>
                    <p className="text-lg md:text-xl text-gray-200 mb-8">Let's build the next generation of digital excellence together.</p>
                    <Button size="lg" className="bg-[#C0C0C0] text-[#003366] hover:bg-[#B0B0B0]">
                        <span className="flex items-center space-x-2">
                            <span>Get a Quote</span>
                            <Briefcase size={20} />
                        </span>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

const ProjectModal = ({ project, onClose }) => {
    useEffect(() => {
        if (project) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [project]);

    if (!project) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 md:p-8"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    {/* Modal Header */}
                    <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-6 md:p-8 flex flex-col justify-end">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{project.title}</h2>
                            <p className="text-xl text-gray-300">{project.client} ({project.year})</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/40 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 md:p-8">
                        <p className="text-lg text-gray-700 mb-6">{project.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {Object.entries(project.metrics).map(([key, value], idx) => (
                                <Card key={idx} className="p-4 bg-gray-50 border border-gray-100 text-center">
                                    <div className="text-2xl font-black text-[#003366]">{value}</div>
                                    <div className="text-sm text-gray-500 capitalize">{key}</div>
                                </Card>
                            ))}
                            <Card className="p-4 bg-gray-50 border border-gray-100 text-center">
                                <div className="text-2xl font-black text-[#003366]">{project.duration}</div>
                                <div className="text-sm text-gray-500 capitalize">Duration</div>
                            </Card>
                        </div>
                        
                        {/* Challenge & Solution */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-[#003366] flex items-center mb-3">
                                    <Target size={20} className="mr-2" />
                                    The Challenge
                                </h3>
                                <p className="text-gray-600">{project.details?.challenge || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#003366] flex items-center mb-3">
                                    <CheckCircle size={20} className="mr-2" />
                                    Our Solution
                                </h3>
                                <p className="text-gray-600">{project.details?.solution || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Technologies */}
                        <h3 className="text-xl font-bold text-[#003366] flex items-center mb-3">
                            <Tag size={20} className="mr-2" />
                            Technologies Used
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {project.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 bg-[#003366] text-white rounded-full text-sm font-semibold"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-4 border-t pt-4">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                            <Button className="flex items-center space-x-2">
                                <ExternalLink size={18} />
                                <span>Visit Live Site</span>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};


const Projects = () => {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedProject, setSelectedProject] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    return (
        <div className="overflow-x-hidden bg-gray-50">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#003366] via-[#004488] to-[#C0C0C0] z-50 origin-left"
                style={{ scaleX }}
            />

            <HeroSection />
            <StatsSection />
            <ProjectFilters 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <ProjectsGrid 
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                setSelectedProject={setSelectedProject}
            />
            <FeaturedProjects setSelectedProject={setSelectedProject} />
            <Interactive3DShowcase />
            <TechnologyStack />
            <ProjectTimeline />
            <ClientImpact />
            <ProcessShowcase />
            <InnovationLab />
            <TestimonialsSection />
            <CTASection />

            <ProjectModal 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
            />
        </div>
    )
}

export default Projects