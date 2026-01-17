/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Home, 
  Bed, 
  Calendar, 
  MessageSquare, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      const [statsRes, roomsRes, bookingsRes, messagesRes] = await Promise.all([
        axios.get(`${API}/stats`, { headers }),
        axios.get(`${API}/rooms`),
        axios.get(`${API}/bookings`, { headers }),
        axios.get(`${API}/contact`, { headers }),
      ]);
      
      setStats(statsRes.data);
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
    toast.success("Logged out successfully");
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(
        `${API}/bookings/${bookingId}/status?status=${status}`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  const updateRoomAvailability = async (roomId, status) => {
    try {
      await axios.put(
        `${API}/rooms/${roomId}`,
        { availability_status: status },
        { headers: getAuthHeaders() }
      );
      toast.success("Room status updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update room status");
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    
    try {
      await axios.delete(`${API}/rooms/${roomId}`, { headers: getAuthHeaders() });
      toast.success("Room deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete room");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0F172A] text-white p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
            <span className="text-[#0F172A] font-bold font-['Syne']">EA</span>
          </div>
          <div>
            <p className="font-bold font-['Syne']">EL-ANTIQ</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: "overview", label: "Overview", icon: Home },
            { id: "rooms", label: "Rooms", icon: Bed },
            { id: "bookings", label: "Bookings", icon: Calendar },
            { id: "messages", label: "Messages", icon: MessageSquare },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? "bg-[#D4AF37] text-[#0F172A]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              data-testid={`nav-${item.id}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/5"
            onClick={handleLogout}
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-[#0F172A] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
            <span className="text-[#0F172A] font-bold text-sm font-['Syne']">EA</span>
          </div>
          <span className="font-bold font-['Syne']">Admin</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      {/* Mobile Tabs */}
      <div className="lg:hidden bg-white border-b border-slate-100 overflow-x-auto">
        <div className="flex p-2 gap-2">
          {[
            { id: "overview", label: "Overview", icon: Home },
            { id: "rooms", label: "Rooms", icon: Bed },
            { id: "bookings", label: "Bookings", icon: Calendar },
            { id: "messages", label: "Messages", icon: MessageSquare },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm ${
                activeTab === item.id 
                  ? "bg-[#0F172A] text-white" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8" data-testid="overview-tab">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] font-['Syne']">Dashboard Overview</h1>
              <p className="text-slate-500">Welcome back to your admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <Bed className="w-8 h-8 text-[#D4AF37]" />
                  <span className="text-xs text-slate-400">Total</span>
                </div>
                <p className="text-3xl font-bold text-[#0F172A] font-['Syne']">{stats?.total_rooms || 0}</p>
                <p className="text-sm text-slate-500">Rooms</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <span className="text-xs text-slate-400">Available</span>
                </div>
                <p className="text-3xl font-bold text-[#0F172A] font-['Syne']">{stats?.available_rooms || 0}</p>
                <p className="text-sm text-slate-500">Rooms</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-[#6366F1]" />
                  <span className="text-xs text-slate-400">Pending</span>
                </div>
                <p className="text-3xl font-bold text-[#0F172A] font-['Syne']">{stats?.pending_bookings || 0}</p>
                <p className="text-sm text-slate-500">Bookings</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <MessageSquare className="w-8 h-8 text-[#F59E0B]" />
                  <span className="text-xs text-slate-400">Total</span>
                </div>
                <p className="text-3xl font-bold text-[#0F172A] font-['Syne']">{stats?.total_messages || 0}</p>
                <p className="text-sm text-slate-500">Messages</p>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl border border-slate-100">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-semibold text-[#0F172A] font-['Syne']">Recent Bookings</h2>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.full_name}</TableCell>
                        <TableCell>{booking.room_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(booking.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === "rooms" && (
          <div className="space-y-6" data-testid="rooms-tab">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0F172A] font-['Syne']">Manage Rooms</h1>
                <p className="text-slate-500">Add, edit, or update room availability</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell>{room.room_type}</TableCell>
                        <TableCell>GHS {room.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Select 
                            value={room.availability_status} 
                            onValueChange={(value) => updateRoomAvailability(room.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="almost_full">Almost Full</SelectItem>
                              <SelectItem value="fully_booked">Fully Booked</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteRoom(room.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            data-testid={`delete-room-${room.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-6" data-testid="bookings-tab">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] font-['Syne']">Booking Requests</h1>
              <p className="text-slate-500">Manage incoming booking requests</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Move-in</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.full_name}</p>
                            <p className="text-xs text-slate-400">{booking.school}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{booking.phone_number}</p>
                            <p className="text-xs text-slate-400">{booking.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{booking.room_name}</p>
                            <p className="text-xs text-slate-400">{booking.room_type}</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.preferred_move_in_date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.status === "pending" && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                data-testid={`confirm-booking-${booking.id}`}
                              >
                                Confirm
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-50"
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                data-testid={`cancel-booking-${booking.id}`}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="space-y-6" data-testid="messages-tab">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] font-['Syne']">Contact Messages</h1>
              <p className="text-slate-500">Messages from the contact form</p>
            </div>

            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className="bg-white rounded-xl p-6 border border-slate-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-medium text-[#0F172A]">{msg.name}</p>
                      <p className="text-sm text-slate-400">{msg.email}</p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-slate-600">{msg.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  No messages yet
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
