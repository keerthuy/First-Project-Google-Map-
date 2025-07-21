import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../constant/Colors';

export default function MakeBillScreen() {
  const [items, setItems] = useState([
    { name: '', cost: '' },
    { name: '', cost: '' },
    { name: '', cost: '' },
  ]);
  const [serviceCharge, setServiceCharge] = useState('');
  const [otherCharge, setOtherCharge] = useState('');

  // Function to handle changes in item fields
 const handleChange = (index, field, value) => {
  const newItems = [...items];
  newItems[index][field] = value;
  setItems(newItems);
};

  // Calculate the total cost
  const total =
    items.reduce((sum, item) => sum + Number(item.cost || 0), 0) +
    Number(serviceCharge || 0) +
    Number(otherCharge || 0);

  const handleSubmit = async () => {
     try {
        const response = await axios.post(`${config.API_BASE_URL}/api/request/bills`, {
          //  items.name,
          //   items.cost,
            serviceCharge,
            otherCharge,
            total,

          },
      );
  
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
    <ScrollView style={styles.container}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Make Bill</Text>
      </View>

      
      <Text style={styles.subHeader}>Items</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={item.name}
            onChangeText={(text) => handleChange(index, 'name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Cost"
            keyboardType="numeric"
            value={item.cost}
            onChangeText={(text) => handleChange(index, 'cost', text)}
          />
        </View>
      ))}

      
      <Text style={styles.subHeader}>Service Charge</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Cost"
        keyboardType="numeric"
        value={serviceCharge}
        onChangeText={setServiceCharge}
      />

      
      <Text style={styles.subHeader}>Other Charge</Text>
      <TextInput
        style={styles.inputFull}
        placeholder="Cost"
        keyboardType="numeric"
        value={otherCharge}
        onChangeText={setOtherCharge}
      />

      
      <Text style={styles.total}>Total: Rs. {total}</Text>

      
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert('Bill sent!')}
      >
        <Text style={styles.buttonText}>Send Bill</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles for the MakeBillScreen component
const styles = StyleSheet.create({
  container: { padding: 20 },
  headerContainer: {
    backgroundColor: Colors.PRIMARY, // Purple background
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
     marginTop:20,
   
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white', // White text color
     fontFamily: 'outfitBold', // Bold font for header	
  },
  subHeader: { fontSize: 16, marginTop: 20, marginBottom: 5, fontFamily: 'outfit' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  input: { flex: 0.48, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 },
  inputFull: { width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 20, fontFamily: 'outfit' },
  button: {
    backgroundColor: '#f2c200', // Yellow background
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  

  },
  buttonText: {
    color: 'white', // White text color
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'outfit', // Bold font for header	
  },
});  
