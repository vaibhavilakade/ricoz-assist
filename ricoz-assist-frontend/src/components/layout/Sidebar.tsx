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
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/knowledge-bases', label: 'Knowledge Bases', icon: Database },
    { path: '/meetings', label: 'Meetings', icon: Calendar },
    { path: '/action-items', label: 'Action Items', icon: CheckSquare },
    { path: '/queries', label: 'AI Queries', icon: MessageSquare },
    ...(user?.role === 'ADMIN' ? [{ path: '/admin/users', label: 'Users', icon: Users }] : []),
  ];

  const accountItems = [
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
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
          className="fixed inset-0 z-40 cursor-default bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] shrink-0 -translate-x-full flex-col border-r border-border bg-white transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          <div className="flex min-h-[5rem] items-center justify-between border-b border-border-light px-6">
            <Link to="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                R
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">RicozAssist</span>
            </Link>
            <button
              onClick={toggleSidebar}
              type="button"
              className="rounded-xl p-2 text-foreground-muted transition-all duration-200 hover:bg-muted hover:text-foreground active:scale-95 lg:hidden"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Workspace">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
              Workspace
            </p>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/dashboard'
                  ? location.pathname === '/dashboard'
                  : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      end={item.path === '/dashboard'}
                      className={cn(
                        'group flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground-secondary hover:bg-muted hover:text-foreground'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className={cn(
                        'h-5 w-5 shrink-0 transition-colors duration-200',
                        isActive ? 'text-primary' : 'text-foreground-muted group-hover:text-foreground'
                      )} aria-hidden="true" />
                      <span className="relative">
                        {item.label}
                        {isActive && (
                          <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-primary rounded-full" />
                        )}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <nav className="px-4 pb-6" aria-label="Account">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
              Account
            </p>
            <ul className="space-y-1">
              {accountItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      className={cn(
                        'group flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground-secondary hover:bg-muted hover:text-foreground'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className={cn(
                        'h-5 w-5 shrink-0 transition-colors duration-200',
                        isActive ? 'text-primary' : 'text-foreground-muted group-hover:text-foreground'
                      )} aria-hidden="true" />
                      <span className="relative">
                        {item.label}
                        {isActive && (
                          <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-primary rounded-full" />
                        )}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-border-light p-4">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-muted p-3 transition-all duration-200 hover:shadow-sm">
              <Avatar firstName={user?.firstName || user?.username} lastName={user?.lastName} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{user?.firstName || user?.username}</p>
                <p className="text-xs text-foreground-muted capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              type="button"
              className="group flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-foreground-secondary transition-all duration-200 hover:bg-error/10 hover:text-error active:scale-[0.98]"
            >
              <LogOut className="h-5 w-5 transition-colors duration-200 group-hover:text-error" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
