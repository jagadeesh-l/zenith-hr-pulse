
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Directory from "./pages/Directory";
import Engagement from "./pages/Engagement";
import Leave from "./pages/Leave";
import Recruitment from "./pages/Recruitment";
import Performance from "./pages/Performance";
import ResourceHub from "./pages/ResourceHub";
import Compensation from "./pages/Compensation";
import FeatureFlags from "./pages/FeatureFlags";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/engagement" element={<Engagement />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/resource-hub" element={<ResourceHub />} />
          <Route path="/compensation" element={<Compensation />} />
          <Route path="/feature-flags" element={<FeatureFlags />} />
          <Route path="/index" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
