import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear JWT on logout
    window.location.reload(); // Reload the app to reset authentication state
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Game Highlights Generator</h1>
      <button
        onClick={() => navigate("/form")}
        className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition duration-300"
      >
        Get Started
      </button>
      <button
        onClick={handleLogout}
        className="mt-4 text-red-500 font-medium hover:underline"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
