
import { useState } from "react";
import { Header } from "@/components/Header";
import { SidebarContent } from "@/components/SidebarContent";
import { PayHistorySection } from "@/components/compensation/PayHistorySection";
import { PayslipArchiveSection } from "@/components/compensation/PayslipArchiveSection";
import { ReimbursementsSection } from "@/components/compensation/ReimbursementsSection";
import { TicketingSection } from "@/components/compensation/TicketingSection";

export default function Compensation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex w-full">
      <div className="hidden md:block">
        <SidebarContent activeModule="Compensation" />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Compensation
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your salary, payslips, and reimbursements
              </p>
            </div>

            <div className="space-y-8">
              <PayHistorySection />
              <PayslipArchiveSection />
              <ReimbursementsSection />
              <TicketingSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
