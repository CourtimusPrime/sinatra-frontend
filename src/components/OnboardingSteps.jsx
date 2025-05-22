// src/components/OnboardingSteps.jsx
import React, { useEffect } from "react";
import NameEditor from "./steps/NameEditor";
import PictureEditor from "./steps/PictureEditor";
import GenreIntro from "./steps/GenreIntro";
import PlaylistImporter from "./steps/PlaylistImporter";
import FeaturedPicker from "./steps/FeaturedPicker";
import FinalizeAccount from "./steps/FinalizeAccount";

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

  return <div className="p-4 sm:p-6 lg:p-8">{renderStep()}</div>;
}

export default OnboardingSteps;