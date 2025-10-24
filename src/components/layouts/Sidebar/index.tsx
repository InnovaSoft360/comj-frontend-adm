import { FaHome, FaUsers, FaUserFriends, FaCog, FaSignOutAlt, FaUser, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, getUserInitials } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  onToggleSidebar: () => void;
}

const menuItems = [
  { icon: <FaHome className="w-5 h-5" />, label: 'Dashboard', path: '/analytics' },
  { icon: <FaUserFriends className="w-5 h-5" />, label: 'Candidaturas', path: '/candidates' },
  { icon: <FaUsers className="w-5 h-5" />, label: 'Usuários', path: '/users' },
  { icon: <FaCog className="w-5 h-5" />, label: 'Sistema', path: '/system' },
];

export default function Sidebar({ isOpen, isCollapsed, onToggleCollapse, onClose, onToggleSidebar }: SidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Sidebar Container */}
      <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                  <img 
                    src="/logo.png" 
                    alt="Osvaldo MJ" 
                    className="w-6 h-6"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-bold text-gray-800 dark:text-white text-sm leading-tight">Osvaldo MJ</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sistema de Candidatura</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                  <img 
                    src="/logo.png" 
                    alt="Osvaldo MJ" 
                    className="w-6 h-6"
                  />
                </div>
              </div>
            )}

            {/* Close Button - Mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="w-4 h-4 text-gray-500" />
            </button>

            {/* Collapse Toggle - Desktop */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isCollapsed ? 
                <FaChevronRight className="w-3 h-3 text-gray-500" /> : 
                <FaChevronLeft className="w-3 h-3 text-gray-500" />
              }
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col justify-center px-3 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={index}
                to={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center rounded-xl p-3 w-full
                  transition-all duration-300 ease-out
                  group relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25 scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 hover:scale-105'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                  active:scale-95
                `}
              >
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}

                <div className={`flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                  isActive ? 'text-white scale-110' : 'text-current'
                }`}>
                  {item.icon}
                </div>
                
                {!isCollapsed && (
                  <span className="ml-3 font-medium text-sm truncate transition-all duration-300">
                    {item.label}
                  </span>
                )}

                {isActive && !isCollapsed && (
                  <div className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                )}

                {isActive && isCollapsed && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-lg shadow-sm"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`
                flex items-center w-full p-2 rounded-xl
                transition-all duration-300
                group
                ${userMenuOpen ? 'bg-gray-100 dark:bg-gray-700 scale-105' : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-110 transition-transform duration-300">
                {user ? getUserInitials(user) : 'US'}
              </div>
              
              {/* User Info */}
              {!isCollapsed && user && (
                <div className="ml-3 flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {user.firstName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Administrador
                  </p>
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className={`
                absolute bottom-full mb-2 
                bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 
                py-2 z-40 min-w-[140px] backdrop-blur-sm
                ${isCollapsed ? 'left-1 right-1' : 'left-2 right-2'}
              `}>
                <Link 
                  to="/profile"
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLinkClick();
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
                >
                  <FaUser className="w-3 h-3 text-gray-400" />
                  <span>Perfil</span>
                </Link>
                
                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-105"
                >
                  <FaSignOutAlt className="w-3 h-3" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          onClick={onToggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
        >
          <div className="w-5 h-5 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-200 group-hover:bg-orange-500"></div>
            <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-200 group-hover:bg-orange-500"></div>
            <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-200 group-hover:bg-orange-500"></div>
          </div>
        </button>
      )}

      {/* Overlay para fechar menus */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-30 lg:z-10"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}