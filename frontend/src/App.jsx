// import React, { useState } from "react";
// import Form from "./components/Form";
// import Article from "./components/Article";
// import Signup from "./components/Signup";
// import Login from "./components/Login";

// const App = () => {
//   const [article, setArticle] = useState(null);
//   const [showSignup, setShowSignup] = useState(true); // Toggle between Signup and Login

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
//       <div className="w-full max-w-3xl">
//         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
//           Game Highlights Generator
//         </h1>

//         {/* Toggle between Signup and Login */}
//         {showSignup ? (
//           <div>
//             <Signup />
//             <p className="text-center text-gray-600 mt-4">
//               Already have an account?{" "}
//               <button
//                 className="text-indigo-500 font-medium hover:underline"
//                 onClick={() => setShowSignup(false)}
//               >
//                 Log In
//               </button>
//             </p>
//           </div>
//         ) : (
//           <div>
//             <Login />
//             <p className="text-center text-gray-600 mt-4">
//               Don’t have an account?{" "}
//               <button
//                 className="text-green-500 font-medium hover:underline"
//                 onClick={() => setShowSignup(true)}
//               >
//                 Sign Up
//               </button>
//             </p>
//           </div>
//         )}

//         {/* Other Components */}
//         <Form setArticle={setArticle} />
//         {article && <Article article={article} />}
//       </div>
//     </div>
//   );
// };

// export default App;

// import React, { useState } from "react";
// import Form from "./components/Form";
// import Article from "./components/Article";
// import Signup from "./components/Signup";
// import Login from "./components/Login";

// const App = () => {
//   const [article, setArticle] = useState(null);
//   const [showSignup, setShowSignup] = useState(true); // Toggle between Signup and Login
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
//       <div className="w-full max-w-3xl">
//         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
//           Game Highlights Generator
//         </h1>

//         {/* Authentication Logic */}
//         {!isAuthenticated ? (
//           showSignup ? (
//             <Signup setIsAuthenticated={setIsAuthenticated} toggleToLogin={() => setShowSignup(false)} />
//           ) : (
//             <Login setIsAuthenticated={setIsAuthenticated} toggleToSignup={() => setShowSignup(true)} />
//           )
//         ) : (
//           <>
//             <Form setArticle={setArticle} />
//             {article && <Article article={article} />}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;


import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Form from "./components/Form";
import Article from "./components/Article"

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(true); // New state to toggle pages
  const [article, setArticle] = useState(null);
  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const isTokenExpired = tokenPayload.exp * 1000 < Date.now();
      if (isTokenExpired) {
        localStorage.removeItem("token"); // Clear expired token
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        {!isAuthenticated ? (
          <>
            <Route
              path="/login"
              element={
                isLoginPage? (
                  <Login 
                  setIsAuthenticated={setIsAuthenticated}
                  toggleToSignup={() => setIsLoginPage(false)}
                  />
                ) : (
                  <Signup
                    setIsAuthenticated={setIsAuthenticated}
                    toggleToLogin={() => setIsLoginPage(true)} // Toggle to Login
                  />
                )
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {/* Protected Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/form"
              element={<Form setArticle={setArticle} />} // Pass setArticle to Form
            />
            <Route
              path="/article"
              element={<Article article={article} />} // Pass article to Article
            />
            <Route path="*" element={<Navigate to="/" />} />
        
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;

