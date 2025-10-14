import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { useCurrentUser } from "@/hooks/useAuth";
import { 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  Mail, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  UserCheck, 
  UserX,
  Search,
  Filter,
  Upload,
  X
} from "lucide-react";
import { toast } from "sonner";

// Admin API service hooks
import { 
  useAdminDashboard, 
  useAdminUsers, 
  useAdminEvents, 
  useAdminGallery,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
  useUpdateUserRole,
  useDeactivateUser,
  useReactivateUser
} from "@/hooks/useAdminApi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'users' | 'gallery'>('dashboard');

  // Forms state
  const [showEventForm, setShowEventForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editingGallery, setEditingGallery] = useState<any>(null);
  
  // Filter states
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('all');
  const [eventCategory, setEventCategory] = useState('all');
  const [galleryCategory, setGalleryCategory] = useState('all');

  // API hooks
  const { data: dashboardData, isLoading: dashboardLoading } = useAdminDashboard();
  const { data: usersData, isLoading: usersLoading } = useAdminUsers({ search: userSearch, role: userRole });
  const { data: eventsData, isLoading: eventsLoading } = useAdminEvents({ category: eventCategory });
  const { data: galleryData, isLoading: galleryLoading } = useAdminGallery({ category: galleryCategory });
  
  // Mutations
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const createGalleryMutation = useCreateGalleryItem();
  const updateGalleryMutation = useUpdateGalleryItem();
  const deleteGalleryMutation = useDeleteGalleryItem();
  const updateUserRoleMutation = useUpdateUserRole();
  const deactivateUserMutation = useDeactivateUser();
  const reactivateUserMutation = useReactivateUser();

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'workshop',
    maxAttendees: '',
    registrationRequired: true,
    registrationDeadline: '',
    speaker: {
      name: '',
      designation: '',
      bio: ''
    }
  });

  // Gallery form state
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'event',
    eventName: '',
    photographer: '',
    isFeatured: false
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access admin dashboard");
      navigate("/admin/login");
    } else if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format data for backend
      const formattedData = {
        ...eventForm,
        date: new Date(`${eventForm.date}T${eventForm.time}`).toISOString(),
        maxAttendees: eventForm.maxAttendees ? parseInt(eventForm.maxAttendees) : undefined,
        registrationDeadline: eventForm.registrationDeadline ? 
          new Date(eventForm.registrationDeadline).toISOString() : undefined,
        // Only include speaker if at least one field is filled
        speaker: (eventForm.speaker.name || eventForm.speaker.designation || eventForm.speaker.bio) 
          ? eventForm.speaker 
          : undefined
      };

      if (editingEvent) {
        await updateEventMutation.mutateAsync({ id: editingEvent._id, data: formattedData });
        toast.success("Event updated successfully!");
      } else {
        await createEventMutation.mutateAsync(formattedData);
        toast.success("Event created successfully!");
      }
      setShowEventForm(false);
      setEditingEvent(null);
      resetEventForm();
    } catch (error) {
      toast.error("Failed to save event");
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGallery) {
        // For editing, use existing form data
        const formData = new FormData();
        formData.append('title', galleryForm.title);
        formData.append('description', galleryForm.description);
        formData.append('category', galleryForm.category);
        formData.append('eventName', galleryForm.eventName);
        formData.append('photographer', galleryForm.photographer);
        formData.append('isFeatured', galleryForm.isFeatured.toString());
        
        // Only append new image if one was selected
        if (selectedFile) {
          formData.append('image', selectedFile);
        } else {
          formData.append('imageUrl', galleryForm.imageUrl);
        }

        await updateGalleryMutation.mutateAsync({ id: editingGallery._id, data: formData });
        toast.success("Gallery item updated successfully!");
      } else {
        // For new items, require either file or URL
        if (!selectedFile && !galleryForm.imageUrl) {
          toast.error("Please select an image file or provide an image URL");
          return;
        }

        const formData = new FormData();
        formData.append('title', galleryForm.title);
        formData.append('description', galleryForm.description);
        formData.append('category', galleryForm.category);
        formData.append('eventName', galleryForm.eventName);
        formData.append('photographer', galleryForm.photographer);
        formData.append('isFeatured', galleryForm.isFeatured.toString());
        
        if (selectedFile) {
          formData.append('image', selectedFile);
        } else {
          formData.append('imageUrl', galleryForm.imageUrl);
        }

        await createGalleryMutation.mutateAsync(formData);
        toast.success("Gallery item created successfully!");
      }
      setShowGalleryForm(false);
      setEditingGallery(null);
      resetGalleryForm();
    } catch (error) {
      toast.error("Failed to save gallery item");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEventMutation.mutateAsync(id);
        toast.success("Event deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await deleteGalleryMutation.mutateAsync(id);
        toast.success("Gallery item deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete gallery item");
      }
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRoleMutation.mutateAsync({ id: userId, role: newRole });
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      try {
        await deactivateUserMutation.mutateAsync(userId);
        toast.success("User deactivated successfully!");
      } catch (error) {
        toast.error("Failed to deactivate user");
      }
    }
  };

  const handleReactivateUser = async (userId: string) => {
    try {
      await reactivateUserMutation.mutateAsync(userId);
      toast.success("User reactivated successfully!");
    } catch (error) {
      toast.error("Failed to reactivate user");
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      category: 'workshop',
      maxAttendees: '',
      registrationRequired: true,
      registrationDeadline: '',
      speaker: {
        name: '',
        designation: '',
        bio: ''
      }
    });
  };

  const resetGalleryForm = () => {
    setGalleryForm({
      title: '',
      description: '',
      imageUrl: '',
      category: 'event',
      eventName: '',
      photographer: '',
      isFeatured: false
    });
    setSelectedFile(null);
    setFilePreview('');
  };

  // File upload handling
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, WebP)');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview('');
  };

  const editEvent = (event: any) => {
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time || '',
      venue: event.venue || '',
      category: event.category || 'workshop',
      maxAttendees: event.maxAttendees?.toString() || '',
      registrationRequired: event.registrationRequired || true,
      registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split('T')[0] : '',
      speaker: event.speaker || { name: '', designation: '', bio: '' }
    });
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const editGalleryItem = (item: any) => {
    setGalleryForm({
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      category: item.category || 'event',
      eventName: item.eventName || '',
      photographer: item.photographer || '',
      isFeatured: item.isFeatured || false
    });
    
    // Set existing image as preview if available
    if (item.imageUrl) {
      setFilePreview(item.imageUrl);
    }
    
    setEditingGallery(item);
    setShowGalleryForm(true);
  };

  if (!isAuthenticated || !isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <div className="container mx-auto p-6 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage your organization's content and members</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm border">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-red-500 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardLoading ? '...' : dashboardData?.data?.overview?.totalMembers || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Active users in system</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardLoading ? '...' : dashboardData?.data?.overview?.totalEvents || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Published events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardLoading ? '...' : dashboardData?.data?.overview?.totalGalleryItems || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Photos uploaded</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contacts</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardLoading ? '...' : dashboardData?.data?.overview?.unreadContacts || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Unread messages</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData?.data?.recentActivity?.recentEvents?.map((event: any) => (
                      <div key={event._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>
                    )) || <p className="text-gray-500">No recent events</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData?.data?.recentActivity?.recentMembers?.map((member: any) => (
                      <div key={member._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.department}</p>
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )) || <p className="text-gray-500">No recent members</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Events Management */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Events Management</h2>
              <Button onClick={() => setShowEventForm(true)} className="bg-red-500 hover:bg-red-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {eventsLoading ? (
                <p>Loading events...</p>
              ) : (
                eventsData?.data?.events?.map((event: any) => (
                <Card key={event._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-gray-600 mt-1">{event.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                          <span>🕒 {event.time}</span>
                          <span>📍 {event.venue}</span>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => editEvent(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )) || <p>No events found</p>
              )}
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Users Management</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Select value={userRole} onValueChange={setUserRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {usersLoading ? (
                <p>Loading users...</p>
              ) : (
                usersData?.data?.users?.map((user: any) => (
                <Card key={user._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            {user.department && (
                              <span className="text-sm text-gray-500">{user.department}</span>
                            )}
                            {user.year && (
                              <span className="text-sm text-gray-500">{user.year} Year</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(newRole) => handleUpdateUserRole(user._id, newRole)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => handleDeactivateUser(user._id)}>
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )) || <p>No users found</p>
              )}
            </div>
          </div>
        )}

        {/* Gallery Management */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gallery Management</h2>
              <Button onClick={() => setShowGalleryForm(true)} className="bg-red-500 hover:bg-red-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryLoading ? (
                <p>Loading gallery...</p>
              ) : (
                galleryData?.data?.gallery?.map((item: any) => (
                <Card key={item._id}>
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.category}</Badge>
                        {item.isFeatured && <Badge variant="default">Featured</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => editGalleryItem(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteGalleryItem(item._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                )) || <p>No gallery items found</p>
              )}
            </div>
          </div>
        )}        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={eventForm.title}
                        onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={eventForm.category} onValueChange={(value) => setEventForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="seminar">Seminar</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={eventForm.time}
                        onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxAttendees">Max Attendees</Label>
                      <Input
                        id="maxAttendees"
                        type="number"
                        value={eventForm.maxAttendees}
                        onChange={(e) => setEventForm(prev => ({ ...prev, maxAttendees: e.target.value }))}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={eventForm.venue}
                      onChange={(e) => setEventForm(prev => ({ ...prev, venue: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Speaker Section (Optional) */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Speaker Information (Optional)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="speakerName">Speaker Name</Label>
                        <Input
                          id="speakerName"
                          value={eventForm.speaker.name}
                          onChange={(e) => setEventForm(prev => ({ 
                            ...prev, 
                            speaker: { ...prev.speaker, name: e.target.value }
                          }))}
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <Label htmlFor="speakerDesignation">Designation</Label>
                        <Input
                          id="speakerDesignation"
                          value={eventForm.speaker.designation}
                          onChange={(e) => setEventForm(prev => ({ 
                            ...prev, 
                            speaker: { ...prev.speaker, designation: e.target.value }
                          }))}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="speakerBio">Speaker Bio</Label>
                      <Textarea
                        id="speakerBio"
                        value={eventForm.speaker.bio}
                        onChange={(e) => setEventForm(prev => ({ 
                          ...prev, 
                          speaker: { ...prev.speaker, bio: e.target.value }
                        }))}
                        rows={3}
                        placeholder="Optional speaker biography"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowEventForm(false);
                        setEditingEvent(null);
                        resetEventForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-red-500 hover:bg-red-600">
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gallery Form Modal */}
        {showGalleryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>{editingGallery ? 'Edit Gallery Item' : 'Add New Gallery Item'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGallerySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="galleryTitle">Title</Label>
                    <Input
                      id="galleryTitle"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <Label>Image Upload</Label>
                    <div className="space-y-4">
                      {/* File Upload Input */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <Label htmlFor="file-upload" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Upload an image file
                              </span>
                              <span className="text-sm text-gray-500">
                                PNG, JPG, WebP up to 5MB
                              </span>
                            </Label>
                            <Input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleFileSelect}
                            />
                          </div>
                        </div>
                      </div>

                      {/* File Preview */}
                      {filePreview && (
                        <div className="relative">
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeSelectedFile}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* OR separator */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-gray-500">Or</span>
                        </div>
                      </div>

                      {/* URL Input as fallback */}
                      <div>
                        <Label htmlFor="galleryImageUrl">Image URL (optional)</Label>
                        <Input
                          id="galleryImageUrl"
                          type="url"
                          value={galleryForm.imageUrl}
                          onChange={(e) => setGalleryForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="galleryDescription">Description</Label>
                    <Textarea
                      id="galleryDescription"
                      value={galleryForm.description}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="galleryCategory">Category</Label>
                      <Select value={galleryForm.category} onValueChange={(value) => setGalleryForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="seminar">Seminar</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="achievement">Achievement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="photographer">Photographer</Label>
                      <Input
                        id="photographer"
                        value={galleryForm.photographer}
                        onChange={(e) => setGalleryForm(prev => ({ ...prev, photographer: e.target.value }))}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={galleryForm.isFeatured}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    />
                    <Label htmlFor="isFeatured">Mark as Featured</Label>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowGalleryForm(false);
                        setEditingGallery(null);
                        resetGalleryForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-red-500 hover:bg-red-600">
                      {editingGallery ? 'Update Item' : 'Add Item'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;