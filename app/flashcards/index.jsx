import {
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
import FlipCard from "react-native-flip-card";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";

export default function Flashcards() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const flashcard = course?.flashcards;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const width = Dimensions.get("screen").width;
  console.log(flashcard);
  const GetProgress = (currentPage) => {
    const perc = (currentPage + 1) / flashcard?.length;
    return perc;
  };

  const onScroll = (event) => {
    const index = Math.round(event?.nativeEvent?.contentOffset.x / width);
    console.log(index);
    setCurrentPage(index);
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
          padding: 25, //was 25
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
            {currentPage + 1} of {flashcard?.length}
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
        <FlatList
          data={flashcard}
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          keyExtractor={(_, index) => index.toString()}
          snapToAlignment="center" // changed: snap items to center
          decelerationRate="fast" // changed: faster scroll stop for snapping
          getItemLayout={(data, index) => ({
            length: Dimensions.get("screen").width, // changed: match card width
            offset: Dimensions.get("screen").width * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{
                height: 500,
                marginTop: 60,
                width: Dimensions.get("screen").width, // changed: full width card container
                alignItems: "center",
                justifyContent: "center", // changed: center FlipCard vertically
              }}
            >
              <FlipCard style={styles.flipCard}>
                {/* Face Side */}
                <View style={styles.frontCard}>
                  <Text
                    style={{
                      fontFamily: "manropebold",
                      fontSize: 28,
                    }}
                  >
                    {item?.front}
                  </Text>
                </View>
                {/* Back Side */}
                <LinearGradient
                  colors={["#ffffff", "#ff66cc", "#cc00ff"]} // purple gradient
                  style={styles.backCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text
                    style={{
                      fontFamily: "manrope",
                      width: Dimensions.get("screen").width * 0.78,
                      padding: 20,
                      textAlign: "center",
                      color: Colors.WHITE,
                      fontSize: 25,
                    }}
                  >
                    {item?.back}
                  </Text>
                </LinearGradient>
              </FlipCard>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flipCard: {
    width: Dimensions.get("screen").width * 0.78,
    height: 400,
    backgroundColor: Colors.WHITE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 2,               // 🔥 Border thickness
    borderColor: Colors.BLACK,       // 🔥 Black border
    overflow: "hidden", 
    marginHorizontal: Dimensions.get("screen").width * 0.05,
  },
  frontCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: 20,
    
  },
  backCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: Colors.LANDING,
    borderRadius: 20,
    
    
  },
});
