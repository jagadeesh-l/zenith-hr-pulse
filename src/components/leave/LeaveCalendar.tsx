
import { useState } from "react";
import { addMonths, format, getMonth, getYear, parseISO, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LeaveDay = {
  date: string;
  name: string;
  avatar?: string;
  type: "annual" | "sick" | "personal" | "unpaid";
  status: "approved" | "pending" | "rejected";
};

export const LeaveCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"personal" | "team">("personal");
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("all");
  
  // This would come from an API in a real app
  const leaveData: LeaveDay[] = [
    // Personal leaves
    {
      date: "2025-05-20",
      name: "John Doe",
      type: "annual",
      status: "approved"
    },
    {
      date: "2025-05-21",
      name: "John Doe",
      type: "annual",
      status: "approved"
    },
    {
      date: "2025-05-22",
      name: "John Doe",
      type: "annual",
      status: "approved"
    },
    {
      date: "2025-06-10",
      name: "John Doe",
      type: "sick",
      status: "pending"
    },
    // Team leaves
    {
      date: "2025-05-25",
      name: "Sarah Johnson",
      avatar: "SJ",
      type: "personal",
      status: "approved"
    },
    {
      date: "2025-05-26",
      name: "Michael Chen",
      avatar: "MC",
      type: "annual",
      status: "approved"
    },
    {
      date: "2025-05-26",
      name: "Emily Davis",
      avatar: "ED",
      type: "sick",
      status: "approved"
    },
    {
      date: "2025-06-05",
      name: "Robert Wilson",
      avatar: "RW",
      type: "unpaid",
      status: "pending"
    }
  ];
  
  // Filter leaves based on selected type
  const filteredLeaves = selectedLeaveType === "all" 
    ? leaveData 
    : leaveData.filter(leave => leave.type === selectedLeaveType);
  
  // Filter leaves based on view mode
  const displayedLeaves = viewMode === "personal" 
    ? filteredLeaves.filter(leave => leave.name === "John Doe")
    : filteredLeaves;
  
  const handlePreviousMonth = () => {
    setDate(subMonths(date, 1));
  };
  
  const handleNextMonth = () => {
    setDate(addMonths(date, 1));
  };
  
  // Create a map of dates to leave events for easier lookup
  const leaveDaysMap = displayedLeaves.reduce((acc, leave) => {
    if (!acc[leave.date]) {
      acc[leave.date] = [];
    }
    acc[leave.date].push(leave);
    return acc;
  }, {} as Record<string, LeaveDay[]>);
  
  // Custom day rendering for the calendar
  const renderDay = (day: Date) => {
    const dateString = format(day, "yyyy-MM-dd");
    const leaves = leaveDaysMap[dateString];
    
    if (!leaves || leaves.length === 0) return null;
    
    // Determine background color based on leave status and type
    const getLeaveColor = (leave: LeaveDay) => {
      if (leave.status === "pending") return "bg-amber-500";
      if (leave.status === "rejected") return "bg-red-500";
      
      // Approved leaves - color by type
      switch (leave.type) {
        case "annual": return "bg-blue-500";
        case "sick": return "bg-purple-500";
        case "personal": return "bg-orange-500";
        case "unpaid": return "bg-red-500";
        default: return "bg-gray-500";
      }
    };
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full h-full flex justify-center items-center">
              <div className="absolute inset-0 flex justify-center items-center">
                {leaves.length > 0 && (
                  <div className={`w-8 h-8 rounded-full ${getLeaveColor(leaves[0])} opacity-20`} />
                )}
              </div>
              <span className="z-10">{day.getDate()}</span>
              {viewMode === "team" && leaves.length > 0 && (
                <div className="absolute bottom-0 right-0 flex -space-x-1">
                  {leaves.slice(0, 2).map((leave, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full ${getLeaveColor(leave)}`} 
                    />
                  ))}
                  {leaves.length > 2 && (
                    <div className="w-2 h-2 rounded-full bg-gray-500 text-[6px] flex items-center justify-center">
                      +
                    </div>
                  )}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm font-medium">{format(day, "PPPP")}</div>
            {leaves.map((leave, i) => (
              <div key={i} className="text-xs mt-1 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${getLeaveColor(leave)}`} />
                <span>{leave.name} - {leave.type} ({leave.status})</span>
              </div>
            ))}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="annual">Annual Leave</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
              <SelectItem value="personal">Personal Leave</SelectItem>
              <SelectItem value="unpaid">Unpaid Leave</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="view-mode"
              checked={viewMode === "team"}
              onCheckedChange={(checked) => setViewMode(checked ? "team" : "personal")}
            />
            <Label htmlFor="view-mode">
              {viewMode === "personal" ? (
                <span className="flex items-center"><User className="h-4 w-4 mr-1" /> Personal View</span>
              ) : (
                <span className="flex items-center"><Users className="h-4 w-4 mr-1" /> Team View</span>
              )}
            </Label>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Leave Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">
                {format(date, "MMMM yyyy")}
              </div>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="default"
            month={date}
            showOutsideDays={false}
            className="w-full rounded-md border"
            components={{
              Day: ({ date: day, ...props }) => (
                <div {...props}>
                  {renderDay(day) || day.getDate()}
                </div>
              ),
            }}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Leave Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-sm">Annual Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="text-sm">Sick Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-sm">Personal Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-sm">Unpaid Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-sm">Pending Approval</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* List of upcoming leaves */}
      {displayedLeaves.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Leaves ({displayedLeaves.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {displayedLeaves.map((leave, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {viewMode === "team" && leave.avatar && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {leave.avatar}
                      </div>
                    )}
                    <div>
                      {viewMode === "team" && (
                        <div className="font-medium">{leave.name}</div>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{format(parseISO(leave.date), "d MMM yyyy")}</span>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "ml-2",
                            leave.status === "approved" && "border-green-500 text-green-500",
                            leave.status === "pending" && "border-amber-500 text-amber-500",
                            leave.status === "rejected" && "border-red-500 text-red-500",
                          )}
                        >
                          {leave.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      leave.type === "annual" && "bg-blue-500",
                      leave.type === "sick" && "bg-purple-500",
                      leave.type === "personal" && "bg-orange-500",
                      leave.type === "unpaid" && "bg-red-500",
                    )}
                  >
                    {leave.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
