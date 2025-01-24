import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { MarketingCampaign } from '../../types/admin';

interface CampaignFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'email' | 'social' | 'push' | 'ai_generated';
  targetAudience: string[];
}

const MarketingManager = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'email',
    targetAudience: [],
  });

  const { token } = useAuth();

  useEffect(() => {
    void fetchCampaigns();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/v1/marketing/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const data = await response.json();
      setCampaigns(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/marketing/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'draft',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      await fetchCampaigns();
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        type: 'email',
        targetAudience: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/marketing/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      await fetchCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Marketing Campaigns
        </h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          {showForm ? 'Cancel' : 'New Campaign'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label 
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="campaignType"
              className="block text-sm font-medium text-gray-700"
            >
              Campaign Type
            </label>
            <select
              id="campaignType"
              value={formData.type}
              onChange={(e) => setFormData({ 
                ...formData, 
                type: e.target.value as CampaignFormData['type']
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="email">Email</option>
              <option value="social">Social Media</option>
              <option value="push">Push Notification</option>
              <option value="ai_generated">AI Generated</option>
            </select>
          </div>

          <div>
            <label 
              htmlFor="targetAudience"
              className="block text-sm font-medium text-gray-700"
            >
              Target Audience
            </label>
            <div className="mt-2 space-y-2">
              {['all', 'active_users', 'inactive_users', 'sponsors'].map((audience) => (
                <label key={audience} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={formData.targetAudience.includes(audience)}
                    onChange={(e) => {
                      const newAudience = e.target.checked
                        ? [...formData.targetAudience, audience]
                        : formData.targetAudience.filter((a) => a !== audience);
                      setFormData({ ...formData, targetAudience: newAudience });
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {audience.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
              Create Campaign
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-lg shadow p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900">
                {campaign.title}
              </h3>
              <button
                type="button"
                onClick={() => handleDelete(campaign.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-600">{campaign.description}</p>
            <div className="text-sm text-gray-500">
              <p>Type: {campaign.type}</p>
              <p>Status: {campaign.status}</p>
              <p>Start: {new Date(campaign.startDate).toLocaleDateString()}</p>
              <p>End: {new Date(campaign.endDate).toLocaleDateString()}</p>
            </div>
            {campaign.metrics && (
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-900">Metrics</h4>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Reach</p>
                    <p className="text-lg font-medium">{campaign.metrics.reach}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Engagement</p>
                    <p className="text-lg font-medium">
                      {campaign.metrics.engagement}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Conversions</p>
                    <p className="text-lg font-medium">
                      {campaign.metrics.conversions}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketingManager;
