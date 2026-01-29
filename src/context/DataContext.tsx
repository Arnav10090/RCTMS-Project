import React, { createContext, useContext, useState, ReactNode } from 'react';

type CoolantRow = {
  id: number;
  date: string;
  oilConc: string;
  conductivity: string;
  pH: string;
  tempC: string;
  esi: string;
  tramp: string;
  saponification: string;
  tankLvl: string;
};

type OilCellarRow = {
  id: number;
  date: string;
  tempC: string;
  humidity: string;
  aqiA1: string;
  aqiA2: string;
  aqiA3: string;
  accessControl: string;
  personsEntered: string;
  noPpe: string;
  welding: string;
  cutting: string;
  others: string;
  illumA1: string;
  illumA2: string;
  illumA3: string;
  illumA4: string;
  illumA5: string;
  fireStatus: string;
  fireNextDue: string;
};

type PumpRow = {
  id: number;
  date: string;
  pumpNo: string;
  status: string;
  runHrs: string;
  avgLoad: string;
  avgPressure: string;
};

type HpPumpRow = {
  id: number;
  date: string;
  pumpType: string;
  pumpNo: string;
  status: string;
  runHrs: string;
  avgLoad: string;
  avgSystemPressure: string;
  avgTankLevel: string;
  avgOilTemp: string;
  oilCleanliness: string;
  waterSaturation: string;
};

interface DataContextType {
  coolant: CoolantRow[];
  cellar: OilCellarRow[];
  pumps: PumpRow[];
  hp: HpPumpRow[];
  setCoolant: (data: CoolantRow[]) => void;
  setCellar: (data: OilCellarRow[]) => void;
  setPumps: (data: PumpRow[]) => void;
  setHp: (data: HpPumpRow[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial data generation functions
function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function genCoolant(n = 48): CoolantRow[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    date: toISODate(new Date(today.getTime() - i * 86400000)),
    oilConc: (3 + Math.random() * 2).toFixed(2),
    conductivity: Math.round(800 + Math.random() * 600).toString(),
    pH: (7 + Math.random()).toFixed(2),
    tempC: Math.round(20 + Math.random() * 10).toString(),
    esi: Math.round(40 + Math.random() * 20).toString(),
    tramp: (0.5 + Math.random() * 1.5).toFixed(2),
    saponification: (0.5 + Math.random() * 1.2).toFixed(2),
    tankLvl: (4 + Math.random() * 3).toFixed(2),
  }));
}

function genOilCellar(n = 36): OilCellarRow[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    date: toISODate(new Date(today.getTime() - i * 86400000)),
    tempC: Math.round(22 + Math.random() * 6).toString(),
    humidity: Math.round(40 + Math.random() * 30).toString(),
    aqiA1: Math.round(20 + Math.random() * 30).toString(),
    aqiA2: Math.round(20 + Math.random() * 30).toString(),
    aqiA3: Math.round(20 + Math.random() * 30).toString(),
    accessControl: Math.random() > 0.9 ? 'Restricted' : 'Normal',
    personsEntered: Math.round(3 + Math.random() * 6).toString(),
    noPpe: Math.round(Math.random() * 2).toString(),
    welding: Math.round(Math.random() * 1).toString(),
    cutting: Math.round(Math.random() * 1).toString(),
    others: Math.round(Math.random() * 1).toString(),
    illumA1: Math.round(120 + Math.random() * 60).toString(),
    illumA2: Math.round(120 + Math.random() * 60).toString(),
    illumA3: Math.round(120 + Math.random() * 60).toString(),
    illumA4: Math.round(120 + Math.random() * 60).toString(),
    illumA5: Math.round(120 + Math.random() * 60).toString(),
    fireStatus: Math.random() > 0.8 ? 'Due' : 'OK',
    fireNextDue: toISODate(new Date(today.getTime() + (15 + Math.random() * 60) * 86400000)),
  }));
}

function genPumps(n = 30): PumpRow[] {
  const today = new Date();
  const rows: PumpRow[] = [];
  for (let i = 0; i < n; i++) {
    const date = toISODate(new Date(today.getTime() - i * 86400000));
    rows.push({
      id: i * 2 + 1,
      date,
      pumpNo: '#1',
      status: Math.random() > 0.2 ? 'Run' : 'Stand-by',
      runHrs: (2 + Math.random() * 8).toFixed(1),
      avgLoad: Math.round(40 + Math.random() * 50).toString(),
      avgPressure: (4 + Math.random() * 4).toFixed(1),
    });
    rows.push({
      id: i * 2 + 2,
      date,
      pumpNo: '#2',
      status: Math.random() > 0.2 ? 'Run' : 'Stand-by',
      runHrs: (2 + Math.random() * 8).toFixed(1),
      avgLoad: Math.round(40 + Math.random() * 50).toString(),
      avgPressure: (4 + Math.random() * 4).toFixed(1),
    });
  }
  return rows;
}

function genHpPumps(n = 30): HpPumpRow[] {
  const today = new Date();
  const oilClasses = ['ISO 18/16/13', 'ISO 17/15/12', 'ISO 19/17/14'];
  const pumpTypes = ['Main Hydraulic Pump', 'Auxiliary hyd pump', 'Gear lub pump'];
  const rows: HpPumpRow[] = [];
  for (let i = 0; i < n; i++) {
    const date = toISODate(new Date(today.getTime() - i * 86400000));
    const pumpType = pumpTypes[Math.floor(Math.random() * pumpTypes.length)];
    rows.push({
      id: i * 2 + 1,
      date,
      pumpType,
      pumpNo: '#1',
      status: Math.random() > 0.2 ? 'Run' : 'Stand-by',
      runHrs: (2 + Math.random() * 8).toFixed(1),
      avgLoad: Math.round(40 + Math.random() * 50).toString(),
      avgSystemPressure: (90 + Math.random() * 40).toFixed(1),
      avgTankLevel: (40 + Math.random() * 40).toFixed(1),
      avgOilTemp: Math.round(35 + Math.random() * 10).toString(),
      oilCleanliness: oilClasses[Math.floor(Math.random() * oilClasses.length)],
      waterSaturation: Math.round(20 + Math.random() * 50).toString(),
    });
    rows.push({
      id: i * 2 + 2,
      date,
      pumpType,
      pumpNo: '#2',
      status: Math.random() > 0.2 ? 'Run' : 'Stand-by',
      runHrs: (2 + Math.random() * 8).toFixed(1),
      avgLoad: Math.round(40 + Math.random() * 50).toString(),
      avgSystemPressure: (90 + Math.random() * 40).toFixed(1),
      avgTankLevel: (40 + Math.random() * 40).toFixed(1),
      avgOilTemp: Math.round(35 + Math.random() * 10).toString(),
      oilCleanliness: oilClasses[Math.floor(Math.random() * oilClasses.length)],
      waterSaturation: Math.round(20 + Math.random() * 50).toString(),
    });
  }
  return rows;
}

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coolant, setCoolant] = useState<CoolantRow[]>(() => genCoolant());
  const [cellar, setCellar] = useState<OilCellarRow[]>(() => genOilCellar());
  const [pumps, setPumps] = useState<PumpRow[]>(() => genPumps());
  const [hp, setHp] = useState<HpPumpRow[]>(() => genHpPumps());

  return (
    <DataContext.Provider value={{ coolant, cellar, pumps, hp, setCoolant, setCellar, setPumps, setHp }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within DataProvider');
  }
  return context;
};
