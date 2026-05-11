import Footer from "@/components/Footer";
import InteractiveBackground from "@/components/InteractiveBackground";
import { CustomArrow, FloatingElement } from "@/components/InteractiveElements";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGallery } from "@/hooks/useGallery";
import { format } from "date-fns";
import { ArrowRight, Award, Calendar, ChevronLeft, ChevronRight, ExternalLink, Eye, Filter, Heart, Image, Loader2, Users, X } from "lucide-react";
import { useState } from "react";

const resolveGalleryImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:') || imageUrl.startsWith('/images/')) {
    return imageUrl;
  }

  return `http://localhost:5000${imageUrl}`;
};

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: galleryItems, isLoading, error } = useGallery();

  // Extract unique categories from API data
  const categories = ["All", ...new Set(galleryItems?.map(item => item.category) || [])];

  const filteredItems = selectedCategory === "All" 
    ? (galleryItems || [])
    : (galleryItems || []).filter(item => item.category === selectedCategory);

  const openLightbox = (id: string) => {
    setSelectedImage(id);
    setCurrentImageIndex(0);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = filteredItems.findIndex(item => (item._id || item.id) === selectedImage);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredItems[newIndex]._id || filteredItems[newIndex].id);
    setCurrentImageIndex(0); // Reset to first image of new gallery item
  };

  const navigateGalleryImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const item = filteredItems.find(i => (i._id || i.id) === selectedImage);
    if (!item?.images || item.images.length <= 1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : item.images.length - 1;
    } else {
      newIndex = currentImageIndex < item.images.length - 1 ? currentImageIndex + 1 : 0;
    }
    
    setCurrentImageIndex(newIndex);
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

  // Calculate dynamic stats from API data
  const stats = [
    { 
      label: "Gallery Items", 
      value: galleryItems?.length?.toString() || "0", 
      icon: Calendar 
    },
    { 
      label: "Total Views", 
      value: `${galleryItems?.reduce((sum, item) => sum + (item.views || 0), 0) || 0}`, 
      icon: Users 
    },
    { 
      label: "Total Likes", 
      value: `${galleryItems?.reduce((sum, item) => sum + (item.likes || 0), 0) || 0}`, 
      icon: Award 
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <InteractiveBackground />
        <Navigation />
        
        <section className="pt-24 pb-16 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-heading font-black leading-tight mb-6">
                <span className="text-gray-900">Moments That</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Define Us
                </span>
              </h1>
            </div>
            
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-purple-600">Loading gallery...</span>
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
                <span className="text-gray-900">Moments That</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Define Us
                </span>
              </h1>
            </div>
            
            <div className="text-center py-12">
              <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Unable to load gallery at this time.</p>
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
              <FloatingElement key={item._id || item.id || index} delay={index * 100}>
                <Card 
                  className="overflow-hidden hover-shadow smooth-transition cursor-pointer group bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                  onClick={() => openLightbox(item._id || item.id)}
                >
                  {/* Image with fallback to gradient */}
                  <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    {(() => {
                      // Prioritize images array, then imageUrl
                      const primaryImage = item.images?.find(img => img.isPrimary) || item.images?.[0];
                      const imageUrl = primaryImage?.url || item.imageUrl;
                      
                      return imageUrl ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={resolveGalleryImageUrl(imageUrl)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          {item.images && item.images.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                              +{item.images.length - 1} more
                            </div>
                          )}
                        </div>
                      ) : null;
                    })()}
                    
                    {/* Fallback content when no image or image fails to load */}
                    <div className={`absolute inset-0 flex items-center justify-center ${(item.images?.[0]?.url || item.imageUrl) ? 'hidden' : ''}`}>
                      <div className="text-center text-white">
                        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-70 group-hover:scale-110 smooth-transition" />
                        <p className="text-sm opacity-90 font-medium">{item.eventName || item.photographer || 'SAINT Gallery'}</p>
                      </div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 smooth-transition"></div>
                    
                    {item.category === 'featured' && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-yellow-500 text-white">Featured</Badge>
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 right-4 z-10">
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
                      <span className="text-sm text-gray-600 font-medium">
                        {item.date ? format(new Date(item.date), 'MMM dd, yyyy') : 'No date'}
                      </span>
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="h-4 w-4 mr-1 text-blue-500" />
                        {item.views || 0} views
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-blue-600 smooth-transition">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="space-y-1">
                      {item.tags?.slice(0, 2).map((tag, tagIndex) => (
                        <div key={tagIndex} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {tag}
                        </div>
                      ))}
                      {(item.tags?.length || 0) > 2 && (
                        <div className="text-xs text-blue-600 font-medium">
                          +{(item.tags?.length || 0) - 2} more tags
                        </div>
                      )}
                      {item.photographer && (
                        <div className="text-xs text-gray-600 flex items-center mt-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                          Photo by {item.photographer}
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

            {/* Gallery item navigation buttons */}
            <button
              onClick={() => navigateLightbox('prev')}
              className="absolute left-8 bottom-8 bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105 z-30 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 mr-1 inline" />
              Previous Gallery
            </button>
            
            <button
              onClick={() => navigateLightbox('next')}
              className="absolute right-8 bottom-8 bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105 z-30 shadow-lg"
            >
              Next Gallery
              <ChevronRight className="h-5 w-5 ml-1 inline" />
            </button>

            {/* Content */}
            {(() => {
              const item = filteredItems.find(i => (i._id || i.id) === selectedImage);
              if (!item) return null;
              
              return (
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <div className="h-96 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                    {(() => {
                      // Get current image to display
                      let imageUrl = '';
                      const hasMultipleImages = item.images && item.images.length > 0;
                      
                      if (hasMultipleImages) {
                        imageUrl = item.images[currentImageIndex]?.url || '';
                      } else {
                        imageUrl = item.imageUrl || '';
                      }
                      
                      return imageUrl ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={resolveGalleryImageUrl(imageUrl)}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          
                          {/* Image navigation for multiple images */}
                          {hasMultipleImages && item.images.length > 1 && (
                            <>
                              <button
                                onClick={() => navigateGalleryImage('prev')}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white hover:bg-black/80 rounded-full p-3 transition-all duration-200 hover:scale-110 z-20"
                              >
                                <ChevronLeft className="h-6 w-6" />
                              </button>
                              
                              <button
                                onClick={() => navigateGalleryImage('next')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white hover:bg-black/80 rounded-full p-3 transition-all duration-200 hover:scale-110 z-20"
                              >
                                <ChevronRight className="h-6 w-6" />
                              </button>
                              
                              {/* Enhanced image counter */}
                              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                                <span className="font-medium">{currentImageIndex + 1}</span>
                                <span className="text-gray-300 mx-1">/</span>
                                <span>{item.images.length}</span>
                              </div>
                              
                              {/* Improved dots indicator */}
                              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/50 px-3 py-2 rounded-full backdrop-blur-sm">
                                {item.images.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                      index === currentImageIndex 
                                        ? 'bg-white scale-125' 
                                        : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : null;
                    })()}
                    
                    {/* Fallback content */}
                    <div className={`text-center text-white ${(item.images?.[0]?.url || item.imageUrl) ? 'hidden' : ''}`}>
                      <Calendar className="h-24 w-24 mx-auto mb-4 opacity-70" />
                      <p className="text-lg opacity-90 font-medium">{item.eventName || item.photographer || 'SAINT Gallery'}</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {item.category}
                      </Badge>
                      <span className="text-gray-600">
                        {item.date ? format(new Date(item.date), 'MMM dd, yyyy') : 'No date'}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                      {item.title}
                    </h2>
                    
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                      {item.images && item.images[currentImageIndex]?.caption && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 italic">
                            <strong>Current Image:</strong> {item.images[currentImageIndex].caption}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Event Tags</h4>
                        <div className="space-y-2">
                          {item.tags?.map((tag, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                              {tag}
                            </div>
                          )) || (
                            <div className="text-sm text-gray-500 italic">No tags available</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Gallery Stats</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <Eye className="h-5 w-5 mr-2 text-blue-500" />
                            <span>{item.views} views</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Heart className="h-5 w-5 mr-2 text-red-500" />
                            <span>{item.likes} likes</span>
                          </div>
                          {item.photographer && (
                            <div className="flex items-center text-gray-600">
                              <Users className="h-5 w-5 mr-2 text-green-500" />
                              <span>Photo by {item.photographer}</span>
                            </div>
                          )}
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