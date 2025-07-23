import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constant/Colors';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const ServiceBookingScreen = () => {
  const navigation = useNavigation();
  const [vehicleType, setVehicleType] = useState('');
  const [garageName, setGarageName] = useState('');



  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={width * 0.08} color="#2260FF" />
          </TouchableOpacity>
          <Text style={styles.top}>Make Booking</Text>
        </View>

        {/* Questions */}
        <View style={styles.form}>
          {/* Question 1 */}
          <Text style={styles.label}>Please Select the Vehicle Type</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={vehicleType}
              onValueChange={(itemValue) => setVehicleType(itemValue)}
            >
              <Picker.Item label="Select Vehicle Type" value="" />
              <Picker.Item label="Car" value="car" />
              <Picker.Item label="Bike" value="bike" />
              <Picker.Item label="Three Wheeler" value="Three Wheeler" />
            </Picker>
          </View>

          {/* Question 2 */}
          <Text style={styles.label}>Please Enter the Garage Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Garage Name"
            value={garageName}
            onChangeText={(text) => setGarageName(text)}
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            console.log('Vehicle Type:', vehicleType);
            console.log('Garage Name:', garageName);
  if(vehicleType === 'car'){
    navigation.navigate('ServiceBookingCar');
  } else if(vehicleType === 'bike'){
    navigation.navigate('ServiceBookingBike');
  }else if (vehicleType === 'Three Wheeler'){
    navigation.navigate('ServiceBookingThreeWheeler');
  }
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: width * 0.05, // Dynamic padding based on screen width
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
  form: {
    flex: 1,
  },
  label: {
    fontSize: width * 0.045, // Dynamic font size
    marginBottom: height * 0.01, // Dynamic margin
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: height * 0.02, // Dynamic margin
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: width * 0.03, // Dynamic padding
    marginBottom: height * 0.02, // Dynamic margin
  },
  nextButton: {
    backgroundColor: '#007BFF',
    padding: height * 0.02, // Dynamic padding
    borderRadius: 4,
    alignItems: 'center',
    marginTop: height * 0.03, // Dynamic margin
    marginBottom: height * 0.05, // Dynamic margin

  },
  nextButtonText: {
    color: '#fff',
    fontSize: width * 0.045, // Dynamic font size
    fontWeight: 'bold',
  },
});

export default ServiceBookingScreen;