import { useState } from "react";
import { Header } from "@/components/Header";
import {
  Sidebar,
  SidebarContent as UISidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { LeaveOverview } from "@/components/leave/LeaveOverview";
import { LeaveCalendar } from "@/components/leave/LeaveCalendar";
import { LeaveApproval } from "@/components/leave/LeaveApproval";
import { LeaveHistory } from "@/components/leave/LeaveHistory";
import { LeaveAnalytics } from "@/components/leave/LeaveAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveApplicationForm } from "@/components/leave/LeaveApplicationForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SidebarContent } from "@/components/SidebarContent";

export default function Leave() {
  const [activeModule, setActiveModule] = useState<string>("Leave");
  const [activeTab, setActiveTab] = useState("overview");
  const [showApplyForm, setShowApplyForm] = useState(false);

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
          <main className="flex-1">
            <div className="container px-4 py-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold">Leave Management</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage and track your time off easily
                  </p>
                </div>
                {!showApplyForm && (
                  <Button
                    onClick={() => setShowApplyForm(true)}
                    className="bg-gradient-hr-primary"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Apply for Leave
                  </Button>
                )}
              </div>

              {showApplyForm ? (
                <div className="mb-6">
                  <LeaveApplicationForm onCancel={() => setShowApplyForm(false)} />
                </div>
              ) : (
                <Tabs
                  defaultValue="overview"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-4"
                >
                  <TabsList className="grid grid-cols-5 w-full max-w-3xl">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="approval">Approvals</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <LeaveOverview />
                  </TabsContent>

                  <TabsContent value="calendar" className="space-y-4">
                    <LeaveCalendar />
                  </TabsContent>

                  <TabsContent value="approval" className="space-y-4">
                    <LeaveApproval />
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <LeaveHistory />
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-4">
                    <LeaveAnalytics />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
