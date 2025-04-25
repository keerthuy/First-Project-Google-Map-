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
    console.log(email, password);
    const userData = { email, password };
    
    try {
        const res = await axios.post("http://10.56.69.162:9001/login-user", userData);
        await AsyncStorage.setItem("username", res.data.username);
        await AsyncStorage.setItem("token", res.data.data);  // Save the token
        if (res.data.status === "ok") {
            console.log("Username received:", res.data.username); // Debugging log
  
            // Store username in AsyncStorage
            await AsyncStorage.setItem("username", res.data.username);
  
            Alert.alert("Login Successful");
  
            // Navigate to WelcomeScreen
            router.push('/(tabs)/welcomeScreen');
        } else {
            Alert.alert("Login Failed", "Invalid email or password");
        }
    } catch (error) {
        console.error("Login error:", error);
        Alert.alert("Error", "Something went wrong. Try again.");
    }
};

  

  return (
        <View
        style={{
          display:'flex',
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
          <Text
          style={{
            fontSize:30,
            fontFamily:'outfitBold'
          }}
          >  Welcome Back</Text>
          <TextInput placeholder="Email" style={styles.textinput} onChange={ e => setEmail(e.nativeEvent.text)} />
          <TextInput placeholder="Password" style={styles.textinput} secureTextEntry onChange={ e => setPassword(e.nativeEvent.text)} />

          <TouchableOpacity style={styles.Button1} onPress={() => handleSubmit()}>
           <Text
           style={{
          fontFamily:'outfit',
          fontSize:20,
          textAlign:'center',
          color:Colors.WHITE
           }}
           >
            Sign In
           </Text>
          </TouchableOpacity>
          <View style={{
            display:'flex',
            flexDirection:'row', gap:5,
            marginTop:10

          }}>
          <Text  style={{fontFamily:'outfit',color:Colors.PRIMARY}}onPress={() => router.push("/auth1/register")}>
            Don't have an account? Register
          </Text>
          </View>
        </View>
  );
}
const styles = StyleSheet.create({
textinput:{
  borderWidth:1,
  width:'100%',
  padding:15,
  marginTop:20,
  borderRadius:8
},
Button1:{
  backgroundColor:Colors.PRIMARY,
  marginTop:25,
  padding:10,
  borderRadius:10
}
})

export default LoginScreen;



