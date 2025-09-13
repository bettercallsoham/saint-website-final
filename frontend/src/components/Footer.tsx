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
    { icon: Github, label: "GitHub", url: "https://github.com/bettercallsoham" },
    { icon: Instagram, label: "Instagram", url: "https://instagram.com/bettercallsoham" },
    { icon: Twitter, label: "Twitter", url: "https://x.com/Itysoham" },
    { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/itysoham-kulkarni/" },
    { icon: Mail, label: "Email", url: "mailto:sohamsk93@gmail.com" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent -z-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-75"></div>
                <img src="/saint-logo.png" alt="SAInT Logo" className="relative h-14 w-14 rounded-xl shadow-xl bg-white p-2" />
              </div>
              <div>
                <span className="text-3xl font-heading font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SAInT</span>
                <p className="text-sm text-gray-400 font-medium">Student Association of IT</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-sm">
              Building the future of technology, one student at a time. Join our community of passionate learners, innovators, and future tech leaders.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-heading font-bold text-white relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                <div className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                Home
              </Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                <div className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                About Us
              </Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                <div className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                Events
              </Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                <div className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                Gallery
              </Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-xl font-heading font-bold text-white relative">
              Resources
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                <div className="w-1 h-1 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                Contact Us
              </Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                <div className="w-1 h-1 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                Join SAInT
              </Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group">
                <div className="w-1 h-1 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                Privacy Policy
              </a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-heading font-bold text-white relative">
              Stay Connected
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Get the latest updates on events, workshops, and tech trends.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <Button
                type="submit"
                disabled={isSubscribing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {isSubscribing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Subscribing...
                  </div>
                ) : (
                  <>
                    Subscribe
                    <Send className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-1">
              <span className="text-gray-400 text-sm mr-4 font-medium">Follow us:</span>
              <div className="flex space-x-2">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300 group"
                    onClick={() => window.open(social.url, '_blank')}
                  >
                    <social.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-gray-400 text-sm flex items-center justify-center space-x-2">
                <span>Made with</span>
                <span className="text-yellow-400">☕</span>
                <span>and</span>
                <span className="text-red-500 animate-pulse">♥</span>
                <span>by Soham Kulkarni</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
