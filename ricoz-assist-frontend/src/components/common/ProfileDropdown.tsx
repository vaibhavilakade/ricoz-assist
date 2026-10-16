import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ChevronDown, User, Settings, Shield, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import Avatar from './Avatar';

const ProfileDropdown = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const menuItems = [
    { icon: User, label: 'Profile', onClick: () => { navigate('/profile'); setIsOpen(false); } },
    { icon: Settings, label: 'Settings', onClick: () => { navigate('/settings'); setIsOpen(false); } },
    { icon: Shield, label: 'Security', onClick: () => { navigate('/security'); setIsOpen(false); } },
    { icon: LogOut, label: 'Log out', onClick: handleLogout, isDestructive: true },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-xl p-1.5 transition-all duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-foreground">{user?.firstName || user?.username}</p>
          <p className="text-xs text-foreground-muted capitalize">{user?.role?.toLowerCase()}</p>
        </div>
        <div className="relative group">
          <Avatar firstName={user?.firstName || user?.username} lastName={user?.lastName} size="sm" />
          <div className="absolute inset-0 rounded-full ring-2 ring-transparent transition-all duration-200 group-hover:ring-primary/20" />
        </div>
        <ChevronDown 
          className={cn(
            'h-4 w-4 text-foreground-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border-light bg-white shadow-xl shadow-primary/10 sm:w-64"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <div className="border-b border-border-light px-4 py-3">
            <p className="text-sm font-semibold text-foreground">{user?.firstName || user?.username}</p>
            <p className="text-xs text-foreground-muted">{user?.email}</p>
          </div>
          
          <ul className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:bg-primary-light',
                      item.isDestructive
                        ? 'text-error hover:bg-error/10'
                        : 'text-foreground hover:bg-muted'
                    )}
                    role="menuitem"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
