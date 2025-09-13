import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const GallerySection = () => {
  const featuredItems = [
    {
      id: 1,
      title: "Fall Hackathon 2024",
      date: "October 2024",
      category: "Hackathon",
      participants: 85,
      description: "48-hour coding marathon focused on sustainable technology solutions.",
      highlights: ["15 teams competed", "3 winning projects", "$5000 in prizes"]
    },
    {
      id: 2,
      title: "AI Workshop Series",
      date: "September 2024",
      category: "Workshop", 
      participants: 60,
      description: "Three-part workshop series on machine learning fundamentals.",
      highlights: ["3 days of learning", "Hands-on Python coding", "Industry guest speakers"]
    },
    {
      id: 3,
      title: "Tech Industry Night",
      date: "August 2024",
      category: "Networking",
      participants: 120,
      description: "Networking event with leading tech companies and recruiters.",
      highlights: ["12 companies attended", "50+ job opportunities", "Career panel discussion"]
    }
  ];

  const stats = [
    { label: "Events Captured", value: "25+", icon: Calendar },
    { label: "Total Participants", value: "800+", icon: Users },
    { label: "Achievements", value: "50+", icon: Award }
  ];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hackathon': return 'bg-red-100 text-red-700 border-red-200';
      case 'workshop': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'networking': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <section id="gallery" className="py-12 bg-white relative z-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 bg-purple-50 border-purple-200 text-purple-700">
            Gallery Highlights
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-saint-title">
            Moments That <span className="text-saint-primary">Matter</span>
          </h2>
          <p className="text-xl text-saint-body max-w-2xl mx-auto">
            Relive the excitement, learning, and connections from our most memorable tech events and achievements.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-blue-100 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4">
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Featured Gallery Items */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featuredItems.map((item, index) => (
            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                <div className="absolute bottom-4 left-4">
                  <Badge className={`${getCategoryColor(item.category)} border`}>
                    {item.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 text-white bg-black/50 px-2 py-1 rounded text-sm">
                  {item.date}
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-saint-title mb-2 group-hover:text-saint-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-saint-body text-sm mb-3">{item.description}</p>
                </div>

                <div className="flex items-center text-sm text-saint-body mb-3">
                  <Users className="h-4 w-4 mr-2 text-saint-primary" />
                  {item.participants} participants
                </div>

                <div className="space-y-1">
                  {item.highlights.slice(0, 2).map((highlight, idx) => (
                    <div key={idx} className="text-xs text-saint-body flex items-center">
                      <div className="w-1.5 h-1.5 bg-saint-primary rounded-full mr-2" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link to="/gallery">
            <Button 
              variant="outline" 
              size="lg"
              className="group border-2 border-purple-200 hover:border-purple-300 text-purple-600 hover:text-purple-700 px-8 py-3 rounded-xl hover:bg-purple-50 transition-all duration-300"
            >
              View Full Gallery
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;