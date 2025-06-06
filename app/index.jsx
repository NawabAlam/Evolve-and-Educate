import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constant/Colors";
import { auth, db } from "./../config/firebaseConfig";

export default function Index() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);
  const [checkingAuth, setCheckingAuth] = useState(true); // 🔄 Loader flag

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const result = await getDoc(doc(db, "users", user.email));
          if (result.exists()) {
            setUserDetail(result.data());
          }
          router.replace("/(tabs)/home");
        } catch (error) {
          console.error("Failed to fetch user detail:", error);
          setCheckingAuth(false);
        }
      } else {
        setCheckingAuth(false); // ✅ No user, show landing screen
      }
    });

    return unsubscribe;
  }, []);

  if (checkingAuth) {
    // 🔃 Show loading spinner during auth check
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.LANDING} />
        <Text style={{ marginTop: 15, fontSize: 16 }}>Checking auth...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <Image
        source={require("./../assets/images/Landing Screen.png")}
        style={styles.image}
      />

      <View style={styles.innerContainer}>
        <Text style={styles.titleText}>
          Welcome To{"\n"}Evolve & Educate
        </Text>

        <Text style={styles.subtitleText}>
          Break free from traditional learning {"\n"}Customized courses at your
          fingertips 📚✨.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/signUp")}
        >
          <Text style={[styles.buttonText, { color: Colors.LANDING }]}>
            Get Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/signIn")}
          style={[styles.button, styles.signInButton]}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
            You've been here before!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  image: {
    width: "100%",
    height: 300,
    marginTop: 70,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  innerContainer: {
    padding: 25,
    backgroundColor: Colors.LANDING,
    height: "100%",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  titleText: {
    fontSize: 30,
    textAlign: "center",
    color: Colors.WHITE,
    fontFamily: "manropebold",
  },
  subtitleText: {
    fontSize: 20,
    color: Colors.WHITE,
    textAlign: "center",
    fontFamily: "manrope",
  },
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10,
  },
  signInButton: {
    backgroundColor: Colors.LANDING,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "manrope",
  },
});
