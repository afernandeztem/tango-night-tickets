
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NotFoundPlaceholder: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  
  const translations = {
    en: {
      title: 'Venue not found',
      description: 'We couldn\'t find the venue you\'re looking for. It may have been removed or the URL might be incorrect.',
      browseButton: 'Browse Venues'
    },
    es: {
      title: 'Local no encontrado',
      description: 'No pudimos encontrar el local que estás buscando. Es posible que haya sido eliminado o que la URL sea incorrecta.',
      browseButton: 'Explorar Locales'
    }
  };
  
  const t = translations[state.language];
  
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold">{t.title}</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-4">{t.description}</p>
        <button 
          onClick={() => navigate('/locals')}
          className="tango-button"
        >
          {t.browseButton}
        </button>
      </div>
    </div>
  );
};

export default NotFoundPlaceholder;
