import { useState } from "react";
import { loginAsAdmin } from "../apis/adminApi.js";
import { useNavigate } from "react-router-dom";

export default function AdminAuthForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await loginAsAdmin({
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200 && response.data) {
        const user = response.data;
        localStorage.setItem("admin", JSON.stringify(user));
        localStorage.setItem("role", "admin");
        setSuccess(true);
        navigate("/admindashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Admin Login</h1>
          </div>
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                Login successful!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 outline-none rounded-xl bg-gray-50 hover:bg-white focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 outline-none rounded-xl bg-gray-50 hover:bg-white focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
