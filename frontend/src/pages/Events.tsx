import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Play, ArrowRight } from "lucide-react";
import { CustomArrow, FloatingElement } from "@/components/InteractiveElements";
import InteractiveBackground from "@/components/InteractiveBackground";

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "AI/ML Workshop Series",
      date: "2025-09-20",
      time: "2:00 PM - 5:00 PM",
      location: "Tech Hall 101",
      description: "Learn the fundamentals of Machine Learning with hands-on Python exercises.",
      attendees: 45,
      maxAttendees: 60,
      tags: ["AI", "Python", "Workshop"],
      status: "open",
      featured: true
    },
    {
      id: 2,
      title: "Fall Hackathon 2025",
      date: "2025-10-15",
      time: "9:00 AM - 9:00 PM",
      location: "Innovation Center",
      description: "48-hour coding challenge focusing on sustainable technology solutions.",
      attendees: 89,
      maxAttendees: 100,
      tags: ["Hackathon", "Competition", "Sustainability"],
      status: "filling-fast",
      featured: true
    },
    {
      id: 3,
      title: "Industry Networking Night",
      date: "2025-09-25",
      time: "6:00 PM - 9:00 PM",
      location: "Student Union Ballroom",
      description: "Meet with tech industry professionals and explore internship opportunities.",
      attendees: 23,
      maxAttendees: 80,
      tags: ["Networking", "Career", "Industry"],
      status: "open",
      featured: false
    }
  ];

  const pastEvents = [
    {
      title: "React.js Bootcamp",
      date: "2025-08-15",
      description: "Intensive 3-day bootcamp covering React fundamentals and advanced concepts.",
      attendees: 55
    },
    {
      title: "Cybersecurity Symposium",
      date: "2025-07-22",
      description: "Expert talks on latest cybersecurity threats and defense strategies.",
      attendees: 120
    },
    {
      title: "Open Source Contributions Workshop",
      date: "2025-06-10",
      description: "Learn how to contribute to open source projects and build your portfolio.",
      attendees: 38
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'filling-fast': return 'secondary';
      case 'full': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open Registration';
      case 'filling-fast': return 'Filling Fast';
      case 'full': return 'Registration Full';
      default: return 'Open Registration';
    }
  };

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
            {upcomingEvents.filter(event => event.featured).map((event, index) => (
              <FloatingElement key={event.id} delay={index * 200}>
                <Card className="overflow-hidden hover-shadow smooth-transition group bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 smooth-transition"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge 
                        variant={event.status === 'filling-fast' ? 'secondary' : 'default'}
                        className="mb-2"
                      >
                        {getStatusText(event.status)}
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        {event.time.split(' - ')[0]}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        {event.attendees}/{event.maxAttendees}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs bg-gray-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold group"
                      disabled={event.status === 'full'}
                    >
                      {event.status === 'full' ? 'Registration Full' : 'Register Now'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 smooth-transition" />
                    </Button>
                  </CardContent>
                </Card>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 px-4 bg-saint-bgSecondary">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-saint-title mb-8 text-center">Past Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-saint-title">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-saint-body mb-3">{event.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-saint-body">
                      <Calendar className="h-4 w-4 mr-2 text-saint-primary" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-saint-body">
                      <Users className="h-4 w-4 mr-2 text-saint-primary" />
                      {event.attendees} attended
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;