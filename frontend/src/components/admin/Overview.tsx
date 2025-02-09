import { useEffect, useState } from 'react';
import LineChart from './charts/LineChart';

interface TrendData {
  labels: string[];
  values: number[];
}

interface OverviewData {
  eventTrends: TrendData;
  userTrends: TrendData;
  revenueTrends: TrendData;
}

export default function Overview() {
  const [data, setData] = useState<OverviewData>({
    eventTrends: { labels: [], values: [] },
    userTrends: { labels: [], values: [] },
    revenueTrends: { labels: [], values: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await fetch('/api/v1/admin/overview');
        if (!response.ok) {
          throw new Error('Failed to fetch overview data');
        }
        const overviewData = await response.json();
        setData(overviewData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Key metrics and trends for your events platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Event Growth</h3>
          <LineChart
            data={data.eventTrends.values}
            labels={data.eventTrends.labels}
            label="Events"
            borderColor="#4F46E5"
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
          <LineChart
            data={data.userTrends.values}
            labels={data.userTrends.labels}
            label="Users"
            borderColor="#10B981"
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Growth</h3>
          <LineChart
            data={data.revenueTrends.values}
            labels={data.revenueTrends.labels}
            label="Revenue"
            borderColor="#F59E0B"
          />
        </div>
      </div>
    </div>
  );
}
