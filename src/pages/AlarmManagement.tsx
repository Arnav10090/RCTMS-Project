import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  Search,
  CheckSquare,
  Download,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface Alarm {
  id: number;
  level: 'critical' | 'high' | 'medium' | 'low';
  alarmNo: string;
  message: string;
  device: string;
  eventTime: string;
  recoveredTime: string | null;
  acknowledged: boolean;
  operator?: string;
}

const DataCard = ({ title, value, children, className = "", headerActions }: { title?: string; value?: React.ReactNode; children: React.ReactNode; className?: string; headerActions?: React.ReactNode }) => (
  <Card className={`p-6 ${className}`}>
    {title && (
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-3">
          {value}
          {headerActions}
        </div>
      </div>
    )}
    {children}
  </Card>
);

export default function AlarmManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [alarmLevelFilter, setAlarmLevelFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  
  const generateAlarms = (count: number): Alarm[] => {
    const levels: Alarm['level'][] = ['critical', 'high', 'medium', 'low'];
    const devices = ['Main Hyd #1', 'Clean Tank', 'Oil Tank', 'RCP001', 'MS001', 'AH002', 'GL001', 'P001', 'Filter-01', 'HX-02'];
    return Array.from({ length: count }, (_, i) => {
      const level = levels[i % levels.length];
      const alarmNo = `${level.substring(0,3).toUpperCase()}-${(100+i).toString().padStart(3,'0')}`;
      const message = `${level.toUpperCase()} - Simulated alarm message #${i+1}`;
      const device = devices[i % devices.length];
      const eventTime = new Date(Date.now() - i * 3600 * 1000).toISOString().replace('T',' ').slice(0,19);
      const recoveredTime = i % 5 === 0 ? new Date(Date.now() - (i-1) * 3600 * 1000).toISOString().replace('T',' ').slice(0,19) : null;
      const acknowledged = i % 4 === 0;
      const operator = acknowledged ? `Operator${(i%6)+1}` : undefined;
      return {
        id: i+1,
        level,
        alarmNo,
        message,
        device,
        eventTime,
        recoveredTime,
        acknowledged,
        operator
      } as Alarm;
    });
  };

  const [alarms, setAlarms] = useState<Alarm[]>(() => generateAlarms(50));

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-danger bg-danger/10 border-danger';
      case 'high': return 'text-warning bg-warning/10 border-warning';
      case 'medium': return 'text-primary bg-primary/10 border-primary';
      case 'low': return 'text-muted-foreground bg-muted/10 border-border';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusIcon = (alarm: Alarm) => {
    if (!alarm.acknowledged && !alarm.recoveredTime) {
      return <AlertTriangle className="h-4 w-4 text-danger animate-pulse" />;
    }
    if (alarm.acknowledged && !alarm.recoveredTime) {
      return <CheckSquare className="h-4 w-4 text-warning" />;
    }
    if (alarm.recoveredTime) {
      return <CheckSquare className="h-4 w-4 text-success" />;
    }
    return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  };

  const filteredAlarms = alarms.filter(alarm => {
    const matchesSearch = alarm.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alarm.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alarm.alarmNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = (filterLevel === 'all' ||
                         (filterLevel === 'active' && !alarm.recoveredTime) ||
                         (filterLevel === 'inactive' && !!alarm.recoveredTime) ||
                         (filterLevel === 'acknowledged' && alarm.acknowledged))
                         && (alarmLevelFilter === 'all' || alarm.level === alarmLevelFilter);

    return matchesSearch && matchesFilter;
  });

  const handleCloseAlarm = React.useCallback((id: number) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  }, []);

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.max(1, Math.ceil(filteredAlarms.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAlarms = filteredAlarms.slice(startIndex, startIndex + pageSize);
  
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredAlarms, pageSize, currentPage, totalPages]);

  const alarmStats = {
    total: alarms.length,
    active: alarms.filter(a => !a.recoveredTime).length,
    critical: alarms.filter(a => a.level === 'critical' && !a.recoveredTime).length,
    unacknowledged: alarms.filter(a => !a.acknowledged && !a.recoveredTime).length
  };

  const hasActiveFilters = searchTerm.trim() !== '' || filterLevel !== 'all' || alarmLevelFilter !== 'all';
  const resetFilters = () => {
    setSearchTerm('');
    setFilterLevel('all');
    setAlarmLevelFilter('all');
  };

  const toCsv = (rows: (string | number | null | undefined)[][]) =>
    rows
      .map(r =>
        r
          .map(v => {
            const s = v == null ? '' : String(v);
            return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
          })
          .join(',')
      )
      .join('\n');

  const handleExport = () => {
    const headers = ['No.', 'Level', 'Alarm No.', 'Message', 'Device', 'Event Time', 'Recovered Time', 'Acknowledged'];
    const rows = filteredAlarms.map((a, i) => [
      i + 1,
      a.level.toUpperCase(),
      a.alarmNo,
      a.message,
      a.device,
      a.eventTime,
      a.recoveredTime || '',
      a.acknowledged ? 'Yes' : 'No',
    ]);
    const csv = toCsv([headers, ...rows]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alarms_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2 p-3 min-h-screen">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DataCard title="Total Alarms" value={<div className="text-3xl font-bold text-blue-600">{alarmStats.total}</div>}>
          <div></div>
        </DataCard>
        <DataCard title="Active Alarms" value={<div className="text-3xl font-bold text-orange-600">{alarmStats.active}</div>}>
          <div></div>
        </DataCard>
        <DataCard title="Critical Active" value={<div className="text-3xl font-bold text-red-600">{alarmStats.critical}</div>}>
          <div></div>
        </DataCard>
        <DataCard title="Unacknowledged" value={<div className="text-3xl font-bold text-red-600">{alarmStats.unacknowledged}</div>}>
          <div></div>
        </DataCard>
      </div>

      {/* Filters */}
      <DataCard 
        title="Filters" 
        headerActions={
          <>
            <span className="text-sm text-muted-foreground">
              Showing {filteredAlarms.length} of {alarms.length} alarms
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search alarms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Recovered</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
              </SelectContent>
            </Select>

            {/* Alarm Level Filter */}
            <Select value={alarmLevelFilter} onValueChange={(v) => setAlarmLevelFilter(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </DataCard>

      {/* Alarm Table */}
      <DataCard title="Alarms & Alerts" className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-11 pb-3 mb-4 border-b border-gray-600 text-xs font-semibold text-muted-foreground">
            <div className="col-span-1 border-r border-gray-600 pl-2">NO.</div>
            <div className="col-span-3 border-r border-gray-600 pl-2">ALARM LEVEL & NO. & MESSAGE</div>
            <div className="col-span-2 border-r border-gray-600 pl-2">DEVICE</div>
            <div className="col-span-2 border-r border-gray-600 pl-2">EVENT TIME</div>
            <div className="col-span-2 border-r border-gray-600 pl-2">RECOVERED TIME</div>
            <div className="col-span-1 text-right pr-2">ACTIONS</div>
          </div>

          {paginatedAlarms.map((alarm, idx) => (
            <div
              key={alarm.id}
              className="grid grid-cols-11 py-3 border-b border-gray-600 text-sm transition-colors hover:bg-muted/10 items-center"
            >
              <div className="col-span-1 font-mono text-muted-foreground border-r border-gray-600 pl-2 h-full flex items-center">
                {(startIndex + idx + 1).toString().padStart(2, '0')}
              </div>

              <div className="col-span-3 border-r border-gray-600 pl-2 pr-2 h-full flex items-center">
                <div className="space-y-1 w-full">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getLevelColor(alarm.level)}`}>
                      {alarm.level.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{alarm.alarmNo}</span>
                    {getStatusIcon(alarm)}
                  </div>
                  <div className="text-sm font-medium text-foreground truncate">{alarm.message}</div>
                </div>
              </div>

              <div className="col-span-2 font-mono text-muted-foreground border-r border-gray-600 pl-2 h-full flex items-center">
                {alarm.device}
              </div>

              <div className="col-span-2 font-mono text-xs text-muted-foreground border-r border-gray-600 pl-2 h-full flex items-center">
                {alarm.eventTime}
              </div>

              <div className="col-span-2 font-mono text-xs text-muted-foreground border-r border-gray-600 pl-2 h-full flex items-center">
                {alarm.recoveredTime || (
                  <span className="text-muted-foreground">Not recovered</span>
                )}
              </div>

              <div className="col-span-1 flex items-start justify-end pr-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCloseAlarm(alarm.id)}
                >
                  Close
                </Button>
              </div>
            </div>
          ))}
        </div>

          {filteredAlarms.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No alarms match the current filter criteria.
          </div>
        )}

        {/* Pagination */}
        {filteredAlarms.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select value={pageSize.toString()} onValueChange={(v) => {
                setPageSize(Number(v));
                setCurrentPage(1);
              }}>
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
                Page {currentPage} of {totalPages} ({filteredAlarms.length} total)
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
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
        )}
      </DataCard>
    </div>
  );
}