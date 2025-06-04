// src/components/UserHeader.jsx
import React, { Suspense } from "react";
import { motion } from "@motionone/react";
import TopSubGenre from "./ui/TopSubGenre";

function UserHeader({ userState, genresData }) {
  if (!userState) return null;

  return (
    <div className="flex flex-col items-center text-center mb-3 space-y-0.5">
      <motion.img
        src={userState.profile_picture || ""}
        className="w-24 h-24 object-cover rounded-full shadow-md"
        loading="lazy"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <motion.h1
        className="text-2xl font-bold"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {userState.display_name || "John Doe"}
      </motion.h1>

      {userState.user_id && (
        <motion.a
          href={`https://open.spotify.com/user/${userState.user_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base text-gray-500 dark:text-gray-400 font-medium"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          @{userState.user_id}
        </motion.a>
      )}

      <Suspense fallback={null}>
        {genresData && <TopSubGenre genreData={genresData} />}
      </Suspense>
    </div>
  );
}

export default UserHeader;