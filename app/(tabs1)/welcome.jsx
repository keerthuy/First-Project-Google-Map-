import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  TouchableOpacity, 
  BackHandler,
  ScrollView,
  RefreshControl
} from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/auth/login");
      }
    };

    checkAuth();
  }, []);

  const fetchRequests = async () => {
    setRefreshing(true);
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [id]);

  const onRefresh = () => {
    fetchRequests();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FixMyRide</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.PRIMARY]}
          />
        }
      >
        <Text style={styles.sectionTitle}>Recent Requests</Text>

        {requests.length > 0 ? (
          requests.map((req) => (
            <TouchableOpacity
              key={req._id}
              style={[
                styles.requestCard,
                req.type === 'fuel' ? styles.fuelCard : styles.serviceCard
              ]}
              onPress={() =>
                router.push({
                  pathname:
                    req.type === "fuel"
                      ? "/fuelRequest/moreDetail1"
                      : "/fuelRequest/moreDetail",
                  params: { id: req._id }
                })
              }
            >
              <View style={styles.requestContent}>
                <View style={[
                  styles.requestBadge,
                  req.type === 'fuel' ? styles.fuelBadge : styles.serviceBadge
                ]}>
                  <Text style={styles.badgeText}>
                    {req.type === "service" ? "Service" : "Fuel"}
                  </Text>
                </View>

                {req.type === "fuel" && (
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Ionicons name="ios-car" size={16} color={Colors.WHITE} />
                      <Text style={styles.detailText}>Fuel Type: {req.fuelType}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="location" size={16} color={Colors.WHITE} />
                      <Text style={styles.detailText}>{req.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="ios-speedometer" size={16} color={Colors.WHITE} />
                      <Text style={styles.detailText}>Amount: {req.amount}L</Text>
                    </View>
                  </View>
                )}

                {req.type === "service" && (
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Ionicons name="ios-construct" size={16} color={Colors.WHITE} />
                      <Text style={styles.detailText}>Service: {req.serviceType}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="location" size={16} color={Colors.WHITE} />
                      <Text style={styles.detailText}>{req.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="ios-time" size={16} color={Colors.WHITE} />
                      <Text style={styles.detailText}>
                        Time: {req.preferredTime || 'Flexible'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <Icon name="arrow-right" size={20} color={Colors.WHITE} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="ios-alert-circle-outline" size={50} color={Colors.GRAY} />
            <Text style={styles.emptyText}>No new requests available</Text>
            <Text style={styles.emptySubtext}>Pull down to refresh</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'outfitBold',
    color: Colors.WHITE,
  },
  notificationButton: {
    padding: 5,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'outfitBold',
    color: Colors.DARK,
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 5,
  },
  requestCard: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fuelCard: {
    backgroundColor: '#4A89DC',
    borderLeftWidth: 5,
    borderLeftColor: '#3B6DBD',
  },
  serviceCard: {
    backgroundColor: '#48CFAD',
    borderLeftWidth: 5,
    borderLeftColor: '#37BC9B',
  },
  requestContent: {
    flex: 1,
  },
  requestBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  fuelBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  serviceBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    color: Colors.WHITE,
    fontFamily: 'outfitBold',
    fontSize: 12,
  },
  detailsContainer: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontFamily: 'outfit',
    color: Colors.WHITE,
    marginLeft: 8,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.DARK,
    marginTop: 10,
  },
  emptySubtext: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 5,
  },
});

export default Welcome;