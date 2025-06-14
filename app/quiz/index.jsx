import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import Button from "./../../components/Shared/Button";

export default function Quiz() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const quiz = course?.quiz;
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [result, setResult] = useState([]);
  const GetProgress = (currentPage) => {
    const perc = (currentPage + 1) / quiz?.length;
    return perc;
  };

  const OnOptionSelect = (selectedChoice) => {
    setResult((prev) => ({
      ...prev,
      [currentPage]: {
        userChoice: selectedChoice,
        isCorrect: quiz[currentPage]?.correctAns == selectedChoice,
        question: quiz[currentPage]?.question,
        correctAns: quiz[currentPage]?.correctAns,
      },
    }));
    console.log(result);
  };

  const onQuizFinish = async () => {
    setLoading(true);

    // Ensure result is updated before proceeding
  const updatedResult = {
    ...result,
    [currentPage]: {
      userChoice: selectedOption,
      isCorrect: quiz[currentPage]?.correctAns == selectedOption,
      question: quiz[currentPage]?.question,
      correctAns: quiz[currentPage]?.correctAns,
    },
  };
  setResult(updatedResult); // Update state
    // Save the result ion database for quiz
    try {
      await updateDoc(doc(db, "Courses", course?.docId), {
        quizResult:  updatedResult,
      });
      setLoading(false);

      router.replace({
        pathname: "/quiz/summary",
        params: {
          quizResultParam: JSON.stringify(updatedResult),
        },
      });
    } catch (e) {
      console.error("Error updating quiz result:", e);
      setLoading(false);
    }
    // Redirect user to quiz summary
  };

  return (
    <View>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={{
          height: 800,
          width: "100%",
        }}
      />
      <View
        style={{
          position: "absolute",
          padding: 25,
          width: "100%",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color="black"
              style={{
                backgroundColor: Colors.WHITE,
                padding: 7,
                borderRadius: 10,
              }}
            />
          </Pressable>
          <Text
            style={{
              fontFamily: "manropebold",
              fontSize: 25,
              color: Colors.WHITE,
            }}
          >
            {currentPage + 1} of {quiz?.length}
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
          }}
        >
          <Progress.Bar
            progress={GetProgress(currentPage)}
            width={Dimensions.get("screen").width * 0.85}
            color={Colors.WHITE}
          />
        </View>
        <View
          style={{
            padding: 25,
            backgroundColor: Colors.WHITE,
            marginTop: 30,
            height: Dimensions.get("screen").height * 0.65,
            elevation: 2,
            borderRadius: 15,
            borderWidth: 2,
            borderBlockColor: Colors.DARKP,
          }}
        >
          <Text
            style={{
              fontFamily: "manropebold",
              fontSize: 25,
              textAlign: "center",
            }}
          >
            {quiz[currentPage]?.question}
          </Text>

          {quiz[currentPage]?.options.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedOption(index);
                OnOptionSelect(item);
              }}
              key={index}
              style={{
                padding: 15,
                borderWidth: 1,
                borderRadius: 15,
                backgroundColor: selectedOption == index ? Colors.LGREEN : null,
                borderColor:
                  selectedOption == index ? Colors.GREEN : Colors.BLACK,
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "manrope",
                  fontSize: 15,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedOption?.toString() && quiz?.length - 1 > currentPage && (
          <Button
            text={"Next"}
            onPress={() => {
              setCurrentPage(currentPage + 1);
              setSelectedOption(null);
            }}
          />
        )}
        {selectedOption?.toString() && quiz?.length - 1 == currentPage && (
          <Button
            text="Finish"
            loading={loading}
            onPress={() => onQuizFinish()}
          />
        )}
      </View>
    </View>
  );
}
