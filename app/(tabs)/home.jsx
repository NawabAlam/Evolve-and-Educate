import { View, Text, Platform, FlatList, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Home/Header";
import Colors from "./../../constant/Colors";
import NoCourse from "../../components/Home/NoCourse";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import CourseList from "../../components/Home/CourseList";
import PracticeSection from "../../components/Home/PracticeSection";
import CourseProgress from "../../components/Home/CourseProgress";

export default function Home() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);

    // Query for courses where user is the creator (createdBy)
    const createdByQuery = query(
      collection(db, "Courses"),
      where("createdBy", "==", userDetail?.email)
    );

    // Query for courses where user is enrolled (enrolledUserEmail)
    const enrolledByQuery = query(
      collection(db, "Courses"),
      where("enrolledUserEmail", "==", userDetail?.email)
    );

    try {
      // Fetch courses created by the current user
      const createdBySnapshot = await getDocs(createdByQuery);
      createdBySnapshot.forEach((doc) => {
        setCourseList((prev) => [...prev, doc.data()]);
      });

      // Fetch courses where the current user is enrolled
      const enrolledBySnapshot = await getDocs(enrolledByQuery);
      enrolledBySnapshot.forEach((doc) => {
        setCourseList((prev) => [...prev, doc.data()]);
      });
    } catch (error) {
      console.error("Error fetching courses: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={courseList} // Now, display the courses fetched from both queries
      style={{ flex: 1, backgroundColor: Colors.WHITE }}
      contentContainerStyle={{ flexGrow: 1 }}
      onRefresh={() => GetCourseList()}
      refreshing={loading}
      ListHeaderComponent={
        <View style={{ flexGrow: 1, backgroundColor: Colors.WHITE }}>
          <Image
            source={require("./../../assets/images/wave.png")}
            style={{
              position: "absolute",
              width: "100%",
              height: 400,
            }}
          />
          <View style={{ padding: 20, paddingTop: Platform.OS == "ios" && 45 }}>
            <Header />

            {courseList?.length == 0 ? (
              <NoCourse />
            ) : (
              <View>
                <CourseProgress courseList={courseList} />
                <PracticeSection />
                <CourseList courseList={courseList} />
              </View>
            )}
          </View>
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}
