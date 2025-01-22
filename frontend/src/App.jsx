// import React, { useState } from "react";
// import Form from "./components/Form";
// import Highlights from "./components/Highlights";

// const App = () => {
//   const [highlights, setHighlights] = useState("");

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
//       <h1 className="text-4xl font-bold text-gray-800 mb-6">
//         Baseball Highlights Generator
//       </h1>
//       <Form setHighlights={setHighlights} />
//       <Highlights content={highlights} />
//     </div>
//   );
// };

// export default App;


// import React, { useState } from "react";
// import Form from "./components/Form";
// import Highlights from "./components/Highlights";

// const App = () => {
//   const [highlights, setHighlights] = useState("");

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
//       <h1 className="text-4xl font-bold text-gray-800 mb-6">
//         Baseball Highlights Generator
//       </h1>
//       <Form setHighlights={setHighlights} />
//       <Highlights content={highlights} />
//     </div>
//   );
// };

// export default App;


// import React, { useState } from "react";
// import Form from "./components/Form"
// import Article from "./components/Article";
// import Signup from "./components/Signup";

// const App = () => {
//   const [article, setArticle] = useState(null);

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
//       <div className="w-full max-w-3xl">
//         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Game Highlights Generator</h1>
//         <Signup />
//         <Form setArticle={setArticle} />
//         {article && <Article article={article} />}
//       </div>
//     </div>
//   );
// };

// export default App;


import React, { useState } from "react";
import Form from "./components/Form";
import Article from "./components/Article";
import Signup from "./components/Signup";
import Login from "./components/Login";

const App = () => {
  const [article, setArticle] = useState(null);
  const [showSignup, setShowSignup] = useState(true); // Toggle between Signup and Login

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Game Highlights Generator
        </h1>

        {/* Toggle between Signup and Login */}
        {showSignup ? (
          <div>
            <Signup />
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                className="text-indigo-500 font-medium hover:underline"
                onClick={() => setShowSignup(false)}
              >
                Log In
              </button>
            </p>
          </div>
        ) : (
          <div>
            <Login />
            <p className="text-center text-gray-600 mt-4">
              Don’t have an account?{" "}
              <button
                className="text-green-500 font-medium hover:underline"
                onClick={() => setShowSignup(true)}
              >
                Sign Up
              </button>
            </p>
          </div>
        )}

        {/* Other Components */}
        <Form setArticle={setArticle} />
        {article && <Article article={article} />}
      </div>
    </div>
  );
};

export default App;
