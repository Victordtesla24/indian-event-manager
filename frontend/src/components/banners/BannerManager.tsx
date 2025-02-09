import { useEffect, useState } from 'react';
import { Banner } from '../../types/banner';
import api from '../../utils/api';

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await api.get('/admin/banners');
      if (response.data && Array.isArray(response.data)) {
        setBanners(response.data as Banner[]);
      } else {
        setError('Invalid banner data received');
      }
    } catch (err) {
      setError('Failed to fetch banners');
      console.error('Banner fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (bannerId: number) => {
    try {
      await api.patch(`/admin/banners/${bannerId}/activate`);
      await fetchBanners(); // Refresh list
    } catch (err) {
      setError('Failed to activate banner');
      console.error('Banner activation error:', err);
    }
  };

  const handleDeactivate = async (bannerId: number) => {
    try {
      await api.patch(`/admin/banners/${bannerId}/deactivate`);
      await fetchBanners(); // Refresh list
    } catch (err) {
      setError('Failed to deactivate banner');
      console.error('Banner deactivation error:', err);
    }
  };

  const handleDelete = async (bannerId: number) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      await api.delete(`/admin/banners/${bannerId}`);
      await fetchBanners(); // Refresh list
    } catch (err) {
      setError('Failed to delete banner');
      console.error('Banner deletion error:', err);
    }
  };

  if (loading) {
    return <div>Loading banners...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Banner Management</h2>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => {/* TODO: Implement banner creation */}}
        >
          Add Banner
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {banners.map((banner) => (
            <li key={banner.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="h-16 w-24 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{banner.title}</h3>
                    {banner.description && (
                      <p className="text-sm text-gray-500">{banner.description}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {banner.category || 'No category'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {banner.is_active ? (
                    <button
                      onClick={() => handleDeactivate(banner.id)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(banner.id)}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
