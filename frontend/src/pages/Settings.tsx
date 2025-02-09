import { useState } from 'react';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  fields: {
    id: string;
    label: string;
    type: 'toggle' | 'select' | 'input';
    options?: string[];
    defaultValue?: boolean | string;
  }[];
}

const settingsSections: SettingsSection[] = [
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Manage how you receive notifications about events and updates.',
    fields: [
      {
        id: 'email-notifications',
        label: 'Email notifications',
        type: 'toggle',
        defaultValue: true,
      },
      {
        id: 'push-notifications',
        label: 'Push notifications',
        type: 'toggle',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Set your viewing and interaction preferences.',
    fields: [
      {
        id: 'language',
        label: 'Language',
        type: 'select',
        options: ['English', 'Hindi', 'Gujarati', 'Bengali'],
        defaultValue: 'English',
      },
      {
        id: 'timezone',
        label: 'Timezone',
        type: 'select',
        options: ['UTC', 'IST', 'EST', 'PST'],
        defaultValue: 'UTC',
      },
    ],
  },
];

export default function Settings() {
  const [, setSettings] = useState<Record<string, boolean | string>>({});

  const handleToggle = (sectionId: string, fieldId: string) => {
    const key = `${sectionId}-${fieldId}`;
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelect = (sectionId: string, fieldId: string, value: string) => {
    const key = `${sectionId}-${fieldId}`;
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.id} className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">{section.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="space-y-6">
                    {section.fields.map((field) => (
                      <div key={field.id} className="flex items-start">
                        {field.type === 'toggle' ? (
                          <div className="flex items-center h-5">
                            <input
                              id={`${section.id}-${field.id}`}
                              type="checkbox"
                              defaultChecked={field.defaultValue as boolean}
                              onChange={() => handleToggle(section.id, field.id)}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`${section.id}-${field.id}`}
                              className="ml-3 text-sm text-gray-700"
                            >
                              {field.label}
                            </label>
                          </div>
                        ) : field.type === 'select' ? (
                          <div className="w-full">
                            <label
                              htmlFor={`${section.id}-${field.id}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              {field.label}
                            </label>
                            <select
                              id={`${section.id}-${field.id}`}
                              defaultValue={field.defaultValue as string}
                              onChange={(e) => handleSelect(section.id, field.id, e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
