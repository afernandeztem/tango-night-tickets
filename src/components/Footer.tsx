
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-tango-primary flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="ml-2 text-xl font-medium">TangoApp</span>
            </Link>
            <p className="mt-4 text-gray-600 text-sm">
              Discover nightlife, buy tickets, and enjoy the night!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-tango-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/locals" className="text-gray-600 hover:text-tango-primary text-sm">
                  Locals
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-600 hover:text-tango-primary text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="text-gray-600 hover:text-tango-primary text-sm">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-tango-primary text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-tango-primary text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-tango-primary text-sm">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-600 hover:text-tango-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-tango-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-tango-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-600 text-sm">
              Email: <a href="mailto:info@tangoapp.com" className="hover:text-tango-primary">info@tangoapp.com</a>
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} TangoApp. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Download the TangoApp mobile app for the best experience.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
