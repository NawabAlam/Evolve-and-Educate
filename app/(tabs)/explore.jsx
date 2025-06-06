import { View, Text, FlatList } from "react-native";
import React from "react";
import Colors from "./../../constant/Colors";
import { CourseCategory } from "../../constant/Option";
import CourseListByCategory from "../../components/Explore/CourseListByCategory";

export default function Explore() {
  return (
    <FlatList data={[]}
    style={{
      flex: 1,
      backgroundColor: Colors.WHITE
    }}
    ListHeaderComponent={
    <View
      style={{
        padding: 25,
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Text
        style={{
          fontFamily: "manropebold",
          fontSize: 25,
        }}
      >
        Explore More Courses
      </Text>

      {CourseCategory.map((item, index) => (
        <View key={index} style={{
          marginTop: 10
        }}>
        { /* <Text
            style={{
              fontFamily: "manropebold",
              fontSize: 20
            }}
          >
            {item}
          </Text>*/}
          <CourseListByCategory category={item} />
        </View>
      ))}
    </View>} />
  );
}
