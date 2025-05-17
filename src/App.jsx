// src/App.jsx
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { fetchMetaGenres } from "./utils/metaGenres";

const Home = lazy(() => import("./pages/home.jsx"));
const Onboard = lazy(() => import("./pages/onboard.jsx"));
const Playlists = lazy(() => import("./pages/playlists.jsx"));
const Landing = lazy(() => import("./pages/landing.jsx"));
const PublicView = lazy(() => import("./pages/public.jsx"));
const Callback = lazy(() => import("./pages/Callback.jsx"));

function App() {
  const { background, font, textColor } = useTheme();

  const [bgStyle, setBgStyle] = useState("");
  const [fontStyle, setFontStyle] = useState("");
  const [textColorClass, setTextColorClass] = useState("");

  useEffect(() => {
    fetchMetaGenres(); // preload shared schema once
  }, []);

  useEffect(() => {
    setBgStyle(background || "bg-white");
    setFontStyle(font || "font-sans");
    setTextColorClass(textColor || "text-gray-900");
  }, [background, font, textColor]);

  return (
    <div className={`min-h-screen ${bgStyle} ${fontStyle} ${textColorClass}`}>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/user/:user_id" element={<PublicView />} />
            <Route path="/onboard" element={<Onboard />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;