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


import React, { useState } from "react";
import Form from "./components/Form"
import Article from "./components/Article";

const App = () => {
  const [article, setArticle] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Game Highlights Generator</h1>
        <Form setArticle={setArticle} />
        {article && <Article article={article} />}
      </div>
    </div>
  );
};

export default App;
