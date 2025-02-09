import AdminLayout from '../../components/admin/AdminLayout';

const Marketing = () => {
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Marketing Campaigns</h1>
        
        {/* Campaign management interface */}
        <div className="space-y-6">
          {/* Actions Bar */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search campaigns..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
              Create Campaign
            </button>
          </div>

          {/* Campaign Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Campaign Card */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Summer Festival Promotion</h3>
                  <p className="text-sm text-gray-500">Created on Feb 9, 2025</p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-medium">₹50,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reach</span>
                  <span className="font-medium">25,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Conversions</span>
                  <span className="font-medium">1,234</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Scheduled Campaign Card */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Diwali Special Events</h3>
                  <p className="text-sm text-gray-500">Starts on Mar 15, 2025</p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Scheduled
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-medium">₹75,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Target Reach</span>
                  <span className="font-medium">40,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">30 days</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">10</span> of{' '}
              <span className="font-medium">24</span> campaigns
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Marketing;
