import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainStackParamList} from './StackNavigation';
import MoreScreen from '../screens/MoreScreen';
import BiographyScreen from '../screens/BiographyScreen';
import TimetableScreen from '../screens/TimetableScreen';
import ContactScreen from '../screens/ContactScreen';
import MissionaryScreen from '../screens/MissionaryScreen';

const MoreStackNavigation = () => {
  const Stack = createNativeStackNavigator<MainStackParamList>();
  return (
    <Stack.Navigator
      initialRouteName="More"
      screenOptions={{headerShown: false, animation: 'fade_from_bottom'}}>
      <Stack.Screen name="More" component={MoreScreen} />
      <Stack.Screen name="Biography" component={BiographyScreen} />
      <Stack.Screen name="Timetable" component={TimetableScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Missionary" component={MissionaryScreen} />
    </Stack.Navigator>
  );
};

export default MoreStackNavigation;

const styles = StyleSheet.create({});
