
import { useState } from "react";
import { Header } from "@/components/Header";
import { SidebarContent } from "@/components/SidebarContent";
import { RightSidebar } from "@/components/RightSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, MessageSquare, Star, ListOrdered, Clock, Award } from "lucide-react";
import { GameSection } from "@/components/engagement/GameSection";
import { SurveySection } from "@/components/engagement/SurveySection";
import { CodeChallengeSection } from "@/components/engagement/CodeChallengeSection";

export default function Engagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("games");
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleRightSidebar = () => setRightSidebarOpen(!rightSidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onMenuToggle={toggleSidebar} />
      
      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-20 w-64 bg-background border-r border-border transform transition-transform duration-300 ease-in-out pt-16 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}>
          <SidebarContent 
            activeModule="Engagement"
          />
        </aside>
        
        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-10 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          rightSidebarOpen ? 'lg:mr-72' : ''
        }`}>
          <div className="container px-4 py-6">
            {/* Welcome Section */}
            <section className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Engagement</h1>
              <p className="text-muted-foreground">Boost team morale and productivity through interactive activities.</p>
            </section>
            
            {/* Tabs */}
            <Tabs defaultValue="games" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8 bg-muted/50">
                <TabsTrigger value="games" className="flex items-center gap-2">
                  <Award size={16} />
                  <span>Games</span>
                </TabsTrigger>
                <TabsTrigger value="surveys" className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span>Survey Creation</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <ListOrdered size={16} />
                  <span>Code Challenge</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="games" className="animate-fade-in">
                <GameSection />
              </TabsContent>
              
              <TabsContent value="surveys" className="animate-fade-in">
                <SurveySection />
              </TabsContent>
              
              <TabsContent value="code" className="animate-fade-in">
                <CodeChallengeSection />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        {/* Right Sidebar */}
        <RightSidebar isOpen={rightSidebarOpen} onToggle={toggleRightSidebar} />
      </div>
      
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="bg-gradient-hr-primary w-12 h-12 rounded-full shadow-lg hover:shadow-primary/20">
          <MessageSquare className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
