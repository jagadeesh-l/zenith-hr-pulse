
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Check, Eye, EyeOff, Send } from "lucide-react";

const performanceData = [
  { name: 'LinkedIn', variant1: 28, variant2: 45 },
  { name: 'Indeed', variant1: 22, variant2: 18 },
  { name: 'Glassdoor', variant1: 15, variant2: 12 },
  { name: 'Company Site', variant1: 12, variant2: 9 },
  { name: 'Other', variant1: 8, variant2: 5 },
];

export function JobPosting() {
  const [activeVariant, setActiveVariant] = useState<string>("variant1");
  const [publishReady, setPublishReady] = useState<boolean>(false);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Smart Job Posting & Candidate Attraction</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Editor */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Job Description Editor</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="a-b-test">A/B Test</Label>
                  <Switch id="a-b-test" />
                </div>
              </div>
              
              <Tabs defaultValue="variant1" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="variant1" onClick={() => setActiveVariant("variant1")}>Variant A</TabsTrigger>
                  <TabsTrigger value="variant2" onClick={() => setActiveVariant("variant2")}>Variant B</TabsTrigger>
                </TabsList>
                
                <TabsContent value="variant1" className="mt-0 border rounded-lg p-4 min-h-[300px]">
                  <h4 className="text-base font-semibold mb-2">Senior Software Engineer</h4>
                  <p className="text-sm mb-3">
                    We're seeking an experienced Software Engineer to join our dynamic team. In this role, you'll develop cutting-edge solutions and work with the latest technologies.
                  </p>
                  <h5 className="text-sm font-semibold mb-1">Requirements:</h5>
                  <ul className="text-sm list-disc list-inside mb-3">
                    <li>5+ years of experience with React, Node.js</li>
                    <li>Strong knowledge of software design patterns</li>
                    <li>Bachelor's degree in Computer Science or related field</li>
                  </ul>
                  <div className="text-xs text-muted-foreground mt-6">
                    AI Analysis: This variant uses standard language and may attract 25-30 applicants.
                  </div>
                </TabsContent>
                
                <TabsContent value="variant2" className="mt-0 border rounded-lg p-4 min-h-[300px]">
                  <h4 className="text-base font-semibold mb-2">Senior Software Engineer - Innovation Team</h4>
                  <p className="text-sm mb-3">
                    Join our team of talented engineers to create pioneering software solutions. You'll have the freedom to experiment with new technologies and make a real impact.
                  </p>
                  <h5 className="text-sm font-semibold mb-1">What you'll bring:</h5>
                  <ul className="text-sm list-disc list-inside mb-3">
                    <li>Passion for crafting clean, efficient code with React, Node.js (5+ years)</li>
                    <li>Architectural thinking and problem-solving mindset</li>
                    <li>Technical background with relevant degree or equivalent experience</li>
                  </ul>
                  <div className="text-xs text-primary mt-6">
                    AI Analysis: This variant uses engaging language and may attract 40-45 qualified applicants.
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  {activeVariant === "variant1" ? <Eye size={16} /> : <EyeOff size={16} />}
                  Preview
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Save Draft</Button>
                  <Button 
                    size="sm" 
                    onClick={() => setPublishReady(true)}
                    className="flex items-center gap-2"
                  >
                    <Check size={16} />
                    Ready to Publish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Performance Analytics */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Distribution Performance</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="variant1" name="Variant A" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="variant2" name="Variant B" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span>Total Views:</span>
                  <span className="font-medium">184</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Click-Through Rate:</span>
                  <span className="font-medium">8.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Applications Started:</span>
                  <span className="font-medium">32</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Distribution Channels</h3>
              
              <div className="space-y-3">
                {["LinkedIn", "Indeed", "Glassdoor", "Company Website"].map((channel) => (
                  <div key={channel} className="flex items-center justify-between p-3 border rounded-lg">
                    <span>{channel}</span>
                    <Switch defaultChecked={true} />
                  </div>
                ))}
                
                <div className="pt-4">
                  <Button 
                    className="w-full flex items-center gap-2"
                    disabled={!publishReady}
                  >
                    <Send size={16} />
                    Publish Job Posting
                  </Button>
                  {!publishReady && 
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Finalize your job description before publishing
                    </p>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
