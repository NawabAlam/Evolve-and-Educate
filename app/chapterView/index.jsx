import { View, Text, Dimensions, ScrollView } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Progress from "react-native-progress";
import Colors from "../../constant/Colors";
import Button from "./../../components/Shared/Button";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "./../../config/firebaseConfig";

export default function ChapterView() {
  const { chapterParams, docId, chapterIndex } = useLocalSearchParams();
  const chapters = JSON.parse(chapterParams);
  const [currentPage, setCurrentPage] = useState(0);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  // Calculate the progress of the chapter based on the current slide
  const GetProgress = (currentPage) => {
    const perc = (currentPage / chapters?.content?.length);
    return perc;
  };

  // Mark the chapter as complete and save to Firebase
  const onChapterComplete = async () => {
    setLoader(true);
    try {
      // Save the chapter completion in Firebase
      await updateDoc(doc(db, 'Courses', docId), {
        completedChapter: arrayUnion(chapterIndex), // Add the current chapter to completed chapters
      });
      // After updating, redirect the user to the course view
      router.replace('/courseView/' + docId);
    } catch (error) {
      console.error("Error completing chapter: ", error);
      alert("There was an issue marking the chapter as completed.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={{ 
      padding: 25, 
      backgroundColor: Colors.WHITE, 
      flex: 1 
      }}>
      {/* Progress Bar */}
      <Progress.Bar
        progress={GetProgress(currentPage)}
        width={Dimensions.get("screen").width * 0.85}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text
          style={{ 
            fontFamily: "manropebold", 
            fontSize: 23, 
            marginBottom: 10 
          }}
        >
          {chapters?.content[currentPage]?.topic}
        </Text>
        <Text style={{ 
          fontFamily: "manrope", 
          fontSize: 20, 
          marginTop: 7 
        }}>
          {chapters?.content[currentPage]?.explain}
        </Text>

        {/* Display code if available */}
        {chapters?.content[currentPage]?.code && (
          <Text
            style={[
              { 
                backgroundColor: Colors.BLACK, 
                color: Colors.WHITE,
                padding: 15,
                borderRadius: 15,
                fontFamily: "manrope",
                fontSize: 18,
                marginTop: 15,
              }
            ]}
          >
            {chapters?.content[currentPage]?.code}
          </Text>
        )}

        {/* Display example if available */}
        {chapters?.content[currentPage]?.example && (
          <Text style={styles.codeExampleText}>
            {chapters?.content[currentPage]?.example}
          </Text>
        )}
      </ScrollView>

      <View style={{ 
        justifyContent: "flex-end", 
        marginTop: 20 
      }}>
        {/* Show "Next" button if there are more slides, otherwise show "Finish" */}
        {chapters?.content?.length - 1 !== currentPage ? (
          <Button
            text={"Next"}
            onPress={() => setCurrentPage(currentPage + 1)} // Move to next slide
          />
        ) : (
          <Button
            text={"Finish"}
            onPress={onChapterComplete} // Finish chapter and update Firebase
            loading={loader}
          />
        )}
      </View>
    </View>
  );
}

const styles = {
  codeExampleText: {
    padding: 15,
    backgroundColor: Colors.BG_GRAY,
    borderRadius: 15,
    fontFamily: "manrope",
    fontSize: 18,
    marginTop: 15,
  },
};
