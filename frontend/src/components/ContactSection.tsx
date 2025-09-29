import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Send, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useContactSubmit } from "@/hooks/useContact";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: ""
  });

  const contactMutation = useContactSubmit();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return;
    }

    try {
      const result = await contactMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        phone: formData.phone || undefined
      });

      if (result.success) {
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          phone: ""
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
    }
  };

  return (
    <section id="contact" className="py-12 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 bg-white/50 border-blue-200 text-blue-700">
            Get in Touch
          </Badge>
          <h2 className="text-5xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Let's Start a <span className="block">Conversation</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about SAInT? Want to collaborate or sponsor an event? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-heading font-bold text-slate-800 flex items-center gap-2">
                <Send className="w-6 h-6 text-blue-600" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Full Name *</Label>
                  <Input 
                    name="name"
                    placeholder="John Doe" 
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Email *</Label>
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="john.doe@example.com" 
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Phone (Optional)</Label>
                  <Input 
                    name="phone"
                    type="tel" 
                    placeholder="+91 12345 67890" 
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Subject *</Label>
                  <Input 
                    name="subject"
                    placeholder="What's this about?" 
                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Message *</Label>
                  <Textarea 
                    name="message"
                    placeholder="Tell us more about your inquiry..." 
                    className="min-h-[120px] border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-heading font-bold text-slate-800">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Email</p>
                    <p className="text-slate-600">sohamsk93@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Phone</p>
                    <p className="text-slate-600">+91 8275xxxxxx</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Location</p>
                    <p className="text-slate-600">Computer Science Building<br />Room 201, University Campus</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media & More Info */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-heading font-bold text-white">Connect & Learn More</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-start space-x-4">
                  <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30 text-white">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30 text-white">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30 text-white">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
                <Link to="/contact">
                <div className="pt-[5px]">
                  <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-blue-50 font-medium">
                    View Full Contact Page
                  </Button>
                </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;