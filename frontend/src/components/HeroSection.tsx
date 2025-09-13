import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveBackground from "./InteractiveBackground";
import { CustomArrow, FloatingElement } from "./InteractiveElements";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Interactive Background */}
      <InteractiveBackground />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 mt-16">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-heading font-black leading-tight">
                <span className="text-gray-900">Student Associate of</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Information Technology
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-700 max-w-2xl font-body leading-relaxed">
                Connecting IT students, fostering innovation, and building the future of technology together.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl modern-shadow hover-shadow smooth-transition text-lg"
                >
                  Join SAInT Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 bounce-transition" />
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2">
                <CustomArrow direction="right" />
                <Link to="/about">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="font-semibold px-8 py-4 rounded-2xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 smooth-transition text-lg hover-shadow"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12">
              <div className="text-center group hover-shadow rounded-2xl p-6 smooth-transition bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 font-heading">150+</div>
                <div className="text-sm text-gray-600 font-medium">Active Members</div>
              </div>
              
              <div className="text-center group hover-shadow rounded-2xl p-6 smooth-transition bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 font-heading">75+</div>
                <div className="text-sm text-gray-600 font-medium">Events Hosted</div>
              </div>
              
              <div className="text-center group hover-shadow rounded-2xl p-6 smooth-transition bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 font-heading">25+</div>
                <div className="text-sm text-gray-600 font-medium">Awards Won</div>
              </div>
            </div>
          </div>

          {/* Right side - Floating elements for visual appeal */}
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 opacity-20">
              {/* Floating geometric shapes */}
              <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl rotate-12 animate-pulse"></div>
              <div className="absolute bottom-32 right-40 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl rotate-45 animate-pulse delay-1000"></div>
              <div className="absolute top-40 right-60 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl -rotate-12 animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
