import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Droplet, Gauge, Play, RotateCcw, Square } from 'lucide-react';

import { DataCard } from '@/components/DataCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import RollCoolantTank from '@/components/RollCoolantTank';

interface CoolantChargeControlProps {
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
    description: 'Awaiting operator confirmation',
    badgeVariant: 'outline'
  },
  charging: {
    label: 'Charging',
    description: 'Charging sequence active',
    badgeVariant: 'default'
  },
  stopped: {
    label: 'Paused',
    description: 'Charge sequence paused',
    badgeVariant: 'destructive'
  },
  complete: {
    label: 'Complete',
    description: 'Target parameters reached',
    badgeVariant: 'secondary'
  }
};

const clampNumber = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
};

export const CoolantChargeControl: React.FC<CoolantChargeControlProps> = ({
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

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startCharging = () => {
    if (timerRef.current) {
      return;
    }

    if (chargeProgress >= 100) {
      setChargeProgress(0);
    }

    setChargeState('charging');
    timerRef.current = setInterval(() => {
      setChargeProgress((previous) => {
        const next = Math.min(previous + 5, 100);
        if (next === 100) {
          clearTimer();
          setChargeState('complete');
        }
        return next;
      });
    }, 1200);
  };

  const stopCharging = () => {
    clearTimer();
    setChargeState('stopped');
  };

  const resetCharging = () => {
    clearTimer();
    setChargeProgress(0);
    setChargeState('idle');
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

  return (
    <section className="grid grid-cols-1 gap-6">
      <div className="xl:col-span-12">
        <DataCard title="Coolant Charging Control" icon={Droplet} variant="primary" className="h-full">
          <div className="flex h-full flex-col gap-6">
            <div className="rounded-2xl bg-background/80 p-4 shadow-inner">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Charge Sequence</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant={status.badgeVariant}>{status.label}</Badge>
                      <span className="text-xs text-muted-foreground">{status.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-success text-success-foreground hover:bg-success/90"
                      onClick={startCharging}
                      disabled={chargeState === 'charging'}
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                    <Button size="sm" variant="destructive" onClick={stopCharging} disabled={chargeState !== 'charging'}>
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                    <Button size="sm" variant="outline" onClick={resetCharging} disabled={chargeState === 'idle' && chargeProgress === 0}>
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Charge Progress</Label>
                  <div className="mt-3">
                    <Progress value={chargeProgress} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{chargeProgress}%</span>
                    <span>{status.description}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-success/40 bg-success/10 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Oil Volume to Supply</p>
                <p className="mt-2 text-2xl font-semibold text-black dark:text-success-foreground">
                  {oilToAdd.toFixed(2)} m³
                </p>
              </div>
              <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Water Volume to Supply</p>
                <p className="mt-2 text-2xl font-semibold text-primary">
                  {waterToAdd.toFixed(2)} m³
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/80 p-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="desired-concentration" className="text-xs uppercase tracking-wide text-muted-foreground">
                      Desired Concentration (Dset)
                    </Label>
                    <Badge variant="secondary">{desiredConcentration.toFixed(2)}%</Badge>
                  </div>
                  <Slider
                    className="mt-4"
                    value={[desiredConcentration]}
                    min={0}
                    max={25}
                    step={0.1}
                    onValueChange={(values) => handleDesiredChange(values[0] ?? desiredConcentration)}
                  />
                  <Input
                    id="desired-concentration"
                    className="mt-3"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={25}
                    step={0.1}
                    value={desiredConcentration}
                    onChange={(event) => handleDesiredChange(Number(event.target.value))}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Adjust to the operator-defined target mix. The calculator responds instantly to the updated set point.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 p-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="current-concentration" className="text-xs uppercase tracking-wide text-muted-foreground">
                      Current Concentration (Dact)
                    </Label>
                    <Badge variant={concentrationDelta >= 0 ? 'outline' : 'destructive'}>
                      {currentConcentration.toFixed(2)}%
                    </Badge>
                  </div>
                  <Slider
                    className="mt-4"
                    value={[currentConcentration]}
                    min={0}
                    max={25}
                    step={0.1}
                    onValueChange={(values) => handleCurrentChange(values[0] ?? currentConcentration)}
                  />
                  <Input
                    id="current-concentration"
                    className="mt-3"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={25}
                    step={0.1}
                    value={currentConcentration}
                    onChange={(event) => handleCurrentChange(Number(event.target.value))}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Pull real-time readings or enter manual lab measurements for instant deviation awareness.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/80 p-4">
                  <Label htmlFor="current-volume" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Current Tank Volume (Vact)
                  </Label>
                  <Input
                    id="current-volume"
                    className="mt-3"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={500}
                    step={0.5}
                    value={currentVolume}
                    onChange={(event) => handleCurrentVolumeChange(Number(event.target.value))}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">Volume estimated from level transmitters prior to charging.</p>
                </div>

                <div className="rounded-2xl border border-border/80 p-4">
                  <Label htmlFor="target-volume" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Target Volume After Charge (Vset)
                  </Label>
                  <Input
                    id="target-volume"
                    className="mt-3"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={500}
                    step={0.5}
                    value={targetVolume}
                    onChange={(event) => handleTargetVolumeChange(Number(event.target.value))}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">Define target batch volume to auto-update oil and water supply targets.</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <DataCard title="Roll Coolant Tank" icon={Gauge}>
                <div className="p-2">
                  <div className="w-full">
                    <RollCoolantTank
                      targetVolume={targetVolume}
                      currentVolume={currentVolume}
                      currentConcentration={currentConcentration}
                      oilToAdd={oilToAdd}
                      waterToAdd={waterToAdd}
                    />
                  </div>
                </div>
              </DataCard>
            </div>

          </div>
        </DataCard>
      </div>

    </section>
  );
};
