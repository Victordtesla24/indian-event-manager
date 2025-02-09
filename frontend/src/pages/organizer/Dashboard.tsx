import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrganizerLayout from '../../components/organizer/OrganizerLayout';
import { useAuth } from '../../contexts/AuthContext';

interface OrganizerStats {
  totalEvents: number;
  activeEvents: number;
  totalBookings: number;
  totalRevenue: number;
  upcomingEvents: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    venue: string;
    soldTickets: number;
    totalTickets: number;
  }>;
  recentBookings: Array<{
    id: number;
    eventTitle: string;
    customerName: string;
    amount: number;
    status: 'completed' | 'pending' | 'cancelled';
    date: string;
  }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchStats = async () => {
      try {
        // Simulated API response
        const mockStats: OrganizerStats = {
          totalEvents: 24,
          activeEvents: 8,
          totalBookings: 456,
          totalRevenue: 567800,
          upcomingEvents: [
            {
              id: 1,
              title: 'Shikayala Gelo Ek!',
              date: '2025-03-15',
              time: '19:00',
              venue: 'Yashwant Natya Mandir',
              soldTickets: 234,
              totalTickets: 500,
            },
            // Add more mock events...
          ],
          recentBookings: [
            {
              id: 1,
              eventTitle: 'Shikayala Gelo Ek!',
              customerName: 'Rahul Deshmukh',
              amount: 999,
              status: 'completed',
              date: '2025-02-09T10:30:00Z',
            },
            // Add more mock bookings...
          ],
        };

        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <OrganizerLayout>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </OrganizerLayout>
    );
  }

  if (!stats) return null;

  return (
    <OrganizerLayout>
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your events and bookings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              +3 new
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Active Events</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Live now
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.activeEvents}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              +28 today
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              +12% ↑
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ₹{(stats.totalRevenue / 100).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/organizer/events/new"
          className="flex items-center justify-between p-6 bg-primary-600 rounded-lg text-white hover:bg-primary-700 transition-colors duration-200"
        >
          <div>
            <h3 className="text-lg font-semibold">Create Event</h3>
            <p className="text-primary-100 text-sm mt-1">Add a new event listing</p>
          </div>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>

        <Link
          to="/organizer/bookings"
          className="flex items-center justify-between p-6 bg-secondary-600 rounded-lg text-white hover:bg-secondary-700 transition-colors duration-200"
        >
          <div>
            <h3 className="text-lg font-semibold">View Bookings</h3>
            <p className="text-secondary-100 text-sm mt-1">Manage ticket bookings</p>
          </div>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </Link>

        <Link
          to="/organizer/analytics"
          className="flex items-center justify-between p-6 bg-gray-900 rounded-lg text-white hover:bg-gray-800 transition-colors duration-200"
        >
          <div>
            <h3 className="text-lg font-semibold">Analytics</h3>
            <p className="text-gray-300 text-sm mt-1">View performance metrics</p>
          </div>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.upcomingEvents.map((event) => (
              <div key={event.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                    <p className="text-sm text-gray-500">{event.venue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {event.soldTickets}/{event.totalTickets}
                    </p>
                    <p className="text-sm text-gray-500">tickets sold</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(event.soldTickets / event.totalTickets) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentBookings.map((booking) => (
              <div key={booking.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.eventTitle}</p>
                    <p className="text-sm text-gray-500">{booking.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{booking.amount}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OrganizerLayout>
  );
};

export default Dashboard;
