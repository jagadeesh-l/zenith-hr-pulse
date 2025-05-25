
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
      "backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-700",
      scrolled ? "shadow-sm" : ""
    )}>
      <div className="container px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuToggle} 
              className="lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              <MenuIcon className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-teal-600 dark:text-teal-400">
                HR Portal
              </h1>
              <span className="hidden sm:inline-flex text-xs text-slate-500 dark:text-slate-400">
                AI Powered
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search employees, modules, or help..."
              className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-full focus-visible:ring-2 focus-visible:ring-teal-500/50 transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
          </Button>
          
          <ModeToggle />
          
          <div className="hidden sm:flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
              {username.charAt(0)}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{username}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
