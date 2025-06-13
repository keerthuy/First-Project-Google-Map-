import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constant/Colors'
import { router, useLocalSearchParams, usePathname } from 'expo-router'
import { push } from 'expo-router/build/global-state/routing';
import config from '../../constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function MoreDetail() {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/request/fuel-requests`);
        const data = await response.json();
        const found = data.data.find((item) => item._id === id);
        setRequest(found);
      } catch (error) {
        console.error("Failed to load requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [id]);

const handleAccept = async () => {
  try {
    // 1. Accept request in backend
    await fetch(`${config.API_BASE_URL}/api/request/fuel-requests/${request._id}/accept`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accepted" }),
    });

    // 2. Get existing accepted IDs
    const existing = await AsyncStorage.getItem('acceptedRequests');
    let acceptedRequests = existing ? JSON.parse(existing) : [];

    // 3. Add current request if not already added
    if (!acceptedRequests.includes(request._id)) {
      acceptedRequests.push(request._id);
      await AsyncStorage.setItem('acceptedRequests', JSON.stringify(acceptedRequests));


     

    }

    // 4. Navigate to billMaking
    router.push('/(tabs1)/billMaking');

  } catch (error) {
    Alert.alert("Error", "Failed to accept request.");
  }
};

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!request) return <Text style={styles.text}>No details found.</Text>;

  return (
    <View>
    <View style={styles.card}>
      <Text style={{fontSize:28}}>User Details :</Text>
      <Text style={styles.text}> 👤 User Name: {request.user?.name}</Text>
      <Text style={styles.text}> 📞 Phone: {request.user?.mobile}</Text>
      <Text style={styles.text}> ✉️ Email: {request.user?.email}</Text>

    <View style={styles.divider}/>

      <Text style={styles.text}>    Request ID: {request._id.replace(/\D/g, '').slice(-5)}</Text>
    </View>

     <View  style={{ flexDirection:"row", justifyContent:"space-around", marginTop:20}}>
   <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
  <Text style={{padding:20,fontSize:15,fontFamily:'outfit',color:"white"}}>Accept</Text>
</TouchableOpacity>


       <TouchableOpacity style={styles.acceptButton} onPress={() => router.push('/(tabs1)/welcome')}>
    <Text  style={{padding:20,fontSize:15,fontFamily:'outfit', color:"white"}}>Decline</Text>
     </TouchableOpacity>
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#CAD6FF',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop:100
  },
  text: {
    fontSize: 16,
    color: "black",
    marginBottom: 6,
  },
  divider:{
    height:1,
    backgroundColor: "#888",
    marginVertical: 10,
    width: "100%",
    alignSelf: "center",
    borderRadius: 1,
  },
  acceptButton:{
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    borderRadius: 20,
  }
});