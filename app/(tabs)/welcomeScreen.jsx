import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const WelcomeScreen = () => {
  const [username, setUsername] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const name = await AsyncStorage.getItem("username");
        setUsername(name || "Guest");
      } catch (error) {
        console.error("Error fetching username:", error);
        setUsername("Guest");
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("username");
    router.replace("/auth1/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome, {username}!</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  greeting: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  logoutButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default WelcomeScreen;
