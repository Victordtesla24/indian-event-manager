import { useEffect, useState } from 'react';
import { Banner } from '../../types/banner';
import api from '../../utils/api';

interface BannerDisplayProps {
  category?: string;
}

export default function BannerDisplay({ category }: BannerDisplayProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.get('/banners', {
          params: { category }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setBanners(response.data as Banner[]);
        } else {
          setError('Invalid banner data received');
        }
      } catch (err) {
        setError('Failed to fetch banners');
        console.error('Banner fetch error:', err);
      }
    };

    fetchBanners();
  }, [category]);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="banner-display">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="relative w-full h-64 md:h-96 bg-gray-200 overflow-hidden"
        >
          <img
            src={banner.image_url}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <h3 className="text-xl font-bold">{banner.title}</h3>
            {banner.description && (
              <p className="mt-2">{banner.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
