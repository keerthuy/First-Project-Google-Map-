import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native';
import Colors from '../../constant/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const RequestFuelScreen =  () => {
  const [location, setLocation] = useState('');
  const [email,setEmail] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async () => {
    try{
    
  const response = await axios.post("http://10.59.247.162:9001/api/request/fuel-List", {
       email,
       location,
       fuelType,
       amount,
      });

      console.log("Register response:", response.data);

      if (!response.data || response.data.status !== "ok") {
        Alert.alert("Error", response.data?.data || "Submit request failed.");
        return;
      }

    // try {
    //     await AsyncStorage.setItem("username", response.data.username);
    //     await AsyncStorage.setItem("role", response.data.role);
    //     await AsyncStorage.setItem("token", response.data.data);
    //   } catch (storageError) {
    //     console.error("AsyncStorage error:", storageError);
    //     Alert.alert("Error", "Failed to submit data. Please try again.");
    //     return;
    //   }

      Alert.alert("submit successful");
      router.push("/(tabs)/welcomeScreen");
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        Alert.alert("Error", error.response.data.message || "Registration failed.");
      } else if (error.request) {
        console.error("Network error:", error.request);
        Alert.alert("Error", "Network error. Please check your connection and try again.");
      } else {
        console.error("Error:", error.message);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Back Button and Title */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/GoogleMaps/nearbyGas')}>
            <Ionicons name="chevron-back" size={width * 0.08} color="#2260FF" />
          </TouchableOpacity>
          <Text style={styles.top}>Requesting Fuel</Text>
        </View>

        {/* Delivery Location */}
        <Text style={styles.label}>Delivery Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your location"
          value={location}
          onChangeText={setLocation}
        />
          <Text style={styles.label}>Delivery Location</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
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

        {/* Full Amount */}
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
    padding: width * 0.05, // Dynamic padding based on screen width
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width * 0.01, // Dynamic margin
    marginBottom: height * 0.02, // Dynamic margin
    marginTop: height * 0.01, // Dynamic margin
    marginLeft: width * 0.05, // Dynamic margin
  },
  top: {
    fontSize: width * 0.08, // Dynamic font size
    fontFamily: 'outfitBold',
    color: Colors.PRIMARY,
    marginLeft: width * 0.02,
  },
  label: {
    fontSize: width * 0.045, // Dynamic font size
    marginVertical: height * 0.01, // Dynamic margin
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: width * 0.03, // Dynamic padding
    marginBottom: height * 0.02, // Dynamic margin
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: height * 0.02, // Dynamic margin
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width * 0.05, // Dynamic margin
  },
  radioCircle: {
    width: width * 0.05, // Dynamic size
    height: width * 0.05, // Dynamic size
    borderRadius: (width * 0.05) / 2, // Make it circular
    borderWidth: 1,
    borderColor: '#007BFF',
    marginRight: width * 0.02, // Dynamic margin
  },
  radioSelected: {
    backgroundColor: '#007BFF',
  },
  radioText: {
    fontSize: width * 0.045, // Dynamic font size
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: height * 0.02, // Dynamic padding
    borderRadius: 5,
    alignItems: 'center',
    marginTop: height * 0.03, // Dynamic margin
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width * 0.045, // Dynamic font size
    fontWeight: 'bold',
  },
});

export default RequestFuelScreen;