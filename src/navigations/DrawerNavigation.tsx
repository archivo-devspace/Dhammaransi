import React from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';

import DrawerOneScreen from '../screens/DrawerOneScreen';
import CustomDrawer from '../components/commons/CustomDrawer';
import StackNavigation from './StackNavigation';
// import {theme} from '../theme';
import {AntDesign, FontAwesome} from '../utils/common';
import {useThemeContext} from '../contexts/ThemeContext';
import {Colors} from '../theme';
import SettingScreen from '../screens/SettingScreen';

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
        name="DrawerOne"
        component={DrawerOneScreen}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <AntDesign
              name="appstore-o"
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
      <Drawer.Screen
        name="htet"
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
