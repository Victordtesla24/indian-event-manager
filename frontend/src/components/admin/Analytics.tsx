import { useEffect, useState } from 'react';
import LineChart from './charts/LineChart';

interface AnalyticsData {
  userGrowth: {
    labels: string[];
    values: number[];
  };
  eventGrowth: {
    labels: string[];
    values: number[];
  };
  revenueGrowth: {
    labels: string[];
    values: number[];
  };
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/v1/admin/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg mb-8" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
        <p className="mt-1 text-sm text-gray-500">
          Key metrics and trends for your events platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
          <LineChart
            data={data.userGrowth.values}
            labels={data.userGrowth.labels}
            label="Users"
            borderColor="#10B981"
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Event Growth</h3>
          <LineChart
            data={data.eventGrowth.values}
            labels={data.eventGrowth.labels}
            label="Events"
            borderColor="#4F46E5"
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Growth</h3>
          <LineChart
            data={data.revenueGrowth.values}
            labels={data.revenueGrowth.labels}
            label="Revenue"
            borderColor="#F59E0B"
          />
        </div>
      </div>
    </div>
  );
}
