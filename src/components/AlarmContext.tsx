import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';

export type AckAlarm = {
  id: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  time: string; // ISO or display
  device?: string;
};

type OverflowListener = (a: AckAlarm) => void;
let overflowListeners: OverflowListener[] = [];
export const subscribeAlarmOverflow = (cb: OverflowListener) => {
  overflowListeners.push(cb);
  return () => {
    overflowListeners = overflowListeners.filter((x) => x !== cb);
  };
};

interface AlarmContextValue {
  acknowledged: AckAlarm[];
  addAcknowledged: (a: AckAlarm) => void;
  removeAcknowledged: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const AlarmContext = createContext<AlarmContextValue | undefined>(undefined);

export const useAlarmContext = () => {
  const ctx = useContext(AlarmContext);
  if (!ctx) throw new Error('useAlarmContext must be used within AlarmProvider');
  return ctx;
};

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [acknowledged, setAcknowledged] = useState<AckAlarm[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('alarmFooterCollapsed');
      return v === '1';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('alarmFooterCollapsed', collapsed ? '1' : '0');
    } catch {}
  }, [collapsed]);

  const addAcknowledged = useCallback((a: AckAlarm) => {
    setAcknowledged((prev) => {
      const next = [a, ...prev];
      if (next.length > 10) {
        const overflow = next[next.length - 1];
        const trimmed = next.slice(0, 10);
        setTimeout(() => overflowListeners.forEach((l) => l(overflow)), 0);
        return trimmed;
      }
      return next;
    });
  }, []);

  const removeAcknowledged = useCallback((id: string) => {
    setAcknowledged((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const value = useMemo<AlarmContextValue>(() => ({
    acknowledged,
    addAcknowledged,
    removeAcknowledged,
    collapsed,
    setCollapsed,
  }), [acknowledged, addAcknowledged, removeAcknowledged, collapsed, setCollapsed]);

  return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
};
