import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AlarmProvider } from "./components/AlarmContext";
import { AlarmNotifier } from "./components/AlarmNotifier";
import { AlarmFooter } from "./components/AlarmFooter";
import { DataProvider } from "./context/DataContext";
import { Layout } from "./components/Layout";
import Overview from "./pages/OverviewNew";
import { HydraulicSystem } from "./pages/HydraulicSystem";
import { PumpOperations } from "./pages/PumpOperations";
import { OilCellarMonitor } from "./pages/OilCellarMonitor";
import { ManualDataEntry } from "./pages/ManualDataEntry";
import AlarmManagement from "./pages/AlarmManagement";
import { Reports } from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <AlarmProvider>
          <Toaster />
          <Sonner />
          <AlarmNotifier />
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/overview-new" replace />} />
            <Route path="overview-new" element={<Overview />} />
            <Route path="hydraulic" element={<HydraulicSystem />} />
            <Route path="pumps" element={<PumpOperations />} />
            <Route path="oil-cellar" element={<OilCellarMonitor />} />
            <Route path="manual-data-entry" element={<ManualDataEntry />} />
            <Route path="alarms" element={<AlarmManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
          </BrowserRouter>
          <AlarmFooter />
        </AlarmProvider>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
