
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Calendar as CalendarIcon, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button"; // Added missing Button import

export const LeaveOverview = () => {
  const { toast } = useToast();
  const [highlightedType, setHighlightedType] = useState<string | null>(null);
  
  const leaveBalanceData = [
    { name: "Annual", total: 21, used: 12, remaining: 9, color: "#0ea5e9" },
    { name: "Sick", total: 10, used: 3, remaining: 7, color: "#8b5cf6" },
    { name: "Personal", total: 5, used: 2, remaining: 3, color: "#f97316" },
    { name: "Unpaid", total: 0, used: 1, remaining: -1, color: "#ef4444" }
  ];
  
  const leaveDistribution = [
    { name: "Annual", value: 12, color: "#0ea5e9" },
    { name: "Sick", value: 3, color: "#8b5cf6" },
    { name: "Personal", value: 2, color: "#f97316" },
    { name: "Unpaid", value: 1, color: "#ef4444" }
  ];
  
  const holidaysData = [
    { name: "New Year's Day", date: "Jan 1, 2025", days: 3 },
    { name: "Memorial Day", date: "May 26, 2025", days: 15 },
    { name: "Independence Day", date: "Jul 4, 2025", days: 54 },
    { name: "Labor Day", date: "Sep 1, 2025", days: 113 }
  ];
  
  const teamOnLeave = [
    { name: "Sarah Johnson", avatar: "SJ", type: "Annual", days: "Today - Friday" },
    { name: "Michael Chen", avatar: "MC", type: "Sick", days: "Today only" },
    { name: "Emily Davis", avatar: "ED", type: "Personal", days: "Today - Tomorrow" }
  ];

  const handleClaimReminder = () => {
    toast({
      title: "Reminder set!",
      description: "We'll remind you to claim your leaves before they lapse."
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalanceData.map((leave) => (
          <Card key={leave.name} className="hr-card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                {leave.name} Leave
              </CardTitle>
              <CardDescription>
                {leave.remaining} days remaining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {leave.used}</span>
                  <span>Total: {leave.total}</span>
                </div>
                <Progress value={(leave.used / (leave.total || 1)) * 100} className="h-2" 
                  style={{ backgroundColor: `${leave.color}30` }}
                />
                {leave.remaining < 5 && (
                  <p className="text-xs text-amber-500 flex items-center mt-1">
                    <Zap size={12} className="mr-1" />
                    Low balance! Plan your leaves carefully.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Distribution Chart */}
        <Card className="lg:col-span-1 hr-card-hover">
          <CardHeader>
            <CardTitle>Leave Distribution</CardTitle>
            <CardDescription>By leave type</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer
                  config={{
                    annual: { color: "#0ea5e9" },
                    sick: { color: "#8b5cf6" },
                    personal: { color: "#f97316" },
                    unpaid: { color: "#ef4444" }
                  }}
                >
                  <PieChart>
                    <Pie
                      data={leaveDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      onMouseEnter={(_, index) => setHighlightedType(leaveDistribution[index].name)}
                      onMouseLeave={() => setHighlightedType(null)}
                    >
                      {leaveDistribution.map((entry) => (
                        <Cell 
                          key={entry.name} 
                          fill={entry.color} 
                          opacity={highlightedType === null || highlightedType === entry.name ? 1 : 0.5}
                        />
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
                          labelFormatter={(value) => `${value} Leave`}
                          formatter={(value, name) => [`${value} days (${Math.round((value / 18) * 100)}%)`, name]}
                        />
                      }
                    />
                  </PieChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Holidays */}
        <Card className="lg:col-span-1 hr-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Upcoming Holidays
            </CardTitle>
            <CardDescription>Plan your extended weekends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {holidaysData.map((holiday) => (
              <div key={holiday.name} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{holiday.name}</p>
                  <p className="text-sm text-muted-foreground">{holiday.date}</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-sm px-2 py-1 bg-muted rounded-md">
                        {holiday.days} days
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Days until holiday</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Team on Leave */}
        <Card className="lg:col-span-1 hr-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Team on Leave Today
            </CardTitle>
            <CardDescription>Who's out of office</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {teamOnLeave.length > 0 ? (
              teamOnLeave.map((member) => (
                <div key={member.name} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 text-sm">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.type} Leave</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {member.days}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <CalendarIcon className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">No team members on leave today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reminders and Suggestions */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full mr-3">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium">5 annual leave days will expire in December</p>
            <p className="text-sm text-muted-foreground">Plan your time off before your leave balance lapses</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleClaimReminder}>
          Remind Me
        </Button>
      </div>
    </div>
  );
};

