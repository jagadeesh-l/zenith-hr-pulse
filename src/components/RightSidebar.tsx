
import { useState, useEffect, useRef } from "react";
import { UpcomingCard } from "@/components/UpcomingCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

type RightSidebarProps = {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function RightSidebar({ isOpen = false, onToggle }: RightSidebarProps) {
  const [showTrigger, setShowTrigger] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowTrigger(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const birthdays = [
    { name: "Sarah Johnson", date: "Today", type: "birthday" as const },
    { name: "Michael Chen", date: "Tomorrow", type: "birthday" as const },
    { name: "Emma Wilson", date: "May 15", type: "birthday" as const },
  ];

  const anniversaries = [
    { name: "David Brown", date: "Today - 3 years", type: "anniversary" as const, details: "Software Engineer" },
    { name: "Lisa Taylor", date: "May 18 - 5 years", type: "anniversary" as const, details: "HR Manager" },
  ];

  const events = [
    { name: "Team Building", date: "May 20", type: "event" as const, details: "Central Park, 2:00 PM" },
    { name: "Quarterly Review", date: "May 25", type: "event" as const },
    { name: "New Product Launch", date: "June 1", type: "event" as const },
  ];

  return (
    <>
      {/* Sidebar trigger button - only show when closed and scrolled */}
      {showTrigger && !isOpen && (
        <button
          className="hr-sidebar-trigger"
          onClick={onToggle}
          aria-label="Open sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
    
      {/* Sidebar content */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 right-0 z-40 h-full w-72 bg-background border-l border-border transform transition-transform duration-300 ease-in-out pt-16 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
          <button 
            className="p-1 bg-background border border-border rounded-full shadow-md"
            onClick={onToggle}
            aria-label="Close sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="h-full overflow-y-auto p-4 pb-20 space-y-6">
          <UpcomingCard title="Birthdays" events={birthdays} />
          <UpcomingCard title="Work Anniversaries" events={anniversaries} />
          <UpcomingCard title="Upcoming Events" events={events} />
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-border">
            <h3 className="font-medium mb-3">New Team Members</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-hr-secondary text-white flex items-center justify-center">
                  AJ
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Alex Johnson</p>
                  <p className="text-xs text-muted-foreground">Developer - Started today</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-hr-secondary text-white flex items-center justify-center">
                  MP
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Maria Perez</p>
                  <p className="text-xs text-muted-foreground">Designer - Started yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}
