import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constant/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function moreDetail() {
    const [requests, setRequests] = useState([]);

useEffect(() => {
  const fetchRequests = async () => {
    try {
      const response = await fetch('http://10.139.250.162:9001/api/request/fuel-requests');
      const data = await response.json();
      console.log("Response data:", data); // Add this for debugging
      setRequests(data.data); // FIXED: get only the array
    } catch (error) {
      console.error("Failed to load requests:", error);
    }
  };

  fetchRequests();
}, []);


const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>User Name: {item.user?.name}</Text>
      <Text style={styles.text}>Phone: {item.user?.mobile}</Text>
      <Text style={styles.text}>Email: {item.user?.email}</Text>
    </View>
  );

  return (
    <View>
     <FlatList
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
    />
    </View>
  );
};

const styles = StyleSheet.create({
   card: {
    padding: 20,
    backgroundColor: '#eee',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color:"black",
  }
})