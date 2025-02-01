

// import React from "react";

// const Highlights = ({ content }) => {
//   if (!content || !content.title) {
//     return <p>No highlights to display. Generate some!</p>;
//   }

//   return (
//     <div className="p-4 bg-gray-50">
//       <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
//       {content.sections.map((section, index) => (
//         <div key={index} className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
//           <p>{section.content}</p>
//         </div>
//       ))}
//       <div className="mt-4">
//         <h2 className="text-xl font-semibold">Video Highlights</h2>
//         {content.links.map((link, index) => (
//           <a
//             key={index}
//             href={link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="block text-blue-500 underline mb-1"
//           >
//             Highlight {index + 1}
//           </a>
//         ))}
//       </div>
//       <p className="mt-6">{content.conclusion}</p>
//     </div>
//   );
// };

// export default Highlights;



import "../App.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const ttsApiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [translatedArticle, setTranslatedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default: English
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:8000/article/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch article");
        }

        const data = await response.json();
        setArticle(data);
        setTranslatedArticle(data);
      } catch (error) {
        console.error("Fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const translateText = async (text) => {
    if (selectedLanguage === "en") return text; // No translation needed for English

    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    try {
      const response = await axios.post(url, {
        q: text,
        target: selectedLanguage,
        source: "en",
        format: "text",
      });

      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  const translateArticle = async () => {
    if (!article) return;
    setLoading(true);
    try {
      const translatedTitle = await translateText(article.title);
      const translatedSections = await Promise.all(
        article.sections.map(async (section) => ({
          heading: await translateText(section.heading),
          content: await translateText(section.content),
        }))
      );
      const translatedConclusion = await translateText(article.conclusion);

      setTranslatedArticle({
        ...article,
        title: translatedTitle,
        sections: translatedSections,
        conclusion: translatedConclusion,
      });
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLanguage !== "en") {
      translateArticle();
    } else {
      setTranslatedArticle(article);
    }
  }, [selectedLanguage]);

  const generateAudio = async () => {
    if (!translatedArticle) return;

    const textToConvert = translatedArticle.sections.map(sec => sec.content).join(" ");
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsApiKey}`;
    const voiceConfig = {
      en: { languageCode: "en-US", voice: "en-US-Wavenet-D" },
      es: { languageCode: "es-ES", voice: "es-ES-Wavenet-D" },
      ja: { languageCode: "ja-JP", voice: "ja-JP-Wavenet-D" },
    };

    try {
      const response = await axios.post(url, {
        input: { text: textToConvert },
        voice: {
          languageCode: voiceConfig[selectedLanguage].languageCode,
          name: voiceConfig[selectedLanguage].voice,
        },
        audioConfig: { audioEncoding: "mp3" },
      });

      const audioContent = response.data.audioContent;
      setAudioUrl(`data:audio/mp3;base64,${audioContent}`);
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  useEffect(() => {
    generateAudio();
  }, [translatedArticle]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="article-container">
      <h1>{translatedArticle.title}</h1>
      <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="ja">Japanese</option>
      </select>
      <button onClick={generateAudio} className="btn">Generate Audio</button>
      {audioUrl && <audio controls src={audioUrl} className="audio-player" />}
      {translatedArticle.sections.map((section, index) => (
        <div key={index}>
          <h2>{section.heading}</h2>
          <p>{section.content}</p>
        </div>
      ))}
      <p>{translatedArticle.conclusion}</p>
    </div>
  );
};

export default Article;
