import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constant/Colors";

export default function CourseListGrid({ courseList, option }) {
  const router = useRouter();

  const onPress = (course) => {
    router.push({
      pathname: option.path,
      params: {
        courseParams: JSON.stringify(course),
      },
    });
  };
  return (
    <View>
      <FlatList
        data={courseList}
        numColumns={2}
        style={{
          padding: 20,
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPress(item)}
            key={index}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 15,
              backgroundColor: Colors.WHITE,
              margin: 7,
              borderRadius: 15,
              elevation: 5,
              borderWidth: 1.5,
              borderColor: Colors.LANDING,
            }}
          >
            <AntDesign
              name="checkcircle"
              size={20}
              color={Colors.GRAY}
              style={{
                position: "absolute",
                top: 10,
                right: 15,
              }}
            />
            <Image
              source={option?.icon}
              style={{
                width: "100%",
                height: 80,
                objectFit: "contain",
              }}
            />
            <Text
              style={{
                fontFamily: "manrope",
                textAlign: "center",
                marginTop: 7,
              }}
              numberOfLines={2}
            >
              {item.courseTitle}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
