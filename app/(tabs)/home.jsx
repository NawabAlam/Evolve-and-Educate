import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CourseList from "../../components/Home/CourseList";
import CourseProgress from "../../components/Home/CourseProgress";
import Header from "../../components/Home/Header";
import NoCourse from "../../components/Home/NoCourse";
import PracticeSection from "../../components/Home/PracticeSection";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import { checkAndStartUpdate } from "../../utils/inAppUpdate";
import Colors from "./../../constant/Colors";
import { useUpdatePopup } from "./../../utils/useUpdatePopup";


export default function Home() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);

  useUpdatePopup(); // Custom hook to show update popup
  useEffect(() => {
     checkAndStartUpdate();
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
                {/* ✅ Add Course Button */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 20,
                    padding: 12,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: Colors.LANDING,
                    backgroundColor: "#f0f8ff",
                  }}
                  onPress={() => router.push("/addCourse")}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color={Colors.LANDING}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.LANDING,
                      fontFamily: "manropebold",
                    }}
                  >
                    Add Course
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}
