import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { getFirstAvailableModuleRoute } from "@/utils/navigation";
import { useMsal } from "@azure/msal-react";

export default function Login() {
  const [loginClicked, setLoginClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { featureFlagStatus, isLoading: flagsLoading } = useFeatureFlags();
  const { instance, accounts } = useMsal();
  
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loginVideoRef = useRef<HTMLVideoElement>(null);
  
  // Set a timeout to navigate to first available module if video playback takes too long
  useEffect(() => {
    if (loginClicked && !flagsLoading) {
      // Fallback navigation after 5 seconds if video doesn't complete
      const fallbackTimer = setTimeout(() => {
        if (loginVideoRef.current) {
          console.log("Fallback navigation triggered");
          const firstAvailableRoute = getFirstAvailableModuleRoute(featureFlagStatus);
          navigate(firstAvailableRoute);
        }
      }, 5000);
      
      return () => clearTimeout(fallbackTimer);
    }
  }, [loginClicked, navigate, flagsLoading, featureFlagStatus]);
  
  // Monitor the login video's completion
  useEffect(() => {
    const loginVideo = loginVideoRef.current;
    
    if (!loginVideo || flagsLoading) return;
    
    const handleLoginVideoEnd = () => {
      const firstAvailableRoute = getFirstAvailableModuleRoute(featureFlagStatus);
      navigate(firstAvailableRoute);
    };
    
    const handleLoginVideoError = () => {
      console.error("Login video playback error");
      const firstAvailableRoute = getFirstAvailableModuleRoute(featureFlagStatus);
      navigate(firstAvailableRoute);
    };
    
    loginVideo.addEventListener('ended', handleLoginVideoEnd);
    loginVideo.addEventListener('error', handleLoginVideoError);
    
    return () => {
      loginVideo.removeEventListener('ended', handleLoginVideoEnd);
      loginVideo.removeEventListener('error', handleLoginVideoError);
    };
  }, [navigate, flagsLoading, featureFlagStatus]);

  const completeLoginWithToken = async (accessToken: string) => {
    // Fetch user profile from Microsoft Graph
    const graphRes = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!graphRes.ok) {
      throw new Error("Failed to fetch profile from Microsoft Graph");
    }
    const profile = await graphRes.json();
    console.log("User Profile:", profile);

    // Persist token (reuse key to minimize downstream changes)
    localStorage.setItem('auth_token', accessToken);

    // Trigger success transition and navigation/video
    setLoginClicked(true);
    if (introVideoRef.current) {
      introVideoRef.current.pause();
      introVideoRef.current.style.display = 'none';
    }
    if (loginVideoRef.current) {
      loginVideoRef.current.style.display = 'block';
      loginVideoRef.current.play().catch(err => {
        console.error("Could not play login video:", err);
        const firstAvailableRoute = getFirstAvailableModuleRoute(featureFlagStatus);
        navigate(firstAvailableRoute);
      });
    }
    toast.success("Login successful! Redirecting to dashboard...");
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Prefer redirect to avoid popup/cookie issues
      await instance.loginRedirect({ scopes: ["User.Read"] });
      // Flow continues after redirect back
    } catch (err: any) {
      // Fallback to popup if redirect fails for some reason
      try {
        const loginResponse = await instance.loginPopup({ scopes: ["User.Read"] });
        await completeLoginWithToken(loginResponse.accessToken);
      } catch (popupErr) {
        console.error("SSO login error:", popupErr);
        toast.error("Microsoft sign-in failed or was cancelled.");
        setIsLoading(false);
      }
    }
  };

  // After redirect, if we have an account, acquire token silently and continue
  useEffect(() => {
    const acquireAndProceed = async () => {
      if (!accounts || accounts.length === 0) return;
      
      // Check if user explicitly logged out - if so, don't auto-login
      const hasLoggedOut = sessionStorage.getItem('user_logged_out');
      if (hasLoggedOut) {
        sessionStorage.removeItem('user_logged_out');
        return;
      }
      
      try {
        const result = await instance.acquireTokenSilent({
          scopes: ["User.Read"],
          account: accounts[0],
        });
        await completeLoginWithToken(result.accessToken);
      } catch (silentErr) {
        // If silent fails, let user click button again
        setIsLoading(false);
      }
    };
    acquireAndProceed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts?.[0]?.homeAccountId]);

  // Animation elements for the background
  const circles = Array.from({ length: 6 }, (_, i) => i);
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-hr-primary/10 to-hr-secondary/5 dark:from-slate-900 dark:to-slate-800 py-4">
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
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      
      {/* Main Content - Split into two columns */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Right side - Video container */}
          <div className="hidden lg:flex items-center justify-center rounded-xl glass-effect p-8 relative overflow-hidden dark:bg-gray-800/30 h-[600px] min-h-[500px]">
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
              style={{ display: 'none' }}
            >
              <source src="/src/video/after login.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          {/* Left side - SSO login */}
          <div className="flex flex-col justify-center min-h-[500px]">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gradient-primary dark:text-white">ZENITH</h1>
              <p className="mt-2 text-sm text-muted-foreground">InfoServices HR Management System</p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 sm:p-8 dark:bg-gray-800/30 dark:border-gray-700/30">
              <div className="space-y-6">
                <Button 
                  type="button" 
                  className="w-full bg-gradient-hr-primary hover:opacity-90" 
                  size="lg"
                  onClick={handleLogin}
                  disabled={isLoading || loginClicked}
                >
                  {isLoading ? "Signing In..." : loginClicked ? "Signed In" : "Sign in with Microsoft"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
