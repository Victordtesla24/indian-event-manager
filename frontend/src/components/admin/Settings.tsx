
const Settings = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      <div className="mt-6 space-y-6">
        {/* API Keys Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="ai-api-key" className="block text-sm font-medium text-gray-700">
                AI API Key
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="ai-api-key"
                  id="ai-api-key"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your AI API key"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Management Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Image Management</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="background-images" className="block text-sm font-medium text-gray-700">
                Background Images
              </label>
              <section 
                id="background-images"
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                aria-label="Image upload area"
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only"
                        accept="image/*"
                        aria-label="Upload background image"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* General Settings Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="site-name" className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="site-name"
                  id="site-name"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  defaultValue="Indian Event Manager"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="contact-email"
                  id="contact-email"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
