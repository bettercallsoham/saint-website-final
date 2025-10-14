import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Star, ArrowRight, ExternalLink, Loader2, Users } from "lucide-react";
import { FloatingElement, CustomArrow } from "@/components/InteractiveElements";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useState } from "react";
import { useMembers, useCoreTeamMembers } from "@/hooks/useMembers";

const Members = () => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const { data: members, isLoading: isLoadingMembers, error: membersError } = useMembers();
  const { data: coreTeamMembers, isLoading: isLoadingCoreTeam, error: coreTeamError } = useCoreTeamMembers();

  const isLoading = isLoadingMembers || isLoadingCoreTeam;
  const error = membersError || coreTeamError;

  // Separate core team by designation hierarchy
  const executivePositions = ['President', 'Vice-President', 'Faculty Advisor', 'Director Administration', 'Secretary', 'Treasurer'];
  const executiveTeam = coreTeamMembers?.filter(member => 
    executivePositions.includes(member.designation || member.position)
  ) || [];

  // Other core team members (non-executive positions)
  const otherCoreMembers = coreTeamMembers?.filter(member => 
    !executivePositions.includes(member.designation || member.position)
  ) || [];

  // Regular members (from User model)
  const regularMembers = members?.filter(member => 
    !['admin'].includes(member.role?.toLowerCase())
  ) || [];

  // Hardcoded fallback data for when API is not available
  const fallbackExecutiveTeam = [
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
      skills: ["AWS", "Docker", "Cybersecurity"],
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
      skills: ["AWS", "Docker", "Cybersecurity"],
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
      skills: ["AWS", "Docker", "Cybersecurity"],
      projects: 15
    },
    {
      name: "Emily Zhang",
      position: "Events Coordinator",
      year: "Sophomore",
      major: "IT",
      bio: "Planning and executing amazing events. Interested in cybersecurity.",
      github: "emilyzhang",
      linkedin: "emily-zhang-is",
      email: "emily.zhang@university.edu",
      avatar: "EZ",
      skills: ["AWS", "Docker", "Cybersecurity"],
      projects: 6
    }
  ];

  // Calculate dynamic member stats from API data
  const totalMembers = (members?.length || 0) + (coreTeamMembers?.length || 0);
  const memberStats = [
    { 
      label: "Total Members", 
      value: totalMembers.toString(), 
      description: "Active student members" 
    },
    { 
      label: "Core Team", 
      value: coreTeamMembers?.length?.toString() || "0", 
      description: "Leadership & committee" 
    },
    { 
      label: "Executive Team", 
      value: executiveTeam?.length?.toString() || "0", 
      description: "Leadership positions" 
    },
    { 
      label: "Active Members", 
      value: members?.filter(m => m.isActive)?.length?.toString() || "0", 
      description: "Regular members" 
    }
  ];

  // Helper function to generate avatar initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <InteractiveBackground />
        <Navigation />
        
        <section className="pt-24 pb-16 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-heading font-black leading-tight mb-6">
                <span className="text-gray-900">Meet the</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SAInT Family
                </span>
              </h1>
            </div>
            
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-blue-600">Loading members...</span>
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
                <span className="text-gray-900">Meet the</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SAInT Family
                </span>
              </h1>
            </div>
            
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Unable to load member information at this time.</p>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {executiveTeam.length > 0 ? (
              executiveTeam.map((member, index) => (
                <FloatingElement key={member.id} delay={index * 150}>
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
                        {member.profileImage ? (
                          <img 
                            src={member.profileImage} 
                            alt={member.name}
                            className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl smooth-transition"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg group-hover:shadow-xl smooth-transition ${member.profileImage ? 'hidden' : ''}`}>
                          <span className="text-2xl font-bold text-white">
                            {getInitials(member.name)}
                          </span>
                        </div>
                      </div>
                      
                      <CardTitle className="text-lg text-gray-900 font-heading mb-2">{member.name}</CardTitle>
                      <div className="flex justify-center mb-3">
                        <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {member.designation || member.position}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 text-center">{member.year} - {member.branch}</p>
                    </CardHeader>
                    
                    <CardContent className="relative z-10">
                      {member.bio && (
                        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{member.bio}</p>
                      )}
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-gray-600">Skills</span>
                          <span className="text-xs text-gray-500">ID: {member.studentId}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.skills && member.skills.length > 0 ? (
                            member.skills.slice(0, 3).map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs bg-gray-50">
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs bg-gray-50">
                              {member.designation || member.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-2">
                        {member.github && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-2 hover:bg-blue-50 group/btn"
                            onClick={() => window.open(`https://github.com/${member.github}`, '_blank')}
                          >
                            <Github className="h-4 w-4 group-hover/btn:text-blue-600 smooth-transition" />
                          </Button>
                        )}
                        {member.linkedin && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-2 hover:bg-blue-50 group/btn"
                            onClick={() => window.open(`https://linkedin.com/in/${member.linkedin}`, '_blank')}
                          >
                            <Linkedin className="h-4 w-4 group-hover/btn:text-blue-600 smooth-transition" />
                          </Button>
                        )}
                        {member.email && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-2 hover:bg-blue-50 group/btn"
                            onClick={() => window.open(`mailto:${member.email}`, '_blank')}
                          >
                            <Mail className="h-4 w-4 group-hover/btn:text-blue-600 smooth-transition" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </FloatingElement>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No executive team members found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Team Members */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-white/50 border-blue-200 text-blue-700">
              Core Team
            </Badge>
            <h2 className="text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Team Members
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Dedicated team members working behind the scenes to make SAInT successful.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {otherCoreMembers.length > 0 ? (
              otherCoreMembers.map((member, index) => (
                <Card key={member.id} className="text-center bg-white/80 backdrop-blur-sm border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 shadow-lg">
                  <CardHeader>
                    <div className="relative">
                      {member.profileImage ? (
                        <img 
                          src={member.profileImage} 
                          alt={member.name}
                          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover shadow-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg ${member.profileImage ? 'hidden' : ''}`}>
                        <span className="text-lg font-bold text-white">
                          {getInitials(member.name)}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-base font-semibold text-slate-800">{member.name}</CardTitle>
                    <div className="flex justify-center mb-2">
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 text-xs">
                        {member.designation || member.position}
                      </Badge>
                    </div>
                    <div className="text-center text-blue-600 font-semibold text-sm">
                      {member.year} - {member.branch}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.skills && member.skills.length > 0 ? (
                        member.skills.slice(0, 2).map((skill, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-700">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-700">
                          Team Member
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No core team members found.</p>
                <p className="text-gray-500 text-sm">Check back later for team profiles!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Regular Members */}
      {regularMembers.length > 0 && (
        <section className="py-16 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 bg-white/80 backdrop-blur-sm">
                Community Members
              </Badge>
              <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Active Members</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our growing community of passionate tech enthusiasts.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regularMembers.slice(0, 8).map((member, index) => (
                <Card key={member.id} className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardHeader>
                    <div className="relative">
                      {member.profileImage ? (
                        <img 
                          src={member.profileImage} 
                          alt={member.name}
                          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover shadow-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg ${member.profileImage ? 'hidden' : ''}`}>
                        <span className="text-lg font-bold text-white">
                          {getInitials(member.name)}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-base font-semibold text-gray-800">{member.name}</CardTitle>
                    <div className="text-center text-gray-600 font-semibold text-sm">
                      {member.year} - {member.branch}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-700">
                      {member.role || 'Member'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join Us Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-heading font-bold text-white mb-6">Ready to Join Our Community?</h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto leading-relaxed">
              Become part of a supportive network of tech enthusiasts. 
              Learn, build, and grow with like-minded students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Join SAInT Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="secondary" size="lg" className="border-white text-blue-600 bg-white hover:bg-blue-50 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Learn More
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

export default Members;