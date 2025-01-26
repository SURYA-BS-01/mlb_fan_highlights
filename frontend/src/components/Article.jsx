// import React from "react";

// const Article = ({ article }) => {
//   if (!article) {
//     return <p className="text-gray-500">No content to display. Generate some!</p>;
//   }

//   return (
//     <div className="p-6 bg-white rounded-md shadow-md">
//       <h1 className="text-2xl font-bold mb-4 text-blue-600">{article.title}</h1>

//       {article.sections.map((section, index) => (
//         <div key={index} className="mb-6">
//           <h2 className="text-xl font-semibold mb-2 text-gray-800">{section.heading}</h2>
//           <p className="text-gray-700">{section.content}</p>
//         </div>
//       ))}

//       <div className="mb-4">
//         <h3 className="text-lg font-semibold mb-2 text-gray-800">Highlights Video Links:</h3>
//         <ul className="list-disc pl-5">
//         {article.links.map((link, index) => (
//   Object.entries(link).map(([title, url], subIndex) => (
//     <li key={`${index}-${subIndex}`}>
//       <a
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-500 hover:underline"
//       >
//         {title}
//       </a>
//     </li>
//   ))
// ))}

//         </ul>
//       </div>

//       <p className="text-gray-600 font-semibold italic">{article.conclusion}</p>
//     </div>
//   );
// };

// export default Article;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:8000/article/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch article");
        }
        
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error("Fetch error:", error.message);
        // Optionally set an error state to show user
      }
    };
  
    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (!article) {
    return <p className="text-gray-500">Loading article...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">{article.title}</h1>
        {article.sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{section.heading}</h2>
            <p className="text-gray-700">{section.content}</p>
          </div>
        ))}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Highlights Video Links:</h3>
          <ul className="list-disc pl-5">
            {article.links.map((link, index) =>
              Object.entries(link).map(([title, url], subIndex) => (
                <li key={`${index}-${subIndex}`}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {title}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
        <p className="text-gray-600 font-semibold italic">{article.conclusion}</p>
      </div>
    </div>
  );
};

export default Article;
