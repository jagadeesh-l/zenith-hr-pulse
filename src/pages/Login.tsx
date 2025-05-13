
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Password validation
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    
    // In a real app, you would authenticate with your backend here
    toast.success("Login successful!");
    navigate("/dashboard");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation elements for the background
  const circles = Array.from({ length: 6 }, (_, i) => i);
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-hr-primary/10 to-hr-secondary/5">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 z-0 opacity-50">
        {circles.map((i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-gradient-hr-primary opacity-${20 + i * 10} animate-float animation-delay-${i * 200}`}
            style={{
              width: `${50 + i * 40}px`,
              height: `${50 + i * 40}px`,
              top: `${10 + (i % 3) * 30}%`,
              left: `${5 + (i % 4) * 25}%`,
            }}
          />
        ))}
      </div>
      
      {/* Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      
      {/* Main Content - Split into two columns */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Game space */}
          <div className="hidden lg:flex items-center justify-center rounded-xl glass-effect p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gradient-primary mb-4">Future Game Space</h2>
              <p className="text-muted-foreground">This area will contain an interactive game implemented by the backend team.</p>
            </div>
          </div>
          
          {/* Right side - Login form */}
          <div>
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">HR Portal</h1>
              <p className="mt-2 text-sm text-muted-foreground">Log in to access the HR management system</p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-xl bg-white/50 dark:bg-gray-800/50 input-glow"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl bg-white/50 dark:bg-gray-800/50 input-glow pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <label htmlFor="remember-me" className="text-sm">
                      Remember me
                    </label>
                  </div>
                  
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                
                <Button type="submit" className="w-full bg-gradient-hr-primary hover:opacity-90" size="lg">
                  Sign In
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Illustration - Removed since we have the game space now */}
    </div>
  );
}
