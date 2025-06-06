import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Auto-redirect modal after sign up
export function SuccessModal({ visible, onClose, onLoginPress }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onLoginPress();
      }, 4000); // auto redirect after 4 sec
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Success</Text>
          <Text style={styles.modalMessage}>
            Account created successfully!{`\n`}Redirecting to login...
          </Text>
          <TouchableOpacity onPress={onLoginPress} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Modal to display Terms or Privacy Policy from Firestore
export function TermsPrivacyModal({ visible, onClose, type }) {
  const [content, setContent] = useState("Loading...");

  useEffect(() => {
    if (visible) {
      fetchPolicy();
    }
  }, [visible, type]);

  async function fetchPolicy() {
    try {
      const db = getFirestore();
      const docRef = doc(db, "legal", "terms_and_policies");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setContent(type === "terms" ? data.terms : data.privacy);
      } else {
        setContent("Document not found.");
      }
    } catch (error) {
      setContent("Failed to load content.");
      console.error("Error fetching legal document:", error);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalBox, { maxHeight: "80%" }]}>
          <ScrollView contentContainerStyle={{ padding: 15 }}>
            <Text style={styles.modalMessage}>{content}</Text>
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
