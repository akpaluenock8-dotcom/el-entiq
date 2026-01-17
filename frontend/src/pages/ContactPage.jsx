import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API}/contact`, formData);
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      values: ["055 125 5165", "026 456 6237"],
      action: "tel:0551255165",
    },
    {
      icon: Mail,
      label: "Email",
      values: ["elantiqgroup.gh@gmail.com"],
      action: "mailto:elantiqgroup.gh@gmail.com",
    },
    {
      icon: Clock,
      label: "Office Hours",
      values: ["Mon - Sat: 8:00 AM - 6:00 PM", "Sun: 10:00 AM - 4:00 PM"],
    },
    {
      icon: MapPin,
      label: "Location",
      values: ["Near University of Ghana", "Legon, Accra, Ghana"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="contact-page">
      {/* Header */}
      <section className="bg-[#0F172A] py-16 lg:py-20">
        <div className="container-custom">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Syne'] mb-4">
              Contact <span className="text-[#D4AF37]">Us</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Reach out to us through 
              any of the channels below.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] font-['Syne'] mb-8">
              Get In Touch
            </h2>

            <div className="space-y-6 mb-10">
              {contactInfo.map((info) => (
                <div 
                  key={info.label}
                  className="flex items-start gap-4"
                  data-testid={`contact-${info.label.toLowerCase()}`}
                >
                  <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0F172A] mb-1">{info.label}</p>
                    {info.values.map((value, index) => (
                      info.action ? (
                        <a 
                          key={index}
                          href={info.action}
                          className="block text-slate-600 hover:text-[#D4AF37] transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p key={index} className="text-slate-600">{value}</p>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
              <a href="tel:0551255165">
                <Button 
                  className="bg-[#0F172A] hover:bg-[#1E293B] rounded-full"
                  data-testid="call-now-btn"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </a>
              <a href="https://wa.me/233551255165" target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline"
                  className="rounded-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                  data-testid="whatsapp-btn"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </a>
            </div>

            {/* Map */}
            <div className="mt-10">
              <h3 className="font-semibold text-[#0F172A] mb-4">Find Us</h3>
              <div className="rounded-xl overflow-hidden border border-slate-100 h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.4878!2d-0.1873!3d5.6536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b5671f72fc5%3A0xb86bd10d08e4e333!2sUniversity%20of%20Ghana!5e0!3m2!1sen!2sgh!4v1699999999999!5m2!1sen!2sgh"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="EL-ANTIQ Hostel Location"
                  data-testid="google-map"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-100">
              {submitted ? (
                <div className="text-center py-12" data-testid="contact-success">
                  <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#059669]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] font-['Syne'] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", message: "" });
                    }}
                    className="rounded-full"
                    data-testid="send-another-btn"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#0F172A] font-['Syne'] mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-slate-500 mb-8">
                    Fill out the form below and we'll respond as soon as possible.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-12"
                        required
                        data-testid="input-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-12"
                        required
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        required
                        data-testid="input-message"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-white rounded-full py-6 text-base font-semibold"
                      disabled={submitting}
                      data-testid="submit-contact-btn"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
