import React, {ComponentType, ReactNode} from 'react';
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
import StackNavigation from './StackNavigation';
import {Colors} from '../theme';
import {useThemeContext} from '../contexts/ThemeContext';
import CustomTabBar from '../components/commons/CustomTabBar';
import {FontAwesome, Ionicons, Feather} from '../utils/common';
import {Platform, SafeAreaView, View} from 'react-native';
import MoreScreen from '../screens/MoreScreen';

export interface TabBar {
  route: string;
  label: string;
  component: ComponentType<any>;
  icon: string;
}

const TabArr: TabBar[] = [
  {
    route: 'StackNavigation',
    label: 'Home',
    component: StackNavigation,
    icon: 'search',
  },
  {
    route: 'Search',
    label: 'Search',
    component: SettingScreen,
    icon: 'cog',
  },

  {
    route: 'More',
    label: 'More',
    component: MoreScreen,
    icon: 'ellipsis-h',
  },
  {
    route: 'More3',
    label: 'More3',
    component: MoreScreen,
    icon: 'ellipsis-h',
  },
];

const Tab = createBottomTabNavigator();

const BottomTapNavigator = () => {
  const {theme} = useThemeContext();

  return (
    <SafeAreaView style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            paddingHorizontal: 10,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderColor: Colors[theme]?.secondary_dark,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            backgroundColor: Colors[theme]?.secondary,
          },
        }}>
        {TabArr.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => (
                <CustomTabBar rest={{...props}} item={item} />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default BottomTapNavigator;
