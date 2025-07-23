import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Colors from '../../constant/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import config from '../../constant/config';

const Welcome = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();



 const fetchRequests = async () => {
  const token = await AsyncStorage.getItem("token");
  const placeId = await AsyncStorage.getItem("placeId");

  try {
    const [fuelRes, serviceRes] = await Promise.all([
      axios.get(`${config.API_BASE_URL}/api/request/fuel-requests`, {
        params: { placeId },
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${config.API_BASE_URL}/api/request/service-requests`, {
        params: { placeId },
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const fuelRequests = fuelRes.data.data.map(req => ({
      ...req,
      type: 'fuel',
    }));

    const serviceRequests = serviceRes.data.data.map(req => ({
      ...req,
      type: 'service',
    }));

    const allRequests = [...fuelRequests, ...serviceRequests];

    const acceptedJSON = await AsyncStorage.getItem("acceptedRequests");
    const acceptedIDs = acceptedJSON ? JSON.parse(acceptedJSON) : [];

    const filtered = allRequests.filter(req => !acceptedIDs.includes(req._id));
    setRequests(filtered);
  } catch (error) {
    console.error("Error fetching requests:", error);
  } finally {
    setLoading(false);
  }
};


  // const fetchRequests = async () => {
  //   const token = await AsyncStorage.getItem("token");
  //   const placeId = await AsyncStorage.getItem("placeId");
  //   try {
  //     const response = await axios.get(`${config.API_BASE_URL}/api/request/fuel-requests`, {
  //       params: {
  //         placeId: placeId
  //       } ,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const allRequests = response.data.data;
  //     const acceptedJSON = await AsyncStorage.getItem("acceptedRequests");
  //     const acceptedIDs = acceptedJSON ? JSON.parse(acceptedJSON) : [];

  //     const filtered = allRequests.filter(req => !acceptedIDs.includes(req._id));
  //     setRequests(filtered);
  //   } catch (error) {
  //     console.error("Error fetching requests:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchRequests();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.top}>FixMyRide</Text>
        <Ionicons name="notifications-outline" size={28} color="white" style={styles.notificationIcon} />
      </View>
      <View>
        <Text style={{ fontSize: 30, marginTop: 20, fontFamily: "outfit", marginLeft: 10 }}>
          Recent Requests
        </Text>

       {requests.length > 0 ? (
  requests.map((req) => (
    <TouchableOpacity
      key={req._id}
      style={styles.requestCard}
      onPress={() => router.push({ pathname: "/fuelRequest/moreDetail", params: { id: req._id } })}
    >
      <View style={{ flex: 1 }}>
        <Text>🆔 Type: {req.type === "service" ? "Service" : "Fuel"}</Text>

        {req.type === "fuel" && (
          <>
            <Text>🚗 Fuel Type: {req.fuelType}</Text>
            <Text>📍 Location: {req.location}</Text>
            <Text>⛽ Amount: {req.amount}</Text>
          </>
        )}

        {req.type === "service" && (
          <>
            <Text>🔧 Service: {req.serviceType}</Text>
            <Text>📍 Location: {req.location}</Text>
            <Text>🕐 Preferred Time: {req.preferredTime}</Text>
          </>
        )}
      </View>
      <Icon name="arrow-right" size={25} color="black" style={styles.arrow} />
    </TouchableOpacity>
  ))
) : (
  <Text style={{ textAlign: 'center', marginTop: 50 }}>No new requests</Text>
)}

      </View>
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
  requestCard: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#CAD6FF",
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrow: {
    marginRight: 25,
  }
});

export default Welcome;