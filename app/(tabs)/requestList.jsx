import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import config from '../../constant/config';
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width , height } = Dimensions.get('window');

export default function AllRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);


const { width , height } = Dimensions.get('window');

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/request/all`);
        setRequests(res.data.data); // Assuming your backend returns { status: 'ok', data: [...] }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching requests", err);
        setLoading(false);
      }
    };

    fetchAllRequests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "In-Progress":
        return "blue";
      case "Rejected":
        return "red";
      case "Completed":
        return "green";
      default:
        return "black";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{fontFamily:'outfit'}}>
      <Text style={styles.userText}>{item.gasStation.name}</Text>
      <Text>Fuel Type: {item.fuelType}</Text>
      <Text>Amount: {item.amount}L</Text>
      <Text>
        Status:{" "}
        <Text style={{ color: getStatusColor(item.status) }}>
          {item.status || 'Pending'}
        </Text>
      </Text>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
   
  <View style={{ flex: 1, backgroundColor: "#fff" }}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/welcomeScreen')}>
        <Ionicons name="chevron-back" size={width * 0.10} color="#2260FF" />
      </TouchableOpacity>
      <Text style={styles.top}>Requesting Fuel List</Text>
      <View style={{ width: width * 0.10 }} />
    </View>
    <View style={{ backgroundColor: Colors.PRIMARY, borderRadius: 15, flex: 1 }}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderRadius:10
  },
  userText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: height * 0.02,
  marginTop: height * 0.04,
  
},
top: {
  fontSize: width * 0.08,
  fontFamily: 'outfitBold',
  color: Colors.PRIMARY,
  textAlign: 'center',
  flex: 1,
},
});
