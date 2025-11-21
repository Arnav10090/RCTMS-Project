import React from 'react';
import { DataCard } from '@/components/DataCard';
import { HydraulicSchematic } from '@/components/HydraulicSchematic';

export const HydraulicSystem = () => {
  return (
    <div className="space-y-6">
      {/* Main Control Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* System Schematic */}
        <div className="xl:col-span-3">
          <DataCard title="HMI-02: Hydraulic System Schematic" className="h-[700px]">
            <div className="relative h-[640px] rounded-lg border border-border/50 bg-background">
              <HydraulicSchematic className="absolute inset-0" />
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  );
};
