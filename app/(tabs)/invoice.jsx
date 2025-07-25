import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../../constant/config';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Invoice() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBills = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
          console.warn("No userId found in AsyncStorage");
          return;
        }

        const res = await axios.get(`${config.API_BASE_URL}/api/UserFuelBill/bills/${userId}`);
        setBills(res.data.data);
      } catch (err) {
        console.error("Error fetching bills", err);
      } finally {
        setLoading(false);
      }
    };

    getBills();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/welcomeScreen')}>
          <Ionicons name="chevron-back" size={30} color="#2260FF" />
        </TouchableOpacity>
        <Text style={styles.top}>Invoice</Text>
        <View style={{ width: 20 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: 20 }} />
      ) : bills.length === 0 ? (
        <Text style={styles.noData}>No bills found</Text>
      ) : (
        bills.map((bill, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>⛽ Fuel Type: {bill.request?.fuelType || 'N/A'}</Text>
            <Text style={styles.label}>📍 Fuel Station: {bill.request?.gasStation?.name || 'N/A'}</Text>
            <Text style={styles.label}>👤 User: {bill.user?.name || 'Unknown'}</Text>
            <Text style={styles.amount}>💰 Total: Rs. {bill.total}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5FCFF",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  top: {
    fontSize: 30,
    fontFamily: "outfitBold",
    color: Colors.PRIMARY,
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 30,
    fontFamily: 'outfit',
  },
  card: {
    backgroundColor: "#e0eaff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: 'outfit',
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'outfit',
    marginTop: 5,
  },
});
