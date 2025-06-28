
import { useState, useEffect } from "react";
import { MenuIcon, BellIcon, Search, LogOut, User } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { AdminPortal } from "@/components/AdminPortal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [username, setUsername] = useState("John Doe");
  const navigate = useNavigate();
  
  // Add scroll listener to change header appearance when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    // Clear auth token
    localStorage.removeItem('auth_token');
    // Navigate to login page
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${
      scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="mr-2 lg:hidden">
            <MenuIcon className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gradient-primary mr-2">HR Portal</h1>
            <span className="hidden sm:inline-flex text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
              AI Powered
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees, modules, or help..."
              className="pl-9 bg-muted/50 border-none rounded-full"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Admin Portal positioned before notifications */}
          <AdminPortal />
          
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
          
          <ModeToggle />
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-accent/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-hr-primary flex items-center justify-center text-white">
                  {username.charAt(0)}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{username}</span>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
              sideOffset={8}
            >
              <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-hr-primary flex items-center justify-center text-white">
                  {username.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{username}</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="flex items-center gap-2 p-3 hover:bg-accent/30 transition-colors cursor-pointer">
                <User className="w-4 h-4" />
                <span className="text-sm">Profile Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="flex items-center gap-2 p-3 hover:bg-accent/30 transition-colors cursor-pointer text-red-600 dark:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
