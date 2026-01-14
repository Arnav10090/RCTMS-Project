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

/* =========================
   HARD-CODED SYSTEM VALUES
   ========================= */
const HARD_CODED_CURRENT_CONCENTRATION = 5.2; // %
const HARD_CODED_CURRENT_VOLUME = 82; // m³

interface CoolantChargeControlProps {
  defaultSettings?: {
    desiredConcentration: number;
    targetVolume: number;
  };
}

type ChargeState = 'idle' | 'charging' | 'stopped' | 'complete';

const statusConfig: Record<
  ChargeState,
  {
    label: string;
    description: string;
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
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
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

export const CoolantChargeControl: React.FC<CoolantChargeControlProps> = ({
  defaultSettings
}) => {
  /* =========================
     INITIAL SETTINGS
     ========================= */
  const initialSettings = useMemo(
    () => ({
      desiredConcentration: defaultSettings?.desiredConcentration ?? 6.5,
      targetVolume: defaultSettings?.targetVolume ?? 120
    }),
    [defaultSettings]
  );

  /* =========================
     OPERATOR-CONTROLLED STATE
     ========================= */
  const [desiredConcentration, setDesiredConcentration] = useState(
    initialSettings.desiredConcentration
  );
  const [targetVolume, setTargetVolume] = useState(
    initialSettings.targetVolume
  );

  /* =========================
     SYSTEM-CONTROLLED VALUES
     (READ-ONLY)
     ========================= */
  const currentConcentration = HARD_CODED_CURRENT_CONCENTRATION;
  const baseCurrentVolume = HARD_CODED_CURRENT_VOLUME;

  /* =========================
     CHARGE STATE
     ========================= */
  const [chargeState, setChargeState] = useState<ChargeState>('idle');
  const [chargeProgress, setChargeProgress] = useState(0);
  const [addedVolume, setAddedVolume] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startCharging = () => {
    if (timerRef.current) return;

    if (chargeProgress >= 100) {
      setChargeProgress(0);
      setAddedVolume(0);
    }

    setChargeState('charging');
    timerRef.current = setInterval(() => {
      setChargeProgress((prev) => {
        const next = Math.min(prev + 5, 100);

        // Calculate volume to be added based on progress
        const volumeToAdd = targetVolume - baseCurrentVolume;
        const newAddedVolume = (next / 100) * volumeToAdd;
        setAddedVolume(newAddedVolume);

        if (next === 100) {
          clearTimer();
          setChargeState('complete');
          setTargetVolume(0); // Reset target volume when complete
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
    setAddedVolume(0);
    setChargeState('idle');
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  /* =========================
     CALCULATIONS
     ========================= */

  // Current volume increases as charging progresses
  const currentVolume = baseCurrentVolume + addedVolume;

  // Volume to be added = Target Volume - Current Volume (at start of charge)
  const volumeToAdd = useMemo(
    () => Math.max(targetVolume - baseCurrentVolume, 0),
    [targetVolume, baseCurrentVolume]
  );

  // Oil volume = (Target Conc - Current Conc) * Volume to be added / 100
  const oilToAdd = useMemo(
    () => ((desiredConcentration - currentConcentration) * volumeToAdd) / 100,
    [desiredConcentration, currentConcentration, volumeToAdd]
  );

  // Water volume = Volume to be added - Oil volume
  const waterToAdd = useMemo(
    () => Math.max(volumeToAdd - oilToAdd, 0),
    [volumeToAdd, oilToAdd]
  );

  /* =========================
     HANDLERS
     ========================= */
  const handleDesiredChange = (value: number) => {
    setDesiredConcentration(clampNumber(value, 0, 25));
  };

  const handleTargetVolumeChange = (value: number) => {
    setTargetVolume(clampNumber(value, 0, 500));
  };

  const status = statusConfig[chargeState];

  /* =========================
     RENDER
     ========================= */
  return (
    <section className="grid grid-cols-1 gap-6">
      <DataCard title="Coolant Charging Control" icon={Droplet} variant="primary">
        <div className="flex flex-col gap-6">

          {/* STATUS */}
          <div className="rounded-2xl bg-background/80 p-4 shadow-inner">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  Charge Sequence
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={status.badgeVariant}>{status.label}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {status.description}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={startCharging} disabled={chargeState === 'charging'}>
                  <Play className="h-4 w-4" /> Start
                </Button>
                <Button size="sm" variant="destructive" onClick={stopCharging} disabled={chargeState !== 'charging'}>
                  <Square className="h-4 w-4" /> Stop
                </Button>
                <Button size="sm" variant="outline" onClick={resetCharging}>
                  <RotateCcw className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Progress value={chargeProgress} />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{chargeProgress}%</span>
                <span>{status.description}</span>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-success/10 p-4">
              <p className="text-xs uppercase text-muted-foreground">Oil Volume to Supply</p>
              <p className="mt-2 text-2xl font-semibold">{oilToAdd.toFixed(2)} m³</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-4">
              <p className="text-xs uppercase text-muted-foreground">Water Volume to Supply</p>
              <p className="mt-2 text-2xl font-semibold">{waterToAdd.toFixed(2)} m³</p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border p-4">
              <Label className="text-xs uppercase text-muted-foreground">
                Desired Concentration (Dset)
              </Label>
              <Slider
                className="mt-4"
                value={[desiredConcentration]}
                min={0}
                max={25}
                step={0.1}
                onValueChange={(v) => handleDesiredChange(v[0] ?? desiredConcentration)}
              />
              <Input
                className="mt-3"
                type="number"
                value={desiredConcentration}
                onChange={(e) => handleDesiredChange(Number(e.target.value))}
              />
            </div>

            <div className="rounded-2xl border p-4">
              <Label className="text-xs uppercase text-muted-foreground">
                Target Volume (Vset)
              </Label>
              <Input
                className="mt-3"
                type="number"
                value={targetVolume}
                onChange={(e) => handleTargetVolumeChange(Number(e.target.value))}
              />
            </div>
          </div>

          {/* READ-ONLY SYSTEM VALUES */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border p-4">
              <div className="flex justify-between items-center">
                <Label className="text-xs uppercase text-muted-foreground">
                  Current Concentration (Dact)
                </Label>
                <Badge variant="destructive">
                  {currentConcentration.toFixed(2)}%
                </Badge>
              </div>
              <div className="mt-3 rounded-lg bg-muted/50 px-4 py-3">
                <p className="text-2xl font-semibold">
                  {currentConcentration.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <Label className="text-xs uppercase text-muted-foreground">
                Current Tank Volume (Vact)
              </Label>
              <div className="mt-3 rounded-lg bg-muted/50 px-4 py-3">
                <p className="text-2xl font-semibold">
                  {currentVolume} m³
                </p>
              </div>
            </div>
          </div>

          {/* TANK */}
          <DataCard title="Roll Coolant Tank" icon={Gauge}>
            <RollCoolantTank
              targetVolume={targetVolume}
              currentVolume={currentVolume}
              currentConcentration={currentConcentration}
              oilToAdd={oilToAdd}
              waterToAdd={waterToAdd}
            />
          </DataCard>
        </div>
      </DataCard>
    </section>
  );
};
