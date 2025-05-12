import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import Colors from '../../constant/Colors'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function userSelection() {
  return (
    <View style={styles.container}> 
        <View >
               <Image
                source={require('./../../assets/images/logo.jpeg')}
                style={{
                width:100,
                height:100,
                borderRadius:20,
                alignItems:'center',
                justifyContent:'center',
                marginLeft:125,
               } }/>

          <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("auth1/register")}
            >
              <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
                 Customer
              </Text>
              <AntDesign  style={styles.arrowIcon}  name="arrowright" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("auth1/termsCondition")}
            >
              <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
                 Service Provider
              </Text>
              <AntDesign  style={styles.arrowIcon}  name="arrowright" size={24} color="white" />
        </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
     container:{
      display:'flex',
      alignItem:'center',
      marginTop:100,
      padding:25, 
      flex:1,
     },
     button: {
        padding: 17,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        marginTop: 20,
      },
      buttonText: {
        textAlign: "center",
        fontSize: 18,
        fontFamily: "outfit",
    },
    arrowIcon:{
        position: "absolute",
        right: 50, // Adjust this value to move the icon closer or farther from the right edge
        top: "125%", // Vertically center the icon
        transform: [{ translateY: -12 }], // Adjust for the icon's height (half of its si
    }
})