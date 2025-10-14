import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Code2, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { AnimatedUnderline } from "./InteractiveElements";
import { useCurrentUser, useLogout, useForceLogout } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, isAdmin } = useCurrentUser();
  const logoutMutation = useLogout();
  const forceLogout = useForceLogout();

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Events", to: "/events" },
    { label: "Members", to: "/members" },
    { label: "Gallery", to: "/gallery" },
    { label: "Contact", to: "/contact" },
    ...(isAdmin ? [{ label: "Admin Dashboard", to: "/admin/dashboard" }] : []),
  ];

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // If regular logout fails (invalid token, etc.), force logout
      forceLogout();
      navigate('/');
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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

          {/* Auth Section & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={""} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                          {user?.name ? getUserInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        {user?.role === 'admin' && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            Admin
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{logoutMutation.isPending ? 'Logging out...' : 'Log out'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 smooth-transition hover-shadow rounded-xl"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Login
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate('/login')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>User Login</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/login')}>
                        <Settings className="mr-2 h-4 w-4 text-purple-600" />
                        <span className="text-purple-600">Admin Login</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link to="/register">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover-shadow smooth-transition rounded-xl px-6"
                    >
                      Join Us
                    </Button>
                  </Link>
                </>
              )}
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
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={""} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                          {user?.name ? getUserInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <span className="text-xs text-gray-600">{user?.email}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-medium rounded-xl hover-shadow"
                        onClick={() => {
                          navigate('/admin');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium rounded-xl hover-shadow"
                      onClick={() => {
                        navigate('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium rounded-xl hover-shadow text-red-600 hover:text-red-700"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start font-medium rounded-xl hover-shadow">
                        <User className="h-4 w-4 mr-2" />
                        User Login
                      </Button>
                    </Link>
                    <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start font-medium rounded-xl hover-shadow text-purple-600 hover:text-purple-700">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-medium rounded-xl hover-shadow">
                        Join Us
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;