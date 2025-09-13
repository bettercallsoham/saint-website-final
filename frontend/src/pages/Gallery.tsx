import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Award, X, ChevronLeft, ChevronRight, Filter, Search, ArrowRight, ExternalLink } from "lucide-react";
import { FloatingElement, CustomArrow } from "@/components/InteractiveElements";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useState } from "react";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const categories = ["All", "Hackathon", "Workshop", "Networking", "Training", "Awards"];

  const galleryItems = [
    {
      id: 1,
      title: "Fall Hackathon 2024",
      date: "October 2024",
      category: "Hackathon",
      participants: 85,
      description: "48-hour coding marathon focused on sustainable technology solutions.",
      imageAlt: "Students coding during hackathon",
      highlights: ["15 teams competed", "3 winning projects", "$5000 in prizes"],
      featured: true
    },
    {
      id: 2,
      title: "AI Workshop Series",
      date: "September 2024",
      category: "Workshop",
      participants: 60,
      description: "Three-part workshop series on machine learning fundamentals.",
      imageAlt: "Students learning AI concepts",
      highlights: ["3 days of learning", "Hands-on Python coding", "Industry guest speakers"],
      featured: true
    },
    {
      id: 3,
      title: "Tech Industry Night",
      date: "August 2024",
      category: "Networking",
      participants: 120,
      description: "Networking event with leading tech companies and recruiters.",
      imageAlt: "Professional networking event",
      highlights: ["12 companies attended", "50+ job opportunities", "Career panel discussion"],
      featured: false
    },
    {
      id: 4,
      title: "React Bootcamp",
      date: "July 2024",
      category: "Training",
      participants: 45,
      description: "Intensive bootcamp covering React.js from basics to advanced concepts.",
      imageAlt: "React coding bootcamp session",
      highlights: ["5 days intensive", "Final project showcase", "Portfolio building"],
      featured: true
    },
    {
      id: 5,
      title: "Annual Awards Ceremony",
      date: "May 2024",
      category: "Awards",
      participants: 200,
      description: "Celebrating outstanding achievements in technology and leadership.",
      imageAlt: "Awards ceremony with students",
      highlights: ["10 awards given", "Alumni speakers", "Achievement recognition"],
      featured: false
    },
    {
      id: 6,
      title: "Open Source Contributions Day",
      date: "April 2024",
      category: "Workshop",
      participants: 35,
      description: "Learning how to contribute to open source projects and build portfolios.",
      imageAlt: "Students working on open source projects",
      highlights: ["15 projects contributed to", "GitHub workflows", "Mentorship sessions"],
      featured: false
    }
  ];

  const filteredItems = selectedCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (id: number) => {
    setSelectedImage(id);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredItems[newIndex].id);
  };

  const getCategoryColor = (category: string, isSelected: boolean = false) => {
    if (isSelected) return "default";
    switch (category.toLowerCase()) {
      case 'hackathon': return 'outline';
      case 'workshop': return 'outline';
      case 'networking': return 'outline';
      case 'training': return 'outline';
      case 'awards': return 'outline';
      default: return 'outline';
    }
  };

  const stats = [
    { label: "Events Captured", value: "25+", icon: Calendar },
    { label: "Total Participants", value: "800+", icon: Users },
    { label: "Achievements", value: "50+", icon: Award }
  ];

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <FloatingElement>
              <Badge variant="outline" className="mb-4 bg-white/80 backdrop-blur-sm">
                Gallery
              </Badge>
            </FloatingElement>
            
            <h1 className="text-5xl md:text-6xl font-heading font-black leading-tight mb-6">
              <span className="text-gray-900">Moments That</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Define Us
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-body">
              Explore the highlights from our events, workshops, and community activities. 
              See the energy and passion that drives our tech community forward.
            </p>
            
            <div className="flex justify-center mt-8">
              <CustomArrow direction="down" />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-6 mb-16">
            {stats.map((stat, index) => (
              <FloatingElement key={index} delay={index * 100}>
                <Card className="text-center hover-shadow smooth-transition bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <stat.icon className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                    <div className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-700">{stat.label}</div>
                  </CardContent>
                </Card>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center mr-4 text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              <span className="font-medium">Filter by:</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`smooth-transition ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <FloatingElement key={item.id} delay={index * 100}>
                <Card 
                  className="overflow-hidden hover-shadow smooth-transition cursor-pointer group bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                  onClick={() => openLightbox(item.id)}
                >
                  {/* Image placeholder with gradient and overlay */}
                  <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 smooth-transition"></div>
                    {item.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-white">Featured</Badge>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-70 group-hover:scale-110 smooth-transition" />
                        <p className="text-sm opacity-90 font-medium">{item.imageAlt}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge 
                        variant="outline"
                        className="mb-2 bg-white/20 backdrop-blur-sm text-white border-white/30"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600 font-medium">{item.date}</span>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1 text-blue-500" />
                        {item.participants}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-blue-600 smooth-transition">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="space-y-1">
                      {item.highlights.slice(0, 2).map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {highlight}
                        </div>
                      ))}
                      {item.highlights.length > 2 && (
                        <div className="text-xs text-blue-600 font-medium">
                          +{item.highlights.length - 2} more highlights
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:bg-white/20 z-10"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateLightbox('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateLightbox('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Content */}
            {(() => {
              const item = filteredItems.find(i => i.id === selectedImage);
              if (!item) return null;
              
              return (
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <div className="h-96 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Calendar className="h-24 w-24 mx-auto mb-4 opacity-70" />
                      <p className="text-lg opacity-90 font-medium">{item.imageAlt}</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {item.category}
                      </Badge>
                      <span className="text-gray-600">{item.date}</span>
                    </div>
                    
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                      {item.title}
                    </h2>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Event Highlights</h4>
                        <div className="space-y-2">
                          {item.highlights.map((highlight, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Participation</h4>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-5 w-5 mr-2 text-blue-500" />
                          <span>{item.participants} participants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-heading font-bold text-white mb-6">
              Want to Be Part of Our Next Story?
            </h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join SAInT and create memorable experiences while advancing your tech skills. 
              Your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Join Our Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="secondary" size="lg" className="border-white text-blue-600 bg-white hover:bg-blue-50 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                View Upcoming Events
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;