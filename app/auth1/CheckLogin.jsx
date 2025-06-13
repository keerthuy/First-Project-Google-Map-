import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import config from "../../constant/config";

const CheckLogin = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const [token, role] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("role"),
        ]);

      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const res = await axios.post(`${config.API_BASE_URL}/verify-token`, { token });
        if (res.data.status === "ok") {
          if (role ==="serviceProvider"){
            router.replace("/(tabs1)/welcome")
          }else{
          router.replace("/(tabs)/welcomeScreen");
          }
        } else {
          await AsyncStorage.clear();
          router.replace("/");
        }
      } catch (err) {
        await AsyncStorage.clear();
        router.replace("/");
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
