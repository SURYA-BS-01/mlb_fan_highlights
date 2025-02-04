import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          
          navigate("/login");
          return;
        }
        
        const response = await fetch("http://127.0.0.1:8000/article/user_articles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user articles");
        }

        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Token removed");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex justify-between p-4 bg-gray-800">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6" />
          <span>Dashboard</span>
        </div>
        <button
          onClick={handleLogout}
          className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>

      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Your Articles</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.length > 0 ? (
    articles.map((article, index) => (
      <motion.div
        key={article._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        onClick={() => navigate(`/article/${article._id}`, {state: {source: 'user'}})}
        className="group relative bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer border border-gray-700/50 hover:border-blue-500/50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors duration-300">
          {article.title}
        </h2>

        {/* Date */}
        <p className="text-gray-400 text-sm mb-2">
          📅 {new Date(article.game_date).toLocaleDateString()}
        </p>

        {/* Teams */}
        <p className="text-gray-400 text-sm">
          🏟️ <span className="font-medium">{article.team_home}</span> vs <span className="font-medium">{article.team_away}</span>
        </p>
      </motion.div>
    ))
  ) : (
    <div className="col-span-full text-center py-20">
      <p className="text-gray-400 text-lg mb-4">No highlights available yet</p>
      <button
        onClick={() => navigate("/createarticle")}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 rounded-full text-blue-400 hover:bg-blue-500/30 transition-all duration-300"
      >
        <Plus className="w-5 h-5" />
        <span>Create Your First Highlight</span>
      </button>
    </div>
  )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;