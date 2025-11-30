import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react'

const Footer = () => {
  const companyInfo = {
    address: '167-169, Great Portland Street, 5th Floor',
    city: 'London, United Kingdom, W1W 5PF',
    phone: '+44 7405 005823',
    email: 'hello@slbrothers.co.uk',
    companyNumber: '16804263'
  }

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Divisions', path: '/divisions' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Careers', path: '/careers' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Use', path: '/terms' },
    { name: 'Cookie Settings', path: '/cookies' },
  ]

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-black text-xl tracking-brand">SLB</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">SL BROTHERS</span>
                <p className="text-xs text-accent">Ltd</p>
              </div>
            </div>
            <p className="text-accent-light text-sm mb-4">
              Building the future through learning, technology & innovation
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-accent-light hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-accent-light">
                  {companyInfo.address}<br />
                  {companyInfo.city}
                </span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone size={18} className="flex-shrink-0" />
                <a href={`tel:${companyInfo.phone}`} className="text-accent-light hover:text-white">
                  {companyInfo.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail size={18} className="flex-shrink-0" />
                <a href={`mailto:${companyInfo.email}`} className="text-accent-light hover:text-white">
                  {companyInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Our Values */}
          <div>
            <h3 className="font-bold text-lg mb-4">Our Values</h3>
            <ul className="space-y-2 text-accent-light text-sm">
              <li>âœ“ Integrity</li>
              <li>âœ“ Innovation</li>
              <li>âœ“ Impact</li>
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Business Enquiries</h4>
              <a href="mailto:business@slbrothers.co.uk" className="text-sm text-accent-light hover:text-white">
                business@slbrothers.co.uk
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-accent-light text-center md:text-left">
              Â© {new Date().getFullYear()} SL Brothers Ltd. All rights reserved.
              <span className="block md:inline md:ml-2">
                Company No. {companyInfo.companyNumber} | Registered in England & Wales
              </span>
            </p>
            <div className="flex space-x-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm text-accent-light hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
