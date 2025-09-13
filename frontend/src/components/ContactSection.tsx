import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const ContactSection = () => {
  return (
    <section id="contact" className="py-12 bg-saint-bgSecondary relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 text-saint-title">
            Get in <span className="text-saint-primary">Touch</span>
          </h2>
          <p className="text-xl text-saint-body max-w-2xl mx-auto">
            Have questions about SAInT? Want to collaborate or sponsor an event? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-saint-title">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="john.doe@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="What's this about?" />
              </div>
              
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea 
                  placeholder="Tell us more about your inquiry..." 
                  className="min-h-[120px]"
                />
              </div>
              
              <Button 
                className="w-full"
                size="lg"
              >
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-saint-title">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-saint-primary rounded-lg">
                    <Mail className="h-6 w-6 text-saint-btnText" />
                  </div>
                  <div>
                    <p className="font-medium text-saint-title">Email</p>
                    <p className="text-saint-body">contact@saint.university.edu</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-saint-primary rounded-lg">
                    <Phone className="h-6 w-6 text-saint-btnText" />
                  </div>
                  <div>
                    <p className="font-medium text-saint-title">Phone</p>
                    <p className="text-saint-body">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-saint-primary rounded-lg">
                    <MapPin className="h-6 w-6 text-saint-btnText" />
                  </div>
                  <div>
                    <p className="font-medium text-saint-title">Location</p>
                    <p className="text-saint-body">Computer Science Building<br />Room 201, University Campus</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media & More Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-saint-title">Connect & Learn More</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Button size="icon" variant="outline">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Visit Full Contact Page
                  </Button>
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