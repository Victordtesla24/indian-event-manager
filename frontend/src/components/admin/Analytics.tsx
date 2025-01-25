import { useState, useEffect, type FC } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AnalyticsData {
  total_users: number;
  active_users: number;
  total_events: number;
  pending_events: number;
  active_sponsors: number;
  users_by_role: {
    user: number;
    admin: number;
    sponsor: number;
  };
  recent_events: Array<{
    id: string;
    title: string;
    date: string;
    attendees: number;
  }>;
}

const Analytics: FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const { API_ROUTES, fetchApi } = await import('../../utils/api');
        console.log('Making API request to:', API_ROUTES.admin.analytics);
        const token = localStorage.getItem('token');
        console.log('Using token:', token);
        const analyticsData = await fetchApi(API_ROUTES.admin.analytics);
        console.log('Received data:', analyticsData);
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
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
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Total Users</h4>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {data.total_users}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Active Users</h4>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {data.active_users}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Active Sponsors</h4>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {data.active_sponsors}
          </p>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Total Events</h4>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {data.total_events}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Pending Events</h4>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {data.pending_events}
          </p>
        </div>
      </div>

      {/* User Role Distribution */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Users by Role</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Users</p>
              <p className="mt-1 text-2xl font-semibold">{data.users_by_role.user}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Admins</p>
              <p className="mt-1 text-2xl font-semibold">{data.users_by_role.admin}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Sponsors</p>
              <p className="mt-1 text-2xl font-semibold">{data.users_by_role.sponsor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {data.recent_events.map((event) => (
            <div key={event.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>{event.attendees} attendees</p>
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
