import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../constant/config';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constant/Colors';
import { router } from 'expo-router';


export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {

      // ✅ Get email directly
      const userEmail = await AsyncStorage.getItem('email');

      if (!userEmail) {
        console.warn("No user email found in AsyncStorage.");
        return;
      }

      const response = await fetch(`${config.API_BASE_URL}/api/notifications/${userEmail}`);
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    
    <View style={styles.card}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <View>

      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.push('/(tabs)/welcomeScreen')}>
    <Ionicons name="chevron-back" size={30} color="#2260FF" />
  </TouchableOpacity>
  <Text style={styles.top}>Notification</Text>
  <View style={{ width: 30 }} /> {/* Spacer to balance the back icon */}
</View>

    <FlatList
      data={notifications}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<Text style={styles.noNotif}>No notifications yet.</Text>}
    />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#DCE6FF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    marginTop:20,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },
  noNotif: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#555',
    
  },
  top:{
      fontSize:30,
      fontFamily:"outfitBold",
      color:Colors.PRIMARY,
    },
    header: {
      flexDirection: "row",
      alignItems: "center", // Align items vertically in the center
      justifyContent: "space-between", // Space between the arrow and title
      paddingHorizontal: 20, // Add some horizontal padding
      marginBottom: 5, // Optional: Add spacing below the header
      marginTop:10,
      marginRight:10,
      marginTop:35,
    },
});
