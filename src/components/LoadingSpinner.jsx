import React from 'react';

const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[var(--color-brand-primary)] rounded-full border-t-transparent animate-spin"></div>
      </div>
      {text && (
        <p className="text-[var(--color-brand-primary)] font-semibold animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
