import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setUserDetail } = useContext(UserDetailContext);

  const onSignInClick = async () => {
    if (!email || !password) {
      ToastAndroid.show("Please enter email and password", ToastAndroid.BOTTOM);
      return;
    }
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", email));
      if (!userDoc.exists()) {
        Alert.alert(
          "User Not Registered",
          "No account found with this email. Do you want to sign up?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Up", onPress: () => router.push("/auth/signUp") },
          ]
        );
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      await getUserDetail();
      ToastAndroid.show("Sign-in Successful!", ToastAndroid.BOTTOM);
      router.replace("/(tabs)/home");
    } catch (e) {
      if (e.code === "auth/wrong-password") {
        ToastAndroid.show("Incorrect Password", ToastAndroid.BOTTOM);
      } else if (e.code === "auth/invalid-email") {
        ToastAndroid.show("Invalid Email Format", ToastAndroid.BOTTOM);
      } else {
        ToastAndroid.show("Error: " + e.message, ToastAndroid.BOTTOM);
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserDetail = async () => {
    const result = await getDoc(doc(db, "users", email));
    setUserDetail(result.data());
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        onChangeText={setEmail}
        style={styles.textInput}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={[styles.textInput, styles.passwordInput]}
        />
        <Pressable
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeIcon}
        >
          <Text>{passwordVisible ? "👁" : "👁‍🗨"}</Text>
        </Pressable>
      </View>

      <TouchableOpacity
        onPress={onSignInClick}
        style={styles.signInButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.WHITE} />
        ) : (
          <Text style={styles.signInText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomRow}>
        <Text style={styles.linkText}>Ready to evolve?</Text>
        <Pressable onPress={() => router.push("/auth/signUp")}>
          <Text style={styles.linkButton}>Sign Up Here</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    paddingTop: 100,
    flex: 1,
    padding: 25,
    backgroundColor: Colors.WHITE,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 30,
    fontFamily: "manropebold",
  },
  textInput: {
    borderWidth: 1,
    width: "100%",
    padding: 15,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 35,
  },
  signInButton: {
    padding: 15,
    backgroundColor: Colors.LANDING,
    width: "100%",
    marginTop: 25,
    borderRadius: 10,
    elevation: 3,
    display: "flex",
    alignItems: "center",
  },
  signInText: {
    fontFamily: "manrope",
    fontSize: 20,
    color: Colors.WHITE,
    textAlign: "center",
  },
  bottomRow: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
  },
  linkText: {
    fontFamily: "manrope",
  },
  linkButton: {
    color: Colors.LANDING,
    fontFamily: "manropebold",
    textDecorationLine: "underline",
  },
});
