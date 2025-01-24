import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminPermission } from '../../types/admin';
import UserManagement from './UserManagement';
import EventApproval from '../admin/EventApproval';
import Analytics from './Analytics';
import MarketingManager from './MarketingManager';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  pendingEvents: number;
  activeSponsors: number;
  usersByRole: {
    user: number;
    admin: number;
    sponsor: number;
  };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v1/admin/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  const hasPermission = (permission: AdminPermission) => {
    return user?.permissions?.includes(permission) || user?.is_super_admin;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Users</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Users</dt>
              <dd className="mt-1 text-3xl font-semibold text-primary">
                {stats?.totalUsers || 0}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Active Users</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                {stats?.activeUsers || 0}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Events</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Events</dt>
              <dd className="mt-1 text-3xl font-semibold text-primary">
                {stats?.totalEvents || 0}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Pending Events</dt>
              <dd className="mt-1 text-3xl font-semibold text-yellow-600">
                {stats?.pendingEvents || 0}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Sponsors</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5">
            <div>
              <dt className="text-sm font-medium text-gray-500">Active Sponsors</dt>
              <dd className="mt-1 text-3xl font-semibold text-primary">
                {stats?.activeSponsors || 0}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* User Management Section */}
      {hasPermission(AdminPermission.MANAGE_USERS) && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">User Management</h3>
            <UserManagement />
          </div>
        </div>
      )}

      {/* Event Approval Section */}
      {hasPermission(AdminPermission.MANAGE_EVENTS) && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Event Approval</h3>
            <EventApproval />
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {hasPermission(AdminPermission.VIEW_ANALYTICS) && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
            <Analytics />
          </div>
        </div>
      )}

      {/* Marketing Section */}
      {hasPermission(AdminPermission.MANAGE_MARKETING) && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Marketing</h3>
            <MarketingManager />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
