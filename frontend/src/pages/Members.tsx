import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { FloatingElement, CustomArrow } from "@/components/InteractiveElements";
import InteractiveBackground from "@/components/InteractiveBackground";

const Members = () => {
  // TY Members (Third Year) - Sorted Alphabetically
  const tyMembers = [
    { id: 1, name: "Aaryan Ranjan", year: "TY", branch: "IT", profileImage: null },
    { id: 2, name: "Aditya Almane", year: "TY", branch: "IT", profileImage: null },
    { id: 3, name: "Akshad Patil", year: "TY", branch: "IT", profileImage: null },
    { id: 4, name: "Anisha Satendra Lokhande", year: "TY", branch: "IT", profileImage: null },
    { id: 5, name: "Durva Bhushan Gajare", year: "TY", branch: "IT", profileImage: null },
    { id: 6, name: "Hitesh Shivprasad Chavan", year: "TY", branch: "IT", profileImage: null },
    { id: 7, name: "Nidhi Gaikwad", year: "TY", branch: "IT", profileImage: null },
    { id: 8, name: "Prachi Janwadkar", year: "TY", branch: "IT", profileImage: null },
    { id: 9, name: "Pramod Atul Kanthale", year: "TY", branch: "IT", profileImage: null },
    { id: 10, name: "Prajkta Prasad Deshpande", year: "TY", branch: "IT", profileImage: null },
    { id: 11, name: "Sanket Ramdas Shermale", year: "TY", branch: "IT", profileImage: null },
    { id: 12, name: "Shlok Joshi", year: "TY", branch: "IT", profileImage: null },
    { id: 13, name: "Shubhankar Badwe", year: "TY", branch: "IT", profileImage: null },
    { id: 14, name: "Vansh Bipalliwar", year: "TY", branch: "IT", profileImage: null }
  ];

  // SY Members (Second Year) - Sorted Alphabetically
  const syMembers = [
    { id: 15, name: "Anshuman Sandanshiv", year: "SY", branch: "IT", profileImage: null },
    { id: 16, name: "Arush Padmavar", year: "SY", branch: "IT", profileImage: null },
    { id: 17, name: "Aryan Jadhav", year: "SY", branch: "IT", profileImage: null },
    { id: 18, name: "Daksh Zade", year: "SY", branch: "IT", profileImage: null },
    { id: 19, name: "Devang Kale", year: "SY", branch: "IT", profileImage: null },
    { id: 20, name: "Divyal Sarode", year: "SY", branch: "IT", profileImage: null },
    { id: 21, name: "Ghansham Patil", year: "SY", branch: "IT", profileImage: null },
    { id: 22, name: "Lakshit Sarode", year: "SY", branch: "IT", profileImage: null },
    { id: 23, name: "Laukik Rathod", year: "SY", branch: "IT", profileImage: null },
    { id: 24, name: "Madhura", year: "SY", branch: "IT", profileImage: null },
    { id: 25, name: "Omkar Doifode", year: "SY", branch: "IT", profileImage: null },
    { id: 26, name: "Payal Deore", year: "SY", branch: "IT", profileImage: null },
    { id: 27, name: "Prachi Patil", year: "SY", branch: "IT", profileImage: null },
    { id: 28, name: "Purva Shimpi", year: "SY", branch: "IT", profileImage: null },
    { id: 29, name: "Riya Pardhi", year: "SY", branch: "IT", profileImage: null },
    { id: 30, name: "Rudraksh Vasaikar", year: "SY", branch: "IT", profileImage: null },
    { id: 31, name: "Sanchita Yelmate", year: "SY", branch: "IT", profileImage: null },
    { id: 32, name: "Sayali Kottawar", year: "SY", branch: "IT", profileImage: null },
    { id: 33, name: "Shreya Patil", year: "SY", branch: "IT", profileImage: null },
    { id: 34, name: "Shital", year: "SY", branch: "IT", profileImage: null },
    { id: 35, name: "Shivanand Potle", year: "SY", branch: "IT", profileImage: null },
    { id: 36, name: "Shubham Sattegiri", year: "SY", branch: "IT", profileImage: null },
    { id: 37, name: "Shrutika", year: "SY", branch: "IT", profileImage: null },
    { id: 38, name: "Vaishnavi Kapratwar", year: "SY", branch: "IT", profileImage: null },
    { id: 39, name: "Vinit Sharnagat", year: "SY", branch: "IT", profileImage: null },
    { id: 40, name: "Yash Kalal", year: "SY", branch: "IT", profileImage: null },
    { id: 41, name: "Yash Kore", year: "SY", branch: "IT", profileImage: null },
    { id: 42, name: "Yash Patil", year: "SY", branch: "IT", profileImage: null },
    { id: 43, name: "Zyan Ali", year: "SY", branch: "IT", profileImage: null }
  ];

  // Executive Team (Core Leadership)
  const executiveTeam = [
    { 
      id: 100, 
      name: "Sanket Ramdas Shermale", 
      designation: "President", 
      year: "TY", 
      branch: "IT", 
      profileImage: null 
    },
    { 
      id: 101, 
      name: "Pramod Atul Kanthale", 
      designation: "Vice President", 
      year: "TY", 
      branch: "IT", 
      profileImage: null 
    },
    { 
      id: 102, 
      name: "Anisha Satendra Lokhande", 
      designation: "Treasurer", 
      year: "TY", 
      branch: "IT", 
      profileImage: null 
    },
    { 
      id: 103, 
      name: "Hitesh Shivprasad Chavan", 
      designation: "Secretary", 
      year: "TY", 
      branch: "IT", 
      profileImage: null 
    },
    { 
      id: 104, 
      name: "Prajkta Prasad Deshpande", 
      designation: "Event Director", 
      year: "TY", 
      branch: "IT", 
      profileImage: null 
    }
  ];

  // Calculate member stats from hardcoded data
  const totalMembers = tyMembers.length + syMembers.length;
  const memberStats = [
    { 
      label: "Total Members", 
      value: totalMembers.toString(), 
      description: "Active members" 
    },
    { 
      label: "Executive Team", 
      value: executiveTeam.length.toString(), 
      description: "Core leadership" 
    },
    { 
      label: "All Batches", 
      value: "2", 
      description: "TY & SY members" 
    }
  ];

  // Helper function to generate avatar initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
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

      {/* Executive Team (Core Leadership) */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-blue-100 border-blue-300 text-blue-700 font-semibold">
              Leadership
            </Badge>
            <h2 className="text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Executive Team
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Meet the core leaders driving SAInT's vision and mission.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {executiveTeam.length > 0 ? (
              executiveTeam.map((member) => (
                <Card key={member.id} className="text-center bg-white/90 backdrop-blur-sm border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 shadow-lg overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 smooth-transition"></div>
                  <CardHeader className="relative z-10">
                    <div className="relative">
                      {member.profileImage ? (
                        <img 
                          src={member.profileImage} 
                          alt={member.name}
                          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover shadow-lg group-hover:shadow-xl"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:shadow-xl ${member.profileImage ? 'hidden' : ''}`}>
                        <span className="text-xl font-bold text-white">
                          {getInitials(member.name)}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-base font-semibold text-slate-800">{member.name}</CardTitle>
                    <div className="flex justify-center mb-2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold px-3 py-1">
                        {member.designation}
                      </Badge>
                    </div>
                    <div className="text-center text-blue-600 font-medium text-sm">
                      {member.year} - {member.branch}
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="col-span-5 text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No executive team members found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TY Members (Third Year) */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-blue-50 border-blue-200 text-blue-700">
              Third Year
            </Badge>
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">TY Members</h2>
            <p className="text-xl text-gray-600">
              Meet our Third Year students driving SAInT forward.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tyMembers.length > 0 ? (
              tyMembers.map((member, index) => (
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
                    <div className="text-center text-blue-600 font-semibold text-sm">
                      {member.year} - {member.branch}
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No TY members found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SY Members (Second Year) */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-white/50 border-blue-200 text-blue-700">
              Second Year
            </Badge>
            <h2 className="text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SY Members
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our Second Year members bringing fresh energy and ideas to SAInT.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {syMembers.length > 0 ? (
              syMembers.map((member, index) => (
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
                      <div className={`w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg ${member.profileImage ? 'hidden' : ''}`}>
                        <span className="text-lg font-bold text-white">
                          {getInitials(member.name)}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-sm font-semibold text-slate-800">{member.name}</CardTitle>
                    <div className="text-center text-purple-600 font-semibold text-xs">
                      {member.year} - {member.branch}
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="col-span-5 text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No SY members found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Members;