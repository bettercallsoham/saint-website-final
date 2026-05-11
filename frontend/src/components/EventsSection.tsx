import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EventsSection = () => {
  return (
    <section id="events" className="py-12 bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="outline" className="mb-4 bg-white/50 border-blue-200 text-blue-700">Events</Badge>
        <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-saint-title">Events & Highlights</h2>
        <p className="text-lg text-saint-body max-w-2xl mx-auto mb-6">Explore upcoming and past events on the Events page.</p>

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
    </section>
  );
};

export default EventsSection;