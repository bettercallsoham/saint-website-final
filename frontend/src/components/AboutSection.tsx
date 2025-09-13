import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Brain, Handshake, Rocket, ArrowRight, Users, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  const features = [
    {
      icon: Code,
      title: "Technical Excellence",
      description: "Hands-on coding workshops, hackathons, and project-based learning that builds real-world skills."
    },
    {
      icon: Brain,
      title: "Innovation Hub",
      description: "Collaborative environment where creative ideas transform into impactful technological solutions."
    },
    {
      icon: Handshake,
      title: "Professional Network",
      description: "Connect with industry professionals, alumni, and peers to build lasting professional relationships."
    },
    {
      icon: Rocket,
      title: "Career Acceleration",
      description: "Mentorship programs, internship opportunities, and career guidance to launch your tech career."
    }
  ];

  const achievements = [
    { icon: Users, label: "150+ Members", description: "Active tech enthusiasts" },
    { icon: Calendar, label: "75+ Events", description: "Workshops & networking" },
    { icon: Award, label: "25+ Awards", description: "Competition victories" },
  ];

  return (
    <section id="about" className="py-12 bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* Background Pattern - More subtle overlay */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-30 -z-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 bg-white border-blue-200 text-blue-700">
            About SAINT
          </Badge>
          <h2 className="text-5xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Empowering Tomorrow's
            <span className="block">Tech Leaders</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            SAINT is more than a tech club—we're a vibrant community of innovators, creators, and problem-solvers 
            dedicated to shaping the future of technology.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-heading font-bold text-white mb-4">Our Mission</h3>
              <p className="text-xl text-blue-50 leading-relaxed">
                To create an inclusive community where students develop technical excellence, 
                build meaningful connections, and transform innovative ideas into real-world impact.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div key={index} className="text-center p-6 bg-white rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4 shadow-md">
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{achievement.label}</div>
                <div className="text-slate-700 font-medium">{achievement.description}</div>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            // Special styling for Innovation Hub and Professional Network cards
            const isSpecialCard = feature.title === "Innovation Hub" || feature.title === "Professional Network";
            return (
              <Card key={index} className={`group relative bg-white border-slate-200 shadow-lg ${isSpecialCard ? '' : 'hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2'} z-10`}>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-heading font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-600 leading-relaxed text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-3xl font-heading font-bold text-slate-800 mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              Connect with fellow innovators, participate in exciting projects, and accelerate your tech journey with SAINT.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/contact">
                Join SAINT Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="group border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 px-8 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300">
              <Link to="/events">
                Explore Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
