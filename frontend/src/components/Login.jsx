import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new URLSearchParams();
    payload.append("username", email);
    payload.append("password", password);

    try {
      const response = await axios.post("http://127.0.0.1:8000/login", payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      localStorage.setItem("token", response.data.access_token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl transform -rotate-3"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-blue-600/10 to-purple-600/10 rounded-2xl transform rotate-3"></div>
        
        {/* Main Form Container */}
        <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl p-8">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-8">
            Welcome Back
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                Email ID
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-200 placeholder-gray-500 transition duration-300"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-300 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-200 placeholder-gray-500 transition duration-300"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-300/50 focus:outline-none transition duration-300 font-medium relative overflow-hidden group"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <span className="relative z-10">Log In</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm mt-8 mb-6">
              <span className="px-2 bg-gray-800/50 text-gray-400">or</span>
            </div>
          </div>
          
          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <button
              className="text-blue-400 font-medium hover:text-blue-300 transition duration-300"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;