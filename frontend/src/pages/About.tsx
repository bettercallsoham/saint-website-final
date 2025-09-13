import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, Lightbulb, Code, ArrowRight, Award, Calendar, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveBackground from "@/components/InteractiveBackground";

const About = () => {
  const stats = [
    { label: "Active Members", value: "150+", icon: Users },
    { label: "Projects Completed", value: "75+", icon: Target },
    { label: "Years of Impact", value: "5+", icon: Lightbulb },
    { label: "Technologies", value: "20+", icon: Code },
  ];

  const values = [
    {
      title: "Innovation",
      description: "We foster creativity and cutting-edge thinking in technology solutions.",
      icon: Lightbulb,
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Collaboration",
      description: "We believe in the power of teamwork and knowledge sharing.",
      icon: Users,
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Excellence",
      description: "We strive for the highest standards in everything we do.",
      icon: Award,
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "Inclusion",
      description: "We welcome and support students from all backgrounds and skill levels.",
      icon: Heart,
      color: "from-pink-400 to-pink-600"
    }
  ];

  const achievements = [
    "🏆 Winner of 3 National Hackathons",
    "🚀 25+ Successful Startup Projects",
    "💼 200+ Job Placements & Internships",
    "🎓 98% Member Career Success Rate",
    "🌍 Partnerships with 15+ Tech Companies",
    "📚 5000+ Hours of Workshops Delivered"
  ];

  const activities = [
    {
      category: "Technical Skills",
      items: ["AI/ML Workshops", "Full-Stack Bootcamps", "Cloud Computing", "Mobile Development"]
    },
    {
      category: "Professional Growth",
      items: ["Industry Networking", "Career Mentorship", "Resume Building", "Interview Prep"]
    },
    {
      category: "Innovation & Fun",
      items: ["Hackathons", "Coding Competitions", "Tech Talks", "Project Showcases"]
    }
  ];

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-white/80 backdrop-blur-sm">
              About SAInT
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-heading font-black leading-tight mb-6">
              <span className="text-gray-900">Shaping Tomorrow's</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tech Leaders
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-body mb-8">
              The Student Association of Information Technology (SAInT) is more than a student organization—we're 
              a thriving ecosystem where passion meets purpose, innovation meets execution, and dreams become reality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl hover-shadow smooth-transition">
                  Join Our Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="px-8 py-3 rounded-xl hover-shadow smooth-transition">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover-shadow smooth-transition bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <div className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-700">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 shadow-2xl text-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 mr-3" />
                  <h3 className="text-3xl font-heading font-bold">Our Mission</h3>
                </div>
                <p className="text-xl leading-relaxed text-blue-50">
                  To empower students through hands-on technology education, foster innovation, 
                  and build a community where every member can thrive in the digital future.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 border-0 shadow-2xl text-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Globe className="h-8 w-8 mr-3" />
                  <h3 className="text-3xl font-heading font-bold">Our Vision</h3>
                </div>
                <p className="text-xl leading-relaxed text-purple-50">
                  To be the premier student technology organization that bridges the gap between 
                  academic learning and industry excellence, creating tomorrow's tech leaders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-saint-bgSecondary">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do as a community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center group hover-shadow smooth-transition bg-white border-0 shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 smooth-transition" 
                     style={{backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}></div>
                <CardHeader className="relative z-10">
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition shadow-lg`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 font-heading">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-xl text-gray-600">
              Comprehensive programs designed to accelerate your tech journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {activities.map((activity, index) => (
              <Card key={index} className="hover-shadow smooth-transition bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 font-heading text-center">{activity.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activity.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 smooth-transition">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-4 bg-saint-bgSecondary">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-xl text-gray-600">
              Proud moments that define our journey and impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="hover-shadow smooth-transition bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-lg text-gray-700 font-medium text-center">{achievement}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-4xl font-heading font-bold mb-6">Ready to Transform Your Future?</h3>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join a community that's not just about technology—it's about building the leaders, 
              innovators, and changemakers of tomorrow. Your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl hover-shadow smooth-transition">
                  Become a Member
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl hover-shadow smooth-transition">
                  Attend an Event
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 px-8 py-3 rounded-xl hover-shadow smooth-transition">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;