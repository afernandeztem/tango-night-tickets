import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import TangoLogo from './TangoLogo';

const Footer: React.FC = () => {
  const { state } = useApp();
  
  const translations = {
    en: {
      about: 'About TangoApp',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      contact: 'Contact Us',
      help: 'Help Center',
      faq: 'FAQ',
      follow: 'Follow Us',
      download: 'Download the app',
      copyright: '© 2023 TangoApp. All rights reserved.',
      slogan: 'Discover nightlife. Buy tickets. Enjoy the night.'
    },
    es: {
      about: 'Sobre TangoApp',
      terms: 'Términos de Servicio',
      privacy: 'Política de Privacidad',
      contact: 'Contáctanos',
      help: 'Centro de Ayuda',
      faq: 'Preguntas Frecuentes',
      follow: 'Síguenos',
      download: 'Descarga la aplicación',
      copyright: '© 2023 TangoApp. Todos los derechos reservados.',
      slogan: 'Descubre la vida nocturna. Compra entradas. Disfruta la noche.'
    }
  };
  
  const t = translations[state.language];
  
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <TangoLogo variant="icon" className="h-10" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {t.slogan}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-tango-primary">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-tango-primary">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-tango-primary">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4">TANGOAPP</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-tango-primary">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-tango-primary">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-tango-primary">
                  {t.privacy}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4">{t.help}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-tango-primary">
                  {t.contact}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-tango-primary">
                  {t.faq}
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-tango-primary">
                  {t.download}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4">{t.download}</h4>
            <div className="flex flex-col space-y-2">
              <a href="#" className="border border-gray-200 rounded-md px-4 py-2 flex items-center hover:border-tango-primary transition-colors">
                <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5Z"></path>
                  <path d="M13 3.5C13.73 4.18 14.94 4.97 14.94 6.5C14.94 8.17 13.85 9.19 13.06 9.88C12.24 10.6 11.26 10.5 11.26 10.5C11.26 10.5 10.97 8.83 11.82 7.56C12.62 6.38 13.61 6.13 13 3.5Z"></path>
                </svg>
                <div className="flex flex-col">
                  <span className="text-xs">Download on the</span>
                  <span className="text-sm font-semibold">App Store</span>
                </div>
              </a>
              <a href="#" className="border border-gray-200 rounded-md px-4 py-2 flex items-center hover:border-tango-primary transition-colors">
                <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9L12 3L21 9V21H3V9Z"></path>
                  <path d="M13 18V13H11V18"></path>
                  <path d="M8 12L12 8L16 12"></path>
                </svg>
                <div className="flex flex-col">
                  <span className="text-xs">GET IT ON</span>
                  <span className="text-sm font-semibold">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-8 pt-6">
          <p className="text-sm text-gray-500 text-center">
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
