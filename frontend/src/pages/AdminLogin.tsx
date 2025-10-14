import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useAdminLogin, useCurrentUser } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Shield, Lock, UserCheck } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const adminLoginMutation = useAdminLogin();
  const { isAuthenticated } = useCurrentUser();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast.info("You are already logged in!");
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await adminLoginMutation.mutateAsync({ email, password });
      if (result.success) {
        // Redirect to admin dashboard
        navigate("/admin/dashboard");
      }
    } catch (error) {
      // Error is handled by the useAdminLogin hook
      console.error("Admin login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <div className="flex items-center justify-center p-4 pt-24">
        <Card className="w-full max-w-md border-blue-300/20 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <Badge className="w-fit mx-auto mb-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <Lock className="h-3 w-3 mr-1" />
              Admin Access
            </Badge>
            <CardTitle className="text-2xl text-gray-900">
              Administrator Login
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign in with your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Admin Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center text-blue-800 text-sm">
                  <UserCheck className="h-4 w-4 mr-2" />
                  <span className="font-medium">Admin Access Only</span>
                </div>
                <p className="text-blue-700 text-xs mt-1">
                  This portal is restricted to authorized administrators only.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={adminLoginMutation.isPending}
              >
                {adminLoginMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Sign in as Admin
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Need to register as admin?{" "}
                <Link 
                  to="/admin/register" 
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                  onClick={() => sessionStorage.setItem('admin_intent', 'true')}
                >
                  Admin Registration
                </Link>
              </p>
              
              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm text-gray-500">
                  Regular user?{" "}
                  <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                  >
                    User Login
                  </Link>
                </p>
              </div>
              
              <Link 
                to="/" 
                className="inline-block text-sm text-gray-500 hover:text-gray-700 transition-colors"
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

export default AdminLogin;