import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";
import * as Progress from "react-native-progress";

export default function CourseProgressCard({ item, width = 280 }) {
  const GetCompletedChapters = (course) => {
    const completedChapter = course?.completedChapter?.length;
    const perc = completedChapter / course?.chapters?.length;
    return perc;
  };
  return (
    <View
      style={{
        margin: 7,
        padding: 5,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: Colors.BG_GRAY,
        width: width,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
        }}
      >
        <Image
          source={imageAssets[item?.banner_image]}
          style={{
            width: 60,
            height: 60,
            borderRadius: 8,
          }}
        />
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontFamily: "manropebold",
              fontSize: 17,
              flexWrap: "wrap",
            }}
          >
            {item?.courseTitle}
          </Text>
          <Text
            style={{
              fontFamily: "manrope",
              fontSize: 15,
            }}
          >
            {item?.chapters?.length} Chapters
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 10,
        }}
      >
        <Progress.Bar
          progress={GetCompletedChapters(item)}
          width={width - 30}
        />
        <Text
          style={{
            fontFamily: "manrope",
            marginTop: 2,
          }}
        >
          {item?.completedChapter?.length || 0} Out of {item.chapters?.length}{" "}
          Chapter Completed
        </Text>
      </View>
    </View>
  );
}
