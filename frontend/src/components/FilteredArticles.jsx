import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Loader2, Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FilteredArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ startDate: null, endDate: null, team: "" });
  const teams = [
    "Athletics", "Pirates", "Padres", "Mariners", "Giants", "Cardinals",
    "Rays", "Rangers", "Blue Jays", "Twins", "Phillies", "Braves",
    "White Sox", "Marlins", "Yankees", "Brewers", "Angels", "D-backs",
    "Orioles", "Red Sox", "Cubs", "Reds", "Guardians", "Rockies",
    "Tigers", "Astros", "Royals", "Dodgers", "Nationals", "Mets",
  ];


  const fetchFilteredArticles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append("start_date", filters.startDate.toLocaleDateString("en-CA"));
      if (filters.endDate) queryParams.append("end_date", filters.endDate.toLocaleDateString("en-CA"));
      if (filters.team) queryParams.append("team", filters.team);
  
      console.log("Query Params:", queryParams.toString());
  
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/article/filter?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch filtered articles");
      }
  
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300"
          >
            Back to Home
          </button>
          <h1 className="text-4xl font-bold">Filtered Articles</h1>
        </nav>

        {/* Filter Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-12 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Filter Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Start Date</label>
              <DatePicker
                selected={filters.startDate}
                onChange={(date) => handleFilterChange("startDate", date)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">End Date</label>
              <DatePicker
                selected={filters.endDate}
                onChange={(date) => handleFilterChange("endDate", date)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">By Team</label>
              <select
                value={filters.team}
                onChange={(e) => handleFilterChange("team", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>

            </div>
            <div className="flex items-end">
              <button
                onClick={fetchFilteredArticles}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300"
              >
                <Filter className="w-5 h-5" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {articles.length > 0 ? (
    articles.map((article, index) => (
      <motion.div
        key={article._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        onClick={() => navigate(`/article/${article._id}`)}
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
        onClick={() => navigate("/form")}
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

export default FilteredArticles;
