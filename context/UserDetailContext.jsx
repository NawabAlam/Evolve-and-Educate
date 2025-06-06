import { onAuthStateChanged, updateProfile } from "firebase/auth"; // Import auth listener and updateProfile
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig"; // Import firebase auth

// Create the context
export const UserDetailContext = createContext();

export const UserDetailProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null); // State for user info

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDetail({
          email: user.email,
          uid: user.uid,
          profileImage: user.photoURL, // from Firebase Auth user profile
        });
      } else {
        setUserDetail(null); // User logged out
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Helper to update Firebase Auth profile image when needed
  const updateUserProfileImage = async (url) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { photoURL: url });
        // Also update local context state so UI updates
        setUserDetail((prev) => ({ ...prev, profileImage: url }));
      } catch (error) {
        console.log("Failed to update auth profile image:", error);
      }
    }
  };

  return (
    <UserDetailContext.Provider
      value={{ userDetail, setUserDetail, updateUserProfileImage }}
    >
      {children}
    </UserDetailContext.Provider>
  );
};
