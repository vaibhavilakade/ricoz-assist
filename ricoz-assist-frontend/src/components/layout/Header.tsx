import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ProfileDropdown from '../common/ProfileDropdown';
import NotificationDropdown from '../common/NotificationDropdown';

const sectionTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/documents': 'Documents',
  '/knowledge-bases': 'Knowledge bases',
  '/meetings': 'Meetings',
  '/action-items': 'Action items',
  '/queries': 'AI queries',
  '/admin/users': 'User management',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/security': 'Security',
};

const Header = () => {
  const { toggleSidebar, sidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const title = sectionTitles[pathname] || 'Workspace';

  return (
    <header className="sticky top-0 z-30 flex min-h-[5rem] items-center justify-between border-b border-border bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={toggleSidebar}
          type="button"
          className="rounded-xl p-2.5 text-foreground-secondary transition-all duration-200 hover:bg-muted hover:text-foreground active:scale-95 lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={sidebarOpen}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground">{title}</p>
          <p className="hidden truncate text-sm text-foreground-secondary sm:block">
            Welcome back, {user?.firstName || user?.username}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
