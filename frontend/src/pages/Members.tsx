import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Star, ArrowRight, ExternalLink } from "lucide-react";
import { FloatingElement, CustomArrow } from "@/components/InteractiveElements";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useState } from "react";

const Members = () => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const executiveTeam = [
    {
      name: "Alex Chen",
      position: "President",
      year: "Senior",
      major: "Computer Science",
      bio: "Leading SAInT's vision and strategic initiatives. Passionate about AI and machine learning.",
      github: "alexchen",
      linkedin: "alex-chen-cs",
      email: "alex.chen@university.edu",
      avatar: "AC",
      skills: ["AI/ML", "Python", "Leadership"],
      projects: 12
    },
    {
      name: "Sarah Johnson",
      position: "Vice President",
      year: "Junior",
      major: "Software Engineering",
      bio: "Coordinating events and member engagement. Loves full-stack development and UX design.",
      github: "sarahjdev",
      linkedin: "sarah-johnson-dev",
      email: "sarah.j@university.edu",
      avatar: "SJ",
      skills: ["React", "UX Design", "Node.js"],
      projects: 8
    },
    {
      name: "Michael Rodriguez",
      position: "Technical Director",
      year: "Senior",
      major: "Computer Science",
      bio: "Overseeing technical workshops and projects. Expert in cloud computing and DevOps.",
      github: "mrodriguez",
      linkedin: "michael-rodriguez-tech",
      email: "m.rodriguez@university.edu",
      avatar: "MR",
      skills: ["AWS", "Docker", "DevOps"],
      projects: 15
    },
    {
      name: "Emily Zhang",
      position: "Events Coordinator",
      year: "Sophomore",
      major: "Information Systems",
      bio: "Planning and executing amazing events. Interested in cybersecurity and data analytics.",
      github: "emilyzhang",
      linkedin: "emily-zhang-is",
      email: "emily.zhang@university.edu",
      avatar: "EZ",
      skills: ["Cybersecurity", "Data Analytics", "Event Planning"],
      projects: 6
    }
  ];

  const topContributors = [
    {
      name: "David Kim",
      contributions: 47,
      specialties: ["React", "Node.js", "MongoDB"]
    },
    {
      name: "Lisa Wang",
      contributions: 42,
      specialties: ["Python", "Django", "PostgreSQL"]
    },
    {
      name: "James Wilson",
      contributions: 38,
      specialties: ["Java", "Spring", "AWS"]
    },
    {
      name: "Maria Garcia",
      contributions: 35,
      specialties: ["Flutter", "Dart", "Firebase"]
    },
    {
      name: "Ryan Patel",
      contributions: 31,
      specialties: ["C++", "Algorithms", "System Design"]
    }
  ];

  const memberStats = [
    { label: "Total Members", value: "156", description: "Active student members" },
    { label: "New This Semester", value: "28", description: "Recently joined" },
    { label: "Alumni Network", value: "200+", description: "Graduated members" },
    { label: "Industry Partners", value: "15", description: "Company connections" }
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
                Our Community
              </Badge>
            </FloatingElement>
            
            <h1 className="text-5xl md:text-6xl font-heading font-black leading-tight mb-6">
              <span className="text-gray-900">Meet the</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SAInT Family
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-body">
              A diverse community of talented students, passionate about technology 
              and committed to learning, growing, and building together.
            </p>
            
            <div className="flex justify-center mt-8">
              <CustomArrow direction="down" />
            </div>
          </div>

          {/* Member Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {memberStats.map((stat, index) => (
              <FloatingElement key={index} delay={index * 100}>
                <Card className="text-center hover-shadow smooth-transition bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-600">{stat.description}</div>
                  </CardContent>
                </Card>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Team */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Executive Team</h2>
            <p className="text-xl text-gray-600">
              Meet the dedicated leaders driving SAInT's mission forward.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {executiveTeam.map((member, index) => (
              <FloatingElement key={index} delay={index * 150}>
                <Card 
                  className={`group cursor-pointer smooth-transition hover-shadow bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden ${
                    hoveredMember === index ? 'scale-105' : ''
                  }`}
                  onMouseEnter={() => setHoveredMember(index)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 smooth-transition"></div>
                  
                  <CardHeader className="relative z-10 text-center">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg group-hover:shadow-xl smooth-transition">
                        <span className="text-2xl font-bold text-white">
                          {member.avatar}
                        </span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg text-gray-900 font-heading">{member.name}</CardTitle>
                    <Badge variant="default" className="mb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {member.position}
                    </Badge>
                    <p className="text-sm text-gray-600">{member.year} • {member.major}</p>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">{member.bio}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-600">Skills</span>
                        <span className="text-xs text-gray-500">{member.projects} projects</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs bg-gray-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 hover:bg-blue-50 group/btn"
                        onClick={() => window.open(`https://github.com/${member.github}`, '_blank')}
                      >
                        <Github className="h-4 w-4 group-hover/btn:text-blue-600 smooth-transition" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 hover:bg-blue-50 group/btn"
                        onClick={() => window.open(`https://linkedin.com/in/${member.linkedin}`, '_blank')}
                      >
                        <Linkedin className="h-4 w-4 group-hover/btn:text-blue-600 smooth-transition" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 hover:bg-blue-50 group/btn"
                        onClick={() => window.open(`mailto:${member.email}`, '_blank')}
                      >
                        <Mail className="h-4 w-4 group-hover/btn:text-blue-600 smooth-transition" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section className="py-16 px-4 bg-saint-bgSecondary">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-saint-title mb-4">Top Contributors</h2>
            <p className="text-lg text-saint-body">
              Recognizing our most active and engaged community members.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {topContributors.map((contributor, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="relative">
                    <div className="w-16 h-16 bg-saint-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-lg font-bold text-saint-title">
                        {contributor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2">
                        <Star className="h-6 w-6 text-saint-primary fill-current" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-base text-saint-title">{contributor.name}</CardTitle>
                  <div className="flex items-center justify-center text-saint-primary font-semibold">
                    {contributor.contributions} contributions
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {contributor.specialties.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-saint-title mb-6">Ready to Join Our Community?</h2>
          <p className="text-lg text-saint-body mb-8">
            Become part of a supportive network of tech enthusiasts. 
            Learn, build, and grow with like-minded students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Join SAInT Today
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Members;