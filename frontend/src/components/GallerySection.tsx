import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGallery } from "@/hooks/useGallery";
import { format } from "date-fns";
import { ArrowRight, Award, Image, Loader2, Users } from "lucide-react";
import { Link } from "react-router-dom";

const resolveGalleryImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:') || imageUrl.startsWith('/images/')) {
    return imageUrl;
  }

  return `http://localhost:5000${imageUrl}`;
};

const GallerySection = () => {
  const { data: galleryItems, isLoading, error } = useGallery();



  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hackathon': return 'bg-red-100 text-red-700 border-red-200';
      case 'workshop': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'networking': return 'bg-green-100 text-green-700 border-green-200';
      case 'conference': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'seminar': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <section id="gallery" className="py-12 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 bg-purple-50 border-purple-200 text-purple-700">
              Gallery Highlights
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-saint-title">
              Moments That <span className="text-saint-primary">Matter</span>
            </h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-purple-600">Loading gallery...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className="py-12 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 bg-purple-50 border-purple-200 text-purple-700">
              Gallery Highlights
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-saint-title">
              Moments That <span className="text-saint-primary">Matter</span>
            </h2>
          </div>
          <div className="text-center py-12">
            <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Unable to load gallery at this time.</p>
            <p className="text-gray-500 text-sm">Please check back later or contact us if the problem persists.</p>
          </div>
        </div>
      </section>
    );
  }

  // Get featured items (latest 3)
  const featuredItems = galleryItems?.slice(0, 3) || [];

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



        {/* Featured Gallery Items */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredItems.length > 0 ? (
            featuredItems.map((item) => (
              <Card key={item._id || item.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                  {(() => {
                    // Prioritize images array, then imageUrl
                    const primaryImage = item.images?.find(img => img.isPrimary) || item.images?.[0];
                    const imageUrl = primaryImage?.url || item.imageUrl;
                    
                    return imageUrl ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={resolveGalleryImageUrl(imageUrl)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        {item.images && item.images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                            {item.images.length} photos
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                  
                  {/* Fallback content */}
                  <div className={`w-full h-full flex items-center justify-center ${(item.images?.[0]?.url || item.imageUrl) ? 'hidden' : ''}`}>
                    <Image className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                  <div className="absolute bottom-4 left-4">
                    <Badge className={`${getCategoryColor(item.category)} border`}>
                      {item.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 text-white bg-black/50 px-2 py-1 rounded text-sm">
                    {format(new Date(item.date), "MMM yyyy")}
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-saint-title mb-2 group-hover:text-saint-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-saint-body text-sm mb-3">{item.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-saint-body">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-saint-primary" />
                      {item.views} views
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1 text-saint-primary" />
                      {item.likes} likes
                    </div>
                  </div>

                  {item.photographer && (
                    <div className="text-xs text-saint-body">
                      <div className="w-1.5 h-1.5 bg-saint-primary rounded-full inline-block mr-2" />
                      Photo by {item.photographer}
                    </div>
                  )}

                  {item.eventName && (
                    <div className="text-xs text-saint-body">
                      <div className="w-1.5 h-1.5 bg-saint-primary rounded-full inline-block mr-2" />
                      From {item.eventName}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No gallery items available yet.</p>
              <p className="text-gray-500 text-sm">Check back soon for event photos and highlights!</p>
            </div>
          )}
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