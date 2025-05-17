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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ServiceBookingScreen({ navigation }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [otherService, setOtherService] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const services = [
    { id: 1, name: 'Engine Diagnostic Scan', price: 'Rs.2,500' },
    { id: 2, name: 'Tire Replacement', price: 'Rs.2,000' },
    { id: 3, name: 'Three Wheeler Wash & Cleaning', price: 'Rs.1,000' },
    { id: 4, name: 'Clutch Repair / Replacement', price: 'Rs.3,500+' },
    { id: 5, name: 'Three Wheeler Painting / Powder Coating', price: 'Rs.5,000' },
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
        <Text style={styles.sectionTitle}>Service Type (Three Wheeler)</Text>
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
              iconName = 'bicycle';
          }

          return (
            <View key={service.id} style={styles.serviceItem}>
              <Ionicons
                name={iconName}
                size={SCREEN_WIDTH * 0.06}  // scaled icon size
                color="black"
                style={styles.serviceIcon}
              />
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
          <Ionicons
            name="calendar"
            size={SCREEN_WIDTH * 0.06} // scaled icon size
            color="black"
          />
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
    paddingHorizontal: SCREEN_WIDTH * 0.05, // 5% horizontal padding
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: SCREEN_WIDTH * 0.045, // responsive font size
    fontWeight: 'bold',
    marginVertical: 12,
    marginTop: 40,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  serviceIcon: {
    marginRight: 12,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
  },
  servicePrice: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: SCREEN_WIDTH * 0.04,
    marginVertical: 12,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 12,
  },
  dateText: {
    marginLeft: 12,
    fontSize: SCREEN_WIDTH * 0.04,
  },
  bookNowButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  bookNowText: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
  },
});
