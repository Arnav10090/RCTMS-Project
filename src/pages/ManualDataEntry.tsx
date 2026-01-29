import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search, X, FileText, FileSpreadsheet, Save } from 'lucide-react';
import { useDataContext } from '@/context/DataContext';
import { ConfirmChangesModal } from '@/components/ConfirmChangesModal';
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

// Editable cell component
interface EditableCellProps {
  value: string;
  onChange: (newValue: string) => void;
  isNumeric?: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, onChange, isNumeric = false }) => (
  <input
    type={isNumeric ? 'number' : 'text'}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-2 py-1 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
    step={isNumeric ? 'any' : undefined}
  />
);

interface ChangeRecord {
  rowId: number;
  field: string;
  oldValue: string;
  newValue: string;
}

// Individual Table Component
type TableSectionProps = {
  title: string;
  data: any[];
  originalData: any[];
  onDataChange: (rowId: number, field: string, value: string) => void;
  onSave: (changes: ChangeRecord[]) => void;
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
  originalData,
  onDataChange,
  onSave,
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
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [pendingChanges, setPendingChanges] = React.useState<ChangeRecord[]>([]);

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

  const handleSaveChanges = () => {
    const changes: ChangeRecord[] = [];
    
    data.forEach(currentRow => {
      const originalRow = originalData.find(r => r.id === currentRow.id);
      if (originalRow) {
        Object.keys(currentRow).forEach(key => {
          if (key !== 'id' && currentRow[key] !== originalRow[key]) {
            changes.push({
              rowId: currentRow.id,
              field: key,
              oldValue: originalRow[key],
              newValue: currentRow[key]
            });
          }
        });
      }
    });

    if (changes.length > 0) {
      setPendingChanges(changes);
      setShowConfirm(true);
    }
  };

  const handleConfirmSave = () => {
    onSave(pendingChanges);
    setShowConfirm(false);
    setPendingChanges([]);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    
    const tableBody = filtered.map((row, idx) => {
      if (getRowData) {
        return getRowData(row, idx, 0);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = row;
      return Object.values(rest);
    });

    autoTable(doc, {
      head: [headers],
      body: tableBody,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74] }
    });

    doc.save(`${title.replace(/\s+/g, '_')}_${toISODate(new Date())}.pdf`);
  };

  const handleExportExcel = () => {
    const rows = filtered.map((row, idx) => {
      if (getRowData) {
        return getRowData(row, idx, 0);
      }
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
    <>
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
                pager.slice.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {renderRow(item, idx, (pager.page - 1) * pager.size)}
                  </React.Fragment>
                ))
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

        {/* Save Button */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end">
          <Button
            onClick={handleSaveChanges}
            className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <ConfirmChangesModal
        isOpen={showConfirm}
        changes={pendingChanges}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
        tableTitle={title}
      />
    </>
  );
};

type CoolantRow = any;
type OilCellarRow = any;
type PumpRow = any;
type HpPumpRow = any;

export const ManualDataEntry = () => {
  const { coolant, cellar, pumps, hp, setCoolant, setCellar, setPumps, setHp } = useDataContext();
  const [localCoolant, setLocalCoolant] = React.useState(coolant);
  const [localCellar, setLocalCellar] = React.useState(cellar);
  const [localPumps, setLocalPumps] = React.useState(pumps);
  const [localHp, setLocalHp] = React.useState(hp);
  const [selectedTable, setSelectedTable] = React.useState<TableKey>('coolant');

  React.useEffect(() => {
    setLocalCoolant(coolant);
    setLocalCellar(cellar);
    setLocalPumps(pumps);
    setLocalHp(hp);
  }, [coolant, cellar, pumps, hp]);

  const handleCoolantChange = (rowId: number, field: string, value: string) => {
    setLocalCoolant(prev => 
      prev.map(row => row.id === rowId ? { ...row, [field]: value } : row)
    );
  };

  const handleCellarChange = (rowId: number, field: string, value: string) => {
    setLocalCellar(prev => 
      prev.map(row => row.id === rowId ? { ...row, [field]: value } : row)
    );
  };

  const handlePumpsChange = (rowId: number, field: string, value: string) => {
    setLocalPumps(prev => 
      prev.map(row => row.id === rowId ? { ...row, [field]: value } : row)
    );
  };

  const handleHpChange = (rowId: number, field: string, value: string) => {
    setLocalHp(prev => 
      prev.map(row => row.id === rowId ? { ...row, [field]: value } : row)
    );
  };

  const handleSaveCoolant = () => {
    setCoolant(localCoolant);
  };

  const handleSaveCellar = () => {
    setCellar(localCellar);
  };

  const handleSavePumps = () => {
    setPumps(localPumps);
  };

  const handleSaveHp = () => {
    setHp(localHp);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="bg-card border border-border rounded-lg shadow-sm px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Manual Data Entry</h1>
            <p className="text-sm text-muted-foreground">Select a data entry table to display and edit.</p>
          </div>
          <Select value={selectedTable} onValueChange={(value) => setSelectedTable(value as TableKey)}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select table" />
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
            data={localCoolant}
            originalData={coolant}
            onDataChange={handleCoolantChange}
            onSave={handleSaveCoolant}
            headers={['SN', 'Date', 'Oil Conc. %', 'Conductivity μS/cm', 'pH', 'Temp Deg.C', 'ESI', 'Tramp %', 'Saponification Value (mmKOH/GM)', 'Tank Lvl kL']}
            getRowData={(r: CoolantRow, idx) => [idx + 1, r.date, r.oilConc, r.conductivity, r.pH, r.tempC, r.esi, r.tramp, r.saponification, r.tankLvl]}
            renderRow={(r: CoolantRow, idx, start) => (
              <tr key={r.id} className="hover:bg-muted/50 border-b border-gray-600">
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{start + idx + 1}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-mono border-r border-gray-600">{r.date}</td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.oilConc} onChange={(val) => handleCoolantChange(r.id, 'oilConc', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.conductivity} onChange={(val) => handleCoolantChange(r.id, 'conductivity', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.pH} onChange={(val) => handleCoolantChange(r.id, 'pH', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.tempC} onChange={(val) => handleCoolantChange(r.id, 'tempC', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.esi} onChange={(val) => handleCoolantChange(r.id, 'esi', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.tramp} onChange={(val) => handleCoolantChange(r.id, 'tramp', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.saponification} onChange={(val) => handleCoolantChange(r.id, 'saponification', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm">
                  <EditableCell value={r.tankLvl} onChange={(val) => handleCoolantChange(r.id, 'tankLvl', val)} isNumeric />
                </td>
              </tr>
            )}
          />
        )}

        {selectedTable === 'oilCellar' && (
          <TableSection
            title="Oil Cellar Report"
            data={localCellar}
            originalData={cellar}
            onDataChange={handleCellarChange}
            onSave={handleSaveCellar}
            headers={['SN', 'Date', 'Temp Deg.C', 'Humidity %', 'AQI Area#1', 'AQI Area#2', 'AQI Area#3', 'Access Control Status', 'Person Entered', 'No. of persons w/o ppe', 'Welding', 'Cutting', 'Others', 'Area#1', 'Area#2', 'Area#3', 'Area#4', 'Area#5', 'Inspection Status', 'Next Insp. Due']}
            getRowData={(r: OilCellarRow, idx) => [idx + 1, r.date, r.tempC, r.humidity, r.aqiA1, r.aqiA2, r.aqiA3, r.accessControl, r.personsEntered, r.noPpe, r.welding, r.cutting, r.others, r.illumA1, r.illumA2, r.illumA3, r.illumA4, r.illumA5, r.fireStatus, r.fireNextDue]}
            renderRow={(r: OilCellarRow, idx, start) => (
              <tr key={r.id} className="hover:bg-muted/50 border-b border-gray-600">
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{start + idx + 1}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-mono border-r border-gray-600">{r.date}</td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.tempC} onChange={(val) => handleCellarChange(r.id, 'tempC', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.humidity} onChange={(val) => handleCellarChange(r.id, 'humidity', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.aqiA1} onChange={(val) => handleCellarChange(r.id, 'aqiA1', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.aqiA2} onChange={(val) => handleCellarChange(r.id, 'aqiA2', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.aqiA3} onChange={(val) => handleCellarChange(r.id, 'aqiA3', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.accessControl} onChange={(val) => handleCellarChange(r.id, 'accessControl', val)} />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.personsEntered} onChange={(val) => handleCellarChange(r.id, 'personsEntered', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.noPpe} onChange={(val) => handleCellarChange(r.id, 'noPpe', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.welding} onChange={(val) => handleCellarChange(r.id, 'welding', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.cutting} onChange={(val) => handleCellarChange(r.id, 'cutting', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.others} onChange={(val) => handleCellarChange(r.id, 'others', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.illumA1} onChange={(val) => handleCellarChange(r.id, 'illumA1', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.illumA2} onChange={(val) => handleCellarChange(r.id, 'illumA2', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.illumA3} onChange={(val) => handleCellarChange(r.id, 'illumA3', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.illumA4} onChange={(val) => handleCellarChange(r.id, 'illumA4', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.illumA5} onChange={(val) => handleCellarChange(r.id, 'illumA5', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.fireStatus} onChange={(val) => handleCellarChange(r.id, 'fireStatus', val)} />
                </td>
                <td className="px-4 py-3 text-sm">
                  <EditableCell value={r.fireNextDue} onChange={(val) => handleCellarChange(r.id, 'fireNextDue', val)} />
                </td>
              </tr>
            )}
          />
        )}

        {selectedTable === 'rollPumps' && (
          <TableSection
            title="Roll Coolant Pump Status"
            data={localPumps}
            originalData={pumps}
            onDataChange={handlePumpsChange}
            onSave={handleSavePumps}
            headers={['SN', 'Date', 'Pump No', 'Run Hrs', 'Avg. Load', 'Avg Pressure']}
            getRowData={(r: PumpRow, idx) => [idx + 1, r.date, r.pumpNo, r.runHrs, r.avgLoad, r.avgPressure]}
            renderRow={(r: PumpRow, idx, start) => (
              <tr key={r.id} className="hover:bg-muted/50 border-b border-gray-600">
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{start + idx + 1}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-mono border-r border-gray-600">{r.date}</td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.pumpNo} onChange={(val) => handlePumpsChange(r.id, 'pumpNo', val)} />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.runHrs} onChange={(val) => handlePumpsChange(r.id, 'runHrs', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.avgLoad} onChange={(val) => handlePumpsChange(r.id, 'avgLoad', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm">
                  <EditableCell value={r.avgPressure} onChange={(val) => handlePumpsChange(r.id, 'avgPressure', val)} isNumeric />
                </td>
              </tr>
            )}
          />
        )}

        {selectedTable === 'hpPumps' && (
          <TableSection
            title="HP Pump Status"
            data={localHp}
            originalData={hp}
            onDataChange={handleHpChange}
            onSave={handleSaveHp}
            filterOptions={[{ label: 'Main Hydraulic Pump', value: 'Main Hydraulic Pump' }, { label: 'Auxiliary hyd pump', value: 'Auxiliary hyd pump' }, { label: 'Gear lub pump', value: 'Gear lub pump' }]}
            filterKey="pumpType"
            filterLabel="Pump Type"
            headers={['SN', 'Date', 'Pump Type', 'Pump No', 'Run Hrs', 'Avg. Load', 'Avg System Pressure', 'Avg. Tank Level', 'Avg. Oil Temp', 'Oil Cleanliness', 'Water Saturation']}
            getRowData={(r: HpPumpRow, idx) => [idx + 1, r.date, r.pumpType, r.pumpNo, r.runHrs, r.avgLoad, r.avgSystemPressure, r.avgTankLevel, r.avgOilTemp, r.oilCleanliness, r.waterSaturation]}
            renderRow={(r: HpPumpRow, idx, start) => (
              <tr key={r.id} className="hover:bg-muted/50 border-b border-gray-600">
                <td className="px-4 py-3 text-sm text-foreground text-center border-r border-gray-600">{start + idx + 1}</td>
                <td className="px-4 py-3 text-sm text-foreground text-center font-mono border-r border-gray-600">{r.date}</td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.pumpType} onChange={(val) => handleHpChange(r.id, 'pumpType', val)} />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.pumpNo} onChange={(val) => handleHpChange(r.id, 'pumpNo', val)} />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.runHrs} onChange={(val) => handleHpChange(r.id, 'runHrs', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.avgLoad} onChange={(val) => handleHpChange(r.id, 'avgLoad', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.avgSystemPressure} onChange={(val) => handleHpChange(r.id, 'avgSystemPressure', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.avgTankLevel} onChange={(val) => handleHpChange(r.id, 'avgTankLevel', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.avgOilTemp} onChange={(val) => handleHpChange(r.id, 'avgOilTemp', val)} isNumeric />
                </td>
                <td className="px-4 py-3 text-sm border-r border-gray-600">
                  <EditableCell value={r.oilCleanliness} onChange={(val) => handleHpChange(r.id, 'oilCleanliness', val)} />
                </td>
                <td className="px-4 py-3 text-sm">
                  <EditableCell value={r.waterSaturation} onChange={(val) => handleHpChange(r.id, 'waterSaturation', val)} isNumeric />
                </td>
              </tr>
            )}
          />
        )}
      </div>
    </div>
  );
}
