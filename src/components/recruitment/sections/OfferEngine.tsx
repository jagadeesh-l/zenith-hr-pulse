
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DollarSign, Users, Briefcase, TrendingUp, BarChart2 } from "lucide-react";

export function OfferEngine() {
  const [baseSalary, setBaseSalary] = useState<number[]>([125000]);
  const [equityValue, setEquityValue] = useState<number[]>([50000]);
  const [bonusTarget, setBonusTarget] = useState<number[]>([15]);
  const [simulateCounter, setSimulateCounter] = useState<boolean>(false);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Offer Optimization & Negotiation Engine</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Compensation Controls */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Compensation Package Builder</h3>
                
                <Tabs defaultValue="market">
                  <TabsList className="grid grid-cols-2 h-8">
                    <TabsTrigger value="market" className="text-xs px-2">Market Data</TabsTrigger>
                    <TabsTrigger value="internal" className="text-xs px-2">Internal Equity</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-8">
                {/* Base Salary Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <DollarSign size={18} />
                      </div>
                      <span className="font-medium">Base Salary</span>
                    </div>
                    <div className="text-xl font-semibold">
                      ${baseSalary[0].toLocaleString()}
                    </div>
                  </div>
                  
                  <Slider
                    defaultValue={[125000]}
                    max={180000}
                    min={100000}
                    step={1000}
                    value={baseSalary}
                    onValueChange={setBaseSalary}
                    className="mb-1"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$100,000</span>
                    <div className="flex items-center gap-1 text-primary">
                      <TrendingUp size={12} />
                      <span>Market median: $130,000</span>
                    </div>
                    <span>$180,000</span>
                  </div>
                </div>
                
                {/* Equity Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Briefcase size={18} />
                      </div>
                      <span className="font-medium">Equity</span>
                    </div>
                    <div className="text-xl font-semibold">
                      ${equityValue[0].toLocaleString()}
                    </div>
                  </div>
                  
                  <Slider
                    defaultValue={[50000]}
                    max={100000}
                    min={0}
                    step={1000}
                    value={equityValue}
                    onValueChange={setEquityValue}
                    className="mb-1"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$0</span>
                    <div className="flex items-center gap-1 text-primary">
                      <TrendingUp size={12} />
                      <span>Market median: $45,000</span>
                    </div>
                    <span>$100,000</span>
                  </div>
                </div>
                
                {/* Bonus Target Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <BarChart2 size={18} />
                      </div>
                      <span className="font-medium">Bonus Target</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {bonusTarget[0]}%
                    </div>
                  </div>
                  
                  <Slider
                    defaultValue={[15]}
                    max={30}
                    min={0}
                    step={1}
                    value={bonusTarget}
                    onValueChange={setBonusTarget}
                    className="mb-1"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <div className="flex items-center gap-1 text-primary">
                      <TrendingUp size={12} />
                      <span>Market median: 12%</span>
                    </div>
                    <span>30%</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total Compensation</span>
                    <span className="text-2xl font-bold">
                      ${(baseSalary[0] + equityValue[0] + (baseSalary[0] * bonusTarget[0] / 100)).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="w-full">Save Draft</Button>
                    <Button variant="outline" className="w-full">Approve</Button>
                    <Button className="w-full">Generate Offer</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Offer Preview & Negotiation */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Offer Preview</h3>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">
                  92% Acceptance Probability
                </Badge>
              </div>
              
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-3">
                  <span className="text-muted-foreground">Candidate</span>
                  <span className="font-medium">Alexandra Chen</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-muted-foreground">Position</span>
                  <span className="font-medium">Senior Software Engineer</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium">Engineering</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">June 10, 2025</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-muted-foreground">Total Comp</span>
                  <span className="font-bold text-lg">${(baseSalary[0] + equityValue[0] + (baseSalary[0] * bonusTarget[0] / 100)).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Label htmlFor="simulate" className="cursor-pointer mr-2">Simulate Counter-Offer</Label>
                  <Switch id="simulate" checked={simulateCounter} onCheckedChange={setSimulateCounter} />
                </div>
                <Button variant="outline" size="sm">View Full Offer</Button>
              </div>
            </CardContent>
          </Card>
          
          {simulateCounter && (
            <Card className="border-primary/30">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-primary">Counter-Offer Simulation</h3>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
                    Candidate Request
                  </Badge>
                </div>
                
                <div className="border border-primary/30 rounded-lg p-4 bg-primary/5 mb-4">
                  <div className="flex justify-between mb-3">
                    <span className="text-muted-foreground">Base Salary</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${(baseSalary[0] + 10000).toLocaleString()}</span>
                      <Badge variant="outline" className="bg-primary/10">+$10,000</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-muted-foreground">Equity</span>
                    <span className="font-medium">${equityValue[0].toLocaleString()} <span className="text-muted-foreground">(no change)</span></span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-muted-foreground">Bonus Target</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{bonusTarget[0] + 3}%</span>
                      <Badge variant="outline" className="bg-primary/10">+3%</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-muted-foreground">Total Comp</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">${((baseSalary[0] + 10000) + equityValue[0] + ((baseSalary[0] + 10000) * (bonusTarget[0] + 3) / 100)).toLocaleString()}</span>
                      <Badge className="bg-primary">+${((baseSalary[0] + 10000) + equityValue[0] + ((baseSalary[0] + 10000) * (bonusTarget[0] + 3) / 100) - (baseSalary[0] + equityValue[0] + (baseSalary[0] * bonusTarget[0] / 100))).toLocaleString()}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">AI Recommendation</h4>
                  <p className="text-sm">Based on candidate qualifications and market data, I recommend accepting the counter-offer for base salary but keeping the original bonus target. This represents a fair compromise and maintains internal equity.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full">Reject Counter</Button>
                  <Button className="w-full">Accept Counter</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!simulateCounter && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Market Analysis</h3>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span className="text-sm">5 similar roles</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Base Salary Range</span>
                      <span>$110K - $150K</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full"
                        style={{ 
                          width: `${((baseSalary[0] - 100000) / 80000) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span>Your offer</span>
                      <span>{Math.round(((baseSalary[0] - 100000) / 80000) * 100)}% percentile</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Total Compensation</span>
                      <span>$120K - $190K</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full"
                        style={{ 
                          width: `${(((baseSalary[0] + equityValue[0] + (baseSalary[0] * bonusTarget[0] / 100)) - 120000) / 70000) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span>Your offer</span>
                      <span>{Math.round((((baseSalary[0] + equityValue[0] + (baseSalary[0] * bonusTarget[0] / 100)) - 120000) / 70000) * 100)}% percentile</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
