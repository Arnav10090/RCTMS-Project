import React from 'react';
import { DataCard } from '@/components/DataCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

const parameters = [
  'R.Coolant_ESI_Value',
  'R.Coolan_Pump#1_Status',
  'R.Coolan_Pump#1_Run_Hrs',
  'R.Coolan_Pump#2_Status',
  'R.Coolan_Pump#2_Run_Hrs',
  'Agitator#1_Status',
  'Agitator#1_Run_Hrs',
  'Agitator#2_Status',
  'Agitator#2_Run_Hrs',
  'Magnetic_Separator_Status',
  'Magnetic_Separator_Run_Hrs',
  'Skimmer_Status',
  'Skimmer_Run_Hrs',
  'DM_Water_pH',
  'DM_Water_Temp',
  'DM_Water_Conductivity',
  'HP_Hyd_Tank_Oil_Level',
  'HP_Hyd_Tank_Oil_Temp',
  'HP_Hyd_Tank_Water_Saturation',
  'HP_System-Pressure',
  'HP_Hyd_Pump#1_Status',
  'HP_Hyd_Pump#1_Run_Hrs',
  'HP_Hyd_Pump#2_Status',
  'HP_Hyd_Pump#2_Run_Hrs'
];

export const Settings = () => {
  return (
    <div className="space-y-6">
      <DataCard title="Parameter Configuration" className="overflow-hidden max-w-2xl mx-auto">
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="h-9 px-4">Parameter</TableHead>
                <TableHead className="w-[150px] h-9 px-4">Min Value</TableHead>
                <TableHead className="w-[150px] h-9 px-4">Max Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameters.map((param, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-xs py-1.5">{param}</TableCell>
                  <TableCell className="py-1.5">
                    <Input 
                      type="number" 
                      defaultValue={0} 
                      className="h-7 w-24 text-xs" 
                    />
                  </TableCell>
                  <TableCell className="py-1.5">
                    <Input 
                      type="number" 
                      defaultValue={100} 
                      className="h-7 w-24 text-xs" 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DataCard>
    </div>
  );
};

export default Settings;
