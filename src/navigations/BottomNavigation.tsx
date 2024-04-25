import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import MovieScreen from '../screens/MovieScreen';
import Audios from '../screens/AudioListScreen';
import Pdf from '../screens/PdfListScreen';
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
import {FontAwesome, Ionicons, Feather} from '../utils/common';
import {Platform, View} from 'react-native';
import MoreScreen from '../screens/MoreScreen';

const Tab = createBottomTabNavigator();

const BottomTapNavigator = () => {
  const {theme} = useThemeContext();

  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="HomePage"
        component={StackNavigation}
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
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          // headerShown: true,
          tabBarIcon: () => (
            <Feather
              name="more-horizontal"
              size={26}
              color={Colors[theme]?.text}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTapNavigator;
