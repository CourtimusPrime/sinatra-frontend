// src/components/ShareButton.jsx
import React, { useState } from "react";
import { ClipboardCopy } from "lucide-react";

export default function ShareButton({ userId }) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://sinatra.live/u/${userId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm hover:opacity-80 transition-all"
    >
      <ClipboardCopy className="w-4 h-4" />
      {copied ? "Copied!" : "Share your page"}
    </button>
  );
}