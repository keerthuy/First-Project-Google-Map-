import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import GoogleMapUn from "./../../Components/Home/GoogleMapUn" // Adjust the import path as necessary 
import Colors from "../../constant/Colors";
import Ionicons from '@expo/vector-icons/Ionicons';


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
      <ScrollView showsVerticalScrollIndicator={false}
            // contentContainerStyle={{ paddingBottom: 20 }} // Add padding to the bottom
      >
      <View style={styles.header}>
        <Text style={styles.top}>FixMyRide</Text>
      <TouchableOpacity onPress={() => router.push('/noti/notification')} > 
        <Ionicons name="notifications-outline" size={28} color="white" style={styles.notificationIcon} />
    </TouchableOpacity>
      </View>
      <View style={styles.greetingBox}>
      <Text style={styles.greeting}>
        Welcome!, {username}.
      </Text>
      </View>
      <GoogleMapUn/>
  
      <Text style={{ fontFamily: "outfitBold", fontSize: 25, marginTop:10, marginLeft: 10 }}>Near by</Text>
      <View style={styles.imageRow}>
        <TouchableOpacity onPress={() =>router.push('/GoogleMaps/nearbyGas')}>
          <Image
          source={require('./../../assets/images/gasStation.png')}
          style={{
            width: 120,
            height: 120,
            borderRadius: 20,
            marginTop: 20,
          }}
        />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/GoogleMaps/nearbyGarage')}>
        <Image
          source={require('./../../assets/images/garageStation.png')}
          style={{
            width: 120,
            height: 120,
            borderRadius: 20,
            marginTop: 20,
          }}
        />
        </TouchableOpacity>
      </View>
      <View style={styles.textRow}>
        <Text style={styles.imageText}>Gas Station</Text>
        <Text style={styles.imageText}>Garage Station</Text>
      </View>
      <View style={styles.bookingImag}>
        <TouchableOpacity onPress={() => router.push('/requestForms/ServiceBooking')}>
        <Image source={require("./../../assets/images/serviceBooking.jpeg")}
        style={{
          width:150,
          height:120,
        }}
        />
         </TouchableOpacity>
        <Text style={{
          fontFamily: "outfit",
          fontSize: 20,
        }}>Booking Service</Text>
       
      </View>
      </ScrollView>
    </View>
  );
};
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.WHITE,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: Colors.PRIMARY,
      paddingHorizontal: 10,
      paddingVertical: 30,
      position: "relative",
    },
    top: {
      fontSize: 30,
      fontFamily: "outfit",
      color: Colors.WHITE,
      position: "absolute",
      left: "50%",
      transform: [{ translateX: -50 }],
      marginTop: 20,
    },
    notificationIcon: {
      marginLeft: 20,
      marginTop: 20,
    },
    greeting: {
      fontSize: 25,
      fontFamily: "outfitBold",
      textAlign: "center",
       backgroundColor: Colors.WHITE,
       borderRadius:20,
       color:Colors.PRIMARY,
    },
    greetingBox: {
      backgroundColor: "#CAD6FF",
      borderRadius: 20,
      padding: 10,
      marginTop: 20,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 20,
    },
    imageRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginRight: 40,
      marginLeft: 40,
    },
    textRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    
    },
    imageText: {
      fontFamily: "outfit",
      fontSize: 20,
      marginRight: 30,
      marginTop: 10,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 45,
    },
   bookingImag:{
   justifyContent:'center',
   alignItems:'center',
   marginTop:20,
   }
  });

export default WelcomeScreen;
 