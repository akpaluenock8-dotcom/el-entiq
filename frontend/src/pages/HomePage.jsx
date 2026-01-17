import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Zap, 
  Droplets, 
  ChefHat, 
  Bath, 
  TreePine, 
  GraduationCap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const HomePage = () => {
  const features = [
    { icon: Shield, title: "24/7 Security", desc: "Gated compound with round-the-clock security" },
    { icon: TreePine, title: "Peaceful Environment", desc: "Quiet neighborhood perfect for studying" },
    { icon: Zap, title: "Reliable Electricity", desc: "Consistent power supply for your comfort" },
    { icon: Droplets, title: "Running Water", desc: "24/7 water availability guaranteed" },
    { icon: ChefHat, title: "Shared Kitchen", desc: "Modern kitchen facilities for residents" },
    { icon: Bath, title: "Clean Washrooms", desc: "Well-maintained and hygienic facilities" },
  ];

  const universities = [
    "Trinity College",
    "University of Ghana",
    "UPSA",
    "Radford University College",
    "Knutsford University College",
    "Lester University College",
  ];

  const hostelImages = {
    hero: "https://customer-assets.emergentagent.com/job_hostel-booking-4/artifacts/mohc5zyn_WhatsApp%20Image%202026-01-16%20at%208.10.18%20PM.jpeg",
    corridor: "https://customer-assets.emergentagent.com/job_hostel-booking-4/artifacts/kdxuhpmm_WhatsApp%20Image%202026-01-16%20at%208.10.19%20PM%20%282%29.jpeg",
    kitchen: "https://customer-assets.emergentagent.com/job_hostel-booking-4/artifacts/3stoe6m8_WhatsApp%20Image%202026-01-16%20at%208.10.19%20PM%20%283%29.jpeg",
    gate: "https://customer-assets.emergentagent.com/job_hostel-booking-4/artifacts/u8725mp2_WhatsApp%20Image%202026-01-16%20at%208.10.19%20PM.jpeg",
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0F172A] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-white animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                Now Accepting Bookings
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Syne'] leading-tight mb-6">
                Comfortable & Secure{" "}
                <span className="text-[#D4AF37]">Student Hostel</span>
              </h1>
              
              <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                Peaceful, gated hostel with easy access to major universities. 
                Your perfect home away from home for focused academic life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/rooms">
                  <Button 
                    size="lg"
                    className="bg-[#D4AF37] hover:bg-[#B5952F] text-white rounded-full px-8 py-6 text-base font-semibold w-full sm:w-auto"
                    data-testid="hero-view-rooms-btn"
                  >
                    View Available Rooms
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-semibold w-full sm:w-auto"
                    data-testid="hero-contact-btn"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-sm">Gated & Secure</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-sm">Near Universities</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-sm">All Amenities</span>
                </div>
              </div>
            </div>

            {/* Right - Image Grid */}
            <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                    <img 
                      src={hostelImages.hero} 
                      alt="EL-ANTIQ Hostel Exterior" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-square">
                    <img 
                      src={hostelImages.kitchen} 
                      alt="Shared Kitchen" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden aspect-square">
                    <img 
                      src={hostelImages.corridor} 
                      alt="Hostel Corridor" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                    <img 
                      src={hostelImages.gate} 
                      alt="Security Gate" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl animate-scale-in" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#ECFDF5] rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#059669]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A]">100% Secure</p>
                    <p className="text-sm text-slate-500">24/7 Security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]" data-testid="features-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wider">Amenities</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] font-['Syne'] mt-2 mb-4">
              Everything You Need
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We provide all the essential amenities for a comfortable and productive student life.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="feature-card bg-white p-8 rounded-2xl border border-slate-100 hover:border-[#D4AF37]/30 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-14 h-14 bg-[#0F172A] rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] font-['Syne'] mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Universities */}
      <section className="py-20 lg:py-28" data-testid="universities-section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wider">Location</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] font-['Syne'] mt-2 mb-6">
                Close to Major Universities
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Our hostel is strategically located near several prestigious universities in Ghana, 
                making your commute to campus quick and convenient.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {universities.map((uni, index) => (
                  <div 
                    key={uni}
                    className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-lg animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    data-testid={`university-${index}`}
                  >
                    <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#0F172A] font-medium">{uni}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1758270705087-76e81a5117bd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBkaXZlcnNlJTIwZ3JvdXAlMjBzdHVkeWluZyUyMGxhdWdoaW5nJTIwY2FtcHVzfGVufDB8fHx8MTc2ODU5NDk1MXww&ixlib=rb-4.1.0&q=85"
                  alt="University Students" 
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              {/* Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-[#0F172A] text-white rounded-xl p-6 shadow-xl">
                <div className="text-3xl font-bold text-[#D4AF37] font-['Syne']">6+</div>
                <div className="text-sm text-slate-300">Universities Nearby</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20 lg:py-28" data-testid="cta-section">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-['Syne'] mb-6">
              Limited Slots Available – <span className="text-[#D4AF37]">Book Early</span>
            </h2>
            <p className="text-slate-300 text-lg mb-10">
              Don't miss out on the best student accommodation near your university. 
              Secure your room now and focus on what matters most – your education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rooms">
                <Button 
                  size="lg"
                  className="bg-[#D4AF37] hover:bg-[#B5952F] text-white rounded-full px-10 py-6 text-base font-semibold"
                  data-testid="cta-check-availability-btn"
                >
                  Check Room Availability
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-full px-10 py-6 text-base font-semibold"
                  data-testid="cta-contact-btn"
                >
                  Talk to Us
                </Button>
              </Link>
            </div>

            {/* Pricing Preview */}
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Single Room (1-in-1)</p>
                <p className="text-2xl font-bold text-white font-['Syne']">
                  GHS 4,700<span className="text-sm font-normal text-slate-400">/semester</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Shared Room (2-in-1)</p>
                <p className="text-2xl font-bold text-white font-['Syne']">
                  GHS 4,500<span className="text-sm font-normal text-slate-400">/semester</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
