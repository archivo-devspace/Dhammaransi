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
import DrawerNavigator from './DrawerNavigation';
import StackNavigation from './StackNavigation';

export interface MovieProps {
  id: number;
  image: string;
  name: string;
  desc: string;
}

export type BottomTabParamList = {
  StackNavigation: undefined;
  Movie: {
    item: MovieProps;
  };
  Audios: undefined;
  Pdf: undefined;
  Setting: undefined;
};

export type NavigationMainStackScreenProps = {
  navigation: BottomTabNavigationProp<BottomTabParamList>;
};

const Tab = createBottomTabNavigator();

const BottomTapNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="HomePage" component={StackNavigation} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default BottomTapNavigator;
