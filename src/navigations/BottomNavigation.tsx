import React, {ComponentType} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingScreen from '../screens/SettingScreen';
import StackNavigation from './StackNavigation';
import {Colors} from '../theme';
import {useThemeContext} from '../contexts/ThemeContext';
import CustomTabBar from '../components/commons/CustomTabBar';
import {SafeAreaView} from 'react-native';
import MoreStackNavigation from './MoreStackNavigation';
import TrackScreen from '../screens/TrackScreen';

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
    icon: 'home',
  },
  {
    route: 'Track',
    label: 'Track',
    component: TrackScreen,
    icon: 'play-circle',
  },
  {
    route: 'MoreStack',
    label: 'More',
    component: MoreStackNavigation,
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
            height: 65,
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
