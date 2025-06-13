import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../constant/Colors';
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window'); // Get screen dimensions


export default function BillMaking() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAcceptedRequests = async () => {
      try {
        const stored = await AsyncStorage.getItem('acceptedRequests');
        const acceptedIds = stored ? JSON.parse(stored) : [];

        const response = await fetch(`${config.API_BASE_URL}/api/request/fuel-requests`);
        const data = await response.json();

        const filtered = data.data.filter((item) => acceptedIds.includes(item._id));
        setRequests(filtered);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAcceptedRequests();
  }, []);

  const handleComplete = async (requestId) => {
    try {
      await fetch(`${config.API_BASE_URL}/api/request/fuel-requests/${requestId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      });

      // Remove request from accepted list
      const stored = await AsyncStorage.getItem('acceptedRequests');
      let acceptedIds = stored ? JSON.parse(stored) : [];
      acceptedIds = acceptedIds.filter(id => id !== requestId);
      await AsyncStorage.setItem('acceptedRequests', JSON.stringify(acceptedIds));

      // Remove from UI
      setRequests(prev => prev.filter(req => req._id !== requestId));

      Alert.alert('Success', 'Request marked as completed');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark as completed');
    }
  };

  if (loading) return <Text style={{ marginTop: 40, textAlign: 'center' }}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
       <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/GoogleMaps/nearbyGas')}>
            <Ionicons name="chevron-back" size={width * 0.08} color="#2260FF" />
          </TouchableOpacity>
          <Text style={styles.top}>Make Bill</Text>
           <View style={{ width: width * 0.08 }} />
        </View>
      <Text style={styles.title}>Working Service List</Text>
      {requests.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 30 }}>No accepted requests.</Text>
      ) : (
        requests.map((request) => (
          <View key={request._id} style={styles.card}>
            <Text style={styles.requestId}>
              Request ID: {request._id.replace(/\D/g, '').slice(-5)}
            </Text>
            <Text style={styles.userDetail}>👤 {request.user?.name}</Text>


            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleComplete(request._id)}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 16,
  },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:20,
   },
    top: {
      fontSize: width * 0.08, // Dynamic font size
      fontFamily: 'outfitBold',
      color: Colors.PRIMARY,
      marginLeft: width * 0.02,
    },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 10,
    marginTop:15,
    marginLeft:10,
    fontFamily:'outfit',
  },
  card: {
    backgroundColor: '#CAD6FF',
    padding: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  requestId: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  completeButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
});
