import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { imageAssets, PraticeOption } from "../../../constant/Option";
import Colors from "../../../constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./../../../config/firebaseConfig";
import { UserDetailContext } from "./../../../context/UserDetailContext";
import CourseListGrid from './../../../components/PracticeScreen/CourseListGrid'

export default function PracticeTypeHomeScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const option = PraticeOption.find((item) => item.name == type);
  console.log(option);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true); 
    setCourseList([]);
    try {
      const q = query(
        collection(db, "Courses"),
        where("createdBy", "==", userDetail?.email),
        orderBy("createdOn", "desc"));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
       // console.log(doc.data());
        setCourseList((prev) => [...prev, doc.data()]);
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  return (
    <View>
      <Image
        source={option.image}
        style={{
          height: 200,
          width: "100%",
        }}
      />
      <View
        style={{
          position: "absolute",
          padding: 10,
          display: "flex",
          flexDirection: "row",
          gap: 10,
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
            fontSize: 35,
            color: Colors.WHITE,
          }}
        >
          {type}
        </Text>
      </View>
      {loading && (
        <ActivityIndicator
          size="large"
          style={{
            marginTop: 150,
          }}
          color={Colors.LANDING}
        />
      )}
      <CourseListGrid courseList={courseList}
      option={option}
      />
    </View>
  );
}
