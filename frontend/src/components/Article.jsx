import React from "react";

const Article = ({ article }) => {
  if (!article) {
    return <p className="text-gray-500">No content to display. Generate some!</p>;
  }

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
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
          {article.links.map((link, index) => (
            <li key={index}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-gray-600 font-semibold italic">{article.conclusion}</p>
    </div>
  );
};

export default Article;
