import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";
import Button from "./../../components/Shared/Button";
import { UserDetailContext } from "./../../context/UserDetailContext";

export default function Intro({ course }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const route = useRouter();

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);

  useEffect(() => {
    const backAction = () => {
      route.push("/(tabs)/home");
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [route]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!course?.docId || !userDetail?.email) return;

      const courseRef = doc(db, "Courses", course?.docId);
      const courseSnapshot = await getDoc(courseRef);

      if (courseSnapshot.exists()) {
        const courseData = courseSnapshot.data();
        if (
          courseData.createdBy === userDetail?.email ||
          courseData.enrolledUserEmail === userDetail?.email
        ) {
          setIsEnrolled(true);
        }
      }
    };
    checkEnrollment();
  }, [course, userDetail]);

  const onEnrollCourse = async () => {
    setLoading(true);

    if (!userDetail?.email) {
      alert("User email is not available. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      const newDocId = Date.now().toString(); // Unique ID

      // Fetch course from PublicCourses
      const publicCourseRef = doc(db, "PublicCourses", course?.docId);
      const publicCourseSnapshot = await getDoc(publicCourseRef);

      if (publicCourseSnapshot.exists()) {
        const courseData = publicCourseSnapshot.data();

        const enrolledCourseData = {
          ...courseData,
          createdOn: new Date(),
          enrolled: true,
          enrolledUserEmail: userDetail?.email,
          completedChapter: [],
        };

        // Save into Courses collection
        await setDoc(doc(db, "Courses", newDocId), enrolledCourseData);

        setIsEnrolled(true);

        // ✅ Show success popup and navigate to home
        Alert.alert(
          "Enrollment Successful!",
          "You have successfully enrolled in the course.",
          [
            {
              text: "OK",
              onPress: () => route.push("/(tabs)/home"),
            },
          ],
          { cancelable: false }
        );
      } else {
        console.error("Course not found in PublicCourses.");
        alert("Course not found in PublicCourses.");
      }
    } catch (error) {
      console.error("Error enrolling course: ", error);
      alert("There was an error enrolling in the course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onStartCourse = () => {
    route.push(`/courseView/${course?.docId}`);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const toggleTitle = () => {
    setShowFullTitle(!showFullTitle);
  };

  const renderDescription = () => {
    if (showFullDescription || course?.description?.length <= 200) {
      return course?.description;
    }
    return `${course?.description?.substring(0, 140)}...`;
  };

  const renderTitle = () => {
    if (showFullTitle || course?.courseTitle?.length <= 40) {
      return course?.courseTitle;
    }
    return `${course?.courseTitle?.substring(0, 40)}...`;
  };

  return (
    <View>
      <Image
        source={imageAssets[course?.banner_image]}
        style={{
          width: "100%",
          height: 280,
        }}
      />
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "manropebold",
              fontSize: 22,
              color: Colors.LANDING,
              flex: 1,
            }}
            numberOfLines={showFullTitle ? undefined : 1}
            ellipsizeMode="tail"
          >
            {renderTitle()}
          </Text>
          {course?.courseTitle?.length > 40 && (
            <TouchableOpacity onPress={toggleTitle}>
              <Text style={{ marginLeft: 10 }}>
                {showFullTitle ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <Ionicons name="book-outline" size={20} color="black" />
          <Text
            style={{
              fontFamily: "manrope",
              fontSize: 18,
            }}
          >
            {course?.chapters?.length} Chapters
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "manropebold",
            fontSize: 20,
            marginTop: 10,
          }}
        >
          Description:
        </Text>

        <Text
          style={{
            fontFamily: "manrope",
            fontSize: 15,
            color: Colors.GRAY,
          }}
        >
          {renderDescription()}
        </Text>

        {course?.description?.length > 200 && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={{ color: Colors.LANDING, marginTop: 5 }}>
              {showFullDescription ? "Read Less" : "Read More"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Button Section */}
        {isEnrolled ? (
          <Button text="Start Now" onPress={onStartCourse} />
        ) : (
          <Button
            text="Enroll Now"
            loading={loading}
            onPress={onEnrollCourse}
          />
        )}
      </View>

      <Pressable
        style={{
          position: "absolute",
          padding: 10,
        }}
        onPress={() => route.push("/(tabs)/home")}
      >
        <Ionicons 
        style={{ marginTop: 10 }}
        name="arrow-back" size={25} color="black" />
      </Pressable>
    </View>
  );
}
