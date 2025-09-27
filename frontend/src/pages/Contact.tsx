import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send, Github, Linkedin, Twitter, Instagram, Globe } from "lucide-react";
import { FloatingElement, CustomArrow } from "@/components/InteractiveElements";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useState } from "react";
import { useContactSubmit } from "@/hooks/useContact";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: ""
  });
  
  const contactMutation = useContactSubmit();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await contactMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        phone: formData.phone
      });
      
      if (result.success) {
        // Reset form on success
        setFormData({ name: "", email: "", subject: "", message: "", phone: "" });
      }
    } catch (error) {
      // Error is handled by the useContactSubmit hook
      console.error("Contact form submission error:", error);
    }
  };

  const socialLinks = [
    { icon: Github, label: "GitHub", url: "https://github.com/saint-org", color: "text-gray-700 hover:text-gray-900" },
    { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/company/saint", color: "text-blue-600 hover:text-blue-700" },
    { icon: Twitter, label: "Twitter", url: "https://twitter.com/saint_tech", color: "text-sky-500 hover:text-sky-600" },
    { icon: Instagram, label: "Instagram", url: "https://instagram.com/saint_tech", color: "text-pink-500 hover:text-pink-600" },
    { icon: Globe, label: "Website", url: "https://saint.university.edu", color: "text-green-600 hover:text-green-700" },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "sohamsk93@gmail.com",
      description: "General inquiries and information"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8275xxxxxx",
      description: "Office hours: Mon-Fri 9AM-5PM"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "IT Department",
      description: "JSPM's RSCOE"
    },
    {
      icon: Clock,
      label: "Office Hours",
      value: "Mon-Fri: 9:00 AM - 5:00 PM",
      description: "relationship advices available"
    }
  ];

  const team = [
    {
      name: "Dr. Soham Kulkarni",
      role: "Faculty Advisor",
      email: "sohamsk93@gmail.com",
      office: "CS Building, Room 301"
    },
    {
      name: "Siddhi Pokale",
      role: "President",
      email: "presidentsaint@gmail.com",
      office: "HoD Cabin"
    },
    {
      name: "Shruti Lad",
      role: "Vice President",
      email: "shrutilad@gmail.com",
      office: "Student Union, Room 150"
    }
  ];

  const faqs = [
    {
      question: "How do I join SAInT?",
      answer: "You can join by attending one of our events or filling out our membership form online. We welcome students from all majors and skill levels."
    },
    {
      question: "Are there membership fees?",
      answer: "Basic membership is free! We may charge small fees for some special events or workshops to cover materials and refreshments."
    },
    {
      question: "What skill level is required?",
      answer: "No specific skill level is required. We welcome beginners and experienced programmers alike. Our events cater to various skill levels."
    },
    {
      question: "How often do you meet?",
      answer: "We hold general meetings bi-weekly and host various events throughout the month. Check our events calendar for the latest schedule."
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
            <FloatingElement>
              <Badge variant="outline" className="mb-4 bg-white/80 backdrop-blur-sm">
                Contact Us
              </Badge>
            </FloatingElement>
            
            <h1 className="text-5xl md:text-6xl font-heading font-black leading-tight mb-6">
              <span className="text-gray-900">Let's</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Connect
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-body">
              Have questions about SAInT? Want to collaborate or need more information? 
              We'd love to hear from you and help you get involved.
            </p>
            
            <div className="flex justify-center mt-8">
              <CustomArrow direction="down" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <FloatingElement>
              <div>
                <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6">Send us a Message</h2>
                <Card className="hover-shadow smooth-transition bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="font-semibold text-gray-700">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="rounded-xl border-gray-300 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-semibold text-gray-700">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="rounded-xl border-gray-300 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="font-semibold text-gray-700">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="What's this about?"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="rounded-xl border-gray-300 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="font-semibold text-gray-700">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="rounded-xl border-gray-300 focus:border-blue-500"
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl hover-shadow smooth-transition"
                        disabled={contactMutation.isPending}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {contactMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </FloatingElement>

            {/* Contact Information */}
            <FloatingElement delay={200}>
              <div>
                <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="hover-shadow smooth-transition bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                            <info.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{info.label}</h3>
                            <p className="text-gray-900 font-medium mb-1">{info.value}</p>
                            <p className="text-sm text-gray-600">{info.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </FloatingElement>
          </div>
        </div>
      </section>

      {/* Google Maps Integration */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-xl text-gray-600">Visit us at our campus location</p>
          </div>
          
          <Card className="overflow-hidden hover-shadow smooth-transition bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-heading font-bold text-slate-800 flex items-center justify-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                JSPM Rajarshi Shahu College of Engineering
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.9772681431627!2d73.74462247523925!3d18.620092182492805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bbbc138acb7b%3A0x67043867a211a31d!2sJSPM%20Rajarshi%20Shahu%20College%20Of%20Engineering%20%2C%20Tathawade!5e0!3m2!1sen!2sin!4v1757790123971!5m2!1sen!2sin"
                  width="100%" 
                  height="450" 
                  style={{border: 0}} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Campus Location</h3>
                    <p className="text-gray-700 font-medium">JSPM Rajarshi Shahu College of Engineering</p>
                    <p className="text-gray-600">Tathawade, Pune, Maharashtra</p>
                    <p className="text-sm text-gray-500 mt-2">Computer Science Department - IT Building</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Contacts */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-white/50 border-blue-200 text-blue-700">
              Leadership Team
            </Badge>
            <h2 className="text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Key Contacts
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get in touch with our team leaders for specific inquiries and support.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-lg font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-center text-slate-800 font-heading">{member.name}</CardTitle>
                  <Badge variant="outline" className="mx-auto bg-blue-50 border-blue-200 text-blue-700">{member.role}</Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-center p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <Mail className="h-4 w-4 mr-2 text-blue-500" />
                      {member.email}
                    </div>
                    <div className="flex items-center justify-center p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      {member.office}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-white/50 border-blue-200 text-blue-700">
              Help Center
            </Badge>
            <h2 className="text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find answers to common questions about SAInT membership and events.
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold text-slate-800 mb-3">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;