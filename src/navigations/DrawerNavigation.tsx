import React from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';

import DrawerOneScreen from '../screens/DrawerOneScreen';
import CustomDrawer from '../components/commons/CustomDrawer';
import StackNavigation from './StackNavigation';
// import {theme} from '../theme';
import {AntDesign, FontAwesome, Ionicons} from '../utils/common';
import {useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import SettingScreen from '../screens/SettingScreen';
import Biography from '../screens/Biography';

export type DrawerParamList = {
  StackNavigation: undefined;
  DrawerOne: undefined;
  Setting: undefined;
};

export type NavigationDrawerScreenProps = {
  navigation: DrawerNavigationProp<DrawerParamList>;
};

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const {theme} = useThemeContext();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      initialRouteName="HomePage"
      screenOptions={{
        drawerStyle: {
          backgroundColor: Colors[theme]?.text,
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20,
        },

        drawerLabelStyle: {
          color: Colors[theme]?.text,
          fontSize: 16,
        },
        drawerActiveBackgroundColor: Colors[theme]?.secondary,
      }}>
      <Drawer.Screen
        name="HomePage"
        component={StackNavigation}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <FontAwesome name="home" size={26} color={Colors[theme]?.primary} />
          ),
        }}
      />
      <Drawer.Screen
        name="Biography"
        component={Biography}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Ionicons
              name="person-circle-outline"
              size={26}
              color={Colors[theme]?.primary}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Timetable"
        component={DrawerOneScreen}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Ionicons
              name="calendar"
              size={26}
              color={Colors[theme]?.primary}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Books"
        component={DrawerOneScreen}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <FontAwesome name="book" size={26} color={Colors[theme]?.primary} />
          ),
        }}
      />
      <Drawer.Screen
        name="Audios"
        component={DrawerOneScreen}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Ionicons
              name="musical-notes-outline"
              size={26}
              color={Colors[theme]?.primary}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="သာသနာပြုလုပ်ငန်းစဉ်များ"
        component={DrawerOneScreen}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <Ionicons
              name="musical-notes-outline"
              size={26}
              color={Colors[theme]?.primary}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Paintings"
        component={SettingScreen}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <AntDesign
              name="picture"
              size={26}
              color={Colors[theme]?.primary}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <AntDesign
              name="setting"
              size={26}
              color={Colors[theme]?.primary}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
