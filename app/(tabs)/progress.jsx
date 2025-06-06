import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import CourseProgressCard from "../../components/Shared/CourseProgressCard";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Progress() {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);
    const q = query(
      collection(db, "Courses"),
      where("createdBy", "==", userDetail?.email),
      orderBy("createdOn", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnap) => {
      setCourseList((prev) => [...prev, docSnap.data()]);
    });
    setLoading(false);
  };

  const renderFooter = () => {
    if (courseList.length < 3) {
      return (
        <View
          style={{
            marginTop: 20,
            padding: 20,
            backgroundColor: Colors.LRED,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 250,
          }}
        >
          <Image
            source={require("./../../assets/images/trophy.png")}
            style={{
              width: 150,
              height: 150,
              marginBottom: 15,
              resizeMode: "contain",
            }}
          />
          <Text
            style={{
              fontFamily: "manropebold",
              fontSize: 18,
              color: Colors.BLACK,
              marginBottom: 5,
            }}
          >
            Keep Going!
          </Text>
          <Text
            style={{
              fontFamily: "manrope",
              fontSize: 16,
              color: Colors.WHITE,
              textAlign: "center",
            }}
          >
            “Your journey has just begun. Explore more courses to keep the momentum going!”
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.PRIMARY,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
              marginTop: 15,
            }}
            onPress={() => route.push("/explore")}
          >
            <Text
              style={{
                backgroundColor: Colors.WHITE,
                color: Colors.BLACK,
                fontFamily: "manropebold",
                fontSize: 16,
                borderRadius: 10,
                borderWidth: 2,
                padding: 5,
              }}
            >
              Explore More Courses
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      {/* Background wave */}
      <Image
        source={require("./../../assets/images/wave.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: 700,
        }}
      />

      {/* Heading */}
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontFamily: "manropebold",
            fontSize: 30,
            color: Colors.WHITE,
            marginBottom: 10,
          }}
        >
          Course Progress
        </Text>
      </View>

      {/* Scrollable Course List */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        data={courseList}
        showsVerticalScrollIndicator={false}
        onRefresh={() => GetCourseList()}
        refreshing={loading}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              route.push({
                pathname: "/courseView/" + item?.docId,
                params: {
                  courseParams: JSON.stringify(item),
                },
              })
            }
          >
            <CourseProgressCard item={item} width={"95%"} />
          </TouchableOpacity>
        )}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
}
