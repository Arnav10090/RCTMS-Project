import React from 'react';
import { DataCard } from '@/components/DataCard';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format, startOfWeek, addDays, startOfMonth, getDaysInMonth } from 'date-fns';

export const OilCellarMonitor = () => {
  const areas = ['Area#1', 'Area#2', 'Area#3', 'Area#4', 'Area#5'];
  const rows = [
    { id: 'lighting', label: 'Oil Cellar Lighting' },
    { id: 'aqi', label: 'Air Quality Index' },
  ] as const;

  type RowId = typeof rows[number]['id'];

  const [lighting, setLighting] = React.useState<boolean[]>([true, true, true, false, true]);

  const rngFor = (key: string) => {
    try {
      return seeded(strHash(key));
    } catch {
      return Math.random;
    }
  };

  const [aqiValues, setAqiValues] = React.useState<number[]>(() => {
    const rng = rngFor('aqi');
    return Array.from({ length: areas.length }, () => parseFloat((15 + rng() * 80).toFixed(1)));
  });

  const setAllInRow = (row: RowId, value: boolean) => {
    if (row === 'lighting') {
      setLighting(Array.from({ length: areas.length }, () => value));
      return;
    }
    // for AQI: set to either a mid value or zero
    setAqiValues(Array.from({ length: areas.length }, () => value ? 50.0 : 0.0));
  };

  const toggleCell = (row: RowId, col: number) => {
    if (row === 'lighting') {
      setLighting((l) => l.map((v, i) => (i === col ? !v : v)));
    }
  };

  const parameterOptions = [
    'Coil_ID','Coil_Grade','Coil_Width','Coil_Thick.','Coil_Input_Weight','Coil_Start_Time','Coil_End_Time','Coil_Total_Time','Mill_Speed','Production_Rate','Mill_Run_Hrs_Day','Mill_Run_Hrs_Month','Mill-Utilization','R.Coolant_Temp','R.Coolant_Tank_Current_Level','R.Coolant_Tank_Set_Level','R.Coolant_Tank_pH','R.Coolant_Concentration_Current Value','R.Coolant_Concentration_Set Value','Oil_Addition_volume','Water_Addition_Volume','R.Coolant_Tramp_Oil','R.Coolant_ESI_Value','R.Coolant_Saphonification_Value (SAP)','R.Coolant_Conductivity','R.Coolant_Flow','R.Coolant_Pressure','R.Coolan_Pump#1_Status','R.Coolan_Pump#1_Run_Hrs','R.Coolan_Pump#1_Load','R.Coolan_Pump#2_Status','R.Coolan_Pump#2_Run_Hrs','R.Coolan_Pump#2_Load','Agitator#1_Status','Agitator#1_Run_Hrs','Agitator#1_Load','Agitator#2_Status','Agitator#2_Run_Hrs','Agitator#2_Load','Magnetic_Separator_Status','Magnetic_Separator_Run_Hrs','Magnetic_Separator_Load','Skimmer_Status','Skimmer_Run_Hrs','Skimmer_Load','DM_Water_pH','DM_Water_Temp','DM_Water_Conductivity','DM_Water_Volume_Day','Coolant_Oil_Temp'
  ];

  // Remove non-numeric / metadata fields from the Y-axis dropdown
  const removedParams = new Set(['Coil_ID', 'Coil_Grade', 'Coil_Start_Time', 'Coil_End_Time', 'Coil_Width', 'Coil_Thick.', 'Coil_Input_Weight']);

  // Exact units mapping derived from provided parameter sheet (fallbacks below)
  const exactUnits: Record<string, string> = {
    'coil_total_time': 'hh/mm/ss',
    'mill_speed': 'mpm',
    'production_rate': 'Tons/Hr',
    'mill_run_hrs_day': 'hh/mm/ss',
    'mill_run_hrs_month': 'hh/mm/ss',
    'mill-utilization': '%',
    'r.coolant_temp': '°C',
    'r.coolant_tank_current_level': 'kL',
    'r.coolant_tank_set_level': 'kL',
    'r.coolant_tank_ph': '',
    'r.coolant_concentration_current value': '%',
    'r.coolant_concentration_set value': '%',
    'oil_addition_volume': 'L',
    'water_addition_volume': 'L',
    'r.coolant_tramp_oil': '%',
    'r.coolant_esi_value': '',
    'r.coolant_saphonification_value (sap)': '%',
    'r.coolant_conductivity': 'μS/cm',
    'r.coolant_flow': 'm3/min',
    'r.coolant_pressure': 'kG/cm2',
    'r.coolan_pump#1_status': 'On/Off',
    'r.coolan_pump#1_run_hrs': 'hh/mm/ss',
    'r.coolan_pump#1_load': '%',
    'r.coolan_pump#2_status': 'On/Off',
    'r.coolan_pump#2_run_hrs': 'hh/mm/ss',
    'r.coolan_pump#2_load': '%',
    'agitator#1_status': 'On/Off',
    'agitator#1_run_hrs': 'hh/mm/ss',
    'agitator#1_load': '%',
    'magnetic_separator_status': 'On/Off',
    'magnetic_separator_run_hrs': 'hh/mm/ss',
    'magnetic_separator_load': '%',
    'skimmer_status': 'On/Off',
    'skimmer_run_hrs': 'hh/mm/ss',
    'skimmer_load': '%',
    'dm_water_ph': '',
    'dm_water_temp': '°C',
    'dm_water_conductivity': 'μS/cm',
    'dm_water_volume_day': 'litres',
    'coolant_oil_temp': '°C',
    'coolant_oil_volume_day': 'litres',
    'dot_level': 'litres',
    'hp_hyd_tank_oil_temp': '°C',
    'hp_hyd_tank_oil_cleanliness': 'μm',
    'hp_hyd_tank_water_saturation': '%',
    'hp_system-pressure': 'kG/cm2',
    'oil_cellar_temp': '°C',
    'oil_cellar_humidity': '%',
    'oil_cellar_light_intensity_area#1': 'Lumens/m2',
    'oil_cellar_light_intensity_area#2': 'Lumens/m2',
    'oil_cellar_light_intensity_area#3': 'Lumens/m2',
    'oil_cellar_light_intensity_area#4': 'Lumens/m2',
    'oil_cellar_light_intensity_area#5': 'Lumens/m2',
    'oil_cellar_person_entered': 'Nos',
    'oil_cellar_person_w/o_ppe': 'Nos'
  };

  const paramUnit = (p: string, r?: Range) => {
    const key = p.toLowerCase().replace(/\s+/g, ' ').replace(/\./g, '.');
    const normalized = key.replace(/_/g, ' ');
    const exactKey = p.toLowerCase();
    let base = '';
    if (exactUnits[exactKey]) base = exactUnits[exactKey];
    else if (exactUnits[normalized]) base = exactUnits[normalized];

    // fallback heuristics
    if (!base) {
      if (key.includes('temp')) base = '°C';
      else if (key.includes('ph')) base = '';
      else if (key.includes('conductivity')) base = 'μS/cm';
      else if (key.includes('pressure')) base = 'kG/cm2';
      else if (key.includes('flow')) base = 'm3/min';
      else if (key.includes('level')) base = '%';
      else if (key.includes('concentration')) base = '%';
      else if (key.includes('volume') || key.includes('addition') || key.includes('water')) base = 'L';
      else if (key.includes('run_hrs') || key.includes('run hrs') || key.includes('runhrs') || key.includes('run')) base = 'hh/mm/ss';
      else if (key.includes('speed')) base = 'mpm';
      else if (key.includes('production')) base = 'Tons/Hr';
      else if (key.includes('load')) base = '%';
      else if (key.includes('esi')) base = '';
      else if (key.includes('saphonification') || key.includes('saponification') || key.includes('sap')) base = '%';
      else base = '';
    }

    // adjust base unit by range when relevant
    if (r) {
      const lower = base.toLowerCase();
      if (lower === 'l' || lower === 'litres') {
        if (r === 'weekly') return 'L/week';
        if (r === 'monthly') return 'L/month';
        if (r === 'yearly') return 'L/year';
      }
      if (lower === 'hh/mm/ss' || lower === 'hrs') {
        if (r === 'weekly') return 'hrs/week';
        if (r === 'monthly') return 'hrs/month';
        if (r === 'yearly') return 'hrs/year';
      }
      if (lower === 'nos') {
        if (r === 'weekly') return 'Nos/week';
        if (r === 'monthly') return 'Nos/month';
        if (r === 'yearly') return 'Nos/year';
      }
      // for percentage, temperature, rates, and others, keep base unchanged
    }

    return base;
  };

  const paramLabel = (p: string, r?: Range) => {
    const cleaned = p.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    const unit = paramUnit(p, r);
    return unit ? `${cleaned} (${unit})` : cleaned;
  };

  type Range = 'weekly' | 'monthly' | 'yearly';
  const [selectedParam, setSelectedParam] = React.useState<string>('Production_Rate');
  const [range, setRange] = React.useState<Range>('weekly');

  const seeded = (seed: number) => {
    return function mulberry32(a: number) {
      return () => {
        a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }(seed);
  };

  const strHash = (s: string) => Array.from(s).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0);

  const getRangeForParam = (param: string): { min: number; max: number; decimals?: number } => {
    const p = param.toLowerCase();
    if (p.includes('status')) return { min: 0, max: 1 };
    if (p.includes('ph')) return { min: 6, max: 9, decimals: 2 };
    if (p.includes('temp')) return { min: 15, max: 80, decimals: 1 };
    if (p.includes('pressure')) return { min: 0, max: 10, decimals: 2 };
    if (p.includes('flow')) return { min: 0, max: 120, decimals: 1 };
    if (p.includes('conductivity')) return { min: 0, max: 2000 };
    if (p.includes('concentration')) return { min: 0, max: 20, decimals: 2 };
    if (p.includes('level')) return { min: 0, max: 100, decimals: 1 };
    if (p.includes('load')) return { min: 0, max: 100, decimals: 0 };
    if (p.includes('run_hrs')) return { min: 0, max: 24, decimals: 1 };
    if (p.includes('oil') || p.includes('water') || p.includes('volume')) return { min: 0, max: 1000 };
    if (p.includes('speed') || p.includes('utilization') || p.includes('production')) return { min: 0, max: 100 };
    return { min: 0, max: 100 };
  };

  const buildXAxis = (r: Range) => {
    if (r === 'weekly') {
      const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
      return Array.from({ length: 7 }, (_, i) => format(addDays(monday, i), 'EEE'));
    }
    if (r === 'monthly') {
      const start = startOfMonth(new Date());
      const days = getDaysInMonth(start);
      return Array.from({ length: days }, (_, i) => format(addDays(start, i), 'd MMM'));
    }
    const year = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => format(new Date(year, i, 1), 'MMM'));
  };

  const data = React.useMemo(() => {
    const labels = buildXAxis(range);
    const rng = seeded(strHash(selectedParam + range));
    const { min, max, decimals } = getRangeForParam(selectedParam);
    return labels.map((label) => {
      const value = min + rng() * (max - min);
      const rounded = decimals !== undefined ? parseFloat(value.toFixed(decimals)) : Math.round(value);
      return { label, value };
    });
  }, [selectedParam, range]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DataCard title="Oil Cellar Matrix" className="overflow-x-auto" variant="primary">
          <div className="mb-3">
            <div className="text-sm text-muted-foreground">Toggle cells to mark availability/status for each area.</div>
          </div>

          <Table className="rounded-lg overflow-hidden">
            <TableCaption className="pt-4 text-xs text-muted-foreground">Interactive table — switches represent the "xxx" marks.</TableCaption>
            <TableHeader>
              <TableRow className="bg-card/60 hover:bg-card/60">
                <TableHead className="w-12 sticky left-0 bg-card z-10 text-center px-2">SN</TableHead>
                <TableHead className="min-w-[180px] sticky left-12 bg-card z-10 text-center px-2">Description</TableHead>
                {areas.map((a) => (
                  <TableHead key={a} className="text-center px-2">{a}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rIdx) => (
                <TableRow key={row.id} className="hover:bg-accent/40">
                  <TableCell className="font-mono text-xs sticky left-0 bg-background/70 backdrop-blur z-10 text-center px-2">{rIdx + 1}</TableCell>
                  <TableCell className="font-medium sticky left-12 bg-background/70 backdrop-blur z-10 text-center px-2">{row.label}</TableCell>
                  {areas.map((_, cIdx) => (
                    <TableCell key={`${row.id}-${cIdx}`} className="text-center px-2">
                      {row.id === 'lighting' ? (
                        <Button 
                          size="sm" 
                          variant={lighting[cIdx] ? 'default' : 'outline'} 
                          className="w-16 pointer-events-none"
                        >
                          {lighting[cIdx] ? 'ON' : 'OFF'}
                        </Button>
                      ) : row.id === 'aqi' ? (
                        <div className="font-mono">{aqiValues[cIdx].toFixed(1)}</div>
                      ) : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataCard>

        <DataCard title="Trends" variant="primary">
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-full">
                <Select value={selectedParam} onValueChange={setSelectedParam}>
                  <SelectTrigger aria-label="Y-axis parameter">
                    <SelectValue placeholder="Select parameter" />
                  </SelectTrigger>
                  <SelectContent>
                    {parameterOptions.filter(p => !removedParams.has(p)).map((opt) => (
                      <SelectItem key={opt} value={opt}>{paramLabel(opt, range)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
              <TabsList className="w-full">
                <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="flex-1">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ChartContainer
            config={{ value: { label: paramLabel(selectedParam, range), color: 'hsl(var(--primary))' } }}
            className="w-full h-[280px]"
          >
            <LineChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} width={40} style={{ fontSize: 11 }} />
              <ChartTooltip cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 1 }} content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ChartContainer>
        </DataCard>
      </div>
    </div>
  );
};