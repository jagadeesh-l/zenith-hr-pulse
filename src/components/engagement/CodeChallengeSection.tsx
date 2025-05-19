
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, MessageSquare, ListOrdered, Star, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CodeChallengeSection() {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("active");
  
  const handlePostToFeed = (challengeName: string) => {
    toast({
      title: "Posted to Feed",
      description: `Code Challenge "${challengeName}" has been posted to the team feed!`
    });
  };
  
  const challenges = {
    active: [
      {
        id: 1,
        title: "Optimize Database Queries",
        description: "Improve the performance of our customer database queries",
        difficulty: "Medium",
        participants: 12,
        daysLeft: 5,
        languages: ["SQL", "Python"],
        top3: [
          { name: "David Kim", score: 97 },
          { name: "Emma Wilson", score: 91 },
          { name: "Alex Johnson", score: 86 }
        ]
      },
      {
        id: 2,
        title: "Frontend Component Challenge",
        description: "Build a reusable notification component using React",
        difficulty: "Easy",
        participants: 24,
        daysLeft: 3,
        languages: ["React", "TypeScript"],
        top3: [
          { name: "Sarah Brown", score: 95 },
          { name: "Michael Chen", score: 89 },
          { name: "Emma Wilson", score: 82 }
        ]
      }
    ],
    completed: [
      {
        id: 3,
        title: "API Integration",
        description: "Connect our service with a third-party payment API",
        difficulty: "Hard",
        participants: 8,
        daysLeft: 0,
        languages: ["Node.js", "REST"],
        top3: [
          { name: "Michael Chen", score: 98 },
          { name: "Alex Johnson", score: 94 },
          { name: "David Kim", score: 90 }
        ]
      },
      {
        id: 4,
        title: "Bug Fixing Sprint",
        description: "Find and fix the most critical bugs in our codebase",
        difficulty: "Medium",
        participants: 15,
        daysLeft: 0,
        languages: ["Various"],
        top3: [
          { name: "Emma Wilson", score: 99 },
          { name: "Sarah Brown", score: 95 },
          { name: "Michael Chen", score: 92 }
        ]
      }
    ],
    upcoming: [
      {
        id: 5,
        title: "Security Challenge",
        description: "Identify and fix security vulnerabilities in our authentication system",
        difficulty: "Hard",
        participants: 0,
        daysLeft: 14,
        languages: ["JavaScript", "Node.js", "Security"],
        top3: []
      },
      {
        id: 6,
        title: "Mobile App Optimization",
        description: "Improve the performance of our mobile application",
        difficulty: "Medium",
        participants: 0,
        daysLeft: 10,
        languages: ["Swift", "Kotlin"],
        top3: []
      }
    ]
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Medium": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header and Filter Tabs */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Code Challenges</h2>
          <p className="text-muted-foreground">Sharpen your skills and compete with teammates</p>
        </div>
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Challenge Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {challenges[activeView as keyof typeof challenges].map((challenge) => (
          <Card key={challenge.id} className="border-border hover:shadow-md transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {challenge.title}
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Participants:</span>
                  <span className="ml-2 font-medium">{challenge.participants}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {challenge.daysLeft > 0 ? "Days Left:" : "Status:"}
                  </span>
                  <span className="ml-2 font-medium">
                    {challenge.daysLeft > 0 ? challenge.daysLeft : "Completed"}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {challenge.languages.map((lang, idx) => (
                  <Badge key={idx} variant="outline" className="bg-muted/40">
                    {lang}
                  </Badge>
                ))}
              </div>
              
              {challenge.top3.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <ListOrdered size={16} />
                    <span>Top Performers</span>
                  </h4>
                  <div className="space-y-2">
                    {challenge.top3.map((performer, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          {idx === 0 && <Star className="text-amber-500" size={16} />}
                          <span>{performer.name}</span>
                        </div>
                        <span className="font-medium">{performer.score} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-border pt-4">
              <Button 
                variant={activeView === "upcoming" ? "outline" : "default"}
                size="sm"
                disabled={activeView === "completed"}
              >
                <Code className="mr-2 h-4 w-4" />
                {activeView === "active" ? "Join Challenge" : 
                 activeView === "completed" ? "View Solution" : "Get Notified"}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePostToFeed(challenge.title)}
                  disabled={activeView === "upcoming"}
                >
                  <MessageSquare size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  disabled={activeView === "upcoming"}
                >
                  <Share2 size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  disabled={activeView !== "completed"}
                >
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
