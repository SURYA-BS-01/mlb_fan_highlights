// import React, { useState } from "react";
// import axios from "axios";

// const Form = ({ setHighlights }) => {
//   const [language, setLanguage] = useState("ENGLISH");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/generate", {
//         language,
//       });
//       setHighlights(response.data.content);
//     } catch (error) {
//       console.error("Error generating highlights:", error);
//       alert("Failed to generate highlights. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label htmlFor="language">Select Language:</label>
//       <select
//         id="language"
//         value={language}
//         onChange={(e) => setLanguage(e.target.value)}
//       >
//         <option value="ENGLISH">English</option>
//         <option value="SPANISH">Spanish</option>
//         {/* Add more languages as needed */}
//       </select>
//       <button type="submit" disabled={loading}>
//         {loading ? "Generating..." : "Generate Highlights"}
//       </button>
//     </form>
//   );
// };

// export default Form;


// import React, { useState } from "react";
// import axios from "axios";

// const Form = ({ setHighlights }) => {
//   const [language, setLanguage] = useState("ENGLISH");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/generate", {
//         language,
//       });
//       setHighlights(response.data.content);
//     } catch (error) {
//       console.error("Error generating highlights:", error);
//       alert("Failed to generate highlights. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col items-center bg-white shadow-lg p-6 rounded-md w-full max-w-lg mx-auto"
//     >
//       <h2 className="text-2xl font-bold mb-4 text-gray-700">Generate Highlights</h2>
//       <label htmlFor="language" className="mb-2 text-lg font-medium text-gray-600">
//         Select Language:
//       </label>
//       <select
//         id="language"
//         value={language}
//         onChange={(e) => setLanguage(e.target.value)}
//         className="p-2 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:outline-none w-full max-w-sm mb-4"
//       >
//         <option value="ENGLISH">English</option>
//         <option value="SPANISH">Spanish</option>
//       </select>
//       <button
//         type="submit"
//         disabled={loading}
//         className={`px-6 py-2 rounded-md text-white ${
//           loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
//         }`}
//       >
//         {loading ? "Generating..." : "Generate"}
//       </button>
//     </form>
//   );
// };

// export default Form;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Form = ({ setArticle }) => {

  const [language, setLanguage] = useState("ENGLISH");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  const token = localStorage.getItem("token"); // Ensure the token is stored in local storage after login
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/generate",
      { language },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setArticle(response.data); // Pass the structured content to the parent
    navigate("/article");
  } catch (error) {
    console.error("Error generating article:", error);
    alert("Failed to generate content. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-md">
      <label htmlFor="language" className="block text-gray-700 font-semibold mb-2">
        Select Language:
      </label>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
      >
        <option value="ENGLISH">English</option>
        <option value="SPANISH">Spanish</option>
        <option value="JAPANESE">Japanese</option>
        {/* Add more languages as needed */}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        {loading ? "Generating..." : "Generate Content"}
      </button>
    </form>
  );
};

export default Form;