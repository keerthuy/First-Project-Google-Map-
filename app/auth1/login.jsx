import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, TouchableOpacity,setItem } from "react-native";
import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constant/Colors";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Both email and password are required.");
      return;
    }

    try {
      const response = await axios.post("http://10.59.247.162:9001/api/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.status !== "ok") {
        Alert.alert("Error", response.data.data);
        return;
      }

      // Save username, role, and token from login response
      await AsyncStorage.setItem("username", response.data.username);
      await AsyncStorage.setItem("email", response.data.email);
      await AsyncStorage.setItem("role", response.data.role);
      await AsyncStorage.setItem("token", response.data.data);

      Alert.alert("Login successful");

      if (response.data.role === "user") {
        router.push("/(tabs)/welcomeScreen");
      } else {
        router.push("/(tabs1)/welcome");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        Alert.alert("Error", error.response.data.message || "Login failed.");
      } else if (error.request) {
        console.error("Network error:", error.request);
        Alert.alert("Error", "Network error. Please try again.");
      } else {
        console.error("Error:", error.message);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 100,
        padding: 25,
        flex: 1,
        color: Colors.PRIMARY,
      }}
    >
      <Image
        source={require("./../../assets/images/logo.jpeg")}
        style={{
          width: 100,
          height: 100,
          borderRadius: 20,
        }}
      />
      <Text
        style={{
          fontSize: 30,
          fontFamily: "outfitBold",
        }}
      >
        Welcome Back
      </Text>
      <TextInput
        placeholder="Email"
        style={styles.textinput}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.textinput}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.Button1} onPress={handleSubmit}>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 20,
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Sign In
        </Text>
      </TouchableOpacity>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          marginTop: 10,
        }}
      >
        <Text
          style={{ fontFamily: "outfit", color: Colors.PRIMARY }}
          onPress={() => router.push("/auth1/userSelection")}
        >
          Don't have an account? Register
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textinput: {
    borderWidth: 1,
    width: "100%",
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
  },
  Button1: {
    backgroundColor: Colors.PRIMARY,
    marginTop: 25,
    padding: 10,
    borderRadius: 10,
  },
});

export default LoginScreen;



