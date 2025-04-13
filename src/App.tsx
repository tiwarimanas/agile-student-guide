
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/Layout/MainLayout";
import DashboardView from "./components/Dashboard/DashboardView";
import TimetableGenerator from "./components/Timetable/TimetableGenerator";
import TaskManager from "./components/Tasks/TaskManager";
import ProgressTracker from "./components/Progress/ProgressTracker";
import { AuthProvider } from "./contexts/AuthContext";
import { StudyProvider } from "./contexts/StudyContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StudyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<DashboardView />} />
                <Route path="timetable" element={<TimetableGenerator />} />
                <Route path="tasks" element={<TaskManager />} />
                <Route path="progress" element={<ProgressTracker />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </StudyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
