
import React from 'react';
import { Link } from 'react-router-dom';

interface TangoLogoProps {
  variant?: 'full' | 'icon';
  className?: string;
  linkTo?: string | null;
}

const TangoLogo: React.FC<TangoLogoProps> = ({ 
  variant = 'full', 
  className = '', 
  linkTo = '/home' 
}) => {
  const logoContent = variant === 'full' ? (
    <img 
      src="/lovable-uploads/72e6240a-1c5c-42bc-9bab-23901aef3628.png" 
      alt="TangoApp" 
      className={`transition-all duration-300 hover:scale-105 ${className}`} 
    />
  ) : (
    <img 
      src="/lovable-uploads/82b4e724-50b4-4300-b958-7562cd8cfa4e.png" 
      alt="TangoApp" 
      className={`h-10 ${className}`} 
    />
  );
  
  return linkTo ? (
    <Link to={linkTo} className="flex items-center">
      {logoContent}
    </Link>
  ) : (
    <div className="flex items-center">
      {logoContent}
    </div>
  );
};

export default TangoLogo;
