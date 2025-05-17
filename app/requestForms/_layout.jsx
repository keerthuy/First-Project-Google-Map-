import {createStackNavigator} from '@react-navigation/stack';
import ServiceBooking from './ServiceBooking';
import ServiceBookingBike from './ServiceBookingBike';
import ServiceBookingCar from './ServiceBookingCar';
import ServiceBookingThreeWheeler from './ServiceBookingThreeWheeler';
import { Stack } from "expo-router"; // Use the Expo Router Stack component


const stack = createStackNavigator();

const AppNavigator =() =>{
    return(
        <Stack screenOptions={{headerShown:false}}>
        <stack.Navigator>
            <stack.Screen name="ServiceBooking" component={ServiceBooking}/>
            <stack.Screen name="ServiceBookingBike" component={ServiceBookingBike}/>
            <stack.Screen name="ServiceBookingCar" component={ServiceBookingCar}/>
            <stack.Screen name="ServiceBookingThreeWheeler"  component={ServiceBookingThreeWheeler}/>
       </stack.Navigator>
       </Stack>
    );
};

export default AppNavigator;