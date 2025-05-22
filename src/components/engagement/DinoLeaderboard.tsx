import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Medal, Trophy } from "lucide-react";
import { generateBeeLeaderboard } from "@/config/games"; // Import the leaderboard generator

interface PlayerStats {
  name: string;
  score: number;
  date: string;
}

export function BeeLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get leaderboard data from localStorage
    const loadLeaderboard = () => {
      const savedScores = localStorage.getItem('beeGameScores');
      if (savedScores) {
        try {
          const scores = JSON.parse(savedScores);
          setLeaderboard(scores);
        } catch (e) {
          console.error("Failed to parse saved scores", e);
          setLeaderboard(generateBeeLeaderboard()); // Use our default leaderboard
        }
      } else {
        // Use the same default leaderboard from config
        const defaultLeaderboard = generateBeeLeaderboard();
        setLeaderboard(defaultLeaderboard);
        localStorage.setItem('beeGameScores', JSON.stringify(defaultLeaderboard));
      }
      setLoading(false);
    };

    loadLeaderboard();

    // Listen for storage events to update leaderboard in real-time across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'beeGameScores') {
        loadLeaderboard();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to render rank icon
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-amber-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <Award className="h-5 w-5 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Top Players</h3>
        <span className="text-sm text-muted-foreground">Updated in real-time</span>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16 font-bold">Rank</TableHead>
              <TableHead className="font-bold">Player</TableHead>
              <TableHead className="text-right font-bold">Score</TableHead>
              <TableHead className="text-right font-bold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((player, index) => (
              <TableRow key={index} className={index < 3 ? "bg-muted/30 hover:bg-muted/40" : "hover:bg-muted/10"}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {getRankIcon(index)}
                    <span className="ml-2">{index + 1}</span>
                  </div>
                </TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell className="text-right font-bold">{player.score}</TableCell>
                <TableCell className="text-right text-muted-foreground">{player.date}</TableCell>
              </TableRow>
            ))}
            {leaderboard.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="space-y-2">
                    <Trophy className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p>No scores yet. Be the first to play!</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-md text-center">
        <p className="text-sm text-muted-foreground">
          Play Bee Game to join the leaderboard!
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Scores are updated in real-time and saved locally
        </p>
      </div>
    </div>
  );
} 