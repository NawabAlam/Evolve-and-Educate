import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
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

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setUserDetail } = useContext(UserDetailContext);

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "605360201897-jrj4ctcgon2itbgq6np4k4a2fb237mrh.apps.googleusercontent.com",
    androidClientId:
      "605360201897-odt52d31pi5rl1e3fpn4ej0hiuushjqh.apps.googleusercontent.com",
    iosClientId:
      "605360201897-vnj34r462s7q0hv8i1r8mbekiniievv3.apps.googleusercontent.com",
    webClientId:
      "605360201897-9r0gtddpk2mv6gt7ik13ijn7lcll79k9.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  });

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === "success") {
      const id_token =
        response.authentication?.idToken || response.authentication?.id_token;

      if (!id_token) {
        ToastAndroid.show("Google sign-in failed: Missing ID token", ToastAndroid.BOTTOM);
        console.error("Missing id_token in response.authentication:", response.authentication);
        return;
      }

      const credential = GoogleAuthProvider.credential(id_token);
      handleGoogleSignIn(credential);
    }
  }, [response]);

  const handleGoogleSignIn = async (credential) => {
    setLoading(true);
    try {
      const result = await signInWithCredential(auth, credential);
      const userEmail = result.user.email;

      const userRef = doc(db, "users", userEmail);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: userEmail,
          name: result.user.displayName || "",
          photoURL: result.user.photoURL || "",
          createdAt: new Date(),
        });
      }

      const updatedSnap = await getDoc(userRef);
      setUserDetail(updatedSnap.data());
      ToastAndroid.show("Google Sign-in Successful!", ToastAndroid.BOTTOM);
      router.replace("/(tabs)/home");
    } catch (err) {
      ToastAndroid.show("Google Sign-in failed", ToastAndroid.BOTTOM);
      console.error("Google Sign-in error:", err);
    } finally {
      setLoading(false);
    }
  };

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

  // Custom Google Button styled similar to official button
  const GoogleSignInButton = () => (
    <TouchableOpacity
      disabled={!request || loading}
      onPress={() => promptAsync()}
      style={styles.googleButton}
    >
      <Image
        source={require("../../assets/images/google_logo.png")} // Add a Google logo png in your assets folder
        style={styles.googleLogo}
      />
      <Text style={styles.googleButtonText}>Sign In with Google</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={styles.textInput}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={[styles.textInput, styles.passwordInput]}
        />
        <Pressable onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <Text>{passwordVisible ? "👁" : "👁‍🗨"}</Text>
        </Pressable>
      </View>

      <TouchableOpacity onPress={onSignInClick} style={styles.signInButton} disabled={loading}>
        {loading ? <ActivityIndicator color={Colors.WHITE} /> : <Text style={styles.signInText}>Sign In</Text>}
      </TouchableOpacity>

      <GoogleSignInButton />

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
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: "#4285F4",
    borderRadius: 5,
    width: "100%",
    marginTop: 15,
    elevation: 3,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#4285F4",
    fontSize: 16,
    fontWeight: "600",
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
