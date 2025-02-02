import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Form from "./components/Form";
import Article from "./components/Article";
import FilteredArticles from "./components/FilteredArticles";
import CreateArticle from "./components/CreateArticle";
import Dashboard from "./components/Dashboard";

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
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/createarticle" element={<CreateArticle />} />
    <Route path="/form" element={<Form setArticle={setArticle} />} />
    <Route path="/article/:id" element={<Article />} />
    <Route path="/article/filter" element={<FilteredArticles />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const App = () => {
  const [article, setArticle] = useState(null);
  // ✅ Step 1: Initialize authentication state from localStorage before the first render
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      return tokenPayload.exp * 1000 > Date.now(); // Check expiration
    } catch (error) {
      return false;
    }
  });

  // ✅ Step 2: Check the token again on mount to ensure correctness
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        const isTokenExpired = tokenPayload.exp * 1000 < Date.now();
        if (isTokenExpired) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
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
