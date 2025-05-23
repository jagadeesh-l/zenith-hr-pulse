
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Clock,
  Users,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCcw
} from "lucide-react";

// Mock data
const timeToHireData = [
  { name: 'Jan', engineering: 42, marketing: 30, sales: 35, design: 28 },
  { name: 'Feb', engineering: 40, marketing: 28, sales: 32, design: 26 },
  { name: 'Mar', engineering: 37, marketing: 29, sales: 30, design: 25 },
  { name: 'Apr', engineering: 35, marketing: 26, sales: 28, design: 24 },
  { name: 'May', engineering: 32, marketing: 24, sales: 27, design: 22 }
];

const sourceData = [
  { name: 'LinkedIn', value: 35 },
  { name: 'Referrals', value: 25 },
  { name: 'Job Boards', value: 20 },
  { name: 'Company Site', value: 15 },
  { name: 'Other', value: 5 }
];

const qualityData = [
  { name: 'Avg. Performance', year1: 3.6, year2: 4.2 },
  { name: 'Retention Rate', year1: 65, year2: 78 },
  { name: 'Ramp-up Time', year1: 45, year2: 32 },
  { name: 'Culture Fit', year1: 3.8, year2: 4.5 }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

export function RecruitmentAnalytics() {
  const [timeframe, setTimeframe] = useState<string>("last-6-months");
  const [department, setDepartment] = useState<string>("all");
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Recruitment Analytics & Continuous Learning</h2>
      
      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div>
          <Tabs defaultValue={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="last-6-months">6 Months</TabsTrigger>
              <TabsTrigger value="ytd">YTD</TabsTrigger>
              <TabsTrigger value="last-year">Last Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="ml-auto">
          <Tabs defaultValue={department} onValueChange={setDepartment}>
            <TabsList>
              <TabsTrigger value="all">All Depts</TabsTrigger>
              <TabsTrigger value="engineering">Engineering</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Time to Hire</p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold mr-2">32 days</h3>
                  <Badge className="bg-green-500 flex items-center">
                    <TrendingDown size={12} className="mr-1" /> 22%
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Clock size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Offer Acceptance</p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold mr-2">82%</h3>
                  <Badge className="bg-green-500 flex items-center">
                    <TrendingUp size={12} className="mr-1" /> 5%
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Quality of Hire</p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold mr-2">4.2/5</h3>
                  <Badge className="bg-green-500 flex items-center">
                    <TrendingUp size={12} className="mr-1" /> 0.4
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Lightbulb size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Open Positions</p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold mr-2">18</h3>
                  <Badge className="bg-amber-500 flex items-center">
                    <TrendingUp size={12} className="mr-1" /> 3
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Time to Hire by Department</h3>
              <Badge variant="outline">Days</Badge>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeToHireData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="engineering" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="marketing" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="sales" stroke="#ffc658" strokeWidth={2} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="design" stroke="#ff8042" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Candidate Source Effectiveness</h3>
              <Badge variant="outline">% of Hires</Badge>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Quality of Hire Metrics</h3>
              <Badge variant="outline">Year-over-Year Comparison</Badge>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="year1" name="Prior Year" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="year2" name="Current" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Insights and Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">AI-Generated Insights</h3>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg border">
                <div className="flex gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <TrendingDown size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium">Time to Hire Improvement</h4>
                    <p className="text-sm text-muted-foreground">
                      The average time-to-hire has decreased by 22% over the past quarter, primarily due to the implementation of automated screening processes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border">
                <div className="flex gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium">Referral Program Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      Employee referrals have become the second most effective source for quality hires, with referred candidates showing 35% higher retention rates after one year.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border">
                <div className="flex gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Lightbulb size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium">Skill Gap Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      There is a growing gap in cloud architecture skills within the engineering department. Consider prioritizing this skill in upcoming hiring initiatives or investing in upskilling current team members.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Actions</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download size={16} className="mr-2" />
                Export Analytics
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <RefreshCcw size={16} className="mr-2" />
                Retrain AI Models
              </Button>
              
              <div className="p-3 rounded-lg bg-muted mt-4">
                <p className="text-xs text-center">
                  AI models last retrained: <span className="font-medium">May 10, 2025</span>
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Recommended Improvements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                    1
                  </div>
                  <span>Enhance technical screening process</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                    2
                  </div>
                  <span>Expand referral program incentives</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                    3
                  </div>
                  <span>Optimize job descriptions for cloud skills</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
