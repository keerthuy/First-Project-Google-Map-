import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constant/Colors';

export default function welcome() {
  return (
    <View style={styles.container}>
     <View style={styles.header}>
        <Text style={styles.top}>FixMyRide</Text>
        <Ionicons name="notifications-outline" size={28} color="white" style={styles.notificationIcon} />
      </View>
     <View>
      <Text style ={{fontSize:30,marginTop:20, fontFamily:"outfit", marginLeft:10}}>
        Recent Requests
      </Text>
     </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
      },
      header: {
           flexDirection: "row",
           justifyContent: "space-between",
           alignItems: "center",
           backgroundColor: Colors.PRIMARY,
           paddingHorizontal: 10,
           paddingVertical: 30,
           position: "relative",
         },
         top: {
           fontSize: 30,
           fontFamily: "outfit",
           color: Colors.WHITE,
           position: "absolute",
           left: "50%",
           transform: [{ translateX: -50 }],
           marginTop: 20,
         },
          notificationIcon: {
      marginLeft: 20,
      marginTop: 20,},
})