
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheck, Clock, Info, UserPlus, FileText, Users, Laptop, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type OnboardingStepProps = {
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  dueDate: string;
  progress: number;
  icon: React.ReactNode;
};

const OnboardingStep = ({ title, description, status, dueDate, progress, icon }: OnboardingStepProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            status === "completed" ? "bg-green-500 text-white" :
            status === "in-progress" ? "bg-primary text-white" :
            "bg-muted text-muted-foreground"
          }`}>
            {icon}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium">{title}</h4>
              <Badge variant="outline" className={`
                ${status === "completed" ? "bg-green-500/10 text-green-600" : 
                  status === "in-progress" ? "bg-primary/10 text-primary" :
                  "bg-muted"}
              `}>
                {status === "completed" ? "Completed" :
                 status === "in-progress" ? "In Progress" : 
                 "Pending"}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            
            <div className="flex justify-between items-center mb-2 text-xs">
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-muted-foreground" />
                <span>{dueDate}</span>
              </div>
              <span>{progress}% complete</span>
            </div>
            
            <Progress value={progress} className="h-1.5" />
            
            {status !== "completed" && (
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">Details</Button>
                <Button size="sm">Start{status === "in-progress" && " Next Step"}</Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function OnboardingAI() {
  const [activeEmployee, setActiveEmployee] = useState<string>("michael-chen");
  
  const employees = [
    { id: "michael-chen", name: "Michael Chen", position: "Product Designer", startDate: "May 15", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
    { id: "sarah-johnson", name: "Sarah Johnson", position: "Marketing Manager", startDate: "May 22", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
    { id: "alex-rodriguez", name: "Alex Rodriguez", position: "DevOps Engineer", startDate: "June 1", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" },
  ];
  
  const onboardingSteps = [
    {
      title: "Pre-boarding Documentation",
      description: "Complete all required legal and HR documentation before your first day.",
      status: "completed" as const,
      dueDate: "Completed May 12",
      progress: 100,
      icon: <FileText size={18} />
    },
    {
      title: "Equipment Setup",
      description: "Configure your laptop, accounts, and required software.",
      status: "in-progress" as const,
      dueDate: "Due May 17",
      progress: 60,
      icon: <Laptop size={18} />
    },
    {
      title: "Team Introduction",
      description: "Meet your team members and understand your role within the team.",
      status: "pending" as const,
      dueDate: "Due May 18",
      progress: 0,
      icon: <Users size={18} />
    },
    {
      title: "Training Sessions",
      description: "Attend required training sessions and complete onboarding courses.",
      status: "pending" as const,
      dueDate: "Due May 25",
      progress: 0,
      icon: <Info size={18} />
    }
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Onboarding Activation & Engagement AI</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - New Hire Selection */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">New Hires</h3>
                <Badge className="bg-green-500">{employees.length} Active</Badge>
              </div>
              
              <div className="space-y-2">
                {employees.map((employee) => (
                  <div 
                    key={employee.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeEmployee === employee.id 
                        ? "bg-primary/10 border border-primary/30" 
                        : "hover:bg-muted/50 border border-transparent"
                    }`}
                    onClick={() => setActiveEmployee(employee.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={employee.photo} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{employee.name}</h4>
                        <Badge variant="outline" className="text-xs">Starting {employee.startDate}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{employee.position}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4 flex items-center gap-2">
                <UserPlus size={16} />
                Add New Hire Manually
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Send size={16} className="mr-2" />
                  Send Welcome Pack
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users size={16} className="mr-2" />
                  Assign Buddy/Mentor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CircleCheck size={16} className="mr-2" />
                  Mark Step as Complete
                </Button>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Overall Status</h4>
                  <Badge variant="outline" className="bg-primary/10 text-primary">On Track</Badge>
                </div>
                <Progress value={45} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground text-center">
                  45% of onboarding tasks completed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Columns - Onboarding Plan */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium">Onboarding Plan</h3>
                  <p className="text-muted-foreground">For {employees.find(emp => emp.id === activeEmployee)?.name}</p>
                </div>
                
                <Tabs defaultValue="steps">
                  <TabsList>
                    <TabsTrigger value="steps">Steps</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                {onboardingSteps.map((step, index) => (
                  <OnboardingStep 
                    key={index}
                    title={step.title}
                    description={step.description}
                    status={step.status}
                    dueDate={step.dueDate}
                    progress={step.progress}
                    icon={step.icon}
                  />
                ))}
                
                <div className="flex justify-between mt-6">
                  <Button variant="outline">Custom Plan</Button>
                  <Button>Generate Next Steps</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">AI Insights & Recommendations</h3>
              
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CircleCheck size={16} className="text-green-500" />
                    <h4 className="font-medium">On Track</h4>
                  </div>
                  <p className="text-sm">
                    Michael's onboarding is progressing well. Equipment setup is ahead of schedule.
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Info size={16} className="text-primary" />
                    <h4 className="font-medium">Recommendation</h4>
                  </div>
                  <p className="text-sm">
                    Schedule the team introduction earlier to give Michael more time to acclimate to the team dynamics.
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-muted border">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={16} className="text-muted-foreground" />
                    <h4 className="font-medium">Upcoming Milestone</h4>
                  </div>
                  <p className="text-sm">
                    30-day check-in scheduled for June 15. Prepare discussion points about project integration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
