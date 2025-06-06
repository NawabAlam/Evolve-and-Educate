import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function QuestionAnswer() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const qaList = course?.qa;
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState();
  const OnQuestionSelect = (index) => {
    if (selectedQuestion == index) {
      setSelectedQuestion(null);
    } else {
      setSelectedQuestion(index);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={{
          height: 800,
          width: "100%",
          position: "absolute",
        }}
      />
      <View style={{ flex: 1, padding: 20, marginTop: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 7,
            alignItems: "center",
            marginBottom: 10,
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
        </View>
        <Text
          style={{
            fontFamily: "manropebold",
            fontSize: 28,
            color: Colors.WHITE,
          }}
        >
          Question & Answers
        </Text>

        <Text
          style={{
            fontFamily: "manrope",
            fontSize: 20,
            color: Colors.WHITE,
            marginBottom: 10,
          }}
        >
          {course?.courseTitle}
        </Text>

        <FlatList
          data={qaList}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item, index }) => (
            <Pressable
              style={styles?.card}
              onPress={() => OnQuestionSelect(index)}
            >
              <Text style={{ fontFamily: "manropebold", fontSize: 17 }}>
                Q{index + 1}. {item?.question}
              </Text>
              {selectedQuestion == index && (
                <View
                  style={{
                    borderTopWidth: 0.4,
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: "manropebold",
                      fontSize: 16,
                    }}
                  >
                    Answer:{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "manrope",
                      fontSize: 16,
                      color: Colors.PURPLE,
                    }}
                  >
                    {item?.answer}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.LGREEN,
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    elevation: 3,
  },
});