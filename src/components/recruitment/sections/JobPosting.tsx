
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Check, Eye, Send, Wand2 } from "lucide-react";

const performanceData = [
  { name: 'LinkedIn', variant1: 28, variant2: 45 },
  { name: 'Indeed', variant1: 22, variant2: 18 },
  { name: 'Glassdoor', variant1: 15, variant2: 12 },
  { name: 'Company Site', variant1: 12, variant2: 9 },
  { name: 'Other', variant1: 8, variant2: 5 },
];

const openPositions = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    openings: 2,
    description: "We're seeking an experienced Software Engineer to join our dynamic team. In this role, you'll develop cutting-edge solutions and work with the latest technologies.",
    requirements: ["5+ years of experience with React, Node.js", "Strong knowledge of software design patterns", "Bachelor's degree in Computer Science or related field"],
    salaryRange: "$120,000 - $150,000"
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time",
    openings: 1,
    description: "Join our product team to drive innovation and create user-centric solutions that make a real impact.",
    requirements: ["3+ years of product management experience", "Strong analytical and communication skills", "Experience with Agile methodologies"],
    salaryRange: "$130,000 - $160,000"
  },
  {
    id: 3,
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Hybrid",
    type: "Full-time",
    openings: 1,
    description: "Drive our marketing initiatives and help grow our brand presence across multiple channels.",
    requirements: ["2+ years of digital marketing experience", "Experience with social media and content marketing", "Bachelor's degree in Marketing or related field"],
    salaryRange: "$60,000 - $80,000"
  }
];

export function JobPosting() {
  const [selectedPosition, setSelectedPosition] = useState(openPositions[0]);
  const [variant1Content, setVariant1Content] = useState({
    title: selectedPosition.title,
    description: selectedPosition.description,
    requirements: selectedPosition.requirements
  });
  const [variant2Content, setVariant2Content] = useState({
    title: `${selectedPosition.title} - Innovation Team`,
    description: "Join our team of talented engineers to create pioneering software solutions. You'll have the freedom to experiment with new technologies and make a real impact.",
    requirements: ["Passion for crafting clean, efficient code with React, Node.js (5+ years)", "Architectural thinking and problem-solving mindset", "Technical background with relevant degree or equivalent experience"]
  });
  const [activeVariant, setActiveVariant] = useState<string>("variant1");
  const [publishReady, setPublishReady] = useState<boolean>(false);
  const [distributionChannels, setDistributionChannels] = useState({
    linkedin: true,
    indeed: true,
    glassdoor: true,
    companyWebsite: true
  });
  
  const handlePositionSelect = (position: typeof openPositions[0]) => {
    setSelectedPosition(position);
    setVariant1Content({
      title: position.title,
      description: position.description,
      requirements: position.requirements
    });
    setVariant2Content({
      title: `${position.title} - Innovation Team`,
      description: "Join our team of talented professionals to create pioneering solutions. You'll have the freedom to experiment with new technologies and make a real impact.",
      requirements: position.requirements.map(req => `Enhanced: ${req}`)
    });
  };

  const handleAIGenerate = () => {
    // Simulate AI enhancement
    setVariant2Content({
      title: `${selectedPosition.title} - Innovation Team`,
      description: "Join our team of talented professionals to create pioneering solutions that shape the future. You'll have the freedom to experiment with cutting-edge technologies and make a meaningful impact on our products and customers.",
      requirements: [
        "Passion for crafting exceptional solutions with modern technologies",
        "Growth mindset and collaborative problem-solving approach",
        "Strong technical foundation with relevant experience or education"
      ]
    });
  };

  const handleChannelToggle = (channel: keyof typeof distributionChannels) => {
    setDistributionChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Smart Job Posting & Candidate Attraction</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Open Positions & Editor */}
        <div>
          {/* Open Positions List */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Open Positions</h3>
              <div className="space-y-3">
                {openPositions.map((position) => (
                  <div
                    key={position.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPosition.id === position.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePositionSelect(position)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-base">{position.title}</h4>
                      <span className="text-sm text-muted-foreground">{position.openings} opening{position.openings > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                      <span>{position.department}</span>
                      <span>{position.location}</span>
                      <span>{position.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{position.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Job Description Editor */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Job Description Editor</h3>
                <Button onClick={handleAIGenerate} variant="outline" size="sm" className="flex items-center gap-2">
                  <Wand2 size={16} />
                  Use AI
                </Button>
              </div>
              
              <Tabs defaultValue="variant1" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="variant1" onClick={() => setActiveVariant("variant1")}>Variant A</TabsTrigger>
                  <TabsTrigger value="variant2" onClick={() => setActiveVariant("variant2")}>Variant B</TabsTrigger>
                </TabsList>
                
                <TabsContent value="variant1" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title1">Job Title</Label>
                      <input
                        id="title1"
                        className="w-full p-2 border rounded-md mt-1"
                        value={variant1Content.title}
                        onChange={(e) => setVariant1Content({...variant1Content, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="desc1">Description</Label>
                      <Textarea
                        id="desc1"
                        className="mt-1 min-h-[100px]"
                        value={variant1Content.description}
                        onChange={(e) => setVariant1Content({...variant1Content, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Requirements</Label>
                      <div className="space-y-2 mt-1">
                        {variant1Content.requirements.map((req, index) => (
                          <input
                            key={index}
                            className="w-full p-2 border rounded-md"
                            value={req}
                            onChange={(e) => {
                              const newReqs = [...variant1Content.requirements];
                              newReqs[index] = e.target.value;
                              setVariant1Content({...variant1Content, requirements: newReqs});
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      AI Analysis: This variant uses standard language and may attract 25-30 applicants.
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="variant2" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title2">Job Title</Label>
                      <input
                        id="title2"
                        className="w-full p-2 border rounded-md mt-1"
                        value={variant2Content.title}
                        onChange={(e) => setVariant2Content({...variant2Content, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="desc2">Description</Label>
                      <Textarea
                        id="desc2"
                        className="mt-1 min-h-[100px]"
                        value={variant2Content.description}
                        onChange={(e) => setVariant2Content({...variant2Content, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Requirements</Label>
                      <div className="space-y-2 mt-1">
                        {variant2Content.requirements.map((req, index) => (
                          <input
                            key={index}
                            className="w-full p-2 border rounded-md"
                            value={req}
                            onChange={(e) => {
                              const newReqs = [...variant2Content.requirements];
                              newReqs[index] = e.target.value;
                              setVariant2Content({...variant2Content, requirements: newReqs});
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-primary">
                      AI Analysis: This variant uses engaging language and may attract 40-45 qualified applicants.
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex items-center justify-between mt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye size={16} />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Job Posting Preview</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {/* Variant A Preview */}
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-2 text-center text-blue-600">Variant A</h3>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="text-base font-semibold mb-2">{variant1Content.title}</h4>
                          <p className="text-sm mb-3">{variant1Content.description}</p>
                          <h5 className="text-sm font-semibold mb-1">Requirements:</h5>
                          <ul className="text-sm list-disc list-inside">
                            {variant1Content.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Variant B Preview */}
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-2 text-center text-green-600">Variant B</h3>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="text-base font-semibold mb-2">{variant2Content.title}</h4>
                          <p className="text-sm mb-3">{variant2Content.description}</p>
                          <h5 className="text-sm font-semibold mb-1">What you'll bring:</h5>
                          <ul className="text-sm list-disc list-inside">
                            {variant2Content.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
        
        {/* Right Column - Distribution Channels Only */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Distribution Channels</h3>
              
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => handleChannelToggle('linkedin')}
                >
                  <span>LinkedIn</span>
                  <Switch checked={distributionChannels.linkedin} />
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => handleChannelToggle('indeed')}
                >
                  <span>Indeed</span>
                  <Switch checked={distributionChannels.indeed} />
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => handleChannelToggle('glassdoor')}
                >
                  <span>Glassdoor</span>
                  <Switch checked={distributionChannels.glassdoor} />
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => handleChannelToggle('companyWebsite')}
                >
                  <span>Company Website</span>
                  <Switch checked={distributionChannels.companyWebsite} />
                </div>
                
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
