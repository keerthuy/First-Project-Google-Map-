import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';



export default function TabLayout() {
  return (
  <Tabs screenOptions = {{
    headerShown:false
  }}>
    <Tabs.Screen name="welcome"
    options={{
      tabBarIcon:({color,size}) => <Ionicons name="home-outline" size={size} color={color} />,
      tabBarLabel : 'Home'
    }}
    />
    <Tabs.Screen name="billMaking"
    options={{
      tabBarIcon:({color,size}) =><Icon name="dollar" size={28} color="#808080"/>,
      tabBarLabel : 'Bill Making'
    }}
    />
    <Tabs.Screen name="paymentList"
    options={{
      tabBarIcon:({color,size}) =><Icon name="list" size={25} color="#808080"/> ,
      tabBarLabel : 'Payment List'
    }}
    />
    <Tabs.Screen name="profileSer"
    options={{
      tabBarIcon:({color,size}) => <Ionicons name="person-circle-outline" size={size} color={color} />,
      tabBarLabel : 'Profile'
    }}
    />
  </Tabs>)}