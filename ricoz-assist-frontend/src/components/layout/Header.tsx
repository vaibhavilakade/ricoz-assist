import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { Menu } from 'lucide-react';

const Header = () => {
  const { toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 rounded-lg p-2 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          Welcome, {user?.firstName || user?.username}
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
          {user?.firstName?.[0] || user?.username?.[0] || '?'}
        </div>
      </div>
    </header>
  );
};

export default Header;
