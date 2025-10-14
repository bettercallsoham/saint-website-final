import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Image, Mail, Plus, BarChart3 } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Events Management",
      description: "Create, edit, and manage events",
      icon: Calendar,
      href: "/admin/events",
      stats: "12 Active Events"
    },
    {
      title: "Members Management", 
      description: "View and manage registered members",
      icon: Users,
      href: "/admin/members",
      stats: "156 Total Members"
    },
    {
      title: "Gallery Management",
      description: "Upload and manage photos",
      icon: Image,
      href: "/admin/gallery", 
      stats: "89 Photos"
    },
    {
      title: "Contact Messages",
      description: "View and respond to contact forms",
      icon: Mail,
      href: "/admin/contacts",
      stats: "3 Unread Messages"
    }
  ];

  const quickActions = [
    {
      title: "Create New Event",
      icon: Plus,
      href: "/admin/events/new",
      variant: "default" as const
    },
    {
      title: "Upload Photos",
      icon: Plus,
      href: "/admin/gallery/upload",
      variant: "outline" as const
    },
    {
      title: "View Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      variant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Manage your SAInT website from here.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant={action.variant}
                  onClick={() => navigate(action.href)}
                  className="flex items-center space-x-2"
                >
                  <action.icon className="h-4 w-4" />
                  <span>{action.title}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardCards.map((card) => (
              <Card key={card.title} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(card.href)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{card.stats}</div>
                  <CardDescription>{card.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New member registered</p>
                    <p className="text-xs text-gray-600">John Doe joined 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Event created</p>
                    <p className="text-xs text-gray-600">Workshop on AI was created yesterday</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New contact message</p>
                    <p className="text-xs text-gray-600">Message received 3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;