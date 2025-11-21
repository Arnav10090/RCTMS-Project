import React, { useEffect, useState } from 'react';
import { useAlarmContext } from './AlarmContext';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { cn, formatDateTime } from '@/lib/utils';

const SAMPLE_MESSAGES = [
  'Hydraulic pressure spike detected',
  'Coolant temperature above threshold',
  'Pump #2 vibration anomaly',
  'Low oil level in reservoir',
  'Unauthorized panel access attempt',
  'Overcurrent detected on motor M3',
];

const LEVELS = ['low', 'medium', 'high', 'critical'] as const;
const LEVEL_STYLES: Record<typeof LEVELS[number], string> = {
  critical: 'border border-danger bg-danger/10 text-danger',
  high: 'border border-warning bg-warning/10 text-warning',
  medium: 'border border-primary bg-primary/10 text-primary',
  low: 'border border-border bg-muted text-muted-foreground',
};

const ALARM_INTERVAL_MS = 60_000;

function randomItem<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

type ActiveAlarm = {
  id: string;
  level: typeof LEVELS[number];
  message: string;
  time: string;
};

const createAlarm = (): ActiveAlarm => ({
  id: Math.random().toString(36).slice(2),
  level: randomItem(LEVELS),
  message: randomItem(SAMPLE_MESSAGES),
  time: formatDateTime(new Date()),
});

export const AlarmNotifier: React.FC = () => {
  const { addAcknowledged } = useAlarmContext();
  const [alarm, setAlarm] = useState<ActiveAlarm | null>(null);

  useEffect(() => {
    const showModal = () => {
      setAlarm((prev) => prev ?? createAlarm());
    };

    showModal();
    const id = window.setInterval(showModal, ALARM_INTERVAL_MS);

    return () => {
      window.clearInterval(id);
    };
  }, []);

  const open = Boolean(alarm);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setAlarm((current) => current);
        }
      }}
    >
      <AlertDialogContent className="sm:rounded-xl">
        <AlertDialogHeader className="space-y-4">
          <div className="flex justify-center">
            <span
              className={cn(
                'rounded-full px-4 py-1 text-sm font-semibold uppercase',
                alarm ? LEVEL_STYLES[alarm.level] : 'border border-border'
              )}
            >
              {alarm ? alarm.level.toUpperCase() : ''}
            </span>
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            {alarm?.message}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-center">
            <span className="block text-sm text-muted-foreground">{alarm?.time}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="w-full"
            onClick={() => {
              if (alarm) {
                addAcknowledged(alarm);
                setAlarm(null);
              }
            }}
          >
            Acknowledge
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
