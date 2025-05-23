
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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

const workflowSteps = [
  { id: "step-1", title: "Department Request", status: "completed" },
  { id: "step-2", title: "HR Review", status: "completed" },
  { id: "step-3", title: "Budget Approval", status: "current" },
  { id: "step-4", title: "Job Description", status: "pending" },
  { id: "step-5", title: "Final Approval", status: "pending" },
];

export function JobRequisition() {
  const [headcount, setHeadcount] = useState<number[]>([28]);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">AI-Driven Job Requisition & Forecasting</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <Card className="mb-6">
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
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Headcount Controls</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Headcount Target</span>
                    <span className="text-sm font-medium">{headcount[0]}</span>
                  </div>
                  <Slider
                    defaultValue={[28]}
                    max={50}
                    min={10}
                    step={1}
                    value={headcount}
                    onValueChange={setHeadcount}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">10</span>
                    <span className="text-xs text-primary">Auto-suggested: 30</span>
                    <span className="text-xs text-muted-foreground">50</span>
                  </div>
                </div>
                
                <div>
                  <Button className="w-full">Generate Requisition Plan</Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    AI will optimize requisitions based on business needs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Approval Workflow</h3>
              
              <div className="space-y-6">
                <div className="relative">
                  {/* Vertical line connecting steps */}
                  <div className="absolute left-3 top-3 w-0.5 h-[calc(100%-24px)] bg-muted z-0"></div>
                  
                  {/* Workflow steps */}
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className="relative flex items-start z-10">
                      <div className={`size-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-500' :
                        step.status === 'current' ? 'bg-primary' : 'bg-muted'
                      } text-white`}>
                        {step.status === 'completed' ? '✓' : index + 1}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className={`p-3 rounded-xl ${
                          step.status === 'current' ? 'bg-primary/10 border border-primary/30' :
                          step.status === 'completed' ? 'bg-green-500/10 border border-green-500/30' :
                          'bg-muted/30 border border-muted'
                        }`}>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {step.status === 'completed' ? 'Completed' :
                             step.status === 'current' ? 'In Progress' : 'Waiting'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full mb-2">Approve Current Step</Button>
                  <Button variant="ghost" className="w-full">View Complete History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
