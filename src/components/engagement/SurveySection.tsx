
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, MessageSquare, ListOrdered, Pencil, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SurveySection() {
  const { toast } = useToast();
  
  const handlePostToFeed = (surveyName: string) => {
    toast({
      title: "Posted to Feed",
      description: `Survey "${surveyName}" has been posted to the team feed!`
    });
  };
  
  const surveys = [
    {
      id: 1,
      title: "Employee Satisfaction",
      description: "Annual survey to measure employee happiness and work environment",
      status: "Draft",
      questions: 15,
      responses: 0,
      dueDate: "2025-06-15",
      badges: ["Annual", "Required"]
    },
    {
      id: 2,
      title: "Team Building Preferences",
      description: "Help us plan the next team building activity",
      status: "Active",
      questions: 8,
      responses: 27,
      dueDate: "2025-05-30",
      badges: ["Optional", "Team"]
    },
    {
      id: 3,
      title: "Remote Work Effectiveness",
      description: "Evaluate how productive our remote work policy has been",
      status: "Completed",
      questions: 12,
      responses: 98,
      dueDate: "2025-05-10",
      badges: ["Quarterly", "Required"]
    },
    {
      id: 4,
      title: "New Software Evaluation",
      description: "Rate the new project management software implementation",
      status: "Active",
      questions: 10,
      responses: 45,
      dueDate: "2025-05-25",
      badges: ["Tech", "Optional"]
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header and New Survey Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Surveys</h2>
          <p className="text-muted-foreground">Create and manage team surveys</p>
        </div>
        <Button className="flex items-center gap-2">
          <Pencil size={16} />
          <span>Create New Survey</span>
        </Button>
      </div>
      
      {/* Survey Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {surveys.map((survey) => (
          <Card key={survey.id} className="border-border hover:shadow-md transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{survey.title}</CardTitle>
                  <CardDescription>{survey.description}</CardDescription>
                </div>
                <Badge variant={
                  survey.status === "Active" ? "default" : 
                  survey.status === "Completed" ? "secondary" : "outline"
                }>
                  {survey.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="ml-2 font-medium">{survey.questions}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Responses:</span>
                  <span className="ml-2 font-medium">{survey.responses}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Due:</span>
                  <span className="ml-2 font-medium">{new Date(survey.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {survey.badges.map((badge, idx) => (
                  <Badge key={idx} variant="outline" className="bg-muted/40">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-border pt-4">
              <Button 
                variant={survey.status === "Draft" ? "outline" : "default"}
                size="sm"
                disabled={survey.status === "Completed"}
              >
                {survey.status === "Draft" ? "Edit Survey" : 
                 survey.status === "Active" ? "View Results" : "View Report"}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePostToFeed(survey.title)}
                  disabled={survey.status === "Draft"}
                >
                  <MessageSquare size={18} />
                </Button>
                <Button variant="ghost" size="icon" disabled={survey.status === "Draft"}>
                  <Share2 size={18} />
                </Button>
                <Button variant="ghost" size="icon" disabled={survey.status !== "Completed"}>
                  <Star size={18} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
