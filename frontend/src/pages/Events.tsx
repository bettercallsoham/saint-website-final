import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Play, ArrowRight, Loader2, CalendarDays } from "lucide-react";
import { CustomArrow, FloatingElement } from "@/components/InteractiveElements";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

const Events = () => {
  const { data: events, isLoading, error } = useEvents();

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events?.filter(event => new Date(event.date) >= now) || [];
  const pastEvents = events?.filter(event => new Date(event.date) < now) || [];

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
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group cursor-pointer hover-shadow smooth-transition">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 smooth-transition">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                  <p className="text-gray-700 font-medium">Watch Event Highlights</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl rotate-12 opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl -rotate-12 opacity-80 animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Featured Events</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't miss these highlight events designed to elevate your tech journey
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 4).map((event, index) => {
                const isFull = event.maxParticipants && event.currentParticipants >= event.maxParticipants;
                const isFillingFast = event.maxParticipants && event.currentParticipants >= event.maxParticipants * 0.8;
                
                return (
                  <FloatingElement key={event.id} delay={index * 200}>
                    <Card className="overflow-hidden hover-shadow smooth-transition group bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                        {event.imageUrl && (
                          <img 
                            src={event.imageUrl} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 smooth-transition"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge 
                            variant={getStatusColor(event.status)}
                            className="mb-2"
                          >
                            {getStatusText(event.status, event.currentParticipants, event.maxParticipants)}
                          </Badge>
                          <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <p className="text-gray-700 mb-4">{event.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            {format(new Date(event.date), 'MMM d')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-blue-500" />
                            {event.maxParticipants 
                              ? `${event.currentParticipants}/${event.maxParticipants}`
                              : `${event.currentParticipants} registered`
                            }
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            {event.category}
                          </Badge>
                          {event.organizer && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {event.organizer}
                            </Badge>
                          )}
                        </div>

                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold group"
                          disabled={isFull || event.status === 'cancelled'}
                        >
                          {isFull ? 'Registration Full' : 
                           event.status === 'cancelled' ? 'Cancelled' :
                           event.registrationRequired ? 'Register Now' : 'Learn More'}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 smooth-transition" />
                        </Button>
                      </CardContent>
                    </Card>
                  </FloatingElement>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-12">
                <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No upcoming events scheduled.</p>
                <p className="text-gray-500 text-sm">Check back soon for exciting new events!</p>
              </div>
            )}
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
              pastEvents.slice(0, 6).map((event) => (
                <div key={event.id} className="bg-white border-2 border-purple-300 rounded-xl shadow-xl hover:shadow-2xl hover:border-purple-400 transition-all duration-300 overflow-hidden">
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
                        <span>{event.currentParticipants} attended</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
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

      <Footer />
    </div>
  );
};

export default Events;