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
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-30 w-full transition-all duration-300",
      "bg-background border-b",
      scrolled ? "shadow-sm" : ""
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 flex-1">
          {onMenuToggle && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuToggle} 
              className="lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          )}
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules, employees, or help..."
              className="pl-9 w-full bg-muted/30 border-muted"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          
          <ModeToggle />
          
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l">
            <div className="h-8 w-8 rounded-full bg-gradient-hr-primary flex items-center justify-center text-primary-foreground">
              {username.charAt(0)}
            </div>
            <span className="text-sm font-medium">{username}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
