import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LineChart from './charts/LineChart';
import api from '../../utils/api';

interface Metric {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

interface ChartData {
  labels: string[];
  values: number[];
}

const Overview = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: 'Total Events',
      value: 0,
      change: 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
          <title>Events icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Active Users',
      value: 0,
      change: 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
          <title>Users icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: 'Sponsors',
      value: 0,
      change: 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
          <title>Sponsors icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: 'Engagement Rate',
      value: 0,
      change: 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
          <title>Engagement icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ]);

  const [eventTrends, setEventTrends] = useState<ChartData>({
    labels: [],
    values: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch metrics from API
        const metricsResponse = await api.get('/api/v1/admin/metrics');
        const metricsData = metricsResponse.data;

        // Update metrics with real data
        setMetrics(prev => prev.map((metric, index) => ({
          ...metric,
          value: metricsData[index].value,
          change: metricsData[index].change,
        })));

        // Fetch event trends
        const trendsResponse = await api.get('/api/v1/admin/trends');
        const trendsData = trendsResponse.data;
        setEventTrends(trendsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [metricsResponse, trendsResponse] = await Promise.all([
        api.get('/api/v1/admin/metrics'),
        api.get('/api/v1/admin/trends')
      ]);

      setMetrics(prev => prev.map((metric, index) => ({
        ...metric,
        value: metricsResponse.data[index].value,
        change: metricsResponse.data[index].change,
      })));
      setEventTrends(trendsResponse.data);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
            <title>Refresh icon</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${
                    metric.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                  } bg-opacity-10`}>
                    <span className={metric.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {metric.icon}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {metric.label}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {isLoading ? (
                          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                        ) : (
                          metric.value.toLocaleString()
                        )}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change >= 0 ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        )}
                        <span className="sr-only">
                          {metric.change >= 0 ? 'Increased by' : 'Decreased by'}
                        </span>
                        {Math.abs(metric.change)}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Event Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Event Trends</h3>
            <div className="mt-2">
              {isLoading ? (
                <div className="h-64 bg-gray-100 rounded animate-pulse" />
              ) : (
                <div className="h-64">
                  <LineChart
                    data={{
                      labels: eventTrends.labels,
                      values: eventTrends.values
                    }}
                    title="Event Trends"
                    color="#4F46E5"
                    fillColor="rgba(79, 70, 229, 0.1)"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* User Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">User Activity</h3>
            <div className="mt-2">
              {isLoading ? (
                <div className="h-64 bg-gray-100 rounded animate-pulse" />
              ) : (
                <div className="h-64">
                  <LineChart
                    data={{
                      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      values: [65, 78, 90, 85, 93, 98, 110]
                    }}
                    title="User Activity"
                    color="#10B981"
                    fillColor="rgba(16, 185, 129, 0.1)"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
