import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, TrendingUp, Users, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const forecastData = [
  { month: 'Jan', actual: 10, forecast: 10 },
  { month: 'Feb', actual: 12, forecast: 12 },
  { month: 'Mar', actual: 15, forecast: 15 },
  { month: 'Apr', actual: 18, forecast: 16 },
  { month: 'May', actual: 22, forecast: 19 },
  { month: 'Jun', actual: null, forecast: 23 },
  { month: 'Jul', actual: null, forecast: 28 },
  { month: 'Aug', actual: null, forecast: 30 },
  { month: 'Sep', actual: null, forecast: 27 },
  { month: 'Oct', actual: null, forecast: 24 },
  { month: 'Nov', actual: null, forecast: 22 },
  { month: 'Dec', actual: null, forecast: 20 },
];

type StepStatus = "pending" | "approved" | "declined" | "current";

interface WorkflowStep {
  id: string;
  title: string;
  status: StepStatus;
}

const departments = ["Engineering", "Product", "Operations", "HR", "Finance", "Marketing", "Sales"];
const hrTeamMembers = ["Sarah Johnson", "Mike Chen", "Emily Davis", "John Rodriguez"];
const budgetOwners = ["CFO - Michael Thompson", "VP Finance - Lisa Wang", "Director Finance - David Kim"];
const finalApprovers = ["CEO - Robert Smith", "COO - Jennifer Brown", "VP Operations - Alex Martinez"];

export function JobRequisition() {
  const [requisition, setRequisition] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headcount, setHeadcount] = useState<number[]>([28]);
  const [requestedDate, setRequestedDate] = useState<Date>();
  const [budgetStartDate, setBudgetStartDate] = useState<Date>();
  const [budgetEndDate, setBudgetEndDate] = useState<Date>();
  const [effectiveDate, setEffectiveDate] = useState<Date>();
  const [openPositions, setOpenPositions] = useState<number>(12);
  const [closedPositions, setClosedPositions] = useState<number>(8);
  const [finalDecision, setFinalDecision] = useState<string>("approved");
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: "step-1", title: "Department Request", status: "current" },
    { id: "step-2", title: "HR Review", status: "pending" },
    { id: "step-3", title: "Budget Approval", status: "pending" },
    { id: "step-4", title: "Job Description", status: "pending" },
    { id: "step-5", title: "Final Approval", status: "pending" },
  ]);
  const [expandedStep, setExpandedStep] = useState<string | null>("step-1");
  const [showNewRequest, setShowNewRequest] = useState(false);
  
  // Fetch requisition data
  useEffect(() => {
    const fetchRequisition = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/job-requisitions/latest');
        const data = await response.json();
        setRequisition(data);
      } catch (err) {
        setError('Failed to fetch requisition data');
      } finally {
        setLoading(false);
      }
    };

    fetchRequisition();
  }, []);

  const handleFinalApproval = () => {
    if (finalDecision === "approved") {
      setOpenPositions(prev => prev + 1);
    }
  };
  
  const handleStepClick = (stepId: string) => {
    const stepIndex = workflowSteps.findIndex(step => step.id === stepId);
    const previousStep = workflowSteps[stepIndex - 1];
    
    // Only allow expanding if previous step is approved or it's the first step
    if (stepIndex === 0 || (previousStep && previousStep.status === "approved")) {
      setExpandedStep(expandedStep === stepId ? null : stepId);
    }
  };

  const handleApproval = (stepId: string, action: "approve" | "decline") => {
    setWorkflowSteps(prevSteps => {
      const newSteps = [...prevSteps];
      const currentIndex = newSteps.findIndex(step => step.id === stepId);
      
      // Update current step status
      newSteps[currentIndex] = {
        ...newSteps[currentIndex],
        status: action === "approve" ? "approved" : "declined"
      };

      // If approved, set next step as current
      if (action === "approve" && currentIndex < newSteps.length - 1) {
        newSteps[currentIndex + 1] = {
          ...newSteps[currentIndex + 1],
          status: "current"
        };
        setExpandedStep(newSteps[currentIndex + 1].id);
      }

      return newSteps;
    });
  };

  const handleNewRequest = () => {
    setWorkflowSteps([
      { id: "step-1", title: "Department Request", status: "current" },
      { id: "step-2", title: "HR Review", status: "pending" },
      { id: "step-3", title: "Budget Approval", status: "pending" },
      { id: "step-4", title: "Job Description", status: "pending" },
      { id: "step-5", title: "Final Approval", status: "pending" },
    ]);
    setExpandedStep("step-1");
    setShowNewRequest(false);
  };

  const renderWorkflowForm = (stepId: string, stepTitle: string) => {
    switch (stepId) {
      case "step-1":
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-sm">{stepTitle} Form</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="requestor">Requestor Name & Email</Label>
                <Input value="John Doe (john.doe@company.com)" disabled className="bg-gray-100" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="justification">Justification</Label>
                <Textarea placeholder="Provide justification for this request..." />
              </div>
              <div>
                <Label>Requested Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !requestedDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {requestedDate ? format(requestedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={requestedDate} onSelect={setRequestedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        );
      
      case "step-2":
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-sm">{stepTitle} Form</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hr-reviewer">HR Reviewer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select HR reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {hrTeamMembers.map((member) => (
                      <SelectItem key={member} value={member.toLowerCase().replace(' ', '-')}>{member}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Review Decision</Label>
                <RadioGroup defaultValue="approve" className="flex space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approve" id="approve" />
                    <Label htmlFor="approve">Approve</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="send-back" id="send-back" />
                    <Label htmlFor="send-back">Send Back</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="hr-comments">Comments</Label>
                <Textarea placeholder="Add review comments..." />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="attachments">Attachments</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload org charts, policy docs, etc.</p>
                  <Button variant="outline" className="mt-2">Choose Files</Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "step-3":
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg bg-blue-50">
            <h4 className="font-medium text-sm">{stepTitle} Form</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget-owner">Budget Owner</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOwners.map((owner) => (
                      <SelectItem key={owner} value={owner.toLowerCase().replace(/[^a-z]/g, '-')}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget-amount">Approved Budget Amount</Label>
                <div className="flex">
                  <Select defaultValue="usd">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Amount" className="flex-1 ml-2" />
                </div>
              </div>
              <div>
                <Label>Budget Period Start</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !budgetStartDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {budgetStartDate ? format(budgetStartDate, "PPP") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={budgetStartDate} onSelect={setBudgetStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Budget Period End</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !budgetEndDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {budgetEndDate ? format(budgetEndDate, "PPP") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={budgetEndDate} onSelect={setBudgetEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="budget-comments">Comments</Label>
                <Textarea placeholder="Add budget approval comments..." />
              </div>
            </div>
          </div>
        );
      
      case "step-4":
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-sm">{stepTitle} Form</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="position-title">Position Title</Label>
                <Input placeholder="Enter position title..." />
              </div>
              <div>
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea 
                  placeholder="Enter detailed job description..." 
                  className="min-h-[120px]"
                />
                <p className="text-sm text-gray-500 mt-1">Use rich text formatting for detailed job descriptions</p>
              </div>
            </div>
          </div>
        );
      
      case "step-5":
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-sm">{stepTitle} Form</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="final-approver">Final Approver</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select final approver" />
                  </SelectTrigger>
                  <SelectContent>
                    {finalApprovers.map((approver) => (
                      <SelectItem key={approver} value={approver.toLowerCase().replace(/[^a-z]/g, '-')}>{approver}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Effective Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !effectiveDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {effectiveDate ? format(effectiveDate, "PPP") : "Pick effective date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={effectiveDate} onSelect={setEffectiveDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="md:col-span-2">
                <Label>Overall Decision</Label>
                <RadioGroup value={finalDecision} onValueChange={setFinalDecision} className="flex space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approved" id="approved" />
                    <Label htmlFor="approved">Approved</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="denied" id="denied" />
                    <Label htmlFor="denied">Denied</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="final-comments">Final Comments</Label>
                <Textarea placeholder="Add final approval comments..." />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const renderWorkflowStep = (step: WorkflowStep, index: number) => {
    const isActive = step.status === "current";
    const isApproved = step.status === "approved";
    const isDeclined = step.status === "declined";
    const isPending = step.status === "pending";
    const canShowForm = expandedStep === step.id;

    return (
      <div key={step.id} className="relative flex items-start z-10 mb-6">
        <div className={`size-6 rounded-full flex-shrink-0 flex items-center justify-center ${
          isApproved ? 'bg-green-500' :
          isDeclined ? 'bg-red-500' :
          isActive ? 'bg-primary' : 'bg-muted'
        } text-white`}>
          {isApproved ? '✓' : index + 1}
        </div>
        
        <div className="ml-4 flex-1">
          <div 
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              isActive ? 'bg-primary/10 border border-primary/30' :
              isApproved ? 'bg-green-500/10 border border-green-500/30' :
              isDeclined ? 'bg-red-500/10 border border-red-500/30' :
              'bg-muted/30 border border-muted'
            }`}
            onClick={() => handleStepClick(step.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {isApproved ? 'Approved' :
                   isDeclined ? 'Declined' :
                   isActive ? 'In Progress' : 'Waiting'}
                </p>
              </div>
              {canShowForm && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {expandedStep === step.id ? 'Hide Details' : 'View Details'}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      expandedStep === step.id ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          {/* Form and Approval Buttons */}
          {canShowForm && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              {renderWorkflowForm(step.id, step.title)}
              
              {/* Approval Buttons */}
              {isActive && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500"
                    onClick={() => handleApproval(step.id, "decline")}
                  >
                    Decline
                  </Button>
                  <Button 
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => handleApproval(step.id, "approve")}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">AI-Driven Job Requisition & Forecasting</h2>
        <Button 
          onClick={() => setShowNewRequest(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>
      
      {/* Approval Workflow */}
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Approval Workflow</h3>
            
            <div className="space-y-6">
              <div className="relative">
                {/* Vertical line connecting steps */}
                <div className="absolute left-3 top-3 w-0.5 h-[calc(100%-24px)] bg-muted z-0"></div>
                
                {/* Workflow steps */}
                {workflowSteps.map((step, index) => renderWorkflowStep(step, index))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Position Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium mb-2">Current Open Positions</h3>
                <p className="text-3xl font-bold text-blue-600">{openPositions}</p>
                <p className="text-sm text-muted-foreground mt-1">Active job openings</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium mb-2">Closed Positions</h3>
                <p className="text-3xl font-bold text-green-600">{closedPositions}</p>
                <p className="text-sm text-muted-foreground mt-1">Successfully filled roles</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Headcount Forecast - Moved to bottom */}
      <div>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Headcount Forecast</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="forecast" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
