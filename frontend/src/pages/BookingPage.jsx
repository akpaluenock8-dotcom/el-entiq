/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  CalendarIcon, 
  CheckCircle2,
  Loader2
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    school: "",
  });

  const schools = [
    "University of Ghana",
    "UPSA",
    "Trinity College",
    "Radford University College",
    "Knutsford University College",
    "Lester University College",
    "Other",
  ];

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/rooms/${roomId}`);
      if (response.data.availability_status === 'fully_booked') {
        toast.error("This room is fully booked");
        navigate("/rooms");
        return;
      }
      setRoom(response.data);
    } catch (error) {
      console.error("Error fetching room:", error);
      toast.error("Room not found");
      navigate("/rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchoolChange = (value) => {
    setFormData((prev) => ({ ...prev, school: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.phone_number || !formData.email || !formData.school || !date) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      
      const bookingData = {
        room_id: room.id,
        room_name: room.name,
        room_type: room.room_type,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        email: formData.email,
        school: formData.school,
        preferred_move_in_date: format(date, "yyyy-MM-dd"),
      };

      await axios.post(`${API}/bookings`, bookingData);
      setSubmitted(true);
      toast.success("Booking request submitted successfully!");
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error(error.response?.data?.detail || "Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]" data-testid="booking-success">
        <div className="container-custom py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#059669]" />
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] font-['Syne'] mb-4">
              Booking Request Sent!
            </h1>
            <p className="text-slate-600 mb-8">
              Thank you for your booking request. Our management team will contact you 
              within 24 hours to confirm your reservation and discuss next steps.
            </p>
            <div className="bg-white rounded-xl p-6 border border-slate-100 mb-8 text-left">
              <h2 className="font-semibold text-[#0F172A] mb-4">Booking Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Room:</span>
                  <span className="font-medium">{room.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Type:</span>
                  <span className="font-medium">{room.room_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Price:</span>
                  <span className="font-medium">GHS {room.price.toLocaleString()}/semester</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Move-in Date:</span>
                  <span className="font-medium">{format(date, "PPP")}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rooms">
                <Button variant="outline" className="rounded-full px-8" data-testid="view-more-rooms-btn">
                  View More Rooms
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-[#0F172A] hover:bg-[#1E293B] rounded-full px-8" data-testid="go-home-btn">
                  Return Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="booking-page">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="container-custom py-4">
          <Link 
            to={`/rooms/${roomId}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0F172A] transition-colors"
            data-testid="back-to-room"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Room Details</span>
          </Link>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-100">
                <h1 className="text-2xl font-bold text-[#0F172A] font-['Syne'] mb-2">
                  Book Your Room
                </h1>
                <p className="text-slate-500 mb-8">
                  Fill in your details to request a booking. Management will contact you to confirm.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                      data-testid="input-full-name"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      placeholder="e.g., 055 123 4567"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="h-12"
                      required
                      data-testid="input-phone"
                    />
                  </div>

                  {/* Email */}
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

                  {/* School */}
                  <div className="space-y-2">
                    <Label>School/University *</Label>
                    <Select value={formData.school} onValueChange={handleSchoolChange}>
                      <SelectTrigger className="h-12" data-testid="select-school">
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school} value={school}>
                            {school}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Move-in Date */}
                  <div className="space-y-2">
                    <Label>Preferred Move-in Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full h-12 justify-start text-left font-normal ${
                            !date && "text-muted-foreground"
                          }`}
                          data-testid="select-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          data-testid="calendar"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-white rounded-full py-6 text-base font-semibold"
                    disabled={submitting}
                    data-testid="submit-booking-btn"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Booking Request"
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Room Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden sticky top-24">
                <div className="aspect-video">
                  <img 
                    src={room.images[0]} 
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-semibold text-[#0F172A] font-['Syne'] mb-1">
                    {room.name}
                  </h2>
                  <p className="text-sm text-slate-500 mb-4">{room.room_type}</p>
                  
                  <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Room Price</span>
                      <span className="font-medium">GHS {room.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Security Deposit</span>
                      <span className="font-medium">GHS {room.security_deposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-3">
                      <span className="font-medium text-[#0F172A]">Total</span>
                      <span className="font-bold text-[#D4AF37] text-lg">
                        GHS {(room.price + room.security_deposit).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-4">
                    * Security deposit is fully refundable at the end of your stay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
