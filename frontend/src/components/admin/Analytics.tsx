import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  pendingEvents: number;
  activeSponsors: number;
  recentEvents: Array<{
    id: string;
    title: string;
    date: string;
    attendees: number;
  }>;
  usersByRole: {
    user: number;
    admin: number;
    sponsor: number;
  };
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/v1/admin/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{data.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{data.totalEvents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Events</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{data.pendingEvents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Sponsors</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{data.activeSponsors}</p>
        </div>
      </div>

      {/* User Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h3>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Users: {data.usersByRole.user}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                Sponsors: {data.usersByRole.sponsor}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                Admins: {data.usersByRole.admin}
              </span>
            </div>
          </div>
          <div className="flex h-4 mb-4 overflow-hidden bg-gray-100 rounded">
            <div 
              style={{ width: `${(data.usersByRole.user / data.totalUsers) * 100}%` }}
              className="bg-blue-500"
            />
            <div 
              style={{ width: `${(data.usersByRole.sponsor / data.totalUsers) * 100}%` }}
              className="bg-green-500"
            />
            <div 
              style={{ width: `${(data.usersByRole.admin / data.totalUsers) * 100}%` }}
              className="bg-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {data.recentEvents.map((event) => (
            <div key={event.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {event.attendees} attendees
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
