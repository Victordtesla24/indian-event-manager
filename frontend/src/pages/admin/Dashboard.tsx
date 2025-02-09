import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { useToast } from "../../contexts/ToastContext";
import AnalyticsChart from "../../components/admin/AnalyticsChart";
import RevenueChart from "../../components/admin/RevenueChart";
import EventMetricsChart from "../../components/admin/EventMetricsChart";
import ActivityFeed from "../../components/admin/ActivityFeed";
import {
  ArrowTrendingUpIcon as TrendingUpIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [eventMetrics, setEventMetrics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [metricsData, trendsData, revenueData, eventMetrics, logsData] = await Promise.all([
        adminService.getMetrics(),
        adminService.getTrends(),
        adminService.getRevenueData(),
        adminService.getEventMetrics(),
        adminService.getAuditLogs(1, 5),
      ]);

      setMetrics(metricsData);
      setTrends(trendsData);
      setRevenueData(revenueData);
      setEventMetrics(eventMetrics);
      setAuditLogs(logsData.logs);
    } catch (error) {
      showToast("Failed to load dashboard data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      name: "Total Events",
      value: metrics?.events.value || 0,
      change: metrics?.events.change || 0,
      icon: CalendarIcon,
    },
    {
      name: "Total Users",
      value: metrics?.users.value || 0,
      change: metrics?.users.change || 0,
      icon: UsersIcon,
    },
    {
      name: "Active Sponsors",
      value: metrics?.sponsors.value || 0,
      change: metrics?.sponsors.change || 0,
      icon: ChartBarIcon,
    },
    {
      name: "Engagement Rate",
      value: `${metrics?.engagement.value || 0}%`,
      change: metrics?.engagement.change || 0,
      icon: TrendingUpIcon,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className="absolute bg-primary-500 rounded-md p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.value}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.change >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.change >= 0 ? "+" : ""}
                {item.change}%
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          labels={trends?.labels || []}
          values={trends?.values || []}
          title="Weekly Event Registrations"
        />
        <RevenueChart data={revenueData || { labels: [], revenue: [], tickets: [] }} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventMetricsChart data={eventMetrics || []} title="Event Categories" />
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <button
              type="button"
              className="w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Export Analytics Report
            </button>
            <button
              type="button"
              className="w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Schedule Event Report
            </button>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mt-8">
        <ActivityFeed logs={auditLogs} />
      </div>
    </div>
  );
};

export default Dashboard;
