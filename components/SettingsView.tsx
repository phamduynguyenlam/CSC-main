import React, { useState } from 'react';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: false,
    },
    thresholds: {
      sentimentAlert: 3.5,
      churnRisk: 75
    },
    integrations: {
      geminiApi: true,
      knotApi: false,
      slackWebhook: false
    }
  });

  const notificationLabels: Record<string, string> = {
    email: 'Thông báo qua Email',
    sms: 'Thông báo qua SMS',
    push: 'Thông báo đẩy'
  };

  const integrationLabels: Record<string, string> = {
    geminiApi: 'Gemini API',
    knotApi: 'Knot API',
    slackWebhook: 'Slack Webhook'
  };

  const handleNotificationChange = (type: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleThresholdChange = (type: keyof typeof settings.thresholds, value: number) => {
    setSettings(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [type]: value
      }
    }));
  };

  const handleIntegrationChange = (type: keyof typeof settings.integrations) => {
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [type]: !prev.integrations[type]
      }
    }));
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thiết lập thông báo
          </h3>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-700 dark:text-gray-300">
                  {notificationLabels[key] ?? key}
                </label>
                <button
                  onClick={() => handleNotificationChange(key as keyof typeof settings.notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-500'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Ngưỡng cảnh báo
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sentiment Score
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={settings.thresholds.sentimentAlert}
                onChange={(e) => handleThresholdChange('sentimentAlert', parseFloat(e.target.value))}
                className="w-full"
                style={{ accentColor: '#262626' }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>0</span>
                <span>Hiện tại: {settings.thresholds.sentimentAlert}</span>
                <span>10</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Churn Risk (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.thresholds.churnRisk}
                onChange={(e) => handleThresholdChange('churnRisk', parseInt(e.target.value))}
                className="w-full"
                style={{ accentColor: '#262626' }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>0%</span>
                <span>Hiện tại: {settings.thresholds.churnRisk}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tích hợp API
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(settings.integrations).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {integrationLabels[key] ?? key}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {value ? 'Đã kết nối' : 'Chưa kết nối'}
                  </p>
                </div>
                <button
                  onClick={() => handleIntegrationChange(key as keyof typeof settings.integrations)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-500'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button className="px-10 py-2 bg-blue-500 font-semibold text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2">
          Lưu cài đặt
        </button>
      </div>
    </div>
  );
};

export default SettingsView;