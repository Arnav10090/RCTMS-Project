import React, { useMemo } from 'react';
import { DataCard } from '@/components/DataCard';
import { Activity, Droplet, Gauge, Wrench } from 'lucide-react';

export const KpiStrip: React.FC = () => {
  const randomGrade = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const len = 8;
    let s = '';
    for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return `G-${s}`;
  }, []);

  const systemData = {
    coilData: {
      id: 'RC-2024-001',
      width: 1250.5,
      thickness: 2.85,
      grade: randomGrade
    },
    coolantSystem: {
      tankLevel: 87.3,
      tankLevelLiters: 24.5,
      temperature: 18.5,
      concentration: 5.2,
      coolantFlow: 12.5,
      coolantPH: 6.8,
      dmWaterPH: 7.2
    },
    mainHydraulic: {
      tankLevel: 75.4,
      tankLevelLiters: 30.2,
      pressure: 145.8,
      temperature: 42.1,
      contamination: 0.85,
      waterSaturation: 2.1
    },
    auxiliaryHydraulic: {
      tankLevel: 82.1,
      tankLevelLiters: 20.5,
      pressure: 142.3,
      temperature: 39.8,
      contamination: 0.92,
      waterSaturation: 1.8
    },
    gearLubrication: {
      tankLevel: 88.6,
      tankLevelLiters: 17.7,
      temperature: 35.2,
      waterSaturation: 1.5,
      flow: 14.3,
      grade: 'ISO VG 220'
    }
  };

  return (
    <div className="mt-6 px-6 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <DataCard title="Running Coil Data" icon={Activity}>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Coil ID:</span>
              <span className="font-mono font-bold">{systemData.coilData.id}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Grade:</span>
              <span className="font-semibold">{systemData.coilData.grade}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Width:</span>
              <span className="font-mono">{systemData.coilData.width} mm</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Thickness:</span>
              <span className="font-mono">{systemData.coilData.thickness} mm</span>
            </div>
          </div>
        </DataCard>

        <DataCard title="Roll Coolant Parameters" icon={Droplet} tankLevel={systemData.coolantSystem.tankLevel} tankLevelUnit="kL" tankLevelLiters={systemData.coolantSystem.tankLevelLiters}>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Temperature:</span>
              <span className="font-mono">{systemData.coolantSystem.temperature}°C</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Concentration:</span>
              <span className="font-mono">{systemData.coolantSystem.concentration}%</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Coolant Flow:</span>
              <span className="font-mono">{systemData.coolantSystem.coolantFlow} L/min</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Roll Coolant pH:</span>
              <span className="font-mono">{systemData.coolantSystem.coolantPH}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">DM Water pH:</span>
              <span className="font-mono">{systemData.coolantSystem.dmWaterPH}</span>
            </div>
          </div>
        </DataCard>

        <DataCard title="Main Hydraulic System" icon={Gauge} tankLevel={systemData.mainHydraulic.tankLevel} tankLevelUnit="kL" tankLevelLiters={systemData.mainHydraulic.tankLevelLiters}>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Pressure:</span>
              <span className="font-mono">{systemData.mainHydraulic.pressure} bar</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Temperature:</span>
              <span className="font-mono">{systemData.mainHydraulic.temperature}°C</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Contamination:</span>
              <span className="font-mono">{systemData.mainHydraulic.contamination} mg/L</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Water Sat:</span>
              <span className="font-mono">{systemData.mainHydraulic.waterSaturation}%</span>
            </div>
          </div>
        </DataCard>

        <DataCard title="Auxiliary Hydraulic System" icon={Wrench} tankLevel={systemData.auxiliaryHydraulic.tankLevel} tankLevelUnit="kL" tankLevelLiters={systemData.auxiliaryHydraulic.tankLevelLiters}>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Pressure:</span>
              <span className="font-mono">{systemData.auxiliaryHydraulic.pressure} bar</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Temperature:</span>
              <span className="font-mono">{systemData.auxiliaryHydraulic.temperature}°C</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Contamination:</span>
              <span className="font-mono">{systemData.auxiliaryHydraulic.contamination} mg/L</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Water Sat:</span>
              <span className="font-mono">{systemData.auxiliaryHydraulic.waterSaturation}%</span>
            </div>
          </div>
        </DataCard>

        <DataCard title="Gear Lubrication System" icon={Wrench} tankLevel={systemData.gearLubrication.tankLevel} tankLevelUnit="kL" tankLevelLiters={systemData.gearLubrication.tankLevelLiters}>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Temperature:</span>
              <span className="font-mono">{systemData.gearLubrication.temperature}°C</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Water Saturation:</span>
              <span className="font-mono">{systemData.gearLubrication.waterSaturation}%</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Flow:</span>
              <span className="font-mono">{systemData.gearLubrication.flow} L/min</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Grade:</span>
              <span className="font-mono">{systemData.gearLubrication.grade}</span>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );
};
