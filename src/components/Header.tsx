import React, { useEffect, useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigationItems } from '@/components/Sidebar';
import { formatDateTime } from '@/lib/utils';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}


export const Header = ({ onToggleSidebar, isSidebarCollapsed }: HeaderProps) => {
  const [now, setNow] = useState<Date>(new Date());
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);

  const pageItem = navigationItems.find((i) => i.path === pathname);
  const pageTitle = pageItem?.name ?? 'System Overview';

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="bg-card shadow-industrial border-b border-border px-6 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleSidebar}
            className="shrink-0 h-8 w-8"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1 relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
              <span className="text-xs font-medium text-success whitespace-nowrap">System Active</span>

              {showTooltip && (
                <div className="absolute left-0 top-full mt-2 z-50 w-max bg-card border border-border/60 text-xs text-muted-foreground px-2 py-1 rounded shadow-sm whitespace-nowrap">
                  {`Stats last updated at ${formatDateTime(now)}`}
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground font-mono hidden sm:block">
              {formatDateTime(now)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8"
          >
            {theme === 'dark' ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/alarms')}
            className="h-8 w-8"
          >
            <Bell className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </header>
  );
};
