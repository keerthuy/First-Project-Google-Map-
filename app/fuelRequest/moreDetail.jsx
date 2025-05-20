import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constant/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function moreDetail() {
   const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://10.139.250.162:9001/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
      }
    };

    loadUserData();
  }, []);


  return (
    <View>

      <Text style={styles.title}>Service Request</Text>
      <View>
         <Text style={{marginLeft:60, marginTop:40, fontFamily:"outfit", fontSize:25}}>User Details:</Text>
        {userData ? (
          <>
            <Text style={styles.infoText}>Name: {userData.name}</Text>
            <Text style={styles.infoText}>Email: {userData.email}</Text>
            <Text style={styles.infoText}>Phone: {userData.phone}</Text>
          </>
        ) : (
          <Text style={styles.infoText}>Loading user data...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
      fontFamily: "outfitBold",
      fontSize: 35,
      color: Colors.PRIMARY,
      textAlign: "center",
      marginTop:40,
    },
     sectionTitle: {
    marginLeft: 60,
    marginTop: 40,
    fontFamily: 'outfit',
    fontSize: 25,
  },
  infoText: {
    marginLeft: 60,
    fontFamily: 'outfit',
    fontSize: 18,
    marginTop: 10,
  },
})