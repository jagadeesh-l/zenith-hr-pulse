
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Send, Bot, Settings, ArrowRight, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Message {
  id: number;
  sender: "bot" | "user";
  content: string;
  timestamp: string;
}

export function CandidateBot() {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      content: "Hello! I'm the recruiting assistant for Zenith HR Pulse. I'd be happy to answer any questions about the Senior Developer role you applied for.",
      timestamp: "12:03 PM"
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  
  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage("");
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        sender: "bot",
        content: "Thank you for your question! The role requires 3+ years of React experience and strong TypeScript skills. Remote work is available 2 days per week, and the salary range is $110K-$140K depending on experience.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Conversational AI Candidate Bot</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Bot Preview */}
        <div>
          <Card className="h-[500px] flex flex-col">
            <CardContent className="pt-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-primary" />
                  <h3 className="text-lg font-medium">Candidate Chat Preview</h3>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">Online</Badge>
              </div>
              
              <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-right mt-1 opacity-70">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Bot Settings */}
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Bot Configuration</h3>
              
              <Tabs defaultValue="personality">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="personality">Personality</TabsTrigger>
                  <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personality" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Tone</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <Button variant="outline" className="bg-primary/10">Professional</Button>
                        <Button variant="outline">Friendly</Button>
                        <Button variant="outline">Casual</Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Conversation Style</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Button variant="outline">Concise</Button>
                        <Button variant="outline" className="bg-primary/10">Detailed</Button>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <Label>Use Emojis</Label>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <Label>Follow-up Questions</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="knowledge" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Knowledge Sources</Label>
                      <div className="mt-2 space-y-2">
                        {["Job Descriptions", "Company Policies", "Benefits Info", "Interview Process"].map(source => (
                          <div key={source} className="flex items-center justify-between p-2 border rounded-lg">
                            <span>{source}</span>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Button className="w-full">
                        <Settings size={16} className="mr-2" />
                        Manage Knowledge Base
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Activation Channel</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Button variant="outline" className="bg-primary/10">Website</Button>
                        <Button variant="outline">Email</Button>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <Label>Collect Contact Info</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <Label>Active Hours Only</Label>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <Label>Human Handoff Option</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Bot Performance</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Questions Answered</span>
                  <span className="font-medium">482</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Response Time</span>
                  <span className="font-medium">2.4s</span>
                </div>
                <div className="flex justify-between">
                  <span>Candidate Satisfaction</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Human Handoff Rate</span>
                  <span className="font-medium">12%</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setShowChat(!showChat)}>
                  Test Bot
                </Button>
                <Button>
                  View Full Analytics
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Test Bot Modal */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-border overflow-hidden flex flex-col z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-primary" />
              <span className="font-medium">Recruitment Bot</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
              <XCircle size={18} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <div className="bg-muted p-3 rounded-2xl rounded-tl-none max-w-[80%]">
              <p className="text-sm">Hello! How can I help you with the Senior Developer role today?</p>
            </div>
          </div>
          
          <div className="p-3 border-t flex gap-2">
            <Input placeholder="Type a message..." className="text-sm" />
            <Button size="icon">
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
