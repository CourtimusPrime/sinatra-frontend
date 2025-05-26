// src/App.jsx
import React, { lazy, Suspense, useEffect } from "react";
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
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    // Check for saved preference; otherwise fallback to system
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else if (saved === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-[var(--font)] transition-colors duration-300">
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