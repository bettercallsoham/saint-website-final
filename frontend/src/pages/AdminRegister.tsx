import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useAdminRegister } from "@/hooks/useAuth";

const AdminRegister = () => {
  const [step, setStep] = useState<'verify' | 'register'>('verify');
  const [secretKey, setSecretKey] = useState("");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const adminRegisterMutation = useAdminRegister();

  // Secret admin verification key (in production, this would be environment-based)
  const ADMIN_SECRET = "SAINT_ADMIN_2025_SECURE";

  useEffect(() => {
    // Set admin intent when component mounts to allow direct navigation
    sessionStorage.setItem('admin_intent', 'true');
  }, []);

  const handleSecretVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey === ADMIN_SECRET) {
      setStep('register');
      sessionStorage.setItem('admin_verified', 'true');
    } else {
      alert("Invalid secret key. Only verified administrators can access this page.");
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
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    try {
      // Use the admin registration API
      const adminData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        adminSecret: ADMIN_SECRET
      };

      const result = await adminRegisterMutation.mutateAsync(adminData);
      
      if (result.success && result.data?.user) {
        sessionStorage.removeItem('admin_verified');
        sessionStorage.removeItem('admin_intent');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error("Admin registration error:", error);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saint-bg via-saint-bgSecondary to-saint-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-saint-title">
              Admin Access Required
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saint-bg via-saint-bgSecondary to-saint-bg flex items-center justify-center p-4">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
  );
};

export default AdminRegister;