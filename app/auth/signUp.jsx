import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import Colors from "./../../constant/Colors";

import {
  SuccessModal,
  TermsPrivacyModal,
} from "./../../components/Terms & Services/ModalPopup";

export default function SignUp() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [termsPrivacyModalVisible, setTermsPrivacyModalVisible] =
    useState(false);
  const [modalType, setModalType] = useState("terms");

  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");

  const { setUserDetail } = useContext(UserDetailContext);

  useEffect(() => {
    const fetchLegalContent = async () => {
      try {
        const docRef = doc(db, "legal", "terms_and_policies");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTermsContent(data.terms || "No Terms & Conditions found.");
          setPrivacyContent(data.privacy || "No Privacy Policy found.");
        } else {
          console.warn("No such document found for legal terms.");
        }
      } catch (err) {
        console.error("Error fetching terms and privacy:", err.message);
      }
    };

    fetchLegalContent();
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const CreateNewAccount = async () => {
    if (!email || !password || !fullName) {
      alert("All fields are required!");
      return;
    }
    if (!isValidEmail(email)) {
      alert("Invalid email format!");
      return;
    }

    setIsLoading(true);

    try {
      const resp = await createUserWithEmailAndPassword(auth, email, password);
      const user = resp.user;
      await SaveUser(user);
      setSuccessModalVisible(true);
    } catch (e) {
      alert(
        e.code === "auth/email-already-in-use"
          ? "This email is already registered. Please sign in."
          : e.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const SaveUser = async (user) => {
    const data = {
      name: fullName,
      email: email,
      member: false,
      uid: user?.uid,
    };
    await setDoc(doc(db, "users", email), data);
    setUserDetail(data);
    console.log("User data saved to Firestore");
  };

  const handleRedirect = () => {
    setSuccessModalVisible(false);
    clearForm();
    router.push("/auth/signIn");
  };

  const clearForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: 100,
        flex: 1,
        padding: 25,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../../assets/images/logo.png")}
        style={{
          width: 180,
          height: 180,
        }}
      />

      <Text
        style={{
          fontSize: 30,
          fontFamily: "manropebold",
        }}
      >
        Create New Account
      </Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor= {Colors.LANDING}
        value={fullName}
        onChangeText={setFullName}
        style={styles.textInput}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor= {Colors.LANDING}
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor= {Colors.LANDING}
          value={password}
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

      <Text style={{ marginTop: 15, textAlign: "center", fontSize: 14 }}>
        By continuing, you agree to our{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            setModalType("terms");
            setTermsPrivacyModalVisible(true);
          }}
        >
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            setModalType("privacy");
            setTermsPrivacyModalVisible(true);
          }}
        >
          Privacy Policy
        </Text>
        .
      </Text>

      <TouchableOpacity
        onPress={CreateNewAccount}
        style={{
          padding: 15,
          backgroundColor: isLoading ? "#999" : Colors.LANDING,
          width: "100%",
          marginTop: 25,
          borderRadius: 10,
          elevation: 3,
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={{
              fontFamily: "manrope",
              fontSize: 20,
              color: Colors.WHITE,
              textAlign: "center",
            }}
          >
            Create Account
          </Text>
        )}
      </TouchableOpacity>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          marginTop: 20,
        }}
      >
        <Text style={{ fontFamily: "manrope" }}>You've been here before!</Text>
        <Pressable onPress={() => router.push("/auth/signIn")}>
          <Text style={{ color: Colors.LANDING, fontFamily: "manropebold" }}>
            Sign In Here
          </Text>
        </Pressable>
      </View>

      {/* Modals */}
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        onLoginPress={handleRedirect}
      />

      <TermsPrivacyModal
        visible={termsPrivacyModalVisible}
        onClose={() => setTermsPrivacyModalVisible(false)}
        type={modalType}
        termsContent={termsContent}
        privacyContent={privacyContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
