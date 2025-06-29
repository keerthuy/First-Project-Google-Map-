import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';
import Colors from '../../constant/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as Location from 'expo-location';
import config from '../../constant/config';

const { width, height } = Dimensions.get('window');

const RequestFuelScreen = () => {
  const { name, latitude, longitude, placeId } = useLocalSearchParams();

  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    getCurrentLocation();
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

      console.log("Submit response:", response.data);

      if (!response.data || response.data.status !== "ok") {
        Alert.alert("Error", response.data?.data || "Submit request failed.");
        return;
      }

      Alert.alert("Request submitted successfully");
      router.push("/(tabs)/welcomeScreen");
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        Alert.alert("Error", error.response.data.message || "Submission failed.");
      } else if (error.request) {
        console.error("Network error:", error.request);
        Alert.alert("Error", "Check your internet connection.");
      } else {
        console.error("Error:", error.message);
        Alert.alert("Error", "Something went wrong.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/GoogleMaps/nearbyGas')}>
            <Ionicons name="chevron-back" size={width * 0.08} color="#2260FF" />
          </TouchableOpacity>
          <Text style={styles.top}>Requesting Fuel</Text>
        </View>

        {/* Gas Station Name */}
        <View>
          <Text style={{ fontFamily: 'outfit', fontSize: 22, marginBottom: 10 }}>{name}</Text>
        </View>

        {/* Location Field */}
        <Text style={styles.label}>Delivery Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your location"
          value={location}
          onChangeText={setLocation}
        />

        {/* Email */}
        <Text style={styles.label}>Enter the Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Fuel Type */}
        <Text style={styles.label}>Fuel Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setFuelType('Petrol')}
          >
            <View style={[styles.radioCircle, fuelType === 'Petrol' && styles.radioSelected]} />
            <Text style={styles.radioText}>Petrol</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setFuelType('Diesel')}
          >
            <View style={[styles.radioCircle, fuelType === 'Diesel' && styles.radioSelected]} />
            <Text style={styles.radioText}>Diesel</Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <Text style={styles.label}>Full Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginTop: height * 0.01,
  },
  top: {
    fontSize: width * 0.08,
    fontFamily: 'outfitBold',
    color: Colors.PRIMARY,
    marginLeft: width * 0.02,
  },
  label: {
    fontSize: width * 0.045,
    marginVertical: height * 0.01,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: width * 0.03,
    marginBottom: height * 0.02,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width * 0.05,
  },
  radioCircle: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: (width * 0.05) / 2,
    borderWidth: 1,
    borderColor: '#007BFF',
    marginRight: width * 0.02,
  },
  radioSelected: {
    backgroundColor: '#007BFF',
  },
  radioText: {
    fontSize: width * 0.045,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: height * 0.02,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default RequestFuelScreen;
