
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPlaceholder: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Venue not found</h2>
      <button 
        onClick={() => navigate('/locals')}
        className="tango-button"
      >
        Browse Venues
      </button>
    </div>
  );
};

export default NotFoundPlaceholder;
