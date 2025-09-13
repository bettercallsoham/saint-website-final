import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    // TODO: Implement actual registration logic
    console.log("User registration attempt:", formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Add your registration logic here
    }, 1000);
  };

  // Hidden admin access - only for those who know the secret route
  const handleAdminAccess = () => {
    sessionStorage.setItem('admin_intent', 'true');
    window.location.href = '/admin/register';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saint-bg via-saint-bgSecondary to-saint-bg">
      <Navigation />
      <div className="flex items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-saint-title">
            Join SAInT
          </CardTitle>
          <CardDescription className="text-center">
            Create your account and become part of our tech community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="john.doe@university.edu"
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
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-saint-body">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-saint-primary hover:underline font-medium"
              >
                Sign in
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

          {/* Hidden admin access - only visible in dev or for those who know */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleAdminAccess}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              style={{ fontSize: '10px' }}
            >
              •
            </button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Register;