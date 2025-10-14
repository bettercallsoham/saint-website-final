import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useCurrentUser, useAdminRegister } from "@/hooks/useAuth";
import { Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminRegister = () => {
  const [step, setStep] = useState<'verify' | 'register'>('verify');
  const [secretKey, setSecretKey] = useState("");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: ""
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useCurrentUser();
  const adminRegisterMutation = useAdminRegister();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast.info("You are already logged in!");
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Secret admin verification key (must match backend ADMIN_CODE)
  const ADMIN_SECRET = "saint-admin-2024";

  useEffect(() => {
    // Set admin intent when accessing this page directly
    sessionStorage.setItem('admin_intent', 'true');
  }, []);

  const handleSecretVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey === ADMIN_SECRET) {
      setStep('register');
      setFormData(prev => ({ ...prev, adminCode: secretKey }));
      sessionStorage.setItem('admin_verified', 'true');
    } else {
      toast.error("Invalid secret key. Only verified administrators can access this page.");
      setSecretKey("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.adminCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Use the admin registration API
      const adminData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adminCode: formData.adminCode
      };

      const result = await adminRegisterMutation.mutateAsync(adminData);
      
      if (result.success) {
        sessionStorage.removeItem('admin_verified');
        sessionStorage.removeItem('admin_intent');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      // Error is handled by the useAdminRegister hook
      console.error("Admin registration error:", error);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="flex items-center justify-center p-4 pt-24">
        <Card className="w-full max-w-md border-red-200 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-saint-title">
              🔐 Admin Registration Portal
            </CardTitle>
            <CardDescription className="text-center">
              This is a restricted area. Only verified administrators can proceed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSecretVerification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secretKey">Administrator Secret Key</Label>
                <div className="relative">
                  <Input
                    id="secretKey"
                    type={showSecretKey ? "text" : "password"}
                    placeholder="Enter admin secret key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-saint-body hover:text-saint-title"
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white">
                Verify Access
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Link 
                to="/register" 
                className="text-sm text-saint-body hover:text-saint-title transition-colors"
              >
                ← Back to user registration
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <div className="flex items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-md border-red-200 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="default" className="bg-red-500">
              <Shield className="h-4 w-4 mr-2" />
              Administrator Registration
            </Badge>
          </div>
          <CardTitle className="text-2xl text-center text-saint-title">
            Create Admin Account
          </CardTitle>
          <CardDescription className="text-center">
            Register a new administrator for the SAINT system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@saint.university.edu"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminCode">Admin Code (Verified)</Label>
              <Input
                id="adminCode"
                name="adminCode"
                type="text"
                placeholder="Admin verification code"
                value={formData.adminCode}
                readOnly
                className="bg-gray-100 text-gray-600"
              />
              <p className="text-xs text-green-600">
                ✓ Admin code verified successfully
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600 text-white" 
              disabled={adminRegisterMutation.isPending}
            >
              {adminRegisterMutation.isPending ? "Creating Admin Account..." : "Create Administrator Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-saint-body hover:text-saint-title transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default AdminRegister;