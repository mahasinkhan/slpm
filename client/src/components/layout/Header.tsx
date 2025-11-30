import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, User, Search, Sparkles, Command } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Logo from '@/components/common/Logo'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'standard' | 'ai'>('standard')
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef<HTMLDivElement>(null)

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Divisions', path: '/divisions' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'News', path: '/news' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ]

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSearchOpen])

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      if (searchType === 'ai') {
        navigate(`/search/ai?q=${encodeURIComponent(searchQuery)}`)
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      }
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  // Function to get dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user) return '/'
    
    console.log('User Role:', user.role) // Debug log
    
    switch (user.role) {
      case 'SUPERADMIN':
        return '/superadmin'
      case 'ADMIN':
        return '/admin'
      case 'EMPLOYEE':
        return '/employee/dashboard'
      default:
        return '/'
    }
  }

  // Function to get dashboard label based on user role
  const getDashboardLabel = () => {
    if (!user) return 'Dashboard'
    
    switch (user.role) {
      case 'SUPERADMIN':
        return 'Super Admin'
      case 'ADMIN':
        return 'Admin Dashboard'
      case 'EMPLOYEE':
        return 'Employee Portal'
      default:
        return 'Dashboard'
    }
  }

  // Check if we're on a dashboard/portal page (hide main navigation)
  const isDashboardPage = location.pathname.startsWith('/admin') || 
                          location.pathname.startsWith('/superadmin') || 
                          location.pathname.startsWith('/employee')

  // Don't render header on dashboard pages (they have their own layout)
  if (isDashboardPage && location.pathname !== '/') {
    return null
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-professional border-b border-grey-200">
        <nav className="container-custom">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="group">
              <Logo size="medium" showText={true} className="transition-transform duration-200 group-hover:scale-105" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="nav-link"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Section - Search & Auth */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Trigger Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-grey-50 hover:bg-grey-100 rounded-lg transition-all duration-200 text-grey-600 hover:text-grey-900 border border-grey-200"
              >
                <Search size={18} />
                <span className="text-sm font-medium">Search</span>
                <div className="hidden xl:flex items-center space-x-1 ml-2 px-2 py-0.5 bg-white rounded border border-grey-200">
                  <Command size={12} className="text-grey-400" />
                  <span className="text-xs text-grey-400">K</span>
                </div>
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4 pl-4 border-l border-grey-200">
                  <button
                    onClick={() => navigate(getDashboardRoute())}
                    className="flex items-center space-x-2 text-grey-700 hover:text-primary transition-colors duration-200"
                  >
                    <User size={20} />
                    <span className="font-medium">{user?.firstName}</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-grey-600 hover:text-red-600 transition-colors duration-200"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-grey-50 transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={20} className="text-grey-700" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-grey-50 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} className="text-grey-700" /> : <Menu size={24} className="text-grey-700" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden pb-4 animate-fade-in">
              <div className="flex flex-col space-y-1 border-t border-grey-200 pt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-grey-700 hover:bg-grey-50 hover:text-primary rounded-lg transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        navigate(getDashboardRoute())
                        setIsOpen(false)
                      }}
                      className="px-4 py-3 text-primary hover:bg-grey-50 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2 text-left w-full"
                    >
                      <User size={20} />
                      <span>{getDashboardLabel()}</span>
                    </button>
                    <button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="px-4 py-3 text-red-600 hover:bg-grey-50 rounded-lg text-left transition-colors duration-200 font-medium flex items-center space-x-2 w-full"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="px-4 pt-2">
                    <button
                      onClick={() => {
                        navigate('/login')
                        setIsOpen(false)
                      }}
                      className="btn-primary w-full"
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-grey-900/50 backdrop-blur-sm animate-fade-in">
          <div className="min-h-screen px-4 flex items-start justify-center pt-20 pb-20">
            <div 
              ref={searchRef}
              className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl animate-fade-in"
            >
              {/* Search Header */}
              <div className="border-b border-grey-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-grey-900">Search</h3>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-grey-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-grey-500" />
                  </button>
                </div>

                {/* Search Type Tabs */}
                <div className="flex space-x-2 p-1 bg-grey-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSearchType('standard')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
                      searchType === 'standard'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-grey-600 hover:text-grey-900'
                    }`}
                  >
                    <Search size={16} />
                    <span>Standard Search</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('ai')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
                      searchType === 'ai'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-grey-600 hover:text-grey-900'
                    }`}
                  >
                    <Sparkles size={16} />
                    <span>AI Search</span>
                  </button>
                </div>
              </div>

              {/* Search Input */}
              <form onSubmit={handleSearch} className="p-6">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-400">
                    {searchType === 'ai' ? (
                      <Sparkles size={22} className="text-primary" />
                    ) : (
                      <Search size={22} />
                    )}
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      searchType === 'ai'
                        ? 'Ask me anything about our services, projects, or company...'
                        : 'Search for services, projects, news, careers...'
                    }
                    className="w-full pl-14 pr-32 py-4 text-lg border border-grey-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-grey-50 focus:bg-white"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Search
                  </button>
                </div>

                {/* Search Info */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <p className="text-grey-500">
                    {searchType === 'ai' ? (
                      <span className="flex items-center space-x-1.5">
                        <Sparkles size={14} className="text-primary" />
                        <span>AI will understand your question and provide intelligent answers</span>
                      </span>
                    ) : (
                      <span>Fast keyword search across all content</span>
                    )}
                  </p>
                  <span className="text-grey-400">Press ESC to close</span>
                </div>
              </form>

              {/* Quick Links / Suggestions */}
              <div className="border-t border-grey-200 p-6 bg-grey-50 rounded-b-2xl">
                <h4 className="text-sm font-semibold text-grey-900 mb-3">Popular Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {['Our Services', 'Current Projects', 'Career Opportunities', 'Contact Us', 'About SL Brothers'].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSearchQuery(item)
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-primary hover:text-white text-grey-700 text-sm rounded-lg border border-grey-200 transition-all duration-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header