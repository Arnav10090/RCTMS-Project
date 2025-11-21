import React, { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface RollCoolantTankProps {
  targetVolume: number; // Vset
  currentVolume: number; // Vact
  currentConcentration: number; // Dact (%), used to split current oil/water
  oilToAdd: number; // Vsup_o
  waterToAdd: number; // Vsup_w
  className?: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export const RollCoolantTank: React.FC<RollCoolantTankProps> = ({
  targetVolume,
  currentVolume,
  currentConcentration,
  oilToAdd,
  waterToAdd,
  className,
}) => {
  const { vact_o, vact_w, vsup_o, vsup_w, total } = useMemo(() => {
    const total = Math.max(targetVolume, 0);
    const vact_o = Math.max(
      currentVolume * (currentConcentration / 100) * 2.5,
      0
    ); // Increase by 50%
    const vact_w = Math.max((currentVolume - vact_o) * 0.6, 0);
    const vsup_o = Math.max(oilToAdd * 2, 0); // Double the height
    const vsup_w = Math.max(waterToAdd * 2, 0); // Double the height
    return { vact_o, vact_w, vsup_o, vsup_w, total };
  }, [currentConcentration, currentVolume, oilToAdd, targetVolume, waterToAdd]);

  const pct = (v: number) =>
    total <= 0 ? 0 : clamp((v / total) * 100, 0, 100);

  const layers = [
    {
      key: "vact_o",
      label: "Vact_o: Current oil volume",
      value: vact_o,
      color: "from-zinc-600/70 to-zinc-500/70",
      text: "text-zinc-100",
    },
    {
      key: "vact_w",
      label: "Vact_w: Current water volume",
      value: vact_w,
      color: "from-sky-600/70 to-cyan-500/70",
      text: "text-white",
    },
    {
      key: "vsup_o",
      label: "Vsup_o: Supplied oil volume",
      value: vsup_o,
      color: "from-zinc-400/80 to-stone-300/80",
      text: "text-zinc-900",
    },
    {
      key: "vsup_w",
      label: "Vsup_w: Supplied water volume",
      value: vsup_w,
      color: "from-sky-400/80 to-cyan-300/80",
      text: "text-cyan-950",
    },
  ];

  const scaleMarks = useMemo(() => {
    const marks: { pct: number; label: string }[] = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      marks.push({
        pct: ratio * 100,
        label: `${(targetVolume * ratio).toFixed(0)} m³`,
      });
    }
    return marks;
  }, [targetVolume]);

  const currentPct = pct(vact_o + vact_w);
  const currentY = 0 + (75 - 2) * (1 - currentPct / 100);

  const totalLayersHeight = layers.reduce((s, l) => s + pct(l.value), 0);
  const containerBottom = 15;
  const containerTop = 80;

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative w-full rounded-2xl border border-border/70 bg-gradient-to-br from-background/60 to-background/20 p-4",
          className
        )}
      >
        <div className="grid grid-cols-12 gap-4">
          {/* Y axis with ticks + indicators */}
          <div className="col-span-2 flex items-end">
            <div className="relative h-64 w-full">
              {/* Target (Vset) full-height indicator */}
              <svg
                className="absolute left-0 top-0 h-full w-20 text-muted-foreground"
                viewBox="0 0 60 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <marker
                    id="arrow"
                    markerWidth="6"
                    markerHeight="6"
                    refX="3"
                    refY="3"
                    orient="auto-start-reverse"
                  >
                    <path d="M0,0 L6,3 L0,6 z" fill="currentColor" />
                  </marker>
                </defs>
                <line
                  x1="8"
                  y1={containerTop}
                  x2="8"
                  y2={containerBottom}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  markerStart="url(#arrow)"
                  markerEnd="url(#arrow)"
                />
                {/* Current (Vact) indicator */}
                <line
                  x1="30"
                  y1={containerTop}
                  x2="30"
                  y2={currentY}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  markerStart="url(#arrow)"
                  markerEnd="url(#arrow)"
                />
              </svg>

              {/* Labels */}
              <div className="absolute left-5 top-20 -translate-y-12 w-24 pr-2 text-[10px] leading-tight text-muted-foreground">
                Volume after charging
                <span className="block opacity-70">(HMI Set Value)</span>
              </div>
              <div
                className="absolute left-14 top-24 w-24 pr-2 text-[10px] leading-tight text-muted-foreground"
                style={{ bottom: `${currentPct / 2}%` }}
              >
                <div className="w-10 pr-2 text-[10px] leading-tight text-muted-foreground">
                  Volume before charging
                </div>
              </div>
            </div>
          </div>

          {/* Tank body - U-shaped container */}
          <div className="col-span-10 pl-12">
            <div className="relative h-64 w-full">
              {/* U-shaped container using borders */}
              <div className="absolute inset-0 border-b-4 border-l-4 border-r-4 border-foreground/30 rounded-b-xl bg-gradient-to-b from-muted/40 to-background">
                {/* Inner shine */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 rounded-b-xl" />
                {/* Layers */}
                {layers.reduce<JSX.Element[]>((acc, layer, idx) => {
                  const heightPct = pct(layer.value);
                  const bottomPct = layers
                    .slice(0, idx)
                    .reduce((s, l) => s + pct(l.value), 0);
                  const content = (
                    <Tooltip key={layer.key}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "absolute left-0 w-full bg-gradient-to-r",
                            layer.color,
                            "border-t border-white/20"
                          )}
                          style={{
                            height: `${heightPct}%`,
                            bottom: `${bottomPct}%`,
                          }}
                        >
                          <div
                            className={cn(
                              "flex h-full items-center justify-center px-2 text-xs font-semibold",
                              layer.text
                            )}
                          >
                            <span className="hidden sm:block drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                              {layer.label}
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {layer.label} – {layer.value.toFixed(2)} m³ (
                        {pct(layer.value).toFixed(0)}%)
                      </TooltipContent>
                    </Tooltip>
                  );
                  acc.push(content);
                  return acc;
                }, [])}

                {/* Frame accents */}
                <div className="pointer-events-none absolute inset-0 rounded-b-xl ring-1 ring-inset ring-foreground/20" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-black/20" />
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {layers.map((l) => (
                <div
                  key={`legend-${l.key}`}
                  className="flex items-center gap-2"
                >
                  <span
                    className={cn(
                      "h-3 w-3 rounded-sm bg-gradient-to-r",
                      l.color,
                      "ring-1 ring-border/50"
                    )}
                  />
                  <span className="text-muted-foreground">
                    {l.key.replace("_", "")}: {l.value.toFixed(2)} m³
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RollCoolantTank;
