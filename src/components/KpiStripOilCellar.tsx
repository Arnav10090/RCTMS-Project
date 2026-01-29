import React, { useMemo } from 'react';
import { DataCard } from '@/components/DataCard';
import { Activity, Droplet, Shield } from 'lucide-react';

export const KpiStripOilCellar: React.FC = () => {
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
      coolantPH: 6.8
    },
    safety: {
      withoutPPE: 0,
      totalEntered: 3,
      averageAQI: 42,
      humidity: 65.2,
      temperature: 23.8,
      status: 'Normal'
    },
    accessControl: {
      status: 'Authorized',
      fireExtSystem: 'Active',
      unsafeActs: 0
    }
  };

  return (
    <div className="mt-6 px-6 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* Running Coil Data */}
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

        {/* Roll Coolant Parameters */}
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
              <span className="text-muted-foreground">Roll Coolant pH:</span>
              <span className="font-mono">{systemData.coolantSystem.coolantPH}</span>
            </div>
          </div>
        </DataCard>

        {/* Oil Cellar Status & Access Control - Attached as 3rd and 4th columns */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Oil Cellar Status */}
          <DataCard title="Oil Cellar Status" icon={Shield}>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Person w/o PPE:</span>
                <span className="font-mono font-semibold">{systemData.safety.withoutPPE}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">No. Entered:</span>
                <span className="font-mono font-semibold">{systemData.safety.totalEntered}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Avg. AQI:</span>
                <span className="font-mono font-semibold">{systemData.safety.averageAQI}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Humidity:</span>
                <span className="font-mono font-semibold">{systemData.safety.humidity}%</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Temperature:</span>
                <span className="font-mono font-semibold">{systemData.safety.temperature}°C</span>
              </div>
            </div>
          </DataCard>

          {/* Access Control */}
          <DataCard title="Access Control" icon={Shield}>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Fire Ext. System:</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${systemData.accessControl.fireExtSystem === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {systemData.accessControl.fireExtSystem === 'Active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Unsafe Acts:</span>
                <span className="font-mono font-semibold">{systemData.accessControl.unsafeActs}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-mono font-semibold">{systemData.accessControl.status}</span>
              </div>
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  );
};
