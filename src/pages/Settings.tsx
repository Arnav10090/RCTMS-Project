import React, { useState } from 'react';
import { DataCard } from '@/components/DataCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PARAMETER_NAMES = [
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

interface ParameterData {
  name: string;
  minValue: number;
  maxValue: number;
}

// Initial default values suitable for the mock
const INITIAL_PARAMETERS: ParameterData[] = PARAMETER_NAMES.map(name => ({
  name,
  minValue: 0,
  maxValue: 100
}));

export const Settings = () => {
  // Load from local storage or use defaults
  const loadSavedParameters = () => {
    const saved = localStorage.getItem('rctms_settings_parameters');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved settings", e);
        return JSON.parse(JSON.stringify(INITIAL_PARAMETERS));
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_PARAMETERS));
  };

  // Current state of parameters in the UI
  const [parameters, setParameters] = useState<ParameterData[]>(loadSavedParameters);

  // "Saved" state to compare against
  const [savedParameters, setSavedParameters] = useState<ParameterData[]>(loadSavedParameters);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{ name: string, field: 'Min' | 'Max', oldVal: number, newVal: number }[]>([]);

  const handleParamChange = (index: number, field: 'minValue' | 'maxValue', value: string) => {
    const newParams = [...parameters];
    newParams[index] = { ...newParams[index], [field]: parseFloat(value) || 0 };
    setParameters(newParams);
  };

  const handleSaveChanges = () => {
    const changes: { name: string, field: 'Min' | 'Max', oldVal: number, newVal: number }[] = [];

    parameters.forEach((param, index) => {
      const savedParam = savedParameters[index];
      if (param.minValue !== savedParam.minValue) {
        changes.push({
          name: param.name,
          field: 'Min',
          oldVal: savedParam.minValue,
          newVal: param.minValue
        });
      }
      if (param.maxValue !== savedParam.maxValue) {
        changes.push({
          name: param.name,
          field: 'Max',
          oldVal: savedParam.maxValue,
          newVal: param.maxValue
        });
      }
    });

    if (changes.length > 0) {
      setPendingChanges(changes);
      setIsDialogOpen(true);
    }
  };

  const confirmSave = () => {
    // Commit the changes
    const newSaved = JSON.parse(JSON.stringify(parameters));
    setSavedParameters(newSaved);
    localStorage.setItem('rctms_settings_parameters', JSON.stringify(newSaved));
    setIsDialogOpen(false);
    setPendingChanges([]);
  };

  return (
    <div className="space-y-6">
      <DataCard title="Parameter Configuration" className="overflow-hidden max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
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
                    <TableCell className="font-medium text-xs py-1.5">{param.name}</TableCell>
                    <TableCell className="py-1.5">
                      <Input
                        type="number"
                        value={param.minValue}
                        onChange={(e) => handleParamChange(index, 'minValue', e.target.value)}
                        className="h-7 w-24 text-xs"
                      />
                    </TableCell>
                    <TableCell className="py-1.5">
                      <Input
                        type="number"
                        value={param.maxValue}
                        onChange={(e) => handleParamChange(index, 'maxValue', e.target.value)}
                        className="h-7 w-24 text-xs"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>
      </DataCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Please review the following changes before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Parameter</TableHead>
                  <TableHead className="text-xs">Field</TableHead>
                  <TableHead className="text-xs text-right">Old</TableHead>
                  <TableHead className="text-xs text-right">New</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingChanges.map((change, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-medium">{change.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{change.field}</TableCell>
                    <TableCell className="text-xs text-right text-red-500">{change.oldVal}</TableCell>
                    <TableCell className="text-xs text-right text-green-500 font-bold">{change.newVal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmSave}>Confirm & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
