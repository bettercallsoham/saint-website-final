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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement actual form submission
    console.log("Form submission:", formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form or show success message
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // TODO: Implement newsletter subscription
    console.log("Newsletter subscription:", newsletterEmail);
    
    setTimeout(() => {
      setIsSubscribing(false);
      setNewsletterEmail("");
    }, 1000);
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
      value: "contact@saint.university.edu",
      description: "General inquiries and information"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      description: "Office hours: Mon-Fri 9AM-5PM"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Computer Science Building, Room 201",
      description: "University Campus, Tech District"
    },
    {
      icon: Clock,
      label: "Office Hours",
      value: "Mon-Fri: 9:00 AM - 5:00 PM",
      description: "Available for student consultations"
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Faculty Advisor",
      email: "s.mitchell@university.edu",
      office: "CS Building, Room 301"
    },
    {
      name: "Alex Chen",
      role: "President",
      email: "president@saint.university.edu",
      office: "Student Union, Room 150"
    },
    {
      name: "Sarah Johnson",
      role: "Vice President",
      email: "vp@saint.university.edu",
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
                        disabled={isSubmitting}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Sending..." : "Send Message"}
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
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">Interactive Map Coming Soon</p>
                <p className="text-sm text-gray-600">Computer Science Building, Room 201</p>
                <p className="text-sm text-gray-600">University Campus, Tech District</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Social Links & Newsletter */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Social Media */}
            <FloatingElement>
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-heading font-bold text-gray-900 mb-6">Follow Us</h3>
                <p className="text-gray-600 mb-8">Stay connected with our community on social media</p>
                
                <div className="flex justify-center lg:justify-start space-x-4">
                  {socialLinks.map((social, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="lg"
                      className={`p-4 rounded-xl hover-shadow smooth-transition ${social.color}`}
                      onClick={() => window.open(social.url, '_blank')}
                    >
                      <social.icon className="h-6 w-6" />
                    </Button>
                  ))}
                </div>
              </div>
            </FloatingElement>

            {/* Newsletter Signup */}
            <FloatingElement delay={200}>
              <Card className="hover-shadow smooth-transition bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Stay Updated</h3>
                  <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest events, workshops, and tech news.</p>
                  
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-1 rounded-xl border-gray-300 focus:border-blue-500"
                        required
                      />
                      <Button
                        type="submit"
                        disabled={isSubscribing}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 rounded-xl hover-shadow smooth-transition"
                      >
                        {isSubscribing ? "..." : "Subscribe"}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </FloatingElement>
          </div>
        </div>
      </section>

      {/* Team Contacts */}
      <section className="py-16 px-4 bg-saint-bgSecondary">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-saint-title mb-8 text-center">Key Contacts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-16 h-16 bg-saint-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-lg font-bold text-saint-title">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-center text-saint-title">{member.name}</CardTitle>
                  <Badge variant="outline" className="mx-auto">{member.role}</Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 text-sm text-saint-body">
                    <div className="flex items-center justify-center">
                      <Mail className="h-4 w-4 mr-2 text-saint-primary" />
                      {member.email}
                    </div>
                    <div className="flex items-center justify-center">
                      <MapPin className="h-4 w-4 mr-2 text-saint-primary" />
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
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-saint-title mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-saint-title mb-3">{faq.question}</h3>
                  <p className="text-saint-body">{faq.answer}</p>
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