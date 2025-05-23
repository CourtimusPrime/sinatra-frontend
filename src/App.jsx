// src/App.jsx
import React, { lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/home.jsx"));
const Onboard = lazy(() => import("./pages/onboard.jsx"));
const Landing = lazy(() => import("./pages/landing.jsx"));
const PublicProfile = lazy(() => import("./pages/public.jsx"));
const Callback = lazy(() => import("./pages/Callback.jsx"));
const NotFound = lazy(() => import("./pages/404.jsx"));

function App() {
  const [bgStyle, setBgStyle] = useState("");
  const [fontStyle, setFontStyle] = useState("");
  const [textColorClass, setTextColorClass] = useState("");

  return (
    <div className={`min-h-screen ${bgStyle} ${fontStyle} ${textColorClass}`}>
      <Suspense fallback={<Loader />}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/onboard" element={<Onboard />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/u/:user_id" element={<PublicProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;