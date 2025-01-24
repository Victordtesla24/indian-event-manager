import { useEffect, useState } from 'react';
import axios from 'axios';

interface Banner {
  id: string;
  image_url: string;
  link_url: string;
  position: string;
}

interface BannerDisplayProps {
  position: string;
  className?: string;
}

const BannerDisplay: React.FC<BannerDisplayProps> = ({ position, className }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `/api/v1/banners/active/?position=${position}`
        );
        setBanners(response.data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, [position]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Rotate every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const handleBannerInteraction = async (banner: Banner) => {
    try {
      await axios.post(`/api/v1/banners/${banner.id}/click`);
      window.open(banner.link_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error recording banner click:', error);
      window.open(banner.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    const recordView = async () => {
      if (banners.length > 0) {
        try {
          await axios.post(
            `/api/v1/banners/${banners[currentIndex].id}/view`
          );
        } catch (error) {
          console.error('Error recording banner view:', error);
        }
      }
    };

    recordView();
  }, [currentIndex, banners]);

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <button
      type="button"
      className={`banner-display w-full border-none p-0 ${className || ''}`}
      onClick={() => handleBannerInteraction(currentBanner)}
    >
      <img
        src={currentBanner.image_url}
        alt={`Advertisement by ${currentBanner.id}`}
        className="w-full h-full object-cover"
      />
      {banners.length > 1 && (
        <div className="banner-dots flex justify-center mt-2">
          {banners.map((banner) => (
            <span
              key={banner.id}
              className={`h-2 w-2 mx-1 rounded-full ${
                banner.id === currentBanner.id
                  ? 'bg-primary'
                  : 'bg-gray-300'
              }`}
              role="presentation"
            />
          ))}
        </div>
      )}
    </button>
  );
};

export default BannerDisplay;
