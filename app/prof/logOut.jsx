import React from "react";
import {View,Text,TouchableOpacity,StyleSheet,Dimensions,} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function LogoutScreen() {
  const router = useRouter();
  const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("username");
        router.replace("/"); // Navigate to the index screen
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
  return (
    <View style={styles.overlay}>
      <View style={styles.popupContainer}>
        <Text style={styles.title}>Are you sure you want to logout?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              try {
                router.replace("/profile");
              } catch (error) {
                console.error("Error navigating back:", error);
              }
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => handleLogout()}
          >
            <Text style={styles.logoutButtonText}>Yes, Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: SCREEN_WIDTH > 400 ? 28 : 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",

  },
  title: {
    fontSize: SCREEN_WIDTH > 400 ? 20 : 16,
    fontWeight: "800",
    fontFamily: "outfit",
    color: "#333",
    marginBottom: SCREEN_WIDTH > 400 ? 28 : 16,
    textAlign: "center",

  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#3498db", // Changed to #3498db
    paddingVertical: SCREEN_WIDTH > 400 ? 14 : 10,
    borderRadius: 30,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: SCREEN_WIDTH > 400 ? 17 : 15,
    fontWeight: "800",
    fontFamily: "Outfit",
  },
  logoutButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#3498db", // Changed to #3498db
    paddingVertical: SCREEN_WIDTH > 400 ? 14 : 10,
    borderRadius: 30,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff", // White text
    fontSize: SCREEN_WIDTH > 400 ? 17 : 15,
    fontWeight: "800",
    fontFamily: "outfit",
  },
});
