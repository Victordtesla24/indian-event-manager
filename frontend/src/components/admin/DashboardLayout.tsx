import { 
  CalendarIcon,
  ChartBarIcon,
  HomeIcon,
  UsersIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Events', href: '/admin/events', icon: CalendarIcon },
  { name: 'Marketing', href: '/admin/marketing', icon: BellIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-900"
                >
                  <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
