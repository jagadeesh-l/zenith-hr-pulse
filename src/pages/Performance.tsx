import { useState } from "react";
import { Header } from "@/components/Header";
import {
  Sidebar,
  SidebarContent as UISidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { PerformanceOverview } from "@/components/performance/PerformanceOverview";
import { SidebarContent } from "@/components/SidebarContent";

export default function Performance() {
  const [activeModule, setActiveModule] = useState<string>("Performance");

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header />
        
        {/* Main Layout */}
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Left Sidebar */}
          <Sidebar>
            <SidebarHeader>
              <h2 className="font-semibold text-lg">HR Modules</h2>
            </SidebarHeader>
            <UISidebarContent>
              <SidebarContent 
                activeModule={activeModule} 
                onModuleChange={setActiveModule} 
              />
            </UISidebarContent>
          </Sidebar>
          
          {/* Main Content */}
          <main className="flex-1 w-full transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[2000px]">
              {/* Welcome Section */}
              <section className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  Performance
                </h1>
                <p className="text-muted-foreground">Track, analyze, and improve employee performance with powerful AI-driven insights</p>
              </section>
              
              {/* Performance Overview */}
              <PerformanceOverview />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
