
import React from 'react';

const LoadingPlaceholder: React.FC = () => {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-72 bg-gray-200 rounded-xl"></div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="flex space-x-4">
        <div className="h-20 bg-gray-200 rounded w-1/4"></div>
        <div className="h-20 bg-gray-200 rounded w-1/4"></div>
        <div className="h-20 bg-gray-200 rounded w-1/4"></div>
        <div className="h-20 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default LoadingPlaceholder;
