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