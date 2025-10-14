import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useLogin, useCurrentUser } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { isAuthenticated } = useCurrentUser();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast.info("You are already logged in!");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.success) {
        // Redirect to home page or dashboard
        navigate("/");
      }
    } catch (error) {
      // Error is handled by the useLogin hook
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-saint-bg">
      <Navigation />
      <div className="flex items-center justify-center p-4 pt-24">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-saint-title">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your SAINT account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-saint-body">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-saint-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <Link 
                to="/" 
                className="text-sm text-saint-footer hover:text-saint-body transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;