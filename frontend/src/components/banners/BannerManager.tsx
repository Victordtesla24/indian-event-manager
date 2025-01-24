import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Banner {
  id: string;
  image_url: string;
  link_url: string;
  position: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  views_count: number;
  clicks_count: number;
}

interface BannerFormData {
  image_url: string;
  link_url: string;
  position: string;
  start_date: string;
  end_date: string;
}

const BannerManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [formData, setFormData] = useState<BannerFormData>({
    image_url: '',
    link_url: '',
    position: 'top',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(
      new Date(new Date().setMonth(new Date().getMonth() + 1)),
      'yyyy-MM-dd'
    ),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/v1/banners/sponsor/me');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to load banners');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('/api/v1/banners/', formData);
      await fetchBanners();
      setFormData({
        image_url: '',
        link_url: '',
        position: 'top',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: format(
          new Date(new Date().setMonth(new Date().getMonth() + 1)),
          'yyyy-MM-dd'
        ),
      });
    } catch (error) {
      console.error('Error creating banner:', error);
      setError('Failed to create banner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await axios.put(`/api/v1/banners/${banner.id}`, {
        is_active: !banner.is_active,
      });
      await fetchBanners();
    } catch (error) {
      console.error('Error updating banner:', error);
      setError('Failed to update banner');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Banner Management</h2>

      {/* Create Banner Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="image_url"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <input
            type="url"
            id="image_url"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="link_url"
            className="block text-sm font-medium text-gray-700"
          >
            Link URL
          </label>
          <input
            type="url"
            id="link_url"
            value={formData.link_url}
            onChange={(e) =>
              setFormData({ ...formData, link_url: e.target.value })
            }
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700"
          >
            Position
          </label>
          <select
            id="position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="top">Top</option>
            <option value="sidebar">Sidebar</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="end_date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {isLoading ? 'Creating...' : 'Create Banner'}
        </button>
      </form>

      {/* Banner List */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Your Banners</h3>
        <div className="space-y-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={banner.image_url}
                  alt="Banner preview"
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">Position: {banner.position}</p>
                  <p className="text-sm text-gray-500">
                    Views: {banner.views_count} | Clicks: {banner.clicks_count}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(banner.start_date), 'MMM d, yyyy')} -{' '}
                    {format(new Date(banner.end_date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleActive(banner)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  banner.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {banner.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerManager;
