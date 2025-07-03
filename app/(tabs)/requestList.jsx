import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import config from '../../constant/config';

export default function AllRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <Text style={styles.userText}>User: {item.user?.name || item.user?.email}</Text>
      <Text>Fuel Type: {item.fuelType}</Text>
      <Text>Amount: {item.amount}L</Text>
      <Text>
        Status:{" "}
        <Text style={{ color: getStatusColor(item.status) }}>
          {item.status || 'Pending'}
        </Text>
      </Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12
  },
  userText: {
    fontWeight: 'bold',
    marginBottom: 4,
  }
});
