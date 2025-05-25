import { JobRequisition } from "@/components/recruitment/sections/JobRequisition";
import { JobPosting } from "@/components/recruitment/sections/JobPosting";
import { ResumeParser } from "@/components/recruitment/sections/ResumeParser";
import { CandidateBot } from "@/components/recruitment/sections/CandidateBot";
import { InterviewScheduler } from "@/components/recruitment/sections/InterviewScheduler";
import { OfferEngine } from "@/components/recruitment/sections/OfferEngine";
import { OnboardingAI } from "@/components/recruitment/sections/OnboardingAI";
import { RecruitmentAnalytics } from "@/components/recruitment/sections/RecruitmentAnalytics";
import { ReferralSystem } from "@/components/recruitment/sections/ReferralSystem";

interface RecruitmentDetailPanelProps {
  activeSection: string;
}

export function RecruitmentDetailPanel({ activeSection }: RecruitmentDetailPanelProps) {
  // Map active section to component
  const renderSection = () => {
    switch (activeSection) {
      case "job-requisition":
        return <JobRequisition />;
      case "job-posting":
        return <JobPosting />;
      case "resume-parsing":
        return <ResumeParser />;
      case "candidate-bot":
        return <CandidateBot />;
      case "offer":
        return <OfferEngine />;
      case "onboarding":
        return <OnboardingAI />;
      case "analytics":
        return <RecruitmentAnalytics />;
      case "referrals":
        return <ReferralSystem />;
      default:
        return <JobRequisition />;
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl border border-border shadow-sm p-6 mb-8">
      {renderSection()}
    </section>
  );
}
