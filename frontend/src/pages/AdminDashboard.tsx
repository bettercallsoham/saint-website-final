import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Navigation from "@/components/Navigation";
import { useCurrentUser } from "@/hooks/useAuth";
import { useEventRsvps } from "@/hooks/useEvents";
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
  X,
  Download,
  Eye,
  Clock,
  MapPin
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
  useReactivateUser,
  useBanUser,
  useUnbanUser,
  useDeleteUser
} from "@/hooks/useAdminApi";
import { useCreateGalleryItemMultiple } from "@/hooks/useGallery";

// AttendanceManagement Component
const AttendanceManagement = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});
  const { data: eventsData } = useAdminEvents({ category: 'all' });
  const { data: rsvpData } = useEventRsvps(selectedEvent?._id || '');

  const upcomingEvents = eventsData?.data?.events?.filter((event: any) => 
    new Date(event.date) >= new Date() && event.rsvpCount > 0
  ) || [];

  const handleAttendanceToggle = (userId: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const saveAttendance = () => {
    // In a real implementation, this would call an API to save attendance
    const attendedCount = Object.values(attendanceData).filter(Boolean).length;
    toast.success(`Attendance marked for ${attendedCount} participants`);
  };

  const exportAttendance = () => {
    if (!selectedEvent || !rsvpData?.data?.rsvps) return;
    
    const csvContent = [
      ['Name', 'Email', 'Department', 'Year', 'Student ID', 'Attended'],
      ...rsvpData.data.rsvps.map((rsvp: any) => [
        rsvp.user.name || '',
        rsvp.user.email || '',
        rsvp.user.department || '',
        rsvp.user.year || '',
        rsvp.user.studentId || '',
        attendanceData[rsvp.user._id] ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}_attendance.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const attendedCount = Object.values(attendanceData).filter(Boolean).length;
  const totalRsvps = rsvpData?.data?.rsvps?.length || 0;
  const absentCount = totalRsvps - attendedCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Attendance Management</h2>
          <p className="text-gray-600 mt-1">Mark attendance for event participants</p>
        </div>
      </div>

      {/* Event Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Event</h3>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-4">
            {upcomingEvents.map((event: any) => (
              <div
                key={event._id}
                onClick={() => setSelectedEvent(event)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedEvent?._id === event._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>🕒 {event.time}</span>
                      <span>📍 {event.venue}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{event.rsvpCount} RSVPs</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No upcoming events with RSVPs</p>
          </div>
        )}
      </Card>

      {/* Attendance Tracking */}
      {selectedEvent && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Mark Attendance</h3>
              <p className="text-gray-600">Event: {selectedEvent.title}</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button onClick={saveAttendance} className="bg-green-600 hover:bg-green-700">
                Save Attendance
              </Button>
              <Button onClick={exportAttendance} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-blue-50">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600">Total RSVPs</p>
                  <p className="text-2xl font-bold text-blue-900">{totalRsvps}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-green-50">
              <div className="flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600">Present</p>
                  <p className="text-2xl font-bold text-green-900">{attendedCount}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-red-50">
              <div className="flex items-center gap-3">
                <UserX className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-red-600">Absent</p>
                  <p className="text-2xl font-bold text-red-900">{absentCount}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Participant List */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 mb-3">Participants ({totalRsvps})</h4>
            {rsvpData?.data?.rsvps?.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {rsvpData.data.rsvps.map((rsvp: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{rsvp.user.name}</p>
                      <p className="text-sm text-gray-600">{rsvp.user.email}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        {rsvp.user.department && <span>Dept: {rsvp.user.department}</span>}
                        {rsvp.user.year && <span>Year: {rsvp.user.year}</span>}
                        {rsvp.user.studentId && <span>ID: {rsvp.user.studentId}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant={attendanceData[rsvp.user._id] ? "default" : "outline"}
                        onClick={() => handleAttendanceToggle(rsvp.user._id)}
                        className={
                          attendanceData[rsvp.user._id]
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                        }
                      >
                        {attendanceData[rsvp.user._id] ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-1" />
                            Present
                          </>
                        ) : (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Mark Present
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Loading participants...</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

// EventManagementCard Component
const EventManagementCard = ({ event, onEdit, onDelete }: { event: any; onEdit: () => void; onDelete: () => void }) => {
  const [showRsvps, setShowRsvps] = useState(false);
  const { data: rsvpData, isLoading: rsvpLoading } = useEventRsvps(showRsvps ? event._id : "");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportRsvps = () => {
    if (!rsvpData?.data?.rsvps) return;
    
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Student ID', 'Department', 'Year', 'RSVP Date'],
      ...rsvpData.data.rsvps.map((rsvp: any) => [
        rsvp.user.name || '',
        rsvp.user.email || '',
        rsvp.user.phoneNumber || '',
        rsvp.user.studentId || '',
        rsvp.user.department || '',
        rsvp.user.year || '',
        new Date(rsvp.rsvpDate).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_rsvps.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-red-500">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Event Header */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Event Image */}
            {event.images && event.images.length > 0 && (
              <div className="lg:w-32 w-full">
                <img 
                  src={`http://localhost:5000${event.images.find((img: any) => img.isPrimary)?.url || event.images[0].url}`}
                  alt={event.title}
                  className="w-full lg:w-32 h-32 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {/* Event Details */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{event.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
              </div>
              
              {/* Event Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="truncate">{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4 text-red-500" />
                  <span>
                    {event.rsvpCount} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} RSVPs
                  </span>
                </div>
              </div>

              {/* Speaker Info */}
              {event.speaker?.name && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">
                    Speaker: {event.speaker.name}
                    {event.speaker.designation && (
                      <span className="text-blue-700 ml-2">• {event.speaker.designation}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowRsvps(!showRsvps)}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              {showRsvps ? 'Hide' : 'View'} RSVPs ({event.rsvpCount})
            </Button>
            {event.rsvpCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportRsvps}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDelete}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          {/* RSVP Details */}
          {showRsvps && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">Event RSVPs</h4>
              {rsvpLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading RSVPs...</p>
                </div>
              ) : rsvpData?.data?.rsvps?.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {rsvpData.data.rsvps.map((rsvp: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{rsvp.user.name}</p>
                        <p className="text-sm text-gray-600">{rsvp.user.email}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          {rsvp.user.department && <span>Dept: {rsvp.user.department}</span>}
                          {rsvp.user.year && <span>Year: {rsvp.user.year}</span>}
                          {rsvp.user.studentId && <span>ID: {rsvp.user.studentId}</span>}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>RSVP'd on</p>
                        <p>{new Date(rsvp.rsvpDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No RSVPs yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'users' | 'gallery' | 'attendance'>('dashboard');

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
  const createGalleryMultipleMutation = useCreateGalleryItemMultiple();
  const updateGalleryMutation = useUpdateGalleryItem();
  const deleteGalleryMutation = useDeleteGalleryItem();
  const updateUserRoleMutation = useUpdateUserRole();
  const deactivateUserMutation = useDeactivateUser();
  const reactivateUserMutation = useReactivateUser();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const deleteUserMutation = useDeleteUser();

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

  // File upload state for gallery
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [selectedMultipleFiles, setSelectedMultipleFiles] = useState<File[]>([]);
  const [multipleFilePreviews, setMultipleFilePreviews] = useState<string[]>([]);
  const [showMultipleForm, setShowMultipleForm] = useState(false);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'default'
  });

  // File upload state for events
  const [selectedEventFile, setSelectedEventFile] = useState<File | null>(null);
  const [eventFilePreview, setEventFilePreview] = useState<string>('');

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

    const eventDateTime = new Date(`${eventForm.date}T${eventForm.time}`);
    if (Number.isNaN(eventDateTime.getTime())) {
      toast.error("Please enter a valid event date and time");
      return;
    }

    if (eventDateTime <= new Date()) {
      toast.error("Event date and time must be in the future");
      return;
    }

    try {
      if (editingEvent) {
        // For editing, handle file upload separately if needed
        let data;
        if (selectedEventFile) {
          const formData = new FormData();
          formData.append('title', eventForm.title);
          formData.append('description', eventForm.description);
          formData.append('date', new Date(`${eventForm.date}T${eventForm.time}`).toISOString());
          formData.append('time', eventForm.time);
          formData.append('venue', eventForm.venue);
          formData.append('category', eventForm.category);
          if (eventForm.maxAttendees) formData.append('maxAttendees', eventForm.maxAttendees);
          formData.append('registrationRequired', eventForm.registrationRequired.toString());
          if (eventForm.registrationDeadline) {
            formData.append('registrationDeadline', new Date(eventForm.registrationDeadline).toISOString());
          }
          
          // Add speaker data if provided
          if (eventForm.speaker.name || eventForm.speaker.designation || eventForm.speaker.bio) {
            formData.append('speaker[name]', eventForm.speaker.name);
            formData.append('speaker[designation]', eventForm.speaker.designation);
            formData.append('speaker[bio]', eventForm.speaker.bio);
          }
          
          formData.append('image', selectedEventFile);
          data = formData;
        } else {
          // No file upload, use JSON data
          data = {
            ...eventForm,
            date: new Date(`${eventForm.date}T${eventForm.time}`).toISOString(),
            maxAttendees: eventForm.maxAttendees ? parseInt(eventForm.maxAttendees) : undefined,
            registrationDeadline: eventForm.registrationDeadline ? 
              new Date(eventForm.registrationDeadline).toISOString() : undefined,
            speaker: (eventForm.speaker.name || eventForm.speaker.designation || eventForm.speaker.bio) 
              ? eventForm.speaker 
              : undefined
          };
        }
        
        await updateEventMutation.mutateAsync({ id: editingEvent._id, data });
        toast.success("Event updated successfully!");
      } else {
        // For new events, handle file upload
        let data;
        if (selectedEventFile) {
          const formData = new FormData();
          formData.append('title', eventForm.title);
          formData.append('description', eventForm.description);
          formData.append('date', new Date(`${eventForm.date}T${eventForm.time}`).toISOString());
          formData.append('time', eventForm.time);
          formData.append('venue', eventForm.venue);
          formData.append('category', eventForm.category);
          if (eventForm.maxAttendees) formData.append('maxAttendees', eventForm.maxAttendees);
          formData.append('registrationRequired', eventForm.registrationRequired.toString());
          if (eventForm.registrationDeadline) {
            formData.append('registrationDeadline', new Date(eventForm.registrationDeadline).toISOString());
          }
          
          // Add speaker data if provided
          if (eventForm.speaker.name || eventForm.speaker.designation || eventForm.speaker.bio) {
            formData.append('speaker[name]', eventForm.speaker.name);
            formData.append('speaker[designation]', eventForm.speaker.designation);
            formData.append('speaker[bio]', eventForm.speaker.bio);
          }
          
          formData.append('image', selectedEventFile);
          data = formData;
        } else {
          // No file upload, use JSON data
          data = {
            ...eventForm,
            date: new Date(`${eventForm.date}T${eventForm.time}`).toISOString(),
            maxAttendees: eventForm.maxAttendees ? parseInt(eventForm.maxAttendees) : undefined,
            registrationDeadline: eventForm.registrationDeadline ? 
              new Date(eventForm.registrationDeadline).toISOString() : undefined,
            speaker: (eventForm.speaker.name || eventForm.speaker.designation || eventForm.speaker.bio) 
              ? eventForm.speaker 
              : undefined
          };
        }

        await createEventMutation.mutateAsync(data);
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

  const handleMultipleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMultipleFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    if (!galleryForm.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      const formData = new FormData();
      
      // Add form fields
      formData.append('title', galleryForm.title);
      formData.append('description', galleryForm.description);
      formData.append('category', galleryForm.category);
      formData.append('eventName', galleryForm.eventName);
      formData.append('photographer', galleryForm.photographer);
      formData.append('isFeatured', galleryForm.isFeatured.toString());

      // Add multiple images
      selectedMultipleFiles.forEach((file) => {
        formData.append('images', file);
      });
      
      // Add primary image index
      formData.append('primaryImageIndex', primaryImageIndex.toString());

      await createGalleryMultipleMutation.mutateAsync(formData);
      
      setShowMultipleForm(false);
      resetGalleryForm();
      clearMultipleFiles();
      toast.success("Gallery item with multiple images created successfully!");
    } catch (error) {
      toast.error("Failed to create gallery item with multiple images");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Event",
      description: "Are you sure you want to delete this event? This action cannot be undone.",
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await deleteEventMutation.mutateAsync(id);
          toast.success("Event deleted successfully!");
        } catch (error) {
          toast.error("Failed to delete event");
        }
      }
    });
  };

  const handleDeleteGalleryItem = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Gallery Item",
      description: "Are you sure you want to delete this gallery item? This action cannot be undone.",
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await deleteGalleryMutation.mutateAsync(id);
          toast.success("Gallery item deleted successfully!");
        } catch (error) {
          toast.error("Failed to delete gallery item");
        }
      }
    });
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
    setConfirmDialog({
      open: true,
      title: "Deactivate User",
      description: "Are you sure you want to deactivate this user? They will lose access to their account.",
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await deactivateUserMutation.mutateAsync(userId);
          toast.success("User deactivated successfully!");
        } catch (error) {
          toast.error("Failed to deactivate user");
        }
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete User Permanently",
      description: "Are you sure you want to permanently delete this user? This action cannot be undone and will remove their email from the database.",
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await deleteUserMutation.mutateAsync(userId);
        } catch (error) {
          toast.error("Failed to delete user");
        }
      }
    });
  };

  const handleBanUser = async (userId: string) => {
    setConfirmDialog({
      open: true,
      title: "Ban User",
      description: "Are you sure you want to ban this user? They will not be able to log in until unbanned.",
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await banUserMutation.mutateAsync(userId);
        } catch (error) {
          toast.error("Failed to ban user");
        }
      }
    });
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await unbanUserMutation.mutateAsync(userId);
    } catch (error) {
      toast.error("Failed to unban user");
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
    setSelectedEventFile(null);
    setEventFilePreview('');
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

  // Multiple files upload handling
  const handleMultipleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    // Validate file types and sizes
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 10;
    
    if (files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const validFiles: File[] = [];
    const previews: string[] = [];
    
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Please select a valid image file (JPG, PNG, WebP)`);
        continue;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name}: File size must be less than 5MB`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length > 0) {
      setSelectedMultipleFiles(validFiles);
      setPrimaryImageIndex(0); // Reset to first image as primary
      
      // Create previews
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          if (previews.length === validFiles.length) {
            setMultipleFilePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMultipleFile = (index: number) => {
    const newFiles = selectedMultipleFiles.filter((_, i) => i !== index);
    const newPreviews = multipleFilePreviews.filter((_, i) => i !== index);
    setSelectedMultipleFiles(newFiles);
    setMultipleFilePreviews(newPreviews);
    
    // Adjust primary index if necessary
    if (primaryImageIndex >= newFiles.length) {
      setPrimaryImageIndex(Math.max(0, newFiles.length - 1));
    } else if (index <= primaryImageIndex) {
      setPrimaryImageIndex(Math.max(0, primaryImageIndex - 1));
    }
  };

  const clearMultipleFiles = () => {
    setSelectedMultipleFiles([]);
    setMultipleFilePreviews([]);
    setPrimaryImageIndex(0);
  };

  // Event file upload handling
  const handleEventFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      setSelectedEventFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setEventFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedEventFile = () => {
    setSelectedEventFile(null);
    setEventFilePreview('');
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
            { id: 'attendance', label: 'Attendance', icon: UserCheck },
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
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Events Management</h2>
                <p className="text-gray-600 mt-1">Manage events, view RSVPs and track attendance</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowEventForm(true)} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
              <Select value={eventCategory} onValueChange={setEventCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6">
              {eventsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading events...</p>
                  </div>
                </div>
              ) : eventsData?.data?.events?.length > 0 ? (
                eventsData.data.events.map((event: any) => (
                  <EventManagementCard 
                    key={event._id} 
                    event={event} 
                    onEdit={() => editEvent(event)}
                    onDelete={() => handleDeleteEvent(event._id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No events found</p>
                  <p className="text-gray-400 text-sm">Create your first event to get started</p>
                </div>
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
                          <h3 className="font-semibold flex items-center gap-2">
                            {user.name}
                            {user.status === 'banned' && (
                              <Badge variant="destructive" className="text-xs">
                                BANNED
                              </Badge>
                            )}
                            {user.status === 'suspended' && (
                              <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                                SUSPENDED
                              </Badge>
                            )}
                          </h3>
                          <p className="text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            {user.department && (
                              <span className="text-sm text-gray-500">{user.department}</span>
                            )}
                            {user.year && (
                              <span className="text-sm text-gray-500">{user.year} Year</span>
                            )}
                            {user.studentId && (
                              <span className="text-xs text-gray-400">ID: {user.studentId}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Joined: {new Date(user.joinedAt).toLocaleDateString()}
                            {user.lastLogin && (
                              <span className="ml-2">
                                • Last login: {new Date(user.lastLogin).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Select
                          value={user.role}
                          onValueChange={(newRole) => handleUpdateUserRole(user._id, newRole)}
                          disabled={user.status === 'banned'}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {user.status === 'banned' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUnbanUser(user._id)}
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            title="Unban user"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleBanUser(user._id)}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            disabled={user.role === 'admin'}
                            title={user.role === 'admin' ? "Cannot ban admin" : "Ban user"}
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteUser(user._id)}
                          title="Delete user permanently"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          disabled={user.role === 'admin'}
                        >
                          <Trash2 className="h-4 w-4" />
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
              <div className="flex gap-2">
                <Button onClick={() => setShowGalleryForm(true)} className="bg-red-500 hover:bg-red-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Single Image
                </Button>
                <Button onClick={() => setShowMultipleForm(true)} className="bg-purple-500 hover:bg-purple-600">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Multiple Images
                </Button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading gallery...</p>
                  </div>
                </div>
              ) : galleryData?.data?.gallery?.length > 0 ? (
                galleryData.data.gallery.map((item: any) => {
                  // Determine the image URL to display
                  const getImageUrl = () => {
                    // If there are multiple images, use the primary one or first image
                    if (item.images && item.images.length > 0) {
                      const primaryImage = item.images.find((img: any) => img.isPrimary);
                      const imageToUse = primaryImage || item.images[0];
                      return imageToUse.url.startsWith('http') ? imageToUse.url : `http://localhost:5000${imageToUse.url}`;
                    }
                    // Fallback to imageUrl field
                    if (item.imageUrl) {
                      return item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`;
                    }
                    return null;
                  };

                  const imageUrl = getImageUrl();

                  return (
                    <Card key={item._id} className="hover:shadow-lg transition-shadow duration-200">
                      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image load error for:', imageUrl);
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                            <span className="ml-2 text-gray-500">No image</span>
                          </div>
                        )}
                        {/* Multiple images indicator */}
                        {item.images && item.images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs">
                            +{item.images.length - 1} more
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg truncate flex-1">{item.title}</h3>
                          <div className="flex items-center gap-1 ml-2 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{item.views || 0}</span>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                        )}
                        {item.eventName && (
                          <p className="text-blue-600 text-sm mb-2 font-medium">Event: {item.eventName}</p>
                        )}
                        {item.photographer && (
                          <p className="text-gray-500 text-xs mb-3">📸 {item.photographer}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">{item.category}</Badge>
                            {item.isFeatured && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Featured</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => editGalleryItem(item)} title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteGalleryItem(item._id)} title="Delete" className="hover:bg-red-50 hover:border-red-200">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                          Created: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No gallery items found</p>
                  <p className="text-gray-400 text-sm">Start by adding some images to your gallery</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attendance Management */}
        {activeTab === 'attendance' && (
          <AttendanceManagement />
        )}

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <Card className="w-full max-w-2xl my-8 max-h-fit">
              <CardHeader className="sticky top-0 bg-white z-10 border-b flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEventForm(false);
                    setEditingEvent(null);
                    resetEventForm();
                  }}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleEventSubmit} className="space-y-4 pb-20">
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

                  {/* Event Image Upload (Optional) */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Event Image (Optional)</Label>
                    <div className="space-y-4">
                      {/* File Upload Input */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <Label htmlFor="event-file-upload" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Upload event image
                              </span>
                              <span className="text-sm text-gray-500">
                                PNG, JPG, WebP up to 5MB
                              </span>
                            </Label>
                            <Input
                              id="event-file-upload"
                              name="event-file-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleEventFileSelect}
                            />
                          </div>
                        </div>
                      </div>

                      {/* File Preview */}
                      {eventFilePreview && (
                        <div className="relative">
                          <img
                            src={eventFilePreview}
                            alt="Event Preview"
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeSelectedEventFile}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
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

                  <div className="sticky bottom-0 bg-white border-t pt-4 mt-6 flex justify-end gap-4">
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

        {/* Multiple Images Gallery Form */}
        {showMultipleForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add Multiple Images to Gallery</CardTitle>
                <CardDescription>
                  Upload multiple images for a single gallery item. Perfect for event photo collections.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMultipleGallerySubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="multiTitle">Title *</Label>
                      <Input
                        id="multiTitle"
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="multiCategory">Category</Label>
                      <Select
                        value={galleryForm.category}
                        onValueChange={(value) => setGalleryForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
                  </div>

                  <div>
                    <Label htmlFor="multiDescription">Description</Label>
                    <Textarea
                      id="multiDescription"
                      value={galleryForm.description}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this gallery item..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="multiEventName">Event Name</Label>
                      <Input
                        id="multiEventName"
                        value={galleryForm.eventName}
                        onChange={(e) => setGalleryForm(prev => ({ ...prev, eventName: e.target.value }))}
                        placeholder="Associated event name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="multiPhotographer">Photographer</Label>
                      <Input
                        id="multiPhotographer"
                        value={galleryForm.photographer}
                        onChange={(e) => setGalleryForm(prev => ({ ...prev, photographer: e.target.value }))}
                        placeholder="Photographer name"
                      />
                    </div>
                  </div>

                  {/* Multiple File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Label htmlFor="multiple-file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-lg font-medium text-gray-900">
                            Upload Multiple Images
                          </span>
                          <span className="text-sm text-gray-500">
                            PNG, JPG, WebP up to 5MB each, maximum 10 files
                          </span>
                        </Label>
                        <Input
                          id="multiple-file-upload"
                          name="multiple-file-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleMultipleFileSelect}
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Previews */}
                  {multipleFilePreviews.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium">Selected Images ({multipleFilePreviews.length})</h4>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearMultipleFiles}
                          className="text-red-600 hover:text-red-700"
                        >
                          Clear All
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {multipleFilePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className={`w-full h-32 object-cover rounded-lg cursor-pointer transition-all ${
                                primaryImageIndex === index ? 'ring-4 ring-blue-500' : ''
                              }`}
                              onClick={() => setPrimaryImageIndex(index)}
                            />
                            <button
                              type="button"
                              onClick={() => removeMultipleFile(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPrimaryImageIndex(index)}
                              className={`absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded transition-all ${
                                primaryImageIndex === index 
                                  ? 'bg-blue-500' 
                                  : 'bg-black/50 hover:bg-blue-500'
                              }`}
                            >
                              {primaryImageIndex === index ? '★ Primary' : 'Set Primary'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowMultipleForm(false);
                        resetGalleryForm();
                        clearMultipleFiles();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-purple-500 hover:bg-purple-600"
                      disabled={selectedMultipleFiles.length === 0}
                    >
                      Add Gallery Item
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={confirmDialog.onConfirm}
          variant={confirmDialog.variant}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;