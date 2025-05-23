
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, Mail, Copy, Award, Gift, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const referrers = [
  { 
    name: "Sarah Johnson", 
    position: "Product Manager", 
    referrals: 5, 
    hired: 3,
    points: 1500,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  { 
    name: "Michael Chen", 
    position: "Senior Developer", 
    referrals: 4, 
    hired: 2,
    points: 1000,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  { 
    name: "Emma Wilson", 
    position: "UX Designer", 
    referrals: 3, 
    hired: 2,
    points: 1000,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  { 
    name: "David Lee", 
    position: "Marketing Director", 
    referrals: 3, 
    hired: 1,
    points: 500,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  { 
    name: "Jessica Brown", 
    position: "HR Specialist", 
    referrals: 2, 
    hired: 1,
    points: 500,
    photo: "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  }
];

const rewards = [
  { name: "Company Swag Pack", points: 500, icon: <Gift size={16} /> },
  { name: "Amazon Gift Card", points: 1000, icon: <Gift size={16} /> },
  { name: "Extra PTO Day", points: 1500, icon: <Gift size={16} /> },
  { name: "Tech Gadget", points: 2000, icon: <Gift size={16} /> },
  { name: "Travel Voucher", points: 3000, icon: <Gift size={16} /> }
];

const openPositions = [
  { title: "Senior Software Engineer", department: "Engineering", referralBonus: 2000 },
  { title: "Product Designer", department: "Design", referralBonus: 1500 },
  { title: "Marketing Manager", department: "Marketing", referralBonus: 1500 },
  { title: "Data Scientist", department: "Analytics", referralBonus: 2000 },
  { title: "Sales Representative", department: "Sales", referralBonus: 1000 }
];

export function ReferralSystem() {
  const [emailInput, setEmailInput] = useState<string>("");
  const [referralLink, setReferralLink] = useState<string>("https://careers.company.com/referral?code=ABC123");
  const [showCopied, setShowCopied] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleInvite = () => {
    if (!emailInput || !emailInput.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Invitation Sent!",
      description: `Referral invitation has been sent to ${emailInput}`,
      variant: "default"
    });
    
    setEmailInput("");
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setShowCopied(true);
    
    toast({
      title: "Link Copied!",
      description: "Referral link has been copied to clipboard",
      variant: "default"
    });
    
    setTimeout(() => setShowCopied(false), 2000);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Referral System</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Invite & Share */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Invite a Friend</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter email address"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <Button onClick={handleInvite}>
                      <Mail size={16} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll send them an invitation with your referral link
                  </p>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm mb-2">Or share your referral link</p>
                  <div className="flex gap-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="bg-muted"
                    />
                    <Button variant="outline" onClick={handleCopyLink}>
                      {showCopied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </div>
                </div>
                
                <div className="pt-3">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Share2 size={16} />
                    Share on LinkedIn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Your Referral Stats</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <h4 className="text-3xl font-bold">3</h4>
                  <p className="text-sm text-muted-foreground">Referrals</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <h4 className="text-3xl font-bold">1</h4>
                  <p className="text-sm text-muted-foreground">Hired</p>
                </div>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">Your Points</h4>
                  <span className="font-bold">500</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-muted rounded-full flex-1">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '17%' }} />
                  </div>
                  <span className="text-xs text-muted-foreground">17%</span>
                </div>
                <p className="text-xs mt-2 text-center">500 more points until your next reward</p>
              </div>
              
              <Button className="w-full">View Referral History</Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Middle Column - Leaderboard */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Referral Leaderboard</h3>
                <Badge>Top 5</Badge>
              </div>
              
              <div className="space-y-4">
                {referrers.map((referrer, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="mr-3 w-6 font-bold text-center">
                      {index + 1}.
                    </div>
                    
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={referrer.photo} />
                      <AvatarFallback>{referrer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{referrer.name}</h4>
                      <p className="text-xs text-muted-foreground">{referrer.position}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold">{referrer.referrals}</div>
                      <div className="text-xs text-muted-foreground">Referrals</div>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <div className="font-bold">{referrer.hired}</div>
                      <div className="text-xs text-muted-foreground">Hired</div>
                    </div>
                    
                    <div className="ml-6 text-right flex items-center">
                      <Award size={16} className="text-yellow-500 mr-1" />
                      <span className="font-bold">{referrer.points}</span>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2">
                  <Button variant="ghost" className="w-full">
                    See Full Leaderboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Rewards & Open Positions */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Rewards Catalog</h3>
                
                <Tabs defaultValue="points">
                  <TabsList className="h-8">
                    <TabsTrigger value="points" className="text-xs">Points</TabsTrigger>
                    <TabsTrigger value="cash" className="text-xs">Cash</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-2 mb-4">
                {rewards.map((reward, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        {reward.icon}
                      </div>
                      <span>{reward.name}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="font-bold">{reward.points} pts</span>
                      <ChevronRight size={16} className="ml-2 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full">
                View All Rewards
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Open Positions</h3>
              
              <div className="space-y-2">
                {openPositions.map((position, index) => (
                  <div 
                    key={index} 
                    className="p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">{position.title}</h4>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">
                        ${position.referralBonus}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{position.department}</p>
                    
                    <div className="flex justify-end mt-2">
                      <Button size="sm" variant="ghost" className="text-primary">Refer a Friend</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
