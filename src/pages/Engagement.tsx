import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar, SidebarContent as UISidebarContent, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Trophy, Zap } from "lucide-react";
import { GameSection } from "@/components/engagement/GameSection";
import { SurveySection } from "@/components/engagement/SurveySection";
import { CodeChallengeSection } from "@/components/engagement/CodeChallengeSection";
import { SidebarContent } from "@/components/SidebarContent";

export default function Engagement() {
  const [activeModule, setActiveModule] = useState<string>("Engagement");
  
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
                  Employee Engagement
                </h1>
                <p className="text-muted-foreground">Drive employee engagement with interactive activities and recognition</p>
              </section>
              
              {/* Engagement Tabs */}
              <Tabs defaultValue="games" className="w-full">
                <TabsList className="mb-8 flex flex-wrap h-auto">
                  <TabsTrigger value="games" className="h-10">
                    <Trophy className="w-4 h-4 mr-2" />
                    Games & Challenges
                  </TabsTrigger>
                  <TabsTrigger value="challenges" className="h-10">
                    <Zap className="w-4 h-4 mr-2" />
                    Code Challenges
                  </TabsTrigger>
                  <TabsTrigger value="surveys" className="h-10">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Surveys
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="games">
                  <GameSection />
                </TabsContent>
                
                <TabsContent value="challenges">
                  <CodeChallengeSection />
                </TabsContent>
                
                <TabsContent value="surveys">
                  <SurveySection />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
