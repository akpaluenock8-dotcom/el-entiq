import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/rooms", label: "Rooms" },
    { path: "/contact", label: "Contact" },
  ];

  // Don't show navbar on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100" data-testid="navbar">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="navbar-logo">
            <div className="w-10 h-10 bg-[#0F172A] rounded-lg flex items-center justify-center">
              <span className="text-[#D4AF37] font-bold text-lg font-['Syne']">EA</span>
            </div>
            <span className="text-lg font-bold text-[#0F172A] font-['Syne'] hidden sm:block">EL-ANTIQ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link text-sm font-medium ${isActive(link.path) ? "active text-[#0F172A]" : "text-slate-600"}`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="tel:0551255165" 
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#0F172A] transition-colors"
              data-testid="navbar-phone"
            >
              <Phone className="w-4 h-4" />
              <span>055 125 5165</span>
            </a>
            <Link to="/rooms">
              <Button 
                className="bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full px-6"
                data-testid="navbar-book-btn"
              >
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-[#0F172A]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`} data-testid="mobile-menu">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#0F172A] rounded-lg flex items-center justify-center">
                <span className="text-[#D4AF37] font-bold text-lg font-['Syne']">EA</span>
              </div>
              <span className="text-lg font-bold text-[#0F172A] font-['Syne']">EL-ANTIQ</span>
            </div>
            <button
              className="p-2 text-slate-600 hover:text-[#0F172A]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 text-lg font-medium ${isActive(link.path) ? "text-[#0F172A]" : "text-slate-600"}`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`mobile-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
            <a 
              href="tel:0551255165" 
              className="flex items-center gap-3 text-slate-600"
            >
              <Phone className="w-5 h-5" />
              <span>055 125 5165</span>
            </a>
            <Link to="/rooms" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full"
                data-testid="mobile-book-btn"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
