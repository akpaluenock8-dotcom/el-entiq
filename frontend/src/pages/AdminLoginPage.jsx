import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API}/admin/login`, formData);
      localStorage.setItem("adminToken", response.data.access_token);
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center">
              <span className="text-[#0F172A] font-bold text-xl font-['Syne']">EA</span>
            </div>
            <span className="text-2xl font-bold text-white font-['Syne']">EL-ANTIQ</span>
          </div>
          <p className="text-slate-400">Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-[#0F172A] font-['Syne'] mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-center mb-8">
            Sign in to manage your hostel
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@elantiq.com"
                value={formData.email}
                onChange={handleInputChange}
                className="h-12"
                required
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-12 pr-12"
                  required
                  data-testid="input-password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="toggle-password"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full py-6 text-base font-semibold"
              disabled={loading}
              data-testid="login-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-sm text-slate-500 hover:text-[#0F172A] transition-colors"
              data-testid="back-to-home"
            >
              ← Back to Website
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 text-center">
              <strong>Demo Credentials:</strong><br />
              Email: admin@elantiq.com<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
