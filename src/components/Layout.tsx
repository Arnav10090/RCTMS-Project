import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { KpiStrip } from './KpiStrip';
import { KpiStripOilCellar } from './KpiStripOilCellar';

export const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={`${isSidebarCollapsed ? 'ml-16 sidebar-collapsed' : 'ml-64'} flex min-h-screen flex-col`}>
        <Header
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        {location.pathname === '/oil-cellar' ? (
          <KpiStripOilCellar />
        ) : location.pathname !== '/' && location.pathname !== '/overview-new' ? (
          <KpiStrip />
        ) : null}
        <main className="flex-1 p-6 pb-14 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
