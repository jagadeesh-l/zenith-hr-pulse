
import { 
  Calendar, 
  Users, 
  FileText, 
  UserPlus, 
  Share2, 
  BarChart2, 
  Layout, 
  MessageSquare, 
  ClipboardCheck, 
  DollarSign, 
  BookOpen, 
  Award, 
  TrendingUp, 
  HelpCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type ModuleButtonProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  to?: string;
  onClick?: () => void;
}

const ModuleButton = ({ icon, label, active, to, onClick }: ModuleButtonProps) => {
  const content = (
    <>
      {icon}
      <span>{label}</span>
    </>
  );

  return to ? (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "w-full justify-start gap-3 mb-1 px-4",
        active ? "bg-accent" : "hover:bg-accent/50"
      )}
    >
      <Link to={to}>{content}</Link>
    </Button>
  ) : (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "w-full justify-start gap-3 mb-1 px-4",
        active ? "bg-accent" : "hover:bg-accent/50"
      )}
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
  const handleModuleClick = (moduleName: string) => {
    if (onModuleChange) {
      onModuleChange(moduleName);
    }
  };

  const modules = [
    { name: 'Dashboard', icon: <Layout size={20} />, to: '/dashboard' },
    { name: 'Directory', icon: <Users size={20} />, to: '/directory' },
    { name: 'Leave', icon: <Calendar size={20} /> },
    { name: 'Recruitment', icon: <UserPlus size={20} /> },
    { name: 'Referrals', icon: <Share2 size={20} /> },
    { name: 'Performance', icon: <BarChart2 size={20} /> },
    { name: 'Analytics', icon: <TrendingUp size={20} /> },
    { name: 'Organization', icon: <Layout size={20} /> },
    { name: 'Assistant', icon: <MessageSquare size={20} /> },
    { name: 'Reporting', icon: <FileText size={20} /> },
    { name: 'Compensation', icon: <DollarSign size={20} /> },
    { name: 'Learning', icon: <BookOpen size={20} /> },
    { name: 'Engagement', icon: <Award size={20} /> },
    { name: 'Helpdesk', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className="py-4 h-full flex flex-col">
      <div className="px-4 mb-4">
        <h2 className="font-semibold text-lg text-center">HR Modules</h2>
      </div>
      
      <div className="flex-1 overflow-auto px-2">
        {modules.map((module) => (
          <ModuleButton 
            key={module.name}
            icon={module.icon}
            label={module.name}
            active={activeModule === module.name}
            to={module.to}
            onClick={() => handleModuleClick(module.name)}
          />
        ))}
      </div>
    </div>
  );
}
