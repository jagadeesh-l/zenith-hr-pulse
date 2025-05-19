
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Calendar, Download, FileText, Lightbulb, PieChart } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart as RechartsPieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { cn } from "@/lib/utils";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const LeaveAnalytics = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  
  // This would come from an API in a real app
  const monthlyLeaveData = [
    { month: "Jan", annual: 5, sick: 2, personal: 1, unpaid: 0 },
    { month: "Feb", annual: 8, sick: 3, personal: 1, unpaid: 0 },
    { month: "Mar", annual: 12, sick: 4, personal: 2, unpaid: 0 },
    { month: "Apr", annual: 6, sick: 6, personal: 3, unpaid: 1 },
    { month: "May", annual: 9, sick: 4, personal: 1, unpaid: 0 },
    { month: "Jun", annual: 15, sick: 2, personal: 2, unpaid: 0 },
    { month: "Jul", annual: 20, sick: 1, personal: 2, unpaid: 0 },
    { month: "Aug", annual: 18, sick: 3, personal: 3, unpaid: 0 },
    { month: "Sep", annual: 10, sick: 5, personal: 2, unpaid: 1 },
    { month: "Oct", annual: 7, sick: 8, personal: 1, unpaid: 0 },
    { month: "Nov", annual: 5, sick: 4, personal: 1, unpaid: 0 },
    { month: "Dec", annual: 25, sick: 2, personal: 3, unpaid: 2 }
  ];
  
  const leaveTypeTotals = monthlyLeaveData.reduce(
    (acc, month) => {
      acc.annual += month.annual;
      acc.sick += month.sick;
      acc.personal += month.personal;
      acc.unpaid += month.unpaid;
      return acc;
    },
    { annual: 0, sick: 0, personal: 0, unpaid: 0 }
  );
  
  const leaveTypeData = [
    { name: "Annual", value: leaveTypeTotals.annual, color: "#0ea5e9" },
    { name: "Sick", value: leaveTypeTotals.sick, color: "#8b5cf6" },
    { name: "Personal", value: leaveTypeTotals.personal, color: "#f97316" },
    { name: "Unpaid", value: leaveTypeTotals.unpaid, color: "#ef4444" }
  ];
  
  // Leave trend data for year-over-year comparison
  const leaveHistoricalData = [
    { year: "2023", total: 125 },
    { year: "2024", total: 140 },
    { year: "2025", total: 155 }
  ];
  
  // Department leave data
  const departmentLeaveData = [
    { name: "Engineering", value: 55, color: "#0ea5e9" },
    { name: "Design", value: 35, color: "#8b5cf6" },
    { name: "Marketing", value: 25, color: "#f97316" },
    { name: "Finance", value: 20, color: "#ef4444" },
    { name: "HR", value: 10, color: "#22c55e" },
    { name: "Operations", value: 10, color: "#eab308" }
  ];

  // Leave days per employee
  const teamLeaveData = [
    { name: "Sarah Johnson", days: 18, maxDays: 30 },
    { name: "Michael Chen", days: 22, maxDays: 25 },
    { name: "Emily Davis", days: 10, maxDays: 25 },
    { name: "Robert Wilson", days: 8, maxDays: 20 },
    { name: "Jessica Lopez", days: 15, maxDays: 25 },
    { name: "David Kim", days: 20, maxDays: 25 }
  ];
  
  // AI Insights
  const aiInsights = [
    {
      id: 1,
      title: "Leave Trend Alert",
      description: "Sick leaves have increased by 20% this quarter compared to last year. Consider wellness initiatives.",
      icon: "🔔"
    },
    {
      id: 2,
      title: "Team Planning",
      description: "December has the highest leave requests. Plan project deadlines accordingly.",
      icon: "📊"
    },
    {
      id: 3,
      title: "Employee Well-being",
      description: "Engineering team has taken the least personal leave. Encourage work-life balance.",
      icon: "💡"
    }
  ];

  const totalLeaveDays = leaveTypeTotals.annual + leaveTypeTotals.sick + 
                       leaveTypeTotals.personal + leaveTypeTotals.unpaid;

  // Function to safely calculate percentage with type safety
  const calculatePercentage = (value: number): number => {
    return Math.round((value / (totalLeaveDays || 1)) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-wrap justify-between gap-4 items-center">
        <div className="space-x-2 flex">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-x-2">
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export to Excel</TooltipContent>
            </UITooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export to PDF</TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Monthly Leave Distribution Chart */}
      <Card className="hr-card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-primary" />
            Monthly Leave Distribution
          </CardTitle>
          <CardDescription>Number of days taken by leave type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={monthlyLeaveData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="annual" fill="#0ea5e9" name="Annual Leave" />
                <Bar dataKey="sick" fill="#8b5cf6" name="Sick Leave" />
                <Bar dataKey="personal" fill="#f97316" name="Personal Leave" />
                <Bar dataKey="unpaid" fill="#ef4444" name="Unpaid Leave" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Two column layout for smaller charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave Type Distribution */}
        <Card className="hr-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Leave Type Distribution
            </CardTitle>
            <CardDescription>Breakdown by leave category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer
                  config={{
                    annual: { color: "#0ea5e9" },
                    sick: { color: "#8b5cf6" },
                    personal: { color: "#f97316" },
                    unpaid: { color: "#ef4444" }
                  }}
                >
                  <RechartsPieChart>
                    <Pie
                      data={leaveTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {leaveTypeData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent
                          labelKey="name"
                          labelFormatter={(value) => `${value} Leave`}
                          formatter={(value, name) => {
                            const percentage = typeof value === 'number' ? calculatePercentage(value) : 0;
                            return [`${value} days (${percentage}%)`, name];
                          }}
                        />
                      }
                    />
                  </RechartsPieChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Year over year trend */}
        <Card className="hr-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Leave Trend by Year
            </CardTitle>
            <CardDescription>Historical leave usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={leaveHistoricalData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                    name="Total Leave Days"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Department Distribution */}
        <Card className="hr-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              Leave by Department
            </CardTitle>
            <CardDescription>Days taken per team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={departmentLeaveData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" name="Leave Days">
                    {departmentLeaveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Team Leave Usage */}
        <Card className="hr-card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              Top Leave Takers
            </CardTitle>
            <CardDescription>Leave days per employee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={teamLeaveData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip />
                  <Bar dataKey="days" name="Days Taken" fill="#0ea5e9" />
                  <Bar dataKey="maxDays" name="Max Allowed" fill="#e2e8f0" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Insights */}
      <Card className="bg-accent/40 hr-card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-primary" />
            AI-powered Insights
          </CardTitle>
          <CardDescription>Observations and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="flex gap-3">
                <div className="text-2xl">{insight.icon}</div>
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
