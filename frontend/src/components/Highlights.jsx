// import React from "react";

// const Highlights = ({ content }) => {
//   if (!content) {
//     return (
//       <p className="text-center text-gray-500 mt-8">
//         No highlights to display. Generate some!
//       </p>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 rounded-md shadow-lg w-full max-w-3xl mx-auto mt-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Highlights</h2>
//       <p className="text-gray-700 leading-relaxed">{content}</p>
//     </div>
//   );
// };

// export default Highlights;


// import React from "react";

// const Highlights = ({ content }) => {
//   if (!content) {
//     return (
//       <p className="text-center text-gray-500 mt-8">
//         No highlights to display. Generate some!
//       </p>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 rounded-md shadow-lg w-full max-w-3xl mx-auto mt-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Highlights</h2>
//       <p className="text-gray-700 leading-relaxed">{content}</p>
//     </div>
//   );
// };

// export default Highlights;


import React from "react";

const Highlights = ({ content }) => {
  if (!content || !content.title) {
    return <p>No highlights to display. Generate some!</p>;
  }

  return (
    <div className="p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
      {content.sections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
          <p>{section.content}</p>
        </div>
      ))}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Video Highlights</h2>
        {content.links.map((link, index) => (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-500 underline mb-1"
          >
            Highlight {index + 1}
          </a>
        ))}
      </div>
      <p className="mt-6">{content.conclusion}</p>
    </div>
  );
};

export default Highlights;
