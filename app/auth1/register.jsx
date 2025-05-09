import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router"; // Import the router hook
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constant/Colors";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Initialize the router hook

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://10.246.171.162:9001/register", {
        name,
        email,
        mobile,
        password,
      });
      await AsyncStorage.setItem("username",name);
      Alert.alert("Success", response.data.data);
      router.push('/auth1/login'); // Redirect to login after registration
    } catch (error) {
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
        onPress={() => router.push("/auth1/login")}
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
