
import { useState } from "react";
import { Header } from "@/components/Header";
import { SidebarContent } from "@/components/SidebarContent";
import { PerformanceOverview } from "@/components/performance/PerformanceOverview";

export default function Performance() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<string>("Performance");
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="min-h-screen bg-background flex w-full">
      <div className="hidden md:block">
        <SidebarContent 
          activeModule={activeModule} 
          onModuleChange={setActiveModule} 
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container px-6 py-8">
            <section className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Performance
              </h1>
              <p className="text-muted-foreground">Track, analyze, and improve employee performance with powerful AI-driven insights</p>
            </section>
            
            <PerformanceOverview />
          </div>
        </main>
      </div>
    </div>
  );
}
