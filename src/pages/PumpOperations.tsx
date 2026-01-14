import React, { useState } from 'react';
import { DataCard } from '@/components/DataCard';
import { StatusIndicator } from '@/components/StatusIndicator';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import {
  Play,
  Square,
  Settings,
  RotateCcw,
  Clock,
  TrendingUp,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X
} from 'lucide-react';

interface Equipment {
  id: string;
  serialNumber: string;
  description: string;
  operationStatus: 'idle' | 'start' | 'stop';
  mode: 'auto' | 'manual';
  currentHours: number;
  monthlyHours: number;
  cumulativeHours: number;
  monthlyUtilization: number;
  cumulativeUtilization: number;
  group: string;
  monthlyStarts: number;
  monthlyStops: number;
}

export const PumpOperations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'idle' | 'start' | 'stop'>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'auto' | 'manual'>('all');
  const [groupFilter, setGroupFilter] = useState<'all' | 'coolant' | 'main-hydraulic' | 'aux-hydraulic' | 'lubrication'>('all');

  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 'RCP001',
      serialNumber: 'RCP-2024-001',
      description: 'Roll Coolant Pump#1',
      operationStatus: 'start',
      mode: 'auto',
      monthlyHours: 542.3,
      cumulativeHours: 12847.5,
      monthlyUtilization: 87.2,
      cumulativeUtilization: 92.1,
      group: 'coolant',
      currentHours: 0,
      monthlyStarts: 12,
      monthlyStops: 10
    },
    {
      id: 'RCP002',
      serialNumber: 'RCP-2024-002',
      description: 'Roll Coolant Pump#2',
      operationStatus: 'idle',
      mode: 'auto',
      monthlyHours: 156.7,
      cumulativeHours: 8934.2,
      monthlyUtilization: 25.2,
      cumulativeUtilization: 78.4,
      group: 'coolant',
      currentHours: 0,
      monthlyStarts: 12,
      monthlyStops: 10
    },
    {
      id: 'RCA001',
      serialNumber: 'RCA-CT-001',
      description: 'Roll Coolant Agitator (CT)',
      operationStatus: 'start',
      mode: 'auto',
      monthlyHours: 523.1,
      cumulativeHours: 15623.8,
      monthlyUtilization: 84.1,
      cumulativeUtilization: 89.7,
      group: 'coolant',
      currentHours: 0,
      monthlyStarts: 12,
      monthlyStops: 10
    },
    {
      id: 'RCA002',
      serialNumber: 'RCA-DT-001',
      description: 'Roll Coolant Agitator (DT)',
      operationStatus: 'start',
      mode: 'manual',
      monthlyHours: 487.9,
      cumulativeHours: 13456.3,
      monthlyUtilization: 78.5,
      cumulativeUtilization: 86.2,
      group: 'coolant',
      currentHours: 0,
      monthlyStarts: 12,
      monthlyStops: 10
    },
    {
      id: 'RCA003',
      serialNumber: 'RCA-OT-001',
      description: 'Roll Coolant Agitator (OT)',
      operationStatus: 'idle',
      mode: 'auto',
      monthlyHours: 234.6,
      cumulativeHours: 9876.4,
      monthlyUtilization: 37.7,
      cumulativeUtilization: 71.3,
      group: 'coolant',
      currentHours: 0,
      monthlyStarts: 12,
      monthlyStops: 10
    },
    {
      id: 'MS001',
      serialNumber: 'MS-2024-001',
      description: 'Magnetic Separator',
      operationStatus: 'start',
      mode: 'auto',
      monthlyHours: 598.7,
      cumulativeHours: 18234.9,
      monthlyUtilization: 96.3,
      cumulativeUtilization: 94.8,
      group: 'coolant',
      currentHours: 0,
      monthlyStarts: 12,
      monthlyStops: 10
    },
    {
      id: 'MH001',
      serialNumber: 'MH-PRI-001',
      description: 'Main Hyd #1',
      operationStatus: 'start',
      mode: 'auto',
      monthlyHours: 612.4,
      cumulativeHours: 16789.2,
      monthlyUtilization: 98.5,
      cumulativeUtilization: 91.3,
      group: 'main-hydraulic',
      currentHours: 0,
      monthlyStarts: 14,
      monthlyStops: 11
    },
    {
      id: 'MH002',
      serialNumber: 'MH-SEC-001',
      description: 'Main Hyd#2',
      operationStatus: 'idle',
      mode: 'auto',
      monthlyHours: 45.3,
      cumulativeHours: 7234.1,
      monthlyUtilization: 7.3,
      cumulativeUtilization: 68.7,
      group: 'main-hydraulic',
      currentHours: 0,
      monthlyStarts: 14,
      monthlyStops: 11
    },
    {
      id: 'MHC001',
      serialNumber: 'MHC-001',
      description: 'Main Hyd. Cooling Pump',
      operationStatus: 'start',
      mode: 'auto',
      monthlyHours: 589.2,
      cumulativeHours: 15234.7,
      monthlyUtilization: 94.8,
      cumulativeUtilization: 88.9,
      group: 'main-hydraulic',
      currentHours: 0,
      monthlyStarts: 14,
      monthlyStops: 11
    },
    {
      id: 'AH001',
      serialNumber: 'AH-001',
      description: 'Aux. Hyd Pump#1',
      operationStatus: 'start',
      mode: 'auto',
      monthlyHours: 456.8,
      cumulativeHours: 11987.3,
      monthlyUtilization: 73.5,
      cumulativeUtilization: 83.2,
      group: 'aux-hydraulic',
      currentHours: 0,
      monthlyStarts: 8,
      monthlyStops: 7
    },
    {
      id: 'AH002',
      serialNumber: 'AH-002',
      description: 'Aux. Hyd Pump#2',
      operationStatus: 'idle',
      mode: 'auto',
      monthlyHours: 123.4,
      cumulativeHours: 6789.5,
      monthlyUtilization: 19.9,
      cumulativeUtilization: 65.4,
      group: 'aux-hydraulic',
      currentHours: 0,
      monthlyStarts: 8,
      monthlyStops: 7
    },
    {
      id: 'AH003',
      serialNumber: 'AH-003',
      description: 'Aux. Hyd Pump#3',
      operationStatus: 'stop',
      mode: 'manual',
      monthlyHours: 0,
      cumulativeHours: 4523.2,
      monthlyUtilization: 0,
      cumulativeUtilization: 52.1,
      group: 'aux-hydraulic',
      currentHours: 0,
      monthlyStarts: 8,
      monthlyStops: 7
    },
    {
      id: 'AHC001',
      serialNumber: 'AHC-001',
      description: 'Aux Hyd. Cooling Pump',
      operationStatus: 'start',
      mode: 'auto',
      monthlyHours: 434.7,
      cumulativeHours: 10234.8,
      monthlyUtilization: 69.9,
      cumulativeUtilization: 79.6,
      group: 'aux-hydraulic',
      currentHours: 0,
      monthlyStarts: 8,
      monthlyStops: 7
    },
    {
      id: 'GL001',
      serialNumber: 'GL-001',
      description: 'Gear Lubn Pump#1',
      operationStatus: 'start',
      mode: 'auto',
      monthlyHours: 578.3,
      cumulativeHours: 14567.9,
      monthlyUtilization: 93.0,
      cumulativeUtilization: 90.4,
      group: 'lubrication',
      currentHours: 0,
      monthlyStarts: 10,
      monthlyStops: 9
    },
    {
      id: 'GL002',
      serialNumber: 'GL-002',
      description: 'Gear Lubn Pump#2',
      operationStatus: 'idle',
      mode: 'auto',
      monthlyHours: 67.2,
      cumulativeHours: 5432.1,
      monthlyUtilization: 10.8,
      cumulativeUtilization: 61.8,
      group: 'lubrication',
      currentHours: 0,
      monthlyStarts: 10,
      monthlyStops: 9
    }
  ]);

  // Apply filters
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.operationStatus === statusFilter;
    const matchesMode = modeFilter === 'all' || item.mode === modeFilter;
    const matchesGroup = groupFilter === 'all' || item.group === groupFilter;
    
    return matchesSearch && matchesStatus && matchesMode && matchesGroup;
  });

  // Calculate pagination based on filtered data
  const totalPages = Math.max(1, Math.ceil(filteredEquipment.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEquipment = filteredEquipment.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredEquipment, itemsPerPage, currentPage, totalPages]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setModeFilter('all');
    setGroupFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || modeFilter !== 'all' || groupFilter !== 'all';

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'start': return 'active';
      case 'stop': return 'danger';
      case 'idle': return 'warning';
      default: return 'idle';
    }
  };

  const getGroupSummary = (group: string) => {
    const groupEquipment = equipment.filter(e => e.group === group);
    const running = groupEquipment.filter(e => e.operationStatus === 'start').length;
    const total = groupEquipment.length;
    const avgUtilization = groupEquipment.reduce((sum, e) => sum + e.monthlyUtilization, 0) / total;

    return { running, total, avgUtilization };
  };

  // ----- Simulation Logic -----
  // Cycle: 15s START enabled -> 5s STOP enabled (pause) -> Repeat (reset current)
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    let cycleTimer: NodeJS.Timeout;

    const runCycle = () => {
      // PHASE 1: START (15s)
      
      // Reset Current Hours at start of Start Cycle
      setEquipment(prev => prev.map(e => ({ 
        ...e, 
        currentHours: 0,
        // Set all non-idle pumps to 'start' (Green Button)
        operationStatus: e.operationStatus === 'idle' ? 'idle' : 'start',
        // Increment Start Count for active pumps
        monthlyStarts: e.operationStatus === 'idle' ? e.monthlyStarts : e.monthlyStarts + 1
      })));

      const startTime = Date.now();
      
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed < 15000) {
          // Increment Logic
          setEquipment(prev => prev.map(e => {
            if (e.operationStatus === 'start') {
              const increment = 0.1;
              return {
                ...e,
                currentHours: e.currentHours + increment,
                monthlyHours: e.monthlyHours + increment,
                cumulativeHours: e.cumulativeHours + increment
              };
            }
            return e;
          }));
        } else {
           // Phase 1 End handled by timeout below
        }
      }, 100);
    };

    // Cycle Orchestration
    const startCycle = () => {
      runCycle(); // Start 15s phase
      
      // Schedule Stop Phase after 15s
      cycleTimer = setTimeout(() => {
        clearInterval(interval); 
        // PHASE 2: STOP (5s)
        // Set all non-idle pumps to 'stop' (Red Button)
        setEquipment(prev => prev.map(e => ({
          ...e,
          operationStatus: e.operationStatus === 'idle' ? 'idle' : 'stop',
          // Increment Stop Count for active pumps
          monthlyStops: e.operationStatus === 'idle' ? e.monthlyStops : e.monthlyStops + 1
        })));
        
        // Schedule next Start Phase after 5s (Total 20s cycle)
        cycleTimer = setTimeout(() => {
          startCycle(); // Loop
        }, 5000);
      }, 15000);
    };



    startCycle();

    return () => {
      clearInterval(interval);
      clearTimeout(cycleTimer);
    };
  }, []); // Run once on mount

  return (
    <div className="space-y-6">
      {/* Equipment Operations Table */}
      <DataCard title="Equipment Operating Status" className="overflow-x-auto">
        {/* Filter Controls */}
        <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-gray-600">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Filters</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 text-xs ml-auto"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Search</label>
              <input
                type="text"
                placeholder="Search description or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange();
                }}
                className="w-full px-3 py-1.5 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Group Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Group</label>
              <Select value={groupFilter} onValueChange={(v) => { setGroupFilter(v as any); handleFilterChange(); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="coolant">Coolant</SelectItem>
                  <SelectItem value="main-hydraulic">Main Hydraulic</SelectItem>
                  <SelectItem value="aux-hydraulic">Aux Hydraulic</SelectItem>
                  <SelectItem value="lubrication">Lubrication</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); handleFilterChange(); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="start">Start</SelectItem>
                  <SelectItem value="stop">Stop</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode Filter */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Mode</label>
              <Select value={modeFilter} onValueChange={(v) => { setModeFilter(v as any); handleFilterChange(); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-2 text-xs text-muted-foreground">
              Showing {filteredEquipment.length} of {equipment.length} entries
            </div>
          )}
        </div>

        <div className="min-w-full">
          <table className="min-w-full table-fixed text-sm reduce-gap text-center">
            <colgroup>
              <col style={{ width: '9.09%' }} />
              <col style={{ width: '9.09%' }} />
              <col style={{ width: '9.09%' }} />
              <col style={{ width: '9.09%' }} />
              <col style={{ width: '9.09%' }} />
              <col style={{ width: '9.09%' }} />
              <col style={{ width: '9.09%' }} />
              <col style={{ width: '9.09%' }} />
              <col style={{ width: '9.09%' }} />
              <col style={{ width: '9.09%' }} />
              <col style={{ width: '9.09%' }} />
            </colgroup>
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th rowSpan={2} className="px-3 py-2 text-center w-12 align-middle">SN</th>
                <th rowSpan={2} className="px-3 py-2 text-center desc-col align-middle">Pump Description</th>
                <th rowSpan={2} className="px-3 py-2 text-center w-56 op-col align-middle">Status Display</th>
                <th rowSpan={2} className="px-3 py-2 text-center w-36 align-middle">Mode</th>
                <th colSpan={3} className="px-3 py-2 text-center align-middle border-l border-gray-600">Running Hrs</th>
                <th colSpan={2} className="px-3 py-2 text-center align-middle border-l border-gray-600">No. of Start/Stops in the month</th>
                <th colSpan={2} className="px-3 py-2 text-center align-middle border-l border-gray-600">Utilization (%)</th>
              </tr>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="px-3 py-2 text-center w-24 border-l border-gray-600">Current</th>
                <th className="px-3 py-2 text-center w-24">Month</th>
                <th className="px-3 py-2 text-center w-24">Cum</th>
                <th className="px-3 py-2 text-center w-24 border-l border-gray-600">Start</th>
                <th className="px-3 py-2 text-center w-24">Stop</th>
                <th className="px-3 py-2 text-center w-24 border-l border-gray-600">Month</th>
                <th className="px-3 py-2 text-center w-24">Cum</th>
              </tr>
            </thead>
            <tbody>
              {currentEquipment.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-muted-foreground">
                    No equipment found matching the current filters.
                  </td>
                </tr>
              ) : (
                currentEquipment.map((item, idx) => {
                  const actualIndex = equipment.findIndex(e => e.id === item.id);
                  const displayIndex = filteredEquipment.findIndex(e => e.id === item.id);
                  return (
                    <tr key={item.id} className="border-b border-gray-600 hover:bg-muted/20">
                      <td className="px-3 py-3 font-mono">{(displayIndex + 1).toString().padStart(2, '0')}</td>
                    <td className="px-3 py-3 desc-col">{item.description}</td>

                    <td className="px-3 py-3 align-middle">
                      <div className="flex items-center justify-center gap-3 btn-group">
                        <div className={`px-3 py-1.5 rounded text-sm font-medium text-black ${[0, 2, 4].includes(idx) ? 'bg-green-400' : 'bg-yellow-200'}`}>
                          I/L
                        </div>

                        <button
                          className={`px-4 py-3 rounded text-white text-sm font-semibold min-w-[80px] min-h-[32px]
                            ${item.operationStatus === 'start' ? 'bg-green-600' : 
                              item.operationStatus === 'stop' ? 'bg-red-600' : 'bg-yellow-500'}`}
                          style={{ pointerEvents: 'none' }}
                          tabIndex={-1}
                        >
                          {item.operationStatus === 'idle' ? 'IDLE' : item.operationStatus.toUpperCase()}
                        </button>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <button
                          className={`px-3 py-1.5 text-xs rounded font-medium min-w-[60px] ${item.mode === 'auto' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}
                          style={{ pointerEvents: 'none' }}
                          tabIndex={-1}
                        >
                          {item.mode.toUpperCase()}
                        </button>
                      </div>
                    </td>
                    
                    <td className="px-3 py-3 font-mono border-l border-gray-600 font-semibold text-blue-600 dark:text-blue-400">
                      {item.currentHours.toFixed(1)}
                    </td>
                    <td className="px-3 py-3 font-mono">{item.monthlyHours.toFixed(1)}</td>
                    <td className="px-3 py-3 font-mono">{item.cumulativeHours.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                    <td className="px-3 py-3 font-mono border-l border-gray-600">{item.monthlyStarts}</td>
                    <td className="px-3 py-3 font-mono">{item.monthlyStops}</td>
                    <td className="px-3 py-3 font-mono border-l border-gray-600">{item.monthlyUtilization.toFixed(1)}</td>
                    <td className="px-3 py-3 font-mono">{item.cumulativeUtilization.toFixed(1)}</td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 px-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({filteredEquipment.length} total)
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      </DataCard>
    </div>
  );
};

export default PumpOperations;