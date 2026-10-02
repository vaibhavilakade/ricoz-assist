import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Avatar from '../common/Avatar';

const sectionTitles: Record<string, string> = {
  '/': 'Overview',
  '/documents': 'Documents',
  '/knowledge-bases': 'Knowledge bases',
  '/meetings': 'Meetings',
  '/action-items': 'Action items',
  '/queries': 'AI queries',
  '/admin/users': 'User management',
};

const Header = () => {
  const { toggleSidebar, sidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const title = sectionTitles[pathname] || 'Workspace';

  return (
    <header className="sticky top-0 z-30 flex min-h-[4.5rem] items-center justify-between border-b border-gray-200/80 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={toggleSidebar}
          type="button"
          className="rounded-xl p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95 lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={sidebarOpen}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{title}</p>
          <p className="hidden truncate text-xs text-gray-500 sm:block">
            Welcome back, {user?.firstName || user?.username}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-gray-800">{user?.firstName || user?.username}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
        </div>
        <div className="relative group">
          <Avatar firstName={user?.firstName || user?.username} lastName={user?.lastName} />
          <div className="absolute inset-0 rounded-full ring-2 ring-transparent transition-all duration-200 group-hover:ring-primary/20" />
        </div>
      </div>
    </header>
  );
};

export default Header;
