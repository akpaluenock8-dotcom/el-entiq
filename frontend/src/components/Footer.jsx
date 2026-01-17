import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const location = useLocation();
  
  // Don't show footer on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#0F172A] text-white" data-testid="footer">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                <span className="text-[#0F172A] font-bold text-lg font-['Syne']">EA</span>
              </div>
              <span className="text-lg font-bold font-['Syne']">EL-ANTIQ HOSTEL</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Comfortable and secure student accommodation near major universities in Ghana. 
              Your home away from home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 font-['Syne']">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="footer-home">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="footer-rooms">
                  Our Rooms
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors" data-testid="footer-contact">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Nearby Universities */}
          <div>
            <h4 className="font-semibold mb-4 font-['Syne']">Nearby Universities</h4>
            <ul className="space-y-3">
              <li className="text-slate-400 text-sm">University of Ghana</li>
              <li className="text-slate-400 text-sm">UPSA</li>
              <li className="text-slate-400 text-sm">Trinity College</li>
              <li className="text-slate-400 text-sm">Radford University College</li>
              <li className="text-slate-400 text-sm">Knutsford University</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 font-['Syne']">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="tel:0551255165" 
                  className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                  data-testid="footer-phone-1"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  055 125 5165
                </a>
              </li>
              <li>
                <a 
                  href="tel:0264566237" 
                  className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                  data-testid="footer-phone-2"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  026 456 6237
                </a>
              </li>
              <li>
                <a 
                  href="mailto:elantiqgroup.gh@gmail.com" 
                  className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                  data-testid="footer-email"
                >
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  elantiqgroup.gh@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Near University of Ghana, Legon, Accra</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} EL-ANTIQ Hostel. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a 
              href="https://wa.me/233551255165" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#D4AF37] transition-colors"
              data-testid="footer-whatsapp"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
