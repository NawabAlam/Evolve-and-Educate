import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import { imageAssets } from "../../constant/Option";
import Colors from "../../constant/Colors";
import CourseProgressCard from "../Shared/CourseProgressCard";

export default function CourseProgress({ courseList }) {
  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <Text
        style={{
          fontFamily: "manropebold",
          fontSize: 25,
        }}
      >
        Progress
      </Text>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={courseList}
        renderItem={({ item, index }) => (
          <View key={index}>
            <CourseProgressCard item={item} />
          </View>
        )}
      />
    </View>
  );
}
