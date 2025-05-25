import { useState } from "react";
import { 
  FileText, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  BarChart2, 
  Users, 
  ClipboardList,
  Share2
} from "lucide-react";

type OverviewSectionProps = {
  title: string;
  icon: React.ReactNode;
  id: string;
  active: boolean;
  onClick: () => void;
}

const OverviewSection = ({ title, icon, active, onClick }: OverviewSectionProps) => (
  <div 
    className={`group relative overflow-hidden transition-all duration-500 cursor-pointer transform hover:scale-105 ${
      active ? 'scale-105' : ''
    }`}
    onClick={onClick}
  >
    {/* Main Card */}
    <div className="relative h-32 w-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-500">
      
      {/* Base border/background */}
      <div className="absolute inset-0 border border-gray-100 dark:border-gray-700 rounded-2xl"></div>
      
      {/* Hover Gradient - Applied to both hover and active */}
      <div className={`absolute inset-0 bg-gradient-hr-primary ${
        active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      } transition-opacity duration-500`}></div>
      
      {/* Content */}
      <div className="relative z-10 p-4 h-full flex flex-col items-center justify-center text-center">
        {/* Icon - White background in both states */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 mb-3 bg-white text-hr-primary shadow-md`}>
          {icon}
        </div>
        
        {/* Title - Always white when active or hovered */}
        <h3 className={`font-semibold text-sm transition-colors duration-300 ${
          active 
            ? 'text-white' 
            : 'text-gray-800 dark:text-gray-200 group-hover:text-white'
        }`}>
          {title}
        </h3>
      </div>
      
      {/* Active Indicator */}
      {active && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white"></div>
      )}
    </div>
  </div>
);

interface RecruitmentOverviewProps {
  onSectionChange: (section: string) => void;
}

export function RecruitmentOverview({ onSectionChange }: RecruitmentOverviewProps) {
  const [activeSection, setActiveSection] = useState<string>("job-requisition");
  
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    onSectionChange(sectionId);
  };
  
  const sections = [
    { 
      id: "job-requisition", 
      title: "Job Requisition", 
      icon: <ClipboardList size={20} />
    },
    { 
      id: "job-posting", 
      title: "Job Posting", 
      icon: <FileText size={20} />
    },
    { 
      id: "resume-parsing", 
      title: "Resume Parsing", 
      icon: <UserCheck size={20} />
    },
    { 
      id: "candidate-bot", 
      title: "AI Candidate Bot", 
      icon: <MessageSquare size={20} />
    },
    { 
      id: "offer", 
      title: "Offer Engine", 
      icon: <DollarSign size={20} />
    },
    { 
      id: "onboarding", 
      title: "Onboarding AI", 
      icon: <Users size={20} />
    },
    { 
      id: "analytics", 
      title: "Analytics", 
      icon: <BarChart2 size={20} />
    },
    { 
      id: "referrals", 
      title: "Referrals", 
      icon: <Share2 size={20} />
    },
  ];

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-hr-primary bg-clip-text text-transparent">
            Recruitment Modules
          </h2>
          <p className="text-muted-foreground mt-1">Manage your recruitment pipeline with AI-powered tools</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {sections.map((section) => (
          <OverviewSection
            key={section.id}
            id={section.id}
            title={section.title}
            icon={section.icon}
            active={activeSection === section.id}
            onClick={() => handleSectionClick(section.id)}
          />
        ))}
      </div>
    </section>
  );
}
