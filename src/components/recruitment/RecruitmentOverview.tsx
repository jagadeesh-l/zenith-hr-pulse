
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
  gradient: string;
}

const OverviewSection = ({ title, icon, active, onClick, gradient }: OverviewSectionProps) => (
  <div 
    className={`group relative overflow-hidden transition-all duration-500 cursor-pointer transform hover:scale-105 ${
      active ? 'scale-105' : ''
    }`}
    onClick={onClick}
  >
    {/* Main Card */}
    <div className="relative h-32 w-full rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} />
      
      {/* Active State Overlay */}
      {active && (
        <div className={`absolute inset-0 rounded-2xl ${gradient} opacity-20`} />
      )}
      
      {/* Content */}
      <div className="relative p-4 h-full flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 mb-3 ${
          active 
            ? 'bg-white text-primary shadow-lg' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-white group-hover:text-primary group-hover:shadow-lg'
        }`}>
          {icon}
        </div>
        
        {/* Title */}
        <h3 className={`font-semibold text-sm transition-colors duration-300 ${
          active 
            ? 'text-primary' 
            : 'text-gray-800 dark:text-gray-200 group-hover:text-white'
        }`}>
          {title}
        </h3>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Active Indicator */}
      {active && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full shadow-lg" />
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
      icon: <ClipboardList size={20} />,
      gradient: "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
    },
    { 
      id: "job-posting", 
      title: "Job Posting", 
      icon: <FileText size={20} />,
      gradient: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      id: "resume-parsing", 
      title: "Resume Parsing", 
      icon: <UserCheck size={20} />,
      gradient: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"
    },
    { 
      id: "candidate-bot", 
      title: "AI Candidate Bot", 
      icon: <MessageSquare size={20} />,
      gradient: "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500"
    },
    { 
      id: "interview", 
      title: "Interview Scheduler", 
      icon: <Calendar size={20} />,
      gradient: "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500"
    },
    { 
      id: "offer", 
      title: "Offer Engine", 
      icon: <DollarSign size={20} />,
      gradient: "bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500"
    },
    { 
      id: "onboarding", 
      title: "Onboarding AI", 
      icon: <Users size={20} />,
      gradient: "bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500"
    },
    { 
      id: "analytics", 
      title: "Analytics", 
      icon: <BarChart2 size={20} />,
      gradient: "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500"
    },
    { 
      id: "referrals", 
      title: "Referrals", 
      icon: <Share2 size={20} />,
      gradient: "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500"
    },
  ];

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Recruitment Modules
          </h2>
          <p className="text-muted-foreground mt-1">Manage your recruitment pipeline with AI-powered tools</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
        {sections.map((section) => (
          <OverviewSection
            key={section.id}
            id={section.id}
            title={section.title}
            icon={section.icon}
            gradient={section.gradient}
            active={activeSection === section.id}
            onClick={() => handleSectionClick(section.id)}
          />
        ))}
      </div>
    </section>
  );
}
