import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import Avatar from '../common/Avatar';
import {
  Home,
  FileText,
  Database,
  Calendar,
  CheckSquare,
  MessageSquare,
  Users,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/knowledge-bases', label: 'Knowledge Bases', icon: Database },
    { path: '/meetings', label: 'Meetings', icon: Calendar },
    { path: '/action-items', label: 'Action Items', icon: CheckSquare },
    { path: '/queries', label: 'AI Queries', icon: MessageSquare },
    ...(user?.role === 'ADMIN' ? [{ path: '/admin/users', label: 'Users', icon: Users }] : []),
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 cursor-default bg-gray-950/40 backdrop-blur-[2px] lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] shrink-0 -translate-x-full flex-col border-r border-gray-200/80 bg-white/95 backdrop-blur-xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          <div className="flex min-h-[4.5rem] items-center justify-between border-b border-gray-100 px-5">
            <Link to="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/25">
                R
              </span>
              <span className="text-base font-semibold tracking-tight text-gray-950">RicozAssist</span>
            </Link>
            <button
              onClick={toggleSidebar}
              type="button"
              className="rounded-xl p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95 lg:hidden"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Workspace">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Workspace
            </p>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      end={item.path === '/'}
                      className={cn(
                        'group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-primary shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className={cn(
                        'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
                        isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'
                      )} aria-hidden="true" />
                      <span className="relative">
                        {item.label}
                        {isActive && (
                          <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                        )}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-100 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-3 transition-all duration-200 hover:shadow-md">
              <Avatar firstName={user?.firstName || user?.username} lastName={user?.lastName} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{user?.firstName || user?.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              type="button"
              className="group flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 active:scale-[0.98]"
            >
              <LogOut className="h-[18px] w-[18px] transition-colors duration-200 group-hover:text-red-600" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
