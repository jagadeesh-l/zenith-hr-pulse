import { useState, useRef, useEffect } from "react";
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
  const [loginClicked, setLoginClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loginVideoRef = useRef<HTMLVideoElement>(null);
  
  // Set a timeout to navigate to dashboard if video playback takes too long
  useEffect(() => {
    if (loginClicked) {
      // Fallback navigation after 5 seconds if video doesn't complete
      const fallbackTimer = setTimeout(() => {
        if (loginVideoRef.current) {
          console.log("Fallback navigation triggered");
          navigate("/dashboard");
        }
      }, 5000);
      
      return () => clearTimeout(fallbackTimer);
    }
  }, [loginClicked, navigate]);
  
  // Monitor the login video's completion
  useEffect(() => {
    const loginVideo = loginVideoRef.current;
    
    if (!loginVideo) return;
    
    const handleLoginVideoEnd = () => {
      navigate("/dashboard");
    };
    
    const handleLoginVideoError = () => {
      console.error("Login video playback error");
      navigate("/dashboard");
    };
    
    loginVideo.addEventListener('ended', handleLoginVideoEnd);
    loginVideo.addEventListener('error', handleLoginVideoError);
    
    return () => {
      loginVideo.removeEventListener('ended', handleLoginVideoEnd);
      loginVideo.removeEventListener('error', handleLoginVideoError);
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create form data
      const formData = new FormData();
      formData.append('username', email); // Note: using 'username' as the field name
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        body: formData, // Send as FormData
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);

      // Show video after successful login
      setShowVideo(true);

      // Play the video
      setTimeout(() => {
        if (loginVideoRef.current) {
          loginVideoRef.current.play().catch(() => {
            navigate('/dashboard');
          });
        }
      }, 100); // slight delay to ensure video is rendered
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation elements for the background
  const circles = Array.from({ length: 6 }, (_, i) => i);
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-hr-primary/10 to-hr-secondary/5 dark:from-slate-900 dark:to-slate-800">
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
          {/* Right side - Video container */}
          <div className="hidden lg:flex items-center justify-center rounded-xl glass-effect p-8 relative overflow-hidden dark:bg-gray-800/30">
            {/* Intro Video - Always playing until login */}
            <video 
              ref={introVideoRef}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover absolute inset-0"
              style={{ display: loginClicked ? 'none' : 'block' }}
            >
              <source src="/src/video/Start.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Login Success Video - Plays after clicking login */}
            <video 
              ref={loginVideoRef}
              muted
              className="w-full h-full object-cover absolute inset-0"
              style={{ display: showVideo ? 'block' : 'none' }}
            >
              <source src="/src/video/after login.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          {/* Left side - Login form */}
          <div>
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gradient-primary dark:text-white">HR Portal</h1>
              <p className="mt-2 text-sm text-muted-foreground">Log in to access the HR management system</p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 sm:p-8 dark:bg-gray-800/30 dark:border-gray-700/30">
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
                    className="w-full rounded-xl bg-white/50 dark:bg-gray-800/50 dark:border-gray-700 input-glow"
                    disabled={isLoading || loginClicked}
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
                      className="w-full rounded-xl bg-white/50 dark:bg-gray-800/50 dark:border-gray-700 input-glow pr-10"
                      disabled={isLoading || loginClicked}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={togglePasswordVisibility}
                      tabIndex={-1}
                      disabled={isLoading || loginClicked}
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
                      disabled={isLoading || loginClicked}
                    />
                    <label htmlFor="remember-me" className="text-sm">
                      Remember me
                    </label>
                  </div>
                  
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-hr-primary hover:opacity-90" 
                  size="lg"
                  disabled={isLoading || loginClicked}
                >
                  {isLoading ? "Signing In..." : loginClicked ? "Signed In" : "Sign In"}
                </Button>
                
                {/* Demo credentials */}
                <div className="text-center text-sm text-muted-foreground mt-4">
                  <p>Demo login: admin@example.com / admin123</p>
                  <p>or: user@example.com / user123</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
