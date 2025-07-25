import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import config from '../../constant/config';
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function AllRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const fuelRes = await axios.get(`${config.API_BASE_URL}/api/request/all`);
        const fuelData = fuelRes.data.data || [];

        const serviceRes = await axios.get(`${config.API_BASE_URL}/api/request/serviceRequestlist`);
        const serviceData = serviceRes.data.data || [];

        const filteredFuel = fuelData.filter((item) => {
          const requestUserId =
            item.userId?._id || item.userId || item.user?._id || item.user || '';
          return String(requestUserId) === String(userId);
        });

        const filteredService = serviceData.filter((item) => {
          const requestUserId =
            item.userId?._id || item.userId || item.user?._id || item.user || '';
          return String(requestUserId) === String(userId);
        });

        const fuelRequests = filteredFuel.map((item) => ({ ...item, type: 'fuel' }));
        const serviceRequests = filteredService.map((item) => ({ ...item, type: 'service' }));

        setRequests([...fuelRequests, ...serviceRequests]);
      } catch (err) {
        console.error('❌ Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRequests();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { color: '#FFA500', backgroundColor: '#FFF3CD' };
      case 'In-Progress':
        return { color: '#007BFF', backgroundColor: '#DDEFFF' };
      case 'Rejected':
        return { color: '#DC3545', backgroundColor: '#F8D7DA' };
      case 'Completed':
        return { color: '#28A745', backgroundColor: '#D4EDDA' };
      default:
        return { color: '#333', backgroundColor: '#EEE' };
    }
  };

  const renderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={styles.card}>
        <View>
          <Text style={styles.titleText}>
            {item.type === 'fuel'
              ? item.gasStation?.name || 'No Station'
              : item.Garage?.name || 'No Garage'}
          </Text>
          <Text style={styles.label}>
            {item.type === 'fuel'
              ? `Fuel Type: ${item.fuelType}\nAmount: ${item.amount}L`
              : `Service Type: ${item.serviceType}\nSituation: ${item.situation}`}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {item.status || 'Pending'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={{ marginTop: 10, color: Colors.PRIMARY }}>Loading requests...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/welcomeScreen')}>
          <Ionicons name="chevron-back" size={width * 0.08} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Requests</Text>
        <View style={{ width: width * 0.08 }} />
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You haven’t made any requests yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: height * 0.05,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontFamily: 'outfitBold',
    color: Colors.PRIMARY,
    flex: 1,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#E6F0FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
