import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import Colors from "../../constant/Colors";

export default function Button({ text, type = "fill", onPress, loading = false }) {
  return (
    <TouchableOpacity
      onPress={loading ? null : onPress} // Disable button when loading
      style={{
        padding: 15,
        width: "100%",
        borderRadius: 15,
        marginTop: 15,
        borderWidth: 1,
        borderColor: Colors.LANDING,
        backgroundColor: type == "fill" ? Colors.LANDING : Colors.WHITE,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      {loading ? (
        <ActivityIndicator color={type == "fill" ? Colors.WHITE : Colors.LANDING} />
      ) : (
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            color: type == "fill" ? Colors.WHITE : Colors.LANDING,
          }}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}
