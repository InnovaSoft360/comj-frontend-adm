import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* TopBar - APENAS MOBILE */}
      <div className="lg:hidden">
        <TopBar onToggleSidebar={toggleSidebar} />
      </div>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - APENAS DESKTOP */}
        <div className={`
          hidden lg:flex h-full
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[9%]' : 'w-[18%]'}
        `}>
          <Sidebar 
            isOpen={sidebarOpen}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
            onClose={closeMobileSidebar}
            onToggleSidebar={toggleSidebar}
          />
        </div>
        
        {/* Main Content */}
        <div className={`
          flex-1 flex flex-col min-w-0
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:w-[91%]' : 'lg:w-[82%]'}
          w-full
        `}>
          <main className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6 h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}