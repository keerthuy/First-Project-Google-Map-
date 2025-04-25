import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

const CheckLogin = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("/auth1/login");
        return;
      }

      try {
        const res = await axios.post("http://10.56.69.162:9001/verify-token", { token });
        if (res.data.status === "ok") {
          router.replace("/(tabs)/welcomeScreen");
        } else {
          await AsyncStorage.clear();
          router.replace("/auth1/login");
        }
      } catch (err) {
        await AsyncStorage.clear();
        router.replace("/auth1/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default CheckLogin;
