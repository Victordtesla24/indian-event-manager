interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  fullScreen = true,
  className = ''
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-3',
    lg: 'h-16 w-16 border-4'
  };

  const containerClasses = fullScreen ? 'flex items-center justify-center min-h-screen' : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Outer spinner */}
        <div 
          className={`
            ${sizeClasses[size]}
            rounded-full
            border-primary-200
            border-t-primary-600
            animate-spin
            ${className}
          `}
        />
        
        {/* Inner decorative ring */}
        <div 
          className={`
            absolute inset-0
            rounded-full
            border-2
            border-primary-100/30
            animate-pulse
          `}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
