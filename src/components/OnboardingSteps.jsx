// src/components/OnboardingSteps.jsx
import React, { useEffect } from "react";
import { motion } from "@motionone/react";
import NameEditor from "./steps/NameEditor";
import PictureEditor from "./steps/PictureEditor";
import GenreIntro from "./steps/GenreIntro";
import PlaylistImporter from "./steps/PlaylistImporter";
import FeaturedPicker from "./steps/FeaturedPicker";
import FinalizeAccount from "./steps/FinalizeAccount";

const totalSteps = 6;

function OnboardingSteps({ step, user, genres, onboardData, setOnboardData, setCanProceed }) {
  const sharedProps = { user, genres, onboardData, setOnboardData, setCanProceed };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <GenreIntro {...sharedProps} />;
      case 1:
        return <NameEditor {...sharedProps} />;
      case 2:
        return <PictureEditor {...sharedProps} />;
      case 3:
        return <PlaylistImporter {...sharedProps} />;
      case 4:
        return <FeaturedPicker {...sharedProps} />;
      case 5:
        return <FinalizeAccount {...sharedProps} />;
      default:
        return <div className="text-center text-red-600">Invalid step</div>;
    }
  };

  const progressPercent = ((step + 1) / totalSteps) * 100;

  return (
    <div className="onboard-wrapper">
      <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="onboard-step-content">
        {renderStep()}
      </div>
    </div>
  );
}

export default OnboardingSteps;