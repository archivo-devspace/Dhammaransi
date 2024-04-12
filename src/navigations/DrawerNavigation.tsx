import React from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';

import DrawerOneScreen from '../screens/DrawerOneScreen';
import CustomDrawer from '../components/commons/CustomDrawer';
import StackNavigation from './StackNavigation';

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
          backgroundColor: '#1a202c',
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20,
        },
        drawerLabelStyle: {
          color: '#eab308',
        },
        drawerActiveBackgroundColor: '#3A3B3C',
      }}>
      <Drawer.Screen
        name="HomePage"
        component={StackNavigation}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="DrawerOne"
        component={DrawerOneScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
