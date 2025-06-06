import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../../components/Shared/Button";
import {
  GenerateCourseAImodel,
  GenerateTopicsAImodel,
} from "../../config/AiModel";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import Prompt from "../../constant/Prompt";
import { UserDetailContext } from "./../../context/UserDetailContext";

const funFacts = [
  "Did you know? The first computer bug was an actual moth found in a computer!",
  "AI can learn from experience without being explicitly programmed for every task.",
  "JavaScript was created in just 10 days by Brendan Eich in 1995.",
  "The first 1GB hard drive was announced in 1980 and weighed over 500 pounds!",
  "Python is named after 'Monty Python's Flying Circus', not the snake.",
  "Machine learning is a subset of AI focusing on data-driven learning.",
  "The famous 'Hello World' program originated in 1972 in Brian Kernighan's tutorial.",
  "Deep learning uses neural networks inspired by the human brain.",
  "The first website is still online — info.cern.ch — created in 1991.",
  "Email predates the World Wide Web, invented in 1971 by Ray Tomlinson.",
  "More than 90% of the world’s data has been created in the last two years.",
  "The QWERTY keyboard was designed to slow typing to prevent jamming on old typewriters.",
  "Google processes over 3.5 billion searches per day worldwide.",
  "Over 80% of the internet traffic comes from bots, not humans.",
  "The first computer virus was created in 1983 and was called 'Elk Cloner'.",
  "The term 'debugging' was popularized by Grace Hopper when she found a moth in a computer.",
];


export default function AddCourse() {
  const { topic } = useLocalSearchParams();
  const router = useRouter();

  const initialInput = topic ? topic.replace(/^Learn\s*/i, "") : "";

  const [userInput, setUserInput] = useState(initialInput);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userDetail } = useContext(UserDetailContext);

  // Separate loading for course generation so modal triggers only on course generation
  const [courseLoading, setCourseLoading] = useState(false);

  // Fun fact index for modal
  const [factIndex, setFactIndex] = useState(0);

  // Rotate fun fact every 5 seconds while courseLoading is true
  useEffect(() => {
    if (courseLoading) {
      const interval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % funFacts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [courseLoading]);

  const onGenerateTopic = async () => {
    if (!userInput?.trim()) {
      console.warn("Please enter a topic before generating.");
      return;
    }

    setLoading(true);
    try {
      const promptText = `Learn ${userInput.trim()}`;
      const PROMPT = promptText + Prompt.IDEA;

      const aiResp = await GenerateTopicsAImodel.sendMessage(PROMPT);
      const text = await aiResp.response.text();
      const topicIdea = JSON.parse(text);

      console.log("Topics generated:", topicIdea);
      setTopics(topicIdea?.course_titles || []);
    } catch (error) {
      console.error("Failed to generate topics:", error);
      alert("Error generating topics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onTopicSelect = (topic) => {
    const isAlreadyExist = selectedTopic.find((item) => item === topic);
    if (!isAlreadyExist) {
      setSelectedTopics((prev) => [...prev, topic]);
    } else {
      const filtered = selectedTopic.filter((item) => item !== topic);
      setSelectedTopics(filtered);
    }
  };

  const isTopicSelected = (topic) => {
    return selectedTopic.includes(topic);
  };

  const onGenerateCourse = async () => {
    if (selectedTopic.length === 0) {
      alert("Please select at least one topic first!");
      return;
    }

    try {
      setCourseLoading(true);

      const selectedTopicsText = selectedTopic.join(", ");
      const finalPrompt = `
${Prompt.COURSE}

Use these specific topics as chapters: ${selectedTopicsText}.
Each selected topic must be treated as one individual chapter.
Do not skip any selected topic.
Chapter titles must match exactly with selected topics.
Provide detailed explanations with examples for each topic.
`;

      const aiResp = await GenerateCourseAImodel.sendMessage(finalPrompt);
      const rawText = await aiResp.response.text();

      if (!rawText || rawText.trim() === "") {
        throw new Error("Empty AI response");
      }

      let resp;
      try {
        resp = JSON.parse(rawText);
      } catch (err) {
        console.error("Invalid JSON from AI:", rawText);
        throw new Error("Failed to parse AI response");
      }

      const courses = resp.courses;
      if (!Array.isArray(courses) || courses.length === 0) {
        throw new Error("No courses returned from AI.");
      }

      for (const course of courses) {
        const docId = Date.now().toString() + Math.floor(Math.random() * 1000);

        await setDoc(doc(db, "Courses", docId), {
          ...course,
          createdOn: new Date(),
          createdBy: userDetail?.email ?? "",
          docId: docId,
        });

        const publicDocId = docId + "-public";
        await setDoc(doc(db, "PublicCourses", publicDocId), {
          ...course,
          createdOn: new Date(),
          enrollments: 0,
          docId: publicDocId,
        });
      }

      router.push("/(tabs)/home");
    } catch (e) {
      console.error("Error generating course:", e);
      alert("Something went wrong while generating the course.");
    } finally {
      setCourseLoading(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            padding: 25,
            backgroundColor: Colors.WHITE,
            flex: 1,
          }}
        >
          <Text
            style={{
              fontFamily: "manropebold",
              fontSize: 30,
            }}
          >
            Create New Course
          </Text>
          <Text
            style={{
              fontFamily: "manrope",
              fontSize: 25,
            }}
          >
            What you want to learn today?
          </Text>

          <Text
            style={{
              fontFamily: "manrope",
              fontSize: 20,
              marginTop: 8,
              color: Colors.GRAY,
            }}
          >
            Your knowledge, your way! Start with a topic (Ex., Python, Machine
            Learning Guide, Digital Marketing Guide, etc.)
          </Text>

          <View style={{ position: "relative", marginTop: 10 }}>
            <Text
              style={{
                position: "absolute",
                top: 18,
                left: 20,
                fontSize: 18,
                color: Colors.GRAY,
              }}
            >
              Learn
            </Text>
            <TextInput
              placeholder="Python, Marketing, etc."
              style={[styles.textInput, { paddingLeft: 70 }]}
              numberOfLines={3}
              multiline={true}
              value={userInput}
              onChangeText={(value) => setUserInput(value)}
            />
          </View>

          <Button
            text={
              loading ? <ActivityIndicator color={Colors.WHITE} /> : "Generate"
            }
            type="fill"
            onPress={onGenerateTopic}
            disabled={loading || courseLoading}
          />

          <View
            style={{
              marginTop: 10,
              marginBottom: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "manrope",
                fontSize: 20,
              }}
            >
              Select all topics which you want to add in the Course
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 6,
              }}
            >
              {topics.map((item, index) => (
                <Pressable key={index} onPress={() => onTopicSelect(item)}>
                  <Text
                    style={{
                      padding: 7,
                      borderWidth: 1,
                      borderRadius: 99,
                      paddingHorizontal: 15,
                      borderColor: Colors.LANDING,
                      backgroundColor: isTopicSelected(item)
                        ? Colors.LANDING
                        : null,
                      color: isTopicSelected(item)
                        ? Colors.WHITE
                        : Colors.LANDING,
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {selectedTopic?.length > 0 && (
            <Button
              text={
                courseLoading ? (
                  <ActivityIndicator color={Colors.WHITE} />
                ) : (
                  "Generate Course"
                )
              }
              onPress={onGenerateCourse}
              disabled={loading || courseLoading}
            />
          )}
        </View>
      </ScrollView>

      {/* Modal showing during course generation */}
      <Modal
        transparent
        visible={courseLoading}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={Colors.LANDING} />
            <Text style={styles.modalText}>
              Please wait, your course is being generated...
            </Text>
            <Text
              style={[styles.modalText, { fontStyle: "italic", marginTop: 10 }]}
            >
              {funFacts[factIndex]}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.LANDING,
    height: 100,
    marginTop: 10,
    fontSize: 18,
    textAlignVertical: "top", // for multiline to align text at top on Android
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "manrope",
    textAlign: "center",
    marginTop: 15,
    color: Colors.GRAY,
  },
});
