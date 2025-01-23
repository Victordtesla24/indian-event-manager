import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer relative mt-auto">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-geometric-pattern opacity-20" />
      <div className="absolute inset-0 bg-peacock-feather bg-no-repeat bg-[length:200px_200px] bg-center opacity-10" />

      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-peacock-lime via-peacock-teal to-peacock-blue opacity-50" />

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Indian Events</h3>
            <p className="text-white/80">
              Connecting the Indian community through cultural celebrations and events in Melbourne and Sydney.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/events" 
                  className="text-white/80 hover:text-peacock-lime-light transition-colors"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-white/80 hover:text-peacock-lime-light transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-white/80 hover:text-peacock-lime-light transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-white/80 hover:text-peacock-lime-light transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
            <div className="space-y-2 text-white/80">
              <p className="flex items-center">
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="img"
                >
                  <title>Location</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                Melbourne & Sydney, Australia
              </p>
              <p className="flex items-center">
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  role="img"
                >
                  <title>Email</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                contact@indianevents.com.au
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2025 Indian Events. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                to="/privacy" 
                className="text-white/60 hover:text-peacock-lime-light text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-white/60 hover:text-peacock-lime-light text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
