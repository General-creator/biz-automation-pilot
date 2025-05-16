
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, user, isOffline } = useAuth();
  const { toast } = useToast();

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!email || !password) {
      setLoginError("Email and password are required");
      toast({
        title: "Validation error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error: any) {
      // Error is handled in the auth context, but we'll set a friendly message here
      setLoginError(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#4D7C79]/5 to-[#D94A38]/5">
      <div className="w-full max-w-md space-y-6 rounded-lg card-glass p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Orbit</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gradient-orbit">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-[#4D7C79] hover:underline">
              create a new account
            </Link>
          </p>
        </div>
        
        {isOffline && (
          <Alert variant="destructive" className="bg-amber-50 text-amber-900 border-amber-500">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              You are currently offline. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        )}
        
        {loginError && !isOffline && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-slate-300 focus-visible:ring-[#4D7C79]"
                placeholder="Email address"
                disabled={isSubmitting || isOffline}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-slate-300 focus-visible:ring-[#4D7C79]"
                placeholder="Password"
                disabled={isSubmitting || isOffline}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-[#4D7C79] hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4D7C79] to-[#D94A38] hover:from-[#426C69] hover:to-[#C43A28]"
              disabled={isSubmitting || isOffline}
            >
              {isSubmitting ? "Signing in..." : isOffline ? "Offline" : "Sign in"}
            </Button>
          </div>
          
          {!isOffline && (
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Wifi className="w-4 h-4 mr-1" /> Connected to authentication service
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
