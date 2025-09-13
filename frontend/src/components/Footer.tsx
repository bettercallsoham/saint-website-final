import { Code2, Instagram, Twitter, Linkedin, Mail, Github, Send, MapPin, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    console.log("Newsletter subscription:", newsletterEmail);
    
    setTimeout(() => {
      setIsSubscribing(false);
      setNewsletterEmail("");
    }, 1000);
  };

  const socialLinks = [
    { icon: Github, label: "GitHub", url: "https://github.com/saint-org" },
    { icon: Instagram, label: "Instagram", url: "https://instagram.com/saint_tech" },
    { icon: Twitter, label: "Twitter", url: "https://twitter.com/saint_tech" },
    { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/company/saint" },
    { icon: Mail, label: "Email", url: "mailto:contact@saint.university.edu" },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Code2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-heading font-bold text-white">SAInT</span>
                <p className="text-sm text-gray-300">Student Association of Information Technology</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md">
              Building the future of technology, one student at a time. Join our community of passionate learners, innovators, and future tech leaders.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>contact@saint.university.edu</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>CS Building, Room 201</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-white text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-white smooth-transition">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white smooth-transition">About Us</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-white smooth-transition">Events</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-white smooth-transition">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-white text-lg">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-gray-300 hover:text-white smooth-transition">Contact Us</Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-white smooth-transition">Join SAInT</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white smooth-transition">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-white text-lg">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-3">
              Get the latest news and events delivered to your inbox.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="rounded-l-xl rounded-r-none border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="rounded-l-none rounded-r-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex items-center space-x-1">
              <span className="text-gray-300 text-sm mr-3">Follow us:</span>
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl"
                  onClick={() => window.open(social.url, '_blank')}
                >
                  <social.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>&copy; 2025 Student Association of Information Technology. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
