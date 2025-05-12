import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors';
import { router } from 'expo-router';
import axios from 'axios';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const RequestForm = () => {
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [situation, setSituation] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  // const [image, setImage] = useState(null);

  const handleClear = () => {
    setServiceType('');
    setSituation('');
    setVehicleBrand('');
    setVehicleModel('');
    // setImage(null);
  };

  const handleSubmit = async () => {
    console.log({
      email,
      serviceType,
      situation,
      vehicleBrand,
      vehicleModel,
      // image,
    });
    try{
    
  const response = await axios.post("http://10.59.247.162:9001/api/request/service-List", {
        email,
       serviceType,
       situation,
       vehicleBrand,
       vehicleModel,
      //  image,
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/GoogleMaps/nearbyGarage')}>
            <Ionicons name="chevron-back" size={30} color="#2260FF" />
          </TouchableOpacity>
          <Text style={styles.top}>Requesting Repair</Text>
        </View>

        
        <Text style={styles.label}>Type your Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        {/* Input Fields */}
        <Text style={styles.label}>Type of Service Request</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={serviceType}
            onValueChange={(itemValue) => setServiceType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Service Type" value="" />
            <Picker.Item label="Towing" value="towing" />
            <Picker.Item label="Flat Tire" value="flat_tire" />
            <Picker.Item label="Battery Jumpstart" value="battery_jumpstart" />
            <Picker.Item label="Fuel Delivery" value="fuel_delivery" />
          </Picker>
        </View>

        <Text style={styles.label}>Please briefly explain the situation</Text>
        <TextInput
          style={[styles.input, { height: height * 0.15 }]} // Adjust height dynamically
          value={situation}
          onChangeText={setSituation}
          multiline
        />

        {/* <Text style={styles.label}>Attach a Picture</Text>
        <View style={styles.photoOptions}>
          <TouchableOpacity style={styles.photoButton}>
            <Ionicons name="camera" size={24} color="#007BFF" />
            <Text style={styles.photoButtonText}>Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton}>
            <Ionicons name="image" size={24} color="#007BFF" />
            <Text style={styles.photoButtonText}>Add from Photos</Text>
          </TouchableOpacity>
        </View> */}

        <Text style={styles.label}>Vehicle Brand</Text>
        <TextInput
          style={styles.input}
          value={vehicleBrand}
          onChangeText={setVehicleBrand}
        />

        <Text style={styles.label}>Vehicle Model</Text>
        <TextInput
          style={styles.input}
          value={vehicleModel}
          onChangeText={setVehicleModel}
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: height * 0.02, // Dynamic margin
    marginTop: height * 0.01, // Dynamic margin

  },
  top: {
    fontSize: width * 0.08, // Dynamic font size
    fontFamily: 'outfitBold',
    color: Colors.PRIMARY,
    marginLeft: width * 0.02,
  },
  label: {
    fontSize: width * 0.045, // Dynamic font size
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: height * 0.02,
  },
  picker: {
    height: height * 0.06, // Dynamic height
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: width * 0.03, // Dynamic padding
    marginBottom: height * 0.02,
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03, // Dynamic padding
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: width * 0.01, // Dynamic margin
  },
  photoButtonText: {
    marginLeft: width * 0.02,
    color: '#007BFF',
    fontSize: width * 0.04, // Dynamic font size
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.03, // Dynamic margin
  },
  clearButton: {
    backgroundColor: '#f44336',
    padding: height * 0.02, // Dynamic padding
    borderRadius: 5,
    flex: 1,
    marginRight: width * 0.02, // Dynamic margin
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: height * 0.02, // Dynamic padding
    borderRadius: 5,
    flex: 1,
    marginLeft: width * 0.02, // Dynamic margin
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045, // Dynamic font size
  },
});

export default RequestForm;