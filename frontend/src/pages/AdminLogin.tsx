import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLogin, useProfile } from "@/hooks/useAuth";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { data: profile, refetch: refetchProfile } = useProfile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      console.log('Starting admin login with:', { email: formData.email });
      const result = await loginMutation.mutateAsync(formData);
      console.log('Login result:', result);
      
      if (result.success && result.data?.user) {
        // Check if user is admin
        if (result.data.user.role === 'admin') {
          console.log('Admin login successful, token set, refetching profile...');
          
          // Ensure profile is refetched with new token
          try {
            await refetchProfile();
            console.log('Profile refetched successfully');
          } catch (profileError) {
            console.warn('Profile refetch failed:', profileError);
          }
          
          console.log('Navigating to admin dashboard...');
          navigate('/admin/dashboard', { replace: true });
        } else {
          setError("Access denied. Admin privileges required.");
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      setError(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="destructive" className="bg-red-600">
              <Shield className="h-4 w-4 mr-2" />
              Administrator Access
            </Badge>
          </div>
          <CardTitle className="text-2xl text-center text-gray-900">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to access the administrative dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@saint.university.edu"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border-red-200 focus:border-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your admin password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="border-red-200 focus:border-red-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In as Admin"}
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            <div className="text-center text-sm text-gray-600">
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Regular User Login
              </Link>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              Need admin access? 
              <Link 
                to="/admin/register" 
                className="text-red-600 hover:text-red-800 font-medium ml-1"
              >
                Register as Admin
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;