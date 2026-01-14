import React, { useMemo } from 'react';
import { DataCard } from '@/components/DataCard';
import { GaugeDisplay } from '@/components/GaugeDisplay';
import { Activity, Droplet, CheckCircle, Shield } from 'lucide-react';

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
      temperature: 18.5,
      concentration: 5.2
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Running Coil Data */}
        <DataCard title="Running Coil Data" icon={Activity} variant="primary">
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground">Coil ID</div>
              <div className="text-lg font-mono font-bold text-black dark:text-white">{systemData.coilData.id}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Width</div>
                <div className="font-mono font-semibold text-black dark:text-white">{systemData.coilData.width} mm</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Thickness</div>
                <div className="font-mono font-semibold text-black dark:text-white">{systemData.coilData.thickness} mm</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Grade</div>
              <div className="text-sm font-semibold text-secondary dark:text-white">{systemData.coilData.grade}</div>
            </div>
          </div>
        </DataCard>

        {/* Roll Coolant Parameters */}
        <DataCard title="Roll Coolant Parameters" icon={Droplet} variant="success">
          <div className="space-y-4">
            <GaugeDisplay label="Tank Level" value={systemData.coolantSystem.tankLevel} unit="%" thresholds={{ warning: 30, danger: 15 }} />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Coolant Temperature</div>
                <div className="font-mono font-semibold text-black dark:text-white">{systemData.coolantSystem.temperature}°C</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Coolant Concentration</div>
                <div className="font-mono font-semibold text-black dark:text-white">{systemData.coolantSystem.concentration}%</div>
              </div>
            </div>
          </div>
        </DataCard>

        {/* Oil Cellar Status & Access Control */}
        <DataCard title="Oil Cellar Status & Access Control" icon={Shield} variant="primary" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Oil Cellar Section */}
            <div className="space-y-2 border-r border-border/50 pr-4">
              <div className="font-semibold text-sm mb-3 text-muted-foreground">Oil Cellar Environment</div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Person w/o PPE</div>
                  <div className="font-mono font-semibold text-foreground">{systemData.safety.withoutPPE}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">No. of person entered</div>
                  <div className="font-mono font-semibold text-foreground">{systemData.safety.totalEntered}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg. AQI</div>
                  <div className="font-mono font-semibold text-foreground">{systemData.safety.averageAQI}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Humidity</div>
                  <div className="font-mono font-semibold text-foreground">{systemData.safety.humidity}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Temp</div>
                  <div className="font-mono font-semibold text-foreground">{systemData.safety.temperature}°C</div>
                </div>
              </div>
            </div>

            {/* Access Control Section */}
            <div className="space-y-2 pl-2">
              <div className="font-semibold text-sm mb-3 text-muted-foreground">Access Control System</div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Fire Ext. system</div>
                  <div className={`px-2 py-1 rounded text-center text-xs font-bold ${systemData.accessControl.fireExtSystem === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {systemData.accessControl.fireExtSystem === 'Active' ? 'Healthy' : 'Unhealthy'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Unsafe Acts Today</div>
                  <div className="font-mono font-semibold text-foreground">{systemData.accessControl.unsafeActs}</div>
                </div>
              </div>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );
};
