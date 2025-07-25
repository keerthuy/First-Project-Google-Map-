import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Alert, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Image, 
  TouchableOpacity,
  BackHandler,
  ScrollView,
  Dimensions
} from "react-native";
import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constant/Colors";
import config from "../../constant/config";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Both email and password are required.");
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.status !== "ok") {
        Alert.alert("Error", response.data.data);
        return;
      }

      // Save username, role, and token from login response
      await AsyncStorage.setItem("userId", response.data.userId); 
      await AsyncStorage.setItem("username", response.data.username);
      await AsyncStorage.setItem("email", response.data.email);
      await AsyncStorage.setItem("role", response.data.role);
      await AsyncStorage.setItem("token", response.data.data);
      
      if (response.data.placeId) {
        await AsyncStorage.setItem("placeId", response.data.placeId);
        console.log("Stored placeId:", response.data.placeId);
      } else {
        await AsyncStorage.removeItem("placeId"); // Clean up for regular users
        console.log("No placeId provided in login response");
      }

      Alert.alert("Login successful");

      if (response.data.role === "user") {
        router.replace("/(tabs)/welcomeScreen"); // reset stack to welcomeScreen
      } else {
        router.replace("/(tabs1)/welcome"); // reset stack to serviceProvider tabs
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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      // Block going back on login screen
      return true; 
    });

    return () => backHandler.remove();
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Back Button - fixed at top left */}
      <TouchableOpacity 
        style={styles.backButtonFixed}
        onPress={() => router.push("/auth/userSelection")}
      >
        <Ionicons name="arrow-back" size={28} color={Colors.PRIMARY} />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.centeredContent}>
          <Image
            source={require("./../../assets/images/logo.jpeg")}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Please sign in to continue</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={Colors.GRAY} style={styles.inputIcon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor={Colors.GRAY}
              style={styles.textinput}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.GRAY} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={Colors.GRAY}
              style={[styles.textinput, { flex: 1 }]}
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Ionicons 
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={Colors.GRAY} 
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/userSelection")}>
              <Text style={styles.signupLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    width: '100%',
  },
  backButtonFixed: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 5,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfitBold",
    color: Colors.PRIMARY,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: Colors.LIGHT_BACKGROUND,
  },
  inputIcon: {
    marginRight: 10,
  },
  textinput: {
    flex: 1,
    height: 50,
    fontFamily: "outfit",
    color: Colors.DARK,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontFamily: "outfit",
    color: Colors.PRIMARY,
  },
  loginButton: {
    width: '100%',
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    fontFamily: "outfitBold",
    fontSize: 18,
    color: Colors.WHITE,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signupText: {
    fontFamily: "outfit",
    color: Colors.DARK,
  },
  signupLink: {
    fontFamily: "outfitBold",
    color: Colors.PRIMARY,
  },
});

export default LoginScreen;