import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Form from "./components/Form";
import Article from "./components/Article";
import FilteredArticles from "./components/FilteredArticles";

const UnauthenticatedRoutes = ({ setIsAuthenticated }) => (
  <Routes>
    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
    <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

const AuthenticatedRoutes = ({ setArticle, article }) => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/form" element={<Form setArticle={setArticle} />} />
    <Route path="/article/:id" element={<Article/>} />
    <Route path="/article/filter" element={<FilteredArticles/>} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [article, setArticle] = useState(null);

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const isTokenExpired = tokenPayload.exp * 1000 < Date.now();
      if (isTokenExpired) {
        localStorage.removeItem("token"); // Clear expired token
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    }
  }, []);

  return (
    <Router>
      {isAuthenticated ? (
        <AuthenticatedRoutes setArticle={setArticle} article={article} />
      ) : (
        <UnauthenticatedRoutes setIsAuthenticated={setIsAuthenticated} />
      )}
    </Router>
  );
};

export default App;