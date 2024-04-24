// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import HomeScreen from '../screens/HomeScreen';
// import SettingScreen from '../screens/SettingScreen';
// import StackNavigation from './StackNavigation';

// const Tab = createBottomTabNavigator();

// const BottomNavigation = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Settings" component={SettingScreen} />
//     </Tab.Navigator>
//   );
// };

// export default BottomNavigation;

// const styles = StyleSheet.create({});

// StackNavigator.tsx
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import MovieScreen from '../screens/MovieScreen';
import Audios from '../screens/Audios';
import Pdf from '../screens/Pdf';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import SettingScreen from '../screens/SettingScreen';

// import { RootStackParamList } from './AppNavigation';

export interface MovieProps {
  id: number;
  image: string;
  name: string;
  desc: string;
}

export type MainStackParamList = {
  Home: undefined;
  Movie: {
    item: MovieProps;
  };
  Audios: undefined;
  Pdf: undefined;
  Setting: undefined;
};

export type NavigationMainStackScreenProps = {
  navigation: BottomTabNavigationProp<MainStackParamList>;
};

const Tab = createBottomTabNavigator<MainStackParamList>();

const StackNavigation = () => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default StackNavigation;
