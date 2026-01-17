/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Bed, ArrowRight } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");

  useEffect(() => {
    fetchRooms();
  }, [filterType, filterAvailability]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      let url = `${API}/rooms`;
      const params = new URLSearchParams();
      
      if (filterType !== "all") {
        params.append("room_type", filterType);
      }
      if (filterAvailability !== "all") {
        params.append("availability", filterAvailability);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
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
      <span className={`status-badge ${config.class}`} data-testid={`status-${status}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          status === 'available' ? 'bg-green-500' : 
          status === 'almost_full' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="rooms-page">
      {/* Header */}
      <section className="bg-[#0F172A] py-16 lg:py-20">
        <div className="container-custom">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Syne'] mb-4">
              Our <span className="text-[#D4AF37]">Rooms</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Choose from our selection of comfortable and well-maintained rooms. 
              All rooms include access to shared facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 lg:top-20 bg-white border-b border-slate-100 z-30 py-4">
        <div className="container-custom">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Filter by:</span>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]" data-testid="filter-type">
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="1-in-1">Single (1-in-1)</SelectItem>
                <SelectItem value="2-in-1">Shared (2-in-1)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAvailability} onValueChange={setFilterAvailability}>
              <SelectTrigger className="w-[180px]" data-testid="filter-availability">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="almost_full">Almost Full</SelectItem>
                <SelectItem value="fully_booked">Fully Booked</SelectItem>
              </SelectContent>
            </Select>

            {(filterType !== "all" || filterAvailability !== "all") && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setFilterType("all");
                  setFilterAvailability("all");
                }}
                className="text-slate-500"
                data-testid="clear-filters-btn"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-12 lg:py-16">
        <div className="container-custom">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-100">
                  <div className="skeleton h-56" />
                  <div className="p-6 space-y-4">
                    <div className="skeleton h-6 w-3/4 rounded" />
                    <div className="skeleton h-4 w-1/2 rounded" />
                    <div className="skeleton h-10 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20">
              <Bed className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#0F172A] mb-2">No Rooms Found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your filters to see more options.</p>
              <Button 
                variant="outline"
                onClick={() => {
                  setFilterType("all");
                  setFilterAvailability("all");
                }}
                data-testid="reset-filters-btn"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, index) => (
                <div 
                  key={room.id}
                  className="room-card bg-white rounded-xl overflow-hidden border border-slate-100 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`room-card-${room.id}`}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={room.images[0]} 
                      alt={room.name}
                      className="room-image w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(room.availability_status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[#0F172A] font-['Syne'] mb-1">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Users className="w-4 h-4" />
                          <span>{room.room_type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-[#0F172A] font-['Syne']">
                        GHS {room.price.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-sm">/semester</span>
                      <p className="text-xs text-slate-400 mt-1">
                        + GHS {room.security_deposit} refundable deposit
                      </p>
                    </div>

                    {/* Amenities Preview */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.slice(0, 3).map((amenity) => (
                        <span 
                          key={amenity}
                          className="text-xs bg-[#F8FAFC] text-slate-600 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-xs bg-[#F8FAFC] text-slate-600 px-2 py-1 rounded">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link to={`/rooms/${room.id}`}>
                      <Button 
                        className={`w-full rounded-full ${
                          room.availability_status === 'fully_booked' 
                            ? 'bg-slate-300 cursor-not-allowed' 
                            : 'bg-[#0F172A] hover:bg-[#1E293B]'
                        }`}
                        disabled={room.availability_status === 'fully_booked'}
                        data-testid={`view-room-btn-${room.id}`}
                      >
                        {room.availability_status === 'fully_booked' ? 'Fully Booked' : 'View Details'}
                        {room.availability_status !== 'fully_booked' && <ArrowRight className="ml-2 w-4 h-4" />}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#059669] text-xl">✓</span>
              </div>
              <h3 className="font-semibold text-[#0F172A] mb-2">No Hidden Fees</h3>
              <p className="text-sm text-slate-500">Price shown is final. Only additional is the refundable deposit.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#D97706] text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-[#0F172A] mb-2">Quick Response</h3>
              <p className="text-sm text-slate-500">Management responds to all booking requests within 24 hours.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#6366F1] text-xl">🔒</span>
              </div>
              <h3 className="font-semibold text-[#0F172A] mb-2">Secure Booking</h3>
              <p className="text-sm text-slate-500">Your information is safe. We'll contact you to finalize.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomsPage;
