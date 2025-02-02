import "../App.css";
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const ttsApiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [translatedArticle, setTranslatedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default: English
  const [audioUrls, setAudioUrls] = useState({}); // Store audio URLs for different languages

  const location = useLocation(); // If using state
  const [searchParams] = useSearchParams(); // If using query parameters
  const source = location.state?.source || searchParams.get("source") || "latest"; 
  const collection = source === "user" ? "user" : "latest"; // Change collection name

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:8000/article/${id}?collection=${collection}`, {
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
        console.log("Original Article:", data);
        setArticle(data);
        setTranslatedArticle(data); // Initially, set translation to the original text
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
      return text; // Return original text if translation fails
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
      setTranslatedArticle(article); // Reset to original article
    }
  }, [selectedLanguage]);

  const generateAudio = async () => {
    if (!translatedArticle) return;

    if (audioUrls[selectedLanguage]) {
      // If audio for selected language already exists, no need to regenerate
      return;
    }

    const textToConvert = translatedArticle.sections.map((sec) => sec.content).join(" ");
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
      setAudioUrls((prev) => ({
        ...prev,
        [selectedLanguage]: `data:audio/mp3;base64,${audioContent}`,
      }));
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!translatedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <p className="text-gray-400 text-xl">Article not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Language Selection Dropdown */}
        <div className="mb-6 flex items-center justify-between bg-gray-800/50 p-4 rounded-xl shadow-md border border-gray-700/50">
  {/* Language Selection Dropdown */}
  <div className="flex items-center space-x-3">
    <label className="text-gray-400 text-sm">Translate:</label>
    <select
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value)}
      className="px-3 py-2 border border-gray-600 bg-gray-900 text-gray-300 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="ja">Japanese</option>
    </select>
  </div>

  {/* Audio Controls */}
  <div className="flex items-center space-x-4">
    <button
      onClick={generateAudio}
      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:bg-blue-500 active:bg-blue-700 focus:ring-2 focus:ring-blue-400"
    >
      🎙 Generate Audio
    </button>

    {audioUrls[selectedLanguage] && (
      <audio
        controls
        src={audioUrls[selectedLanguage]}
        className="w-48 h-10 bg-gray-900 rounded-lg shadow-md"
      />
    )}
  </div>
</div>


        <div className="bg-gray-800/50 rounded-2xl p-8 text-center mb-10 border border-gray-700/50 shadow-lg">
  <h3 className="text-2xl font-semibold text-blue-400 uppercase tracking-wide">Matchup</h3>
  <div className="mt-4 flex flex-col items-center space-y-2">
    <p className="text-gray-300 text-lg">
      <span className="font-bold text-blue-300">{article.team_away}</span>
      <span className="text-gray-400 mx-2">vs.</span>
      <span className="font-bold text-purple-300">{article.team_home}</span>
    </p>
    <p className="text-gray-400 text-sm bg-gray-900/50 px-4 py-2 rounded-lg inline-block mt-3 border border-gray-700/50">
      <span className="text-blue-400 font-medium">Game Date:</span> {article.game_date}
    </p>
  </div>
</div>


        <article className="bg-gray-800/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-700/50">
          <div className="p-8">
            <div className="mb-8 border-b border-gray-700/50 pb-8">
              <h1 className="text-4xl text-center font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-0">
                {translatedArticle.title}
              </h1>
            </div>

            <div className="space-y-8 text-justify">
              {translatedArticle.sections.map((section, index) => (
                <div key={index} className="group hover:bg-gray-700/30 p-6 rounded-xl transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                    {section.heading}
                  </h2>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-justify bg-gray-700/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Highlights Video Links</h3>
                <ul className="space-y-3">
                  {article.links.map((link, index) =>
                    Object.entries(link).map(([title, url], subIndex) => (
                      <li key={`${index}-${subIndex}`} className="group flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-300 transition-colors duration-300"></span>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                          {title}
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              </div>

             <div className="mt-12 text-justify p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
               <p className="text-gray-300 italic font-medium leading-relaxed">
                 {translatedArticle.conclusion}
               </p>
             </div>
          </div>
          
          
        </article>
      </div>
    </div>
  );
};

export default Article;
