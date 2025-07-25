import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import config from '../../constant/config';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const RequestForm = () => {
  const { name, latitude, longitude, placeId } = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [situation, setSituation] = useState('');
  const [location, setLocation] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [image, setImage] = useState(null);

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

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted' || cameraStatus !== 'granted') {
          Alert.alert('Permission denied', 'Camera and photo permissions are required.');
        }
      }
    })();
  }, []);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
      Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  const handleCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera Error:', error);
      Alert.alert('Error', 'Failed to open camera.');
    }
  };

  const handleSubmit = async () => {
    if (!email || !serviceType || !situation || !vehicleBrand || !vehicleModel) {
      Alert.alert('Error', 'Please fill out all fields and attach an image.');
      return;
    }
    const formData = new FormData();
    formData.append('email', email);
    formData.append('serviceType', serviceType);
    formData.append('situation', situation);
    formData.append('location', location);
    formData.append('vehicleBrand', vehicleBrand);
    formData.append('vehicleModel', vehicleModel);
    formData.append('vehicle', vehicle);
    formData.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('Garage', JSON.stringify({
      name,
      latitude,
      longitude,
      placeId,
    }));
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/request/service-List`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (!response.data || response.data.status !== 'ok') {
        Alert.alert('Error', response.data?.data || 'Submit request failed.');
        return;
      }
      Alert.alert('Submit Successful');
      router.push('/(tabs)/welcomeScreen');
    } catch (error) {
      if (error.response) {
        console.error('Server error:', error.response.data);
        Alert.alert('Error', error.response.data.message || 'Submit request failed.');
      } else if (error.request) {
        console.error('Network error:', error.request);
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      } else {
        console.error('Error:', error.message);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#f7faff' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/GoogleMaps/nearbyGarage')}>
            <Ionicons name="chevron-back" size={30} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.top}>🛠️ Requesting Repair</Text>
        </View>

        <Text style={styles.garageName}>{name}</Text>

        <Text style={styles.label}>📍 Delivery Location</Text>
        <TextInput style={styles.input} placeholder="Auto-filled location" value={location} onChangeText={setLocation} />

        <Text style={styles.label}>📧 Email</Text>
        <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={setEmail} />

        <Text style={styles.label}>🔧 Type of Service</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={serviceType} onValueChange={(val) => setServiceType(val)} style={styles.picker}>
            <Picker.Item label="Select Service Type" value="" />
            <Picker.Item label="Towing" value="towing" />
            <Picker.Item label="Flat Tire" value="flat_tire" />
            <Picker.Item label="Battery Jumpstart" value="battery_jumpstart" />
            <Picker.Item label="Low Battery Charge" value="fuel_delivery" />
          </Picker>
        </View>

        <Text style={styles.label}>📝 Describe Situation</Text>
        <TextInput
          style={[styles.input, { height: height * 0.15 }]}
          placeholder="Explain the issue briefly"
          value={situation}
          onChangeText={setSituation}
          multiline
        />

        <Text style={styles.label}>📷 Attach a Picture</Text>
        <View style={styles.photoOptions}>
          <TouchableOpacity style={styles.photoButton} onPress={handleCamera}>
            <Ionicons name="camera" size={24} color="#007BFF" />
            <Text style={styles.photoButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={handleImagePicker}>
            <Ionicons name="image" size={24} color="#007BFF" />
            <Text style={styles.photoButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}

        <Text style={styles.label}>🚗 Vehicle Brand</Text>
        <TextInput style={styles.input} placeholder="Toyota, Nissan, etc." value={vehicleBrand} onChangeText={setVehicleBrand} />

        <Text style={styles.label}>🚘 Vehicle Model</Text>
        <TextInput style={styles.input} placeholder="e.g., Corolla, Leaf" value={vehicleModel} onChangeText={setVehicleModel} />

        <Text style={styles.label}>Vehicle Name</Text>
        <TextInput style={styles.input} placeholder="Custom name or ID" value={vehicle} onChangeText={setVehicle} />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginTop: height * 0.01,
  },
  top: {
    fontSize: width * 0.07,
    fontFamily: 'outfitBold',
    color: Colors.PRIMARY,
    marginLeft: width * 0.03,
  },
  garageName: {
    fontSize: 20,
    fontFamily: 'outfit',
    color: Colors.PRIMARY,
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
    fontFamily: 'outfit',
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: width * 0.03,
    marginBottom: height * 0.02,
    backgroundColor: '#fff',
    fontFamily: 'outfit',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: height * 0.02,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: width * 0.01,
    backgroundColor: '#f9f9f9',
  },
  photoButtonText: {
    marginLeft: width * 0.02,
    color: '#007BFF',
    fontSize: width * 0.04,
    fontFamily: 'outfit',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: height * 0.02,
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontFamily: 'outfitBold',
  },
});

export default RequestForm;
