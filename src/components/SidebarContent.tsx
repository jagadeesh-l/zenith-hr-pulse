
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div className="flex items-center justify-center w-6 h-6 flex-shrink-0 transition-colors duration-200">
        {icon}
      </div>
      <span className={cn(
        "transition-all duration-300 ease-in-out text-sm font-medium whitespace-nowrap",
        isCollapsed ? "opacity-0 w-0 overflow-hidden ml-0" : "opacity-100 w-auto ml-3"
      )}>
        {label}
      </span>
    </>
  );

  const buttonClass = cn(
    "relative w-full flex items-center transition-all duration-200 ease-in-out group",
    "hover:bg-teal-50 dark:hover:bg-teal-900/20 focus-visible:ring-2 focus-visible:ring-teal-500/50",
    "border-0 bg-transparent shadow-none rounded-lg",
    isCollapsed ? "justify-center px-3 py-3 h-12" : "justify-start px-4 py-3 h-12",
    active 
      ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400" 
      : "text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
  );

  const buttonElement = to ? (
    <Button
      variant="ghost"
      asChild
      className={buttonClass}
    >
      <Link to={to} className="no-underline">
        {content}
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full animate-scale-in" />
        )}
      </Link>
    </Button>
  ) : (
    <Button
      variant="ghost"
      onClick={onClick}
      className={buttonClass}
    >
      {content}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full animate-scale-in" />
      )}
    </Button>
  );

  return isCollapsed ? (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {buttonElement}
        </TooltipTrigger>
        <TooltipContent side="right" className="animate-fade-in">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    buttonElement
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
    { name: 'Dashboard', icon: <Layout size={24} />, to: '/dashboard' },
    { name: 'Directory', icon: <Users size={24} />, to: '/directory' },
    { name: 'Leave', icon: <Calendar size={24} />, to: '/leave' },
    { name: 'Recruitment', icon: <UserPlus size={24} />, to: '/recruitment' },
    { name: 'Performance', icon: <BarChart2 size={24} />, to: '/performance' },
    { name: 'Analytics', icon: <TrendingUp size={24} /> },
    { name: 'Engagement', icon: <Star size={24} />, to: '/engagement' },
    { name: 'Organization', icon: <Layout size={24} /> },
    { name: 'Resource Hub', icon: <Folders size={24} />, to: '/resource-hub' },
    { name: 'Compensation', icon: <DollarSign size={24} />, to: '/compensation' },
    { name: 'Reporting', icon: <FileText size={24} /> },
    { name: 'Learning', icon: <BookOpen size={24} /> },
    { name: 'Helpdesk', icon: <HelpCircle size={24} /> },
  ];

  return (
    <div 
      className={cn(
        "relative h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out shadow-sm",
        isCollapsed ? "w-18" : "w-60"
      )}
    >
      {/* Header with persistent HR Portal title */}
      <div className={cn(
        "flex items-center transition-all duration-300 ease-in-out border-b border-slate-200 dark:border-slate-700 h-16 bg-white dark:bg-slate-900",
        isCollapsed ? "justify-center px-3" : "justify-between px-6"
      )}>
        <div className={cn(
          "flex items-center transition-all duration-300 ease-in-out",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">HR</span>
          </div>
          {!isCollapsed && (
            <h2 className="ml-3 font-bold text-xl text-teal-600 dark:text-teal-400 transition-all duration-300 animate-fade-in">
              HR Portal
            </h2>
          )}
        </div>
        
        {/* Collapse Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm",
            "hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-teal-200 dark:hover:border-teal-700",
            "transition-all duration-300 ease-in-out",
            isCollapsed && "absolute -right-4 top-4 z-10"
          )}
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-300 transition-transform duration-300" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300 transition-transform duration-300" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-hidden py-4">
        <div className={cn(
          "space-y-1 transition-all duration-300 ease-in-out",
          isCollapsed ? "px-2" : "px-4"
        )}>
          {modules.map((module, index) => (
            <div
              key={module.name}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ModuleButton 
                icon={module.icon}
                label={module.name}
                active={activeModule === module.name}
                to={module.to}
                onClick={() => handleModuleClick(module.name)}
                isCollapsed={isCollapsed}
              />
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out bg-slate-50 dark:bg-slate-800/50",
        isCollapsed ? "px-2 py-3" : "px-4 py-3"
      )}>
        {!isCollapsed && (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center transition-all duration-300 animate-fade-in">
            HR Portal v2.0
          </p>
        )}
      </div>
    </div>
  );
}
