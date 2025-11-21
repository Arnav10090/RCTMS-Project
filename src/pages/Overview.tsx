import React from 'react';
import { DataCard } from '@/components/DataCard';
import { StatusIndicator } from '@/components/StatusIndicator';
import { GaugeDisplay } from '@/components/GaugeDisplay';
import { CoolantChargeControl } from '@/components/CoolantChargeControl';
import { Activity, Droplet, Gauge, Wrench } from 'lucide-react';
import PidDiagram from '@/components/PidDiagram';

interface OverviewProps {
  hideKpiCards?: boolean;
}

export const OverviewOld = ({ hideKpiCards = false }: OverviewProps) => {
  // Mock real-time data - in production this would come from your API
  const systemData = {
    coilData: {
      id: 'RC-2024-001',
      width: 1250.5,
      thickness: 2.85,
      grade: 'AISI 304'
    },
    coolantSystem: {
      tankLevel: 87.3,
      temperature: 18.5,
      concentration: 5.2
    },
    mainHydraulic: {
      pressure: 145.8,
      temperature: 42.1,
      status: 'Running',
      contamination: 0.85,
      waterSaturation: 2.1
    },
    auxiliaryHydraulic: {
      pressure: 142.3,
      temperature: 39.8,
      status: 'Standby',
      syncStatus: 'Synchronized'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Status Cards */}
      {!hideKpiCards && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Running Coil Data */}
          <DataCard title="Running Coil Data" icon={Activity} variant="primary">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Coil ID</div>
                <div className="text-lg font-mono font-bold text-black dark:text-white">
                  {systemData.coilData.id}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Width</div>
                  <div className="font-mono font-semibold text-black dark:text-white">
                    {systemData.coilData.width} mm
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Thickness</div>
                  <div className="font-mono font-semibold text-black dark:text-white">
                    {systemData.coilData.thickness} mm
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Grade</div>
                <div className="text-sm font-semibold text-black dark:text-white">
                  {systemData.coilData.grade}
                </div>
              </div>
            </div>
          </DataCard>

          {/* Roll Coolant Parameters */}
          <DataCard title="Roll Coolant Parameters" icon={Droplet} variant="success">
            <div className="space-y-4">
              <GaugeDisplay
                label="Tank Level"
                value={systemData.coolantSystem.tankLevel}
                unit="%"
                thresholds={{
                  warning: 30,
                  danger: 15
                }}
              />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Temperature</div>
                  <div className="font-mono font-semibold text-black dark:text-white">
                    {systemData.coolantSystem.temperature}°C
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Concentration</div>
                  <div className="font-mono font-semibold text-black dark:text-white">
                    {systemData.coolantSystem.concentration}%
                  </div>
                </div>
              </div>
            </div>
          </DataCard>

          {/* Main Hydraulic System */}
          <DataCard title="Main Hydraulic System" icon={Gauge}>
            <div className="space-y-3">
              <StatusIndicator
                status="active"
                label="System Status"
                value={systemData.mainHydraulic.status}
              />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Pressure</div>
                  <div className="font-mono font-semibold text-black dark:text-white">
                    {systemData.mainHydraulic.pressure} bar
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Temperature</div>
                  <div className="font-mono font-semibold text-black dark:text-white">
                    {systemData.mainHydraulic.temperature}°C
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Contamination</div>
                  <div className="font-mono font-semibold text-black dark:text-white">
                    {systemData.mainHydraulic.contamination} mg/L
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Water Sat.</div>
                  <div className="font-mono font-semibold text-black dark:text-white">
                    {systemData.mainHydraulic.waterSaturation}%
                  </div>
                </div>
              </div>
            </div>
          </DataCard>

          {/* Auxiliary Hydraulic System */}
          <DataCard title="Auxiliary Hydraulic System" icon={Wrench}>
            <div className="space-y-3">
              <StatusIndicator
                status="warning"
                label="System Status"
                value={systemData.auxiliaryHydraulic.status}
              />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Pressure</div>
                  <div className="font-mono font-semibold text-black dark:text-white">
                    {systemData.auxiliaryHydraulic.pressure} bar
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Temperature</div>
                  <div className="font-mono font-semibold text-black dark:text-white">
                    {systemData.auxiliaryHydraulic.temperature}°C
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Sync Status</div>
                <div className="text-sm font-semibold text-black dark:text-white">
                  {systemData.auxiliaryHydraulic.syncStatus}
                </div>
              </div>
            </div>
          </DataCard>
        </div>
      )}

      <CoolantChargeControl />

      {/* Central System Visualization */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* P&ID Diagram */}
        <div className="xl:col-span-12">
          <DataCard className="h-[85vh] overflow-hidden">
            <div className="h-full w-full">
              {/* Interactive, editable SVG diagram component */}
                <PidDiagram />
            </div>
          </DataCard>
        </div>

      </div>
    </div>
  );
};

export default OverviewOld;
