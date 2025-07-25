import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, BackHandler, Platform } from "react-native";
import { Tabs, useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const backHandlerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!isMounted) return;
      if (!token) {
        setIsLoggedIn(false);
        router.replace("/auth/login");
      } else {
        setIsLoggedIn(true);
        setLoading(false);
      }
    };
    checkToken();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      // If NOT logged in → add back handler to block back button
      if (!isLoggedIn) {
        if (!backHandlerRef.current) {
          backHandlerRef.current = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
              // console.log("Back button blocked because logged out");
              return true; // block back
            }
          );
        }
      } else {
        // If logged in → remove the back handler so back button works normally
        if (backHandlerRef.current) {
          backHandlerRef.current.remove();
          backHandlerRef.current = null;
        }
      }
    }
  }, [isLoggedIn]);

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="welcomeScreen"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="requestList"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
          tabBarLabel: "Request list",
        }}
      />
      <Tabs.Screen
        name="invoice"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="file-invoice-dollar" size={size} color={color} />
          ),
          tabBarLabel: "Invoice",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}
