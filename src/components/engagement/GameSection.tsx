
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, MessageSquare, Star, ListOrdered, Clock, Award, GamepadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function GameSection() {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimer(seconds => {
          // Alert if 15 minutes have passed (900 seconds)
          if (seconds >= 899) {
            setIsActive(false);
            toast({
              title: "Time's up!",
              description: "You've been playing for 15 minutes. Time to get back to work!",
              variant: "destructive"
            });
            return 0;
          }
          return seconds + 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, toast]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartGame = (gameType: string) => {
    setIsActive(true);
    toast({
      title: `Starting ${gameType}`,
      description: "Timer started. You'll be reminded after 15 minutes."
    });
  };

  const handleShareToFeed = (gameType: string) => {
    toast({
      title: "Shared to Feed",
      description: `You've shared your ${gameType} activity to the team feed!`
    });
  };

  const games = [
    {
      id: 1,
      title: "Team Trivia",
      description: "Test your knowledge about company facts and industry trends",
      image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      leaderboard: [
        { name: "Alex Johnson", score: 85 },
        { name: "Emma Wilson", score: 79 },
        { name: "Michael Chen", score: 72 },
      ]
    },
    {
      id: 2,
      title: "Word Puzzle",
      description: "Challenge your vocabulary with company-related word puzzles",
      image: "https://images.unsplash.com/photo-1606677661991-446cea8ee182?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      leaderboard: [
        { name: "Sarah Brown", score: 92 },
        { name: "David Kim", score: 88 },
        { name: "Alex Johnson", score: 75 },
      ]
    },
    {
      id: 3,
      title: "Memory Match",
      description: "Test your memory by matching company products and services",
      image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      leaderboard: [
        { name: "Emma Wilson", score: 95 },
        { name: "Michael Chen", score: 90 },
        { name: "Sarah Brown", score: 82 },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Timer Section */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-border mb-6">
        <div className="flex items-center space-x-4">
          <Clock className="text-primary" size={24} />
          <div>
            <h3 className="text-lg font-medium">Session Timer</h3>
            <p className="text-muted-foreground text-sm">Time spent gaming</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold">{formatTime(timer)}</div>
          <Button 
            variant={isActive ? "destructive" : "default"} 
            size="sm" 
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>
      
      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={game.image} 
                alt={game.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award size={14} />
                  <span>Active</span>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <ListOrdered size={16} />
                  <span>Leaderboard</span>
                </h4>
                <div className="space-y-2">
                  {game.leaderboard.map((leader, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Star className="text-amber-500" size={16} />}
                        <span>{leader.name}</span>
                      </div>
                      <span className="font-medium">{leader.score} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-border pt-4">
              <Button size="sm" onClick={() => handleStartGame(game.title)}>
                <GamepadIcon className="mr-1 h-4 w-4" />
                Play Now
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleShareToFeed(game.title)}>
                  <MessageSquare size={18} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 size={18} />
                </Button>
                <Button variant="ghost" size="icon">
                  <ListOrdered size={18} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
