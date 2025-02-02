import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favTeam, setFavTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const teams = [
    "Athletics", "Pirates", "Padres", "Mariners", "Giants", "Cardinals",
    "Rays", "Rangers", "Blue Jays", "Twins", "Phillies", "Braves",
    "White Sox", "Marlins", "Yankees", "Brewers", "Angels", "D-backs",
    "Orioles", "Red Sox", "Cubs", "Reds", "Guardians", "Rockies",
    "Tigers", "Astros", "Royals", "Dodgers", "Nationals", "Mets",
  ];

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/users", {
        email,
        password,
        fav_team: favTeam,
      });

      const loginResponse = await axios.post(
        "http://127.0.0.1:8000/login",
        new URLSearchParams({
          username: email,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", loginResponse.data.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl transform -rotate-3"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-blue-600/10 to-purple-600/10 rounded-2xl transform rotate-3"></div>
        
        {/* Main Form Container */}
        <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl p-8">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-8">
            Join the Game
          </h2>
          
          <form onSubmit={handleSignup} className="space-y-6">
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
            
            <div>
              <label htmlFor="favTeam" className="block text-gray-300 font-medium mb-2">
                Favorite Team
              </label>
              <select
                id="favTeam"
                value={favTeam}
                onChange={(e) => setFavTeam(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-200 transition duration-300"
                required
              >
                <option value="" disabled className="bg-gray-900">
                  Select your favorite team
                </option>
                {teams.map((team) => (
                  <option key={team} value={team} className="bg-gray-900">
                    {team}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-300/50 focus:outline-none transition duration-300 font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <button
              className="text-blue-400 font-medium hover:text-blue-300 transition duration-300"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;