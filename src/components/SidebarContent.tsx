
import { 
  Calendar, 
  Users, 
  FileText, 
  UserPlus, 
  BarChart2, 
  Layout, 
  ClipboardCheck, 
  DollarSign, 
  BookOpen, 
  Award, 
  TrendingUp, 
  HelpCircle,
  Star,
  Folders,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

type ModuleButtonProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  to?: string;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const ModuleButton = ({ icon, label, active, to, onClick, isCollapsed }: ModuleButtonProps) => {
  const content = (
    <>
      <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
        {icon}
      </div>
      <span className={cn(
        "transition-all duration-300 ease-in-out text-sm font-medium whitespace-nowrap",
        isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto ml-3"
      )}>
        {label}
      </span>
    </>
  );

  const buttonClass = cn(
    "relative w-full flex items-center transition-all duration-300 ease-in-out",
    "hover:bg-accent/80 hover:text-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-primary/50",
    "group border-0 bg-transparent shadow-none",
    isCollapsed ? "justify-center px-3 py-3" : "justify-start px-4 py-3",
    active ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
  );

  return to ? (
    <Button
      variant="ghost"
      asChild
      className={buttonClass}
      title={isCollapsed ? label : undefined}
    >
      <Link to={to} className="no-underline">
        {content}
      </Link>
    </Button>
  ) : (
    <Button
      variant="ghost"
      onClick={onClick}
      className={buttonClass}
      title={isCollapsed ? label : undefined}
    >
      {content}
    </Button>
  );
};

type SidebarContentProps = {
  activeModule?: string;
  onModuleChange?: (module: string) => void;
}

export function SidebarContent({ activeModule, onModuleChange }: SidebarContentProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const handleModuleClick = (moduleName: string) => {
    if (onModuleChange) {
      onModuleChange(moduleName);
    }
  };

  const modules = [
    { name: 'Dashboard', icon: <Layout size={20} />, to: '/dashboard' },
    { name: 'Directory', icon: <Users size={20} />, to: '/directory' },
    { name: 'Leave', icon: <Calendar size={20} />, to: '/leave' },
    { name: 'Recruitment', icon: <UserPlus size={20} />, to: '/recruitment' },
    { name: 'Performance', icon: <BarChart2 size={20} />, to: '/performance' },
    { name: 'Analytics', icon: <TrendingUp size={20} /> },
    { name: 'Engagement', icon: <Star size={20} />, to: '/engagement' },
    { name: 'Organization', icon: <Layout size={20} /> },
    { name: 'Resource Hub', icon: <Folders size={20} />, to: '/resource-hub' },
    { name: 'Reporting', icon: <FileText size={20} /> },
    { name: 'Compensation', icon: <DollarSign size={20} /> },
    { name: 'Learning', icon: <BookOpen size={20} /> },
    { name: 'Helpdesk', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div 
      className={cn(
        "relative h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center transition-all duration-300 ease-in-out border-b border-sidebar-border",
        isCollapsed ? "justify-center px-3 py-4" : "justify-between px-4 py-4"
      )}>
        {!isCollapsed && (
          <h2 className="font-semibold text-lg text-sidebar-foreground transition-all duration-300">
            HR Modules
          </h2>
        )}
        
        {/* Collapse Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full border border-sidebar-border bg-sidebar shadow-sm",
            "hover:bg-sidebar-accent hover:border-sidebar-accent-foreground/20",
            "transition-all duration-300 ease-in-out"
          )}
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-hidden py-2">
        <div className={cn(
          "space-y-1 transition-all duration-300 ease-in-out",
          isCollapsed ? "px-2" : "px-3"
        )}>
          {modules.map((module) => (
            <ModuleButton 
              key={module.name}
              icon={module.icon}
              label={module.name}
              active={activeModule === module.name}
              to={module.to}
              onClick={() => handleModuleClick(module.name)}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t border-sidebar-border transition-all duration-300 ease-in-out",
        isCollapsed ? "px-2 py-3" : "px-4 py-3"
      )}>
        {!isCollapsed && (
          <p className="text-xs text-sidebar-foreground/60 text-center transition-all duration-300">
            HR Portal v2.0
          </p>
        )}
      </div>
    </div>
  );
}
