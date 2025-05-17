import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

export default function ServiceBookingScreen({ navigation }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [otherService, setOtherService] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const services = [
    { id: 1, name: 'Engine Diagnostic Scan', price: 'Rs.2,500' },
    { id: 2, name: 'Tire Replacement', price: 'Rs.2,000' },
    { id: 3, name: 'Car Wash & Cleaning', price: 'Rs.1,000' },
    { id: 4, name: 'Clutch Repair / Replacement', price: 'Rs.3,500+' },
    { id: 5, name: 'Car Painting / Powder Coating', price: 'Rs.5,000' },
    { id: 6, name: 'Wheel Alignment & Balancing', price: 'Rs.1,500' },
  ];

  const toggleServiceSelection = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((serviceId) => serviceId !== id)
        : [...prev, id]
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleBooking = () => {
    console.log('Selected Services:', selectedServices);
    console.log('Other Service:', otherService);
    console.log('Contact Number:', contactNumber);
    console.log('Date & Time:', date);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Service Type (Car)</Text>

        {services.map((service) => {
          let iconName;
          switch (service.id) {
            case 1:
              iconName = 'speedometer';
              break;
            case 2:
              iconName = 'disc';
              break;
            case 3:
              iconName = 'water';
              break;
            case 4:
              iconName = 'build';
              break;
            case 5:
              iconName = 'color-palette';
              break;
            case 6:
              iconName = 'compass';
              break;
            default:
              iconName = 'car';
          }

          return (
            <View key={service.id} style={styles.serviceItem}>
              <Ionicons name={iconName} size={24} color="black" style={styles.serviceIcon} />
              <View style={styles.serviceTextContainer}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </View>
              <Checkbox
                value={selectedServices.includes(service.id)}
                onValueChange={() => toggleServiceSelection(service.id)}
                color={selectedServices.includes(service.id) ? '#007BFF' : undefined}
              />
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>Other Services</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter other services"
          value={otherService}
          onChangeText={setOtherService}
        />

        <Text style={styles.sectionTitle}>Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
          value={contactNumber}
          onChangeText={setContactNumber}
        />

        <Text style={styles.sectionTitle}>Date & Time</Text>
        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={24} color="black" />
          <Text style={styles.dateText}>{date.toLocaleString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity style={styles.bookNowButton} onPress={handleBooking}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: width * 0.05, // 5% of screen width
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: width * 0.045, // responsive font
    fontWeight: 'bold',
    marginVertical: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  serviceIcon: {
    marginRight: 10,
  },
  serviceTextContainer: {
    flex: 1,
    maxWidth: '80%',
  },
  serviceName: {
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  servicePrice: {
    fontSize: width * 0.035,
    color: '#555',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: width * 0.03,
    fontSize: width * 0.04,
    marginBottom: 16,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
  },
  dateText: {
    marginLeft: 10,
    fontSize: width * 0.04,
  },
  bookNowButton: {
    backgroundColor: '#007BFF',
    paddingVertical: width * 0.04,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  bookNowText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});
