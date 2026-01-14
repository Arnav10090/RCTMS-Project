import React, { useMemo } from 'react';
import { DataCard } from '@/components/DataCard';
import { GaugeDisplay } from '@/components/GaugeDisplay';
import { Activity, Droplet, Gauge, Wrench } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CoolantChargeControlCompact } from '@/components/CoolantChargeControlCompact';
import RollCoolantTank from '@/components/RollCoolantTank';

// images served from the public folder
const rollImg = '/rollcoolantarea.png';
const hydraulicImg = '/hydraulicsystem.png';
const gearLubImg = '/gearlubsystem.png';
const legendImg = '/legend.png';

export const Overview = () => {
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
    <div className="space-y-3">
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

        <DataCard title="Roll Coolant Parameters" icon={Droplet} tankLevel={systemData.coolantSystem.tankLevel} tankLevelUnit="%" tankLevelLiters={systemData.coolantSystem.tankLevelLiters}>
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
              <span className="text-muted-foreground">DM Water pH:</span>
              <span className="font-mono">{systemData.coolantSystem.dmWaterPH}</span>
            </div>
          </div>
        </DataCard>

        <DataCard title="Main Hydraulic System" icon={Gauge} tankLevel={systemData.mainHydraulic.tankLevel} tankLevelUnit="%" tankLevelLiters={systemData.mainHydraulic.tankLevelLiters}>
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

        <DataCard title="Auxiliary Hydraulic System" icon={Wrench} tankLevel={systemData.auxiliaryHydraulic.tankLevel} tankLevelUnit="%" tankLevelLiters={systemData.auxiliaryHydraulic.tankLevelLiters}>
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

        <DataCard title="Gear Lubrication System" icon={Wrench} tankLevel={systemData.gearLubrication.tankLevel} tankLevelUnit="%">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Tank Level:</span>
              <span className="font-mono">{systemData.gearLubrication.tankLevel}%</span>
            </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="pickling" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-8">
              <TabsTrigger value="pickling" className="text-xs py-1">Roll Coolant Area</TabsTrigger>
              <TabsTrigger value="hydraulic" className="text-xs py-1">Hydraulic System</TabsTrigger>
              <TabsTrigger value="gear-lube" className="text-xs py-1">Gear Lub. System</TabsTrigger>
              <TabsTrigger value="legend" className="text-xs py-1">Legends</TabsTrigger>
            </TabsList>
            <TabsContent value="pickling" className="mt-2">
              <div className="overflow-hidden rounded-md border border-border/50 shadow-sm" style={{ width: '100%', height: '569px' }}>
                {/*
                <iframe
                  src="http://192.168.2.1:8080/webvisu.htm"
                  loading="lazy"
                  scrolling="no"
                  className="h-[569px] border-0"
                  style={{ width: '350%', marginLeft: '0%', display: 'block' }}
                  title="Pickling Tank Diagram"
                />
                */}
                <img src="/rollcoolantarea.png" alt="Roll Coolant Area" className="w-full h-full object-contain" />
              </div>
            </TabsContent>
            <TabsContent value="hydraulic" className="mt-2">
              <div className="overflow-hidden rounded-md border border-border/50 shadow-sm" style={{ width: '100%', height: '569px' }}>
                {/*
                <iframe
                  src="http://192.168.2.1:8080/webvisu.htm"
                  loading="lazy"
                  scrolling="no"
                  className="h-[569px] border-0"
                  style={{ width: '350%', marginLeft: '-100%', display: 'block' }}
                  title="Hydraulic System Diagram"
                />
                */}
                <img src="/hydraulicsystem.png" alt="Hydraulic System" className="w-full h-full object-contain" />
              </div>
            </TabsContent>
            <TabsContent value="gear-lube" className="mt-2">
              <div className="overflow-hidden rounded-md border border-border/50 shadow-sm" style={{ width: '100%', height: '569px' }}>
                {/*
                <iframe
                  src="http://192.168.2.1:8080/webvisu.htm"
                  loading="lazy"
                  scrolling="no"
                  className="h-[569px] border-0"
                  style={{ width: '350%', marginLeft: '-175%', display: 'block' }}
                  title="Gear Lubrication System Diagram"
                />
                */}
                <img src="/gearlubsystem.png" alt="Gear Lubrication System" className="w-full h-full object-contain" />
              </div>
            </TabsContent>
            <TabsContent value="legend" className="mt-2">
              <div className="overflow-hidden rounded-md border border-border/50 shadow-sm" style={{ width: '100%', height: '569px' }}>
                {/*
                <iframe
                  src="http://192.168.2.1:8080/webvisu.htm"
                  loading="lazy"
                  scrolling="no"
                  className="h-[569px] border-0"
                  style={{ width: '350%', marginLeft: '-245%', display: 'block' }}
                  title="Legends Diagram"
                />
                */}
                <img src="/legend.png" alt="Legends" className="w-full h-full object-contain" />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-3">
          <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
            <div className="mb-1.5">
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <Droplet className="h-3.5 w-3.5" />
                Coolant Charging Control
              </h3>
            </div>
            <CoolantChargeControlCompact />
          </div>

          <div className="rounded-lg border border-border bg-card px-2 pt-2 pb-1 shadow-sm">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <rect x="5" y="9" width="14" height="6" fill="currentColor" opacity="0.12" />
                <path d="M7 5v-1a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Pickling Tank
            </h3>
            <RollCoolantTank
              targetVolume={systemData.coolantSystem.tankLevel}
              currentVolume={systemData.coolantSystem.tankLevel * 0.8}
              currentConcentration={systemData.coolantSystem.concentration}
              oilToAdd={5.2}
              waterToAdd={3.8}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
