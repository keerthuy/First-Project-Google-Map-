import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../constant/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MoreDetail() {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchRequestById = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${config.API_BASE_URL}/api/request/fuel-request/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Check content-type before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Expected JSON but got:", text);
          setRequest(null);
          setLoading(false);
          return;
        }

        const result = await response.json();

        if (response.ok && result.status === "ok") {
          setRequest(result.data);
        } else {
          console.error("Fetch failed:", result.message);
          setRequest(null);
        }
      } catch (error) {
        console.error("Failed to load request:", error);
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestById();
  }, [id]);

  const handleAccept = async () => {
    try {
      await fetch(`${config.API_BASE_URL}/api/request/fuel-requests/${request._id}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });

      const existing = await AsyncStorage.getItem('acceptedRequests');
      let acceptedRequests = existing ? JSON.parse(existing) : [];

      if (!acceptedRequests.includes(request._id)) {
        acceptedRequests.push(request._id);
        await AsyncStorage.setItem('acceptedRequests', JSON.stringify(acceptedRequests));
      }

      router.push('/(tabs1)/billMaking');
    } catch (error) {
      Alert.alert("Error", "Failed to accept request.");
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!request) return <Text style={styles.text}>No details found.</Text>;

  return (
    <View>
      <View style={styles.card}>
        <Text style={{ fontSize: 28 }}>User Details :</Text>
        <Text style={styles.text}>👤 User Name: {request.user?.name}</Text>
        <Text style={styles.text}>📞 Phone: {request.user?.mobile}</Text>
        <Text style={styles.text}>✉️ Email: {request.user?.email}</Text>

        <View style={styles.divider} />

        <Text style={styles.text}>🆔 Request ID: {request._id.replace(/\D/g, '').slice(-5)}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.acceptButton} onPress={() => router.push('/(tabs1)/welcome')}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#CAD6FF',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 100
  },
  text: {
    fontSize: 16,
    color: "black",
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#888",
    marginVertical: 10,
    width: "100%",
    alignSelf: "center",
    borderRadius: 1,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20
  },
  acceptButton: {
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    padding: 20,
    fontSize: 15,
    fontFamily: 'outfit',
    color: "white"
  }
});