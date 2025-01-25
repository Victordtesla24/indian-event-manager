import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import type { ComponentType } from 'react';
import DashboardLayout from '../components/admin/DashboardLayout';

// Lazy load admin components
const Overview = lazy(() => import('../components/admin/Overview'));
const EventManagement = lazy(() => import('../components/admin/EventManagement'));
const UserManagement = lazy(() => import('../components/admin/UserManagement'));
const SponsorManagement = lazy(() => import('../components/admin/SponsorManagement'));
const MarketingCampaigns = lazy(() => import('../components/admin/MarketingCampaigns'));
const Settings = lazy(() => import('../components/admin/Settings'));

// Loading component for suspense fallback
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
  </div>
);

// HOC to wrap lazy components with suspense
const withSuspense = (Component: React.LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Overview),
      },
      {
        path: 'events',
        element: withSuspense(EventManagement),
      },
      {
        path: 'users',
        element: withSuspense(UserManagement),
      },
      {
        path: 'sponsors',
        element: withSuspense(SponsorManagement),
      },
      {
        path: 'marketing',
        element: withSuspense(MarketingCampaigns),
      },
      {
        path: 'settings',
        element: withSuspense(Settings),
      },
      // Catch all route for admin paths
      {
        path: '*',
        element: <Navigate to="/admin" replace />,
      },
    ],
  },
];

export default adminRoutes;
