import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaHome, FaUsers, FaUserFriends, FaCog, FaSignOutAlt, FaUser, FaChevronDown } from 'react-icons/fa';

interface TopBarProps {
  onToggleSidebar: () => void;
}

const menuItems = [
  { icon: <FaHome className="w-4 h-4" />, label: 'Dashboard', path: '/analytics' },
  { icon: <FaUserFriends className="w-4 h-4" />, label: 'Candidaturas', path: '/candidates' },
  { icon: <FaUsers className="w-4 h-4" />, label: 'Usuários', path: '/users' },
  { icon: <FaCog className="w-4 h-4" />, label: 'Sistema', path: '/system' },
];

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Simulação de usuário
  const user = {
    name: 'Domingos Nascimento',
    role: 'Administrador',
    initials: 'DN'
  };

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    navigate('/login');
    setUserMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Bar - APENAS MOBILE */}
      <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 h-16">
        <div className="px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left: Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <img 
                  src="/logo.png" 
                  alt="Osvaldo MJ" 
                  className="w-4 h-4"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-gray-800 dark:text-white text-sm leading-tight">Osvaldo MJ</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sistema</p>
              </div>
            </div>

            {/* Right: User Menu and Mobile Navigation */}
            <div className="flex items-center space-x-2">
              {/* Mobile Navigation Dropdown */}
              <div className="relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Navegar
                  </span>
                  <FaChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleNavigation(item.path)}
                        className={`
                          flex items-center space-x-3 w-full px-4 py-3 text-sm
                          transition-all duration-200
                          ${isActive(item.path) 
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <div className={`${isActive(item.path) ? 'text-white' : 'text-gray-500'}`}>
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user.initials}
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.role}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link 
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <FaUser className="w-4 h-4 text-gray-400" />
                        <span>Perfil</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-1">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay para fechar menus */}
      {(userMenuOpen || mobileMenuOpen) && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/20"
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
}