import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Calendar, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Edit, 
  Trash2,
  Eye,
  BarChart3,
  UserCheck,
  Shield,
  Activity,
  TrendingUp,
  Clock,
  MapPin,
  User
} from "lucide-react";
import { useProfile, useLogout } from "@/hooks/useAuth";
import { useEvents, useCreateEvent } from "@/hooks/useEvents";
import { useMembers } from "@/hooks/useMembers";
import { useUsers } from "@/hooks/useUsers";
import { useAllRSVPs } from "@/hooks/useRSVP";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: rsvps, isLoading: rsvpsLoading } = useAllRSVPs();
  const logoutMutation = useLogout();
  const createEventMutation = useCreateEvent();

  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Workshop",
    capacity: "",
    speaker: {
      name: "",
      role: "",
      company: "",
      bio: ""
    }
  });

  // Check if user is admin
  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      toast.error("Access denied. Admin privileges required.");
      navigate('/');
    }
  }, [profile, navigate]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.capacity || !eventForm.speaker.name || !eventForm.speaker.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (eventForm.title.length < 5) {
      toast.error("Title must be at least 5 characters long");
      return;
    }

    if (eventForm.description.length < 10) {
      toast.error("Description must be at least 10 characters long");
      return;
    }

    if (eventForm.location.length < 5) {
      toast.error("Location must be at least 5 characters long");
      return;
    }

    try {
      await createEventMutation.mutateAsync({
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time || "18:00",
        location: eventForm.location,
        category: eventForm.category,
        maxParticipants: parseInt(eventForm.capacity),
        registrationRequired: true,
        organizer: "Admin"
      });

      setShowCreateEvent(false);
      setEventForm({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "Workshop",
        capacity: "",
        speaker: {
          name: "",
          role: "",
          company: "",
          bio: ""
        }
      });
      toast.success("Event created successfully!");
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    { id: "events", label: "Events", icon: Calendar },
    { id: "users", label: "Users", icon: Users },
    { id: "rsvps", label: "RSVPs", icon: UserCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">Admin privileges required to access this page.</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">SAInT Admin Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {profile.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">{profile.email}</p>
              </div>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(profile.name || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
              Administrator
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 border-gray-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                <Button onClick={() => setShowCreateEvent(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                    <Users className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {usersLoading ? "..." : users?.length || 0}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {users?.filter(u => u.role === 'admin').length || 0} admins
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
                    <Calendar className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {eventsLoading ? "..." : events?.length || 0}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {events?.filter(e => e.status === 'upcoming').length || 0} upcoming
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
                    <UserCheck className="h-5 w-5 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {membersLoading ? "..." : members?.length || 0}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      +12 this month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total RSVPs</CardTitle>
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {rsvpsLoading ? "..." : rsvps?.length || 0}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {rsvps?.filter(r => r.status === 'attending').length || 0} attending
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New user registered</p>
                          <p className="text-xs text-gray-500">John Doe joined 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Event created</p>
                          <p className="text-xs text-gray-500">"React Workshop" scheduled for next week</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New RSVPs</p>
                          <p className="text-xs text-gray-500">5 users registered for "Tech Talk"</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Upcoming Events</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events?.slice(0, 3).map((event: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{event.location}</span>
                          </div>
                        </div>
                      )) || (
                        <p className="text-sm text-gray-500">No upcoming events</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Events Management</h2>
                <Button
                  onClick={() => setShowCreateEvent(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>

              {/* Events List */}
              <div className="grid gap-6">
                {eventsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading events...</p>
                  </div>
                ) : events && events.length > 0 ? (
                  events.map((event: any) => (
                    <Card key={event._id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            <CardDescription className="mt-2">{event.description}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-800">
                              {event.status || 'Active'}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>{event.registeredCount || 0}/{event.capacity} registered</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{event.speaker?.name || 'TBA'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                      <p className="text-gray-500 mb-4">Create your first event to get started!</p>
                      <Button onClick={() => setShowCreateEvent(true)} className="bg-indigo-600 hover:bg-indigo-700">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
                <div className="text-sm text-gray-500">
                  {users?.length || 0} total users
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage system users and administrators</CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading users...</p>
                    </div>
                  ) : users && users.length > 0 ? (
                    <div className="space-y-4">
                      {users.map((user: any) => (
                        <div key={user.id || user._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                              <span className="font-medium">
                                {(user.name?.charAt(0) || user.firstName?.charAt(0) || 'U').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}
                              </p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              {user.studentId && <p className="text-xs text-gray-400">ID: {user.studentId}</p>}
                              {user.department && <p className="text-xs text-gray-400">{user.department} - {user.year}</p>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            {user.isActive !== undefined && (
                              <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No users found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "rsvps" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">RSVP Management</h2>
                <div className="text-sm text-gray-500">
                  {rsvps?.length || 0} total RSVPs
                </div>
              </div>

              {/* RSVP Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-green-500" />
                      <span>Attending</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {rsvps?.filter(r => r.status === 'attending').length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <span>Maybe</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600">
                      {rsvps?.filter(r => r.status === 'maybe').length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <User className="h-5 w-5 text-red-500" />
                      <span>Not Attending</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      {rsvps?.filter(r => r.status === 'not_attending').length || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* RSVP List */}
              <Card>
                <CardHeader>
                  <CardTitle>All RSVPs</CardTitle>
                  <CardDescription>Manage event registrations and responses</CardDescription>
                </CardHeader>
                <CardContent>
                  {rsvpsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading RSVPs...</p>
                    </div>
                  ) : rsvps && rsvps.length > 0 ? (
                    <div className="space-y-4">
                      {rsvps.map((rsvp: any) => (
                        <div key={rsvp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                              <span className="font-medium">
                                {(rsvp.user?.name?.charAt(0) || rsvp.user?.firstName?.charAt(0) || 'U').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {rsvp.user?.name || `${rsvp.user?.firstName || ''} ${rsvp.user?.lastName || ''}`.trim() || 'No Name'}
                              </p>
                              <p className="text-sm text-gray-500">{rsvp.user?.email}</p>
                              <p className="text-sm text-gray-400">
                                Event: {rsvp.event?.title} • {new Date(rsvp.registrationDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge 
                              variant={
                                rsvp.status === 'attending' ? 'default' : 
                                rsvp.status === 'maybe' ? 'secondary' : 
                                'destructive'
                              }
                              className={
                                rsvp.status === 'attending' ? 'bg-green-100 text-green-800' :
                                rsvp.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {rsvp.status === 'attending' ? 'Attending' : 
                               rsvp.status === 'maybe' ? 'Maybe' : 
                               'Not Attending'}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No RSVPs Yet</h3>
                      <p className="text-gray-500">RSVPs will appear here when users register for events.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
              <Card>
                <CardContent className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
                  <p className="text-gray-500">Configure system settings and preferences.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
              <CardDescription>Add a new event to the calendar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="Enter event title (min 5 characters)"
                    className="mt-1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Enter event description (min 10 characters)"
                    rows={3}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="Enter event location (min 5 characters)"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                    placeholder="Max attendees"
                    className="mt-1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Networking">Networking</option>
                    <option value="Competition">Competition</option>
                    <option value="Conference">Conference</option>
                    <option value="Training">Training</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Speaker Information *</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="speakerName">Speaker Name *</Label>
                    <Input
                      id="speakerName"
                      value={eventForm.speaker.name}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        speaker: { ...eventForm.speaker, name: e.target.value }
                      })}
                      placeholder="Speaker full name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="speakerRole">Speaker Role *</Label>
                    <Input
                      id="speakerRole"
                      value={eventForm.speaker.role}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        speaker: { ...eventForm.speaker, role: e.target.value }
                      })}
                      placeholder="Speaker position/title"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="speakerCompany">Company (Optional)</Label>
                    <Input
                      id="speakerCompany"
                      value={eventForm.speaker.company}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        speaker: { ...eventForm.speaker, company: e.target.value }
                      })}
                      placeholder="Speaker company/organization"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="speakerBio">Bio (Optional)</Label>
                    <Textarea
                      id="speakerBio"
                      value={eventForm.speaker.bio}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        speaker: { ...eventForm.speaker, bio: e.target.value }
                      })}
                      placeholder="Speaker biography"
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-6 border-t">
                <Button 
                  onClick={handleCreateEvent} 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={createEventMutation.isPending}
                >
                  {createEventMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Event
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateEvent(false)}
                  className="flex-1"
                  disabled={createEventMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
