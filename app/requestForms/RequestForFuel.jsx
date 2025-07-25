import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import Colors from '../../constant/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as Location from 'expo-location';
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const RequestFuelScreen = () => {
  const { name, latitude, longitude, placeId } = useLocalSearchParams();

  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    getCurrentLocation();
    getEmailFromStorage();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to auto-fill your address.');
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const formattedAddress = `${address.name || ''}, ${address.city || address.region || ''}`;
        setLocation(formattedAddress);
      } else {
        setLocation(`${latitude}, ${longitude}`);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get current location.');
    }
  };

  const getEmailFromStorage = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    if (userEmail) setEmail(userEmail);
  };

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!/^\d+$/.test(amount)) {
      Alert.alert("Invalid Amount", "Full Amount must be an integer value.");
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/request/fuel-List`, {
        email,
        location,
        fuelType,
        amount,
        gasStation: {
          name,
          latitude,
          longitude,
          placeId,
        },
      });

      if (!response.data || response.data.status !== "ok") {
        Alert.alert("Error", response.data?.data || "Submit request failed.");
        return;
      }

      Alert.alert("Success", "Fuel request submitted successfully.");
      router.push("/(tabs)/welcomeScreen");
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        Alert.alert("Error", error.response.data.message || "Submission failed.");
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={width * 0.08} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.top}>Fuel Request</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.gasName}>{name}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Delivery Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>⛽Select Fuel Type</Text>
          <View style={styles.fuelTypeRow}>
            {['Petrol', 'Diesel'].map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.fuelButton, fuelType === type && styles.selectedFuel]}
                onPress={() => setFuelType(type)}
              >
                <Text style={[styles.fuelButtonText, fuelType === type && styles.selectedFuelText]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>💧 Amount (Litres)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount in litres"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f7ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.045,
    paddingBottom: height * 0.01,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between',
  },
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: 50,
  },
  top: {
    fontSize: 26,
    fontFamily: 'outfitBold',
    color: Colors.PRIMARY,
  },
  gasName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 10,
    fontFamily: 'outfit',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontFamily: 'outfit',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontFamily: 'outfit',
    backgroundColor: '#fefefe',
  },
  fuelTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fuelButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedFuel: {
    backgroundColor: Colors.PRIMARY,
  },
  fuelButtonText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'outfit',
  },
  selectedFuelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'outfitBold',
  },
});

export default RequestFuelScreen;
