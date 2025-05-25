
import { useState, useEffect } from "react";
import { MenuIcon, BellIcon, Search } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type HeaderProps = {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [username, setUsername] = useState("John Doe");
  
  // Add scroll listener to change header appearance when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-30 w-full transition-all duration-300 ease-in-out",
      "backdrop-blur-md bg-background/80 border-b border-border",
      scrolled ? "shadow-sm" : ""
    )}>
      <div className="container px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuToggle} 
              className="lg:hidden hover:bg-accent/80 transition-colors duration-200"
            >
              <MenuIcon className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HR Portal
              </h1>
              <span className="hidden sm:inline-flex text-xs text-muted-foreground">
                AI Powered
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees, modules, or help..."
              className="pl-9 bg-muted/50 border-none rounded-full focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-accent/80 transition-colors duration-200"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          </Button>
          
          <ModeToggle />
          
          <div className="hidden sm:flex items-center space-x-3 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shadow-md">
              {username.charAt(0)}
            </div>
            <span className="text-sm font-medium">{username}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
