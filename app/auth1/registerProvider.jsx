import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../constant/config";

const RegisterScreen = () => {
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerNic, setOwnerNic] = useState("");
  const [address, setAddress] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [placeId, setPlaceId] = useState("");
  const router = useRouter(); 

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const passwordRegex = /^(?=.*\d).{8,}$/;
  // if(!passwordRegex.test(password)){
  //   Alert.alert("Invalid Password","Password must be at least 8 characters long and contain at least one number");
  //   return;
  // }

  const handleRegister = async () => {
    if (
      !businessName ||
      !ownerName ||
      !ownerNic ||
      !address ||
      !licenceNumber ||
      !email ||
      !mobile ||
      !password
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/provider/register`, {
        businessName,
        ownerName,
        ownerNic,
        address,
        licenceNumber,
        email,
        mobile,
        password,
        placeId,
      });

      console.log("Register response:", response.data);

      if (!response.data || response.data.status !== "ok") {
        Alert.alert("Error", response.data?.data || "Registration failed.");
        return;
      }

try {
  const {data} = response.data;
  await AsyncStorage.setItem("username", response.data.username);
  await AsyncStorage.setItem("email", response.data.email);
  await AsyncStorage.setItem("role", response.data.role);
  await AsyncStorage.setItem("token", response.data.data);

  // ✅ Check and store placeId safely
  
if (data.placeId && typeof data.placeId === "string") {
  await AsyncStorage.setItem("placeId", data.placeId);
} else {
  console.warn("placeId is missing or invalid:", data.placeId);
  await AsyncStorage.removeItem("placeId");
}

} catch (storageError) {
  console.error("AsyncStorage error:", storageError);
  Alert.alert("Error", "Failed to save registration data. Please try again.");
  return;
}

      Alert.alert("Register successful");
      router.push("/(tabs1)/welcome");
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        Alert.alert("Error", error.response.data.message || "Registration failed.");
      } else if (error.request) {
        console.error("Network error:", error.request);
        Alert.alert("Error", "Network error. Please check your connection and try again.");
      } else {
        console.error("Error:", error.message);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image
            source={require("./../../assets/images/logo.jpeg")}
            style={styles.logo}
          />
          <Text style={styles.title}>Create New Account</Text>
          <TextInput placeholder="Business Name" style={styles.textInput} onChangeText={setBusinessName} />
          <TextInput placeholder="Owner Name" style={styles.textInput} onChangeText={setOwnerName} />
          <TextInput placeholder="Owner NIC" style={styles.textInput} onChangeText={setOwnerNic} />
          <TextInput placeholder="Address" style={styles.textInput} onChangeText={setAddress} />
          <TextInput placeholder="Place ID" style={styles.textInput} onChangeText={setPlaceId}/>
          <TextInput placeholder="Licence Number" style={styles.textInput} onChangeText={setLicenceNumber} />
          <TextInput placeholder="Tel No" style={styles.textInput} onChangeText={setMobile} />
          <TextInput placeholder="Email" style={styles.textInput} onChangeText={setEmail} />
          <TextInput
            placeholder="Password"
            style={styles.textInput}
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Text style={styles.loginText} onPress={() => router.push("/auth1/login")}>
            Already have an account? Login
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    marginTop: 100,
    padding: 25,
    flex: 1,
    color: Colors.PRIMARY,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "outfitBold",
  },
  textInput: {
    borderWidth: 1,
    width: "100%",
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    marginTop: 25,
    width: "100%",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "outfit",
    fontSize: 20,
    textAlign: "center",
    color: Colors.WHITE,
  },
  loginText: {
    color: Colors.PRIMARY,
    fontFamily: "outfitBold",
    marginTop: 5,
  },
});

export default RegisterScreen;