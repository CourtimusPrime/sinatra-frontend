// src/components/steps/NameEditor.jsx
import React, { useState, useEffect } from "react";

function NameEditor({ user, onboardData, setOnboardData, setCanProceed }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(onboardData.display_name || user?.display_name || "");

  useEffect(() => {
    setCanProceed(name.trim().length > 0);
  }, [name]);

  const handleChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    setOnboardData((prev) => ({ ...prev, display_name: newName }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">We like the name "{user?.display_name || "friend"}".</h2>
      <h2 className="text-3xl font-bold">Do you?</h2>
      <p className="text-gray-700">Want to change the name you go by on Sinatra?</p>

      {!editing ? (
        <button
          className="text-blue-600 underline"
          onClick={() => setEditing(true)}
        >
          Let's change it
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={handleChange}
            placeholder="Enter your new display name"
            className="w-full p-2 border rounded-lg"
          />
          <p className="text-sm text-gray-500">This name will appear on your public profile.</p>
        </div>
      )}
    </div>
  );
}

export default NameEditor;