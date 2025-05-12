
import { useState } from "react";
import { Header } from "@/components/Header";
import { SidebarContent } from "@/components/SidebarContent";
import { RightSidebar } from "@/components/RightSidebar";
import { FeedCard } from "@/components/FeedCard";
import { ModuleCard } from "@/components/ModuleCard";
import { EmployeeCard } from "@/components/EmployeeCard";
import { 
  Users, 
  Calendar, 
  UserPlus, 
  Share2, 
  BarChart2,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState<string | undefined>(undefined);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleRightSidebar = () => setRightSidebarOpen(!rightSidebarOpen);
  
  const feedItems = [
    {
      author: "HR AI Assistant",
      timestamp: "Just now",
      content: "Good morning! 👋 Today's focus: 3 pending approvals for PTO requests. Employee engagement is up 12% this week - great job team!",
      likes: 5,
      comments: 2,
      authorPhoto: "https://images.unsplash.com/photo-1536548665027-b96d34a005ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      author: "System",
      timestamp: "2 hours ago",
      content: "New company policy update: Remote work guidelines have been updated. Please review the changes by end of day.",
      likes: 12,
      comments: 8
    },
    {
      author: "Sarah Johnson",
      timestamp: "Yesterday",
      content: "I'm excited to announce that our team exceeded Q1 goals by 15%! Great work everyone! 🎉",
      likes: 24,
      comments: 5
    }
  ];
  
  const employees = [
    { id: "1", name: "Alex Johnson", position: "Developer", department: "Engineering", photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
    { id: "2", name: "Emma Wilson", position: "Designer", department: "Product", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
    { id: "3", name: "Michael Chen", position: "Manager", department: "Operations", photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
    { id: "4", name: "Sarah Brown", position: "HR Specialist", department: "HR", photoUrl: "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
    { id: "5", name: "David Kim", position: "Senior Developer", department: "Engineering", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
  ];
  
  const modules = [
    { 
      title: "Directory", 
      description: "Access employee information and profiles", 
      icon: <Users size={32} />, 
      color: "bg-gradient-hr-primary" 
    },
    { 
      title: "Leave", 
      description: "Manage time off and attendance", 
      icon: <Calendar size={32} />, 
      color: "bg-gradient-hr-secondary" 
    },
    { 
      title: "Recruitment", 
      description: "Track candidates and job postings", 
      icon: <UserPlus size={32} />, 
      color: "bg-gradient-hr-primary" 
    },
    { 
      title: "Referrals", 
      description: "Submit and track employee referrals", 
      icon: <Share2 size={32} />, 
      color: "bg-gradient-hr-secondary" 
    },
    { 
      title: "Analytics", 
      description: "View HR metrics and reports", 
      icon: <BarChart2 size={32} />, 
      color: "bg-gradient-hr-primary" 
    },
    { 
      title: "Assistant", 
      description: "Get AI-powered recommendations", 
      icon: <MessageSquare size={32} />, 
      color: "bg-gradient-hr-secondary" 
    }
  ];
  
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
            activeModule={activeModule} 
            onModuleChange={setActiveModule} 
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
              <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-muted-foreground">Here's what's happening in your organization today.</p>
            </section>
            
            {/* Search for Mobile */}
            <div className="mb-6 md:hidden">
              <div className="relative">
                <Input placeholder="Search..." className="w-full pl-9" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Two-Column Layout for Feed and Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Feed */}
              <div className="lg:col-span-2">
                <h2 className="text-lg font-medium mb-4">Activity Feed</h2>
                
                <div className="mb-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-border">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-hr-primary text-white flex items-center justify-center mr-3">
                        J
                      </div>
                      <Input placeholder="Share an update with your team..." className="bg-muted/50" />
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm">Post</Button>
                    </div>
                  </div>
                </div>
                
                {feedItems.map((item, index) => (
                  <FeedCard 
                    key={index}
                    author={item.author}
                    timestamp={item.timestamp}
                    content={item.content}
                    likes={item.likes}
                    comments={item.comments}
                    authorPhoto={item.authorPhoto}
                    className="animation-delay-200"
                  />
                ))}
              </div>
              
              {/* Right Column - Featured Modules and Quick Access */}
              <div>
                <h2 className="text-lg font-medium mb-4">Quick Access</h2>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-border mb-6">
                  <h3 className="font-medium mb-2">Today's Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Employees</p>
                      <p className="text-2xl font-bold">127</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Open Positions</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">On Leave</p>
                      <p className="text-2xl font-bold">7</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Pending Tasks</p>
                      <p className="text-2xl font-bold">4</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-border mb-6">
                  <h3 className="font-medium mb-2">Quick Links</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Request Time Off
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Refer a Candidate
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      View Reports
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modules Section */}
            <section className="my-8">
              <h2 className="text-lg font-medium mb-4">HR Modules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((module, index) => (
                  <ModuleCard
                    key={index}
                    title={module.title}
                    description={module.description}
                    icon={module.icon}
                    color={module.color}
                    className="animation-delay-200"
                  />
                ))}
              </div>
            </section>
            
            {/* Featured Employees Section */}
            <section className="my-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Featured Employees</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {employees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    id={employee.id}
                    name={employee.name}
                    position={employee.position}
                    department={employee.department}
                    photoUrl={employee.photoUrl}
                  />
                ))}
              </div>
            </section>
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
