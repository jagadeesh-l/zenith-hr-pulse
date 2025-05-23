
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, Linkedin, FileCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const candidates = [
  { 
    id: 1, 
    name: "Alexandra Chen", 
    position: "Senior Software Engineer", 
    matchScore: 92,
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    experience: "6 years",
    education: "MS Computer Science"
  },
  { 
    id: 2, 
    name: "Michael Torres", 
    position: "Software Engineer", 
    matchScore: 87,
    skills: ["React", "JavaScript", "Python", "Docker"],
    experience: "4 years",
    education: "BS Computer Engineering"
  },
  { 
    id: 3, 
    name: "Sarah Johnson", 
    position: "Frontend Developer", 
    matchScore: 83,
    skills: ["Angular", "TypeScript", "CSS", "UI/UX"],
    experience: "3 years",
    education: "BS Information Systems"
  },
  { 
    id: 4, 
    name: "David Lee", 
    position: "Full Stack Developer", 
    matchScore: 78,
    skills: ["Vue.js", "Node.js", "MongoDB", "Express"],
    experience: "5 years",
    education: "BS Computer Science"
  },
  { 
    id: 5, 
    name: "Emma Wilson", 
    position: "DevOps Engineer", 
    matchScore: 74,
    skills: ["Docker", "Kubernetes", "Jenkins", "AWS"],
    experience: "4 years",
    education: "BS IT"
  }
];

export function ResumeParser() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Automated Resume Parsing & Ranking</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Import Buttons */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Import Candidates</h3>
              
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-auto py-6 flex flex-col items-center justify-center gap-3 border-dashed"
                >
                  <FileUp size={28} className="text-primary" />
                  <div className="text-center">
                    <p className="font-medium">Upload Resume</p>
                    <p className="text-xs text-muted-foreground">Drag & drop or click to browse</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-auto py-6 flex flex-col items-center justify-center gap-3 border-dashed"
                >
                  <Linkedin size={28} className="text-primary" />
                  <div className="text-center">
                    <p className="font-medium">Import from LinkedIn</p>
                    <p className="text-xs text-muted-foreground">Connect your account</p>
                  </div>
                </Button>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Recent Imports</h4>
                <div className="space-y-2">
                  {["resume_john_smith.pdf", "linkedin_export_may10.csv"].map((file) => (
                    <div key={file} className="flex items-center justify-between py-2 px-3 border rounded-lg text-sm">
                      <div className="flex items-center">
                        <FileCheck size={16} className="text-green-500 mr-2" />
                        <span>{file}</span>
                      </div>
                      <Badge variant="outline">Processed</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">AI Settings</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Match Threshold</span>
                    <span className="text-sm font-medium">70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Skill Priority</span>
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Experience Weight</span>
                    <span className="text-sm font-medium">Medium</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                
                <Button className="w-full">Apply Settings</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Candidate List */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Matched Candidates</h3>
              
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div 
                    key={candidate.id}
                    className="border rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-primary/30 cursor-pointer"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">{candidate.position}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex gap-1 mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={14} 
                              className={star <= Math.floor(candidate.matchScore / 20) 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-muted-foreground"} 
                            />
                          ))}
                        </div>
                        <Badge 
                          className={`
                            ${candidate.matchScore >= 90 ? 'bg-green-500' : 
                              candidate.matchScore >= 80 ? 'bg-primary' : 
                              candidate.matchScore >= 70 ? 'bg-amber-500' : 'bg-muted'
                            }
                          `}
                        >
                          {candidate.matchScore}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-primary/10">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Experience: </span>
                        <span className="font-medium">{candidate.experience}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Education: </span>
                        <span className="font-medium">{candidate.education}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t flex justify-between">
                      <Button variant="outline" size="sm">View Profile</Button>
                      <Button size="sm">Contact</Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center">
                  <Button variant="outline">Load More Candidates</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
