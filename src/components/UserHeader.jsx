import React, { Suspense } from "react";
import { motion } from "@motionone/react";
import TopSubGenre from "./ui/TopSubGenre";

function UserHeader({ userState, genresData }) {
  if (!userState) return null;

  return (
    <div className="flex flex-col items-center space-y-1 mb-4">
      <motion.img
        src={userState.profile_picture || ""}
        alt="Profile"
        className="w-24 h-24 object-cover rounded-full mb-2"
        loading="lazy"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <motion.h1
        className="text-2xl font-bold text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {userState.display_name || "Sgt. Pepper"}
      </motion.h1>

      <motion.a
        href={`https://open.spotify.com/user/${userState.user_id || ""}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg text-gray-500 font-bold text-center block"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {userState.user_id ? "@" + userState.user_id : ""}
      </motion.a>

      <Suspense fallback={null}>
        {userState?.user_id && <TopSubGenre user_id={userState.user_id} />}
      </Suspense>
    </div>
  );
}

export default UserHeader;