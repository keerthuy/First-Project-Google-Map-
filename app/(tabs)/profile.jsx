import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constant/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Profile = () => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        const storedEmail = await AsyncStorage.getItem("email");

        setUsername(storedUsername || "Guest");
        setEmail(storedEmail || "Guest");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUsername("Guest");
        setEmail("Guest");
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileHeader}>
        <Image
          source={require("./../../assets/images/profile.jpg")}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/prof/edit-profile")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.historyRow}
        onPress={() => router.push("/prof/history")}
      >
        <Text style={styles.historyLabel}>⏰ History</Text>
        <Text style={styles.chevron}>{">"}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.logoutRow}
        onPress={() => router.push("auth/logOut")}
      >
        <Text style={styles.logoutLabel}>🚪 Log Out</Text>
        <Text style={styles.chevron}>{">"}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SCREEN_WIDTH > 500 ? 40 : 16,
    paddingTop: SCREEN_WIDTH > 600 ? 68 : 48,
    alignItems: "stretch",
  },
  title: {
    fontFamily: "outfitBold",
    fontSize: 30,
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: SCREEN_WIDTH > 400 ? 32 : 22,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SCREEN_WIDTH > 400 ? 20 : 14,
    gap: SCREEN_WIDTH > 400 ? 20 : 12,
  },
  profileImage: {
    width: SCREEN_WIDTH > 400 ? 100 : 80,
    height: SCREEN_WIDTH > 400 ? 100 : 80,
    borderRadius: SCREEN_WIDTH > 400 ? 50 : 40,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginRight: SCREEN_WIDTH > 400 ? 16 : 10,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontFamily: "outfit",
    fontWeight: "900",
    fontSize: SCREEN_WIDTH > 400 ? 20 : 16,
    color: "#000",
    marginBottom: 4,
  },
  email: {
    fontFamily: "outfit",
    fontWeight: "400",
    fontSize: SCREEN_WIDTH > 400 ? 15 : 13,
    color: "#666666",
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#2196F3",
    paddingVertical: SCREEN_WIDTH > 400 ? 8 : 6,
    paddingHorizontal: SCREEN_WIDTH > 400 ? 22 : 14,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  editButtonText: {
    fontFamily: "outfit",
    fontWeight: "600",
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: SCREEN_WIDTH > 400 ? 18 : 12,
    width: "100%",
    alignSelf: "center",
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SCREEN_WIDTH > 400 ? 14 : 10,
  },
  historyLabel: {
    fontFamily: "outfit",
    fontWeight: "500",
    fontSize: SCREEN_WIDTH > 400 ? 18 : 15,
    color: "#000",
  },
  chevron: {
    fontSize: SCREEN_WIDTH > 400 ? 22 : 18,
    color: "#999",
    marginLeft: 8,
    fontWeight: "600",
    fontFamily: "outfit",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SCREEN_WIDTH > 400 ? 14 : 10,
  },
  logoutLabel: {
    fontFamily: "outfit",
    fontWeight: "500",
    fontSize: SCREEN_WIDTH > 400 ? 17 : 15,
    color: "#000",
  },
});

export default Profile;
