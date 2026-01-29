import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search, X, FileText, FileSpreadsheet } from 'lucide-react';
import { useDataContext } from '@/context/DataContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type TableKey = 'coolant' | 'oilCellar' | 'rollPumps' | 'hpPumps';

const TABLE_OPTIONS: { value: TableKey; label: string }[] = [
  { value: 'coolant', label: 'Coolant Report' },
  { value: 'oilCellar', label: 'Oil Cellar Report' },
  { value: 'rollPumps', label: 'Roll Coolant Pump Status' },
  { value: 'hpPumps', label: 'HP Pump Status' }
];

// Utilities
function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function withinRange(dateStr: string, from?: string, to?: string) {
  if (!from && !to) return true;
  const t = new Date(dateStr).getTime();
  if (from && t < new Date(from).getTime()) return false;
  if (to && t > new Date(to).getTime()) return false;
  return true;
}

function usePager<T>(items: T[], initialSize = 10) {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(initialSize);
  const pages = Math.max(1, Math.ceil(items.length / size));
  React.useEffect(() => {
    if (page > pages) setPage(1);
  }, [items.length, size, page, pages]);
  const slice = items.slice((page - 1) * size, (page - 1) * size + size);
  return { page, setPage, size, setSize, pages, slice };
}

// 1) Coolant Report
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

// 2) Oil Cellar Report
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

// 3) Roll Coolant Pump Status
type PumpRow = {
  id: number;
  date: string;
  pumpNo: string;
  status: string;
  runHrs: string;
  noOfStarts: string;
  noOfStops: string;
  utilization: string;
  avgLoad: string;
  avgPressure: string;
};

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
      noOfStarts: Math.round(3 + Math.random() * 10).toString(),
      noOfStops: Math.round(2 + Math.random() * 9).toString(),
      utilization: (20 + Math.random() * 80).toFixed(1),
      avgLoad: Math.round(40 + Math.random() * 50).toString(),
      avgPressure: (4 + Math.random() * 4).toFixed(1),
    });
    rows.push({
      id: i * 2 + 2,
      date,
      pumpNo: '#2',
      status: Math.random() > 0.2 ? 'Run' : 'Stand-by',
      runHrs: (2 + Math.random() * 8).toFixed(1),
      noOfStarts: Math.round(3 + Math.random() * 10).toString(),
      noOfStops: Math.round(2 + Math.random() * 9).toString(),
      utilization: (20 + Math.random() * 80).toFixed(1),
      avgLoad: Math.round(40 + Math.random() * 50).toString(),
      avgPressure: (4 + Math.random() * 4).toFixed(1),
    });
  }
  return rows;
}

// 4) HP Pump Status
type HpPumpRow = {
  id: number;
  date: string;
  pumpType: string;
  pumpNo: string;
  status: string;
  runHrs: string;
  noOfStarts: string;
  noOfStops: string;
  utilization: string;
  avgLoad: string;
  avgSystemPressure: string;
  avgTankLevel: string;
  avgOilTemp: string;
  oilCleanliness: string;
  waterSaturation: string;
};

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
      noOfStarts: Math.round(3 + Math.random() * 10).toString(),
      noOfStops: Math.round(2 + Math.random() * 9).toString(),
      utilization: (20 + Math.random() * 80).toFixed(1),
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
      noOfStarts: Math.round(3 + Math.random() * 10).toString(),
      noOfStops: Math.round(2 + Math.random() * 9).toString(),
      utilization: (20 + Math.random() * 80).toFixed(1),
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

// Individual Table Component
type TableSectionProps = {
  title: string;
  data: any[];
  headers: string[];
  renderRow: (item: any, idx: number, startIdx: number) => React.ReactNode;
  renderHeader?: (headers: string[]) => React.ReactNode;
  filterOptions?: { label: string; value: string }[];
  filterKey?: string;
  filterLabel?: string;
  getRowData?: (item: any, idx: number, startIdx: number) => any[];
};

const TableSection = ({
  title,
  data,
  headers,
  renderRow,
  renderHeader,
  filterOptions,
  filterKey,
  filterLabel,
  getRowData
}: TableSectionProps) => {
  const [search, setSearch] = React.useState('');
  const [from, setFrom] = React.useState<string>('');
  const [to, setTo] = React.useState<string>('');
  const [customFilter, setCustomFilter] = React.useState<string>('all');

  const searcher = (row: Record<string, any>) =>
    search.trim() === '' || Object.values(row).some((v) => String(v).toLowerCase().includes(search.toLowerCase()));

  const filtered = data.filter((r) => {
    const dateMatch = withinRange(r.date, from || undefined, to || undefined);
    const searchMatch = searcher(r);
    const filterMatch = !filterKey || !filterOptions || customFilter === 'all' || r[filterKey] === customFilter;
    return dateMatch && searchMatch && filterMatch;
  });
  const pager = usePager(filtered, 10);

  // Reset to first page when filters change
  React.useEffect(() => {
    pager.setPage(1);
  }, [search, from, to, customFilter]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    
    const tableBody = filtered.map((row, idx) => {
      if (getRowData) {
        return getRowData(row, idx, 0);
      }
      // Fallback: exclude id and return values
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = row;
      return Object.values(rest);
    });

    autoTable(doc, {
      head: [headers],
      body: tableBody,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74] } // Green-600ish
    });

    doc.save(`${title.replace(/\s+/g, '_')}_${toISODate(new Date())}.pdf`);
  };

  const handleExportExcel = () => {
    // CSV Export
    const rows = filtered.map((row, idx) => {
      if (getRowData) {
        return getRowData(row, idx, 0);
      }
      // Fallback: exclude id and return values
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = row;
      return Object.values(rest);
    });
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${c}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_${toISODate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-muted/50 border-b border-border">
        <div className="flex flex-wrap items-end gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[240px]">
            <label className="block text-sm font-medium text-muted-foreground mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in all columns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Date From */}
          <div className="w-40">
            <label className="block text-sm font-medium text-muted-foreground mb-1">From Date</label>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          {/* Date To */}
          <div className="w-40">
            <label className="block text-sm font-medium text-muted-foreground mb-1">To Date</label>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          {/* Rows per page */}
          <div className="w-32">
            <label className="block text-sm font-medium text-muted-foreground mb-1">Show</label>
            <Select value={String(pager.size)} onValueChange={(v) => { pager.setSize(Number(v)); pager.setPage(1); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 rows</SelectItem>
                <SelectItem value="10">10 rows</SelectItem>
                <SelectItem value="25">25 rows</SelectItem>
                <SelectItem value="50">50 rows</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Filter (if provided) */}
          {filterOptions && filterKey && filterLabel && (
            <div className="w-48">
              <label className="block text-sm font-medium text-muted-foreground mb-1">{filterLabel}</label>
              <Select value={customFilter} onValueChange={setCustomFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {filterOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-end gap-2 ml-auto">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="gap-2"
              title="Export PDF"
            >
              <FileText className="h-4 w-4 text-red-600" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExcel}
              className="gap-2"
              title="Export Excel"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              Excel
            </Button>
            
            <Button
              variant="outline"
              onClick={() => { setSearch(''); setFrom(''); setTo(''); setCustomFilter('all'); }}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-muted-foreground">
          Showing {filtered.length === 0 ? 0 : (pager.page - 1) * pager.size + 1} to {Math.min(pager.page * pager.size, filtered.length)} of {filtered.length} results
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            {renderHeader ? (
              renderHeader(headers)
            ) : (
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx} className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap border-r border-gray-600 last:border-r-0">
                    {header}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {pager.slice.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-8 text-center text-muted-foreground">
                  No data found
                </td>
              </tr>
            ) : (
              pager.slice.map((item, idx) => renderRow(item, idx, (pager.page - 1) * pager.size))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={String(pager.size)} onValueChange={(v) => { pager.setSize(Number(v)); pager.setPage(1); }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {pager.page} of {pager.pages} ({filtered.length} total)
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pager.setPage(1)}
                disabled={pager.page === 1}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pager.setPage(Math.max(1, pager.page - 1))}
                disabled={pager.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pager.setPage(Math.min(pager.pages, pager.page + 1))}
                disabled={pager.page === pager.pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pager.setPage(pager.pages)}
                disabled={pager.page === pager.pages}
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Reports = () => {
  const { coolant, cellar, pumps, hp } = useDataContext();
  const [selectedTable, setSelectedTable] = React.useState<TableKey>('coolant');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="bg-card border border-border rounded-lg shadow-sm px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">Select a report table to display.</p>
          </div>
          <Select value={selectedTable} onValueChange={(value) => setSelectedTable(value as TableKey)}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select report" />
            </SelectTrigger>
            <SelectContent>
              {TABLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTable === 'coolant' && (
          <TableSection
            title="Coolant Report"
            data={coolant}
            headers={[
              'SN',
              'Date',
              'Oil Conc. %',
              'Conductivity μS/cm',
              'pH',
              'Temp Deg.C',
              'ESI',
              'Tramp %',
              'Saponification Value (mmKOH/GM)',
              'Tank Lvl kL'
            ]}
            getRowData={(r: CoolantRow, idx) => [
              idx + 1,
              r.date,
              r.oilConc,
              r.conductivity,
              r.pH,
              r.tempC,
              r.esi,
              r.tramp,
              r.saponification,
              r.tankLvl
            ]}
            renderRow={(r: CoolantRow, idx, start) => (
              <tr key={r.id} className="hover:bg-muted/50 border-b border-gray-600">
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{start + idx + 1}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-mono border-r border-gray-600">{r.date}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.oilConc}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.conductivity}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.pH}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.tempC}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.esi}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.tramp}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.saponification}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center">{r.tankLvl}</td>
              </tr>
            )}
          />
        )}

        {selectedTable === 'oilCellar' && (
          <TableSection
            title="Oil Cellar Report"
            data={cellar}
            headers={[
              'SN',
              'Date',
              'Temp Deg.C',
              'Humidity %',
              'AQI Area#1',
              'AQI Area#2',
              'AQI Area#3',
              'Access Control Status',
              'Person Entered',
              'No. of persons w/o ppe',
              'Welding',
              'Cutting',
              'Others',
              'Area#1',
              'Area#2',
              'Area#3',
              'Area#4',
              'Area#5',
              'Inspection Status',
              'Next Insp. Due'
            ]}
            getRowData={(r: OilCellarRow, idx) => [
              idx + 1,
              r.date,
              r.tempC,
              r.humidity,
              r.aqiA1,
              r.aqiA2,
              r.aqiA3,
              r.accessControl,
              r.personsEntered,
              r.noPpe,
              r.welding,
              r.cutting,
              r.others,
              r.illumA1,
              r.illumA2,
              r.illumA3,
              r.illumA4,
              r.illumA5,
              r.fireStatus,
              r.fireNextDue
            ]}
            renderHeader={() => {
              const topCellClass = "border border-gray-600 px-3 py-2 text-xs font-semibold text-muted-foreground text-center whitespace-nowrap align-middle";
              const subCellClass = "border border-gray-600 px-3 py-1.5 text-xs font-medium text-muted-foreground text-center whitespace-nowrap";
              return (
                <>
                  <tr>
                    <th rowSpan={2} className={topCellClass}>SN</th>
                    <th className={topCellClass}>Date</th>
                    <th className={topCellClass}>Temp</th>
                    <th className={topCellClass}>Humidity</th>
                    <th colSpan={3} className={topCellClass}>AQI</th>
                    <th rowSpan={2} className={topCellClass}>Access Control Status</th>
                    <th rowSpan={2} className={topCellClass}>Person Entered</th>
                    <th rowSpan={2} className={topCellClass}>No. of persons w/o ppe</th>
                    <th colSpan={3} className={topCellClass}>Unsafe Acts</th>
                    <th colSpan={5} className={topCellClass}>Illumination Level</th>
                    <th colSpan={2} className={topCellClass}>Fire Det. system</th>
                  </tr>
                  <tr>
                    <th className={subCellClass}>dd/mm/yy</th>
                    <th className={subCellClass}>Deg.C</th>
                    <th className={subCellClass}>%</th>
                    <th className={subCellClass}>Area#1</th>
                    <th className={subCellClass}>Area#2</th>
                    <th className={subCellClass}>Area#3</th>
                    <th className={subCellClass}>Welding</th>
                    <th className={subCellClass}>Cutting</th>
                    <th className={subCellClass}>Others</th>
                    <th className={subCellClass}>Area#1</th>
                    <th className={subCellClass}>Area#2</th>
                    <th className={subCellClass}>Area#3</th>
                    <th className={subCellClass}>Area#4</th>
                    <th className={subCellClass}>Area#5</th>
                    <th className={subCellClass}>Inspection Status</th>
                    <th className={subCellClass}>Next Insp. Due</th>
                  </tr>
                </>
              );
            }}
            renderRow={(r: OilCellarRow, idx, start) => (
              <tr key={r.id} className="hover:bg-muted/50 border-b border-gray-600">
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{start + idx + 1}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-mono border-r border-gray-600">{r.date}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.tempC}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.humidity}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.aqiA1}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.aqiA2}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.aqiA3}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.accessControl}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.personsEntered}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.noPpe}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.welding}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.cutting}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.others}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.illumA1}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.illumA2}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.illumA3}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.illumA4}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.illumA5}</td>
                <td className="px-4 py-3 text-sm text-center border-r border-gray-600">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${r.fireStatus === 'OK' ? 'bg-success/20 text-success-foreground' : 'bg-danger/20 text-danger-foreground'}`}>
                    {r.fireStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-mono">{r.fireNextDue}</td>
              </tr>
            )}
          />
        )}

        {selectedTable === 'rollPumps' && (
          <TableSection
            title="Roll Coolant Pump Status"
            data={pumps}
            headers={[
              'SN',
              'Date',
              'Pump No',
              'Run Hrs',
              'Avg. Load',
              'Avg Pressure'
            ]}
            getRowData={(r: PumpRow, idx) => [
              idx + 1,
              r.date,
              r.pumpNo,
              r.runHrs,
              r.avgLoad,
              r.avgPressure
            ]}
            renderRow={(r: PumpRow, idx, start) => (
              <tr key={r.id} className="hover:bg-muted/50 border-b border-gray-600">
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{start + idx + 1}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-mono border-r border-gray-600">{r.date}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-semibold border-r border-gray-600">{r.pumpNo}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.runHrs}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.avgLoad}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center">{r.avgPressure}</td>
              </tr>
            )}
          />
        )}

        {selectedTable === 'hpPumps' && (
          <TableSection
            title="HP Pump Status"
            data={hp}
            filterOptions={[
              { label: 'Main Hydraulic Pump', value: 'Main Hydraulic Pump' },
              { label: 'Auxiliary hyd pump', value: 'Auxiliary hyd pump' },
              { label: 'Gear lub pump', value: 'Gear lub pump' }
            ]}
            filterKey="pumpType"
            filterLabel="Pump Type"
            headers={[
              'SN',
              'Date',
              'Pump Type',
              'Pump No',
              'Run Hrs',
              'Avg. Load',
              'Avg System Pressure',
              'Avg. Tank Level',
              'Avg. Oil Temp',
              'Oil Cleanliness',
              'Water Saturation'
            ]}
            getRowData={(r: HpPumpRow, idx) => [
              idx + 1,
              r.date,
              r.pumpType,
              r.pumpNo,
              r.runHrs,
              r.avgLoad,
              r.avgSystemPressure,
              r.avgTankLevel,
              r.avgOilTemp,
              r.oilCleanliness,
              r.waterSaturation
            ]}
            renderRow={(r: HpPumpRow, idx, start) => (
              <tr key={r.id} className="hover:bg-muted/50 border-b border-gray-600">
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{start + idx + 1}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-mono border-r border-gray-600">{r.date}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.pumpType}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-semibold border-r border-gray-600">{r.pumpNo}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.runHrs}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.avgLoad}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.avgSystemPressure}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.avgTankLevel}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{r.avgOilTemp}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-mono border-r border-gray-600">{r.oilCleanliness}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center">{r.waterSaturation}</td>
              </tr>
            )}
          />
        )}
      </div>
    </div>
  );
}
