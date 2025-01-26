// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Clear JWT on logout
//     window.location.reload(); // Reload the app to reset authentication state
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
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
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/article", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in headers
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchArticles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
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
    

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article._id}
              
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/article/${article._id}`)}
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-2">
                {article.title}
                {console.log(article)}
              </h2>
              <p className="text-gray-700 line-clamp-3">
                {article.sections[0]?.content}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No articles available. Start generating!</p>
        )}
      </div>
    </div>
  );
};

export default Home;
