// src/pages/onboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingSteps from "../components/OnboardingSteps";
import { apiGet, apiPost } from "../utils/api";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/onboard.css";

function Onboard() {
  const navigate = useNavigate();

  const [spotifyUser, setSpotifyUser] = useState(null);
  const [genreData, setGenreData] = useState(null);
  const [step, setStep] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [log, setLog] = useState("");
  const [onboardData, setOnboardData] = useState({
    display_name: "",
    profile_picture: "",
    selected_playlists: [],
    featured_playlists: [],
  });

  useEffect(() => {
    const init = async () => {
      try {
        const user_id = new URLSearchParams(window.location.search).get("user_id");
        if (!user_id) throw new Error("Missing user_id in URL");

        const spotifyRes = await apiGet(`/spotify-me?user_id=${user_id}`);
        const genreRes = await apiGet(`/genres?user_id=${user_id}`);

        setSpotifyUser(spotifyRes);
        setGenreData(genreRes);
        setOnboardData((prev) => ({
          ...prev,
          user_id,
          display_name: spotifyRes.display_name,
          profile_picture: spotifyRes.images?.[1]?.url || "",
        }));
      } catch (err) {
        setLog("Error during onboarding init.");
        console.error("Onboarding init error:", err);
      }
    };
    init();
  }, []);

  const handleNext = () => {
    if (!canProceed) return;

    if (step < 4) {
      setStep(step + 1);
    } else {
      setLog("Submitting account to MongoDB...");
      apiPost("/register", onboardData)
        .then(() => {
          setLog("Success. Redirecting to home...");
          navigate("/home");
        })
        .catch((err) => {
          setLog("Registration failed.");
          console.error("Register POST failed:", err);
        });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="onboard-container">
      <div className="onboard-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <OnboardingSteps
              step={step}
              user={spotifyUser}
              genres={genreData}
              onboardData={onboardData}
              setOnboardData={setOnboardData}
              setCanProceed={setCanProceed}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="onboard-footer">
        <button
          onClick={handleBack}
          className="text-gray-500 hover:text-black"
          disabled={step === 0}
        >
          Go Back
        </button>
        <button
          onClick={handleNext}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${
            canProceed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!canProceed}
        >
          {step < 4 ? "Next" : "Finish"}
        </button>
      </div>
      {log && <div className="onboard-log">{log}</div>}
    </div>
  );
}

export default Onboard;
