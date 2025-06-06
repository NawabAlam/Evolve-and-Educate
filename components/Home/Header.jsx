import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { UserDetailContext } from "./../../context/UserDetailContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from "./../../constant/Colors";
import { useRouter } from "expo-router"; // Make sure to import this

export default function Header() {

    const router = useRouter();
  
    const goToProfile = () => {
      router.push("/(tabs)/profile");  // Replace with the actual path to your profile screen
    };

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
      <View>
        <Text
          style={{
            fontFamily: "manropebold",
            fontSize: 25,
            
          }}
        >
          Hello, {userDetail?.name}
        </Text>
        <Text
          style={{
            fontFamily: "manrope",
            fontSize: 18,
            color: Colors.WHITE
          }}
        >
          Let's Get Started
        </Text>
      </View>
      <TouchableOpacity onPress={goToProfile}>
      <Ionicons name="settings-outline" size={30} color='black' />
      </TouchableOpacity>
    </View>
  );
}
