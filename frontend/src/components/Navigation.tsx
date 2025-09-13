import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2, User } from "lucide-react";
import { AnimatedUnderline } from "./InteractiveElements";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Events", to: "/events" },
    { label: "Members", to: "/members" },
    { label: "Gallery", to: "/gallery" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect modern-shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group smooth-transition hover:scale-105">
            {/* Logo image container - ready for logo file */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* SAInT Logo */}
                {!logoError ? (
                  <img 
                    src="/saint-logo.png" 
                    alt="SAInT Logo - Student Associate of Information Technology" 
                    className="h-12 w-12 object-contain smooth-transition group-hover:scale-110"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 smooth-transition shadow-lg">
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                SAInT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`font-medium text-gray-700 hover:text-gray-900 smooth-transition py-2 ${
                  location.pathname === item.to ? 'text-gray-900' : ''
                }`}
              >
                <AnimatedUnderline isActive={location.pathname === item.to}>
                  {item.label}
                </AnimatedUnderline>
              </Link>
            ))}
          </div>

          {/* Auth Buttons & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 smooth-transition hover-shadow rounded-xl"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover-shadow smooth-transition rounded-xl px-6"
                >
                  Join Us
                </Button>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 smooth-transition hover-shadow"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-900" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`font-medium text-gray-700 hover:text-gray-900 smooth-transition py-3 px-4 rounded-xl hover:bg-gray-100 hover-shadow ${
                    location.pathname === item.to ? 'text-gray-900 bg-gray-100' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 mt-4 border-t border-gray-200">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-medium rounded-xl hover-shadow">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-medium rounded-xl hover-shadow">
                    Join Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;