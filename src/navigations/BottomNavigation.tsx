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
import {Colors} from '../theme';
import {useThemeContext} from '../contexts/ThemeContext';
import CustomTabBar from '../components/commons/CustomTabBar';
import {FontAwesome, Ionicons} from '../utils/common';
import {Platform, View} from 'react-native';

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
  const {theme} = useThemeContext();

  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          // borderTopLeftRadius: 20,
          // borderTopRightRadius: 20,
        },
      }}
      tabBar={props => <CustomTabBar {...props} />}>
      {/* <Tab.Screen name="HomePage" component={StackNavigation} />
      <Tab.Screen name="Setting" component={SettingScreen} /> */}
      <Tab.Screen
        name="HomePage"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <FontAwesome name="home" size={26} color={Colors[theme]?.text} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="settings" size={26} color={Colors[theme]?.text} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTapNavigator;
