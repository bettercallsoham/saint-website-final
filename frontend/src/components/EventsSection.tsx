import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

const EventsSection = () => {
  const { data: events, isLoading, error } = useEvents();

  // Helper function to get event status badge
  const getEventStatusBadge = (event: any) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (eventDate < now) return { text: "Completed", variant: "secondary" as const };
    if (event.status === "cancelled") return { text: "Cancelled", variant: "destructive" as const };
    if (event.registrationRequired && event.maxParticipants && event.currentParticipants >= event.maxParticipants * 0.9) {
      return { text: "Filling Fast", variant: "secondary" as const };
    }
    if (eventDate > now) return { text: "Registration Open", variant: "default" as const };
    return { text: "Upcoming", variant: "outline" as const };
  };

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events?.filter(event => new Date(event.date) >= now) || [];
  const pastEvents = events?.filter(event => new Date(event.date) < now) || [];

  if (isLoading) {
    return (
      <section id="events" className="py-8 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 bg-white/50 border-blue-200 text-blue-700">
              Upcoming Events
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-saint-title">
              Upcoming <span className="text-saint-primary">Events</span>
            </h2>
            <p className="text-xl text-saint-body max-w-2xl mx-auto">
              Join us for exciting tech events, workshops, and networking opportunities designed to enhance your skills and career.
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-blue-600">Loading events...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="events" className="py-8 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 bg-white/50 border-blue-200 text-blue-700">
              Upcoming Events
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-saint-title">
              Upcoming <span className="text-saint-primary">Events</span>
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Unable to load events at this time.</p>
            <p className="text-gray-600">Please check back later or contact us if the problem persists.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-8 bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 bg-white/50 border-blue-200 text-blue-700">
            Upcoming Events
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-saint-title">
            Upcoming <span className="text-saint-primary">Events</span>
          </h2>
          <p className="text-xl text-saint-body max-w-2xl mx-auto">
            Join us for exciting tech events, workshops, and networking opportunities designed to enhance your skills and career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {upcomingEvents.slice(0, 6).map((event) => {
            const statusBadge = getEventStatusBadge(event);
            return (
              <Card 
                key={event.id} 
                className="bg-white/80 backdrop-blur-sm border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 shadow-lg"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={statusBadge.variant}>
                      {statusBadge.text}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-saint-title">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-saint-body">{event.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-saint-body">
                      <Calendar className="h-4 w-4 mr-2 text-saint-primary" />
                      {format(new Date(event.date), "MMMM d, yyyy")} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-saint-body">
                      <MapPin className="h-4 w-4 mr-2 text-saint-primary" />
                      {event.location}
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center text-sm text-saint-body">
                        <Users className="h-4 w-4 mr-2 text-saint-primary" />
                        {event.currentParticipants}/{event.maxParticipants} participants
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    size="sm"
                    disabled={event.maxParticipants && event.currentParticipants >= event.maxParticipants}
                  >
                    {event.registrationRequired ? "RSVP Now" : "Learn More"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/events">
            <Button 
              variant="outline" 
              size="lg"
              className="group border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 px-8 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300"
            >
              View All Events
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Past Events Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 bg-white border-purple-200 text-purple-700">
              Past Events
            </Badge>
            <h3 className="text-3xl font-bold mb-4 text-slate-800">
              Recent <span className="text-purple-600">Highlights</span>
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Check out our recent successful events and workshops.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pastEvents.slice(0, 4).map((event) => (
              <Card 
                key={event.id} 
                className="bg-white border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 shadow-lg relative z-10"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                      Completed
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-slate-800 font-semibold">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700 font-medium">{event.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-700">
                      <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="font-medium">{format(new Date(event.date), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <Users className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="font-medium">{event.currentParticipants} participants</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;