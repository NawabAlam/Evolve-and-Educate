import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import NoCourse from "../../components/Home/NoCourse";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import { imageAssets } from "../../constant/Option";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function MyCourses() {
  const { userDetail } = useContext(UserDetailContext);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userDetail?.email) {
      fetchUserCourses();
    }
  }, [userDetail]);

  const fetchUserCourses = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "Courses"),
        where("createdBy", "==", userDetail.email)
      );
      const querySnapshot = await getDocs(q);
      const fetchedCourses = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }));
      setMyCourses(fetchedCourses);
    } catch (error) {
      console.error("Error fetching user's courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/courseView/" + item?.docId,
          params: {
            courseParams: JSON.stringify(item),
            enroll: false,
          },
        })
      }
      style={{
        padding: 10,
        backgroundColor: Colors.BG_GRAY,
        marginVertical: 10,
        borderRadius: 15,
      }}
    >
      <Image
        source={imageAssets[item.banner_image]}
        style={{
          width: "100%",
          height: 150,
          borderRadius: 15,
        }}
      />
      <Text
        style={{
          fontFamily: "manropebold",
          fontSize: 14,
          marginTop: 10,
        }}
      >
        {item?.courseTitle}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <Ionicons name="book-outline" size={20} color="black" />
        <Text
          style={{
            fontFamily: "manrope",
            marginLeft: 5,
          }}
        >
          {item?.chapters?.length} Chapters
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <Image
        source={require("./../../assets/images/wave.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: 400,
        }}
      />
      <View
        style={{
          padding: 20,
          paddingTop: Platform.OS === "ios" ? 45 : 20,
          flex: 1,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ alignSelf: "flex-start" }}
        >
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color="black"
            style={{
              backgroundColor: Colors.WHITE,
              marginTop: 10,
              padding: 7,
              borderRadius: 10,
              elevation: 3, // subtle shadow for Android
              shadowColor: "#000", // subtle shadow for iOS
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
            }}
          />
        </Pressable>
        
        <Text
          style={{
            fontFamily: "manropebold",
            fontSize: 25,
            marginVertical: 10,
          }}
        >
          My Courses
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.LANDING} />
        ) : myCourses.length === 0 ? (
          <NoCourse message="You haven't created any courses yet." />
        ) : (
          <FlatList
            data={myCourses}
            keyExtractor={(item) => item.docId}
            renderItem={renderCourseItem}
            onRefresh={fetchUserCourses}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
