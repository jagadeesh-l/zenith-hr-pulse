
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronDown, Search, Calendar, Filter, Eye, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LeaveRequest = {
  id: string;
  employee: {
    name: string;
    avatar: string;
    position: string;
  };
  type: string;
  status: "pending" | "approved" | "rejected";
  dateFrom: string;
  dateTo: string;
  days: number;
  reason: string;
  submittedDate: string;
  department: string;
};

export const LeaveApproval = () => {
  const { toast } = useToast();
  const [view, setView] = useState<"card" | "table">("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  
  // This would come from an API in a real app
  const leaveRequests: LeaveRequest[] = [
    {
      id: "LEV-2025-0001",
      employee: {
        name: "Sarah Johnson",
        avatar: "SJ",
        position: "Product Designer"
      },
      type: "Annual",
      status: "pending",
      dateFrom: "2025-06-10",
      dateTo: "2025-06-14",
      days: 5,
      reason: "Family vacation planned months ago",
      submittedDate: "2025-05-15",
      department: "Design"
    },
    {
      id: "LEV-2025-0002",
      employee: {
        name: "Michael Chen",
        avatar: "MC",
        position: "Senior Developer"
      },
      type: "Sick",
      status: "pending",
      dateFrom: "2025-05-22",
      dateTo: "2025-05-23",
      days: 2,
      reason: "Feeling unwell, doctor's appointment scheduled",
      submittedDate: "2025-05-21",
      department: "Engineering"
    },
    {
      id: "LEV-2025-0003",
      employee: {
        name: "Emily Davis",
        avatar: "ED",
        position: "Marketing Manager"
      },
      type: "Personal",
      status: "pending",
      dateFrom: "2025-05-25",
      dateTo: "2025-05-25",
      days: 1,
      reason: "Family emergency",
      submittedDate: "2025-05-20",
      department: "Marketing"
    },
    {
      id: "LEV-2025-0004",
      employee: {
        name: "Robert Wilson",
        avatar: "RW",
        position: "Finance Analyst"
      },
      type: "Annual",
      status: "pending",
      dateFrom: "2025-06-01",
      dateTo: "2025-06-05",
      days: 5,
      reason: "Wedding anniversary trip",
      submittedDate: "2025-05-18",
      department: "Finance"
    }
  ];

  // Team availability data for selected week (June 10-14, 2025)
  const teamAvailabilityData = [
    { name: "Present", value: 8, color: "#22c55e" },
    { name: "Leave", value: 4, color: "#f97316" },
    { name: "Tentative", value: 2, color: "#eab308" }
  ];
  
  // Filter leave requests based on search term and filters
  const filteredRequests = leaveRequests.filter(req => {
    const matchesSearch = req.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || req.department.toLowerCase() === departmentFilter;
    const matchesType = typeFilter === "all" || req.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesDepartment && matchesType;
  });

  const handleApprove = (requestId: string) => {
    // This would call an API to approve the leave in a real app
    toast({
      title: "Leave approved",
      description: `Request ${requestId} has been approved.`,
    });
  };
  
  const handleReject = (requestId: string) => {
    // This would call an API to reject the leave in a real app
    toast({
      title: "Leave rejected",
      description: `Request ${requestId} has been rejected.`,
    });
  };
  
  const toggleExpand = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const formatDateRange = (dateFrom: string, dateTo: string) => {
    const from = parseISO(dateFrom);
    const to = parseISO(dateTo);
    
    if (dateFrom === dateTo) {
      return format(from, "MMM d, yyyy");
    }
    
    if (format(from, "MMM yyyy") === format(to, "MMM yyyy")) {
      return `${format(from, "MMM d")} - ${format(to, "d, yyyy")}`;
    }
    
    return `${format(from, "MMM d, yyyy")} - ${format(to, "MMM d, yyyy")}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters and View Toggles */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by employee or request ID..." 
            className="pl-9 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md">
            <Button
              variant={view === "card" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setView("card")}
            >
              Cards
            </Button>
            <Button
              variant={view === "table" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setView("table")}
            >
              Table
            </Button>
          </div>
        </div>
      </div>
      
      {/* Team Availability Chart */}
      <Card className="hr-card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Team Availability (June 10-14, 2025)
          </CardTitle>
          <CardDescription>Overview of team members' availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer
                config={{
                  present: { color: "#22c55e" },
                  leave: { color: "#f97316" },
                  tentative: { color: "#eab308" }
                }}
              >
                <PieChart>
                  <Pie
                    data={teamAvailabilityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {teamAvailabilityData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    align="center" 
                    verticalAlign="bottom" 
                    layout="horizontal" 
                  />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent
                        labelKey="name"
                        labelFormatter={(value) => `${value}`}
                        formatter={(value, name) => [`${value} team members`, name]}
                      />
                    }
                  />
                </PieChart>
              </ChartContainer>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Insights Card */}
      <Card className="bg-accent/40 hr-card-hover border-primary/20">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-primary/10 rounded-full p-2">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">🤖 AI Assistant Suggestion</p>
            <p className="text-sm text-muted-foreground">Consider staggering approvals for the week of June 10-14, as 4 team members are requesting leave during that period.</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Leave Requests */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Pending Requests ({filteredRequests.length})
        </h3>
        
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <div className="text-muted-foreground">No pending leave requests to review</div>
          </div>
        ) : view === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hr-card-hover">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {request.employee.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{request.employee.name}</div>
                        <div className="text-xs text-muted-foreground">{request.employee.position}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="uppercase text-xs">
                      {request.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">Request ID</div>
                        <div>{request.id}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Department</div>
                        <div>{request.department}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="text-muted-foreground text-xs">Leave Period</div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDateRange(request.dateFrom, request.dateTo)}
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {request.days} day{request.days !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="text-muted-foreground text-xs">Reason</div>
                      <div className="line-clamp-2">{request.reason}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => toggleExpand(request.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="outline"
                            className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reject</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            className="h-8 w-8 bg-green-500 hover:bg-green-600"
                            onClick={() => handleApprove(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Approve</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardFooter>
                
                {expandedRequest === request.id && (
                  <div className="px-6 pb-4 pt-0 bg-muted/20 animate-fade-in">
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-muted-foreground">Submitted on:</span>{" "}
                        {format(parseISO(request.submittedDate), "MMM d, yyyy")}
                      </div>
                      {request.type === "Sick" && (
                        <div className="flex items-center">
                          <span className="text-muted-foreground mr-1">Medical certificate:</span>
                          <Button variant="link" className="p-0 h-auto" size="sm">
                            View document
                          </Button>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Contact:</span> +1 555-123-4567
                      </div>
                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full">View Leave History</Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                          {request.employee.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{request.employee.name}</div>
                          <div className="text-xs text-muted-foreground">{request.employee.position}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.type}</Badge>
                    </TableCell>
                    <TableCell>{request.days} day{request.days !== 1 ? 's' : ''}</TableCell>
                    <TableCell>{formatDateRange(request.dateFrom, request.dateTo)}</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>View History</DropdownMenuItem>
                            <DropdownMenuItem>Request Information</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button 
                          size="icon" 
                          variant="outline"
                          className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          size="icon" 
                          className="h-8 w-8 bg-green-500 hover:bg-green-600"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
      
      {/* Bulk Approve section */}
      {filteredRequests.length > 1 && (
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline">
            Bulk Reject
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            Bulk Approve
          </Button>
        </div>
      )}
    </div>
  );
};
