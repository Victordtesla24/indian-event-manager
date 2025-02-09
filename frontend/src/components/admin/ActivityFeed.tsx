import { adminService } from "../../services/adminService";

interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

interface ActivityFeedProps {
  logs: ActivityLog[];
}

const ActivityFeed = ({ logs }: ActivityFeedProps) => {
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <p className="mt-1 text-sm text-gray-500">
          Latest actions performed by administrators
        </p>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {logs.map((log) => (
          <li key={log.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-900">
                  {log.adminName}
                </p>
                <p
                  className={`ml-2 text-sm ${adminService.getActionColor(
                    log.action
                  )}`}
                >
                  {adminService.formatAuditAction(log)}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0 flex">
                <p className="text-sm text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {log.details && (
              <div className="mt-2">
                <div className="text-sm text-gray-500">
                  {Object.entries(log.details).map(([key, value]) => (
                    <span key={key} className="mr-4">
                      {key}: {value as string}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {logs.length === 0 && (
        <div className="px-4 py-5 text-center text-sm text-gray-500">
          No recent activity to display
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
