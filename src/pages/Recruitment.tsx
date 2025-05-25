import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar, SidebarContent as UISidebarContent, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import { RecruitmentOverview } from "@/components/recruitment/RecruitmentOverview";
import { RecruitmentDetailPanel } from "@/components/recruitment/RecruitmentDetailPanel";
import { SidebarContent } from "@/components/SidebarContent";

export default function Recruitment() {
  const [activeModule, setActiveModule] = useState<string>("Recruitment");
  const [activeSection, setActiveSection] = useState<string>("job-requisition");
  
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
          <main className="flex-1 transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[2000px]">
              {/* Welcome Section */}
              <section className="mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white mr-3">
                    <span className="text-lg font-bold">R</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-1">RecruitAI</h1>
                    <p className="text-muted-foreground">AI-powered recruitment platform</p>
                  </div>
                </div>
              </section>
              
              {/* Overview Cards */}
              <RecruitmentOverview onSectionChange={setActiveSection} />
              
              {/* Detail Panel */}
              <RecruitmentDetailPanel activeSection={activeSection} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
