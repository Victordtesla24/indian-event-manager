import { ReactNode } from 'react';

interface SkeletonLoaderProps {
  className?: string;
  children?: ReactNode;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'shimmer';
}

const SkeletonLoader = ({ 
  className = '', 
  children, 
  variant = 'rectangular',
  animation = 'shimmer'
}: SkeletonLoaderProps) => {
  const baseClasses = 'bg-gray-200 relative overflow-hidden';
  const variantClasses = {
    text: 'h-4 w-3/4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };
  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer'
  };

  return (
    <div 
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      aria-hidden="true"
    >
      {/* Hide actual content during loading */}
      <div className="invisible">{children}</div>
    </div>
  );
};

export const EventCardSkeleton = () => {
  return (
    <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-sm">
      <SkeletonLoader className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <SkeletonLoader variant="text" className="w-3/4" />
        <SkeletonLoader variant="text" className="w-1/2" />
      </div>
    </div>
  );
};

export const EventDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex space-x-2">
        <SkeletonLoader variant="text" className="w-16" />
        <SkeletonLoader variant="text" className="w-24" />
        <SkeletonLoader variant="text" className="w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image */}
          <SkeletonLoader className="w-full aspect-video rounded-lg" />
          
          {/* Title and Description */}
          <div className="space-y-4">
            <SkeletonLoader variant="text" className="w-3/4 h-8" />
            <div className="space-y-2">
              <SkeletonLoader variant="text" className="w-full" />
              <SkeletonLoader variant="text" className="w-full" />
              <SkeletonLoader variant="text" className="w-2/3" />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonLoader variant="text" className="w-1/3" />
                <SkeletonLoader variant="text" className="w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Booking Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 space-y-6">
            <SkeletonLoader variant="text" className="w-1/2 h-6" />
            <SkeletonLoader className="w-full h-12 rounded-md" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <SkeletonLoader variant="text" className="w-1/4" />
                  <SkeletonLoader className="w-full h-10 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
