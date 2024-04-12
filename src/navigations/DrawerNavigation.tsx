import React from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';

import DrawerOneScreen from '../screens/DrawerOneScreen';
import CustomDrawer from '../components/commons/CustomDrawer';
import StackNavigation from './StackNavigation';
import {theme} from '../theme';
import {AntDesign, FontAwesome} from '../utils/common';

export type DrawerParamList = {
  StackNavigation: undefined;
  DrawerOne: undefined;
};

export type NavigationDrawerScreenProps = {
  navigation: DrawerNavigationProp<DrawerParamList>;
};

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      initialRouteName="HomePage"
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.white,
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20,
        },

        drawerLabelStyle: {
          color: theme.secondary_light,
          fontSize: 16,
        },
        drawerActiveBackgroundColor: theme.white,
      }}>
      <Drawer.Screen
        name="HomePage"
        component={StackNavigation}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <FontAwesome name="home" size={26} color={theme.primary} />
          ),
        }}
      />
      <Drawer.Screen
        name="DrawerOne"
        component={DrawerOneScreen}
        options={{
          headerShown: false,
          drawerIcon: () => (
            <AntDesign name="appstore-o" size={26} color={theme.primary} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
