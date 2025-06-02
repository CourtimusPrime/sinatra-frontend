import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingSteps from "../components/OnboardingSteps";
import { apiGet, apiPost } from "../utils/api";
import { motion } from "@motionone/react";
import "../styles/onboard.css";
import { applyRootThemeVars } from "../utils/theme";

function Onboard() {
  const navigate = useNavigate();

  const [spotifyUser, setSpotifyUser] = useState(null);
  const [step, setStep] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [log, setLog] = useState("");
  const [onboardData, setOnboardData] = useState({
    display_name: "",
    profile_picture: "",
    selected_playlists: [],
    featured_playlists: [],
  });

  // Theme init
  useEffect(() => {
    const html = document.documentElement;
    const applyTheme = (theme) => {
      html.classList.toggle("dark", theme === "dark");
      applyRootThemeVars(theme);
    };

    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }

    const systemListener = window.matchMedia("(prefers-color-scheme: dark)");
    const systemThemeHandler = (e) => {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    systemListener.addEventListener("change", systemThemeHandler);
    return () => systemListener.removeEventListener("change", systemThemeHandler);
  }, []);

  // Load user + genre data
  useEffect(() => {
    const init = async () => {
      try {
        const user_id = new URLSearchParams(window.location.search).get("user_id");
        if (!user_id) throw new Error("Missing user_id in URL");

        const spotifyRes = await apiGet(`/spotify-me?user_id=${user_id}`);

        setSpotifyUser(spotifyRes);
        setOnboardData((prev) => ({
          ...prev,
          user_id,
          display_name: spotifyRes.display_name,
          profile_picture: spotifyRes.images?.[0]?.url || "",
        }));
      } catch (err) {
        setLog("Error during onboarding init.");
        console.error("Onboarding init error:", err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    // Reset canProceed to false on every step change
    setCanProceed(false);
  }, [step]);

  const handleNext = () => {
    if (step > 0 && !canProceed) return;

    if (step < 4) {
      setStep(step + 1);
    } else {
      apiPost("/register", onboardData)
      .then(async () => {
        const dash = await apiGet(`/dashboard?user_id=${onboardData.user_id}`);
        localStorage.setItem("user", JSON.stringify(dash.user));
        localStorage.setItem("genres_data", JSON.stringify(dash.user.genre_analysis || {}));
        localStorage.setItem("featured_playlists", JSON.stringify(dash.playlists.featured || []));
        localStorage.setItem("all_playlists", JSON.stringify(dash.playlists.all || []));
        if (dash.played_track?.track) {
          localStorage.setItem("last_played_track", JSON.stringify(dash.played_track.track));
          localStorage.setItem("last_played_updated_at", new Date().toISOString());
        }
        localStorage.setItem("last_init_home", new Date().toISOString());
        navigate("/home");
      });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="onboard-container flex flex-col min-h-screen">
      {/* Sticky Top Progress Bar (now part of page layout) */}
      <div className="sticky-progress z-10">
        {/* If your progress bar is part of OnboardingSteps, no need to add anything here */}
        {/* If it's separate, you could add: <ProgressBar step={step} /> */}
      </div>

      {/* Scrollable content */}
      <div className="onboard-content flex-1 overflow-y-auto">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <OnboardingSteps
            step={step}
            user={spotifyUser}
            onboardData={onboardData}
            setOnboardData={setOnboardData}
            setCanProceed={setCanProceed}
          />
        </motion.div>
      </div>

      {/* Sticky Footer */}
      <div className="onboard-footer sticky bottom-0 bg-white dark:bg-black shadow z-10 p-4 flex justify-between">
        <button
          onClick={handleBack}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${
            step === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          }`}
          disabled={step === 0}
        >
          Go Back
        </button>
        <button
          onClick={handleNext}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${
            step === 0 || canProceed
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={step !== 0 && !canProceed}
        >
          {step < 4 ? "Next" : "Finish"}
        </button>
      </div>

      {log && <div className="onboard-log">{log}</div>}
    </div>
  );
}

export default Onboard;