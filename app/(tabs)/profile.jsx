import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db, storage } from "../../config/firebaseConfig"; // storage added in firebaseConfig
import Colors from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Profile() {
  const { userDetail, setUserDetail, updateUserProfileImage } = useContext(UserDetailContext);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserDetail(null);
      router.replace("/auth/signIn");
    } catch (error) {
      console.log("Logout Error:", error.message);
      Alert.alert("Logout Error", error.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, userDetail?.email);
      Alert.alert(
        "Reset Email Sent",
        "Please check your email to reset your password."
      );
    } catch (error) {
      console.log("Password Reset Error:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  const pickImage = async () => {
    try {
      console.log("Profile image clicked");

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Permission to access media library is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      console.log(result);

      if (!result.canceled) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Image Picker Error:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = userDetail?.email.replace(/[@.]/g, "_") + ".jpg";
      const storageRef = ref(storage, `profileImages/${filename}`);

      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore
      const userDocRef = doc(db, "users", userDetail.email);
      await updateDoc(userDocRef, { profileImage: downloadURL });

      // Update Firebase Auth + Context
      await updateUserProfileImage(downloadURL);

      Alert.alert("Success", "Profile image updated successfully!");
    } catch (error) {
      console.log("Image Upload Error:", error.message);
      Alert.alert("Upload Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          onPress={pickImage}
          disabled={uploading}
          style={styles.imageTouchable}
        >
          <Image
            source={
              userDetail?.profileImage
                ? { uri: userDetail.profileImage }
                : require("../../assets/images/logo.png")
            }
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <Ionicons name="pencil" size={20} color={Colors.WHITE} />
          </View>

          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color={Colors.LANDING} />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.name}>{userDetail?.name}</Text>
        <Text style={styles.email}>{userDetail?.email}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/addCourse")}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.LANDING}
          />
          <Text style={styles.menuText}>Add Course</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/progress")}
        >
          <MaterialIcons name="menu-book" size={24} color={Colors.LANDING} />
          <Text style={styles.menuText}>My Course</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/progress")}
        >
          <Ionicons
            name="trending-up-outline"
            size={24}
            color={Colors.LANDING}
          />
          <Text style={styles.menuText}>Course Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handlePasswordReset}>
          <Ionicons name="key-outline" size={24} color={Colors.LANDING} />
          <Text style={styles.menuText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.RED} />
          <Text style={[styles.menuText, { color: Colors.RED }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontFamily: "manropebold",
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  imageTouchable: {
    width: 120,
    height: 120,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: Colors.LANDING,
    borderRadius: 12,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    fontFamily: "manropebold",
  },
  email: {
    fontSize: 16,
    color: "gray",
    fontFamily: "manrope",
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    gap: 15,
  },
  menuText: {
    fontSize: 18,
    fontFamily: "manrope",
    color: Colors.BLACK,
  },
});
