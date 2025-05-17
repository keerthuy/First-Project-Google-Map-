import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

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
    <Tabs.Screen name="requestList"
    options={{
      tabBarIcon:({color,size}) => <Ionicons name="list" size={24} color="black" />,
      tabBarLabel : 'Request list'
    }}
    />
    <Tabs.Screen name="invoice"
    options={{
      tabBarIcon:({color,size}) => <FontAwesome5 name="file-invoice-dollar" size={24} color="black" /> ,
      tabBarLabel : 'Invoice'
    }}
    />
    <Tabs.Screen name="profileSer"
    options={{
      tabBarIcon:({color,size}) => <Ionicons name="person-circle-outline" size={size} color={color} />,
      tabBarLabel : 'Profile'
    }}
    />
  </Tabs>)}