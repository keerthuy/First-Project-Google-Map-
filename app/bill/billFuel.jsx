import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Colors from '../../constant/Colors';
import axios from 'axios';
import config from '../../constant/config';
import { useLocalSearchParams } from 'expo-router';

export default function MakeBillScreen() {
  const { id: requestId } = useLocalSearchParams(); // ✅ Move here, at top level of component

  const [petrolPrice, setPetrolPrice] = useState('');
  const [petrolAmount, setPetrolAmount] = useState('');
  const [diselPrice, setDiselPrice] = useState('');
  const [diselAmount, setDiselAmount] = useState('');

  const total = (
    (Number(petrolPrice) || 0) * (Number(petrolAmount) || 0) +
    (Number(diselPrice) || 0) * (Number(diselAmount) || 0)
  ).toFixed(2);

  const handleSubmit = async () => {
    if (!requestId) {
      Alert.alert("Error", "Request ID is missing.");
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/fuelBill/billFuel`, {
        requestId,
        total,
      });

      console.log("Submit response:", response.data);

      if (!response.data || response.data.status !== "ok") {
        Alert.alert("Error", response.data?.data || "Submit request failed.");
        return;
      }

      Alert.alert("Success", "Bill sent to customer successfully!");
      // Navigate if needed
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
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Make Bill</Text>
      </View>

      <Text style={styles.subHeader}>Petrol Price (per liter)</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Enter fuel price per liter"
        keyboardType="numeric"
        value={petrolPrice}
        onChangeText={setPetrolPrice}
      />

      <Text style={styles.subHeader}>Petrol Amount (liters)</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Enter fuel amount (liters)"
        keyboardType="numeric"
        value={petrolAmount}
        onChangeText={setPetrolAmount}
      />
      <Text style={styles.subHeader}>Disel Price (per liter)</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Enter fuel price per liter"
        keyboardType="numeric"
        value={diselPrice}
        onChangeText={setDiselPrice}
      />

      <Text style={styles.subHeader}>Disel Amount (liters)</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Enter fuel amount (liters)"
        keyboardType="numeric"
        value={diselAmount}
        onChangeText={setDiselAmount}
      />

      <Text style={styles.total}>Total: Rs. {total}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Send Bill</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerContainer: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'outfitBold',
  },
  subHeader: { fontSize: 16, marginTop: 20, marginBottom: 5, fontFamily: 'outfit' },
  inputFull: { width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 20, fontFamily: 'outfit' },
  button: {
    backgroundColor: '#f2c200',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'outfit',
  },
});