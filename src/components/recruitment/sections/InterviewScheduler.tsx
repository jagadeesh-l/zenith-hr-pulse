
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Calendar as CalendarIcon, Users } from "lucide-react";

export function InterviewScheduler() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedCandidate, setSelectedCandidate] = useState<string>("alexandra-chen");
  
  // Mock data
  const availableSlots = [
    {
      time: "10:00 AM - 11:00 AM",
      interviewer: "John Smith",
      available: true,
      suggested: true
    },
    {
      time: "11:30 AM - 12:30 PM",
      interviewer: "Emma Johnson",
      available: true,
      suggested: true
    },
    {
      time: "2:00 PM - 3:00 PM",
      interviewer: "Michael Wong",
      available: true,
      suggested: false
    },
    {
      time: "3:30 PM - 4:30 PM",
      interviewer: "Sarah Peterson",
      available: true,
      suggested: false
    },
    {
      time: "5:00 PM - 6:00 PM",
      interviewer: "David Lee",
      available: true,
      suggested: true
    }
  ];
  
  const interviewQuestions = [
    {
      category: "Technical Skills",
      questions: [
        "Describe your experience with React hooks and context.",
        "How would you optimize the performance of a React application?",
        "Explain the difference between server-side and client-side rendering."
      ]
    },
    {
      category: "Problem Solving",
      questions: [
        "Tell me about a difficult technical problem you solved recently.",
        "How do you approach debugging a complex issue?",
        "Describe your process for refactoring legacy code."
      ]
    },
    {
      category: "Team Collaboration",
      questions: [
        "How do you handle disagreements within your team?",
        "Describe your experience with code reviews.",
        "How do you onboard new team members?"
      ]
    }
  ];
  
  const candidates = [
    { id: "alexandra-chen", name: "Alexandra Chen", position: "Senior Software Engineer" },
    { id: "michael-torres", name: "Michael Torres", position: "Software Engineer" },
    { id: "sarah-johnson", name: "Sarah Johnson", position: "Frontend Developer" },
    { id: "david-lee", name: "David Lee", position: "Full Stack Developer" }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">AI-Assisted Interview Orchestration</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Column */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Select Date</h3>
                <Badge variant="outline" className="bg-primary/10">May 2025</Badge>
              </div>
              
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md p-2 pointer-events-auto"
                disabled={(date) => {
                  // Disable weekends
                  return date.getDay() === 0 || date.getDay() === 6;
                }}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Candidate Selection</h3>
              <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map(candidate => (
                    <SelectItem key={candidate.id} value={candidate.id}>
                      {candidate.name} - {candidate.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedCandidate && (
                <div className="mt-4 p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {candidates.find(c => c.id === selectedCandidate)?.name.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-medium">{candidates.find(c => c.id === selectedCandidate)?.name}</p>
                      <p className="text-xs text-muted-foreground">{candidates.find(c => c.id === selectedCandidate)?.position}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <CalendarIcon size={14} className="text-muted-foreground" />
                      <span>Stage: Technical</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-muted-foreground" />
                      <span>60 min interview</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <Button size="sm" className="w-full">View Full Profile</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Time Slots Column */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Available Time Slots</h3>
                <Select defaultValue="technical">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Interview Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="cultural">Cultural Fit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {availableSlots.map((slot, index) => (
                  <div 
                    key={index}
                    className={`border rounded-xl p-3 transition-all duration-300 ${
                      slot.suggested 
                        ? 'border-primary/20 bg-primary/5' 
                        : 'hover:border-muted-foreground/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{slot.time}</h4>
                      {slot.suggested && (
                        <Badge variant="outline" className="flex gap-1 bg-primary/10 text-primary border-primary/20">
                          <Sparkles size={12} />
                          AI Suggested
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <Users size={14} />
                      <span>Interviewer: {slot.interviewer}</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t flex justify-between">
                      <Button variant="outline" size="sm">Details</Button>
                      <Button size="sm">Schedule</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button className="w-full">Generate More Options</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Question Bank Column */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">AI-Generated Questions</h3>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 flex gap-1">
                  <Sparkles size={12} />
                  Tailored for Candidate
                </Badge>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {interviewQuestions.map((section, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className="font-medium text-primary mb-2">{section.category}</h4>
                    <ul className="space-y-2">
                      {section.questions.map((question, qIndex) => (
                        <li key={qIndex} className="flex gap-2 items-start">
                          <div className="min-w-[20px] h-[20px] rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-medium mt-0.5">
                            {qIndex + 1}
                          </div>
                          <p className="text-sm">{question}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
                <Button className="w-full flex items-center gap-2">
                  <Sparkles size={14} />
                  Regenerate Questions
                </Button>
                <Button variant="outline" className="w-full">Export to PDF</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
