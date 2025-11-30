import { Smartphone, XCircle } from 'lucide-react';
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Mail,
  Bell,
  Key,
  Zap,
  Database,
  Server,
  Cloud,
  Code,
  Users,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Package,
  BarChart,
  DownloadCloud
} from 'lucide-react'

const GlobalSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'SL Brothers Ltd',
    siteUrl: 'https://slbrothers.co.uk',
    adminEmail: 'admin@slbrothers.co.uk',
    timezone: 'Europe/London',
    language: 'en-GB',
    currency: 'GBP',
    
    // Security Settings
    twoFactorRequired: true,
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordMinLength: 12,
    passwordRequireSpecial: true,
    ipWhitelist: ['192.168.1.0/24'],
    
    // Email Settings
    emailProvider: 'sendgrid',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpUsername: 'apikey',
    smtpPassword: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢',
    fromEmail: 'noreply@slbrothers.co.uk',
    fromName: 'SL Brothers Ltd',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    slackWebhook: '',
    
    // API Settings
    apiRateLimit: 1000,
    apiTimeout: 30,
    apiKey: 'sk_live_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢',
    webhookSecret: 'whsec_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢',
    
    // Feature Flags
    maintenanceMode: false,
    signupEnabled: true,
    debugMode: false,
    analyticsEnabled: true,
    
    // Performance
    cacheEnabled: true,
    cacheTTL: 3600,
    compressionEnabled: true,
    cdnEnabled: true,
    
    // Backup
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    backupLocation: 'AWS S3'
  })

  const handleSave = () => {
    setSaveStatus('saving')
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    }, 1500)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API & Keys', icon: Key },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'performance', label: 'Performance', icon: Server },
    { id: 'backup', label: 'Backup', icon: Database }
  ]

  // Helper function to handle setting changes
  const handleChange = (key: string, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }))
  }

  // Common input component for cleaner rendering - FIXED with optional min/max
  const SettingsInput = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    options = [], 
    min, 
    max 
  }: {
    label: string;
    type?: string;
    value: any;
    onChange: (val: any) => void;
    options?: { value: string; label: string }[];
    min?: number;
    max?: number;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value)}
          min={min}
          max={max}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
        />
      )}
    </div>
  )

  // Toggle switch component - FIXED with proper typing
  const ToggleSetting = ({ 
    label, 
    description, 
    checked, 
    onChange, 
    Icon, 
    color = 'blue' 
  }: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (val: boolean) => void;
    Icon?: any;
    color?: string;
  }) => (
    <div className={`p-4 bg-${color}-50 border-2 border-${color}-200 rounded-xl`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className={`text-${color}-600`} size={24} />}
          <div>
            <p className="font-bold text-gray-900">{label}</p>
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 flex items-center">
              <Settings className="mr-3 text-blue-600" size={36} />
              Global Settings
            </h1>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 border-2 border-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              <RefreshCw size={20} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Save size={20} />
              <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center space-x-3"
          >
            <CheckCircle className="text-green-600" size={24} />
            <p className="text-green-800 font-semibold">Settings saved successfully!</p>
          </motion.div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
      >
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings ðŸŒ</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <SettingsInput label="Site Name" value={settings.siteName} onChange={(val) => handleChange('siteName', val)} />
              <SettingsInput label="Site URL" type="url" value={settings.siteUrl} onChange={(val) => handleChange('siteUrl', val)} />
              <SettingsInput label="Admin Email" type="email" value={settings.adminEmail} onChange={(val) => handleChange('adminEmail', val)} />
              <SettingsInput
                label="Timezone"
                type="select"
                value={settings.timezone}
                onChange={(val) => handleChange('timezone', val)}
                options={[
                  { value: 'Europe/London', label: 'London (GMT)' },
                  { value: 'America/New_York', label: 'New York (EST)' },
                  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
                ]}
              />
              <SettingsInput
                label="Language"
                type="select"
                value={settings.language}
                onChange={(val) => handleChange('language', val)}
                options={[
                  { value: 'en-GB', label: 'English (UK)' },
                  { value: 'en-US', label: 'English (US)' },
                  { value: 'fr-FR', label: 'French' }
                ]}
              />
              <SettingsInput
                label="Currency"
                type="select"
                value={settings.currency}
                onChange={(val) => handleChange('currency', val)}
                options={[
                  { value: 'GBP', label: 'GBP (Â£)' },
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (â‚¬)' }
                ]}
              />
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings ðŸ”’</h2>
            
            <div className="space-y-6">
              <ToggleSetting
                label="Two-Factor Authentication"
                description="Require 2FA for all users"
                checked={settings.twoFactorRequired}
                onChange={(val) => handleChange('twoFactorRequired', val)}
                Icon={Shield}
                color="blue"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <SettingsInput label="Session Timeout (seconds)" type="number" value={settings.sessionTimeout} onChange={(val) => handleChange('sessionTimeout', val)} min={60} max={86400} />
                <SettingsInput label="Max Login Attempts" type="number" value={settings.maxLoginAttempts} onChange={(val) => handleChange('maxLoginAttempts', val)} min={1} max={10} />
                <SettingsInput label="Password Min Length" type="number" value={settings.passwordMinLength} onChange={(val) => handleChange('passwordMinLength', val)} min={8} max={32} />
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireSpecial}
                    onChange={(e) => handleChange('passwordRequireSpecial', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="font-semibold text-gray-900">
                    Require Special Characters
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Configuration ðŸ“§</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <SettingsInput
                label="Email Provider"
                type="select"
                value={settings.emailProvider}
                onChange={(val) => handleChange('emailProvider', val)}
                options={[
                  { value: 'sendgrid', label: 'SendGrid' },
                  { value: 'mailgun', label: 'Mailgun' },
                  { value: 'ses', label: 'Amazon SES' },
                  { value: 'smtp', label: 'Custom SMTP' }
                ]}
              />
              <SettingsInput label="SMTP Host" value={settings.smtpHost} onChange={(val) => handleChange('smtpHost', val)} />
              <SettingsInput label="SMTP Port" type="number" value={settings.smtpPort} onChange={(val) => handleChange('smtpPort', val)} min={1} max={65535} />
              <SettingsInput label="SMTP Username" value={settings.smtpUsername} onChange={(val) => handleChange('smtpUsername', val)} />
              <SettingsInput label="From Email" type="email" value={settings.fromEmail} onChange={(val) => handleChange('fromEmail', val)} />
              <SettingsInput label="From Name" value={settings.fromName} onChange={(val) => handleChange('fromName', val)} />
            </div>

            <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all">
              <Mail size={20} />
              <span>Send Test Email</span>
            </button>
          </div>
        )}
        
        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings ðŸ””</h2>
            
            <div className="space-y-4">
              <ToggleSetting
                label="Email Notifications"
                description="Receive notifications via email"
                checked={settings.emailNotifications}
                onChange={(val) => handleChange('emailNotifications', val)}
                Icon={Mail}
              />
              <ToggleSetting
                label="Push Notifications"
                description="Receive browser push notifications"
                checked={settings.pushNotifications}
                onChange={(val) => handleChange('pushNotifications', val)}
                Icon={Smartphone}
              />
              <ToggleSetting
                label="SMS Notifications"
                description="Receive notifications via SMS"
                checked={settings.smsNotifications}
                onChange={(val) => handleChange('smsNotifications', val)}
                Icon={Bell}
              />
            </div>
            <SettingsInput label="Slack Webhook URL" value={settings.slackWebhook} onChange={(val) => handleChange('slackWebhook', val)} />
          </div>
        )}

        {/* API Settings */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">API & Keys ðŸ”‘</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.apiKey}
                    readOnly
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-gray-50"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <SettingsInput label="Webhook Secret" value={settings.webhookSecret} onChange={(val) => handleChange('webhookSecret', val)} />
              
              <div className="grid md:grid-cols-2 gap-6">
                <SettingsInput label="Rate Limit (requests/hour)" type="number" value={settings.apiRateLimit} onChange={(val) => handleChange('apiRateLimit', val)} min={100} max={10000} />
                <SettingsInput label="Timeout (seconds)" type="number" value={settings.apiTimeout} onChange={(val) => handleChange('apiTimeout', val)} min={5} max={300} />
              </div>

              <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all">
                <RefreshCw size={20} />
                <span>Regenerate API Key</span>
              </button>
            </div>
          </div>
        )}

        {/* Feature Flags */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Flags âš¡</h2>
            
            <div className="space-y-4">
              {[
                { key: 'maintenanceMode', label: 'Maintenance Mode', description: 'Enable to show maintenance page', icon: AlertCircle, color: 'red' },
                { key: 'signupEnabled', label: 'User Signups', description: 'Allow new user registrations', icon: Users, color: 'green' },
                { key: 'debugMode', label: 'Debug Mode', description: 'Show detailed error messages', icon: Code, color: 'orange' },
                { key: 'analyticsEnabled', label: 'Analytics', description: 'Track user behavior and metrics', icon: BarChart, color: 'blue' }
              ].map((feature) => (
                <ToggleSetting
                  key={feature.key}
                  label={feature.label}
                  description={feature.description}
                  checked={settings[feature.key as keyof typeof settings] as boolean}
                  onChange={(val) => handleChange(feature.key, val)}
                  Icon={feature.icon}
                  color={feature.color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Performance Settings */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Optimization âš™ï¸</h2>
            
            <div className="space-y-4">
              {[
                { key: 'cacheEnabled', label: 'Enable Caching', icon: Database, description: 'Store computed data for faster access' },
                { key: 'compressionEnabled', label: 'Enable Compression (Gzip/Brotli)', icon: Package, description: 'Compress responses to reduce size and load time' },
                { key: 'cdnEnabled', label: 'Enable CDN (Content Delivery Network)', icon: Cloud, description: 'Serve static assets from a global network' }
              ].map((item) => (
                <ToggleSetting
                  key={item.key}
                  label={item.label}
                  description={item.description}
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={(val) => handleChange(item.key, val)}
                  Icon={item.icon}
                  color="blue"
                />
              ))}

              <div className="grid md:grid-cols-2 gap-6 pt-2">
                <SettingsInput label="Cache TTL (seconds)" type="number" value={settings.cacheTTL} onChange={(val) => handleChange('cacheTTL', val)} min={60} max={86400} />
              </div>
            </div>
          </div>
        )}

        {/* Backup Settings */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Backup Configuration ðŸ’¾</h2>
            
            <ToggleSetting
              label="Auto Backup"
              description="Automatically backup your data"
              checked={settings.autoBackupEnabled}
              onChange={(val) => handleChange('autoBackupEnabled', val)}
              Icon={Database}
              color="green"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <SettingsInput
                label="Backup Frequency"
                type="select"
                value={settings.backupFrequency}
                onChange={(val) => handleChange('backupFrequency', val)}
                options={[
                  { value: 'hourly', label: 'Hourly' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' }
                ]}
              />

              <SettingsInput label="Retention (days)" type="number" value={settings.backupRetention} onChange={(val) => handleChange('backupRetention', val)} min={1} max={365} />

              <SettingsInput
                label="Backup Location"
                type="select"
                value={settings.backupLocation}
                onChange={(val) => handleChange('backupLocation', val)}
                options={[
                  { value: 'AWS S3', label: 'AWS S3' },
                  { value: 'Google Cloud Storage', label: 'Google Cloud Storage' },
                  { value: 'Local Server', label: 'Local Server' }
                ]}
              />
            </div>
            
            <button className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all">
              <DownloadCloud size={20} />
              <span>Run Manual Backup</span>
            </button>
          </div>
        )}

      </motion.div>
    </div>
  )
}

export default GlobalSettings