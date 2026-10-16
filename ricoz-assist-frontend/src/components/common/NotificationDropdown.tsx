import { useState, useRef, useEffect } from 'react';
import { Bell, BellOff, Settings, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const NOTIFICATION_STORAGE_KEY = 'ricozAssistNotificationsEnabled';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (saved !== null) {
      setNotificationsEnabled(saved === 'true');
    }
  }, []);

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, newValue.toString());
  };

  const handleClick = () => {
    if (!notificationsEnabled) {
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'rounded-xl p-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          notificationsEnabled
            ? 'text-foreground-secondary hover:bg-muted hover:text-foreground'
            : 'text-foreground-muted hover:bg-muted'
        )}
        aria-label={notificationsEnabled ? 'Open notifications' : 'Notifications disabled'}
        aria-expanded={isOpen}
      >
        {notificationsEnabled ? (
          <Bell className="h-5 w-5" aria-hidden="true" />
        ) : (
          <BellOff className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border-light bg-white shadow-xl shadow-primary/10 sm:w-96"
          role="dialog"
          aria-modal="false"
          aria-labelledby="notifications-title"
        >
          <div className="border-b border-border-light px-4 py-3">
            <h3 id="notifications-title" className="text-sm font-semibold text-foreground">
              Notifications
            </h3>
          </div>

          {!notificationsEnabled ? (
            <div className="px-4 py-8 text-center">
              <BellOff className="mx-auto h-12 w-12 text-foreground-muted" aria-hidden="true" />
              <p className="mt-3 text-sm text-foreground">Notifications are turned off</p>
              <p className="mt-1 text-xs text-foreground-muted">
                Turn on notifications to receive workspace updates
              </p>
              <button
                type="button"
                onClick={handleToggleNotifications}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Enable notifications
              </button>
            </div>
          ) : (
            <>
              <div className="px-4 py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary/40" aria-hidden="true" />
                <p className="mt-3 text-sm text-foreground">You're all caught up</p>
                <p className="mt-1 text-xs text-foreground-muted">
                  No new notifications
                </p>
              </div>

              <div className="border-t border-border-light px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/settings';
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:bg-muted"
                >
                  <span>Notification settings</span>
                  <Settings className="h-4 w-4 text-foreground-muted" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
