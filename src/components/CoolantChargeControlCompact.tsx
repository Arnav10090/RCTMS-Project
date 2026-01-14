import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Droplet, Play, RotateCcw, Square } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CoolantChargeControlCompactProps {
  defaultSettings?: {
    desiredConcentration: number;
    currentConcentration: number;
    currentVolume: number;
    targetVolume: number;
  };
}

type ChargeState = 'idle' | 'charging' | 'stopped' | 'complete';

const statusConfig: Record<ChargeState, { label: string; description: string; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  idle: {
    label: 'Idle',
    description: 'Awaiting confirmation',
    badgeVariant: 'outline'
  },
  charging: {
    label: 'Charging',
    description: 'Active',
    badgeVariant: 'default'
  },
  stopped: {
    label: 'Paused',
    description: 'Paused',
    badgeVariant: 'destructive'
  },
  complete: {
    label: 'Complete',
    description: 'Done',
    badgeVariant: 'secondary'
  }
};

const clampNumber = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
};

export const CoolantChargeControlCompact: React.FC<CoolantChargeControlCompactProps> = ({
  defaultSettings
}) => {
  const initialSettings = useMemo(
    () => ({
      desiredConcentration: defaultSettings?.desiredConcentration ?? 6.5,
      currentConcentration: defaultSettings?.currentConcentration ?? 5.2,
      currentVolume: defaultSettings?.currentVolume ?? 82,
      targetVolume: defaultSettings?.targetVolume ?? 120
    }),
    [defaultSettings]
  );

  const [desiredConcentration, setDesiredConcentration] = useState(initialSettings.desiredConcentration);
  const [currentConcentration, setCurrentConcentration] = useState(initialSettings.currentConcentration);
  const [currentVolume, setCurrentVolume] = useState(initialSettings.currentVolume);
  const [targetVolume, setTargetVolume] = useState(initialSettings.targetVolume);
  const [chargeState, setChargeState] = useState<ChargeState>('idle');
  const [chargeProgress, setChargeProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<'start' | 'stop' | null>(null);
  const [addedOilVolume, setAddedOilVolume] = useState(0);
  const [addedWaterVolume, setAddedWaterVolume] = useState(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStartClick = () => {
    setConfirmationAction('start');
    setShowConfirmation(true);
  };

  const confirmStartCharging = () => {
    setShowConfirmation(false);
    if (timerRef.current) {
      return;
    }

    if (chargeProgress >= 100) {
      setChargeProgress(0);
      setAddedOilVolume(0);
      setAddedWaterVolume(0);
    }

    setChargeState('charging');
    timerRef.current = setInterval(() => {
      setChargeProgress((previous) => {
        const next = Math.min(previous + 5, 100);

        // Calculate added volumes proportionally
        setAddedOilVolume(Math.min((next / 100) * oilToAdd, oilToAdd));
        setAddedWaterVolume(Math.min((next / 100) * waterToAdd, waterToAdd));

        if (next === 100) {
          clearTimer();
          setChargeState('complete');
          setAddedOilVolume(oilToAdd);
          setAddedWaterVolume(waterToAdd);
        }
        return next;
      });
    }, 1200);
  };

  const handleStopClick = () => {
    setConfirmationAction('stop');
    setShowConfirmation(true);
  };

  const confirmStopCharging = () => {
    setShowConfirmation(false);
    clearTimer();
    setChargeState('stopped');
  };

  const resetCharging = () => {
    clearTimer();
    setChargeProgress(0);
    setChargeState('idle');
    setAddedOilVolume(0);
    setAddedWaterVolume(0);
    // Reset desired concentration and target volume to 0 after charging is complete
    if (chargeProgress >= 100) {
      setDesiredConcentration(0);
      setTargetVolume(0);
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  const oilToAdd = useMemo(() => {
    const desiredOil = targetVolume * (desiredConcentration / 100);
    const currentOil = currentVolume * (currentConcentration / 100);
    return Math.max(desiredOil - currentOil, 0);
  }, [desiredConcentration, currentConcentration, currentVolume, targetVolume]);

  const waterToAdd = useMemo(() => {
    const projected = targetVolume - (oilToAdd + currentVolume);
    return Math.max(projected, 0);
  }, [currentVolume, oilToAdd, targetVolume]);

  const concentrationDelta = desiredConcentration - currentConcentration;

  const handleDesiredChange = (value: number) => {
    setDesiredConcentration(clampNumber(value, 0, 25));
  };

  const handleCurrentChange = (value: number) => {
    setCurrentConcentration(clampNumber(value, 0, 25));
  };

  const handleCurrentVolumeChange = (value: number) => {
    setCurrentVolume(clampNumber(value, 0, 500));
  };

  const handleTargetVolumeChange = (value: number) => {
    setTargetVolume(clampNumber(value, 0, 500));
  };

  const status = statusConfig[chargeState];

  // Calculate stroke dashoffset for circular progress
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (chargeProgress / 100) * circumference;

  return (
    <div className="grid grid-cols-[240px_1fr] gap-2">
      {/* Left column: Control Table */}
      <div className="space-y-1.5 max-w-[240px] pb-0">
        <div className="rounded-lg border border-border/80 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-1 px-1 text-[10px] font-medium w-24">
                  <Badge variant={status.badgeVariant} className="text-[10px] py-0 px-1.5">{status.label}</Badge>
                </th>
                <th className="text-center py-1 px-1 text-[10px] font-medium text-muted-foreground">
                  {status.description}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border/80">
                <td className="py-0.5 px-1">
                  <Button
                    size="sm"
                    className="bg-success text-success-foreground hover:bg-success/90 h-6 text-[11px] px-1.5 w-full"
                    onClick={handleStartClick}
                    disabled={chargeState === 'charging' || chargeState === 'complete'}
                  >
                    <Play className="h-3 w-3 mr-0.5" />
                    Start
                  </Button>
                </td>
                <td className="py-0.5 px-1" rowSpan={5}>
                  <div className="flex justify-center items-center h-full">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          className="text-gray-700"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="48"
                          cy="48"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          className="text-blue-500 transition-all duration-300"
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percentage text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{chargeProgress}%</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border-t border-border/80">
                <td className="py-0.5 px-1">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleStopClick}
                    disabled={chargeState !== 'charging'}
                    className="h-6 text-[11px] px-1.5 w-full"
                  >
                    <Square className="h-3 w-3 mr-0.5" />
                    Stop
                  </Button>
                </td>
              </tr>
              <tr className="border-t border-border/80">
                <td className="py-0.5 px-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetCharging}
                    disabled={chargeState === 'idle' && chargeProgress === 0}
                    className="h-6 text-[11px] px-1.5 w-full"
                  >
                    <RotateCcw className="h-3 w-3 mr-0.5" />
                    Reset
                  </Button>
                </td>
              </tr>
              <tr className="border-t border-border/80">
                <td className="py-0.5 px-1">
                  <div className="text-[9px] text-muted-foreground font-semibold mb-0.5">To be added volume:</div>
                  <div className="flex justify-between items-center gap-0.5 mb-0.5">
                    <span className="text-muted-foreground text-[10px]">Oil</span>
                    <span className="font-mono font-bold text-black dark:text-success-foreground text-[10px]">
                      {oilToAdd.toFixed(2)} m³
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-0.5">
                    <span className="text-muted-foreground text-[10px]">Water</span>
                    <span className="font-mono font-bold text-primary text-[10px]">
                      {waterToAdd.toFixed(2)} m³
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Right column: Concentration and Volume data */}
      <div className="grid grid-cols-2 gap-2 max-w-[260px] pb-0">
        <div className="rounded-lg border border-border/80 p-1.5">
          <div className="flex items-center justify-between gap-1 mb-1">
            <Label htmlFor="desired-conc-compact" className="text-[10px] text-muted-foreground">
              Desired Conc.
            </Label>
            <Badge variant="secondary" className="text-[10px] py-0 px-1">{desiredConcentration.toFixed(2)}%</Badge>
          </div>
          <Slider
            className="mb-1"
            value={[desiredConcentration]}
            min={0}
            max={25}
            step={0.1}
            onValueChange={(values) => handleDesiredChange(values[0] ?? desiredConcentration)}
          />
          <Input
            id="desired-conc-compact"
            className="h-6 text-xs"
            type="number"
            inputMode="decimal"
            min={0}
            max={25}
            step={0.1}
            value={desiredConcentration}
            onChange={(event) => handleDesiredChange(Number(event.target.value))}
          />
        </div>

        <div className="rounded-lg border border-border/80 p-1.5">
          <div className="flex items-center justify-between gap-1 mb-1">
            <Label htmlFor="current-conc-compact" className="text-[10px] text-muted-foreground">
              Current Conc.
            </Label>
            <Badge variant={concentrationDelta >= 0 ? 'outline' : 'destructive'} className="text-[10px] py-0 px-1">
              {currentConcentration.toFixed(2)}%
            </Badge>
          </div>
          <Slider
            className="mb-1"
            value={[currentConcentration]}
            min={0}
            max={25}
            step={0.1}
            onValueChange={(values) => handleCurrentChange(values[0] ?? currentConcentration)}
          />
          <Input
            id="current-conc-compact"
            className="h-6 text-xs"
            type="number"
            inputMode="decimal"
            min={0}
            max={25}
            step={0.1}
            value={currentConcentration}
            onChange={(event) => handleCurrentChange(Number(event.target.value))}
          />
        </div>

        <div className="rounded-lg border border-border/80 p-1.5">
          <Label htmlFor="current-vol-compact" className="text-[10px] text-muted-foreground block mb-0.5">
            Current Volume (Vact)
          </Label>
          <Input
            id="current-vol-compact"
            className="h-6 text-xs"
            type="number"
            inputMode="decimal"
            min={0}
            max={500}
            step={0.5}
            value={currentVolume}
            onChange={(event) => handleCurrentVolumeChange(Number(event.target.value))}
          />
        </div>

        <div className="rounded-lg border border-border/80 p-1.5">
          <Label htmlFor="target-vol-compact" className="text-[10px] text-muted-foreground block mb-0.5">
            Target Volume (Vset)
          </Label>
          <Input
            id="target-vol-compact"
            className="h-6 text-xs"
            type="number"
            inputMode="decimal"
            min={0}
            max={500}
            step={0.5}
            value={targetVolume}
            onChange={(event) => handleTargetVolumeChange(Number(event.target.value))}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationAction === 'start'
                ? 'Do you really want to start the charging with these values?'
                : 'Do you really want to stop the charging?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmation(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmationAction === 'start' ? confirmStartCharging : confirmStopCharging}
              className={confirmationAction === 'start' ? 'bg-success' : 'bg-destructive'}
            >
              {confirmationAction === 'start' ? 'Start' : 'Stop'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CoolantChargeControlCompact;
