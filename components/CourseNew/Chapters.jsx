import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import Colors from "../../constant/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function Chapters({ course }) {
  const router = useRouter();

  const isChapterCompleted = (index) => {
    const isCompleted = course?.completedChapter?.find((item) => item == index);
    return isCompleted ? true : false;
  };
  return (
    <View
      style={{
        padding: 3,
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontFamily: "manropebold",
        }}
      >
        Chapters
      </Text>

      <FlatList
        data={course?.chapters}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/chapterView",
                params: {
                  chapterParams: JSON.stringify(item),
                  docId: course?.docId,
                  chapterIndex: index,
                },
              });
            }}
            style={{
              padding: 10,
              borderWidth: 1.5,
              borderRadius: 15,
              marginTop: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderColor: Colors.LANDING,
              backgroundColor: Colors.WHITE,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                flexShrink: 1,
                maxWidth: "85%",
              }}
            >
              <Text style={styles.chapterText}>{index + 1}.</Text>
              <Text
                style={[styles.chapterText, { flexShrink: 1 }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item?.chapterName}
              </Text>
            </View>
            {isChapterCompleted(index) ? (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.GREEN}
                numberOfLines={3}
              />
            ) : (
              <FontAwesome5 name="play" size={20} color={Colors.GRAY} />
            )}
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <View height={Dimensions.get("screen").height * 0.07} />
        } // Prevents extra space
        contentContainerStyle={{ paddingBottom: 10 }} // Adds some space without overflow
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chapterText: {
    fontFamily: "manrope",
    fontSize: 18,
  },
});
