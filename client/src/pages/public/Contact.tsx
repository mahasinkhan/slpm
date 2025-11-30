import React, { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion'
import {
    MapPin,
    Mail,
    Phone,
    Send,
    Users,
    Award,
    HelpCircle,
    Briefcase,
    Layers,
    ShieldCheck,
    Globe,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    X,
    Building,
    Navigation,
    CalendarClock,
    TrendingUp,
    Zap,
} from 'lucide-react'

// --- SLB Brand Constants ---
const SLB_COLORS = {
    PrimaryBlue: '#003366',
    AccentOrange: '#FF7A00',
    AccentSilver: '#C0C0C0',
    ShadowBlue: 'rgba(0, 51, 102, 0.4)',
}

// --- Types ---
interface Location {
    id: number
    city: string
    address: string
    phone: string
    icon: React.ElementType
    details: string
    hours: string
}

interface FAQ {
    id: number
    question: string
    answer: string
}

interface FormData {
    name: string
    email: string
    topic: string
    message: string
}

interface ButtonProps {
    children: React.ReactNode
    className?: string
    variant?: 'primary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
}

interface CardProps {
    children: React.ReactNode
    className?: string
}

interface SectionHeadingProps {
    title: string
    subtitle: string
    icon: React.ElementType
    color?: string
}

// --- NEW DATA STRUCTURE (London is HQ) ---
const mockLocations: Location[] = [
    { id: 1, city: "London (Global HQ)", address: "78 Innovation Lane, SW1A 0AA, UK", phone: "+44 20 1234 5678", icon: Building, details: "Executive Leadership, Global Strategy, and EU Operations.", hours: "Mon - Fri: 9:00 AM - 5:00 PM (GMT)" },
    { id: 2, city: "New York City (AMER Hub)", address: "123 Tech Drive, Suite 500, NY 10001", phone: "+1 (555) 123-4567", icon: Navigation, details: "Americas Sales, Finance, and Client Relationship Management.", hours: "Mon - Fri: 8:00 AM - 6:00 PM (EST)" },
    { id: 3, city: "Bangalore (Asia Dev Center)", address: "45 Knowledge Park, BLR 560001, India", phone: "+91 80 9876 5432", icon: Briefcase, details: "Core IT Services, AI/ML Engineering, and Technical Support.", hours: "Mon - Fri: 10:00 AM - 7:00 PM (IST)" },
]

const mockFAQs: FAQ[] = [
    { id: 1, question: "What services does SL Brothers offer?", answer: "SL Brothers specializes in advanced IT consulting, customized software development, and modern EdTech solutions for both corporate and academic clients." },
    { id: 2, question: "Where are your main offices located?", answer: "Our headquarters is in London, with regional development hubs in New York and Bangalore, enabling 24/7 global support." },
    { id: 3, question: "How can I request a product demo?", answer: "You can request a personalized demo by filling out the 'Sales Inquiry' form in the contact channels section below, or by calling our sales line directly." },
    { id: 4, question: "Do you offer tailored educational programs?", answer: "Yes, we build bespoke educational curricula and platforms tailored to specific institutional needs, focusing on AI, data science, and modern programming languages." },
    { id: 5, question: "What is your approach to data security?", answer: "Security is our core value. We utilize multi-layered, state-of-the-art encryption and comply with all major international data protection standards like GDPR and CCPA." },
]

// --- 1. Utility Components (Enhanced Styling) ---
const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    onClick,
    type = 'button',
    disabled = false
}) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed border-2'
    const variants: Record<string, string> = {
        primary: 'bg-gradient-to-r from-orange-600 to-orange-700 border-orange-600 text-white hover:from-orange-700 hover:to-orange-800 shadow-xl shadow-orange-600/30',
        outline: 'border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white',
        ghost: 'border-transparent text-blue-900 hover:bg-blue-50',
    }
    const sizes: Record<string, string> = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.05, boxShadow: `0 10px 20px ${SLB_COLORS.ShadowBlue}` }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </motion.button>
    )
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-3xl shadow-2xl p-6 transition-all duration-500 hover:shadow-3xl ${className}`}>
            {children}
        </div>
    )
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
    title,
    subtitle,
    icon: Icon,
    color = 'text-orange-600'
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
        >
            <div className={`inline-flex items-center space-x-3 text-md font-extrabold uppercase tracking-widest ${color} mb-3`}>
                {Icon && <Icon size={30} />}
                <span>{subtitle}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-blue-900 font-['Poppins'] leading-tight">
                {title}
            </h2>
            <div className="w-24 h-1.5 bg-orange-600 mx-auto mt-4 rounded-full" />
        </motion.div>
    )
}

// --- 2. Contact Form Component (Enhanced Feedback) ---
const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        topic: 'General Inquiry',
        message: ''
    })
    // FIX 1: Explicitly define the possible states for `status` in useState
    const [status, setStatus] = useState<'submitting' | 'success' | 'error' | null>(null)

    // FIX 2: Explicitly type the event object
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // FIX 3: Explicitly type the event object
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus('submitting')

        // Mock API Call Simulation
        await new Promise(resolve => setTimeout(resolve, 2000))

        if (formData.name && formData.email && formData.message) {
            console.log("Form Data Submitted:", formData)
            setStatus('success')
        } else {
            setStatus('error')
        }
    }

    const inputClasses = "w-full p-4 border-2 border-gray-200 rounded-xl bg-white focus:ring-4 focus:ring-orange-200 focus:border-orange-600 transition duration-300 text-blue-900 placeholder-gray-400"
    const labelClasses = "block text-sm font-bold text-blue-900 mb-2 uppercase tracking-wider"

    // FIX 4: Correct the use of 'as const' within the transition object to ensure proper Variants typing
    const formVariants: Variants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring', // Remove `as const` here
                stiffness: 80,
                delay: 0.2
            } as const // Add `as const` outside the transition object to fix the type
        }
    } as const // Add `as const` here to correctly define `formVariants` as Variants

    return (
        <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
        >
            <Card className="p-8 md:p-14 bg-white border-t-8 border-orange-600 shadow-3xl">
                <h3 className="text-4xl font-extrabold text-blue-900 mb-4">Let's Initiate Your Project</h3>
                <p className="text-gray-600 mb-10 text-lg font-medium">Schedule a consultation or send a direct message to our specialized team.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className={labelClasses}>Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="Your Full Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className={labelClasses}>Work Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                                placeholder="your@company.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="topic" className={labelClasses}>Inquiry Topic</label>
                        <select
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            className={inputClasses}
                        >
                            <option>General Inquiry</option>
                            <option className="font-semibold">Sales & Partnership (Project Scoping)</option>
                            <option>Technical Support</option>
                            <option>Careers & HR</option>
                            <option>Media & PR</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="message" className={labelClasses}>Project Overview / Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                            placeholder="Describe your needs, challenges, or project goals..."
                        />
                    </div>

                    <Button type="submit" size="lg" disabled={status === 'submitting'} className="w-full mt-8">
                        {status === 'submitting' ? (
                            <span className="flex items-center justify-center space-x-2">
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                <span>Processing Request...</span>
                            </span>
                        ) : (
                            <span className="flex items-center space-x-2">
                                <Send size={22} />
                                <span>Submit Inquiry</span>
                            </span>
                        )}
                    </Button>

                    <AnimatePresence>
                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-lg flex items-start space-x-3 shadow-md"
                            >
                                <ShieldCheck size={24} className="text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold text-lg">Thank You!</p>
                                    <p className="text-sm">Your inquiry has been successfully logged. A dedicated specialist will contact you within the next 4 business hours.</p>
                                </div>
                            </motion.div>
                        )}
                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg flex items-start space-x-3 shadow-md"
                            >
                                <X size={24} className="text-red-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold text-lg">Submission Error</p>
                                    <p className="text-sm">Please ensure all required fields are correctly completed before submitting.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </Card>
        </motion.div>
    )
}

// --- 3. Interactive Map Section (Highly Interactive) ---
const InteractiveMapSection: React.FC = () => {
    const [selectedLocation, setSelectedLocation] = useState<Location>(mockLocations[0])

    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Global Innovation Hubs"
                    subtitle="Our Worldwide Footprint"
                    icon={Globe}
                    color="text-blue-900"
                />

                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {mockLocations.map((location, index) => (
                        <motion.div
                            key={location.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 30px rgba(0, 51, 102, 0.15)' }}
                            onClick={() => setSelectedLocation(location)}
                            className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${selectedLocation.id === location.id ? 'bg-blue-900 text-white border-orange-600 shadow-xl' : 'bg-white text-blue-900 border-gray-200 hover:border-orange-400'}`}
                        >
                            <div className="flex items-center space-x-4 mb-3">
                                <location.icon size={32} className={selectedLocation.id === location.id ? 'text-orange-400' : 'text-orange-600'} />
                                <h3 className="text-xl font-extrabold">{location.city}</h3>
                            </div>
                            <p className="text-sm opacity-80">{location.address}</p>
                            <div className="flex items-center space-x-2 mt-3 text-sm font-semibold">
                                <CalendarClock size={16} className={selectedLocation.id === location.id ? 'text-blue-200' : 'text-blue-900'} />
                                <span className={selectedLocation.id === location.id ? 'text-blue-200' : 'text-gray-700'}>Hours: {location.hours}</span>
                            </div>
                            <p className={`text-xs mt-3 italic ${selectedLocation.id === location.id ? 'text-blue-200' : 'text-gray-500'}`}>{location.details}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Animated Map Section */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-900"
                >
                    <img
                        src={`https://via.placeholder.com/1600x800/${selectedLocation.id === 1 ? 'FF7A00' : selectedLocation.id === 2 ? '003366' : 'C0C0C0'}/fff?text=SLB+Global+Office+Map+-+${selectedLocation.city.replace(/\s/g, '+')}`}
                        alt={`Simulated map view of ${selectedLocation.city}`}
                        className="w-full h-full object-cover transition-opacity duration-500"
                    />

                    {/* Dynamic Map Pin Indicator */}
                    <motion.div
                        key={selectedLocation.id}
                        initial={{ opacity: 0, y: -100, rotate: -45 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ duration: 0.7, type: 'spring', stiffness: 150, damping: 10 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full cursor-pointer"
                        style={{ filter: `drop-shadow(0 0 15px ${SLB_COLORS.AccentOrange})` }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        <MapPin size={64} className="text-orange-600 fill-current" />
                        <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 -translate-y-full p-2 bg-blue-900 text-white rounded-lg whitespace-nowrap text-md font-extrabold shadow-xl border border-orange-400">
                            {selectedLocation.city.split(' ')[0]}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

// --- 4. Contact Channels Section (Updated Icons) ---
const ContactChannelsSection: React.FC = () => {
    const channels = [
        { title: "Strategic Sales", icon: TrendingUp, phone: "+1 (800) 555-SLBS", email: "sales@slbrothers.com", description: "For project quotes, enterprise partnerships, and high-level strategic planning." },
        { title: "24/7 Technical Support", icon: Zap, phone: "+1 (800) 555-TECH", email: "support@slbrothers.com", description: "Immediate assistance for platform stability, integration issues, and technical escalations." },
        { title: "Public Relations & Media", icon: MessageCircle, phone: "+1 (800) 555-NEWS", email: "media@slbrothers.com", description: "Contact for media inquiries, interviews with executives, and branding assets." },
    ]

    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Direct Communication Lines"
                    subtitle="Specialized Channel Access"
                    icon={Layers}
                    color="text-orange-600"
                />

                <div className="grid md:grid-cols-3 gap-10">
                    {channels.map((channel, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            whileHover={{ y: -8, boxShadow: '0 25px 40px rgba(0, 0, 0, 0.2)', transition: { type: "spring", stiffness: 300 } }}
                        >
                            <Card className="text-center h-full p-8 border-b-8 border-blue-900 hover:border-orange-600 transition-colors duration-500">
                                <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                    <channel.icon size={36} className="text-orange-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-blue-900 mb-3">{channel.title}</h3>
                                <p className="text-gray-600 mb-4 text-sm font-medium">{channel.description}</p>

                                <div className="space-y-3 mt-6 border-t pt-4 border-gray-100">
                                    <div className="flex items-center justify-center space-x-2 text-lg font-extrabold text-orange-600">
                                        <Phone size={20} />
                                        <a href={`tel:${channel.phone}`} className="hover:text-blue-900 transition-colors">{channel.phone}</a>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2 text-md font-semibold text-blue-900">
                                        <Mail size={20} />
                                        <a href={`mailto:${channel.email}`} className="text-gray-700 hover:text-orange-600 transition-colors">{channel.email}</a>
                                    </div>
                                </div>

                                <Button variant="outline" className="mt-8">
                                    <CalendarClock size={16} className="mr-2"/> Book a Meeting
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// --- 5. Recruitment/Careers Callout Section (Improved Animation) ---
const RecruitmentCallout: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-20 bg-gradient-to-r from-blue-900 to-blue-800">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col lg:flex-row items-center justify-between p-12 rounded-2xl border-4 border-orange-400 shadow-3xl bg-blue-900/50"
                >
                    <div className="flex items-center space-x-6 text-white mb-6 lg:mb-0">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="p-4 bg-orange-600 rounded-full shadow-lg"
                        >
                            <Users size={52} />
                        </motion.div>
                        <div>
                            <h3 className="text-4xl font-black">Careers at SL Brothers</h3>
                            <p className="text-orange-400 mt-1 text-lg">Shape the future of IT & EdTech with us.</p>
                        </div>
                    </div>
                    <Button variant="primary" size="lg" className="bg-white text-blue-900 border-white hover:bg-gray-200">
                        <Award size={20} className="mr-2" /> Explore Opportunities
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}

// --- 6. FAQs Accordion (Stylistic Updates) ---
const FAQAccordion: React.FC = () => {
    const [openId, setOpenId] = useState<number | null>(null)

    const toggleFAQ = (id: number) => {
        setOpenId(openId === id ? null : id)
    }

    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section ref={ref} className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Knowledge Base Access"
                    subtitle="Instant Answers"
                    icon={HelpCircle}
                    color="text-orange-600"
                />

                <div className="max-w-5xl mx-auto space-y-6">
                    {mockFAQs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="border border-gray-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <button
                                onClick={() => toggleFAQ(faq.id)}
                                className="w-full text-left p-6 flex justify-between items-center transition-all duration-300"
                                style={{ backgroundColor: openId === faq.id ? SLB_COLORS.PrimaryBlue : 'white' }}
                            >
                                <span className={`text-xl font-extrabold ${openId === faq.id ? 'text-white' : 'text-blue-900'}`}>{faq.question}</span>
                                {openId === faq.id ? (
                                    <ChevronUp size={28} className="text-orange-400 flex-shrink-0" />
                                ) : (
                                    <ChevronDown size={28} className="text-orange-600 flex-shrink-0" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openId === faq.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="p-6 border-t border-gray-200 bg-gray-100"
                                    >
                                        <p className="text-gray-700 text-lg leading-relaxed">{faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// --- 7. Main Contact Component ---
const Contact: React.FC = () => {
    const hqLocation = mockLocations.find(loc => loc.city.includes('HQ')) || mockLocations[0]

    return (
        <div className="min-h-screen bg-white font-['Poppins']">
            {/* Hero/Header Section (Gradient Background) */}
            <header className="py-24 bg-gradient-to-br from-blue-900 to-blue-700 shadow-xl">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <MapPin size={60} className="text-orange-400 mx-auto mb-4" />
                        <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
                            Global Contact Hub
                        </h1>
                        <p className="text-xl text-blue-200 max-w-4xl mx-auto font-light">
                            Your direct gateway to **SL Brothers'** specialized teams in IT consulting, software engineering, and EdTech innovation.
                        </p>
                    </motion.div>
                </div>
            </header>

            <main>
                {/* 1. Primary Contact Form & Channels */}
                <section className="py-24 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-7">
                                <ContactForm />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 50, delay: 0.4 }}
                                className="lg:col-span-5 p-8 rounded-2xl border-l-4 border-orange-600 bg-white shadow-2xl h-fit"
                            >
                                <Building size={48} className="text-blue-900 mb-4" />
                                <h3 className="text-3xl font-extrabold text-blue-900 mb-3">Global Headquarters</h3>
                                <p className="text-lg text-gray-600 mb-6 font-medium">Connect directly with our executive and global strategy team.</p>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <MapPin size={24} className="text-orange-600 flex-shrink-0" />
                                        <span className="font-semibold text-gray-700">{hqLocation.address}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone size={24} className="text-orange-600 flex-shrink-0" />
                                        <span className="font-semibold text-gray-700">{hqLocation.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <CalendarClock size={24} className="text-orange-600 flex-shrink-0" />
                                        <span className="font-semibold text-gray-700">{hqLocation.hours}</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <Button variant="outline" className="w-full">
                                            <Navigation size={18} className="mr-2" /> Get Directions
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <InteractiveMapSection />
                <ContactChannelsSection />
                <RecruitmentCallout />
                <FAQAccordion />

            </main>

            {/* Footer Placeholder (Optional) */}
            <footer className="py-10 bg-blue-950 text-center text-gray-400 text-sm">
                <div className="container mx-auto px-4">
                    Â© {new Date().getFullYear()} SL Brothers. All Rights Reserved.
                </div>
            </footer>
        </div>
    )
}

export default Contact