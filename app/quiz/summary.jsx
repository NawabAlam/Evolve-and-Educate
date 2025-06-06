import { View, Text, Image, StyleSheet, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import Button from "../../components/Shared/Button";


export default function QuizSummary() {
  const { quizResultParam } = useLocalSearchParams();
  const quizResult = JSON.parse(quizResultParam);
  const [correctAns, setCorrectAns] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const router = useRouter();
  // const [quizResult, setQuizResult]= useState();
  // useEffect (()=>{
  //    quizResultParam&& setQuizResult(JSON.parse(quizResult))
  // },[quizResultParam])

  useEffect(() => {
    console.log(quizResult);
    quizResult && CalculateResult();
  }, [quizResult]);

  const CalculateResult = () => {
    if (quizResult !== undefined) {
      const correctAns_ = Object.entries(quizResult)?.filter(
        ([Key, value]) => value?.isCorrect == true
      );
      //console.log(correctAns);
      const totalQues_ = Object.keys(quizResult).length;

      setCorrectAns(correctAns_.length);
      setTotalQuestion(totalQues_);
    }
  };

  const GetPercMark = () => {
    return ((correctAns / totalQuestion) * 100).toFixed(0);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Image
            source={require("./../../assets/images/wave.png")}
            style={{
              width: "100%",
              height: 700,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: "100%",
              padding: 35,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 30,
                fontFamily: "manropebold",
                color: Colors.WHITE,
              }}
            >
              Quiz Summary
            </Text>
            <View
              style={{
                backgroundColor: Colors.WHITE,
                padding: 20,
                borderRadius: 20,
                marginTop: 60,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Image
                source={require("./../../assets/images/trophy.png")}
                style={{
                  transform: [{ rotate: "-20deg" }],
                  width: 100,
                  height: 100,
                  marginTop: -60,
                }}
              />
              <Text
                style={{
                  fontFamily: "manropebold",
                  fontSize: 25,
                  color: GetPercMark() > 60 ? Colors.GREEN : Colors.BLACK, // Change color based on score
                }}
              >
                {GetPercMark() > 60 ? "Congratulations!" : "Try Again!"}
              </Text>
              <Text
                style={{
                  fontFamily: "manrope",
                  color: GetPercMark() > 60 ? Colors.GREEN : Colors.BLACK,
                  fontSize: 17,
                }}
              >
                You Gave {GetPercMark()}% Correct Answers.
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultText}>Q {totalQuestion}</Text>
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultText}> ✅ {correctAns} </Text>
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultText}>
                    {" "}
                    ❌ {totalQuestion - correctAns}
                  </Text>
                </View>
              </View>
            </View>
            <Button
              text={"Back To Home"}
              onPress={() => router.replace("/(tabs)/home")}
            />

            <View
              style={{
                marginTop: 25,
                flex: 1,
              }}
            >
              <Text style={{ fontFamily: "manropebold", fontSize: 25 }}>
                Summary :
              </Text>
              <FlatList
                data={Object.entries(quizResult)}
                keyExtractor={(item, index) => index.toString()}
                nestedScrollEnabled
                style={{ maxHeight: 300 }} 
                renderItem={({ item,  index }) => {
                  const quizItem = item[1]; //Access The Actual Quiz
                  return (
                    <View
                      style={{
                        padding: 15,
                        borderWidth: 1,
                        marginTop: 5,
                        borderRadius: 15,
                        backgroundColor:
                          quizItem?.isCorrect == true
                            ? Colors.LGREEN
                            : Colors.LRED,
                            
                        borderColor:
                          quizItem?.isCorrect == true
                            ? Colors.GREEN
                            : Colors.RED,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "manrope",
                          fontSize: 17,
                        }}
                      >
                        {quizItem.question}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "manrope",
                          fontSize: 15,
                          marginTop: 5,
                          color: Colors.BLACK
                        }}
                      >
                        Ans : {quizItem?.correctAns}
                      </Text>

                      {!quizItem?.isCorrect && (
                        <Text
                          style={{
                            fontFamily: "manropebold",
                            fontSize: 15,
                            marginTop: 5,
                            color: Colors.WHITE,
                          }}
                        >
                        Your Choice: {quizItem?.userChoice}
                        </Text>
                      )}
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  resultTextContainer: {
    padding: 15,
    marginLeft: 10,
    backgroundColor: Colors.WHITE,
    elevation: 5,
    borderRadius: 15,
    borderColor: Colors.DARKP,
    borderWidth: 1,
  },
  resultText: {
    fontFamily: "manropebold",
    fontSize: 15,
  },
});
