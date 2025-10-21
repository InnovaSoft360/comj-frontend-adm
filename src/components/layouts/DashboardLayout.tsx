import { useState } from 'react';
import Sidebar from './Sidebar';

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

  // ✅ Função separada só para fechar no mobile
  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) { // Só fecha no mobile
      setSidebarOpen(false);
    }
    // No desktop, não faz nada - mantém o estado
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - 18% normal, 9% collapsed */}
      <div className={`
        fixed lg:relative z-30 h-full
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarCollapsed ? 'lg:w-[9%]' : 'lg:w-[18%]'}
        lg:translate-x-0
        ${sidebarOpen ? 'w-3/4 sm:w-2/5 md:w-1/3' : 'w-0'}
      `}>
        <Sidebar 
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
          onClose={closeMobileSidebar} // ✅ Só fecha no mobile
          onToggleSidebar={toggleSidebar}
        />
      </div>
      
      {/* Main Content - 82% normal, 90% collapsed */}
      <div className={`
        flex-1 flex flex-col min-w-0
        transition-all duration-300
        ${sidebarCollapsed ? 'lg:w-[90%]' : 'lg:w-[82%]'}
        w-full
      `}>
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={closeMobileSidebar} // ✅ Só fecha no mobile
        />
      )}
    </div>
  );
}