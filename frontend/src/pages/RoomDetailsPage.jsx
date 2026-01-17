/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Users, 
  Check, 
  Phone, 
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/rooms/${roomId}`);
      setRoom(response.data);
    } catch (error) {
      console.error("Error fetching room:", error);
      navigate("/rooms");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: "Available", class: "status-available" },
      almost_full: { label: "Almost Full", class: "status-almost-full" },
      fully_booked: { label: "Fully Booked", class: "status-fully-booked" },
    };
    
    const config = statusConfig[status] || statusConfig.available;
    return (
      <span className={`status-badge ${config.class}`} data-testid="room-status">
        <span className={`w-1.5 h-1.5 rounded-full ${
          status === 'available' ? 'bg-green-500' : 
          status === 'almost_full' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        {config.label}
      </span>
    );
  };

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="container-custom py-8">
          <div className="skeleton h-8 w-32 rounded mb-8" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="skeleton h-[500px] rounded-xl" />
            <div className="space-y-6">
              <div className="skeleton h-10 w-3/4 rounded" />
              <div className="skeleton h-6 w-1/4 rounded" />
              <div className="skeleton h-32 w-full rounded" />
              <div className="skeleton h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="room-details-page">
      {/* Back Button */}
      <div className="bg-white border-b border-slate-100">
        <div className="container-custom py-4">
          <Link 
            to="/rooms" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0F172A] transition-colors"
            data-testid="back-to-rooms"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Rooms</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative gallery-main aspect-[4/3] bg-slate-100">
              <img 
                src={room.images[activeImage]} 
                alt={`${room.name} - Image ${activeImage + 1}`}
                className="w-full h-full object-cover"
                data-testid="main-image"
              />
              
              {/* Navigation Arrows */}
              {room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    data-testid="prev-image-btn"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    data-testid="next-image-btn"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                {activeImage + 1} / {room.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {room.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {room.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`gallery-thumb flex-shrink-0 w-20 h-20 overflow-hidden ${
                      activeImage === index ? 'active' : ''
                    }`}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Room Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                {getStatusBadge(room.availability_status)}
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{room.room_type}</span>
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#0F172A] font-['Syne']" data-testid="room-name">
                {room.name}
              </h1>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#0F172A] font-['Syne']">
                  GHS {room.price.toLocaleString()}
                </span>
                <span className="text-slate-500">/semester</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                + GHS {room.security_deposit} refundable security deposit
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-[#0F172A]">Total to pay:</p>
                <p className="text-2xl font-bold text-[#D4AF37] font-['Syne']">
                  GHS {(room.price + room.security_deposit).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A] font-['Syne'] mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed" data-testid="room-description">
                {room.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A] font-['Syne'] mb-4">Amenities Included</h2>
              <div className="grid grid-cols-2 gap-3">
                {room.amenities.map((amenity) => (
                  <div 
                    key={amenity}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100"
                    data-testid={`amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span className="text-sm text-[#0F172A]">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {room.availability_status !== 'fully_booked' ? (
                <Link to={`/booking/${room.id}`} className="block">
                  <Button 
                    size="lg"
                    className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-white rounded-full py-6 text-base font-semibold"
                    data-testid="book-room-btn"
                  >
                    Book This Room
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg"
                  disabled
                  className="w-full bg-slate-300 text-slate-500 rounded-full py-6 text-base cursor-not-allowed"
                  data-testid="fully-booked-btn"
                >
                  Room Fully Booked
                </Button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <a href="tel:0551255165">
                  <Button 
                    variant="outline"
                    className="w-full rounded-full py-5"
                    data-testid="call-btn"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </Button>
                </a>
                <a href="https://wa.me/233551255165" target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="outline"
                    className="w-full rounded-full py-5"
                    data-testid="whatsapp-btn"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
