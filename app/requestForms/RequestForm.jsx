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
import { router } from 'expo-router';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const RequestForm = () => {
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [situation, setSituation] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [image, setImage] = useState(null);

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
    if (!email || !serviceType || !situation || !vehicleBrand || !vehicleModel || !image) {
      Alert.alert('Error', 'Please fill out all fields and attach an image.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('serviceType', serviceType);
    formData.append('situation', situation);
    formData.append('vehicleBrand', vehicleBrand);
    formData.append('vehicleModel', vehicleModel);
    formData.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const response = await axios.post(
        'http://10.139.250.162:9001/api/request/service-List',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response:', response.data);

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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/GoogleMaps/nearbyGarage')}>
            <Ionicons name="chevron-back" size={30} color="#2260FF" />
          </TouchableOpacity>
          <Text style={styles.top}>Requesting Repair</Text>
        </View>

        {/* Inputs */}
        <Text style={styles.label}>Type your Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

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
          style={[styles.input, { height: height * 0.15 }]}
          value={situation}
          onChangeText={setSituation}
          multiline
        />

        <Text style={styles.label}>Attach a Picture</Text>
        <View style={styles.photoOptions}>
          <TouchableOpacity style={styles.photoButton} onPress={handleCamera}>
            <Ionicons name="camera" size={24} color="#007BFF" />
            <Text style={styles.photoButtonText}>Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={handleImagePicker}>
            <Ionicons name="image" size={24} color="#007BFF" />
            <Text style={styles.photoButtonText}>Add from Photos</Text>
          </TouchableOpacity>
        </View>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}

        <Text style={styles.label}>Vehicle Brand</Text>
        <TextInput style={styles.input} value={vehicleBrand} onChangeText={setVehicleBrand} />

        <Text style={styles.label}>Vehicle Model</Text>
        <TextInput style={styles.input} value={vehicleModel} onChangeText={setVehicleModel} />

        <View style={styles.buttonContainer}>
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
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginTop:height * 0.01,
  },
  top: {
    fontSize: width * 0.08,
    fontFamily: 'outfitBold',
    color: Colors.PRIMARY,
    marginLeft: width * 0.02,
  },
  label: {
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: width * 0.03,
    marginBottom: height * 0.02,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: height * 0.02,
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
    borderRadius: 5,
    flex: 1,
    marginHorizontal: width * 0.01,
  },
  photoButtonText: {
    marginLeft: width * 0.02,
    color: '#007BFF',
    fontSize: width * 0.04,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: height * 0.02,
  },
  buttonContainer: {
    marginTop: height * 0.03,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: height * 0.02,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});

export default RequestForm;
