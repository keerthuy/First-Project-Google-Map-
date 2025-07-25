import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router"; // Import the router hook
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constant/Colors";
import config from "../../constant/config";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Initialize the router hook

  const handleRegister = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email.trim())){
    Alert.alert("Invalid Email","please enter a valid email address");
    return;
  }

  const passwordRegex = /^(?=.*\d).{8,}$/;
  if(!passwordRegex.test(password)){
    Alert.alert("Invalid Password","Password must be at least 8 characters long and contain at least one number");
    return;
  }

  if (
      !name ||
      !email ||
      !mobile ||
      !password 
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

  try {
    const response = await axios.post(`${config.API_BASE_URL}/api/auth/register`, {
      name,
      email: email.trim().toLowerCase(), // Normalize email
      mobile,
      password,
      role: "user",
    });

    // Debug log (optional)
    console.log("Registration response:", response.data);

      if (response.data.status !== "ok") {
      Alert.alert("Error", response.data.data);
      return;
    }

    // Save username, role, and token from login response
    await AsyncStorage.setItem("username", response.data.username);
    await AsyncStorage.setItem("email", response.data.email);  // Save email
    await AsyncStorage.setItem("role", response.data.role);  // Save role
    await AsyncStorage.setItem("token", response.data.data);  // Save token

    Alert.alert("Register successful");
    router.push("/(tabs)/welcomeScreen");
  } catch (error) {
    console.error("Registration error:", error);
    Alert.alert("Error", "Registration failed. Try again.");
  }
};


  return (
    <View style={{
      display: 'flex',
      alignItems:'center',
      marginTop:100,
      padding:25,
      flex:1,
      color:Colors.PRIMARY,
    }}>
       <Image
        source={require('./../../assets/images/logo.jpeg')}
        style={{
          width:100,
          height:100,
          borderRadius:20
         } }
      />
      <Text style={{
        fontSize:30,
        fontFamily:'outfitBold',
      }}>Create New Account</Text>
      <TextInput
        placeholder="Name"
        style={styles.textInput}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.textInput}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Mobile"
        style={styles.textInput}
        onChangeText={setMobile}
      />
      <TextInput
        placeholder="Password"
        style={styles.textInput}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity  style={{
         backgroundColor: Colors.PRIMARY,
         marginTop:25,
         width:"100%",
         padding:10,
         borderRadius:10
      }} 
      onPress={handleRegister}>
        <Text style={{
          fontFamily:'outfit',
          fontSize:20,
          textAlign:'center',
          color:Colors.WHITE
        }}>
          Sign Up
        </Text>
      </TouchableOpacity>
      <Text
        onPress={() => router.push("/auth/login")}
        style={{
          color:Colors.PRIMARY,
          fontFamily:'outfitBold',
          marginTop:5
        }}
      >
        Already have an account? Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput:{
    borderWidth: 1,
    width: '100%',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
  }
})

export default RegisterScreen;
