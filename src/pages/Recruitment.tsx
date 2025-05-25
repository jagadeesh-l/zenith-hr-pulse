
import { useState } from "react";
import { Header } from "@/components/Header";
import { SidebarContent } from "@/components/SidebarContent";
import { RecruitmentOverview } from "@/components/recruitment/RecruitmentOverview";
import { RecruitmentDetailPanel } from "@/components/recruitment/RecruitmentDetailPanel";

export default function Recruitment() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<string>("Recruitment");
  const [activeSection, setActiveSection] = useState<string>("job-requisition");
  
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
          <div className="container px-4 py-6">
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
            
            <RecruitmentOverview onSectionChange={setActiveSection} />
            <RecruitmentDetailPanel activeSection={activeSection} />
          </div>
        </main>
      </div>
    </div>
  );
}
