import BannerManager from '../../components/banners/BannerManager';

const SponsorDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sponsor Dashboard</h1>
      
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Views</h3>
          <p className="mt-2 text-3xl font-semibold text-primary">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Clicks</h3>
          <p className="mt-2 text-3xl font-semibold text-primary">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Active Banners</h3>
          <p className="mt-2 text-3xl font-semibold text-primary">0</p>
        </div>
      </div>

      {/* Banner Management Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <BannerManager />
      </div>
    </div>
  );
};

export default SponsorDashboard;
