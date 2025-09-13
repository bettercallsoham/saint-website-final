import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EventsSection = () => {
  const upcomingEvents = [
    {
      title: "AI/ML Workshop Series",
      date: "September 20, 2025",
      time: "2:00 PM",
      location: "Tech Hall 101",
      capacity: "60 seats",
      status: "registration-open",
      description: "Learn the fundamentals of Machine Learning with hands-on Python exercises."
    },
    {
      title: "Fall Hackathon 2025",
      date: "October 15, 2025",
      time: "9:00 AM",
      location: "Innovation Center",
      capacity: "100 participants",
      status: "filling-fast",
      description: "48-hour coding challenge focusing on sustainable technology solutions."
    },
    {
      title: "Industry Networking Night",
      date: "September 25, 2025",
      time: "6:00 PM",
      location: "Student Union Ballroom",
      capacity: "80 seats",
      status: "upcoming",
      description: "Meet with tech industry professionals and explore internship opportunities."
    }
  ];

  const pastEvents = [
    {
      title: "Spring Tech Conference 2024",
      date: "April 15, 2024",
      attendees: "120 participants",
      location: "Main Auditorium",
      description: "A successful conference featuring industry leaders and innovative presentations."
    },
    {
      title: "React Workshop Series",
      date: "March 10, 2024",
      attendees: "85 participants",
      location: "Lab 205",
      description: "Comprehensive hands-on workshop covering React fundamentals and advanced patterns."
    }
  ];

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
          {upcomingEvents.map((event, index) => (
            <Card 
              key={index} 
              className="bg-white/80 backdrop-blur-sm border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 shadow-lg"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant={event.status === "registration-open" ? "default" : event.status === "filling-fast" ? "secondary" : "outline"}
                  >
                    {event.status === "registration-open" ? "Registration Open" : 
                     event.status === "filling-fast" ? "Filling Fast" : "Upcoming"}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-saint-title">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-saint-body">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-saint-body">
                    <Calendar className="h-4 w-4 mr-2 text-saint-primary" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center text-sm text-saint-body">
                    <MapPin className="h-4 w-4 mr-2 text-saint-primary" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-saint-body">
                    <Users className="h-4 w-4 mr-2 text-saint-primary" />
                    {event.capacity}
                  </div>
                </div>

                <Button 
                  className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="sm"
                >
                  RSVP Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
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
            {pastEvents.map((event, index) => (
              <Card 
                key={index} 
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
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <Users className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="font-medium">{event.attendees}</span>
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