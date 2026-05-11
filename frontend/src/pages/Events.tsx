import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock, Users, Play, ArrowRight, Loader2, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomArrow, FloatingElement } from "@/components/InteractiveElements";
import InteractiveBackground from "@/components/InteractiveBackground";
import { VideoHighlights } from "@/components/VideoPlayer";
import { useEvents, useRsvpToEvent, useCancelRsvp } from "@/hooks/useEvents";
import { useCurrentUser } from "@/hooks/useAuth";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState, useEffect } from "react";

// Event Card Component with Image Carousel
const EventCard = ({ event }: { event: any }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!event.images || event.images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, [event.images]);

  const handlePrevImage = () => {
    if (event.images) {
      setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
    }
  };

  const handleNextImage = () => {
    if (event.images) {
      setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
    }
  };

  return (
    <div className="bg-white border-2 border-purple-300 rounded-xl shadow-xl hover:shadow-2xl hover:border-purple-400 transition-all duration-300 overflow-hidden">
      {/* Image Carousel */}
      {event.images && event.images.length > 0 && (
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          <img
            src={event.images[currentImageIndex]}
            alt={`${event.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
          />
          
          {/* Navigation Arrows */}
          {event.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {event.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
              {event.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 w-2 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Event Information */}
      <div className="p-6">
        <Badge className="mb-3 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300">
          Completed
        </Badge>
        <h3 className="text-2xl text-gray-900 font-bold mb-4 font-heading">{event.title}</h3>
        <p className="text-gray-800 mb-6 font-medium text-lg leading-relaxed">{event.description}</p>

        <div className="flex items-center justify-between text-lg">
          <div className="flex items-center text-gray-900 font-semibold">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center text-gray-900 font-semibold">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            <span>{event.rsvpCount} attended</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const { data: fetchedEvents, isLoading, error } = useEvents();

  // Hardcoded fallback events (used when API is unavailable)
  const hardcodedEvents = [
    // No upcoming events for now; only past Tree Plantation event
    {
      _id: 'tree-2k25',
      title: 'Tree Plantation 2K25',
      description: "SAInT members organized a plantation drive at Udachiwadi to promote environmental awareness and community participation.",
      images: [
        '/images/Events/treeplantation1-2k25.jpg',
        '/images/Events/treeplantation2-2k25.jpg',
        '/images/Events/treeplantation3-2k25.jpg',
        '/images/Events/treeplantation4-2k25.jpg',
      ],
      date: '2025-08-08',
      time: '12:28 PM',
      venue: 'Udachiwadi, Maharashtra, India',
      status: 'completed',
      rsvpCount: 120,
    },
    {
      _id: 'kautuk-sohala-2026',
      title: 'Kautuk Sohala 2026',
      description: "Kautuk Sohala is an achievement event organized by SAInT where the accomplishments and innovations of IT students are highlighted and celebrated.",
      images: [
        '/images/Events/KautakSohla1-2k25.jpg',
        '/images/Events/KautakSohla2-2k25.jpg',
        '/images/Events/KautakSohla3-2k25.jpg',
      ],
      date: '2026-03-28',
      time: '10:00 AM',
      venue: 'MBA Seminar Hall, JSPM RSOCE',
      status: 'completed',
      rsvpCount: 100,
    },
    {
      _id: 'teachers-day-2k25',
      title: "Teacher's Day",
      description: "SAInT organized Teacher's Day celebration at the IT department to honor and appreciate our dedicated faculty members.",
      images: [
        '/images/Events/teachersday1-2k25.jpg',
        '/images/Events/teachersday2-2k25.jpg',
        '/images/Events/teachersday3-2k25.jpg',
        '/images/Events/teachersday4-2k25.jpg',
        '/images/Events/teachersday5-2k25.jpg',
      ],
      date: '2025-09-06',
      time: '02:00 PM',
      venue: 'IT Department, JSPM RSOCE',
      status: 'completed',
      rsvpCount: 80,
    },
    {
      _id: 'farewell-2k25',
      title: 'Farewell 2K25',
      description: 'SAInT organized a farewell event to celebrate the outgoing students and wish them success for the future.',
      images: [
        '/images/Events/Farewell1-2k25.jpg',
        '/images/Events/Farewell2-2k25.jpg',
        '/images/Events/Farewell3-2k25.jpg',
        '/images/Events/Farewell4-2k25.jpg',
        '/images/Events/Farewell5-2k25.jpg',
      ],
      date: '2025-04-09',
      time: '10:00 AM',
      venue: 'JSPM Auditoriam',
      status: 'completed',
      rsvpCount: "200+",
    },
    {
      _id: 'modelx-2-2026',
      title: 'ModelX 2.0',
      description: 'ModelX 2.0 was a project competition conducted by SAInT, inspired by innovation and technology, where students showcased their ideas and creativity.',
      images: [
        '/images/Events/ModelX1.jpeg',
        '/images/Events/ModelX2.jpeg',
        '/images/Events/ModelX3.jpeg',
        '/images/Events/ModelX4.jpeg',
        '/images/Events/ModelX5.jpeg',
        '/images/Events/ModelX6.jpeg',
      ],
      date: '2026-04-07',
      time: '10:00 AM',
      venue: 'JSPM RSCOE',
      status: 'completed',
      rsvpCount: 100,
    }
  ];

  // Prefer fetched events when non-empty, otherwise fall back to hardcoded data
  const events = Array.isArray(fetchedEvents) && fetchedEvents.length > 0 ? fetchedEvents : hardcodedEvents;
  const { user, isAuthenticated } = useCurrentUser();
  const rsvpMutation = useRsvpToEvent();
  const cancelRsvpMutation = useCancelRsvp();
  const [rsvpStates, setRsvpStates] = useState<Record<string, boolean>>({});
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [rsvpForm, setRsvpForm] = useState({
    fullName: '',
    department: '',
    year: '',
    rbtNumber: '',
    phoneNumber: ''
  });

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events?.filter(event => new Date(event.date) >= now) || [];
  const pastEvents = events?.filter(event => new Date(event.date) < now) || [];

  // Handle RSVP
  const handleRsvp = async (eventId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to RSVP for events');
      return;
    }

    const isCurrentlyRsvped = rsvpStates[eventId];
    const event = upcomingEvents.find(e => e._id === eventId) || pastEvents.find(e => e._id === eventId);
    
    try {
      if (isCurrentlyRsvped) {
        await cancelRsvpMutation.mutateAsync(eventId);
        setRsvpStates(prev => ({ ...prev, [eventId]: false }));
        toast.success('RSVP cancelled successfully');
      } else {
        // Show RSVP form modal for new registrations
        setSelectedEvent(event);
        setRsvpForm({
          fullName: user?.name || '',
          department: user?.department || '',
          year: user?.year || '',
          rbtNumber: user?.studentId || '',
          phoneNumber: user?.phoneNumber || ''
        });
        setShowRsvpModal(true);
      }
    } catch (error) {
      console.error('RSVP error:', error);
    }
  };

  // Handle RSVP form submission
  const handleRsvpSubmit = async () => {
    if (!selectedEvent) return;
    
    // Validate required fields
    if (!rsvpForm.fullName || !rsvpForm.department || !rsvpForm.year) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await rsvpMutation.mutateAsync(selectedEvent._id);
      setRsvpStates(prev => ({ ...prev, [selectedEvent._id]: true }));
      setShowRsvpModal(false);
      setSelectedEvent(null);
      toast.success('RSVP successful! You will receive confirmation details shortly.');
    } catch (error) {
      console.error('RSVP error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'ongoing': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusText = (status: string, currentParticipants?: number, maxParticipants?: number) => {
    if (status === 'cancelled') return 'Cancelled';
    if (status === 'completed') return 'Completed';
    if (status === 'ongoing') return 'Ongoing';
    
    if (maxParticipants && currentParticipants) {
      if (currentParticipants >= maxParticipants) return 'Registration Full';
      if (currentParticipants >= maxParticipants * 0.8) return 'Filling Fast';
    }
    
    return 'Open Registration';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <InteractiveBackground />
        <Navigation />
        
        <section className="pt-24 pb-16 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-heading font-black leading-tight mb-6">
                <span className="text-gray-900">Join Our</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tech Community
                </span>
              </h1>
            </div>
            
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-blue-600">Loading events...</span>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <InteractiveBackground />
        <Navigation />
        
        <section className="pt-24 pb-16 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-heading font-black leading-tight mb-6">
                <span className="text-gray-900">Join Our</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tech Community
                </span>
              </h1>
            </div>
            
            <div className="text-center py-12">
              <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Unable to load events at this time.</p>
              <p className="text-gray-500 text-sm">Please check back later or contact us if the problem persists.</p>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />
      <Navigation />
      
      {/* Hero Section with Video/Image */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 relative z-10">
              <FloatingElement>
                <Badge variant="outline" className="mb-4 bg-white/80 backdrop-blur-sm">
                  Events & Activities
                </Badge>
              </FloatingElement>
              
              <h1 className="text-5xl md:text-6xl font-heading font-black leading-tight">
                <span className="text-gray-900">Join Our</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tech Community
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed font-body max-w-xl">
                Expand your skills, network with industry professionals, and be part of 
                cutting-edge technology events that shape the future.
              </p>

              <div className="flex items-center space-x-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover-shadow smooth-transition"
                >
                  View All Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <CustomArrow direction="down" />
              </div>
            </div>

            {/* Hero Media */}
            <div className="relative">
              <VideoHighlights
                videos={[
                  {
                    id: "club-intro-2024",
                    title: "SAInT Club Introduction 2024",
                    src: "/videos/highlights/club-introduction-2024.mp4",
                    description: "Get to know SAInT - our mission, activities, and amazing community of tech enthusiasts.",
                    thumbnail: "/images/video-thumbnails/club-intro-thumbnail-simple.svg"
                  }
                ]}
              />
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl rotate-12 opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl -rotate-12 opacity-80 animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 px-4 bg-white relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 text-lg font-bold shadow-lg">
              Past Events
            </Badge>
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Recent Highlights</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Check out our successful past events and workshops
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.length > 0 ? (
              pastEvents.slice(0, 6).map((event) => <EventCard key={event._id} event={event} />)
            ) : (
              <div className="col-span-3 text-center py-12">
                <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No past events to display.</p>
                <p className="text-gray-500 text-sm">Our event history will appear here as we host more events!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Modal */}
      {showRsvpModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-lg bg-white">
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-bold text-gray-900">
                Complete Your RSVP
              </CardTitle>
              <p className="text-gray-600 mt-1">Event: {selectedEvent.title}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={rsvpForm.fullName}
                    onChange={(e) => setRsvpForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                      Department *
                    </Label>
                    <Input
                      id="department"
                      value={rsvpForm.department}
                      onChange={(e) => setRsvpForm(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="e.g., Computer Science"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                      Year *
                    </Label>
                    <Select value={rsvpForm.year} onValueChange={(value) => setRsvpForm(prev => ({ ...prev, year: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st Year</SelectItem>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">4th Year</SelectItem>
                        <SelectItem value="Alumni">Alumni</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="rbtNumber" className="text-sm font-medium text-gray-700">
                    RBT Number
                  </Label>
                  <Input
                    id="rbtNumber"
                    value={rsvpForm.rbtNumber}
                    onChange={(e) => setRsvpForm(prev => ({ ...prev, rbtNumber: e.target.value }))}
                    placeholder="Enter your RBT number"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={rsvpForm.phoneNumber}
                    onChange={(e) => setRsvpForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Event Details</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    📅 {format(new Date(selectedEvent.date), 'MMM d, yyyy')} at {selectedEvent.time}
                  </p>
                  <p className="text-blue-700 text-sm">
                    📍 {selectedEvent.venue}
                  </p>
                  {selectedEvent.maxAttendees && (
                    <p className="text-blue-700 text-sm mt-1">
                      🎟️ {selectedEvent.rsvpCount}/{selectedEvent.maxAttendees} spots filled
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRsvpModal(false);
                    setSelectedEvent(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRsvpSubmit}
                  disabled={rsvpMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {rsvpMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm RSVP'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Events;