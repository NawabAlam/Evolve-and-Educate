import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Alert } from "react-native";

const UPDATE_MESSAGE_KEY = "update-v3.0.0"; // Change this for each version

export const useUpdatePopup = () => {
  useEffect(() => {
    const showUpdateMessage = async () => {
      const alreadyShown = await AsyncStorage.getItem(UPDATE_MESSAGE_KEY);
      if (!alreadyShown) {
        Alert.alert(
          "What’s New",
          `➕ Add Course Button on Main Screen:
A new Add Course button has been added to the home screen for faster and easier access to course creation.

📚 My Courses in Profile Section:
Users can now view all the courses they’ve generated directly from their Profile.

🧹 Data Deletion Option:
Users can request deletion of their personal data directly from the Profile section.

🔔 In-App Update Popup:
Users will be notified via an in-app popup whenever a new app version is available.

🔐 Enhanced Privacy & User Control:
Providing better tools for users to manage their data.

🛠️ Bug Fixes & Performance Improvements:
Minor fixes and optimizations to improve overall app stability and experience.

Note:
This is our first public release, and we're continuously improving the app.
If you experience any issues or have suggestions, please contact us at nawabmohammad83@gmail.com.`,
          [{ text: "OK" }]
        );

        await AsyncStorage.setItem(UPDATE_MESSAGE_KEY, "true");
      }
    };

    showUpdateMessage();
  }, []);
};
