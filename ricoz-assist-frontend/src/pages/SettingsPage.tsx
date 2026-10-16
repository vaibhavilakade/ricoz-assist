import { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import PageHeader from '../components/common/PageHeader';
import { Bell, User, Shield, Palette } from 'lucide-react';

const NOTIFICATION_STORAGE_KEY = 'ricozAssistNotificationsEnabled';

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // Load notification preference from localStorage
    const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (saved !== null) {
      setNotificationsEnabled(saved === 'true');
    }
  }, []);

  const handleNotificationToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, enabled.toString());
  };

  return (
    <div>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notifications Card */}
        <Card className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                <p className="text-sm text-foreground-muted">Control how you receive notifications</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">Workspace notifications</p>
              <p className="mt-1 text-xs text-foreground-muted">
                Receive notifications about important workspace activity
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationToggle(!notificationsEnabled)}
              className={`
                relative h-6 w-11 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                ${notificationsEnabled ? 'bg-primary' : 'bg-border'}
              `}
              role="switch"
              aria-checked={notificationsEnabled}
              aria-label="Toggle workspace notifications"
            >
              <span
                className={`
                  inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200
                  ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'}
                `}
              />
            </button>
          </div>

          <div className="mt-4 rounded-lg bg-primary-light px-4 py-3">
            <p className="text-xs text-primary">
              {notificationsEnabled 
                ? 'Notifications are enabled. You will receive updates about workspace activity.'
                : 'Notifications are disabled. You will not receive workspace notifications.'
              }
            </p>
          </div>
        </Card>

        {/* Account Card */}
        <Card>
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-light">
                <User className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Account</h3>
                <p className="text-sm text-foreground-muted">Manage your account details</p>
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => window.location.href = '/profile'}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:bg-muted"
              >
                Profile
                <span className="text-foreground-muted">→</span>
              </button>
            </li>
          </ul>
        </Card>

        {/* Security Card */}
        <Card>
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-light">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Security</h3>
                <p className="text-sm text-foreground-muted">Manage your security settings</p>
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => window.location.href = '/security'}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:bg-muted"
              >
                Security settings
                <span className="text-foreground-muted">→</span>
              </button>
            </li>
          </ul>
        </Card>

        {/* Appearance Card */}
        <Card className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender-light">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
                <p className="text-sm text-foreground-muted">Customize your workspace appearance</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted px-4 py-4">
            <p className="text-sm text-foreground-muted">
              More appearance options coming soon
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
