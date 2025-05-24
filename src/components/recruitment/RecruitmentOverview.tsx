
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
import { Card } from "@/components/ui/card";

type OverviewSectionProps = {
  title: string;
  kpi: string;
  icon: React.ReactNode;
  id: string;
  active: boolean;
  onClick: () => void;
  gradient: string;
}

const OverviewSection = ({ title, kpi, icon, active, onClick, gradient }: OverviewSectionProps) => (
  <Card 
    className={`group relative overflow-hidden transition-all duration-500 cursor-pointer border-0 shadow-lg hover:shadow-2xl hover:scale-105 ${
      active ? 'ring-2 ring-primary/50 shadow-xl' : ''
    }`}
    onClick={onClick}
  >
    {/* Gradient Background */}
    <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    
    {/* Content */}
    <div className="relative p-6 bg-white/90 group-hover:bg-white/95 transition-all duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
          active ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/70 text-muted-foreground group-hover:bg-white group-hover:text-primary group-hover:shadow-lg'
        }`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground group-hover:text-gray-600 font-medium transition-colors duration-300">
          {kpi}
        </p>
      </div>
      
      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  </Card>
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
      kpi: "25 reqs forecasted", 
      icon: <ClipboardList size={24} />,
      gradient: "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"
    },
    { 
      id: "job-posting", 
      title: "Job Posting", 
      kpi: "12 active postings", 
      icon: <FileText size={24} />,
      gradient: "bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20"
    },
    { 
      id: "resume-parsing", 
      title: "Resume Parsing", 
      kpi: "54 new candidates", 
      icon: <UserCheck size={24} />,
      gradient: "bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20"
    },
    { 
      id: "candidate-bot", 
      title: "AI Candidate Bot", 
      kpi: "89% response rate", 
      icon: <MessageSquare size={24} />,
      gradient: "bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20"
    },
    { 
      id: "interview", 
      title: "Interview Scheduler", 
      kpi: "18 upcoming", 
      icon: <Calendar size={24} />,
      gradient: "bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20"
    },
    { 
      id: "offer", 
      title: "Offer Engine", 
      kpi: "7 pending offers", 
      icon: <DollarSign size={24} />,
      gradient: "bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20"
    },
    { 
      id: "onboarding", 
      title: "Onboarding AI", 
      kpi: "5 new hires", 
      icon: <Users size={24} />,
      gradient: "bg-gradient-to-br from-indigo-500/20 via-blue-500/20 to-purple-500/20"
    },
    { 
      id: "analytics", 
      title: "Analytics", 
      kpi: "22d avg time-to-hire", 
      icon: <BarChart2 size={24} />,
      gradient: "bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-red-500/20"
    },
    { 
      id: "referrals", 
      title: "Referrals", 
      kpi: "15 active referrals", 
      icon: <Share2 size={24} />,
      gradient: "bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20"
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {sections.map((section) => (
          <OverviewSection
            key={section.id}
            id={section.id}
            title={section.title}
            kpi={section.kpi}
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
