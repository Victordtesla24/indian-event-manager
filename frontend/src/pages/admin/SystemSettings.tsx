import { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { adminService } from "../../services/adminService";
import {
  Cog6ToothIcon as CogIcon,
  BellIcon,
  LockClosedIcon,
  EnvelopeIcon as MailIcon,
  GlobeAltIcon as GlobeIcon,
  BanknotesIcon,
  ComputerDesktopIcon,
  ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";

interface SystemSettings {
  email: {
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_encryption: string;
  };
  payment: {
    gateway: string;
    test_mode: boolean;
    currency: string;
    auto_capture: boolean;
  };
  database: {
    auto_backup: boolean;
    backup_frequency: string;
    retain_backups: number;
    last_backup: string;
  };
  backups: Array<{
    id: string;
    timestamp: string;
    size: string;
    status: string;
  }>;
}

interface Setting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  category: "notifications" | "security" | "general" | "email" | "payment" | "database";
}

const defaultFeatureSettings: Setting[] = [
  {
    id: "email_notifications",
    name: "Email Notifications",
    description: "Receive email notifications for important updates and events",
    enabled: true,
    icon: BellIcon,
    category: "notifications",
  },
  {
    id: "sms_notifications",
    name: "SMS Notifications",
    description: "Receive SMS alerts for critical system events",
    enabled: false,
    icon: MailIcon,
    category: "notifications",
  },
  {
    id: "two_factor_auth",
    name: "Two-Factor Authentication",
    description: "Require 2FA for admin access",
    enabled: true,
    icon: LockClosedIcon,
    category: "security",
  },
  {
    id: "maintenance_mode",
    name: "Maintenance Mode",
    description: "Put the system in maintenance mode",
    enabled: false,
    icon: CogIcon,
    category: "general",
  },
  {
    id: "public_registration",
    name: "Public Registration",
    description: "Allow public user registration",
    enabled: true,
    icon: GlobeIcon,
    category: "general",
  },
];

const SystemSettings = () => {
  const [featureSettings, setFeatureSettings] = useState<Setting[]>(defaultFeatureSettings);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await adminService.getSystemSettings();
      setSystemSettings(settings);
    } catch (error) {
      showToast("Failed to load settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (settingId: string) => {
    setFeatureSettings((prev) =>
      prev.map((setting) =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleEmailChange = (field: keyof SystemSettings["email"], value: string) => {
    if (!systemSettings) return;
    setSystemSettings({
      ...systemSettings,
      email: {
        ...systemSettings.email,
        [field]: field === "smtp_port" ? parseInt(value) : value,
      },
    });
  };

  const handlePaymentChange = (field: keyof SystemSettings["payment"], value: any) => {
    if (!systemSettings) return;
    setSystemSettings({
      ...systemSettings,
      payment: {
        ...systemSettings.payment,
        [field]: field === "test_mode" || field === "auto_capture" ? value === "true" : value,
      },
    });
  };

  const handleDatabaseChange = (field: keyof SystemSettings["database"], value: any) => {
    if (!systemSettings) return;
    setSystemSettings({
      ...systemSettings,
      database: {
        ...systemSettings.database,
        [field]: field === "auto_backup" ? value === "true" : value,
      },
    });
  };

  const handleTestEmail = async () => {
    if (!systemSettings) return;
    setIsTestingEmail(true);
    try {
      await adminService.testEmailConfig(systemSettings.email);
      showToast("Email configuration test successful", "success");
    } catch (error) {
      showToast("Email configuration test failed", "error");
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleBackupNow = async () => {
    setIsBackingUp(true);
    try {
      const backup = await adminService.backupDatabase();
      showToast(`Backup completed: ${backup.id}`, "success");
      await loadSettings(); // Reload to get updated backup list
    } catch (error) {
      showToast("Backup failed", "error");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    setIsRestoring(true);
    try {
      await adminService.restoreDatabase(backupId);
      showToast("Database restored successfully", "success");
    } catch (error) {
      showToast("Restore failed", "error");
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminService.updateSystemSettings({
        featureSettings,
        ...systemSettings,
      });
      showToast("Settings saved successfully", "success");
    } catch (error) {
      showToast("Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    { id: "general", name: "General" },
    { id: "notifications", name: "Notifications" },
    { id: "security", name: "Security" },
    { id: "email", name: "Email Configuration" },
    { id: "payment", name: "Payment Gateway" },
    { id: "database", name: "Database Management" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            System Settings
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage system-wide settings and configurations
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto ${
              isSaving ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* Feature Settings */}
        {categories.slice(0, 3).map((category) => (
          <div key={category.id} className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              {category.name}
            </h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {featureSettings
                  .filter((setting) => setting.category === category.id)
                  .map((setting) => (
                    <li key={setting.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <setting.icon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {setting.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {setting.description}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggle(setting.id)}
                              className={`${
                                setting.enabled
                                  ? "bg-primary-600"
                                  : "bg-gray-200"
                              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                            >
                              <span
                                aria-hidden="true"
                                className={`${
                                  setting.enabled
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Email Configuration */}
        {systemSettings && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Email Configuration</h2>
            <div className="bg-white shadow sm:rounded-md p-4">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="smtp_host" className="block text-sm font-medium text-gray-700">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    id="smtp_host"
                    value={systemSettings.email.smtp_host}
                    onChange={(e) => handleEmailChange("smtp_host", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="smtp_port" className="block text-sm font-medium text-gray-700">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    id="smtp_port"
                    value={systemSettings.email.smtp_port}
                    onChange={(e) => handleEmailChange("smtp_port", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="smtp_user" className="block text-sm font-medium text-gray-700">
                    SMTP User
                  </label>
                  <input
                    type="email"
                    id="smtp_user"
                    value={systemSettings.email.smtp_user}
                    onChange={(e) => handleEmailChange("smtp_user", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="smtp_encryption" className="block text-sm font-medium text-gray-700">
                    Encryption
                  </label>
                  <select
                    id="smtp_encryption"
                    value={systemSettings.email.smtp_encryption}
                    onChange={(e) => handleEmailChange("smtp_encryption", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="TLS">TLS</option>
                    <option value="SSL">SSL</option>
                    <option value="NONE">None</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={isTestingEmail}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isTestingEmail ? "Testing..." : "Test Configuration"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Gateway */}
        {systemSettings && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Payment Gateway</h2>
            <div className="bg-white shadow sm:rounded-md p-4">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="gateway" className="block text-sm font-medium text-gray-700">
                    Gateway Provider
                  </label>
                  <select
                    id="gateway"
                    value={systemSettings.payment.gateway}
                    onChange={(e) => handlePaymentChange("gateway", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="stripe">Stripe</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="paytm">Paytm</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={systemSettings.payment.currency}
                    onChange={(e) => handlePaymentChange("currency", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Test Mode</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="test_mode"
                        value="true"
                        checked={systemSettings.payment.test_mode}
                        onChange={(e) => handlePaymentChange("test_mode", e.target.value)}
                        className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">Enabled</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name="test_mode"
                        value="false"
                        checked={!systemSettings.payment.test_mode}
                        onChange={(e) => handlePaymentChange("test_mode", e.target.value)}
                        className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">Disabled</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Auto Capture</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="auto_capture"
                        value="true"
                        checked={systemSettings.payment.auto_capture}
                        onChange={(e) => handlePaymentChange("auto_capture", e.target.value)}
                        className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">Enabled</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name="auto_capture"
                        value="false"
                        checked={!systemSettings.payment.auto_capture}
                        onChange={(e) => handlePaymentChange("auto_capture", e.target.value)}
                        className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">Disabled</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Database Management */}
        {systemSettings && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Database Management</h2>
            <div className="bg-white shadow sm:rounded-md p-4">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Auto Backup</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="auto_backup"
                        value="true"
                        checked={systemSettings.database.auto_backup}
                        onChange={(e) => handleDatabaseChange("auto_backup", e.target.value)}
                        className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">Enabled</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name="auto_backup"
                        value="false"
                        checked={!systemSettings.database.auto_backup}
                        onChange={(e) => handleDatabaseChange("auto_backup", e.target.value)}
                        className="form-radio h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2">Disabled</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="backup_frequency" className="block text-sm font-medium text-gray-700">
                    Backup Frequency
                  </label>
                  <select
                    id="backup_frequency"
                    value={systemSettings.database.backup_frequency}
                    onChange={(e) => handleDatabaseChange("backup_frequency", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="retain_backups" className="block text-sm font-medium text-gray-700">
                    Retain Backups (days)
                  </label>
                  <input
                    type="number"
                    id="retain_backups"
                    value={systemSettings.database.retain_backups}
                    onChange={(e) => handleDatabaseChange("retain_backups", e.target.value)}
                    min="1"
                    max="30"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Backup
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(systemSettings.database.last_backup).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleBackupNow}
                  disabled={isBackingUp}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isBackingUp ? "Backing up..." : "Backup Now"}
                </button>
              </div>

              {/* Backup History */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Backup History</h3>
                <div className="mt-2 flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                              Timestamp
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Size
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Status
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {systemSettings.backups.map((backup) => (
                            <tr key={backup.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                                {new Date(backup.timestamp).toLocaleString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {backup.size}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {backup.status}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <button
                                  onClick={() => handleRestore(backup.id)}
                                  disabled={isRestoring}
                                  className="text-primary-600 hover:text-primary-900 disabled:opacity-50"
                                >
                                  {isRestoring ? "Restoring..." : "Restore"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;
