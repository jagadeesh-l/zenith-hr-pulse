
import { useState } from "react";
import { 
  FileText, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  BarChart2, 
  Users, 
  ClipboardList
} from "lucide-react";
import { Card } from "@/components/ui/card";

type OverviewSectionProps = {
  title: string;
  kpi: string;
  icon: React.ReactNode;
  id: string;
  active: boolean;
  onClick: () => void;
}

const OverviewSection = ({ title, kpi, icon, active, onClick }: OverviewSectionProps) => (
  <Card 
    className={`p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
      active ? 'bg-primary/10 border-primary/30 shadow-md' : 'hover:shadow-primary/10 hover:border-primary/20'
    } cursor-pointer`}
    onClick={onClick}
  >
    <div className="flex items-start">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
        {icon}
      </div>
      <div className="ml-3">
        <h3 className="font-medium">{title}</h3>
        <p className="text-2xl font-bold">{kpi}</p>
      </div>
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
      icon: <ClipboardList size={20} /> 
    },
    { 
      id: "job-posting", 
      title: "Job Posting", 
      kpi: "12 active postings", 
      icon: <FileText size={20} /> 
    },
    { 
      id: "resume-parsing", 
      title: "Resume Parsing", 
      kpi: "54 new candidates", 
      icon: <UserCheck size={20} /> 
    },
    { 
      id: "candidate-bot", 
      title: "AI Candidate Bot", 
      kpi: "89% response rate", 
      icon: <MessageSquare size={20} /> 
    },
    { 
      id: "interview", 
      title: "Interview Scheduler", 
      kpi: "18 upcoming", 
      icon: <Calendar size={20} /> 
    },
    { 
      id: "offer", 
      title: "Offer Engine", 
      kpi: "7 pending offers", 
      icon: <DollarSign size={20} /> 
    },
    { 
      id: "onboarding", 
      title: "Onboarding AI", 
      kpi: "5 new hires", 
      icon: <Users size={20} /> 
    },
    { 
      id: "analytics", 
      title: "Analytics", 
      kpi: "22d avg time-to-hire", 
      icon: <BarChart2 size={20} /> 
    },
  ];

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Recruitment Modules</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sections.map((section) => (
          <OverviewSection
            key={section.id}
            id={section.id}
            title={section.title}
            kpi={section.kpi}
            icon={section.icon}
            active={activeSection === section.id}
            onClick={() => handleSectionClick(section.id)}
          />
        ))}
      </div>
    </section>
  );
}
