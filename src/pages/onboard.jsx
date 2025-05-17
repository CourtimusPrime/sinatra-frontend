// src/pages/onboard.jsx
import React from "react";
import { useEffect, useState } from "react";
import OnboardingSteps from "../components/OnboardingSteps";

function Onboard() {
  const [user_id, setUserId] = useState(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("user_id");
    localStorage.setItem("user_id", id);
    setUserId(id);
  }, []);

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <div className="max-w-md w-full mx-auto p-4">
        {user_id ? <OnboardingSteps user_id={user_id} /> : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default Onboard;
