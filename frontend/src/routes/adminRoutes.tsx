import { RouteObject } from 'react-router-dom';
import DashboardLayout from '../components/admin/DashboardLayout';
import Dashboard from '../components/admin/Dashboard';
import Analytics from '../components/admin/Analytics';
import EventApproval from '../components/admin/EventApproval';
import MarketingManager from '../components/admin/MarketingManager';
import UserManagement from '../components/admin/UserManagement';

const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    ),
  },
  {
    path: '/admin/analytics',
    element: (
      <DashboardLayout>
        <Analytics />
      </DashboardLayout>
    ),
  },
  {
    path: '/admin/events',
    element: (
      <DashboardLayout>
        <EventApproval
          onApprove={async (eventId) => {
            const response = await fetch(`/api/v1/admin/events/${eventId}/approve`, {
              method: 'POST',
            });
            if (!response.ok) {
              throw new Error('Failed to approve event');
            }
          }}
          onReject={async (eventId) => {
            const response = await fetch(`/api/v1/admin/events/${eventId}/reject`, {
              method: 'POST',
            });
            if (!response.ok) {
              throw new Error('Failed to reject event');
            }
          }}
        />
      </DashboardLayout>
    ),
  },
  {
    path: '/admin/marketing',
    element: (
      <DashboardLayout>
        <MarketingManager />
      </DashboardLayout>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <DashboardLayout>
        <UserManagement />
      </DashboardLayout>
    ),
  },
];

export default adminRoutes;
