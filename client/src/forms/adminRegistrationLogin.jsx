import { useState } from "react";
import { loginAsAdmin, registerAsAdmin } from "../service/adminApi.js";
import { useNavigate } from "react-router-dom";
export default function AdminAuthForm() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeSwitch = (loginMode) => {
    setIsLogin(loginMode);
    setError(null);
    setSuccess(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (isLogin) {
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

          // Store user data and role in localStorage
          localStorage.setItem("admin", JSON.stringify(user));
          localStorage.setItem("role", "admin");

          setSuccess(true);

          // Redirect based on role
          navigate("/admindashboard");
        } else {
          setError("Invalid credentials");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Login failed");
      } finally {
        setLoading(false);
      }
    } else {
      // Registration logic
      const { name, email, password, phoneNumber } = formData;

      if (!name || !email || !password || !phoneNumber) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      try {
        const response = await registerAsAdmin(formData);
        if (response.status === 201 || response.success) {
          setSuccess(true);
          setFormData({ name: "", email: "", password: "", phoneNumber: "" });
        } else {
          setError("Unexpected response from server");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Registration failed"
        );
      } finally {
        setLoading(false);
      }
    }

    console.log(formData);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20">
            {/* Header with mode switcher */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white">
              <h1 className="text-2xl font-bold text-center mb-4">
                Admin {isLogin ? "Login" : "Registration"}
              </h1>

              {/* Toggle buttons */}
              <div className="flex bg-white/20 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => handleModeSwitch(true)}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
                    isLogin
                      ? "bg-white text-teal-600 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch(false)}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
                    !isLogin
                      ? "bg-white text-teal-600 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Form content */}
            <div className="p-8">
              {/* Status messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {isLogin
                      ? "Login successful!"
                      : "Admin registered successfully!"}
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Registration-only fields */}
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        required={!isLogin}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}

                {/* Common fields */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isLogin ? "Logging in..." : "Registering..."}
                    </div>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              {/* Footer text */}
              <div className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? (
                  <p>
                    Need an admin account?{" "}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch(false)}
                      className="text-teal-600 hover:text-teal-700 font-semibold hover:underline"
                    >
                      Register here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch(true)}
                      className="text-teal-600 hover:text-teal-700 font-semibold hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
