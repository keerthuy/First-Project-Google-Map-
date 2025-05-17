import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Colors from '../../constant/Colors';

const Welcome = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.get("http://10.165.51.162:9001/api/request/fuel-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />;

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
        {requests.map((req) => (
          <View key={req._id} style={styles.requestCard}>
            <Text>🚗 Fuel Type: {req.fuelType}</Text>
            <Text>📍 Location: {req.location}</Text>
            <Text>⛽ Amount: {req.amount}</Text>
          </View>
        ))}
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
    backgroundColor: "#eee",
    marginHorizontal: 10,
    borderRadius: 8,
  },
});

export default Welcome;
