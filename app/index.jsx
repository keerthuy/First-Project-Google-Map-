import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "./../constant/Colors";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Only redirect if token exists
        const token = await AsyncStorage.getItem("token");
        const role = await AsyncStorage.getItem("role");

        if (token) {
          if (role === "serviceProvider") {
            router.replace("/(tabs1)/welcome");
          } else {
            router.replace("/(tabs)/welcomeScreen");
          }
        }
        // If no token, stay on the index screen
      } catch (error) {
        console.error("Error checking login status:", error);
        // If an error occurs, stay on the index screen
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <Image
        source={require("./../assets/images/landing.jpg")}
        style={{
          width: "150%",
          height: 400,
          marginTop: 5,
        }}
      />
      <View
        style={{
          padding: 25,
          backgroundColor: Colors.PRIMARY,
          height: "100%",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            color: Colors.WHITE,
            fontFamily: "outfitBold",
          }}
        >
          FixMyRide
        </Text>
        <Text
          style={{
            textAlign: "justify",
            marginTop: 20,
            fontSize: 18,
            color: Colors.WHITE,
            fontFamily: "outfit",
          }}
        >
          FixMyRide connects you to nearby garages and gas stations for
          emergencies or bookings, ensuring quick and hassle-free vehicle
          assistance anytime. 🚗⚙️
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth1/userSelection")}
        >
          <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>
            Get Started
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: Colors.PRIMARY,
              borderWidth: 1,
              borderColor: Colors.WHITE,
            },
          ]}
          onPress={() => router.push("/auth1/login")}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
            Already have an account?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 17,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "outfit",
  },
});