import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Droplets,
  Cog,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Monitor,
  Gauge,
  Edit
} from 'lucide-react';

export const navigationItems = [
  {
    path: '/overview-new',
    name: 'Overview',
    icon: Monitor,
    description: 'HMI-01B'
  },
  {
    path: '/pumps',
    name: 'Pump Status',
    icon: Cog,
    description: 'HMI-03'
  },
  {
    path: '/oil-cellar',
    name: 'Oil Cellar Monitor',
    icon: ShieldAlert,
    description: 'HMI-04'
  },
  {
    path: '/manual-data-entry',
    name: 'Manual Data Entry',
    icon: Edit,
    description: 'HMI-05'
  },
  {
    path: '/alarms',
    name: 'Alarm Management',
    icon: AlertTriangle,
    description: 'HMI-06'
  },
  {
    path: '/reports',
    name: 'Reports',
    icon: FileText,
    description: 'HMI-07'
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: Cog,
    description: 'Configuration'
  },
];

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} fixed top-0 left-0 h-screen z-40 bg-primary shadow-elevated flex flex-col overflow-y-auto transition-all duration-300`}>
      <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-primary-hover sticky top-0 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/75`}>
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 flex shrink-0 items-center justify-center overflow-hidden -ml-2">
            <img src="/logo.png" alt="RCTMS Logo" className="w-full h-full object-contain scale-125" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold text-primary-foreground">
                Fluid Monitoring System
              </h1>
              <p className="text-sm text-primary-foreground/70">
                (FMS)
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-4 px-6'} py-4 rounded-lg text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-secondary text-secondary-foreground shadow-glow'
                    : 'text-primary-foreground/80 hover:bg-primary-hover hover:text-primary-foreground'
                }`
              }
              title={isCollapsed ? item.name : ''}
            >
              <Icon className="h-6 w-6 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-primary-hover">
          <div className="text-xs text-primary-foreground/60 text-center">
            Industrial Monitoring v2.1
          </div>
        </div>
      )}
    </div>
  );
};
