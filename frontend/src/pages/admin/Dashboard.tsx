import { useState } from 'react';
import type { FC } from 'react';
import EventApproval from './EventApproval';
import UserManagement from '../../components/admin/UserManagement';
import Analytics from '../../components/admin/Analytics';

type AdminSection = 'overview' | 'users' | 'events' | 'analytics';

const AdminDashboard: FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <UserManagement />
          </section>
        );
      case 'events':
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Event Approval</h2>
            <EventApproval />
          </section>
        );
      case 'analytics':
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Analytics Overview</h2>
            <Analytics />
          </section>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
              <Analytics />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Recent Events</h3>
              <EventApproval limit={5} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <nav className="mt-4">
            <ul className="flex space-x-4 border-b border-gray-200">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'users', label: 'Users' },
                { id: 'events', label: 'Events' },
                { id: 'analytics', label: 'Analytics' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActiveSection(item.id as AdminSection)}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeSection === item.id
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <main>{renderSection()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
