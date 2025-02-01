import "../App.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: "",
    team_away: "",
    team_home: "",
    game_date: "",
    sections: [{ heading: "", content: "" }],
    conclusion: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle({ ...article, [name]: value });
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...article.sections];
    updatedSections[index][field] = value;
    setArticle({ ...article, sections: updatedSections });
  };

  const addSection = () => {
    setArticle({ ...article, sections: [...article.sections, { heading: "", content: "" }] });
  };

  const removeSection = (index) => {
    const updatedSections = article.sections.filter((_, i) => i !== index);
    setArticle({ ...article, sections: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log(article)
      await axios.post("http://127.0.0.1:8000/article", article, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-700/50">
        <h1 className="text-3xl text-center text-blue-400 font-bold mb-6">Create New Article</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" name="title" placeholder="Title" value={article.title} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 border border-gray-700 focus:ring-2 focus:ring-blue-400" required />
          <div className="flex space-x-4">
            <input type="text" name="team_away" placeholder="Away Team" value={article.team_away} onChange={handleChange} className="w-1/2 p-3 rounded-lg bg-gray-900 text-gray-300 border border-gray-700 focus:ring-2 focus:ring-blue-400" required />
            <input type="text" name="team_home" placeholder="Home Team" value={article.team_home} onChange={handleChange} className="w-1/2 p-3 rounded-lg bg-gray-900 text-gray-300 border border-gray-700 focus:ring-2 focus:ring-blue-400" required />
          </div>
          <input type="date" name="game_date" value={article.game_date} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 border border-gray-700 focus:ring-2 focus:ring-blue-400" required />
          {article.sections.map((section, index) => (
            <div key={index} className="space-y-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <input type="text" placeholder="Section Heading" value={section.heading} onChange={(e) => handleSectionChange(index, "heading", e.target.value)} className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700" required />
              <textarea placeholder="Section Content" value={section.content} onChange={(e) => handleSectionChange(index, "content", e.target.value)} className="w-full p-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 h-24" required />
              {article.sections.length > 1 && (
                <button type="button" onClick={() => removeSection(index)} className="text-red-400 hover:text-red-300 text-sm">Remove Section</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSection} className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500">+ Add Section</button>
          <textarea name="conclusion" placeholder="Conclusion" value={article.conclusion} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-900 text-gray-300 border border-gray-700 h-24" required />
          <button type="submit" className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-500" disabled={loading}>{loading ? "Submitting..." : "Create Article"}</button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
