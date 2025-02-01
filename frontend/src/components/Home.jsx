
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const navigate = useNavigate();
//   const [articles, setArticles] = useState([]);

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:8000/article/latest", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in headers
//           },
//         });
//         if (!response.ok) {
//           throw new Error("Failed to fetch articles");
//         }
//         const data = await response.json();
//         setArticles(data);
//       } catch (error) {
//         console.error(error.message);
//       }
//     };

//     fetchArticles();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.reload();
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//           <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
//       <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Game Highlights Generator</h1>
//       <button
//         onClick={() => navigate("/form")}
//         className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition duration-300"
//       >
//         Get Started
//       </button>
//       <button
//         onClick={handleLogout}
//         className="mt-4 text-red-500 font-medium hover:underline"
//       >
//         Logout
//       </button>
//     </div>
    

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {articles.length > 0 ? (
//           articles.map((article) => (
//             <div
//               key={article._id}
              
//               className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//               onClick={() => navigate(`/article/${article._id}`)}
//             >
//               <h2 className="text-xl font-semibold text-blue-600 mb-2">
//                 {article.title}
//                 {console.log(article)}
//               </h2>
//               <p className="text-gray-700 line-clamp-3">
//                 {article.sections[0]?.content}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No articles available. Start generating!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Sparkles, LogOut, Plus, Loader2 } from "lucide-react";

// const Home = () => {
//   const navigate = useNavigate();
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:8000/article/latest", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         if (!response.ok) {
//           throw new Error("Failed to fetch articles");
//         }
//         const data = await response.json();
//         setArticles(data);
//       } catch (error) {
//         console.error(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticles();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     console.log("Token removed");
//     window.location.reload();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
//         <div className="container mx-auto px-4 py-16">
//           <nav className="flex justify-end mb-16">
//           <button
//             onClick={handleLogout}
//             className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
//           >
//             <LogOut size={18} />
//             <span>Logout</span>
//           </button>

//           </nav>

//           <div className="text-center max-w-3xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
//                 Game Highlights Generator
//               </h1>
//               <p className="text-gray-300 text-xl mb-8">
//                 Transform your gaming moments into captivating highlights with AI-powered analysis
//               </p>
//               <button
//                 onClick={() => navigate("/form")}
//                 className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//               >
//                 <Plus className="w-5 h-5" />
//                 <span>Create New Highlight</span>
//                 <Sparkles className="w-5 h-5 animate-pulse" />
//               </button>
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       {/* Articles Grid */}
//       <div className="container mx-auto px-4 py-16">
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {articles.length > 0 ? (
//               articles.map((article, index) => (
//                 <motion.div
//                   key={article._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4, delay: index * 0.1 }}
//                   onClick={() => navigate(`/article/${article._id}`)}
//                   className="group relative bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer border border-gray-700/50 hover:border-blue-500/50"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
//                   <h2 className="text-xl font-semibold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors duration-300">
//                     {article.title}
//                   </h2>
//                   <p className="text-gray-400 line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
//                     {article.sections[0]?.content}
//                   </p>
//                 </motion.div>
//               ))
//             ) : (
//               <div className="col-span-full text-center py-20">
//                 <p className="text-gray-400 text-lg mb-4">No highlights available yet</p>
//                 <button
//                   onClick={() => navigate("/form")}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 rounded-full text-blue-400 hover:bg-blue-500/30 transition-all duration-300"
//                 >
//                   <Plus className="w-5 h-5" />
//                   <span>Create Your First Highlight</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, LogOut, Plus, Loader2, Filter } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/article/latest", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Token removed");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="container mx-auto px-4 py-16">
          <nav className="flex justify-end mb-16">
            <button
              onClick={handleLogout}
              className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>

          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Game Highlights Generator
              </h1>
              <p className="text-gray-300 text-xl mb-8">
                Transform your gaming moments into captivating highlights with AI-powered analysis
              </p>
              <button
                onClick={() => navigate("/createarticle")}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Highlight</span>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Impressive Section */}
      <div className="py-16 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-blue-400">
              Discover Your Favorite Articles
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Browse through a curated list of articles and find the ones that inspire you.
            </p>
            <button
              onClick={() => navigate("/article/filter")}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Filter className="w-5 h-5" />
              <span>Filter Articles</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-16">
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

export default Home;
