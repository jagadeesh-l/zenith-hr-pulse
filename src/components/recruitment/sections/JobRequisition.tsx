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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Upload, TrendingUp, Users, Plus, X, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { recruitmentService, JobRequisitionData, JobRequisition as JobRequisitionType, RecruitmentStats, HeadcountForecast } from "@/services/recruitmentService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

type StepStatus = "pending" | "approved" | "declined" | "current" | "in-progress";

interface WorkflowStep {
  id: string;
  title: string;
  status: StepStatus;
}

const departments = ["Engineering", "Product", "Operations", "HR", "Finance", "Marketing", "Sales"];
const managers = ["Sarah Johnson", "Mike Chen", "Emily Davis", "John Rodriguez", "Lisa Wang", "David Kim"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Intern"];
const locationTypes = ["Office", "Remote", "Hybrid"];
const experienceLevels = ["Entry Level (0-2 years)", "Mid Level (3-5 years)", "Senior Level (6-10 years)", "Executive Level (10+ years)"];
const educationLevels = ["High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "PhD", "Professional Certification"];
const reasonsForHire = ["New Role", "Replacement", "Team Expansion", "Seasonal", "Project-based"];

export function JobRequisition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openPositions, setOpenPositions] = useState<number>(12);
  const [closedPositions, setClosedPositions] = useState<number>(8);
  const [currentRequisition, setCurrentRequisition] = useState<JobRequisitionType | null>(null);
  const [recruitmentStats, setRecruitmentStats] = useState<RecruitmentStats | null>(null);
  const [headcountForecast, setHeadcountForecast] = useState<HeadcountForecast[]>([]);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: "step-1", title: "Department Request", status: "in-progress" },
    { id: "step-2", title: "HR Review", status: "pending" },
    { id: "step-3", title: "Budget Approval", status: "pending" },
    { id: "step-4", title: "Final Approval", status: "pending" },
  ]);
  const [expandedStep, setExpandedStep] = useState<string | null>("step-1");
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  
  // New Request Form State
  const [newRequest, setNewRequest] = useState<JobRequisitionData>({
    jobTitle: "",
    department: "",
    manager: "",
    numberOfOpenings: 1,
    jobType: "",
    location: "",
    skills: [],
    experienceLevel: "",
    educationRequirements: "",
    salaryMin: 50000,
    salaryMax: 100000,
    reasonForHire: "",
    startDate: undefined,
    notes: ""
  });
  const [currentSkill, setCurrentSkill] = useState("");
  const [drafts, setDrafts] = useState<JobRequisitionData[]>([]);
  
  // Load initial data
  useEffect(() => {
    loadRecruitmentData();
  }, []);

  // Load drafts from localStorage on mount
  useEffect(() => {
    const storedDrafts = localStorage.getItem("jobRequisitionDrafts");
    if (storedDrafts) {
      setDrafts(JSON.parse(storedDrafts));
    }
  }, []);

  // Save drafts to localStorage whenever drafts change
  useEffect(() => {
    localStorage.setItem("jobRequisitionDrafts", JSON.stringify(drafts));
  }, [drafts]);

  const loadRecruitmentData = async () => {
    try {
      setLoading(true);
      const [stats, forecast] = await Promise.all([
        recruitmentService.getRecruitmentStats(),
        recruitmentService.getHeadcountForecast()
      ]);
      
      setRecruitmentStats(stats);
      setHeadcountForecast(forecast);
      setOpenPositions(stats.open_positions);
      setClosedPositions(stats.closed_positions);
    } catch (error) {
      console.error("Failed to load recruitment data:", error);
      setError("Failed to load recruitment data");
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleApproval = async (stepId: string, action: "approve" | "decline" | "request_info" | "submit") => {
    if (!currentRequisition) return;

    try {
      setLoading(true);
      
      // Call the API to update workflow step
      const result = await recruitmentService.updateWorkflowStep(
        currentRequisition.requisition_id,
        stepId,
        action
      );

      // Refresh the current requisition data
      const updatedRequisition = await recruitmentService.getJobRequisition(currentRequisition.requisition_id);
      setCurrentRequisition(updatedRequisition);

      // Update workflow steps based on the response
      if (updatedRequisition.workflow_steps) {
        setWorkflowSteps(updatedRequisition.workflow_steps.map(step => ({
          id: step.id,
          title: step.title,
          status: step.status as StepStatus
        })));
      }

      // Update expanded step
      if (action === "submit" && stepId === "step-1") {
        setExpandedStep("step-2");
      } else if (action === "approve") {
        const currentIndex = workflowSteps.findIndex(step => step.id === stepId);
        if (currentIndex < workflowSteps.length - 1) {
          setExpandedStep(workflowSteps[currentIndex + 1].id);
        }
      } else if (action === "request_info") {
        setExpandedStep("step-1");
      }

      // If final approval, refresh stats
      if (action === "approve" && stepId === "step-4") {
        await loadRecruitmentData();
      }

    } catch (error) {
      console.error("Failed to update workflow step:", error);
      setError("Failed to update workflow step");
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    setNewRequest({
      jobTitle: "",
      department: "",
      manager: "",
      numberOfOpenings: 1,
      jobType: "",
      location: "",
      skills: [],
      experienceLevel: "",
      educationRequirements: "",
      salaryMin: 50000,
      salaryMax: 100000,
      reasonForHire: "",
      startDate: undefined,
      notes: ""
    });
    setWorkflowSteps([
      { id: "step-1", title: "Department Request", status: "in-progress" },
      { id: "step-2", title: "HR Review", status: "pending" },
      { id: "step-3", title: "Budget Approval", status: "pending" },
      { id: "step-4", title: "Final Approval", status: "pending" },
    ]);
    setExpandedStep("step-1");
    setShowNewRequestDialog(true);
  };

  const addSkill = () => {
    if (currentSkill.trim() && !newRequest.skills.includes(currentSkill.trim())) {
      setNewRequest(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setNewRequest(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const saveNewRequest = async () => {
    try {
      setLoading(true);
      // Create the job requisition via API
      const createdRequisition = await recruitmentService.createJobRequisition(newRequest);
      // Fetch the full requisition from backend (in case backend adds/normalizes fields)
      const fetchedRequisition = await recruitmentService.getJobRequisition(createdRequisition.requisition_id);
      // Set as current requisition
      setCurrentRequisition(fetchedRequisition);
      // Update workflow steps based on the response
      if (fetchedRequisition.workflow_steps) {
        setWorkflowSteps(fetchedRequisition.workflow_steps.map(step => ({
          id: step.id,
          title: step.title,
          status: step.status as StepStatus
        })));
      }
      // Close dialog and reset form
      setShowNewRequestDialog(false);
      setNewRequest({
        jobTitle: "",
        department: "",
        manager: "",
        numberOfOpenings: 1,
        jobType: "",
        location: "",
        skills: [],
        experienceLevel: "",
        educationRequirements: "",
        salaryMin: 50000,
        salaryMax: 100000,
        reasonForHire: "",
        startDate: undefined,
        notes: ""
      });
      // Refresh stats
      await loadRecruitmentData();
    } catch (error) {
      console.error("Failed to create job requisition:", error);
      setError("Failed to create job requisition");
    } finally {
      setLoading(false);
    }
  };

  // Save Draft handler
  const handleSaveDraft = () => {
    if (!newRequest.jobTitle) return;
    setDrafts(prev => [{ ...newRequest }, ...prev.filter(d => d.jobTitle !== newRequest.jobTitle)]);
    setShowNewRequestDialog(false);
    setNewRequest({
      jobTitle: "",
      department: "",
      manager: "",
      numberOfOpenings: 1,
      jobType: "",
      location: "",
      skills: [],
      experienceLevel: "",
      educationRequirements: "",
      salaryMin: 50000,
      salaryMax: 100000,
      reasonForHire: "",
      startDate: undefined,
      notes: ""
    });
  };

  // Restore draft handler
  const handleRestoreDraft = (draft: JobRequisitionData) => {
    setNewRequest(draft);
    setCurrentRequisition(null);
    setShowNewRequestDialog(true);
    setExpandedStep("step-1");
  };

  const renderStepActions = (stepId: string, stepTitle: string) => {
    const step = workflowSteps.find(s => s.id === stepId);
    if (!step) return null;

    // Use current requisition data if available, otherwise use new request data
    const requestData = currentRequisition?.department_request || newRequest;

    switch (stepId) {
      case "step-1":
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg bg-blue-50">
            <h4 className="font-medium text-sm">{stepTitle} - Request Details</h4>
            
            {/* Display populated form data */}
            {(requestData.jobTitle || requestData['job_title']) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Job Title:</strong> {requestData.jobTitle || requestData['job_title']}</div>
                <div><strong>Department:</strong> {requestData.department}</div>
                <div><strong>Manager:</strong> {requestData.manager}</div>
                <div><strong>Openings:</strong> {requestData.numberOfOpenings || requestData['number_of_openings']}</div>
                <div><strong>Job Type:</strong> {requestData.jobType || requestData['job_type']}</div>
                <div><strong>Location:</strong> {requestData.location}</div>
                <div className="md:col-span-2">
                  <strong>Skills:</strong> 
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(requestData.skills || []).map((skill: string) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div><strong>Experience:</strong> {requestData.experienceLevel || requestData['experience_level']}</div>
                <div><strong>Education:</strong> {requestData.educationRequirements || requestData['education_requirements']}</div>
                <div>
                  <strong>Salary Range:</strong> $
                  {(requestData.salaryMin || requestData['salary_min'])?.toLocaleString()} - $
                  {(requestData.salaryMax || requestData['salary_max'])?.toLocaleString()}
                </div>
                <div><strong>Reason:</strong> {requestData.reasonForHire || requestData['reason_for_hire']}</div>
                {(requestData.startDate || requestData['start_date']) && (
                  <div>
                    <strong>Start Date:</strong> {format(new Date(requestData.startDate || requestData['start_date']), "PPP")}
                  </div>
                )}
                {(requestData.notes) && (
                  <div className="md:col-span-2"><strong>Notes:</strong> {requestData.notes}</div>
                )}
              </div>
            )}

            {step.status === "in-progress" && (
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => console.log("Edit")}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => console.log("Cancel Request")}
                >
                  Cancel Request
                </Button>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => handleApproval(stepId, "submit")}
                  disabled={!requestData.jobTitle || !currentRequisition}
                >
                  Submit for HR Review
                </Button>
              </div>
            )}
          </div>
        );
      
      case "step-2":
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg bg-green-50">
            <h4 className="font-medium text-sm">{stepTitle} - Review & Action</h4>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Review Details
              </Button>
              
              <div className="space-y-2">
                <Label htmlFor="hr-comments">Comments/Reason</Label>
                <Textarea placeholder="Add review comments..." />
              </div>
            </div>
            
            {step.status === "current" && (
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="text-orange-500 hover:bg-orange-50"
                  onClick={() => handleApproval(stepId, "request_info")}
                >
                  Request More Information
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleApproval(stepId, "decline")}
                >
                  Reject
                </Button>
                <Button 
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => handleApproval(stepId, "approve")}
                >
                  Approve & Forward to Budget
                </Button>
              </div>
            )}
          </div>
        );
      
      case "step-3":
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg bg-yellow-50">
            <h4 className="font-medium text-sm">{stepTitle} - Budget Review</h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border">
                <div className="text-sm">
                  <strong>Budget Impact Analysis</strong>
                  <div className="mt-2">
                    <div>Requested Salary Range: ${requestData.salaryMin.toLocaleString()} - ${requestData.salaryMax.toLocaleString()}</div>
                    <div>Number of Positions: {requestData.numberOfOpenings}</div>
                    <div>Annual Cost Estimate: ${(requestData.salaryMax * requestData.numberOfOpenings).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget-comments">Budget Comments</Label>
                <Textarea placeholder="Add budget review comments..." />
              </div>
            </div>
            
            {step.status === "current" && (
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="text-orange-500 hover:bg-orange-50"
                  onClick={() => handleApproval(stepId, "request_info")}
                >
                  Request Revisions
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleApproval(stepId, "decline")}
                >
                  Reject
                </Button>
                <Button 
                  className="bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => handleApproval(stepId, "approve")}
                >
                  Approve Budget
                </Button>
              </div>
            )}
          </div>
        );
      
      case "step-4":
        return (
          <div className="space-y-4 mt-4 p-4 border rounded-lg bg-purple-50">
            <h4 className="font-medium text-sm">{stepTitle} - Final Review</h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border">
                <div className="text-sm">
                  <strong>Complete Request Summary</strong>
                  <div className="mt-2 space-y-1">
                    <div>Position: {requestData.jobTitle} ({requestData.numberOfOpenings} opening{requestData.numberOfOpenings > 1 ? 's' : ''})</div>
                    <div>Department: {requestData.department}</div>
                    <div>Budget: ${requestData.salaryMin.toLocaleString()} - ${requestData.salaryMax.toLocaleString()}</div>
                    <div>Type: {requestData.jobType} | Location: {requestData.location}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="final-comments">Final Comments</Label>
                <Textarea placeholder="Add final approval comments..." />
              </div>
            </div>
            
            {step.status === "current" && (
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleApproval(stepId, "decline")}
                >
                  Final Reject
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleApproval(stepId, "approve")}
                >
                  Final Approve & Initiate Posting
                </Button>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const renderWorkflowStep = (step: WorkflowStep, index: number) => {
    const isActive = step.status === "current";
    const isInProgress = step.status === "in-progress";
    const isApproved = step.status === "approved";
    const isDeclined = step.status === "declined";
    const isPending = step.status === "pending";
    const canShowForm = expandedStep === step.id;

    return (
      <div key={step.id} className="relative flex items-start z-10 mb-6">
        <div className={`size-6 rounded-full flex-shrink-0 flex items-center justify-center ${
          isApproved ? 'bg-green-500' :
          isDeclined ? 'bg-red-500' :
          isActive || isInProgress ? 'bg-primary' : 'bg-muted'
        } text-white`}>
          {isApproved ? '✓' : index + 1}
        </div>
        
        <div className="ml-4 flex-1">
          <div 
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              isActive || isInProgress ? 'bg-primary/10 border border-primary/30' :
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
                   isActive ? 'Current Step' :
                   isInProgress ? 'In Progress' : 'Waiting'}
                </p>
              </div>
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
            </div>
          </div>
          
          {/* Step Actions */}
          {canShowForm && renderStepActions(step.id, step.title)}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          {/* My Drafts Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">My Drafts</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {drafts.length === 0 && (
                <DropdownMenuItem disabled>No drafts</DropdownMenuItem>
              )}
              {drafts.map((draft, idx) => (
                <DropdownMenuItem key={idx} onClick={() => handleRestoreDraft(draft)}>
                  {draft.jobTitle || "Untitled"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* + New Request Button */}
          <Button 
            onClick={handleNewRequest}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>
        <h2 className="text-2xl font-semibold">AI-Driven Job Requisition & Forecasting</h2>
      </div>

      {/* New Request Dialog */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job Requisition</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input 
                  id="jobTitle"
                  value={newRequest.jobTitle}
                  onChange={(e) => setNewRequest(prev => ({...prev, jobTitle: e.target.value}))}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={newRequest.department} onValueChange={(value) => setNewRequest(prev => ({...prev, department: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="manager">Manager/Reporting To *</Label>
                <Select value={newRequest.manager} onValueChange={(value) => setNewRequest(prev => ({...prev, manager: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager) => (
                      <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="numberOfOpenings">Number of Openings *</Label>
                <Input 
                  id="numberOfOpenings"
                  type="number"
                  min="1"
                  value={newRequest.numberOfOpenings}
                  onChange={(e) => setNewRequest(prev => ({...prev, numberOfOpenings: parseInt(e.target.value) || 1}))}
                />
              </div>
              
              <div>
                <Label htmlFor="jobType">Job Type *</Label>
                <Select value={newRequest.jobType} onValueChange={(value) => setNewRequest(prev => ({...prev, jobType: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location">Location *</Label>
                <Select value={newRequest.location} onValueChange={(value) => setNewRequest(prev => ({...prev, location: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="experienceLevel">Experience Level *</Label>
                <Select value={newRequest.experienceLevel} onValueChange={(value) => setNewRequest(prev => ({...prev, experienceLevel: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="educationRequirements">Education Requirements</Label>
                <Select value={newRequest.educationRequirements} onValueChange={(value) => setNewRequest(prev => ({...prev, educationRequirements: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((education) => (
                      <SelectItem key={education} value={education}>{education}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Skills Section */}
            <div>
              <Label htmlFor="skills">Required Skills & Qualifications</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Enter a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newRequest.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryMin">Minimum Salary ($)</Label>
                <Input 
                  id="salaryMin"
                  type="number"
                  value={newRequest.salaryMin}
                  onChange={(e) => setNewRequest(prev => ({...prev, salaryMin: parseInt(e.target.value) || 0}))}
                />
              </div>
              <div>
                <Label htmlFor="salaryMax">Maximum Salary ($)</Label>
                <Input 
                  id="salaryMax"
                  type="number"
                  value={newRequest.salaryMax}
                  onChange={(e) => setNewRequest(prev => ({...prev, salaryMax: parseInt(e.target.value) || 0}))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reasonForHire">Reason for Hire *</Label>
                <Select value={newRequest.reasonForHire} onValueChange={(value) => setNewRequest(prev => ({...prev, reasonForHire: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonsForHire.map((reason) => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Desired Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !newRequest.startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newRequest.startDate ? format(newRequest.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={newRequest.startDate} onSelect={(date) => setNewRequest(prev => ({...prev, startDate: date}))} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes"
                value={newRequest.notes}
                onChange={(e) => setNewRequest(prev => ({...prev, notes: e.target.value}))}
                placeholder="Any specific requirements, attachments, or additional information..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button onClick={saveNewRequest} disabled={!newRequest.jobTitle || !newRequest.department}>
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
      
      {/* Headcount Forecast */}
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
