import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, ScrollView } from 'react-native';
import React from 'react';
import Colors from '../../constant/Colors';
import { router } from 'expo-router';

export default function termsCondition() {
  const { width } = useWindowDimensions(); // Get the screen width dynamically

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { paddingHorizontal: width * 0.05 }]}>
        <Text style={styles.heading}>Terms and Condition</Text>
        <Text style={styles.paragraph}>
          To join FixMyRide as a service provider, you must be a legally registered and authorized professional. All
          information you provide, including service descriptions and pricing, must be accurate and honest. You are
          expected to arrive on time and complete the services as scheduled.
        </Text>
        <Text style={styles.paragraph}>
          After receiving payment—whether in cash or by card—you must press the "Paid" button in the app to confirm the
          transaction. Professional behavior is required at all times, and any form of disrespect or misconduct toward
          customers will not be tolerated. You must also respect customer privacy and never misuse or share their
          personal information. Violating any of these rules may result in account suspension or permanent removal from
          the platform.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button1} onPress={() => router.push('/')}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('auth1/registerProvider')}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 100,
    paddingVertical: 25,
    borderRadius: 30,
    backgroundColor: '#CAD6FF',
  },
  heading: {
    fontSize: 24, // Adjusted for responsiveness
    fontFamily: 'outfitBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16, // Adjusted for responsiveness
    fontFamily: 'outfit',
    marginBottom: 10,
    lineHeight: 24,
    textAlign: 'justify',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%', // Ensure buttons take up full width
  },
  button1: {
    paddingVertical: 15,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
    flex: 1, // Make buttons flexible
    alignItems: 'center',
    marginHorizontal: 5, // Add spacing between buttons
  },
  button: {
    paddingVertical: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    flex: 1, // Make buttons flexible
    alignItems: 'center',
    marginHorizontal: 5, // Add spacing between buttons
  },
  declineText: {
    fontFamily: 'outfit',
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
  acceptText: {
    fontFamily: 'outfit',
    fontSize: 18,
    textAlign: 'center',
    color: Colors.WHITE,
  },
});